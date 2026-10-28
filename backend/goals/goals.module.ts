import { Module } from '@nestjs/common';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { EmailModule } from '../emailing/email.module';
import { SupabaseAdminModule } from '../supabase/supabase_admin.module';

@Module({
  controllers: [GoalsController],
  providers: [GoalsService],
  imports: [SupabaseModule, EmailModule, SupabaseAdminModule]
})
export class GoalsModule {}
