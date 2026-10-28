import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { SupabaseModule } from '@/supabase/supabase.module';

@Module({
  controllers: [CardsController],
  providers: [CardsService],
  imports: [SupabaseModule]
})
export class CardsModule {}
