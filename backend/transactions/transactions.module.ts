import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { supabaseService } from '@supabase/supabase.service';
import { CategoriesModule } from '../categories/categories.module';
import { IntelligenceModule } from '../intelligence/intelligence.module';
import { SupabaseModule } from '@/supabase/supabase.module';
import { EmailModule } from '@/emailing/email.module';

@Module({
  imports: [CategoriesModule, IntelligenceModule, SupabaseModule, EmailModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
