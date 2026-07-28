import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-12 pb-8 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-slate-900">
                Digi<span className="text-blue-600">book</span>
              </span>
            </Link>
            <p className="text-slate-600 font-telugu leading-relaxed max-w-md">
              డిజిబుక్ (Digibook) ద్వారా న్యూమరాలజీ, జ్యోతిష్య శాస్త్రం, వాస్తు మరియు ప్రాచీన జ్ఞానాన్ని ఇంగ్లీష్ & తెలుగులో సులభంగా నేర్చుకోండి.
            </p>
          </div>

          {/* Tutorials Links */}
          <div>
            <h4 className="text-slate-900 font-bold mb-4 font-telugu">Tutorial Modules</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/book/numerology" className="hover:text-blue-600 transition font-telugu">
                  న్యూమరాలజీ (Numerology)
                </Link>
              </li>
              <li>
                <Link to="/book/astrology" className="hover:text-blue-600 transition font-telugu">
                  జ్యోతిషం (Astrology)
                </Link>
              </li>
              <li>
                <Link to="/book/vastu" className="hover:text-blue-600 transition font-telugu">
                  వాస్తు శాస్త్రం (Vastu Shastra)
                </Link>
              </li>
              <li>
                <Link to="/book/palmistry" className="hover:text-blue-600 transition font-telugu">
                  హస్తరేఖలు (Palmistry)
                </Link>
              </li>
              <li>
                <Link to="/book/fengshui" className="hover:text-blue-600 transition font-telugu">
                  ఫెంగ్ షూయ్ (Feng Shui)
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Tools Links */}
          <div>
            <h4 className="text-slate-900 font-bold mb-4 font-telugu">Interactive Tools</h4>
            <ul className="space-y-2.5 text-slate-600">
              <li>
                <Link to="/book/numerology/life-path-number" className="hover:text-blue-600 transition">
                  Life Path Calculator
                </Link>
              </li>
              <li>
                <Link to="/book/astrology/intro-to-astrology" className="hover:text-blue-600 transition">
                  Zodiac Sign Explorer
                </Link>
              </li>
              <li>
                <Link to="/book/vastu/room-placements" className="hover:text-blue-600 transition">
                  Vastu Digital Compass
                </Link>
              </li>
              <li>
                <Link to="/bookmarks" className="hover:text-blue-600 transition">
                  My Bookmarks
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <p>© {new Date().getFullYear()} Digibook Platform. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>React + Vite + Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
