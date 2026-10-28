import { Inject, Injectable } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

@Injectable()
export class supabaseAdminService {
    constructor(@Inject('SUPABASE_ADMIN_CLIENT') private readonly client: SupabaseClient<Database>) {}

    get db(): SupabaseClient<Database> {
        return this.client;
    }

}