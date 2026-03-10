'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#c41e3a] relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 noise-bg" />
        <div className="absolute top-20 left-10 w-48 h-64 bg-white/5 rounded-2xl rotate-[-12deg]" />
        <div className="absolute bottom-20 right-10 w-40 h-56 bg-white/10 rounded-2xl rotate-[8deg]" />
        <div className="relative text-center px-12">
          <h2 className="text-5xl font-bold text-white font-display leading-tight mb-6">
            Welcome <em className="italic font-normal">Back</em>
          </h2>
          <p className="text-white/60 font-body text-lg">
            Continue sharing knowledge and making education accessible.
          </p>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#faf5f0]">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <Link href="/" className="inline-flex items-center gap-2 text-[#8c7e72] hover:text-[#c41e3a] font-body text-sm mb-8 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back to home
            </Link>
            <h1 className="text-4xl font-bold text-[#1a1210] font-display">Sign In</h1>
            <p className="text-[#8c7e72] mt-2 font-body">Enter your credentials to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-[#c41e3a]/5 border border-[#c41e3a]/20 rounded-xl text-[#c41e3a] text-sm font-body">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#8c7e72] uppercase tracking-widest mb-2 font-body">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white border border-[#e8ddd0] rounded-xl px-5 py-3.5 text-sm text-[#1a1210] placeholder:text-[#8c7e72]/50 focus:outline-none focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/10 transition-all font-body"
                placeholder="you@university.edu"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8c7e72] uppercase tracking-widest mb-2 font-body">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-white border border-[#e8ddd0] rounded-xl px-5 py-3.5 text-sm text-[#1a1210] placeholder:text-[#8c7e72]/50 focus:outline-none focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/10 transition-all font-body"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#c41e3a] text-white font-bold rounded-full hover:bg-[#8b1425] hover:shadow-xl hover:shadow-[#c41e3a]/20 transition-all disabled:opacity-50 text-sm font-body"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#8c7e72] font-body">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-[#c41e3a] hover:text-[#8b1425] font-semibold">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
