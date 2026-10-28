'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, Plus, Pencil, Trash2, Landmark, ArrowDownLeft, ArrowUpRight, LucideIcon } from 'lucide-react';
import BankAccountTile from '@/components/bank/BankAccountTile';
import BankAccountModal from '@/components/bank/BankAccountModal';
import TransactionModal from '@/components/transactions/TransactionModal';
import { useBankStore } from '@/stores/useBankStore';
import { useCardStore } from '@/stores/useCardStore';
import api from '@/lib/api';
import { PaginatedResponse, Transaction } from '@/types';
import { CATEGORY_ICONS, CATEGORY_LABELS, formatCurrency, formatDate } from '@/lib/utils/formatters';

// How a transaction moves this account's balance. Mirrors the rule in the backend transactions service.
function balanceEffect(tx: Transaction): number {
  if (tx.type === 'income') return tx.amount;
  if (tx.type === 'expense') return -tx.amount;
  if (tx.type === 'transfer') {
    if (tx.budget_impact === 'increase') return tx.amount;
    if (tx.budget_impact === 'decrease') return -tx.amount;
  }
  return 0;
}

export default function BankAccountDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { accounts, fetchAccounts, deleteAccount } = useBankStore();
  const { cards, fetchCards } = useCardStore();

  const [accountsReady, setAccountsReady] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAddTx, setShowAddTx] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState(false);

  const account = accounts.find((a) => a.id === id) ?? null;
  const linkedCard = cards.find((c) => c.id === account?.card_linked) ?? null;

  const loadTransactions = useCallback(async () => {
    if (!id) return;
    setTxLoading(true);
    try {
      const res = await api.get<PaginatedResponse<Transaction>>(`/transactions?bankAccountId=${id}&limit=50`);
      setTransactions(res.data);
    } finally {
      setTxLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAccounts().finally(() => setAccountsReady(true));
    fetchCards();
    loadTransactions();
  }, [fetchAccounts, fetchCards, loadTransactions]);

  // Money in and out across the loaded activity, so the stats match the list below
  const { moneyIn, moneyOut } = useMemo(() => {
    let inTotal = 0;
    let outTotal = 0;
    for (const tx of transactions) {
      const effect = balanceEffect(tx);
      if (effect > 0) inTotal += effect;
      else outTotal += -effect;
    }
    return { moneyIn: inTotal, moneyOut: outTotal };
  }, [transactions]);

  // Group activity by day, keeping the API's newest-first order
  const days = useMemo(() => {
    const byDay = new Map<string, Transaction[]>();
    for (const tx of transactions) {
      const key = tx.date.slice(0, 10);
      const list = byDay.get(key);
      if (list) list.push(tx);
      else byDay.set(key, [tx]);
    }
    return [...byDay.entries()];
  }, [transactions]);

  const handleDelete = async () => {
    if (!account) return;
    const ok = window.confirm(`Delete "${account.name}"? Its transactions stay in your history but are unlinked from this account.`);
    if (!ok) return;
    setDeleting(true);
    try {
      await deleteAccount(account.id);
      router.push('/bank-accounts');
    } catch {
      setDeleting(false);
    }
  };

  if (!accountsReady) {
    return (
      <div className="px-4 py-6 sm:px-6 max-w-3xl mx-auto">
        <div className="skeleton h-[200px] w-full rounded-[20px]" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="px-4 py-6 sm:px-6 max-w-3xl mx-auto">
        <BackLink />
        <div className="card p-12 text-center mt-6">
          <div className="text-4xl mb-3">🏦</div>
          <p className="text-[var(--color-text-secondary)] font-medium">Account not found</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">It may have been deleted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 max-w-3xl mx-auto">
      <BackLink />

      {/* Account tile, sized up as the hero */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
        <BankAccountTile account={account} card={linkedCard} size="lg" />
      </motion.div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto my-8">
        <QuickAction icon={Plus} label="Add" tone="primary" onClick={() => setShowAddTx(true)} />
        <QuickAction icon={Pencil} label="Edit" onClick={() => setShowEdit(true)} />
        <QuickAction icon={Trash2} label={deleting ? 'Deleting' : 'Delete'} tone="danger" onClick={handleDelete} />
      </div>

      {/* Linked card */}
      <Link
        href="/cards"
        className="card p-4 flex items-center justify-between gap-3 hover:border-[var(--color-border-hover)] transition-colors mb-8"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] flex items-center justify-center shrink-0">
            <Landmark size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[var(--color-text-muted)]">Linked card</p>
            <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
              {linkedCard ? `${linkedCard.card_holder} •••• ${linkedCard.card_number}` : 'No card linked. Edit the account to link one.'}
            </p>
          </div>
        </div>
      </Link>

      {/* Money in / out */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="card p-4">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <span className="w-6 h-6 rounded-full bg-[var(--color-accent-dim)] text-[var(--color-accent)] flex items-center justify-center">
              <ArrowDownLeft size={13} />
            </span>
            Money in
          </div>
          <p className="font-display text-xl font-bold text-[var(--color-accent)] mt-2">{formatCurrency(moneyIn)}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <span className="w-6 h-6 rounded-full bg-[rgba(239,68,68,0.12)] text-[var(--color-danger)] flex items-center justify-center">
              <ArrowUpRight size={13} />
            </span>
            Money out
          </div>
          <p className="font-display text-xl font-bold text-[var(--color-text-primary)] mt-2">{formatCurrency(moneyOut)}</p>
        </div>
      </div>
      <p className="text-[10px] text-[var(--color-text-muted)] -mt-5 mb-8">Based on the latest 50 transactions on this account.</p>

      {/* Activity */}
      <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-4">Activity</p>

      {txLoading && transactions.length === 0 ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-14 w-full" />)}
        </div>
      ) : transactions.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-[var(--color-text-secondary)] font-medium">No activity yet</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-1 mb-4">Add a transaction and it will update this balance.</p>
          <button onClick={() => setShowAddTx(true)} className="btn-primary text-sm">
            <Plus size={16} /> Add transaction
          </button>
        </div>
      ) : (
        days.map(([day, items]) => (
          <div key={day} className="mb-6">
            <p className="text-xs text-[var(--color-text-muted)] mb-2">{formatDate(day)}</p>
            <div className="card divide-y divide-[var(--color-border)] overflow-hidden">
              {items.map((tx) => {
                const effect = balanceEffect(tx);
                return (
                  <button
                    key={tx.id}
                    onClick={() => setEditTx(tx)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--color-surface-2)] transition-colors"
                  >
                    <span className="w-9 h-9 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center text-base shrink-0">
                      {CATEGORY_ICONS[tx.category] ?? '📦'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{tx.description}</p>
                      <p className="text-xs text-[var(--color-text-muted)] truncate">
                        {tx.merchant || CATEGORY_LABELS[tx.category] || tx.category}
                      </p>
                    </div>
                    <p className={`text-sm font-semibold tabular-nums shrink-0 ${
                      effect > 0 ? 'text-[var(--color-accent)]' : effect < 0 ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'
                    }`}>
                      {effect > 0 ? '+' : effect < 0 ? '−' : ''}{formatCurrency(Math.abs(effect || tx.amount))}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ))
      )}

      <BankAccountModal isOpen={showEdit} onClose={() => setShowEdit(false)} account={account} />
      <TransactionModal
        isOpen={showAddTx || !!editTx}
        transaction={editTx}
        defaultBankAccountId={id}
        onSaved={loadTransactions}
        onClose={() => { setShowAddTx(false); setEditTx(null); }}
      />
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/bank-accounts"
      className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
    >
      <ChevronLeft size={16} /> Accounts
    </Link>
  );
}

function QuickAction({
  icon: Icon,
  label,
  onClick,
  tone = 'default',
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  tone?: 'default' | 'primary' | 'danger';
}) {
  const circle =
    tone === 'primary'
      ? 'bg-[var(--color-accent)] text-[#0d0a06] border-transparent group-hover:bg-[var(--color-accent-hover)] group-hover:shadow-[0_4px_16px_rgba(87,201,60,0.3)]'
      : tone === 'danger'
        ? 'bg-[rgba(239,68,68,0.08)] text-[var(--color-danger)] border-[rgba(239,68,68,0.25)] group-hover:border-[rgba(239,68,68,0.5)]'
        : 'bg-[var(--color-surface)] text-[var(--color-text-primary)] border-[var(--color-border)] group-hover:border-[var(--color-border-hover)] group-hover:bg-[var(--color-surface-2)]';

  return (
    <button onClick={onClick} className="group flex flex-col items-center gap-2">
      <span className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all ${circle}`}>
        <Icon size={20} />
      </span>
      <span className="text-xs font-medium text-[var(--color-text-secondary)]">{label}</span>
    </button>
  );
}
