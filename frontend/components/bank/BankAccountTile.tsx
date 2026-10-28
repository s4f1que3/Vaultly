'use client';

import { Landmark } from 'lucide-react';
import { BankAccount, Card } from '@/types';
import { formatCurrency, maskCardNumber } from '@/lib/utils/formatters';

// Same family of colours as the credit card gradients, so accounts sit well next to cards
const ACCOUNT_THEMES = [
  {
    gradient: 'linear-gradient(135deg, #0d2b0d 0%, #1a4a1a 45%, #2d5a2d 75%, #0d2b0d 100%)',
    accent: '#57c93c',
  },
  {
    gradient: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a3e 50%, #0d0d1a 100%)',
    accent: '#3b82f6',
  },
  {
    gradient: 'linear-gradient(135deg, #1a0e05 0%, #3d2010 50%, #1a0e05 100%)',
    accent: '#f59e0b',
  },
  {
    gradient: 'linear-gradient(135deg, #150530 0%, #2d0f5e 50%, #150530 100%)',
    accent: '#a855f7',
  },
];

// Stable colour per account, derived from its id so it never changes between visits
export function accountTheme(id?: string) {
  const seed = [...(id ?? '')].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return ACCOUNT_THEMES[seed % ACCOUNT_THEMES.length];
}

interface BankAccountTileProps {
  account: Pick<BankAccount, 'name' | 'balance'> & { id?: string };
  card?: Card | null;
  size?: 'md' | 'lg';
}

export default function BankAccountTile({ account, card, size = 'md' }: BankAccountTileProps) {
  const theme = accountTheme(account.id);
  const large = size === 'lg';

  return (
    <div
      className={`relative overflow-hidden text-white flex flex-col justify-between ${large ? 'p-7 min-h-[200px]' : 'p-5 min-h-[170px]'}`}
      style={{
        background: theme.gradient,
        borderRadius: 20,
        boxShadow: '0 20px 50px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.05)',
      }}
    >
      {/* Decorative rings, same language as the credit card */}
      <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full border border-white/5 bg-white/[0.03] pointer-events-none" />
      <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full border border-white/[0.04] bg-white/[0.02] pointer-events-none" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.12em] text-white/50 truncate">
            {account.name || 'New account'}
          </p>
          <p className={`font-display font-bold tracking-tight mt-1 ${large ? 'text-4xl' : 'text-2xl'}`}>
            {formatCurrency(account.balance || 0)}
          </p>
        </div>
        <div
          className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-white/10"
          style={{ color: theme.accent }}
        >
          <Landmark size={18} />
        </div>
      </div>

      <div className="relative flex items-end justify-between gap-4">
        {card ? (
          <p className={`font-mono text-white/80 tracking-[0.18em] ${large ? 'text-sm' : 'text-xs'}`}>
            {maskCardNumber(card.card_number)}
          </p>
        ) : (
          <p className="text-xs text-white/40">No card linked</p>
        )}
        {card && (
          <span className="text-[10px] uppercase tracking-wider text-white/50">{card.card_type}</span>
        )}
      </div>
    </div>
  );
}
