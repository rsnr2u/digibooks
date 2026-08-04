import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BOOKS_DATA } from '../data/booksData';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else window.dispatchEvent(new CustomEvent('open-search'));
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = [];
  if (query.trim()) {
    const q = query.toLowerCase();
    Object.values(BOOKS_DATA).forEach((book) => {
      if (!book || !Array.isArray(book.chapters)) return;
      book.chapters.forEach((chapter) => {
        const cTitle = (chapter.title || '').toLowerCase();
        const cSummary = (chapter.summary || chapter.heading || chapter.overview || '').toLowerCase();
        const cContent = (chapter.content || chapter.description || '').toLowerCase();
        const bTitle = (book.title || '').toLowerCase();
        const bTelugu = (book.teluguTitle || '').toLowerCase();

        if (
          cTitle.includes(q) ||
          cSummary.includes(q) ||
          cContent.includes(q) ||
          bTitle.includes(q) ||
          bTelugu.includes(q)
        ) {
          results.push({
            bookId: book.id,
            bookTitle: book.title,
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            chapterSummary: chapter.summary || chapter.heading || chapter.overview || ''
          });
        }
      });
    });
  }

  const handleSelect = (bookId, chapterId) => {
    navigate(`/book/${bookId}/${chapterId}`);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Input Header */}
          <div className="p-4 border-b border-slate-200 flex items-center gap-3">
            <Search className="w-5 h-5 text-blue-600 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search tutorials, topics, numbers, vastu directions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none text-base font-telugu font-medium"
            />
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-xl bg-slate-100 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
            {!query.trim() ? (
              <div className="text-center py-10 text-slate-500 font-telugu text-sm font-medium">
                పాఠాలు లేదా టాపిక్స్ వెతకడానికి పైన టైప్ చేయండి (e.g. Life Path, Vastu, Zodiac, 11)
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-10 text-slate-500 font-telugu text-sm font-medium">
                ఏ ఫలితాలు లభించలేదు. మరొక పదం టైప్ చేయండి.
              </div>
            ) : (
              results.map((res, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(res.bookId, res.chapterId)}
                  className="w-full text-left p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                      {res.bookTitle}
                    </span>
                    <h5 className="font-bold text-slate-900 text-base font-telugu group-hover:text-blue-700">
                      {res.chapterTitle}
                    </h5>
                    <p className="text-xs text-slate-600 font-telugu line-clamp-1 font-medium">
                      {res.chapterSummary}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
                </button>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
