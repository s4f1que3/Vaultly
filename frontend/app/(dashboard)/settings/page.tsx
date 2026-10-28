'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Shield, ChevronRight, Loader2, Check, Mail, Eye, EyeOff, X,
} from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { createClient } from '@/lib/supabase/client';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Section { id: string; label: string; icon: React.ElementType }
const SECTIONS: Section[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
];

const CURRENCIES = ['USD', 'BBD', 'XCD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR', 'CHF', 'SGD'];

export default function SettingsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('profile');
  const [profile, setProfile] = useState({ full_name: '', email: '', currency: 'USD' });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({ currentEmail: '', password: '', newEmail: '' });
  const [showEmailPass, setShowEmailPass] = useState(false);
  const [emailChanging, setEmailChanging] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setProfile({
          full_name: data.user.user_metadata?.full_name || '',
          email: data.user.email || '',
          currency: data.user.user_metadata?.currency || 'USD',
        });
      }
    });

  }, []);

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      await supabase.auth.updateUser({ data: { full_name: profile.full_name, currency: profile.currency } });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangeEmail = async () => {
    setEmailError('');
    if (!emailForm.currentEmail || !emailForm.password || !emailForm.newEmail) {
      setEmailError('All fields are required');
      return;
    }
    setEmailChanging(true);
    try {
      await api.post('/auth/change-email', emailForm);
      setEmailSuccess(true);
      setProfile((p) => ({ ...p, email: emailForm.newEmail }));
      setTimeout(() => {
        setShowEmailModal(false);
        setEmailSuccess(false);
        setEmailForm({ currentEmail: '', password: '', newEmail: '' });
      }, 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to change email';
      setEmailError(msg);
    } finally {
      setEmailChanging(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="px-4 py-6 sm:px-6 max-w-4xl mx-auto">
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="w-52 flex-shrink-0">
          <div className="card p-2 space-y-1">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeSection === id
                    ? 'bg-[var(--color-accent-dim)] text-[var(--color-accent)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <Icon size={16} />
                {label}
                <ChevronRight size={14} className="ml-auto opacity-50" />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeSection === 'profile' && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="card p-6 space-y-5">
              <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Profile Information</h2>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Full name</label>
                <input
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="input-base"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Email</label>
                <div className="flex gap-2">
                  <input value={profile.email} disabled className="input-base opacity-50 cursor-not-allowed flex-1" />
                  <button
                    onClick={() => { setShowEmailModal(true); setEmailError(''); setEmailSuccess(false); }}
                    className="btn-ghost text-sm px-3 flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Mail size={14} /> Change
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Default currency</label>
                <select
                  value={profile.currency}
                  onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                  className="input-base"
                >
                  {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button onClick={saveProfile} disabled={isSaving} className="btn-primary text-sm">
                {isSaving ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : saved ? <><Check size={15} /> Saved!</> : 'Save changes'}
              </button>
            </motion.div>
          )}


          {activeSection === 'security' && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="card p-6 space-y-4">
              <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Security</h2>
              <div className="border border-[var(--color-border)] rounded-xl p-4">
                <p className="text-sm font-medium text-[var(--color-text-primary)]">Change password</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1 mb-3">Update your password to keep your account secure</p>
                <button className="btn-ghost text-sm">Send password reset email</button>
              </div>
              <div className="border border-[rgba(239,68,68,0.2)] rounded-xl p-4">
                <p className="text-sm font-medium text-[var(--color-danger)]">Danger zone</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1 mb-3">These actions are irreversible. Please proceed with caution.</p>
                <button onClick={handleSignOut} className="btn-ghost text-sm border-[rgba(239,68,68,0.3)] text-[var(--color-danger)]">Sign out of all devices</button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Change email modal */}
      <AnimatePresence>
        {showEmailModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setShowEmailModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
            >
              <div className="glass-strong rounded-2xl p-6 w-full max-w-md space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Change email address</h2>
                  <button onClick={() => setShowEmailModal(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                    <X size={18} />
                  </button>
                </div>

                {emailSuccess ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 space-y-2">
                    <Check size={36} className="mx-auto text-[var(--color-accent)]" />
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">Email updated successfully!</p>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Current email</label>
                      <input type="email" value={emailForm.currentEmail} onChange={(e) => setEmailForm((f) => ({ ...f, currentEmail: e.target.value }))} placeholder="your@current-email.com" className="input-base" autoComplete="email" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">Password</label>
                      <div className="relative">
                        <input type={showEmailPass ? 'text' : 'password'} value={emailForm.password} onChange={(e) => setEmailForm((f) => ({ ...f, password: e.target.value }))} placeholder="Your current password" className="input-base pr-10" autoComplete="current-password" />
                        <button type="button" onClick={() => setShowEmailPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                          {showEmailPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">New email</label>
                      <input type="email" value={emailForm.newEmail} onChange={(e) => setEmailForm((f) => ({ ...f, newEmail: e.target.value }))} placeholder="your@new-email.com" className="input-base" autoComplete="off" />
                    </div>

                    {emailError && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] rounded-lg p-3 text-sm text-[var(--color-danger)] break-words">
                        {emailError}
                      </motion.div>
                    )}

                    <div className="flex gap-2 pt-1">
                      <button onClick={() => setShowEmailModal(false)} className="btn-ghost text-sm flex-1">Cancel</button>
                      <button onClick={handleChangeEmail} disabled={emailChanging} className="btn-primary text-sm flex-1">
                        {emailChanging ? <><Loader2 size={15} className="animate-spin" /> Updating...</> : 'Update email'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
