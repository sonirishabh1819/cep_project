'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { listingsAPI, messagesAPI, reviewsAPI } from '@/lib/api';
import Link from 'next/link';

export default function ListingDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => { loadListing(); }, [id]);

  const loadListing = async () => {
    try {
      const data = await listingsAPI.getOne(id);
      setListing(data);
      if (data.seller?._id) { const rev = await reviewsAPI.getUserReviews(data.seller._id); setReviews(rev); }
    } catch { router.push('/listings'); }
    finally { setLoading(false); }
  };

  const handleContact = async () => {
    if (!user) return router.push('/login');
    if (!messageText.trim()) return;
    setSending(true);
    try { await messagesAPI.startConversation({ participantId: listing.seller._id, listingId: listing._id, message: messageText }); router.push('/messages'); }
    catch (err) { alert(err.message); }
    finally { setSending(false); }
  };

  const handleMarkSold = async () => { try { await listingsAPI.markAsSold(id); loadListing(); } catch (err) { alert(err.message); } };
  const handleDelete = async () => { if (!confirm('Delete this listing?')) return; try { await listingsAPI.delete(id); router.push('/listings'); } catch (err) { alert(err.message); } };

  const getImageUrl = (img) => { const url = img?.url || ''; return url.startsWith('/uploads/') ? `http://localhost:5000${url}` : url; };

  if (loading) return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square shimmer rounded-2xl" />
        <div className="space-y-4"><div className="h-8 w-3/4 shimmer rounded-full" /><div className="h-10 w-1/3 shimmer rounded-full" /><div className="h-32 shimmer rounded-2xl" /></div>
      </div>
    </div>
  );

  if (!listing) return null;
  const isOwner = user && listing.seller?._id === user._id;

  return (
    <div className="min-h-screen bg-[#faf5f0]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[#8c7e72] hover:text-[#c41e3a] mb-8 text-sm transition-colors font-body font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-[#e8ddd0] mb-4">
              {listing.images?.length > 0 ? (
                <img src={getImageUrl(listing.images[selectedImage])} alt={listing.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-24 h-24 text-[#c41e3a]/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
              )}
            </div>
            {listing.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {listing.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${selectedImage === i ? 'border-[#c41e3a]' : 'border-[#e8ddd0] opacity-60 hover:opacity-100'}`}>
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 text-[10px] font-bold bg-[#faf5f0] text-[#8c7e72] rounded-full font-body uppercase tracking-wider">{listing.category}</span>
              <span className="px-3 py-1 text-[10px] font-bold bg-[#faf5f0] text-[#8c7e72] rounded-full font-body uppercase tracking-wider">{listing.condition}</span>
              {listing.isDonation && <span className="px-3 py-1 text-[10px] font-bold bg-[#c41e3a] text-white rounded-full font-body uppercase tracking-wider">Free</span>}
              {listing.status === 'sold' && <span className="px-3 py-1 text-[10px] font-bold bg-[#1a1210] text-white rounded-full font-body uppercase tracking-wider">Sold</span>}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-[#1a1210] font-display leading-tight mb-4">{listing.title}</h1>

            <div className="text-4xl font-bold mb-8 font-display">
              {listing.isDonation ? <span className="text-[#c41e3a]">Free — Donation</span> : <span className="text-[#1a1210]">₹{listing.price}</span>}
            </div>

            <div className="bg-[#faf5f0] rounded-2xl p-5 mb-6 space-y-3 border border-[#e8ddd0]">
              {listing.subject && <div className="flex justify-between text-sm font-body"><span className="text-[#8c7e72]">Subject</span><span className="text-[#1a1210] font-medium">{listing.subject}</span></div>}
              {listing.courseCode && <div className="flex justify-between text-sm font-body"><span className="text-[#8c7e72]">Course Code</span><span className="text-[#1a1210] font-medium">{listing.courseCode}</span></div>}
              {listing.author && <div className="flex justify-between text-sm font-body"><span className="text-[#8c7e72]">Author</span><span className="text-[#1a1210] font-medium">{listing.author}</span></div>}
              {listing.location && <div className="flex justify-between text-sm font-body"><span className="text-[#8c7e72]">Location</span><span className="text-[#1a1210] font-medium">📍 {listing.location}</span></div>}
              {listing.university && <div className="flex justify-between text-sm font-body"><span className="text-[#8c7e72]">University</span><span className="text-[#1a1210] font-medium">🏫 {listing.university}</span></div>}
              {listing.dropPoint && (
                <div className="flex flex-col gap-1 mt-2 pt-3 border-t border-[#e8ddd0]">
                  <span className="text-xs font-bold text-[#c41e3a] uppercase tracking-widest font-body">📦 Drop Point Collection</span>
                  <span className="text-[#1a1210] font-bold font-body bg-[#c41e3a]/5 px-3 py-2 rounded-lg border border-[#c41e3a]/10 inline-block w-fit">{listing.dropPoint}</span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-xs font-bold text-[#8c7e72] uppercase tracking-widest mb-3 font-body">Description</h3>
              <p className="text-[#2d2118] text-sm leading-relaxed whitespace-pre-wrap font-body">{listing.description}</p>
            </div>

            {/* Seller */}
            <Link href={`/profile/${listing.seller?._id}`} className="bg-white rounded-2xl p-5 mb-6 flex items-center gap-4 border border-[#e8ddd0] hover:border-[#c41e3a]/30 transition-all block">
              <div className="w-12 h-12 rounded-full bg-[#c41e3a] flex items-center justify-center text-lg text-white font-bold shrink-0 font-body">
                {listing.seller?.name?.[0] || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#1a1210] font-bold font-body truncate">{listing.seller?.name}</p>
                <div className="flex items-center gap-3 text-xs text-[#8c7e72] font-body">
                  {listing.seller?.university && <span>🏫 {listing.seller.university}</span>}
                  <span>⭐ {listing.seller?.reputationScore || 0}</span>
                  <span>{listing.seller?.totalTransactions || 0} transactions</span>
                </div>
              </div>
            </Link>

            {/* Actions */}
            {isOwner ? (
              <div className="flex gap-3">
                {listing.status === 'available' && (
                  <button onClick={handleMarkSold} className="flex-1 py-3.5 bg-[#d4a853]/10 border border-[#d4a853]/30 text-[#d4a853] font-bold rounded-xl hover:bg-[#d4a853]/20 transition-all text-sm font-body">Mark as Sold</button>
                )}
                <button onClick={handleDelete} className="flex-1 py-3.5 bg-[#c41e3a]/5 border border-[#c41e3a]/20 text-[#c41e3a] font-bold rounded-xl hover:bg-[#c41e3a]/10 transition-all text-sm font-body">Delete</button>
              </div>
            ) : listing.status === 'available' ? (
              <div className="space-y-3">
                <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} rows={3}
                  className="w-full bg-white border border-[#e8ddd0] rounded-xl px-5 py-3 text-sm text-[#1a1210] placeholder:text-[#8c7e72]/50 focus:outline-none focus:border-[#c41e3a] transition-all resize-none font-body"
                  placeholder={`Hi, I'm interested in "${listing.title}"...`} />
                <button onClick={handleContact} disabled={sending || !messageText.trim()}
                  className="w-full py-3.5 bg-[#c41e3a] text-white font-bold rounded-full hover:bg-[#8b1425] hover:shadow-xl hover:shadow-[#c41e3a]/20 transition-all disabled:opacity-40 text-sm font-body">
                  {sending ? 'Sending...' : '💬 Contact Seller'}
                </button>
              </div>
            ) : null}

            {reviews.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xs font-bold text-[#8c7e72] uppercase tracking-widest mb-4 font-body">Seller Reviews</h3>
                <div className="space-y-3">
                  {reviews.slice(0, 3).map((r) => (
                    <div key={r._id} className="bg-white rounded-xl p-4 border border-[#e8ddd0]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[#d4a853] text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                        <span className="text-xs text-[#8c7e72] font-body">{r.reviewer?.name}</span>
                      </div>
                      {r.comment && <p className="text-sm text-[#2d2118] font-body">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
