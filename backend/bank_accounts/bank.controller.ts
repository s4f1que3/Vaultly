import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { BankAccountsService } from "./bank.service";
import { AuthGuard } from "../guards/auth.guard";
import { CreateBankAccountDto, UpdateBankAccountDto } from "./bank.dto";
import { CurrentUser } from "../decorators/user.decorator";
import type { User } from "@supabase/supabase-js";

@Controller('bank-accounts')
@UseGuards(AuthGuard)
export class BankAccountsController {
    constructor(private readonly bank: BankAccountsService) {}

    @Get()
    getAll(@CurrentUser() user: User) {
        return this.bank.getAll(user.id);
    }

    @Post()
    create(@CurrentUser() user: User, @Body() dto: CreateBankAccountDto) {
        return this.bank.create(user.id, dto.name, dto.balance, dto.card_linked);
    }

    @Patch(':id')
    update(@CurrentUser() user: User, @Param('id') id: string, @Body() dto: UpdateBankAccountDto) {
        return this.bank.update(user.id, id, dto);
    }

    @Delete(':id')
    @HttpCode(204)
    delete(@CurrentUser() user: User, @Param('id') id: string) {
        return this.bank.delete(user.id, id);
    }
}
