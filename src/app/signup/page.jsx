'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'CANDIDATE' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      setError(data.error || 'Signup failed');
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
          <h1 className="font-display text-xl font-medium mb-6 text-text-hi">Create your account</h1>

          {error && (
            <p className="text-sm text-rust bg-rust/10 border border-rust/30 rounded-lg px-3 py-2 mb-4">
              {error}
            </p>
          )}

          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-white/5 border border-line rounded-lg p-2.5 text-text-hi placeholder-text-soft focus:outline-none focus:border-brass focus:bg-white/10 transition-base"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

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

            <select
              className="w-full bg-white/5 border border-line rounded-lg p-2.5 text-text-hi focus:outline-none focus:border-brass transition-base [&>option]:bg-ink-raised"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="CANDIDATE">I&apos;m looking for a job</option>
              <option value="RECRUITER">I&apos;m hiring</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-brass text-ink p-2.5 rounded-lg font-medium glow-on-hover disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

          <p className="mt-4 text-sm text-center text-text-soft">
            Already have an account?{' '}
            <Link href="/login" className="text-brass font-medium">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}