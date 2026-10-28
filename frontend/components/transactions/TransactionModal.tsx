'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useTransactionStore } from '@/stores/useTransactionStore';
import { useCardStore } from '@/stores/useCardStore';
import { useBankStore } from '@/stores/useBankStore';
import { Transaction, TransactionCategory, BudgetImpact } from '@/types';
import { CATEGORY_LABELS, CATEGORY_ICONS, formatCurrency } from '@/lib/utils/formatters';
import { useCategoryStore } from '@/stores/useCategoryStore';

const schema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  type: z.enum(['income', 'expense', 'transfer']),
  category: z.string(),
  description: z.string().min(1, 'Required'),
  merchant: z.string().optional(),
  date: z.string().min(1, 'Required'),
  card_id: z.string().optional(),
  bank_account_id: z.string().optional(),
  budget_impact: z.enum(['increase', 'decrease', 'none']).optional(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
  defaultBankAccountId?: string | null;
  onSaved?: () => void;
}

const DEFAULT_CATEGORIES: TransactionCategory[] = [
  'food', 'transport', 'shopping', 'entertainment', 'health',
  'utilities', 'housing', 'education', 'salary', 'investment', 'transfer', 'other', 'general',
];

export default function TransactionModal({ isOpen, onClose, transaction, defaultBankAccountId, onSaved }: Props) {
  const { addTransaction, updateTransaction } = useTransactionStore();
  const { cards, fetchCards } = useCardStore();
  const { accounts, fetchAccounts } = useBankStore();
  const { customCategories, fetchCategories } = useCategoryStore();
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!transaction;

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      type: 'expense',
      category: 'food',
      date: new Date().toISOString().split('T')[0],
      budget_impact: 'none',
    },
  });

  useEffect(() => {
    fetchCards();
    fetchAccounts();
    fetchCategories();
  }, [fetchCards, fetchAccounts, fetchCategories]);

  useEffect(() => {
    if (transaction) {
      reset({
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        description: transaction.description,
        merchant: transaction.merchant || '',
        date: transaction.date.split('T')[0],
        card_id: transaction.card_id || '',
        bank_account_id: transaction.bank_account_id || '',
        budget_impact: transaction.budget_impact || 'none',
      });
    } else {
      reset({
        type: 'expense',
        category: 'food',
        date: new Date().toISOString().split('T')[0],
        bank_account_id: defaultBankAccountId || '',
      });
    }
  }, [transaction, defaultBankAccountId, reset]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const payload = { ...data, bank_account_id: data.bank_account_id || null } as Partial<Transaction>;
      if (isEdit && transaction) {
        await updateTransaction(transaction.id, payload);
      } else {
        await addTransaction(payload);
      }
      onSaved?.();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Transaction' : 'Add Transaction'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Type */}
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">Type</label>
          <div className="grid grid-cols-3 gap-2">
            {(['income', 'expense', 'transfer'] as const).map((t) => {
              const selected = watch('type') === t;
              return (
                <label key={t} className="cursor-pointer">
                  <input {...register('type')} type="radio" value={t} className="sr-only" />
                  <div className={`text-center py-2 px-3 rounded-lg border text-sm font-medium transition-all capitalize
                    ${t === 'income'
                      ? selected
                        ? 'border-[rgba(87,201,60,0.6)] bg-[rgba(87,201,60,0.15)] text-[var(--color-accent)]'
                        : 'border-[rgba(87,201,60,0.2)] text-[var(--color-text-secondary)] hover:border-[rgba(87,201,60,0.4)]'
                      : ''}
                    ${t === 'expense'
                      ? selected
                        ? 'border-[rgba(239,68,68,0.6)] bg-[rgba(239,68,68,0.15)] text-[var(--color-danger)]'
                        : 'border-[rgba(239,68,68,0.2)] text-[var(--color-text-secondary)] hover:border-[rgba(239,68,68,0.4)]'
                      : ''}
                    ${t === 'transfer'
                      ? selected
                        ? 'border-[rgba(59,130,246,0.6)] bg-[rgba(59,130,246,0.15)] text-[var(--color-info)]'
                        : 'border-[rgba(59,130,246,0.2)] text-[var(--color-text-secondary)] hover:border-[rgba(59,130,246,0.4)]'
                      : ''}
                  `}>
                    {t}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Amount ($)</label>
          <input {...register('amount')} type="number" step="0.01" placeholder="0.00" className="input-base" />
          {errors.amount && <p className="text-[var(--color-danger)] text-xs mt-1">{errors.amount.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Description</label>
          <input {...register('description')} placeholder="e.g. Grocery shopping" className="input-base" />
          {errors.description && <p className="text-[var(--color-danger)] text-xs mt-1">{errors.description.message}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Category</label>
          <select {...register('category')} className="input-base">
            {[...DEFAULT_CATEGORIES, ...customCategories.filter((c) => !DEFAULT_CATEGORIES.includes(c.name as TransactionCategory)).map((c) => c.name as TransactionCategory)].map((c) => (
              <option key={c} value={c}>
                {(CATEGORY_ICONS as Record<string, string>)[c] || '📦'}{' '}
                {(CATEGORY_LABELS as Record<string, string>)[c] || c}
              </option>
            ))}
          </select>
        </div>

        {/* Budget impact — transfers only */}
        {watch('type') === 'transfer' && (
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">
              Budget impact
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { value: 'increase', label: '↑ Increase', activeClass: 'border-[rgba(87,201,60,0.6)] bg-[rgba(87,201,60,0.1)] text-[var(--color-accent)]' },
                { value: 'decrease', label: '↓ Decrease', activeClass: 'border-[rgba(239,68,68,0.6)] bg-[rgba(239,68,68,0.1)] text-[var(--color-danger)]' },
                { value: 'none',     label: '— None',     activeClass: 'border-[rgba(156,149,133,0.6)] bg-[rgba(156,149,133,0.1)] text-[var(--color-text-secondary)]' },
              ] as { value: BudgetImpact; label: string; activeClass: string }[]).map(({ value, label, activeClass }) => (
                <label key={value} className="cursor-pointer">
                  <input {...register('budget_impact')} type="radio" value={value} className="sr-only" />
                  <div className={`text-center py-2 rounded-lg border text-xs font-medium transition-all ${
                    watch('budget_impact') === value
                      ? activeClass
                      : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-hover)]'
                  }`}>
                    {label}
                  </div>
                </label>
              ))}
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-1.5">
              How should this transfer affect the selected category&apos;s budget?
            </p>
          </div>
        )}

        {/* Merchant + Date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Merchant</label>
            <input {...register('merchant')} placeholder="Optional" className="input-base" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Date</label>
            <input {...register('date')} type="date" className="input-base" />
            {errors.date && <p className="text-[var(--color-danger)] text-xs mt-1">{errors.date.message}</p>}
          </div>
        </div>

        {/* Card */}
        {cards.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Card (optional)</label>
            <select {...register('card_id')} className="input-base">
              <option value="">No card</option>
              {cards.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.card_holder} •••• {c.card_number}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Bank account */}
        {accounts.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Bank account (optional)</label>
            <select {...register('bank_account_id')} className="input-base">
              <option value="">No bank account</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} · {formatCurrency(a.balance)}
                </option>
              ))}
            </select>
            {watch('bank_account_id') && (
              <p className="text-[10px] text-[var(--color-text-muted)] mt-1.5">
                {watch('type') === 'income' && 'Adds to this account\'s balance.'}
                {watch('type') === 'expense' && 'Deducted from this account\'s balance.'}
                {watch('type') === 'transfer' && (
                  watch('budget_impact') === 'increase' ? 'Money in: adds to this account\'s balance.'
                  : watch('budget_impact') === 'decrease' ? 'Money out: deducted from this account\'s balance.'
                  : 'Budget impact is "None", so this account\'s balance won\'t change.'
                )}
              </p>
            )}
          </div>
        )}

        <button type="submit" disabled={isLoading} className="btn-primary w-full">
          {isLoading
            ? <><Loader2 size={16} className="animate-spin" /> {isEdit ? 'Saving...' : 'Adding...'}</>
            : isEdit ? 'Save changes' : 'Add transaction'
          }
        </button>
      </form>
    </Modal>
  );
}
