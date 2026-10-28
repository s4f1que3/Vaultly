'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CreditCard, ArrowLeftRight, Target,
  PiggyBank, BarChart3, Settings, LogOut, RefreshCw, History, Wallet, Landmark
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { href: '/bank-accounts', icon: Landmark, label: 'Accounts' },
  { href: '/cards', icon: CreditCard, label: 'Cards' },
  { href: '/budgets', icon: PiggyBank, label: 'Budgets' },
  { href: '/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/history', icon: History, label: 'History' },
  { href: '/savings', icon: Wallet, label: 'Savings' },
  { href: '/goals', icon: Target, label: 'Goals' },
  { href: '/subscriptions', icon: RefreshCw, label: 'Subscriptions' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-[220px] min-h-screen border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-6 fixed left-0 top-0 z-40">
      <Link href="/dashboard" className="flex items-center gap-3 px-2 mb-8">
        <Image src="/logo.png" alt="Vaultly" width={32} height={32} className="rounded-lg" />
        <span className="font-bold text-base text-[var(--color-text-primary)] tracking-tight">Vaultly</span>
      </Link>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link key={href} href={href} className={`nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleSignOut}
        className="nav-item text-[var(--color-text-muted)] hover:text-[var(--color-danger)] w-full mt-4"
      >
        <LogOut size={18} />
        <span>Sign out</span>
      </button>
    </aside>
  );
}

function MobileNav() {
  const pathname = usePathname();
  const MOBILE_ITEMS = NAV_ITEMS.slice(0, 5);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around py-2">
        {MOBILE_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all relative ${
                isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 lg:ml-[220px] pb-20 lg:pb-0 flex flex-col min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            {children}
          </motion.div>
        </AnimatePresence>
        <Footer />
      </main>
      <MobileNav />
    </div>
  );
}
