import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { supabaseService } from "./supabase.service";
import { InternalServerErrorException, Module, Scope } from "@nestjs/common";
import { Request } from "express";
import { Database } from "../database.types";
import * as sentry from "@sentry/nestjs"
import { REQUEST } from "@nestjs/core";

@Module({
    providers: [
        {
            provide: 'SUPABASE_CLIENT',
            scope: Scope.REQUEST,
            inject: [REQUEST],
            useFactory: (request: Request): SupabaseClient<Database> => {
                const url = process.env.SUPABASE_URL
                const key = process.env.PUBLISHABLE_KEY
                if(!key || !url) {
                    sentry.captureMessage('Env variables for supabase connection not found')
                    throw new InternalServerErrorException('Database Connection Error')
                } else {
                    const token = request.headers.authorization?.split(' ')[1]
                    return createClient<Database>(url, key,
                        token? { global: { headers: { Authorization: `Bearer ${token}`}}} : {}
                    )
                }
            }
        },
        supabaseService
    ],
    exports: [supabaseService]
})

export class SupabaseModule {}