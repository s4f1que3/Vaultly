import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SupabaseAdminModule } from '../supabase/supabase_admin.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [ConfigModule, SupabaseAdminModule, SupabaseModule]
})
export class AuthModule {}
