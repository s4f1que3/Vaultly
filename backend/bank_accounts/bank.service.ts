import { Injectable, NotFoundException } from "@nestjs/common";
import { supabaseService } from "../supabase/supabase.service";
import { ToHttpException } from "../exceptions/exception.service";

@Injectable()
export class BankAccountsService {
    constructor(private readonly supabase: supabaseService) {}

    async getAll(userId: string) {
        const { data, error } = await this.supabase.db
            .from('bank_account')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

        if (error) throw ToHttpException(error);
        return data
    }

    async create(userId: string, name: string, balance: number, card_linked?: string) {
        if(card_linked) {
            const { data, error } = await this.supabase.db
            .from('bank_account')
            .insert({
                user_id: userId,
                name: name,
                balance: balance,
                card_linked: card_linked,
            })
            .select()
            .single()

            if (error) throw ToHttpException(error);
            return data;

        } else {
            const { data, error } = await this.supabase.db
            .from('bank_account')
            .insert({
                user_id: userId,
                name: name,
                balance: balance,
            })
            .select()
            .single()

            if (error) throw ToHttpException(error);
            return data;
        }
    }

    async update(userId: string, accountId: string, opts: { name?: string; balance?: number; card_linked?: string}) {

        const updates = {
            name: opts.name,
            balance: opts.balance,
            card_linked: opts.card_linked
        }
        

        const { data, error } = await this.supabase.db
            .from('bank_account')
            .update(updates)
            .eq('id', accountId)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw ToHttpException(error);
        return data;
    }

    async delete(userId: string, accountId: string) {

        // Keep linked transactions as history, just detach them so the FK doesn't block the delete
        const { error: detachError } = await this.supabase.db
            .from('Transactions')
            .update({ bank_account_id: null })
            .eq('bank_account_id', accountId)
            .eq('user_id', userId);

        if (detachError) throw ToHttpException(detachError);

        const { error } = await this.supabase.db
            .from('bank_account')
            .delete()
            .eq('id', accountId)
            .eq('user_id', userId);

        if (error) throw ToHttpException(error);
    }
}
