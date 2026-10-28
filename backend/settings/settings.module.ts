import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { SupabaseModule } from '@/supabase/supabase.module';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService],
  imports: [SupabaseModule],
})
export class SettingsModule {}
