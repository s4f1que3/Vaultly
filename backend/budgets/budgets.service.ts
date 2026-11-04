import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { supabaseService } from '../supabase/supabase.service';
import { CategoriesService } from '../categories/categories.service';
import { ToHttpException } from '@/exceptions/exception.service';

@Injectable()
export class BudgetsService {
    constructor(
      private readonly supabase: supabaseService,
      private readonly categories: CategoriesService,
    ) {}

    private currentMonth() {
      return new Date().getMonth() + 1
    }

    private currentYear () {
      return new Date().getFullYear()
    }

    // Budgets store the category UUID; 'none' has no UUID, so it can't have a budget
    private async resolveBudgetCategory(userId: string, slug: string): Promise<string> {
      const categoryId = await this.categories.resolveId(userId, slug)
      if (!categoryId) throw new BadRequestException('A budget needs a real category')
      return categoryId
    }


    async findAll(userId: string) {
      const month = await this.currentMonth()
      const year = await this.currentYear()

      const { data, error } = await this.supabase.db
        .from('Budgets')
        .select('*')
        .eq('user_id', userId)
        .eq('month', month)
        .eq('year', year)
        .order('created_at');

      if (error) throw ToHttpException(error)

      // Transactions match budgets by category UUID, so expose the slug separately for the UI
      return Promise.all(
        (data ?? []).map(async (b) => ({
          ...b,
          category: await this.categories.resolveSlug(userId, b.category_id as string),
          period: 'monthly',
        })),
      )

    }

    async create(user_id: string, name: string | undefined, limit: number, icon: string, category: string, alert_threshold?: number) {
      const month = await this.currentMonth()
      const year = await this.currentYear()
      const category_id = await this.resolveBudgetCategory(user_id, category)

      const {error} = await this.supabase.db
      .from('Budgets')
      .insert({
        name: name,
        limit_amount: limit,
        month: month,
        year: year,
        category_id: category_id,
        user_id: user_id,
        icon: icon,
        alert_threshold: alert_threshold
      })
      .select()
      .single()

      if(error) throw ToHttpException(error)
    }


    async update(user_id: string, id: string, opts: {name?: string, limit?: number, icon?: string, category?: string, alert_threshold?: number}) {
      const category_id = opts.category ? await this.resolveBudgetCategory(user_id, opts.category) : undefined

      const updates = {
        name: opts.name,
        limit_amount: opts.limit,
        icon: opts.icon,
        category_id: category_id,
        alert_threshold: opts.alert_threshold
      }

      const {error} = await this.supabase.db
      .from('Budgets')
      .update(updates)
      .eq('user_id', user_id)
      .eq('id', id)
      .select()
      .single()

      if(error) throw ToHttpException(error)

    }

    async delete(userId: string, id: string) {
      const { error } = await this.supabase.db
      .from('Budgets')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

      if (error) throw ToHttpException(error);
    }






    

    // ── Budget history (past months) ──────────────────────────────────────────

    async getHistory(userId: string, months = 6) {
      await this.categories.ensureDefaults(userId);

      const { data, error } = await this.supabase.db
        .from('Budgets')
        .select('*')
        .eq('user_id', userId)
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (error) throw new BadRequestException(error.message);

      // Group by month/year and attach category slugs
      const grouped = new Map<string, { month: number; year: number; budgets: object[] }>();
      for (const b of data ?? []) {
        const key = `${b.year}-${String(b.month).padStart(2, '0')}`;
        if (!grouped.has(key)) grouped.set(key, { month: b.month, year: b.year, budgets: [] });
        const slug = await this.categories.resolveSlug(userId, b.category_id as string);
        grouped.get(key)!.budgets.push({
          ...b,
          category: slug,
          period: 'monthly',
          utilizationPct: b.limit_amount > 0
            ? Math.round((b.spent_amount / b.limit_amount) * 100)
            : 0,
        });
      }

      return {
        data: [...grouped.values()].slice(0, months),
      };
    }

    async toggleRollover(userId: string, id: string, enabled: boolean) {
      const { data: existing } = await this.supabase.db
        .from('Budgets').select('id').eq('id', id).eq('user_id', userId).single();
      if (!existing) throw new NotFoundException('Budget not found');

      const { data, error } = await this.supabase.db
        .from('Budgets').update({ rollover_enabled: enabled }).eq('id', id).eq('user_id', userId).select().single();
      if (error) throw new BadRequestException(error.message);
      return data;
    }

    // ── Monthly rollover ──────────────────────────────────────────────────────
    // Runs at midnight on the 1st of every month.
    // Copies last month's budget limits into new rows; carries unspent amounts if rollover_enabled.

    @Cron('0 0 1 * *')
    async rolloverAllUsers() {
      const now = new Date();
      const curMonth = now.getMonth() + 1;
      const curYear = now.getFullYear();
      const prevMonth = curMonth === 1 ? 12 : curMonth - 1;
      const prevYear = curMonth === 1 ? curYear - 1 : curYear;

      const { data: lastMonth } = await this.supabase.db
        .from('Budgets')
        .select('*')
        .eq('month', prevMonth)
        .eq('year', prevYear);

      if (!lastMonth?.length) return;

      for (const budget of lastMonth) {
        const { data: exists } = await this.supabase.db
          .from('Budgets')
          .select('id')
          .eq('user_id', budget.user_id)
          .eq('category_id', budget.category_id)
          .eq('month', curMonth)
          .eq('year', curYear)
          .single();

        if (!exists) {
          const unspent = Math.max(0, (budget.limit_amount ?? 0) - (budget.spent_amount ?? 0));
          const rollover_amount = budget.rollover_enabled ? unspent : 0;
          await this.supabase.db.from('Budgets').insert({
            user_id: budget.user_id,
            category_id: budget.category_id,
            limit_amount: budget.limit_amount,
            alert_threshold: budget.alert_threshold,
            rollover_enabled: budget.rollover_enabled ?? false,
            rollover_amount,
            month: curMonth,
            year: curYear,
            spent_amount: 0,
          });
        }
      }
    }

    // Manual trigger — useful for testing or first-time setup mid-month
    async rolloverForUser(userId: string) {
      const now = new Date();
      const curMonth = now.getMonth() + 1;
      const curYear = now.getFullYear();
      const prevMonth = curMonth === 1 ? 12 : curMonth - 1;
      const prevYear = curMonth === 1 ? curYear - 1 : curYear;

      const { data: lastMonth } = await this.supabase.db
        .from('Budgets')
        .select('*')
        .eq('user_id', userId)
        .eq('month', prevMonth)
        .eq('year', prevYear);

      if (!lastMonth?.length) return { created: 0, message: 'No budgets found from last month' };

      let created = 0;
      for (const budget of lastMonth) {
        const { data: exists } = await this.supabase.db
          .from('Budgets')
          .select('id')
          .eq('user_id', userId)
          .eq('category_id', budget.category_id)
          .eq('month', curMonth)
          .eq('year', curYear)
          .single();

        if (!exists) {
          const unspent = Math.max(0, (budget.limit_amount ?? 0) - (budget.spent_amount ?? 0));
          const rollover_amount = budget.rollover_enabled ? unspent : 0;
          await this.supabase.db.from('Budgets').insert({
            user_id: userId,
            category_id: budget.category_id,
            limit_amount: budget.limit_amount,
            alert_threshold: budget.alert_threshold,
            rollover_enabled: budget.rollover_enabled ?? false,
            rollover_amount,
            month: curMonth,
            year: curYear,
            spent_amount: 0,
          });
          created++;
        }
      }

      return { created, message: `Rolled over ${created} budget(s) from last month` };
    }
}
