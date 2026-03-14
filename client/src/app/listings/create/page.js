'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { listingsAPI, aiAPI } from '@/lib/api';

const CATEGORIES = ['Textbooks', 'Notes', 'Electronics', 'Other'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

export default function CreateListingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [suggestedPrice, setSuggestedPrice] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', category: 'Textbooks', subject: '', courseCode: '',
    condition: 'Good', price: '', isDonation: false, location: '', university: '', author: '', dropPoint: '',
  });

  useEffect(() => {
    if (authLoading) return; // wait for auth to finish loading
    if (!user) { router.push('/login'); }
    else { setForm((f) => ({ ...f, location: user.location || '', university: user.university || '' })); }
  }, [user, authLoading]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files].slice(0, 5));
    files.forEach((file) => { const reader = new FileReader(); reader.onloadend = () => setPreviews((prev) => [...prev, reader.result].slice(0, 5)); reader.readAsDataURL(file); });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (form.category && form.condition && !form.isDonation) {
      const timer = setTimeout(async () => {
        try { const data = await aiAPI.suggestPrice({ category: form.category, condition: form.condition, subject: form.subject, courseCode: form.courseCode }); setSuggestedPrice(data); } catch {}
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [form.category, form.condition, form.subject]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      images.forEach((img) => formData.append('images', img));
      await listingsAPI.create(formData);
      router.push('/listings');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const inputClass = "w-full bg-white border border-[#e8ddd0] rounded-xl px-5 py-3.5 text-sm text-[#1a1210] placeholder:text-[#8c7e72]/50 focus:outline-none focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/10 transition-all font-body";
  const labelClass = "block text-xs font-bold text-[#8c7e72] uppercase tracking-[0.15em] mb-2 font-body";

  return (
    <div className="min-h-screen bg-[#faf5f0]">
      <div className="bg-[#c41e3a] relative overflow-hidden">
        <div className="absolute inset-0 noise-bg" />
        <div className="relative max-w-3xl mx-auto px-6 py-12">
          <p className="text-white/60 text-sm font-body font-medium tracking-[0.2em] uppercase mb-2">List an Item</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white font-display">Create a Listing</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl p-8 border border-[#e8ddd0] shadow-sm">
          {error && <div className="mb-6 p-4 bg-[#c41e3a]/5 border border-[#c41e3a]/20 rounded-xl text-[#c41e3a] text-sm font-body">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={labelClass}>Title</label>
              <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="e.g. Data Structures & Algorithms — Cormen (4th Ed)" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Condition</label>
                <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} className={inputClass}>
                  {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>Subject</label><input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputClass} placeholder="Computer Science" /></div>
              <div><label className={labelClass}>Course Code</label><input type="text" value={form.courseCode} onChange={(e) => setForm({ ...form, courseCode: e.target.value })} className={inputClass} placeholder="CS301" /></div>
            </div>

            <div><label className={labelClass}>Author / Brand</label><input type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className={inputClass} placeholder="Thomas H. Cormen" /></div>

            {/* Sell / Donate Toggle */}
            <div>
              <div className="flex gap-3 mb-4">
                <button type="button" onClick={() => setForm({ ...form, isDonation: false })}
                  className={`flex-1 py-3.5 rounded-xl text-sm font-bold border-2 transition-all font-body ${
                    !form.isDonation ? 'bg-[#c41e3a] border-[#c41e3a] text-white shadow-md shadow-[#c41e3a]/20' : 'border-[#e8ddd0] text-[#8c7e72] hover:border-[#c41e3a]/30'
                  }`}>💰 Sell</button>
                <button type="button" onClick={() => setForm({ ...form, isDonation: true, price: '' })}
                  className={`flex-1 py-3.5 rounded-xl text-sm font-bold border-2 transition-all font-body ${
                    form.isDonation ? 'bg-[#c41e3a] border-[#c41e3a] text-white shadow-md shadow-[#c41e3a]/20' : 'border-[#e8ddd0] text-[#8c7e72] hover:border-[#c41e3a]/30'
                  }`}>🎁 Donate Free</button>
              </div>
              {!form.isDonation && (
                <div>
                  <label className={labelClass}>Price (₹)</label>
                  <input type="number" required={!form.isDonation} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} placeholder="Enter price" min="0" />
                  {suggestedPrice && (
                    <div className="mt-3 p-4 bg-[#d4a853]/5 border border-[#d4a853]/20 rounded-xl">
                      <p className="text-xs text-[#8c7e72] font-body">
                        🤖 <span className="font-bold text-[#d4a853]">AI Suggestion:</span> ₹{suggestedPrice.range.low} – ₹{suggestedPrice.range.high}
                        <span className="text-[#8c7e72]/60 ml-1">(Based on {suggestedPrice.basedOn === 'historical' ? `${suggestedPrice.dataPoints} similar items` : 'category averages'})</span>
                      </p>
                      <button type="button" onClick={() => setForm({ ...form, price: suggestedPrice.suggested.toString() })}
                        className="mt-1.5 text-xs text-[#c41e3a] hover:text-[#8b1425] font-bold underline font-body">Use ₹{suggestedPrice.suggested}</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div><label className={labelClass}>Description</label><textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass + ' resize-none'} placeholder="Describe the item, its condition, and any relevant details..." /></div>

            {/* Images */}
            <div>
              <label className={labelClass}>Images (up to 5)</label>
              <div className="flex flex-wrap gap-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#e8ddd0] group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute inset-0 bg-[#c41e3a]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
                {previews.length < 5 && (
                  <label className="w-24 h-24 rounded-xl border-2 border-dashed border-[#e8ddd0] flex flex-col items-center justify-center cursor-pointer hover:border-[#c41e3a]/40 transition-colors bg-[#faf5f0]">
                    <svg className="w-6 h-6 text-[#8c7e72]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    <span className="text-[10px] text-[#8c7e72] mt-1 font-body font-medium">Add</span>
                    <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>Location</label><input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} placeholder="City, Campus" /></div>
              <div><label className={labelClass}>University</label><input type="text" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} className={inputClass} placeholder="Your university" /></div>
            </div>

            <div>
              <label className={labelClass}>Drop Point (Optional)</label>
              <input type="text" value={form.dropPoint} onChange={(e) => setForm({ ...form, dropPoint: e.target.value })} className={inputClass} placeholder="e.g. Main Library Foyer, South Gate Security..." maxLength={100} />
              <p className="text-[10px] text-[#8c7e72] mt-1.5 font-body">Suggest a physical location where the buyer can collect this item.</p>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 bg-[#c41e3a] text-white font-bold rounded-full hover:bg-[#8b1425] hover:shadow-xl hover:shadow-[#c41e3a]/20 transition-all disabled:opacity-50 text-sm font-body mt-2">
              {loading ? 'Publishing...' : '🚀 Publish Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
