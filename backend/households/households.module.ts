import { Module } from '@nestjs/common';
import { HouseholdsController } from './households.controller';
import { HouseholdsService } from './households.service';
import { SupabaseService } from '../common/supabase.service';
import { EmailService } from '../common/email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [HouseholdsController],
  providers: [HouseholdsService, SupabaseService, EmailService, ConfigModule],
  exports: [HouseholdsService],
})
export class HouseholdsModule {}
