import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BOOKS_DATA } from '../data/booksData';
import {
  Home, Printer, ChevronLeft, ChevronRight, Maximize2, Minimize2,
  FileText, Layers, ArrowLeft, Share2, Download,
  Cpu, Zap, TrendingUp, CheckCircle2, Globe, Award, ShieldCheck, Building2, Sparkles, Rocket
} from 'lucide-react';
import SyntaxHighlighter from '../components/SyntaxHighlighter';

/* ───────────────── Markdown-lite renderer ───────────────── */
function renderMarkdown(text) {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank line
    if (line.trim() === '') { i++; continue; }

    // HR
    if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={i} className="my-6 border-amber-200/40" />);
      i++; continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">{parseInline(line.slice(2))}</h1>);
      i++; continue;
    }
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-2xl font-bold text-amber-800 mt-6 mb-3 border-b border-amber-200/50 pb-2">{parseInline(line.slice(3))}</h2>);
      i++; continue;
    }
    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-xl font-semibold text-slate-800 mt-5 mb-2">{parseInline(line.slice(4))}</h3>);
      i++; continue;
    }

    // Code blocks
    if (line.trim().startsWith('```')) {
      const lang = line.trim().replace(/```/g, '').trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      elements.push(
        <div key={`code-${i}`} className="my-4">
          <SyntaxHighlighter code={codeLines.join('\n')} language={lang || 'text'} />
        </div>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="border-l-4 border-amber-500 bg-amber-50/60 pl-4 py-3 my-4 text-slate-700 italic rounded-r-lg">
          {parseInline(line.slice(2))}
        </blockquote>
      );
      i++; continue;
    }

    // Table
    if (line.includes('|') && line.trim().startsWith('|')) {
      const tableRows = [];
      while (i < lines.length && lines[i].includes('|') && lines[i].trim().startsWith('|')) {
        tableRows.push(lines[i]);
        i++;
      }
      const rows = tableRows.filter(r => !/^\|[\s-:|]+\|$/.test(r.trim()));
      if (rows.length > 0) {
        const headerCells = rows[0].split('|').filter(c => c.trim());
        const bodyRows = rows.slice(1);
        elements.push(
          <div key={`table-${i}`} className="my-5 overflow-x-auto rounded-xl border border-slate-200/80 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
                  {headerCells.map((cell, ci) => (
                    <th key={ci} className="px-4 py-3 text-left font-bold whitespace-nowrap">{parseInline(cell.trim())}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, ri) => {
                  const cells = row.split('|').filter(c => c.trim());
                  return (
                    <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      {cells.map((cell, ci) => (
                        <td key={ci} className="px-4 py-2.5 border-t border-slate-100">{parseInline(cell.trim())}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // Unordered list
    if (/^\s*[-*]\s/.test(line)) {
      const listItems = [];
      while (i < lines.length && /^\s*[-*]\s/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\s*[-*]\s/, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-1.5 mb-4 text-slate-700 text-base pl-2">
          {listItems.map((item, li) => <li key={li}>{parseInline(item)}</li>)}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\s*\d+\.\s/.test(line)) {
      const listItems = [];
      while (i < lines.length && /^\s*\d+\.\s/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\s*\d+\.\s/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal list-inside space-y-1.5 mb-4 text-slate-700 text-base pl-2">
          {listItems.map((item, li) => <li key={li}>{parseInline(item)}</li>)}
        </ol>
      );
      continue;
    }

    // Paragraph
    elements.push(<p key={i} className="text-slate-700 text-base leading-relaxed mb-4">{parseInline(line)}</p>);
    i++;
  }

  return elements;
}

function parseInline(text) {
  if (!text) return text;
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    if (boldMatch) {
      const idx = boldMatch.index;
      if (idx > 0) parts.push(remaining.slice(0, idx));
      parts.push(<strong key={key++} className="font-bold text-slate-900">{boldMatch[1]}</strong>);
      remaining = remaining.slice(idx + boldMatch[0].length);
    } else {
      parts.push(remaining);
      break;
    }
  }
  return parts;
}

/* ───────────────── Main Component ───────────────── */
export default function CompanyProfilePage() {
  const { chapterId } = useParams();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const printRef = useRef(null);

  const book = BOOKS_DATA['digitalks-profile'];
  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center space-y-4">
          <FileText className="w-16 h-16 text-slate-300 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-700">Profile Not Found</h2>
          <Link to="/" className="text-blue-600 hover:underline font-medium">Return Home</Link>
        </div>
      </div>
    );
  }

  const pages = book.chapters || [];
  const hasPages = pages.length > 0;

  // Find page by chapterId or use index
  let activePageIdx = currentPageIndex;
  if (chapterId) {
    const found = pages.findIndex(p => p.id === chapterId);
    if (found !== -1) activePageIdx = found;
  }

  const activePage = hasPages ? pages[activePageIdx] : null;

  const handlePrint = () => {
    window.print();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  /* ─── Empty State (No pages yet) ─── */
  if (!hasPages) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
        {/* Top Bar */}
        <div className="no-print bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-medium">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400 font-bold text-sm">{book.title}</span>
          </div>
        </div>

        {/* Empty Cover */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="a4-page-landscape relative bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center justify-center">
            {/* Gold border accent */}
            <div className="absolute inset-0 rounded-2xl border-2 border-amber-300/30 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />

            {/* Decorative corners */}
            <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-amber-400/50 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-amber-400/50 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-amber-400/50 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-amber-400/50 rounded-br-lg" />

            {/* Watermark pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 50px, #b45309 50px, #b45309 51px)`,
            }} />

            <div className="text-center space-y-6 z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{book.title}</h1>
                <p className="text-lg text-slate-500 mt-2 font-medium">{book.tagline}</p>
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-yellow-400 mx-auto rounded-full" />
              <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                This profile is being crafted. Pages will appear here as content is added.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Active Profile Viewer ─── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Top Toolbar */}
      <div className="no-print bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 px-6 py-3 flex items-center justify-between z-50 sticky top-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-medium">
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-amber-400 font-bold text-sm">{book.title}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Page Counter */}
          <span className="text-slate-400 text-sm font-mono">
            Page {activePageIdx + 1} of {pages.length}
          </span>

          {/* Navigation */}
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => activePageIdx > 0 && setCurrentPageIndex(activePageIdx - 1)}
              disabled={activePageIdx === 0}
              className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => activePageIdx < pages.length - 1 && setCurrentPageIndex(activePageIdx + 1)}
              disabled={activePageIdx === pages.length - 1}
              className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <button onClick={toggleFullscreen} className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition" title="Fullscreen">
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-bold text-sm hover:from-amber-400 hover:to-yellow-400 transition shadow-lg shadow-amber-500/20" title="Print / Save PDF">
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Page Viewer */}
      <div className="flex-1 flex items-start justify-center p-6 sm:p-8 overflow-auto" id="a4-print-area" ref={printRef}>
        <div className="space-y-10 print-all-pages">
          {pages.map((page, idx) => {
            /* ─── Cover Page ─── */
            if (page.pageType === 'cover') {
              return (
                <div
                  key={page.id}
                  className={`a4-page-landscape relative rounded-2xl shadow-2xl overflow-hidden print-page ${idx !== activePageIdx ? 'hidden-on-screen' : ''}`}
                  style={{ backgroundColor: page.bgColor || '#00674f' }}
                >
                  {/* Subtle diagonal pattern overlay */}
                  <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px)`,
                  }} />

                  {/* Elegant gold corner frames */}
                  <div className="absolute top-6 left-6 w-24 h-24 border-t-2 border-l-2 border-white/25 rounded-tl-xl" />
                  <div className="absolute top-6 right-6 w-24 h-24 border-t-2 border-r-2 border-white/25 rounded-tr-xl" />
                  <div className="absolute bottom-6 left-6 w-24 h-24 border-b-2 border-l-2 border-white/25 rounded-bl-xl" />
                  <div className="absolute bottom-6 right-6 w-24 h-24 border-b-2 border-r-2 border-white/25 rounded-br-xl" />

                  {/* Top gold accent line */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400" />
                  {/* Bottom gold accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400" />

                  {/* Main Content — Centered */}
                  <div className="relative z-10 h-full flex flex-col items-center justify-center px-12 py-8 text-center">
                    {/* Logo */}
                    {page.logoUrl && (
                      <img
                        src={page.logoUrl}
                        alt="Digitalks Logo"
                        className="w-44 h-44 object-contain mb-4 drop-shadow-2xl"
                      />
                    )}

                    {/* Company Name */}
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-[0.2em] text-white uppercase mb-2" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}>
                      {page.companyName || 'DIGI TALKS INDIA'}
                    </h1>

                    {/* Tagline */}
                    <h2 className="text-lg lg:text-xl font-medium tracking-wider text-yellow-300/90 mb-3 max-w-2xl">
                      {page.tagline || page.subtitle || 'Corporate Company Profile'}
                    </h2>

                    {/* Gold Divider */}
                    <div className="flex items-center gap-4 my-3">
                      <div className="w-20 h-px bg-gradient-to-r from-transparent to-yellow-400" />
                      <div className="w-2.5 h-2.5 rotate-45 bg-yellow-400 shadow-lg shadow-yellow-400/40" />
                      <div className="w-20 h-px bg-gradient-to-l from-transparent to-yellow-400" />
                    </div>

                    {/* Services Pill / Bullet Row */}
                    {page.services && (
                      <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl my-3">
                        {page.services.map((srv, sidx) => (
                          <span
                            key={sidx}
                            className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs lg:text-sm font-semibold tracking-wide shadow-sm"
                          >
                            {srv}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Quote / Motto */}
                    {page.quote && (
                      <div className="mt-4 px-6 py-2 rounded-xl bg-black/20 border border-yellow-400/30 text-amber-200 font-serif italic text-base lg:text-lg tracking-wide shadow-inner">
                        {page.quote}
                      </div>
                    )}
                  </div>

                  {/* Bottom info bar */}
                  <div className="absolute bottom-5 left-0 right-0 flex justify-center">
                    <span className="text-[11px] text-white/30 tracking-[0.4em] uppercase font-medium">
                      Confidential • Corporate Profile
                    </span>
                  </div>
                </div>
              );
            }

            /* ─── About Page ─── */
            if (page.pageType === 'about') {
              return (
                <div
                  key={page.id}
                  className={`a4-page-landscape relative rounded-2xl shadow-2xl overflow-hidden print-page flex flex-col justify-between ${idx !== activePageIdx ? 'hidden-on-screen' : ''}`}
                  style={{ background: 'linear-gradient(135deg, #041813 0%, #082920 50%, #031410 100%)' }}
                >
                  {/* Glowing background highlights */}
                  <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Corner Frames */}
                  <div className="absolute top-4 left-4 w-16 h-16 border-t border-l border-emerald-500/30 rounded-tl-lg" />
                  <div className="absolute top-4 right-4 w-16 h-16 border-t border-r border-emerald-500/30 rounded-tr-lg" />
                  <div className="absolute bottom-4 left-4 w-16 h-16 border-b border-l border-emerald-500/30 rounded-bl-lg" />
                  <div className="absolute bottom-4 right-4 w-16 h-16 border-b border-r border-emerald-500/30 rounded-br-lg" />

                  {/* Top & Bottom Accent Lines */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-yellow-400 to-emerald-500" />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-yellow-400 to-emerald-500" />

                  {/* Header Bar */}
                  <div className="relative z-10 px-10 pt-6 pb-4 flex items-center justify-between border-b border-emerald-800/30">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-widest shadow-inner">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{page.badge || 'Company Overview'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-emerald-400/60 font-mono">DIGI TALKS INDIA • Page 2 of {pages.length}</span>
                    </div>
                  </div>

                  {/* Main Grid Content */}
                  <div className="relative z-10 px-10 py-6 flex-1 grid grid-cols-12 gap-8 items-center">
                    {/* Left Column: Text & Features (7 Cols) */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      className="col-span-7 space-y-4"
                    >
                      {/* Heading */}
                      <div>
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                          <span>About</span>
                          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-yellow-400 bg-clip-text text-transparent">
                            DIGI TALKS INDIA
                          </span>
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-yellow-400 rounded-full mt-2" />
                      </div>

                      {/* Paragraph 1 */}
                      <p className="text-slate-200 text-xs lg:text-sm leading-relaxed font-normal bg-emerald-950/40 border border-emerald-800/40 p-4 rounded-xl backdrop-blur-sm shadow-inner">
                        <strong className="text-emerald-300 font-bold">DIGI TALKS INDIA</strong> is a technology company specializing in software engineering, enterprise digital solutions, and business automation. We partner with startups, SMEs, and enterprises to design and develop scalable digital products that improve efficiency, increase productivity, and create measurable business value.
                      </p>

                      {/* Paragraph 2 */}
                      <p className="text-slate-300 text-xs lg:text-sm leading-relaxed font-normal">
                        With a strong focus on innovation, quality, and long-term partnerships, we help organizations transform ideas into powerful digital solutions.
                      </p>

                      {/* Highlight Pillars */}
                      <div className="grid grid-cols-3 gap-3 pt-1">
                        <div className="p-3 rounded-xl bg-slate-900/70 border border-emerald-500/30 flex flex-col gap-1 hover:border-emerald-400/60 transition group">
                          <Cpu className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
                          <h4 className="text-xs font-bold text-white">Software & AI</h4>
                          <p className="text-[11px] text-slate-400">Scalable Engineering</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/70 border border-emerald-500/30 flex flex-col gap-1 hover:border-yellow-400/60 transition group">
                          <Zap className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition" />
                          <h4 className="text-xs font-bold text-white">Automation</h4>
                          <p className="text-[11px] text-slate-400">Enterprise Workflows</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/70 border border-emerald-500/30 flex flex-col gap-1 hover:border-emerald-400/60 transition group">
                          <TrendingUp className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
                          <h4 className="text-xs font-bold text-white">Growth & ROI</h4>
                          <p className="text-[11px] text-slate-400">Measurable Value</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Right Column: Image Display (5 Cols) */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="col-span-5 relative"
                    >
                      <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl group">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
                        
                        <img
                          src={page.image || '/assets/about-digitalks.jpg'}
                          alt="About DIGI TALKS INDIA"
                          className="w-full h-[260px] lg:h-[300px] object-cover rounded-xl transform group-hover:scale-105 transition duration-700"
                        />

                        {/* Image overlay badge */}
                        <div className="absolute bottom-3 left-3 right-3 p-3 bg-slate-950/85 backdrop-blur-md rounded-xl border border-emerald-500/30 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-bold text-white">Digital Transformation</span>
                          </div>
                          <span className="text-[11px] font-mono text-yellow-300 font-semibold">Innovation & Scale</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Footer Bar */}
                  <div className="relative z-10 px-10 py-3 border-t border-emerald-800/30 flex items-center justify-between text-xs text-emerald-400/50">
                    <span className="tracking-widest uppercase font-medium">DIGI TALKS INDIA • Corporate Profile</span>
                    <span className="font-mono">Confidential Document</span>
                  </div>
                </div>
              );
            }

            /* ─── Standard Markdown Page ─── */
            return (
            <div
              key={page.id}
              className={`a4-page-landscape relative bg-white rounded-2xl shadow-2xl overflow-hidden print-page ${idx !== activePageIdx ? 'hidden-on-screen' : ''}`}
            >
              {/* Gold top & bottom borders */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 no-print-border" />
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 no-print-border" />

              {/* Corner accents */}
              <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-amber-400/30 rounded-tl-lg" />
              <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-amber-400/30 rounded-tr-lg" />
              <div className="absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-amber-400/30 rounded-bl-lg" />
              <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-amber-400/30 rounded-br-lg" />

              {/* Watermark */}
              <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 60px, #b45309 60px, #b45309 61px)`,
              }} />

              {/* Content Area */}
              <div className="relative z-10 px-16 py-12 h-full overflow-auto a4-content">
                {/* Page header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-sm">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Digitalks</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Page {idx + 1} / {pages.length}</span>
                </div>

                {/* Page Content */}
                <div className="a4-reading-content">
                  {renderMarkdown(page.content)}
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Page Thumbnails */}
      {pages.length > 1 && (
        <div className="no-print bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 px-6 py-3">
          <div className="flex items-center gap-3 overflow-x-auto">
            <Layers className="w-4 h-4 text-slate-500 shrink-0" />
            {pages.map((page, idx) => (
              <button
                key={page.id}
                onClick={() => setCurrentPageIndex(idx)}
                className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold transition ${
                  idx === activePageIdx
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
              >
                Page {idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
