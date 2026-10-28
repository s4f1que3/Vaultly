import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { CategoriesModule } from '../categories/categories.module';
import { SupabaseModule } from '@/supabase/supabase.module';

@Module({
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  imports: [SupabaseModule, CategoriesModule],
})
export class SubscriptionsModule {}