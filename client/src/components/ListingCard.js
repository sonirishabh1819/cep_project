'use client';
import Link from 'next/link';

export default function ListingCard({ listing }) {
  const imageUrl = listing.images?.[0]?.url || '';
  const isLocalUpload = imageUrl.startsWith('/uploads/');
  const fullImageUrl = isLocalUpload ? `http://localhost:5000${imageUrl}` : imageUrl;

  return (
    <Link href={`/listings/${listing._id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-[#e8ddd0] hover:border-[#c41e3a]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#c41e3a]/8 hover:-translate-y-2">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#f0e6d9]">
          {listing.images?.length > 0 ? (
            <img
              src={fullImageUrl}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <svg className="w-12 h-12 text-[#c41e3a]/20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-xs text-[#8c7e72] mt-2 font-body">{listing.category}</span>
              </div>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {listing.isDonation && (
              <span className="px-3 py-1 text-xs font-bold bg-[#c41e3a] text-white rounded-full shadow-lg shadow-[#c41e3a]/30 font-body uppercase tracking-wider">
                Free
              </span>
            )}
            {listing.status === 'sold' && (
              <span className="px-3 py-1 text-xs font-bold bg-[#1a1210] text-white rounded-full font-body uppercase tracking-wider">
                Sold
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 text-[10px] font-semibold bg-white/90 text-[#2d2118] rounded-full backdrop-blur-sm font-body uppercase tracking-wider">
              {listing.condition}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="text-[#1a1210] font-semibold text-sm line-clamp-2 group-hover:text-[#c41e3a] transition-colors font-body leading-snug">
              {listing.title}
            </h3>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className={`text-xl font-bold font-display ${listing.isDonation ? 'text-[#c41e3a]' : 'text-[#1a1210]'}`}>
              {listing.isDonation ? 'Free' : `₹${listing.price}`}
            </span>
            <span className="text-[10px] text-[#8c7e72] bg-[#faf5f0] px-2.5 py-1 rounded-full font-body uppercase tracking-wider font-medium">
              {listing.category}
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#f0e6d9]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#c41e3a] flex items-center justify-center text-[10px] text-white font-bold font-body">
                {listing.seller?.name?.[0] || '?'}
              </div>
              <span className="text-xs text-[#8c7e72] truncate max-w-[90px] font-body">{listing.seller?.name || 'Unknown'}</span>
            </div>
            {listing.location && (
              <span className="text-[11px] text-[#8c7e72] font-body flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {listing.location}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
