import { BankAccountsController } from "./bank.controller";
import { BankAccountsService } from "./bank.service";
import { Module } from "@nestjs/common";
import { SupabaseModule } from "../supabase/supabase.module";

@Module({
    controllers: [BankAccountsController],
    providers: [BankAccountsService],
    imports: [SupabaseModule],
    exports: [BankAccountsService]
})

export class BankAccountModule {}
