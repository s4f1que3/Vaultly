'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'details' | 'verify'>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (name.trim().length < 2) return setError('Name must be at least 2 characters');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Invalid email address');
    if (password.length < 8) return setError('Password must be at least 8 characters');

    setIsSubmitting(true);
    const supabase = createClient();
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name.trim() } },
    });
    setIsSubmitting(false);

    if (signupError) return setError(signupError.message);
    if (data.user && data.user.identities?.length === 0) {
      return setError('An account with this email already exists. Please log in instead.');
    }
    if (data.session) return router.push('/dashboard');
    setStep('verify');
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (code.length !== 6) return setError('Enter the 6-digit code');

    setIsSubmitting(true);
    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
    setIsSubmitting(false);

    if (verifyError) return setError(verifyError.message);
    router.push('/dashboard');
  };

  const handleResend = async () => {
    setError('');
    setMessage('');
    const supabase = createClient();
    const { error: resendError } = await supabase.auth.resend({ type: 'signup', email });
    if (resendError) return setError(resendError.message);
    setMessage('Code resent — check your inbox.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card w-full max-w-md p-8"
      >
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
          {step === 'details' ? 'Create your account' : 'Check your email'}
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
          {step === 'details'
            ? 'Free to use. No payment needed.'
            : `We sent a 6-digit code to ${email}.`}
        </p>

        {step === 'details' ? (
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-base"
              autoComplete="name"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-base"
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password (min. 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-base"
              autoComplete="new-password"
            />
            {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2">
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              Create account
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <input
              type="text"
              inputMode="numeric"
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="input-base"
              autoComplete="one-time-code"
            />
            {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
            {message && <p className="text-sm text-[var(--color-text-secondary)]">{message}</p>}
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2">
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              Verify and continue
            </button>
            <button type="button" onClick={handleResend} className="w-full text-sm text-[var(--color-accent)] hover:underline">
              Resend code
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--color-accent)] font-medium hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
