'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSignInPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Sign-in failed');
        return;
      }

      router.push('/admin');
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[#0b1220]">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#0f172a] p-7 shadow-2xl">
        <h1 className="text-2xl font-semibold mb-2 tracking-tight">Admin Sign In</h1>
        <p className="text-slate-400 mb-6">Secure access to your route-based CMS panel.</p>

        <label className="block mb-4">
          <span className="text-sm text-slate-300">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full mt-2 rounded-lg px-3 py-2 bg-[#020617] border border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="Enter admin password"
            required
          />
        </label>

        {error && <p className="text-sm text-red-300 mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 rounded-lg bg-slate-200 text-slate-900 font-medium hover:bg-white disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </main>
  );
}
