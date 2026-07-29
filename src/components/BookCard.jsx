import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hash, Sparkles, Compass, Hand, Wind, ArrowRight, Clock, BookOpen, Star, UserCheck } from 'lucide-react';

const ICON_MAP = {
  Hash: Hash,
  Sparkles: Sparkles,
  Compass: Compass,
  Hand: Hand,
  Wind: Wind,
  UserCheck: UserCheck
};

const ACCENT_STYLES = {
  numerology: { iconBg: 'bg-blue-600 text-white', badge: 'bg-blue-50 text-blue-700 border-blue-200', topBorder: 'bg-blue-600' },
  'personal-numerology': { iconBg: 'bg-purple-600 text-white', badge: 'bg-purple-50 text-purple-700 border-purple-200', topBorder: 'bg-purple-600' },
  astrology: { iconBg: 'bg-indigo-600 text-white', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200', topBorder: 'bg-indigo-600' },
  vastu: { iconBg: 'bg-teal-600 text-white', badge: 'bg-teal-50 text-teal-700 border-teal-200', topBorder: 'bg-teal-600' },
  palmistry: { iconBg: 'bg-rose-600 text-white', badge: 'bg-rose-50 text-rose-700 border-rose-200', topBorder: 'bg-rose-600' },
  fengshui: { iconBg: 'bg-cyan-600 text-white', badge: 'bg-cyan-50 text-cyan-700 border-cyan-200', topBorder: 'bg-cyan-600' }
};

export default function BookCard({ book, index }) {
  const IconComponent = ICON_MAP[book.iconName] || BookOpen;
  const style = ACCENT_STYLES[book.id] || ACCENT_STYLES.numerology;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <div className="h-full flex flex-col justify-between bg-white rounded-2xl p-6 sm:p-7 relative border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 group">
        {/* Top Accent Strip */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl ${style.topBorder}`} />

        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-5 pt-1">
            <div className={`w-12 h-12 rounded-xl ${style.iconBg} flex items-center justify-center shadow-md group-hover:scale-105 transition transform`}>
              <IconComponent className="w-6 h-6" />
            </div>

            {book.badge && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold border font-sans tracking-wide ${style.badge}`}>
                {book.badge}
              </span>
            )}
          </div>

          {/* Titles */}
          <h3 className="text-xl font-extrabold text-slate-900 mb-1 group-hover:text-blue-600 transition">
            {book.title}
          </h3>
          <h4 className="text-base font-bold text-blue-700 font-telugu mb-3">
            {book.teluguTitle}
          </h4>

          {/* Description */}
          <p className="text-slate-600 text-sm leading-relaxed mb-6 font-telugu">
            {book.description}
          </p>
        </div>

        {/* Card Footer */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-6 py-3 border-y border-slate-100 font-medium">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>{book.chaptersCount} {book.id === 'personal-numerology' ? 'Profiles' : 'Chapters'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{book.estimatedHours}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-teal-600" />
              <span>{book.difficulty}</span>
            </div>
          </div>

          <Link
            to={`/book/${book.id}`}
            className="w-full py-3 px-5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-sm transition-all duration-200 flex items-center justify-between group/btn shadow-sm"
          >
            <span className="font-telugu">Start Learning (పాఠాలు చూడండి)</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
