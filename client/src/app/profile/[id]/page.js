'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { authAPI, reviewsAPI } from '@/lib/api';
import { listingsAPI } from '@/lib/api';
import ListingCard from '@/components/ListingCard';

export default function UserProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [tab, setTab] = useState('listings');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      const [userData, revData, listData] = await Promise.all([
        authAPI.getUserProfile(id),
        reviewsAPI.getUserReviews(id),
        listingsAPI.getAll({ seller: id, limit: 20 }),
      ]);
      setProfile(userData);
      setReviews(revData);
      setListings(listData.listings || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="h-40 shimmer rounded-2xl mb-8" />
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-64 shimmer rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!profile) return <div className="text-center py-20 text-gray-400">User not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="glass rounded-3xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-3xl text-gray-900 font-bold shadow-xl">
            {profile.name?.[0] || '?'}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-2 text-sm">
              {profile.university && <span className="text-gray-400">🏫 {profile.university}</span>}
              {profile.location && <span className="text-gray-400">📍 {profile.location}</span>}
              <span className="text-yellow-400">⭐ {profile.reputationScore || 0}</span>
              <span className="text-gray-400">📦 {profile.totalTransactions || 0} transactions</span>
            </div>
            {profile.bio && <p className="text-sm text-gray-400 mt-3">{profile.bio}</p>}
          </div>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-800/30 rounded-xl p-1 mb-8">
        {[
          { key: 'listings', label: 'Listings', count: listings.length },
          { key: 'reviews', label: 'Reviews', count: reviews.length },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${tab === t.key ? 'bg-gray-700/50 text-white' : 'text-gray-400 hover:text-gray-300'}`}>
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {tab === 'listings' ? (
        listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((l) => <ListingCard key={l._id} listing={l} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">No listings</div>
        )
      ) : (
        reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="glass rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-yellow-400 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  <span className="text-xs text-gray-500">{r.reviewer?.name}</span>
                </div>
                {r.comment && <p className="text-sm text-gray-300">{r.comment}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">No reviews yet</div>
        )
      )}
    </div>
  );
}
