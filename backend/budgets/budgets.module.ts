import { Module } from '@nestjs/common';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';
import { CategoriesModule } from '../categories/categories.module';
import { SupabaseModule } from '@/supabase/supabase.module';

@Module({
  controllers: [BudgetsController],
  providers: [BudgetsService],
  imports: [SupabaseModule, CategoriesModule],
})
export class BudgetsModule {}
