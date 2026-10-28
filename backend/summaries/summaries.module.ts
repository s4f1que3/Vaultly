import { Module } from '@nestjs/common';
import { SummariesController } from './summaries.controller';
import { SummariesService } from './summaries.service';
import { CategoriesModule } from '../categories/categories.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  controllers: [SummariesController],
  providers: [SummariesService],
  imports: [SupabaseModule, CategoriesModule],
  exports: [SummariesService],
})
export class SummariesModule {}
