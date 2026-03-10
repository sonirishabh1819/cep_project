'use client';
import { useState } from 'react';

const CATEGORIES = ['Textbooks', 'Notes', 'Lab Equipment', 'Stationery', 'Electronics', 'Other'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export default function FilterSidebar({ filters, setFilters, onApply }) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onApply(next);
  };

  const clearAll = () => {
    const cleared = { category: '', condition: '', minPrice: '', maxPrice: '', university: '', isDonation: '', sort: 'newest', search: filters.search || '' };
    setFilters(cleared);
    onApply(cleared);
  };

  const content = (
    <div className="space-y-7">
      {/* Search */}
      <div>
        <label className="block text-xs font-bold text-[#8c7e72] uppercase tracking-[0.15em] mb-2.5 font-body">Search</label>
        <input
          type="text"
          value={filters.search || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
          placeholder="Keywords, title, author..."
          className="w-full bg-white border border-[#e8ddd0] rounded-xl px-4 py-3 text-sm text-[#1a1210] placeholder:text-[#8c7e72]/50 focus:outline-none focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/10 transition-all font-body"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-bold text-[#8c7e72] uppercase tracking-[0.15em] mb-2.5 font-body">Category</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => updateFilter('category', filters.category === cat ? '' : cat)}
              className={`px-3.5 py-2 text-xs rounded-full border font-semibold transition-all font-body ${
                filters.category === cat
                  ? 'bg-[#c41e3a] border-[#c41e3a] text-white shadow-md shadow-[#c41e3a]/20'
                  : 'border-[#e8ddd0] text-[#8c7e72] hover:border-[#c41e3a] hover:text-[#c41e3a] bg-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <label className="block text-xs font-bold text-[#8c7e72] uppercase tracking-[0.15em] mb-2.5 font-body">Condition</label>
        <div className="flex flex-wrap gap-2">
          {CONDITIONS.map((cond) => (
            <button
              key={cond}
              onClick={() => updateFilter('condition', filters.condition === cond ? '' : cond)}
              className={`px-3.5 py-2 text-xs rounded-full border font-semibold transition-all font-body ${
                filters.condition === cond
                  ? 'bg-[#c41e3a] border-[#c41e3a] text-white shadow-md shadow-[#c41e3a]/20'
                  : 'border-[#e8ddd0] text-[#8c7e72] hover:border-[#c41e3a] hover:text-[#c41e3a] bg-white'
              }`}
            >
              {cond}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold text-[#8c7e72] uppercase tracking-[0.15em] mb-2.5 font-body">Price Range</label>
        <div className="flex gap-3">
          <input type="number" value={filters.minPrice || ''} onChange={(e) => updateFilter('minPrice', e.target.value)} placeholder="Min"
            className="w-1/2 bg-white border border-[#e8ddd0] rounded-xl px-4 py-2.5 text-sm text-[#1a1210] placeholder:text-[#8c7e72]/50 focus:outline-none focus:border-[#c41e3a] transition-all font-body" />
          <input type="number" value={filters.maxPrice || ''} onChange={(e) => updateFilter('maxPrice', e.target.value)} placeholder="Max"
            className="w-1/2 bg-white border border-[#e8ddd0] rounded-xl px-4 py-2.5 text-sm text-[#1a1210] placeholder:text-[#8c7e72]/50 focus:outline-none focus:border-[#c41e3a] transition-all font-body" />
        </div>
      </div>

      {/* University */}
      <div>
        <label className="block text-xs font-bold text-[#8c7e72] uppercase tracking-[0.15em] mb-2.5 font-body">University</label>
        <input type="text" value={filters.university || ''} onChange={(e) => updateFilter('university', e.target.value)} placeholder="Filter by university..."
          className="w-full bg-white border border-[#e8ddd0] rounded-xl px-4 py-3 text-sm text-[#1a1210] placeholder:text-[#8c7e72]/50 focus:outline-none focus:border-[#c41e3a] transition-all font-body" />
      </div>

      {/* Free Items Toggle */}
      <button
        onClick={() => updateFilter('isDonation', filters.isDonation === 'true' ? '' : 'true')}
        className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all font-body ${
          filters.isDonation === 'true'
            ? 'bg-[#c41e3a]/5 border-[#c41e3a]/30 text-[#c41e3a]'
            : 'border-[#e8ddd0] text-[#8c7e72] hover:border-[#c41e3a]/20 bg-white'
        }`}
      >
        <span className="text-sm font-semibold">🎁 Free Items Only</span>
        <div className={`w-10 h-6 rounded-full transition-all ${filters.isDonation === 'true' ? 'bg-[#c41e3a]' : 'bg-[#e8ddd0]'}`}>
          <div className={`w-4 h-4 mt-1 rounded-full bg-white shadow transition-all ${filters.isDonation === 'true' ? 'ml-[22px]' : 'ml-1'}`} />
        </div>
      </button>

      {/* Sort */}
      <div>
        <label className="block text-xs font-bold text-[#8c7e72] uppercase tracking-[0.15em] mb-2.5 font-body">Sort By</label>
        <select value={filters.sort || 'newest'} onChange={(e) => updateFilter('sort', e.target.value)}
          className="w-full bg-white border border-[#e8ddd0] rounded-xl px-4 py-3 text-sm text-[#1a1210] focus:outline-none focus:border-[#c41e3a] transition-all font-body">
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Clear All */}
      <button onClick={clearAll}
        className="w-full py-3 text-sm text-[#8c7e72] hover:text-[#c41e3a] border border-[#e8ddd0] hover:border-[#c41e3a]/30 rounded-xl transition-all font-body font-medium">
        Clear All Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#c41e3a] rounded-full shadow-2xl shadow-[#c41e3a]/30 flex items-center justify-center text-white hover:bg-[#8b1425] transition-all">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto bg-[#faf5f0] rounded-t-3xl p-6 border-t border-[#e8ddd0]" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-[#e8ddd0] rounded-full mx-auto mb-6" />
            {content}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:block w-72 shrink-0">
        <div className="sticky top-24 bg-white border border-[#e8ddd0] rounded-2xl p-6">
          <h3 className="text-[#1a1210] font-bold font-display text-lg mb-6">Filters</h3>
          {content}
        </div>
      </div>
    </>
  );
}
