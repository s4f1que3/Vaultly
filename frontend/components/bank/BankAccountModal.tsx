'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import BankAccountTile from '@/components/bank/BankAccountTile';
import { useBankStore } from '@/stores/useBankStore';
import { useCardStore } from '@/stores/useCardStore';
import { BankAccount } from '@/types';

const schema = z.object({
  name: z.string().trim().min(1, 'Required').max(160, 'Too long'),
  balance: z.coerce.number(),
  card_linked: z.string(),
});
type FormData = z.infer<typeof schema>;

interface BankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account?: BankAccount | null;
}

export default function BankAccountModal({ isOpen, onClose, account }: BankAccountModalProps) {
  const { addAccount, updateAccount } = useBankStore();
  const { cards, fetchCards } = useCardStore();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const isEdit = !!account;

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: { name: '', balance: 0, card_linked: '' },
  });

  useEffect(() => {
    if (isOpen) fetchCards();
  }, [isOpen, fetchCards]);

  useEffect(() => {
    if (!isOpen) return;
    setServerError(null);
    reset(account
      ? { name: account.name, balance: account.balance, card_linked: account.card_linked ?? '' }
      : { name: '', balance: 0, card_linked: '' });
  }, [account, isOpen, reset]);

  const values = watch();
  const linkedCard = cards.find((c) => c.id === values.card_linked) ?? null;

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setServerError(null);
    const payload = {
      name: data.name.trim(),
      balance: data.balance,
      card_linked: data.card_linked || null,
    };
    try {
      if (account) {
        await updateAccount(account.id, payload);
      } else {
        await addAccount(payload);
      }
      onClose();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Account' : 'Open Bank Account'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Live preview */}
        <BankAccountTile
          account={{ id: account?.id, name: values.name || '', balance: Number(values.balance) || 0 }}
          card={linkedCard}
        />

        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Account name</label>
          <input {...register('name')} placeholder="e.g. Everyday Checking" className="input-base" />
          {errors.name && <p className="text-[var(--color-danger)] text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Current balance ($)</label>
          <input {...register('balance')} type="number" step="0.01" placeholder="0.00" className="input-base" />
          {errors.balance && <p className="text-[var(--color-danger)] text-xs mt-1">{errors.balance.message}</p>}
          {isEdit && (
            <p className="text-[10px] text-[var(--color-text-muted)] mt-1.5">
              Editing the balance sets it directly. Transactions from now on will adjust it.
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Linked card (optional)</label>
          <select {...register('card_linked')} className="input-base">
            <option value="">No card linked</option>
            {cards.map((c) => (
              <option key={c.id} value={c.id}>
                {c.card_holder} •••• {c.card_number}
              </option>
            ))}
          </select>
        </div>

        {serverError && (
          <p className="text-[var(--color-danger)] text-xs">{serverError}</p>
        )}

        <button type="submit" disabled={isLoading} className="btn-primary w-full">
          {isLoading
            ? <><Loader2 size={16} className="animate-spin" /> {isEdit ? 'Saving...' : 'Opening...'}</>
            : isEdit ? 'Save changes' : 'Open account'
          }
        </button>
      </form>
    </Modal>
  );
}
