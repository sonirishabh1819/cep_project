'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', university: '', location: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
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
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a1210] relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 noise-bg" />
        <div className="absolute top-16 right-8 w-32 h-44 bg-[#c41e3a]/20 rounded-2xl rotate-[6deg]" />
        <div className="absolute bottom-16 left-8 w-44 h-60 bg-[#d4a853]/10 rounded-2xl rotate-[-8deg]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#c41e3a]/5 rounded-full blur-3xl" />
        <div className="relative text-center px-12">
          <h2 className="text-5xl font-bold text-white font-display leading-tight mb-6">
            Join the <em className="italic text-[#d4a853]">Community</em>
          </h2>
          <p className="text-white/40 font-body text-lg max-w-sm mx-auto">
            Share, discover, and save on educational materials with students near you.
          </p>
          <div className="flex justify-center gap-6 mt-10">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#c41e3a] font-display">8K+</div>
              <div className="text-xs text-white/30 font-body mt-1 uppercase tracking-wider">Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#d4a853] font-display">150+</div>
              <div className="text-xs text-white/30 font-body mt-1 uppercase tracking-wider">Universities</div>
            </div>
          </div>
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
            <h1 className="text-4xl font-bold text-[#1a1210] font-display">Create Account</h1>
            <p className="text-[#8c7e72] mt-2 font-body">Join the LearnShare community today</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-[#c41e3a]/5 border border-[#c41e3a]/20 rounded-xl text-[#c41e3a] text-sm font-body">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#8c7e72] uppercase tracking-widest mb-2 font-body">Full Name</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white border border-[#e8ddd0] rounded-xl px-5 py-3.5 text-sm text-[#1a1210] placeholder:text-[#8c7e72]/50 focus:outline-none focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/10 transition-all font-body" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8c7e72] uppercase tracking-widest mb-2 font-body">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white border border-[#e8ddd0] rounded-xl px-5 py-3.5 text-sm text-[#1a1210] placeholder:text-[#8c7e72]/50 focus:outline-none focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/10 transition-all font-body" placeholder="you@university.edu" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8c7e72] uppercase tracking-widest mb-2 font-body">Password</label>
              <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-white border border-[#e8ddd0] rounded-xl px-5 py-3.5 text-sm text-[#1a1210] placeholder:text-[#8c7e72]/50 focus:outline-none focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/10 transition-all font-body" placeholder="At least 6 characters" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#8c7e72] uppercase tracking-widest mb-2 font-body">University</label>
                <input type="text" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })}
                  className="w-full bg-white border border-[#e8ddd0] rounded-xl px-4 py-3.5 text-sm text-[#1a1210] placeholder:text-[#8c7e72]/50 focus:outline-none focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/10 transition-all font-body" placeholder="IIT Delhi" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#8c7e72] uppercase tracking-widest mb-2 font-body">Location</label>
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full bg-white border border-[#e8ddd0] rounded-xl px-4 py-3.5 text-sm text-[#1a1210] placeholder:text-[#8c7e72]/50 focus:outline-none focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/10 transition-all font-body" placeholder="New Delhi" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-[#c41e3a] text-white font-bold rounded-full hover:bg-[#8b1425] hover:shadow-xl hover:shadow-[#c41e3a]/20 transition-all disabled:opacity-50 text-sm font-body mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#8c7e72] font-body">
              Already have an account?{' '}
              <Link href="/login" className="text-[#c41e3a] hover:text-[#8b1425] font-semibold">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
