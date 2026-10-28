import { Module } from '@nestjs/common';
import { IntelligenceController } from './intelligence.controller';
import { IntelligenceService } from './intelligence.service';
import { CategoriesModule } from '../categories/categories.module';
import { SupabaseModule } from '@/supabase/supabase.module';

@Module({
  imports: [CategoriesModule, SupabaseModule],
  controllers: [IntelligenceController],
  providers: [IntelligenceService],
  exports: [IntelligenceService],
})
export class IntelligenceModule {}
