import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-extrabold text-slate-900 tracking-tight">
            Digi<span className="text-blue-600">book</span>
          </span>
          <span className="text-xs text-slate-400 font-telugu hidden md:inline border-l border-slate-200 pl-2.5">
            Corporate Knowledge Hub (డిజిబుక్)
          </span>
        </Link>

        {/* Copyright */}
        <p className="text-xs text-slate-500 font-medium">
          © {new Date().getFullYear()} Digibook Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
