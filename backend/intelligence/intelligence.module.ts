import { Module } from '@nestjs/common';
import { IntelligenceController } from './intelligence.controller';
import { IntelligenceService } from './intelligence.service';
import { CategoriesModule } from '../categories/categories.module';
import { SupabaseModule } from '@/supabase/supabase.module';
import { EmailModule } from '@/emailing/email.module';

@Module({
  imports: [CategoriesModule, SupabaseModule, EmailModule],
  controllers: [IntelligenceController],
  providers: [IntelligenceService],
  exports: [IntelligenceService],
})
export class IntelligenceModule {}
