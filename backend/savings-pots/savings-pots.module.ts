import { Module } from '@nestjs/common';
import { SavingsPotsController } from './savings-pots.controller';
import { SavingsPotsService } from './savings-pots.service';
import { SupabaseModule } from '@/supabase/supabase.module';

@Module({
  controllers: [SavingsPotsController],
  providers: [SavingsPotsService],
  imports: [SupabaseModule],
})
export class SavingsPotsModule {}
