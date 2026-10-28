import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [SupabaseModule],
  exports: [CategoriesService],
})
export class CategoriesModule {}
