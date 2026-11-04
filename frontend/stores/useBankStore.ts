import { create } from 'zustand';
import { BankAccount } from '@/types';
import api from '@/lib/api';

export interface BankAccountInput {
  name: string;
  balance: number;
  card_linked: string | null;
}

export interface BankTransferInput {
  current_account: string;
  destination_account: string;
  amount: number;
}

interface BankState {
  accounts: BankAccount[];
  isLoading: boolean;
  fetchAccounts: () => Promise<void>;
  addAccount: (data: BankAccountInput) => Promise<BankAccount>;
  updateAccount: (id: string, data: Partial<BankAccountInput>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  transfer: (data: BankTransferInput) => Promise<void>;
}

export const useBankStore = create<BankState>((set, get) => ({
  accounts: [],
  isLoading: false,

  fetchAccounts: async () => {
    set({ isLoading: true });
    try {
      const accounts = await api.get<BankAccount[]>('/bank-accounts');
      set({ accounts });
    } finally {
      set({ isLoading: false });
    }
  },

  addAccount: async (data) => {
    // Backend create() doesn't return the inserted row yet, so refetch instead of appending
    const created = await api.post<BankAccount | null>('/bank-accounts', data);
    await get().fetchAccounts();
    return created as BankAccount;
  },

  updateAccount: async (id, data) => {
    const updated = await api.patch<BankAccount | null>(`/bank-accounts/${id}`, data);
    // Backend can respond with an empty body; refetch rather than writing null into the list
    if (!updated) {
      await get().fetchAccounts();
      return;
    }
    set((state) => ({
      accounts: state.accounts.map((a) => (a.id === id ? updated : a)),
    }));
  },

  deleteAccount: async (id) => {
    const prev = get().accounts;
    set((state) => ({ accounts: state.accounts.filter((a) => a.id !== id) }));
    try {
      await api.delete(`/bank-accounts/${id}`);
    } catch (err) {
      set({ accounts: prev });
      throw err;
    }
  },

  transfer: async (data) => {
    // Backend moves the money and returns an empty body, so refetch for the new balances
    await api.post(`/bank-accounts/${data.current_account}`, data);
    await get().fetchAccounts();
  },
}));
