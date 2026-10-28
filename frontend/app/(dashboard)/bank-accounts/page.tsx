'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, ChevronRight, Landmark } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import BankAccountTile from '@/components/bank/BankAccountTile';
import BankAccountModal from '@/components/bank/BankAccountModal';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { useBankStore } from '@/stores/useBankStore';
import { useCardStore } from '@/stores/useCardStore';
import { formatCurrency } from '@/lib/utils/formatters';

export default function BankAccountsPage() {
  const { accounts, isLoading, fetchAccounts } = useBankStore();
  const { cards, fetchCards } = useCardStore();
  const [showAdd, setShowAdd] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchAccounts();
    fetchCards();
  }, [fetchAccounts, fetchCards]);

  const total = accounts.reduce((s, a) => s + a.balance, 0);
  const linkedCount = accounts.filter((a) => a.card_linked).length;

  return (
    <div className="px-4 py-6 sm:px-6 max-w-5xl mx-auto">
      <PageHeader
        title="Accounts"
        subtitle={`${accounts.length} account${accounts.length !== 1 ? 's' : ''} · Money in banks, tracked in one place`}
        action={
          <button onClick={() => setShowAdd(true)} className="btn-primary text-sm">
            <Plus size={16} /> Open account
          </button>
        }
      />

      {/* Balance hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden card p-6 sm:p-8 mb-8"
      >
        <div className="absolute inset-0 dot-pattern pointer-events-none" />
        <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-[var(--color-accent-dim)] blur-3xl pointer-events-none" />

        <div className="relative">
          <p className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">Total in bank accounts</p>
          <p className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[var(--color-text-primary)] mt-2">
            {formatCurrency(total)}
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <div className="bg-[var(--color-surface-2)]/80 border border-[var(--color-border)] rounded-xl px-4 py-2.5">
              <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Accounts</p>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">{accounts.length}</p>
            </div>
            <div className="bg-[var(--color-surface-2)]/80 border border-[var(--color-border)] rounded-xl px-4 py-2.5">
              <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Cards linked</p>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">{linkedCount} of {cards.length}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Accounts */}
      <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-4">Your accounts</p>

      {isLoading && accounts.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(2)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {accounts.map((account, i) => {
            const linkedCard = cards.find((c) => c.id === account.card_linked) ?? null;
            return (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                role="button"
                tabIndex={0}
                onClick={() => router.push(`/bank-accounts/${account.id}`)}
                onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/bank-accounts/${account.id}`); }}
                className="group cursor-pointer rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 transition-all hover:border-[var(--color-border-hover)] hover:-translate-y-0.5"
              >
                <BankAccountTile account={account} card={linkedCard} />
                <div className="flex items-center justify-between px-3 py-3">
                  <span className="text-xs text-[var(--color-text-muted)]">View activity</span>
                  <ChevronRight size={16} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
                </div>
              </motion.div>
            );
          })}

          {/* Open another account */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: accounts.length * 0.05 }}
            onClick={() => setShowAdd(true)}
            className="min-h-[240px] rounded-[20px] border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-dim)] transition-all flex flex-col items-center justify-center gap-3 text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
          >
            <span className="w-11 h-11 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center">
              <Plus size={20} />
            </span>
            <span className="text-sm font-medium">{accounts.length === 0 ? 'Open your first account' : 'Open another account'}</span>
          </motion.button>
        </div>
      )}

      {!isLoading && accounts.length === 0 && (
        <div className="card p-6 mt-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-dim)] text-[var(--color-accent)] flex items-center justify-center shrink-0">
            <Landmark size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">Track your bank balances</p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              Add an account with its current balance, then link transactions to it and the balance updates on its own.
              Bank accounts count toward your net worth.
            </p>
          </div>
        </div>
      )}

      <BankAccountModal isOpen={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  );
}
