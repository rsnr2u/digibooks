import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Search, Bookmark, Menu, X, Sparkles, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onOpenSearch }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm py-3'
          : 'bg-white border-b border-slate-200/60 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Corporate Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition transform">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
              Digi<span className="text-blue-600">book</span>
            </span>
            <span className="text-[10px] text-slate-500 font-telugu block tracking-wide font-medium">
              Corporate Knowledge Hub (డిజిబుక్)
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
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
        <div className="flex items-center gap-3">
          {/* Quick Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-600 text-xs transition font-medium"
            title="Search Tutorials"
          >
            <Search className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Search Digibooks...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] text-slate-600 font-mono">
              Ctrl+K
            </kbd>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-xl"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            className="md:hidden bg-white border-b border-slate-200 px-4 py-6 space-y-4 font-semibold text-slate-800"
          >
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-slate-800 hover:text-blue-600 font-telugu"
            >
              హోమ్ (Home)
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
