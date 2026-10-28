import { Module } from '@nestjs/common';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { SupabaseModule } from '@/supabase/supabase.module';
import { EmailModule } from '@/emailing/email.module';

@Module({
  controllers: [GoalsController],
  providers: [GoalsService],
  imports: [SupabaseModule, EmailModule]
})
export class GoalsModule {}
