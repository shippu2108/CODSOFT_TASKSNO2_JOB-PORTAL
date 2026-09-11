'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (res.error) {
      setLoading(false);
      setError('Invalid email or password');
      return;
    }

    const sessionRes = await fetch('/api/auth/session');
    const session = await sessionRes.json();

    if (session.user.role === 'CANDIDATE') {
      router.push('/dashboard/candidate');
    } else if (session.user.role === 'RECRUITER') {
      router.push('/dashboard/recruiter');
    } else if (session.user.role === 'ADMIN') {
      router.push('/dashboard/admin');
    }
  };

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm animate-rise">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-2xl font-semibold text-text-hi">
            CareerHub
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8">
          <h1 className="font-display text-xl font-medium mb-6 text-text-hi">Welcome back</h1>

          {error && (
            <p className="text-sm text-rust bg-rust/10 border border-rust/30 rounded-lg px-3 py-2 mb-4">
              {error}
            </p>
          )}

          <div className="grid gap-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-white/5 border border-line rounded-lg p-2.5 text-text-hi placeholder-text-soft focus:outline-none focus:border-brass focus:bg-white/10 transition-base"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full bg-white/5 border border-line rounded-lg p-2.5 text-text-hi placeholder-text-soft focus:outline-none focus:border-brass focus:bg-white/10 transition-base"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-brass text-ink p-2.5 rounded-lg font-medium glow-on-hover disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="mt-4 text-sm text-center text-text-soft">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-brass font-medium">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}