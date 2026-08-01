import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BOOKS_DATA } from '../data/booksData';
import {
  Home, Printer, ChevronLeft, ChevronRight, Maximize2, Minimize2,
  FileText, Layers, ArrowLeft, Share2, Download,
  Cpu, Zap, TrendingUp, CheckCircle2, Globe, Award, ShieldCheck, Building2, Sparkles, Rocket,
  Activity, GraduationCap, ShoppingBag, Factory, DollarSign, HardHat, Utensils, Landmark, Briefcase, Truck, Store,
  Target, Eye, Code, Layout, Smartphone, Cloud, Link as LinkIcon, RefreshCw, Wrench, ChevronRightCircle,
  Mail, Phone, MapPin, ExternalLink, HelpCircle, Lock, Server, Database, GitBranch, HeartHandshake, Check, Compass, Users
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
    if (line.trim() === '') { i++; continue; }
    if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={i} className="my-6 border-emerald-300" />);
      i++; continue;
    }
    if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">{parseInline(line.slice(2))}</h1>);
      i++; continue;
    }
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-2xl font-bold text-[#00674f] mt-6 mb-3 border-b border-emerald-200 pb-2">{parseInline(line.slice(3))}</h2>);
      i++; continue;
    }
    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-xl font-semibold text-slate-800 mt-5 mb-2">{parseInline(line.slice(4))}</h3>);
      i++; continue;
    }
    elements.push(<p key={i} className="text-slate-800 text-base font-normal leading-relaxed mb-4">{parseInline(line)}</p>);
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

