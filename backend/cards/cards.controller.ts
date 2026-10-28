import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Header } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto, UpdateCardDto } from './cards.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/user.decorator';
import type { User } from '@supabase/supabase-js';

@Controller('cards')
@UseGuards(AuthGuard)
export class CardsController {
  constructor(private readonly service: CardsService) {}

  @Get()
  @Header('Cache-Controler', 'no-store')
  findAll(@CurrentUser() user: User) {
    return this.service.findAll(user.id);
  }

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateCardDto) {
    return this.service.create(user.id, dto);
  }

  @Patch(':id')
  @Header('Cache-Controler', 'no-store')
  update(@CurrentUser() user: User, @Param('id') id: string, @Body() dto: UpdateCardDto) {
    return this.service.update(user.id, id, dto);
  }

  @Delete(':id')
  delete(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.delete(user.id, id);
  }

  @Patch(':id/default')
  @Header('Cache-Controler', 'no-store')
  setDefault(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.setDefault(user.id, id);
  }
}
