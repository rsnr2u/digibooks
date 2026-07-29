import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import BookCard from '../components/BookCard';
import { BOOKS_DATA } from '../data/booksData';

export default function HomePage({ onOpenSearch }) {
  const booksList = Object.values(BOOKS_DATA);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Professional Corporate Portal Header (No Hero Banner) */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-telugu">డిజిబుక్ కార్పొరేట్ నాలెడ్జ్ ప్లాట్‌ఫారమ్</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Knowledge Directory & Digital Tutorials
            </h1>
            <p className="text-slate-600 text-sm sm:text-base font-telugu max-w-2xl font-medium leading-relaxed">
              సంఖ్యలు (Numerology) మరియు వైయక్తిక జాతక విశ్లేషణల సంపూర్ణ డిజిటల్ పాఠ్యాంశాలు.
            </p>
          </div>

          {/* Search Trigger Control */}
          <button
            onClick={onOpenSearch}
            className="w-full md:w-auto px-5 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium flex items-center justify-between gap-6 transition group shadow-sm shrink-0"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-blue-600 group-hover:scale-110 transition" />
              <span className="font-telugu">పాఠాలు వెతకండి...</span>
            </div>
            <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded text-[11px] font-mono text-slate-600 font-bold">
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* Courses Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-telugu">
              అందుబాటులో ఉన్న పాఠ్యాంశాలు (Active Courses - {booksList.length})
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {booksList.map((book, index) => (
              <BookCard key={book.id} book={book} index={index} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
