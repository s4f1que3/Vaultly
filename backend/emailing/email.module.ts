import { Module } from "@nestjs/common";
import { emailingService } from "./emailing.service";
import { emailController } from "./email.controller";
import { SupabaseModule } from "../supabase/supabase.module";
import { MAILER } from "./email.token";
import { Email } from "./email.class";
import { emailConsole } from "./emailing.console.mailer";

@Module({
    controllers: [emailController],
    providers: [
        {
            provide: Email,
            useClass: process.env.NODE_ENV === 'production' ? emailConsole : Email
        },
        emailingService
    ],
    imports: [SupabaseModule],
    exports: [emailingService]
})

export class EmailModule {}