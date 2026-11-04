import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { supabaseService } from "../supabase/supabase.service";
import { ToHttpException } from "../exceptions/exception.service";

@Injectable()
export class BankAccountsService {
    constructor(private readonly supabase: supabaseService) {}

    async getAll(userId: string) {
        const { data, error } = await this.supabase.db
            .from('bank_account')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

        if (error) throw ToHttpException(error);
        return data
    }

    async create(userId: string, name: string, balance: number, card_linked?: string) {
        if(card_linked) {
            const { data, error } = await this.supabase.db
            .from('bank_account')
            .insert({
                user_id: userId,
                name: name,
                balance: balance,
                card_linked: card_linked,
            })
            .select()
            .single()

            if (error) throw ToHttpException(error);
            return data;

        } else {
            const { data, error } = await this.supabase.db
            .from('bank_account')
            .insert({
                user_id: userId,
                name: name,
                balance: balance,
            })
            .select()
            .single()

            if (error) throw ToHttpException(error);
            return data;
        }
    }

    async update(user_id: string, account_id: string, opts: { name?: string; balance?: number; card_linked?: string}) {

        const updates = {
            name: opts.name,
            card_linked: opts.card_linked
        }
        

        const { data, error } = await this.supabase.db
            .from('bank_account')
            .update(updates)
            .eq('id', account_id)
            .eq('user_id', user_id)
            .select()
            .single();

        if (error) throw ToHttpException(error);

        if(opts.balance) {
            const {data: bank, error: berror} = await this.supabase.db
            .from('bank_account')
            .update({
                balance: opts.balance
            })
            .eq('user_id', user_id)
            .eq('id', account_id)
            .select()
            .single()

            if(berror) throw ToHttpException(berror)
            if(bank.card_linked === null) 
                return bank
            else {
                const {error} = await this.supabase.db
                .from('Cards')
                .update({
                    balance: opts.balance
                })
                .eq('user_id', user_id)
                .eq('id', bank.card_linked)

                if(error) throw ToHttpException(error)
                return bank
            }

        }
        return data;
    }

    async transfer (user_id: string, current_account: string, destination_account: string, amount: number) {
        if(current_account === destination_account) throw new BadRequestException("Can't transfer to the same account")
        const {data, error} = await this.supabase.db
        .from('bank_account')
        .select('balance')
        .eq('id', current_account)
        .eq('user_id', user_id)
        .single()

        if(error) throw ToHttpException(error)
        if(!data.balance) throw new NotFoundException('No balance returned for this account')
        if(amount > data.balance) throw new BadRequestException('Transfer amount cannot exceed balance')

        const {data: d, error: e} = await this.supabase.db
        .from('bank_account')
        .select('balance')
        .eq('id', destination_account)
        .eq('user_id', user_id)
        .single()

        if(e) throw ToHttpException(e)
        if(!d.balance) throw new NotFoundException('No balance returned for this account')


        const current_account_new_balance = data.balance - amount
        const destination_account_new_balance = d.balance + amount

        await this.doBankTransfer(user_id, current_account, destination_account, current_account_new_balance, destination_account_new_balance)
        
    }

    async delete(userId: string, accountId: string) {

        // Keep linked transactions as history, just detach them so the FK doesn't block the delete
        const { error: detachError } = await this.supabase.db
            .from('Transactions')
            .update({ bank_account_id: null })
            .eq('bank_account_id', accountId)
            .eq('user_id', userId);

        if (detachError) throw ToHttpException(detachError);

        const { error } = await this.supabase.db
            .from('bank_account')
            .delete()
            .eq('id', accountId)
            .eq('user_id', userId);

        if (error) throw ToHttpException(error);
    }



    /////
    async doBankTransfer (user_id: string, c_acc: string, d_acc: string, c_amount: number, d_amount: number) {
        const {data, error} = await this.supabase.db
        .from('bank_account')
        .update({
            balance: c_amount
        })
        .eq('id', c_acc)
        .eq('user_id', user_id)

        if(error) throw ToHttpException(error)
            
        const {data: d, error: e} = await this.supabase.db
        .from('bank_account')
        .update({
            balance: d_amount
        })
        .eq('id', d_acc)
        .eq('user_id', user_id)

        if(e) throw ToHttpException(e)
        return d && data
    }
}