/* ───────────────── Reusable Internal Page Frame ───────────────── */
function InternalPageWrapper({ children, badge, pageNumber, totalPages, activePageIdx }) {
  return (
    <div
      className={`widescreen-page-16-9 relative bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden print-page flex flex-col justify-between ${activePageIdx !== undefined && activePageIdx !== (pageNumber - 1) ? 'hidden-on-screen' : ''}`}
    >
      {/* Subtle decorative background grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `repeating-linear-gradient(45deg, #000, #000 40px, transparent 40px, transparent 80px)`,
      }} />

      {/* Top & Bottom Accent Lines */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00674f] via-amber-400 to-[#00674f]" />
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00674f] via-amber-400 to-[#00674f]" />

      {/* Corner Accent Frames */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-emerald-600/30 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-emerald-600/30 rounded-tr-lg pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-emerald-600/30 rounded-bl-lg pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-emerald-600/30 rounded-br-lg pointer-events-none" />

      {/* Header Bar — White BG with Official Logo */}
      <div className="relative z-10 px-10 pt-5 pb-3 flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-4">
          <img
            src="/assets/digitalks-logo.png"
            alt="Digitalks Logo"
            className="h-10 object-contain drop-shadow-sm"
          />
          <div className="h-5 w-px bg-slate-300" />
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-[#00674f] text-xs font-bold uppercase tracking-wider shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{badge || 'Corporate Profile'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-700 font-mono font-bold">DIGI TALKS INDIA • Page {pageNumber} of {totalPages}</span>
        </div>
      </div>

      {/* Page Body Content */}
      <div className="relative z-10 px-10 py-5 flex-1 flex flex-col justify-center">
        {children}
      </div>

      {/* Footer Bar */}
      <div className="relative z-10 px-10 py-2.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
        <span className="tracking-widest uppercase font-bold">DIGI TALKS INDIA • Corporate Profile</span>
        <span className="font-mono font-semibold">Confidential Document</span>
      </div>
    </div>
  );
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

  let activePageIdx = currentPageIndex;
  if (chapterId) {
    const found = pages.findIndex(p => p.id === chapterId);
    if (found !== -1) activePageIdx = found;
  }

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

  if (!hasPages) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold">No Pages Available</h2>
        <Link to="/" className="mt-4 text-emerald-400 hover:underline">Return Home</Link>
      </div>
    );
  }

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
          <span className="text-slate-400 text-sm font-mono">
            Page {activePageIdx + 1} of {pages.length}
          </span>

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
            /* ─── PAGE 1: Cover Page ─── */
            if (page.pageType === 'cover') {
              return (
                <div
                  key={page.id}
                  className={`widescreen-page-16-9 relative rounded-2xl shadow-2xl overflow-hidden print-page ${idx !== activePageIdx ? 'hidden-on-screen' : ''}`}
                  style={{ backgroundColor: page.bgColor || '#00674f' }}
                >
                  <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px)`,
                  }} />

                  <div className="absolute top-6 left-6 w-24 h-24 border-t-2 border-l-2 border-white/25 rounded-tl-xl" />
                  <div className="absolute top-6 right-6 w-24 h-24 border-t-2 border-r-2 border-white/25 rounded-tr-xl" />
                  <div className="absolute bottom-6 left-6 w-24 h-24 border-b-2 border-l-2 border-white/25 rounded-bl-xl" />
                  <div className="absolute bottom-6 right-6 w-24 h-24 border-b-2 border-r-2 border-white/25 rounded-br-xl" />

                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400" />
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400" />

                  <div className="relative z-10 h-full flex flex-col items-center justify-center px-12 py-8 text-center">
                    {page.logoUrl && (
                      <img
                        src={page.logoUrl}
                        alt="Digitalks Logo"
                        className="w-44 h-44 object-contain mb-4 drop-shadow-2xl"
                      />
                    )}

                    <h1 className="text-4xl lg:text-5xl font-bold tracking-[0.2em] text-white uppercase mb-2" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}>
                      {page.companyName || 'DIGI TALKS INDIA'}
                    </h1>

                    <h2 className="text-lg lg:text-xl font-semibold tracking-wider text-yellow-300 mb-3 max-w-2xl">
                      {page.tagline || page.subtitle || 'Corporate Company Profile'}
                    </h2>

                    <div className="flex items-center gap-4 my-3">
                      <div className="w-20 h-px bg-gradient-to-r from-transparent to-yellow-400" />
                      <div className="w-2.5 h-2.5 rotate-45 bg-yellow-400 shadow-lg shadow-yellow-400/40" />
                      <div className="w-20 h-px bg-gradient-to-l from-transparent to-yellow-400" />
                    </div>

                    {page.services && (
                      <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl my-3">
                        {page.services.map((srv, sidx) => (
                          <span
                            key={sidx}
                            className="px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white text-xs lg:text-sm font-semibold tracking-wide shadow-sm"
                          >
                            {srv}
                          </span>
                        ))}
                      </div>
                    )}

                    {page.quote && (
                      <div className="mt-4 px-6 py-2 rounded-xl bg-black/25 border border-yellow-400/40 text-amber-200 font-serif italic text-base lg:text-lg font-semibold tracking-wide shadow-inner">
                        {page.quote}
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-5 left-0 right-0 flex justify-center">
                    <span className="text-[11px] text-white/40 tracking-[0.4em] uppercase font-bold">
                      Confidential • Corporate Profile
                    </span>
                  </div>
                </div>
              );
            }

            /* ─── PAGE 2: About DIGI TALKS INDIA ─── */
            if (page.pageType === 'about') {
              return (
                <InternalPageWrapper key={page.id} badge={page.badge} pageNumber={2} totalPages={pages.length} activePageIdx={activePageIdx}>
                  <div className="grid grid-cols-12 gap-8 items-center">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="col-span-7 space-y-4">
                      <div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                          <span>About</span>
                          <span className="text-[#00674f]">DIGI TALKS INDIA</span>
                        </h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-[#00674f] to-amber-400 rounded-full mt-2" />
                      </div>

                      <p className="text-slate-800 text-sm lg:text-base leading-relaxed font-normal bg-emerald-50 border border-emerald-200 p-4 rounded-xl shadow-sm">
                        <strong className="text-[#00674f] font-bold">DIGI TALKS INDIA</strong> is a technology company specializing in software engineering, enterprise digital solutions, and business automation. We partner with startups, SMEs, and enterprises to design and develop scalable digital products that improve efficiency, increase productivity, and create measurable business value.
                      </p>

                      <p className="text-slate-700 text-sm lg:text-base leading-relaxed font-normal">
                        With a strong focus on innovation, quality, and long-term partnerships, we help organizations transform ideas into powerful digital solutions.
                      </p>

                      <div className="grid grid-cols-3 gap-3 pt-1">
                        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col gap-1 hover:border-[#00674f] transition group">
                          <Cpu className="w-6 h-6 text-[#00674f] group-hover:scale-110 transition" />
                          <h4 className="text-sm font-bold text-slate-900">Software & AI</h4>
                          <p className="text-xs text-slate-600 font-normal">Scalable Engineering</p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col gap-1 hover:border-amber-500 transition group">
                          <Zap className="w-6 h-6 text-amber-600 group-hover:scale-110 transition" />
                          <h4 className="text-sm font-bold text-slate-900">Automation</h4>
                          <p className="text-xs text-slate-600 font-normal">Enterprise Workflows</p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col gap-1 hover:border-[#00674f] transition group">
                          <TrendingUp className="w-6 h-6 text-[#00674f] group-hover:scale-110 transition" />
                          <h4 className="text-sm font-bold text-slate-900">Growth & ROI</h4>
                          <p className="text-xs text-slate-600 font-normal">Measurable Value</p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="col-span-5 relative">
                      <div className="relative rounded-2xl overflow-hidden border border-[#00674f]/40 shadow-xl group">
                        <img
                          src={page.image || '/assets/about-digitalks.jpg'}
                          alt="About DIGI TALKS INDIA"
                          className="w-full h-[260px] lg:h-[290px] object-cover rounded-xl transform group-hover:scale-105 transition duration-700"
                        />
                        <div className="absolute bottom-3 left-3 right-3 p-3 bg-slate-900/90 backdrop-blur-md rounded-xl border border-emerald-400/40 flex items-center justify-between text-white">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-bold">Digital Transformation</span>
                          </div>
                          <span className="text-[11px] font-mono text-amber-300 font-bold">Innovation & Scale</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </InternalPageWrapper>
              );
            }

            /* ─── PAGE 3: Our Story ─── */
            if (page.pageType === 'story') {
              return (
                <InternalPageWrapper key={page.id} badge={page.badge} pageNumber={3} totalPages={pages.length} activePageIdx={activePageIdx}>
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <Building2 className="w-8 h-8 text-[#00674f]" />
                        <span>Our Story</span>
                      </h2>
                      <div className="w-20 h-1.5 bg-gradient-to-r from-[#00674f] to-amber-400 rounded-full mt-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      <div className="md:col-span-7 space-y-4">
                        {page.paragraphs && page.paragraphs.map((p, pidx) => (
                          <p key={pidx} className="text-slate-800 text-sm lg:text-base font-normal leading-relaxed">
                            {p}
                          </p>
                        ))}
                      </div>

                      <div className="md:col-span-5 bg-gradient-to-br from-emerald-50 to-amber-50 border border-emerald-300 p-6 rounded-2xl shadow-md text-center space-y-3">
                        <div className="w-12 h-12 bg-[#00674f] text-white rounded-xl flex items-center justify-center mx-auto shadow-md">
                          <Target className="w-6 h-6" />
                        </div>
                        <h4 className="text-xs font-bold text-[#00674f] uppercase tracking-widest">Our Core Purpose</h4>
                        <p className="text-slate-900 font-bold text-base lg:text-lg leading-snug">
                          "{page.purpose}"
                        </p>
                      </div>
                    </div>
                  </div>
                </InternalPageWrapper>
              );
            }

            /* ─── PAGE 4: Vision & Mission ─── */
            if (page.pageType === 'vision-mission') {
              return (
                <InternalPageWrapper key={page.id} badge={page.badge} pageNumber={4} totalPages={pages.length} activePageIdx={activePageIdx}>
                  <div className="grid grid-cols-12 gap-8 items-stretch">
                    {/* Vision Card */}
                    <div className="col-span-5 bg-gradient-to-br from-[#00674f] to-slate-900 text-white p-7 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                      <div>
                        <div className="w-12 h-12 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-white/30">
                          <Eye className="w-6 h-6 text-yellow-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Our Vision</h3>
                        <div className="w-16 h-1 bg-yellow-400 rounded-full mb-4" />
                        <p className="text-slate-100 text-sm lg:text-base leading-relaxed font-normal">
                          "{page.vision}"
                        </p>
                      </div>
                      <div className="pt-6 border-t border-white/20 flex items-center gap-2 text-xs text-amber-300 font-bold font-mono">
                        <Sparkles className="w-4 h-4" />
                        <span>Sustainable Business Growth</span>
                      </div>
                    </div>

                    {/* Mission Card */}
                    <div className="col-span-7 bg-white border border-slate-200 p-7 rounded-2xl shadow-md flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Rocket className="w-7 h-7 text-[#00674f]" />
                          <h3 className="text-2xl font-bold text-slate-900">Our Mission</h3>
                        </div>
                        <div className="w-16 h-1.5 bg-[#00674f] rounded-full mb-5" />

                        <div className="space-y-3">
                          {page.missions && page.missions.map((m, midx) => (
                            <div key={midx} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                              <CheckCircle2 className="w-5 h-5 text-[#00674f] shrink-0 mt-0.5" />
                              <span className="text-slate-900 text-sm lg:text-base font-bold">{m}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </InternalPageWrapper>
              );
            }

            /* ─── PAGE 5: Core Services ─── */
            if (page.pageType === 'services') {
              return (
                <InternalPageWrapper key={page.id} badge={page.badge} pageNumber={5} totalPages={pages.length} activePageIdx={activePageIdx}>
                  <div className="space-y-4">
                    <div className="text-center max-w-2xl mx-auto">
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Core Services</h2>
                      <div className="w-20 h-1.5 bg-[#00674f] mx-auto rounded-full mt-2" />
                    </div>

                    <div className="grid grid-cols-4 gap-3 pt-2">
                      {page.servicesList && page.servicesList.map((srv, sidx) => (
                        <div key={sidx} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-[#00674f] hover:bg-emerald-50/40 transition group">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#00674f] flex items-center justify-center mb-2 group-hover:bg-[#00674f] group-hover:text-white transition">
                            <Code className="w-4.5 h-4.5" />
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 mb-1">{srv.name}</h4>
                          <p className="text-[11px] text-slate-600 font-normal leading-snug">{srv.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </InternalPageWrapper>
              );
            }

            /* ─── PAGE 6: Digital Transformation ─── */
            if (page.pageType === 'digital-trans') {
              return (
                <InternalPageWrapper key={page.id} badge={page.badge} pageNumber={6} totalPages={pages.length} activePageIdx={activePageIdx}>
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <Zap className="w-7 h-7 text-amber-500" />
                        <span>Digital Transformation Services</span>
                      </h2>
                      <div className="w-20 h-1.5 bg-[#00674f] rounded-full mt-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {page.items && page.items.map((item, iidx) => (
                        <div key={iidx} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start gap-3 hover:border-[#00674f] transition">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#00674f] flex items-center justify-center shrink-0 mt-0.5 font-mono text-xs font-bold">
                            0{iidx + 1}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 mb-0.5">{item.title}</h4>
                            <p className="text-[11px] text-slate-600 font-normal leading-snug">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </InternalPageWrapper>
              );
            }

            /* ─── PAGE 7: Software Engineering ─── */
            if (page.pageType === 'engineering') {
              return (
                <InternalPageWrapper key={page.id} badge={page.badge} pageNumber={7} totalPages={pages.length} activePageIdx={activePageIdx}>
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Software Engineering</h2>
                      <p className="text-xs text-[#00674f] font-bold uppercase tracking-wider mt-1">{page.subheading}</p>
                      <div className="w-20 h-1.5 bg-[#00674f] rounded-full mt-2" />
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      {page.pillars && page.pillars.map((p, pidx) => (
                        <div key={pidx} className="p-4 rounded-xl bg-white border border-emerald-200 text-center space-y-1 shadow-sm hover:border-[#00674f] transition">
                          <ShieldCheck className="w-6 h-6 text-[#00674f] mx-auto" />
                          <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                          <p className="text-[11px] text-slate-600 font-normal">{p.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 rounded-xl bg-[#00674f] text-white text-center border border-emerald-400 shadow-md">
                      <p className="text-xs lg:text-sm font-bold tracking-wide text-amber-200">
                        ✨ {page.outro}
                      </p>
                    </div>
                  </div>
                </InternalPageWrapper>
              );
            }

            /* ─── PAGE 8: Industries We Serve ─── */
            if (page.pageType === 'industries') {
              return (
                <InternalPageWrapper key={page.id} badge={page.badge} pageNumber={8} totalPages={pages.length} activePageIdx={activePageIdx}>
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Industries We Serve</h2>
                      <div className="w-20 h-1.5 bg-[#00674f] rounded-full mt-2" />
                    </div>

                    <div className="grid grid-cols-5 gap-3 pt-2">
                      {page.industriesList && page.industriesList.map((ind, iidx) => (
                        <div key={iidx} className="p-3.5 rounded-xl bg-white border border-slate-200 text-center shadow-sm hover:border-[#00674f] hover:bg-emerald-50/60 transition">
                          <Building2 className="w-6 h-6 text-[#00674f] mx-auto mb-1.5" />
                          <h4 className="text-xs font-bold text-slate-900">{ind.name}</h4>
                        </div>
                      ))}
                    </div>
                  </div>
                </InternalPageWrapper>
              );
            }

            /* ─── PAGE 9: Technology Expertise ─── */
            if (page.pageType === 'tech-stack') {
              return (
                <InternalPageWrapper key={page.id} badge={page.badge} pageNumber={9} totalPages={pages.length} activePageIdx={activePageIdx}>
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Technology Expertise</h2>
                      <div className="w-20 h-1.5 bg-[#00674f] rounded-full mt-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {page.categories && page.categories.map((cat, cidx) => (
                        <div key={cidx} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
                          <h4 className="text-xs font-bold text-[#00674f] uppercase tracking-wider">{cat.title}</h4>
                          <div className="flex flex-wrap gap-2">
                            {cat.skills.map((skill, skidx) => (
                              <span key={skidx} className="px-3 py-1 rounded-md bg-emerald-50 border border-emerald-300 text-slate-900 text-xs font-bold shadow-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </InternalPageWrapper>
              );
            }

            /* ─── PAGE 10: Process ─── */
            if (page.pageType === 'process') {
              return (
                <InternalPageWrapper key={page.id} badge={page.badge} pageNumber={10} totalPages={pages.length} activePageIdx={activePageIdx}>
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Our Development Process</h2>
                      <div className="w-20 h-1.5 bg-[#00674f] rounded-full mt-2" />
                    </div>

                    <div className="grid grid-cols-7 gap-2 pt-2">
                      {page.steps && page.steps.map((st, stidx) => (
                        <div key={stidx} className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm text-center space-y-1 hover:border-[#00674f] transition">
                          <span className="text-xs font-mono font-bold text-[#00674f] bg-emerald-100 px-2 py-0.5 rounded-full">{st.num}</span>
                          <h4 className="text-xs font-bold text-slate-900 mt-1">{st.name}</h4>
                          <p className="text-[10px] text-slate-600 font-normal leading-tight">{st.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </InternalPageWrapper>
              );
            }

            /* ─── PAGE 11: Why Us ─── */
            if (page.pageType === 'why-us') {
              return (
                <InternalPageWrapper key={page.id} badge={page.badge} pageNumber={11} totalPages={pages.length} activePageIdx={activePageIdx}>
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Why DIGI TALKS INDIA?</h2>
                      <div className="w-20 h-1.5 bg-[#00674f] rounded-full mt-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {page.reasons && page.reasons.map((r, ridx) => (
                        <div key={ridx} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3 hover:border-emerald-500 transition">
                          <div className="w-7 h-7 rounded-full bg-[#00674f] text-white flex items-center justify-center shrink-0 shadow-sm">
                            <Check className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-bold text-slate-900">{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </InternalPageWrapper>
              );
            }

            /* ─── PAGE 12: Values ─── */
            if (page.pageType === 'values') {
              return (
                <InternalPageWrapper key={page.id} badge={page.badge} pageNumber={12} totalPages={pages.length} activePageIdx={activePageIdx}>
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Our Values</h2>
                      <div className="w-20 h-1.5 bg-[#00674f] rounded-full mt-2" />
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      {page.valuesList && page.valuesList.map((val, vidx) => (
                        <div key={vidx} className="p-4 rounded-xl bg-white border border-emerald-200 shadow-sm space-y-1 hover:border-[#00674f] transition">
                          <HeartHandshake className="w-6 h-6 text-[#00674f]" />
                          <h4 className="text-xs font-bold text-slate-900">{val.title}</h4>
                          <p className="text-[11px] text-slate-600 font-normal leading-tight">{val.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </InternalPageWrapper>
              );
            }

            /* ─── PAGE 13: What Makes Us Different ─── */
            if (page.pageType === 'differentiators') {
              return (
                <InternalPageWrapper key={page.id} badge={page.badge} pageNumber={13} totalPages={pages.length} activePageIdx={activePageIdx}>
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">What Makes Us Different</h2>
                      <div className="w-20 h-1.5 bg-[#00674f] rounded-full mt-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {page.points && page.points.map((pt, pidx) => (
                        <div key={pidx} className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 shadow-sm flex items-center gap-3">
                          <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                          <span className="text-xs font-bold text-slate-900">{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </InternalPageWrapper>
              );
            }

            /* ─── PAGE 14: Engagement Models ─── */
            if (page.pageType === 'engagement') {
              return (
                <InternalPageWrapper key={page.id} badge={page.badge} pageNumber={14} totalPages={pages.length} activePageIdx={activePageIdx}>
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Engagement Models</h2>
                      <div className="w-20 h-1.5 bg-[#00674f] rounded-full mt-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {page.models && page.models.map((mod, midx) => (
                        <div key={midx} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1 hover:border-[#00674f] transition">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#00674f] flex items-center justify-center font-bold text-xs mb-1">
                            0{midx + 1}
                          </div>
                          <h4 className="text-xs font-bold text-slate-900">{mod.name}</h4>
                          <p className="text-[11px] text-slate-600 font-normal leading-tight">{mod.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </InternalPageWrapper>
              );
            }

            /* ─── PAGE 15: Quality Standards ─── */
            if (page.pageType === 'quality') {
              return (
                <InternalPageWrapper key={page.id} badge={page.badge} pageNumber={15} totalPages={pages.length} activePageIdx={activePageIdx}>
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Quality Standards</h2>
                      <div className="w-20 h-1.5 bg-[#00674f] rounded-full mt-2" />
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      {page.standardsList && page.standardsList.map((std, sidx) => (
                        <div key={sidx} className="p-4 rounded-xl bg-white border border-emerald-200 text-center shadow-sm space-y-1">
                          <ShieldCheck className="w-6 h-6 text-[#00674f] mx-auto" />
                          <h4 className="text-xs font-bold text-slate-900">{std}</h4>
                        </div>
                      ))}
                    </div>
                  </div>
                </InternalPageWrapper>
              );
            }

            /* ─── PAGE 16: Our Commitment ─── */
            if (page.pageType === 'commitment') {
              return (
                <InternalPageWrapper key={page.id} badge={page.badge} pageNumber={16} totalPages={pages.length} activePageIdx={activePageIdx}>
                  <div className="max-w-3xl mx-auto space-y-6 text-center">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Our Commitment</h2>
                      <div className="w-20 h-1.5 bg-[#00674f] mx-auto rounded-full mt-2" />
                    </div>

                    <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 shadow-md">
                      <p className="text-xl lg:text-2xl font-bold text-[#00674f] italic">
                        "{page.quote}"
                      </p>
                    </div>

                    <p className="text-slate-800 text-base font-medium leading-relaxed">
                      {page.statement}
                    </p>
                  </div>
                </InternalPageWrapper>
              );
            }

            /* ─── PAGE 17: Future Focus ─── */
            if (page.pageType === 'future') {
              return (
                <InternalPageWrapper key={page.id} badge={page.badge} pageNumber={17} totalPages={pages.length} activePageIdx={activePageIdx}>
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Future Focus</h2>
                      <div className="w-20 h-1.5 bg-[#00674f] rounded-full mt-2" />
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      {page.focusList && page.focusList.map((f, fidx) => (
                        <div key={fidx} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-center space-y-1 hover:border-[#00674f] transition">
                          <Rocket className="w-6 h-6 text-amber-500 mx-auto" />
                          <h4 className="text-xs font-bold text-slate-900">{f}</h4>
                        </div>
                      ))}
                    </div>
                  </div>
                </InternalPageWrapper>
              );
            }

            /* ─── PAGE 18: Our Promise ─── */
            if (page.pageType === 'promise') {
              return (
                <InternalPageWrapper key={page.id} badge={page.badge} pageNumber={18} totalPages={pages.length} activePageIdx={activePageIdx}>
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Our Promise</h2>
                      <div className="w-20 h-1.5 bg-[#00674f] mx-auto rounded-full mt-2" />
                    </div>

                    <div className="grid grid-cols-6 gap-3 pt-2">
                      {page.promiseSteps && page.promiseSteps.map((p, pidx) => (
                        <div key={pidx} className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center shadow-sm space-y-2">
                          <div className="w-8 h-8 rounded-full bg-[#00674f] text-white flex items-center justify-center mx-auto text-xs font-bold shadow-md">
                            {pidx + 1}
                          </div>
                          <h4 className="text-xs font-bold text-slate-900">{p}</h4>
                        </div>
                      ))}
                    </div>
                  </div>
                </InternalPageWrapper>
              );
            }

            /* ─── PAGE 19: Call To Action ─── */
            if (page.pageType === 'call-to-action') {
              return (
                <InternalPageWrapper key={page.id} badge={page.badge} pageNumber={19} totalPages={pages.length} activePageIdx={activePageIdx}>
                  <div className="max-w-3xl mx-auto space-y-6 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                      Let's Build Something Great Together
                    </h2>
                    <div className="w-24 h-1.5 bg-[#00674f] mx-auto rounded-full" />

                    <p className="text-slate-800 text-base font-medium leading-relaxed">
                      {page.message}
                    </p>

                    <div className="p-5 rounded-2xl bg-[#00674f] text-white shadow-xl">
                      <h3 className="text-xl font-bold text-amber-300">
                        {page.highlight}
                      </h3>
                    </div>
                  </div>
                </InternalPageWrapper>
              );
            }

            /* ─── PAGE 20: Our Clients Overview ─── */
            if (page.pageType === 'clients-overview') {
              return (
                <InternalPageWrapper key={page.id} badge={page.badge} pageNumber={20} totalPages={pages.length} activePageIdx={activePageIdx}>
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <Users className="w-8 h-8 text-[#00674f]" />
                        <span>OUR CLIENTS</span>
                      </h2>
                      <p className="text-sm font-bold text-[#00674f] mt-1">{page.subheading}</p>
                      <div className="w-24 h-1.5 bg-gradient-to-r from-[#00674f] to-amber-400 rounded-full mt-2" />
                    </div>

                    <div className="grid grid-cols-12 gap-6 items-center">
                      <div className="col-span-7 space-y-4">
                        {page.paragraphs && page.paragraphs.map((p, pidx) => (
                          <p key={pidx} className="text-slate-800 text-sm lg:text-base font-normal leading-relaxed bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            {p}
                          </p>
                        ))}
                      </div>

                      <div className="col-span-5 bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-6 rounded-2xl border border-emerald-300 shadow-md space-y-3">
                        <h4 className="text-xs font-bold text-[#00674f] uppercase tracking-wider">Key Sectors Served</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2.5 rounded-lg bg-white border border-emerald-200 text-xs font-bold text-slate-900 flex items-center gap-2">
                            <Landmark className="w-4 h-4 text-[#00674f]" />
                            <span>Banking & Finance</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-white border border-emerald-200 text-xs font-bold text-slate-900 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-[#00674f]" />
                            <span>Real Estate</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-white border border-emerald-200 text-xs font-bold text-slate-900 flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-[#00674f]" />
                            <span>Enterprise Software</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-white border border-emerald-200 text-xs font-bold text-slate-900 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-[#00674f]" />
                            <span>Digital Marketing</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </InternalPageWrapper>
              );
            }

            /* ─── PAGE 21: Case Study - Guntur Urban Bank ─── */
            if (page.pageType === 'client-case-bank') {
              return (
                <InternalPageWrapper key={page.id} badge={page.badge} pageNumber={21} totalPages={pages.length} activePageIdx={activePageIdx}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider font-mono">Case Study • Banking</span>
                        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">{page.clientName}</h2>
                      </div>
                      <a href={page.website} target="_blank" rel="noopener noreferrer" className="px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-[#00674f] hover:bg-[#00674f] hover:text-white transition flex items-center gap-2 text-xs font-bold shadow-sm">
                        <span>guntururban.bank.in</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                      {/* Overview & Tech */}
                      <div className="col-span-7 space-y-3">
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                          <h4 className="text-xs font-bold text-[#00674f] uppercase tracking-wider mb-1">Project Overview</h4>
                          <p className="text-xs text-slate-700 font-normal leading-relaxed">{page.overview}</p>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">Technologies Used</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {page.techStack && page.techStack.map((tech, tidx) => (
                              <span key={tidx} className="px-2.5 py-1 rounded-md bg-emerald-100/70 border border-emerald-300 text-slate-900 text-[11px] font-bold">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Scope & Benefits */}
                      <div className="col-span-5 space-y-3">
                        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-[#00674f]" />
                            <span>Business Benefits</span>
                          </h4>
                          <div className="grid grid-cols-2 gap-1.5">
                            {page.benefits && page.benefits.map((b, bidx) => (
                              <div key={bidx} className="p-1.5 rounded bg-emerald-50 text-[11px] font-bold text-slate-800 border border-emerald-200">
                                ✓ {b}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </InternalPageWrapper>
              );
            }

            /* ─── PAGE 22: Case Study - Sri Savithru Infra Projects ─── */
            if (page.pageType === 'client-case-realestate-1') {
              return (
                <InternalPageWrapper key={page.id} badge={page.badge} pageNumber={22} totalPages={pages.length} activePageIdx={activePageIdx}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider font-mono">Case Study • Real Estate</span>
                        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">{page.clientName}</h2>
                      </div>
                      <a href={page.website} target="_blank" rel="noopener noreferrer" className="px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-[#00674f] hover:bg-[#00674f] hover:text-white transition flex items-center gap-2 text-xs font-bold shadow-sm">
                        <span>srisavithru.in</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-7 space-y-3">
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                          <h4 className="text-xs font-bold text-[#00674f] uppercase tracking-wider mb-1">Project Overview</h4>
                          <p className="text-xs text-slate-700 font-normal leading-relaxed">{page.overview}</p>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">Services Delivered</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {page.servicesDelivered && page.servicesDelivered.map((srv, sidx) => (
                              <span key={sidx} className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-slate-800 text-[11px] font-bold">
                                {srv}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-5 space-y-3">
                        <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-50 to-amber-50 border border-emerald-300 shadow-sm">
                          <h4 className="text-xs font-bold text-[#00674f] uppercase tracking-wider mb-1.5">Business Outcomes</h4>
                          <div className="space-y-1.5">
                            {page.outcomes && page.outcomes.map((o, oidx) => (
                              <div key={oidx} className="flex items-center gap-2 text-xs font-bold text-slate-900">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                <span>{o}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </InternalPageWrapper>
              );
            }

            /* ─── PAGE 23: Case Study - Pulagam Properties ─── */
            if (page.pageType === 'client-case-realestate-2') {
              return (
                <InternalPageWrapper key={page.id} badge={page.badge} pageNumber={23} totalPages={pages.length} activePageIdx={activePageIdx}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider font-mono">Case Study • Real Estate</span>
                        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">{page.clientName}</h2>
                      </div>
                      <a href={page.website} target="_blank" rel="noopener noreferrer" className="px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-[#00674f] hover:bg-[#00674f] hover:text-white transition flex items-center gap-2 text-xs font-bold shadow-sm">
                        <span>pulagamproperties.com</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-7 space-y-3">
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                          <h4 className="text-xs font-bold text-[#00674f] uppercase tracking-wider mb-1">Project Overview</h4>
                          <p className="text-xs text-slate-700 font-normal leading-relaxed">{page.overview}</p>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">Services Delivered</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {page.servicesDelivered && page.servicesDelivered.map((srv, sidx) => (
                              <span key={sidx} className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-slate-800 text-[11px] font-bold">
                                {srv}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-5 space-y-3">
                        <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-50 to-amber-50 border border-emerald-300 shadow-sm">
                          <h4 className="text-xs font-bold text-[#00674f] uppercase tracking-wider mb-1.5">Business Outcomes</h4>
                          <div className="space-y-1.5">
                            {page.outcomes && page.outcomes.map((o, oidx) => (
                              <div key={oidx} className="flex items-center gap-2 text-xs font-bold text-slate-900">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                <span>{o}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </InternalPageWrapper>
              );
            }

            /* ─── PAGE 24: Capabilities ─── */
            if (page.pageType === 'capabilities') {
              return (
                <InternalPageWrapper key={page.id} badge={page.badge} pageNumber={24} totalPages={pages.length} activePageIdx={activePageIdx}>
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Our Capabilities</h2>
                      <p className="text-xs text-[#00674f] font-bold uppercase tracking-wider mt-1">{page.subheading}</p>
                      <div className="w-20 h-1.5 bg-[#00674f] rounded-full mt-2" />
                    </div>

                    <div className="grid grid-cols-4 gap-3 pt-2">
                      {page.capabilitiesList && page.capabilitiesList.map((cap, cidx) => (
                        <div key={cidx} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3 hover:border-[#00674f] transition">
                          <CheckCircle2 className="w-5 h-5 text-[#00674f] shrink-0" />
                          <span className="text-xs font-bold text-slate-900">{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </InternalPageWrapper>
              );
            }

            /* ─── PAGE 25: Growing Together ─── */
            if (page.pageType === 'growing-together') {
              return (
                <InternalPageWrapper key={page.id} badge={page.badge} pageNumber={25} totalPages={pages.length} activePageIdx={activePageIdx}>
                  <div className="max-w-3xl mx-auto space-y-6 text-center">
                    <div>
                      <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">Growing Together</h2>
                      <div className="w-24 h-1.5 bg-[#00674f] mx-auto rounded-full mt-2" />
                    </div>

                    <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 shadow-md">
                      <p className="text-slate-800 text-base lg:text-lg font-bold leading-relaxed">
                        "{page.message}"
                      </p>
                    </div>

                    <div className="flex justify-center gap-3">
                      <span className="px-4 py-1.5 rounded-full bg-[#00674f] text-white text-xs font-bold">Banking</span>
                      <span className="px-4 py-1.5 rounded-full bg-[#00674f] text-white text-xs font-bold">Real Estate</span>
                      <span className="px-4 py-1.5 rounded-full bg-[#00674f] text-white text-xs font-bold">Enterprise Software</span>
                      <span className="px-4 py-1.5 rounded-full bg-[#00674f] text-white text-xs font-bold">Healthcare</span>
                      <span className="px-4 py-1.5 rounded-full bg-[#00674f] text-white text-xs font-bold">Retail</span>
                    </div>
                  </div>
                </InternalPageWrapper>
              );
            }

            /* ─── PAGE 26: Contact Us ─── */
            if (page.pageType === 'contact') {
              return (
                <InternalPageWrapper key={page.id} badge={page.badge} pageNumber={26} totalPages={pages.length} activePageIdx={activePageIdx}>
                  <div className="grid grid-cols-12 gap-8 items-center">
                    <div className="col-span-7 space-y-5">
                      <div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">Contact Us</h2>
                        <h3 className="text-xl lg:text-2xl font-bold text-[#00674f] mt-1">{page.companyName || 'DIGI TALKS INDIA'}</h3>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-[#00674f] to-amber-400 rounded-full mt-2" />
                      </div>

                      {/* Highlighted Phone Card */}
                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 shadow-md flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#00674f] text-white flex items-center justify-center shrink-0 shadow-md">
                          <Phone className="w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#00674f] uppercase tracking-wider">Phone / WhatsApp</span>
                          <h4 className="text-2xl font-bold text-slate-900 tracking-wide">{page.phone || '+91 9966 824 854'}</h4>
                        </div>
                      </div>

                      {/* Email & Web */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
                          <Mail className="w-5 h-5 text-[#00674f] shrink-0" />
                          <div>
                            <span className="text-[11px] font-bold text-slate-500 uppercase">Email</span>
                            <p className="text-sm font-bold text-slate-900">{page.email || 'contact@digitalksindia.com'}</p>
                          </div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
                          <Globe className="w-5 h-5 text-[#00674f] shrink-0" />
                          <div>
                            <span className="text-[11px] font-bold text-slate-500 uppercase">Website</span>
                            <p className="text-sm font-bold text-slate-900">{page.website || 'www.digitalksindia.com'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-5 bg-gradient-to-br from-emerald-50 via-white to-amber-50/50 p-6 rounded-2xl border border-emerald-300 shadow-md space-y-4 text-center">
                      <div className="w-12 h-12 bg-[#00674f] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                        <Sparkles className="w-6 h-6 text-yellow-300" />
                      </div>
                      <h4 className="text-xs font-bold text-[#00674f] uppercase tracking-wider">Services Summary</h4>
                      <div className="flex flex-wrap justify-center gap-2">
                        {page.servicesSummary && page.servicesSummary.map((s, sidx) => (
                          <span key={sidx} className="px-3 py-1 bg-white border border-emerald-300 text-xs font-bold text-slate-900 rounded-lg shadow-sm">
                            {s}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs font-bold italic text-slate-700 font-serif pt-3 border-t border-emerald-200">
                        "{page.tagline || 'Empowering Businesses Through Digital Innovation'}"
                      </p>
                    </div>
                  </div>
                </InternalPageWrapper>
              );
            }

            /* ─── Standard Markdown Page Fallback ─── */
            return (
              <InternalPageWrapper key={page.id} badge={page.badge || 'Document'} pageNumber={idx + 1} totalPages={pages.length} activePageIdx={activePageIdx}>
                <div className="a4-reading-content">
                  {renderMarkdown(page.content)}
                </div>
              </InternalPageWrapper>
            );
          })}
        </div>
      </div>

      {/* Bottom Page Thumbnails */}
      {pages.length > 1 && (
        <div className="no-print bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 px-6 py-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <Layers className="w-4 h-4 text-slate-500 shrink-0 mr-1" />
            {pages.map((page, idx) => (
              <button
                key={page.id}
                onClick={() => setCurrentPageIndex(idx)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
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
