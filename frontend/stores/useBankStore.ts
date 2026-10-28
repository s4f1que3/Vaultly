import { create } from 'zustand';
import { BankAccount } from '@/types';
import api from '@/lib/api';

export interface BankAccountInput {
  name: string;
  balance: number;
  card_linked: string | null;
}

interface BankState {
  accounts: BankAccount[];
  isLoading: boolean;
  fetchAccounts: () => Promise<void>;
  addAccount: (data: BankAccountInput) => Promise<BankAccount>;
  updateAccount: (id: string, data: Partial<BankAccountInput>) => Promise<BankAccount>;
  deleteAccount: (id: string) => Promise<void>;
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
    const updated = await api.patch<BankAccount>(`/bank-accounts/${id}`, data);
    set((state) => ({
      accounts: state.accounts.map((a) => (a.id === id ? updated : a)),
    }));
    return updated;
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
}));
