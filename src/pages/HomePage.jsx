import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, BookOpen, Compass, ShieldCheck, Award, Zap, ArrowRight, FileText } from 'lucide-react';
import BookCard from '../components/BookCard';
import { BOOKS_DATA } from '../data/booksData';

export default function HomePage({ onOpenSearch }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const booksList = Object.values(BOOKS_DATA);
  const categories = ['ALL', 'Mystic Science', 'Vedic Science', 'Architecture Science', 'Energy Science'];

  const filteredBooks = selectedCategory === 'ALL'
    ? booksList
    : booksList.filter(b => b.category === selectedCategory);

  return (
    <div className="space-y-16 pb-20 bg-slate-50">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 md:py-20 text-center bg-gradient-to-b from-white via-slate-50 to-slate-100/60 border-b border-slate-200">
        {/* Background Accents */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-100/50 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
          {/* Top Corporate Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm font-bold shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="font-telugu">అధ్యాయాల వారీగా డిజిటల్ ట్యుటోరియల్ ప్లాట్‌ఫారమ్</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight"
          >
            Master Knowledge in <br className="hidden sm:inline" />
            <span className="text-blue-600">Numerology, Astrology & Vastu</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 font-telugu max-w-2xl mx-auto leading-relaxed font-medium"
          >
            న్యూమరాలజీ, జ్యోతిష శాస్త్రం, వాస్తు మరియు ప్రాచీన విజ్ఞానాలను ఇంగ్లీష్ & తెలుగులో అధ్యాయాల వారీగా వివరంగా చదువుకోండి (Chapter by Chapter Lessons).
          </motion.p>

          {/* Search Trigger Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto pt-4"
          >
            <button
              onClick={onOpenSearch}
              className="w-full p-4 bg-white rounded-2xl border border-slate-300 shadow-lg hover:shadow-xl hover:border-blue-500 flex items-center justify-between text-slate-500 transition group"
            >
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-blue-600 group-hover:scale-110 transition" />
                <span className="font-telugu text-slate-700 text-base font-medium">
                  పాఠాలు లేదా అధ్యాయాలను వెతకండి... (e.g. న్యూమరాలజీ, Vastu)
                </span>
              </div>
              <span className="px-3 py-1 bg-slate-100 rounded-xl text-xs font-mono text-slate-700 font-semibold border border-slate-200">
                Ctrl + K
              </span>
            </button>
          </motion.div>

          {/* Key Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 max-w-3xl mx-auto">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
              <span className="text-3xl font-extrabold text-blue-600 block">5+</span>
              <span className="text-xs text-slate-600 font-telugu font-semibold">సంపూర్ణ పాఠ్యాంశాలు</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
              <span className="text-3xl font-extrabold text-indigo-600 block">18+</span>
              <span className="text-xs text-slate-600 font-telugu font-semibold">వివరణాత్మక అధ్యాయాలు</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
              <span className="text-3xl font-extrabold text-teal-600 block">Easy</span>
              <span className="text-xs text-slate-600 font-telugu font-semibold">Chapter Reading</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
              <span className="text-3xl font-extrabold text-amber-600 block">100%</span>
              <span className="text-xs text-slate-600 font-telugu font-semibold">ఉచిత యాక్సెస్</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Tutorial Courses Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-extrabold text-blue-700 uppercase tracking-widest block mb-1">
              Chapter-by-Chapter Lessons
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-telugu">
              Digibook Tutorial Courses (డిజిబుక్ పాఠాలు)
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredBooks.map((book, index) => (
            <BookCard key={book.id} book={book} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}
