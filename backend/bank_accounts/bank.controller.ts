import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { BankAccountsService } from "./bank.service";
import { AuthGuard } from "../guards/auth.guard";
import { bankTransferDto, CreateBankAccountDto, UpdateBankAccountDto } from "./bank.dto";
import { CurrentUser } from "../decorators/user.decorator";
import type { User } from "@supabase/supabase-js";

@Controller('bank-accounts')
@UseGuards(AuthGuard)
export class BankAccountsController {
    constructor(private readonly bank: BankAccountsService) {}

    @Get()
    async getAll(@CurrentUser() user: User) {
        return this.bank.getAll(user.id);
    }

    @Post()
    async create(@CurrentUser() user: User, @Body() dto: CreateBankAccountDto) {
        return this.bank.create(user.id, dto.name, dto.balance, dto.card_linked);
    }

    @Patch(':id')
    async update(@CurrentUser() user: User, @Param('id') id: string, @Body() dto: UpdateBankAccountDto) {
        return this.bank.update(user.id, id, dto);
    }

    @Post(':id')
    async transfer(@CurrentUser() user: User, @Param('id') id: string, @Body() dto: bankTransferDto) {
        return await this.bank.transfer(user.id, dto.current_account, dto.destination_account, dto.amount)
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@CurrentUser() user: User, @Param('id') id: string) {
        return this.bank.delete(user.id, id);
    }
}
