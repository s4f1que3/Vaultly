import { Module } from "@nestjs/common";
import { emailingService } from "@emailing/emailing.service";
import { emailController } from "@emailing/email.controller";
import { SupabaseModule } from "@/supabase/supabase.module";
import { MAILER } from "@/emailing/email.token";
import { Email } from "@/emailing/email.class";
import { emailConsole } from "@/emailing/emailing.console.mailer";

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