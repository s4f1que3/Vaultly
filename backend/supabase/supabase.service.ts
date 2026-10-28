import { Inject, Injectable, Scope } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

@Injectable({ scope: Scope.REQUEST })
export class supabaseService {
    constructor(@Inject('SUPABASE_CLIENT') private readonly client: SupabaseClient<Database>) {}

    get db(): SupabaseClient<Database> {
        return this.client;
    }

}
