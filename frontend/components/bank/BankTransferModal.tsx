'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useBankStore } from '@/stores/useBankStore';
import { formatCurrency } from '@/lib/utils/formatters';

interface BankTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Pre-selects the source account, e.g. when opened from an account's detail page
  defaultFromId?: string;
}

export default function BankTransferModal({ isOpen, onClose, defaultFromId }: BankTransferModalProps) {
  const { accounts, transfer } = useBankStore();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Amount limit depends on the chosen source account, so the schema reads the live account list
  const schema = useMemo(
    () =>
      z
        .object({
          from: z.string().min(1, 'Choose an account to send from'),
          to: z.string().min(1, 'Choose an account to send to'),
          amount: z.coerce.number({ error: 'Enter an amount' }).positive('Amount must be greater than 0'),
        })
        .superRefine((data, ctx) => {
          if (data.from && data.from === data.to) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['to'], message: 'Pick a different account' });
          }
          const source = accounts.find((a) => a.id === data.from);
          if (source && data.amount > source.balance) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['amount'],
              message: `Exceeds balance of ${formatCurrency(source.balance)}`,
            });
          }
        }),
    [accounts],
  );
  type FormData = z.infer<typeof schema>;

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: { from: '', to: '', amount: 0 },
  });

  useEffect(() => {
    if (!isOpen) return;
    setServerError(null);
    reset({ from: defaultFromId ?? '', to: '', amount: 0 });
  }, [isOpen, defaultFromId, reset]);

  const values = watch();
  const source = accounts.find((a) => a.id === values.from) ?? null;
  const destination = accounts.find((a) => a.id === values.to) ?? null;
  const amount = Number(values.amount) || 0;

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await transfer({
        current_account: data.from,
        destination_account: data.to,
        amount: data.amount,
      });
      onClose();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transfer between accounts">
      {accounts.length < 2 ? (
        <p className="text-sm text-[var(--color-text-secondary)]">
          You need at least two bank accounts to make a transfer.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">From</label>
            <select {...register('from')} className="input-base">
              <option value="">Select account</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} · {formatCurrency(a.balance)}
                </option>
              ))}
            </select>
            {errors.from && <p className="text-[var(--color-danger)] text-xs mt-1">{errors.from.message}</p>}
          </div>

          <div className="flex justify-center text-[var(--color-text-muted)]">
            <ArrowRight size={16} className="rotate-90" />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">To</label>
            <select {...register('to')} className="input-base">
              <option value="">Select account</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} · {formatCurrency(a.balance)}
                </option>
              ))}
            </select>
            {errors.to && <p className="text-[var(--color-danger)] text-xs mt-1">{errors.to.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Amount ($)</label>
            <input {...register('amount')} type="number" step="0.01" min="0" placeholder="0.00" className="input-base" />
            {errors.amount && <p className="text-[var(--color-danger)] text-xs mt-1">{errors.amount.message}</p>}
            {source && (
              <p className="text-[10px] text-[var(--color-text-muted)] mt-1.5">
                Available in {source.name}: {formatCurrency(source.balance)}
              </p>
            )}
          </div>

          {source && destination && amount > 0 && (
            <div className="card p-3 text-xs text-[var(--color-text-secondary)]">
              {source.name}: {formatCurrency(source.balance)} → {formatCurrency(source.balance - amount)}
              <br />
              {destination.name}: {formatCurrency(destination.balance)} → {formatCurrency(destination.balance + amount)}
            </div>
          )}

          {serverError && <p className="text-[var(--color-danger)] text-xs">{serverError}</p>}

          <button type="submit" disabled={isLoading} className="btn-primary w-full">
            {isLoading ? <><Loader2 size={16} className="animate-spin" /> Transferring...</> : 'Transfer'}
          </button>
        </form>
      )}
    </Modal>
  );
}
