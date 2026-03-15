'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useSocket();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isDarkPage = pathname === '/' || pathname === '/donate';
  const forceLightText = isDarkPage && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = user
    ? [
        { href: '/listings', label: 'Marketplace' },
        { href: '/donate', label: 'Free Items' },
        { href: '/listings/create', label: 'Sell / Donate' },
        { href: '/messages', label: 'Messages', badge: unreadCount },
        { href: '/profile', label: 'Profile' },
      ]
    : [
        { href: '/listings', label: 'Marketplace' },
        { href: '/donate', label: 'Free Items' },
        { href: '/login', label: 'Login' },
      ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#faf5f0]/95 backdrop-blur-xl shadow-lg shadow-black/5 py-0'
          : 'bg-transparent py-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-14' : 'h-20'}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.08, rotate: -3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="w-10 h-10 rounded-xl bg-[#c41e3a] flex items-center justify-center shadow-lg shadow-[#c41e3a]/20 group-hover:shadow-[#c41e3a]/40"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </motion.div>
            <div>
              <span className={`text-xl font-bold font-display tracking-tight transition-colors ${forceLightText ? 'text-white' : 'text-[#1a1210]'}`}>
                Learn<span className={forceLightText ? 'text-white' : 'text-[#c41e3a]'}>Share</span>
              </span>
              <span className={`hidden sm:block text-[10px] font-body tracking-[0.2em] uppercase -mt-0.5 transition-colors ${forceLightText ? 'text-white/60' : 'text-[#8c7e72]'}`}>
                Books &amp; Beyond
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} badge={link.badge} forceLightText={forceLightText} />
            ))}

            {user ? (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={logout}
                className={`ml-2 px-4 py-2 text-sm rounded-lg transition-all font-body ${forceLightText ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-[#8c7e72] hover:text-[#c41e3a]'}`}
              >
                Logout
              </motion.button>
            ) : (
              <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/register"
                  className={`ml-3 px-6 py-2.5 text-sm font-semibold rounded-full button-ripple transition-all font-body shadow-lg ${
                    forceLightText
                      ? 'bg-white text-[#c41e3a] hover:shadow-white/20'
                      : 'text-white bg-[#c41e3a] hover:bg-[#8b1425] hover:shadow-[#c41e3a]/30'
                  }`}
                >
                  Let&apos;s Talk
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${forceLightText ? 'text-white hover:bg-white/10' : 'text-[#2d2118] hover:text-[#c41e3a]'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="lg:hidden overflow-hidden pb-6 border-t border-[#c41e3a]/10 mt-2 pt-4 space-y-1 bg-[#faf5f0]/95 backdrop-blur-xl rounded-b-2xl"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={link.href} onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-[#2d2118] hover:text-[#c41e3a] rounded-xl hover:bg-[#c41e3a]/5 font-medium font-body transition-colors">
                    {link.label} {link.badge > 0 && `(${link.badge})`}
                  </Link>
                </motion.div>
              ))}
              {user ? (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: navLinks.length * 0.05 }}>
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="block w-full text-left px-4 py-3 text-[#c41e3a] rounded-xl hover:bg-[#c41e3a]/5 font-medium font-body">Logout</button>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: navLinks.length * 0.05 }}>
                  <Link href="/register" onClick={() => setMenuOpen(false)} className="block mx-4 mt-2 py-3 text-center text-white bg-[#c41e3a] rounded-full font-semibold font-body button-ripple">Sign Up</Link>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

function NavLink({ href, label, badge, forceLightText }) {
  return (
    <Link href={href} className="relative group px-4 py-2 text-sm font-medium font-body block">
      <span className={`transition-colors duration-200 ${forceLightText ? 'text-white group-hover:text-white/80' : 'text-[#2d2118] group-hover:text-[#c41e3a]'}`}>
        {label}
        {badge > 0 && (
          <span className="ml-1 w-5 h-5 bg-[#c41e3a] text-white text-[10px] rounded-full inline-flex items-center justify-center font-bold animate-pulse">
            {badge}
          </span>
        )}
      </span>
      {/* Animated underline */}
      <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#c41e3a] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
    </Link>
  );
}
