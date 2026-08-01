import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Search, Bookmark, Menu, X, Sparkles, Compass, LogOut, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onOpenSearch, onLogout }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const username = localStorage.getItem('digibook_user') || 'Member';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 no-print ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs py-2'
          : 'bg-white border-b border-slate-200/70 py-2.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Compact Corporate Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition transform">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900 leading-none block">
              Digi<span className="text-blue-600">book</span>
            </span>
            <span className="text-[9px] text-slate-500 font-telugu block tracking-wide font-medium leading-none mt-0.5">
              Corporate Knowledge Hub
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
          <Link
            to="/"
            className={`transition hover:text-blue-600 ${
              location.pathname === '/' ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-0.5' : 'text-slate-700'
            }`}
          >
            Home (హోమ్)
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-600 text-xs transition font-medium"
            title="Search Tutorials"
          >
            <Search className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Search Digibooks...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[9px] text-slate-600 font-mono">
              Ctrl+K
            </kbd>
          </button>

          {/* User Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg text-xs font-semibold text-blue-800">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>{username}</span>
          </div>

          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 border border-slate-200 rounded-lg text-slate-700 text-xs font-semibold transition"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 font-semibold text-slate-800"
          >
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-slate-800 hover:text-blue-600 font-telugu text-sm"
            >
              హోమ్ (Home)
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
