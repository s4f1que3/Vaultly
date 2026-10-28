import { Database } from "../database.types";
import { supabaseAdminService } from "./supabase_admin.service";
import { InternalServerErrorException, Module, NotFoundException, Request } from "@nestjs/common";
import * as sentry from "@sentry/browser"
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { REQUEST } from "@nestjs/core";

@Module({
    providers: 
    [
        {
            provide: 'SUPABASE_ADMIN_CLIENT',
            useFactory: (): SupabaseClient<Database> => {
                const url = process.env.SUPABASE_URL
                const key = process.env.SERVICE_ROLE_KEY

                if(!key || !url) {
                    sentry.captureMessage('Supabase env variables not found')
                    throw new InternalServerErrorException('Failed database connection')
                }
                return createClient<Database>(url, key)
            }
        },
        supabaseAdminService
    ],
    exports: [supabaseAdminService]
})

export class SupabaseAdminModule {}