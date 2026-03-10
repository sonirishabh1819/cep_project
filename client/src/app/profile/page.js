'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { listingsAPI, reviewsAPI } from '@/lib/api';
import ListingCard from '@/components/ListingCard';

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [myListings, setMyListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [tab, setTab] = useState('listings');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login'); return; }
    loadData();
  }, [user, authLoading]);

  const loadData = async () => {
    try {
      const [listings, revs] = await Promise.all([listingsAPI.getMine(), reviewsAPI.getUserReviews(user._id)]);
      setMyListings(listings); setReviews(revs);
    } catch {} finally { setLoading(false); }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#faf5f0]">
      <div className="bg-[#1a1210] relative overflow-hidden">
        <div className="absolute inset-0 noise-bg" />
        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 py-16">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-[#c41e3a] flex items-center justify-center text-4xl text-white font-bold shadow-2xl shadow-[#c41e3a]/30 font-display">
              {user.name?.[0] || '?'}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-bold text-white font-display">{user.name}</h1>
              <p className="text-white/40 text-sm font-body">{user.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3 text-sm font-body">
                {user.university && <span className="text-white/50">🏫 {user.university}</span>}
                {user.location && <span className="text-white/50">📍 {user.location}</span>}
                <span className="text-[#d4a853]">⭐ {user.reputationScore || 0}</span>
              </div>
            </div>
            <button onClick={logout} className="px-5 py-2.5 text-sm text-white/60 border border-white/10 rounded-full hover:text-[#c41e3a] hover:border-[#c41e3a]/30 transition-all font-body">Logout</button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-10">
        <div className="flex gap-1 bg-white rounded-xl p-1 mb-10 border border-[#e8ddd0]">
          {[{ key: 'listings', label: 'My Listings', count: myListings.length }, { key: 'reviews', label: 'Reviews', count: reviews.length }].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all font-body ${tab === t.key ? 'bg-[#c41e3a] text-white shadow-md' : 'text-[#8c7e72] hover:text-[#c41e3a]'}`}>
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <div key={i} className="h-64 shimmer rounded-2xl" />)}
          </div>
        ) : tab === 'listings' ? (
          myListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myListings.map((l) => <ListingCard key={l._id} listing={l} />)}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#e8ddd0]">
              <div className="text-5xl mb-3">📦</div>
              <p className="text-[#8c7e72] mb-6 font-body">You haven&apos;t listed anything yet</p>
              <button onClick={() => router.push('/listings/create')} className="px-8 py-3 bg-[#c41e3a] text-white font-bold rounded-full text-sm font-body hover:bg-[#8b1425] transition-all">Create Your First Listing</button>
            </div>
          )
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="bg-white rounded-2xl p-6 border border-[#e8ddd0]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[#d4a853] text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  <span className="text-xs text-[#8c7e72] font-body">{r.reviewer?.name}</span>
                </div>
                {r.comment && <p className="text-sm text-[#2d2118] font-body">{r.comment}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#e8ddd0]">
            <div className="text-5xl mb-3">⭐</div>
            <p className="text-[#8c7e72] font-body">No reviews yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
