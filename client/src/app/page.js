'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import ListingCard from '@/components/ListingCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import { listingsAPI } from '@/lib/api';

const STATS = [
  { label: 'Platform Fees', value: '0', suffix: '%' },
  { label: 'Student Verified', value: '100', suffix: '%' },
  { label: 'Direct Access', value: '24', suffix: '/7' },
  { label: 'Learning Potential', value: '∞', suffix: '' },
];

const CATEGORIES = [
  { name: 'Textbooks', icon: '📖', desc: 'Course textbooks & reference guides' },
  { name: 'Notes', icon: '📝', desc: 'Handwritten & digital study notes' },
  { name: 'Electronics', icon: '💻', desc: 'Calculators, tablets & more' },
  { name: 'Other', icon: '📦', desc: 'Everything else you need' },
];

const MARQUEE_TEXT = 'TEXTBOOKS • NOTES • ELECTRONICS • STUDY GUIDES • CALCULATORS • REFERENCE BOOKS • MATERIAL • ';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: 'easeOut' } }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 120]); // parallax shift

  useEffect(() => {
    listingsAPI.getAll({ limit: 8, sort: 'newest' })
      .then(data => setTrending(data.listings || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="-mt-16 bg-[#faf5f0]">
      {/* ── Hero ── */}
      <section ref={heroRef} className="relative min-h-screen pt-16 flex items-center overflow-hidden">
        {/* Parallax BG */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 bg-[#c41e3a] will-change-transform" />
        <div className="absolute inset-0 noise-bg" />

        {/* Floating decoration */}
        <div className="absolute top-20 left-[5%] w-48 h-64 bg-white/10 rounded-2xl rotate-[-8deg] animate-floatSlow hidden lg:block" />
        <div className="absolute bottom-20 right-[8%] w-40 h-56 bg-white/5 rounded-2xl rotate-[5deg] animate-float hidden lg:block" />
        <div className="absolute top-1/3 right-[15%] w-24 h-32 bg-[#d4a853]/20 rounded-xl rotate-[12deg] animate-floatSlow hidden xl:block" />

        {/* Floating cards */}
        {[
          { style: 'top-28 left-[3%]', rotate: '-6deg', delay: 0.3, icon: '📚', color: 'from-[#d4a853] to-[#b8912e]' },
          { style: 'bottom-32 left-[10%]', rotate: '4deg', delay: 0.5, icon: '📖', color: 'from-[#c41e3a] to-[#8b1425]' },
          { style: 'top-36 right-[4%]', rotate: '8deg', delay: 0.7, icon: '🔬', color: 'from-[#2d2118] to-[#1a1210]' },
        ].map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40, rotate: c.rotate }}
            animate={{ opacity: 1, y: 0, rotate: c.rotate }}
            transition={{ delay: c.delay, duration: 0.8, ease: 'easeOut' }}
            whileHover={{ rotate: '0deg', scale: 1.05 }}
            className={`absolute ${c.style} hidden xl:block`}
          >
            <div className="w-40 bg-white/95 rounded-xl p-4 shadow-2xl shadow-black/20">
              <div className={`aspect-[3/4] bg-gradient-to-br ${c.color} rounded-lg mb-3 flex items-center justify-center overflow-hidden relative`}>
                <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                <span className="text-white text-4xl transform -rotate-12">{c.icon}</span>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-3/4 bg-[#1a1210] rounded-full opacity-80" />
                <div className="h-2 w-1/2 bg-[#8c7e72] rounded-full opacity-40" />
              </div>
            </div>
          </motion.div>
        ))}

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col items-center text-center">
          <div className="max-w-3xl">
            <motion.p
              variants={fadeUp} custom={0} initial="hidden" animate="visible"
              className="text-white/70 text-sm font-body font-medium tracking-[0.2em] uppercase mb-8"
            >
              Community-Driven Marketplace
            </motion.p>

            <h1 className="mb-6">
              {['We Share', 'We Learn', 'We Save'].map((line, i) => (
                <motion.span
                  key={i}
                  variants={fadeUp}
                  custom={0.1 + i * 0.1}
                  initial="hidden"
                  animate="visible"
                  className={`block font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] ${i > 0 ? 'mt-2' : ''} ${i === 1 ? 'text-white/90' : i === 2 ? 'text-white/80' : 'text-white'}`}
                >
                  {line.split(' ')[0]} <em className="italic font-normal">{line.split(' ')[1]}</em>
                </motion.span>
              ))}
            </h1>

            <motion.p
              variants={fadeUp} custom={0.4} initial="hidden" animate="visible"
              className="text-white/60 text-lg md:text-xl max-w-xl leading-relaxed font-body mt-8"
            >
              Buy, sell, donate, and exchange educational materials with fellow students.
              Building a sustainable learning community, one book at a time.
            </motion.p>

            <motion.div
              variants={fadeUp} custom={0.5} initial="hidden" animate="visible"
              className="flex flex-col sm:flex-row gap-4 mt-12 justify-center"
            >
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link href="/listings" className="px-8 py-4 bg-white text-[#c41e3a] rounded-full font-bold font-body hover:bg-[#faf5f0] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-white/10 button-ripple">
                  See Our Work
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link href="/register" className="px-8 py-4 bg-transparent border border-white/30 text-white rounded-full font-bold font-body hover:bg-white/10 hover:border-white transition-all text-center block button-ripple">
                  Let&apos;s Talk
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="bg-[#1a1210] py-4 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-white/30 text-sm font-body tracking-[0.3em] font-medium">
            {MARQUEE_TEXT.repeat(4)}
          </span>
        </div>
      </div>

      {/* ── Stats ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {STATS.map((stat, i) => (
            <motion.div key={i} variants={fadeUp} custom={i * 0.1} className="text-center group">
              <div className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[#c41e3a] group-hover:scale-105 transition-transform duration-300">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-[#8c7e72] font-body mt-2 tracking-wider uppercase">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Categories ── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="max-w-xl mb-16"
          >
            <p className="text-[#c41e3a] text-sm font-body font-semibold tracking-[0.2em] uppercase mb-4">Browse Categories</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1210] font-display leading-tight">
              Find exactly what you need
            </h2>
            <p className="text-[#8c7e72] mt-4 font-body leading-relaxed">
              From textbooks to lab equipment — everything a student needs, shared by the community.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.name}
                variants={fadeUp}
                custom={i * 0.1}
              >
                <Link
                  href={`/listings?category=${cat.name}`}
                  className="group relative bg-[#faf5f0] rounded-2xl p-8 hover:bg-[#c41e3a] transition-all duration-500 overflow-hidden block"
                >
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-500">{cat.icon}</span>
                    <svg className="w-6 h-6 text-[#c41e3a] group-hover:text-white opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#1a1210] group-hover:text-white font-display transition-colors duration-300">{cat.name}</h3>
                  <p className="text-sm text-[#8c7e72] group-hover:text-white/70 font-body mt-2 transition-colors duration-300">{cat.desc}</p>
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#c41e3a]/5 group-hover:bg-white/10 rounded-full transition-all duration-500" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Trending Listings ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-[#c41e3a] text-sm font-body font-semibold tracking-[0.2em] uppercase mb-4">Latest Arrivals</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1210] font-display">Fresh on the shelf</h2>
          </div>
          <Link href="/listings" className="hidden md:inline-flex items-center gap-2 text-sm text-[#c41e3a] hover:text-[#8b1425] font-semibold font-body group">
            View all listings
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#e8ddd0]">
                <div className="aspect-[4/3] shimmer" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-3/4 shimmer rounded-full" />
                  <div className="h-6 w-1/3 shimmer rounded-full" />
                  <div className="h-3 w-1/2 shimmer rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : trending.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.map((listing, i) => (
              <ListingCard key={listing._id} listing={listing} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center py-20 bg-white rounded-3xl border border-[#e8ddd0]"
          >
            <div className="text-7xl mb-6">📚</div>
            <h3 className="text-2xl font-bold text-[#1a1210] font-display mb-3">No listings yet</h3>
            <p className="text-[#8c7e72] mb-8 font-body max-w-md mx-auto">Be the first to share educational materials with the community!</p>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/listings/create" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#c41e3a] text-white font-semibold rounded-full hover:bg-[#8b1425] hover:shadow-xl hover:shadow-[#c41e3a]/20 transition-all text-sm font-body button-ripple">
                Create a Listing
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* ── Mission CTA ── */}
      <section className="relative overflow-hidden bg-[#1a1210] py-24">
        <div className="absolute inset-0 noise-bg" />
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#c41e3a]/10 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            >
              <p className="text-[#d4a853] text-sm font-body font-semibold tracking-[0.2em] uppercase mb-6">Our Mission</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-display leading-tight mb-6">
                Making education <em className="italic text-[#d4a853]">accessible</em> for everyone
              </h2>
              <p className="text-white/50 font-body leading-relaxed text-lg mb-8">
                We believe every student deserves access to quality learning materials. Through community sharing,
                we&apos;re reducing waste and making education affordable — one exchange at a time.
              </p>
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link href="/register" className="inline-flex items-center gap-3 px-8 py-4 bg-[#c41e3a] text-white font-bold rounded-full hover:bg-[#8b1425] hover:shadow-xl hover:shadow-[#c41e3a]/30 transition-all text-sm font-body group button-ripple">
                  Get Started — It&apos;s Free
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: '♻️', title: 'Circular Reuse', desc: 'Pass it forward instead of throwing it away', mt: '' },
                { icon: '💰', title: 'Save Money', desc: 'Get materials at a fraction of retail price', mt: 'mt-8' },
                { icon: '🤝', title: 'Community', desc: 'Connect with students at your campus', mt: '-mt-4' },
                { icon: '🎁', title: 'Free Items', desc: 'Donate materials to those in need', mt: 'mt-4' },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  custom={i * 0.1}
                  whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  className={`bg-white/5 border border-white/10 rounded-2xl p-6 transition-colors cursor-default ${card.mt}`}
                >
                  <div className="text-3xl mb-3">{card.icon}</div>
                  <h4 className="text-white font-bold font-display text-lg mb-2">{card.title}</h4>
                  <p className="text-white/40 text-sm font-body">{card.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#faf5f0] border-t border-[#e8ddd0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#c41e3a] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <span className="text-xl font-bold text-[#1a1210] font-display">Learn<span className="text-[#c41e3a]">Share</span></span>
                  <span className="block text-[10px] text-[#8c7e72] font-body tracking-[0.2em] uppercase -mt-0.5">Books & Beyond</span>
                </div>
              </div>
              <p className="text-sm text-[#8c7e72] font-body leading-relaxed max-w-sm">
                A community-driven marketplace making education affordable and sustainable through resource sharing.
              </p>
            </div>
            <div>
              <h4 className="text-[#1a1210] font-bold font-display mb-4">Navigation</h4>
              <ul className="space-y-2.5">
                <li><Link href="/listings" className="text-sm text-[#8c7e72] hover:text-[#c41e3a] font-body transition-colors">Marketplace</Link></li>
                <li><Link href="/donate" className="text-sm text-[#8c7e72] hover:text-[#c41e3a] font-body transition-colors">Free Items</Link></li>
                <li><Link href="/listings/create" className="text-sm text-[#8c7e72] hover:text-[#c41e3a] font-body transition-colors">Sell / Donate</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#1a1210] font-bold font-display mb-4">Account</h4>
              <ul className="space-y-2.5">
                <li><Link href="/login" className="text-sm text-[#8c7e72] hover:text-[#c41e3a] font-body transition-colors">Login</Link></li>
                <li><Link href="/register" className="text-sm text-[#8c7e72] hover:text-[#c41e3a] font-body transition-colors">Sign Up</Link></li>
                <li><Link href="/messages" className="text-sm text-[#8c7e72] hover:text-[#c41e3a] font-body transition-colors">Messages</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[#e8ddd0] flex items-center justify-between">
            <p className="text-xs text-[#8c7e72] font-body">© 2026 LearnShare. Making education accessible for everyone.</p>
            <div className="flex gap-4">
              {['in', '𝕏', 'ig'].map((s) => (
                <motion.span key={s} whileHover={{ scale: 1.15, backgroundColor: '#c41e3a' }} className="w-8 h-8 rounded-full bg-[#1a1210] flex items-center justify-center text-white text-xs cursor-pointer transition-colors">{s}</motion.span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
