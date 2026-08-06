import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BOOKS_DATA } from '../data/booksData';
import {
  BookOpen, ChevronRight, Bookmark, ArrowLeft, ArrowRight,
  Menu, Share2, Check, Clock, Calendar, Sparkles, UserCheck, Briefcase, User, Compass, Printer, Home,
  FileText, Layers, Download, X, Info, ShieldCheck, ExternalLink, Globe
} from 'lucide-react';
import SyntaxHighlighter from '../components/SyntaxHighlighter';

export default function BookReaderPage() {
  const { bookId, chapterId } = useParams();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [fontSize, setFontSize] = useState('text-base');
  const [bookmarks, setBookmarks] = useState([]);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printMode, setPrintMode] = useState('all'); // Default to 'all' for exporting all pages in single PDF

  const currentBook = BOOKS_DATA[bookId] || BOOKS_DATA.numerology;
  const isPersonalNumerology = currentBook.id === 'personal-numerology';
  const isDocument = !!currentBook.isDocument;

  // Flexible Chapter Finder with legacy alias support
  const currentChapterIndex = (currentBook && Array.isArray(currentBook.chapters))
    ? currentBook.chapters.findIndex(c => {
        if (!c) return false;
        if (c.id === chapterId) return true;
        if (chapterId === 'chapter-5-lucky-remedies' && c.chapterNumber === 5) return true;
        const requestedNum = typeof chapterId === 'string' ? parseInt(chapterId.replace(/\D/g, ''), 10) : NaN;
        return !isNaN(requestedNum) && c.chapterNumber === requestedNum;
      })
    : -1;

  const safeChapterIndex = currentChapterIndex !== -1 ? currentChapterIndex : 0;
  const activeChapter = (currentBook && Array.isArray(currentBook.chapters) && currentBook.chapters[safeChapterIndex]) || { id: '', title: '', summary: '', content: '', readTime: '' };

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('digibook_bookmarks');
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const isBookmarked = bookmarks.some(
    b => b.bookId === currentBook.id && b.chapterId === activeChapter.id
  );

  const toggleBookmark = () => {
    let updated;
    if (isBookmarked) {
      updated = bookmarks.filter(
        b => !(b.bookId === currentBook.id && b.chapterId === activeChapter.id)
      );
    } else {
      updated = [
        ...bookmarks,
        {
          bookId: currentBook.id,
          bookTitle: currentBook.title,
          chapterId: activeChapter.id,
          chapterTitle: activeChapter.title,
          summary: activeChapter.summary,
          savedAt: new Date().toISOString()
        }
      ];
    }
    setBookmarks(updated);
    localStorage.setItem('digibook_bookmarks', JSON.stringify(updated));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenPrintModal = () => {
    setPrintMode('all');
    setShowPrintModal(true);
  };

  const executePrint = () => {
    setShowPrintModal(false);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const goToChapter = (cId) => {
    navigate(`/book/${currentBook.id}/${cId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevChapter = safeChapterIndex > 0 ? currentBook.chapters[safeChapterIndex - 1] : null;
  const nextChapter = safeChapterIndex < currentBook.chapters.length - 1 ? currentBook.chapters[safeChapterIndex + 1] : null;

  // Inline Markdown Parser for **bold** text
  const parseInlineMarkdown = (text) => {
    if (!text) return '';
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return (
          <strong key={i} className="font-extrabold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  // Helper to extract Life Path cards from text
  const extractLifePathCards = (text) => {
    if (!text) return [];
    const cardBlocks = text.split(/- \*\*లైఫ్ పాత్ నంబర్ - /);
    const cards = [];

    cardBlocks.forEach((block) => {
      if (!block.trim()) return;
      const numMatch = block.match(/^(\d)/);
      if (!numMatch) return;
      const num = numMatch[1];
      const planetMatch = block.match(/\(అధిపతి:\s*([^)]+)\)/);
      const planet = planetMatch ? planetMatch[1] : '';

      const traitsMatch = block.match(/\*\*లక్షణాలు:\*\*\s*([^\n]+)/);
      const traits = traitsMatch ? traitsMatch[1] : '';

      const careerMatch = block.match(/\*\*వృత్తి:\*\*\s*([^\n]+)/);
      const career = careerMatch ? careerMatch[1] : '';

      cards.push({ num, planet, traits, career });
    });

    return cards;
  };

  // Vastu 3x3 Grid Dataset for Chapter 13
  const vastuGridData = [
    { direction: "వాయువ్యము (North-West)", shortDir: "NW", numbers: "7", planet: "కేతువు", element: "జల (Water)", bg: "bg-sky-50/80 border-sky-200 text-sky-950", badgeBg: "bg-sky-600 text-white" },
    { direction: "ఉత్తరము (North)", shortDir: "NORTH", numbers: "2, 5", planet: "చంద్రుడు / బుధుడు", element: "జల / భూమి", bg: "bg-blue-50/80 border-blue-200 text-blue-950", badgeBg: "bg-blue-600 text-white" },
    { direction: "ఈశాన్యము (North-East)", shortDir: "NE", numbers: "1, 3", planet: "సూర్యుడు / గురువు", element: "ఈశ్వర స్థానం / జల", bg: "bg-amber-50/80 border-amber-200 text-amber-950", badgeBg: "bg-amber-600 text-white" },
    { direction: "పడమర (West)", shortDir: "WEST", numbers: "3, 8", planet: "గురువు / శని", element: "వాయు (Air)", bg: "bg-indigo-50/80 border-indigo-200 text-indigo-950", badgeBg: "bg-indigo-600 text-white" },
    { direction: "మధ్య భాగము (Center)", shortDir: "CENTER", numbers: "5", planet: "బుధుడు", element: "ఆకాశం (Space)", isCenter: true, bg: "bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-50 border-amber-400 text-amber-950 shadow-md ring-2 ring-amber-300/80", badgeBg: "bg-amber-500 text-white font-black" },
    { direction: "తూర్పు (East)", shortDir: "EAST", numbers: "1, 4", planet: "సూర్యుడు / రాహువు", element: "అగ్ని (Fire)", bg: "bg-orange-50/80 border-orange-200 text-orange-950", badgeBg: "bg-orange-600 text-white" },
    { direction: "నైరుతి (South-West)", shortDir: "SW", numbers: "8, 4", planet: "శని / రాహువు", element: "భూమి (Earth)", bg: "bg-emerald-50/80 border-emerald-200 text-emerald-950", badgeBg: "bg-emerald-600 text-white" },
    { direction: "దక్షిణము (South)", shortDir: "SOUTH", numbers: "9", planet: "కుజుడు", element: "అగ్ని (Fire)", bg: "bg-rose-50/80 border-rose-200 text-rose-950", badgeBg: "bg-rose-600 text-white" },
    { direction: "ఆగ్నేయము (South-East)", shortDir: "SE", numbers: "6", planet: "శుక్రుడు", element: "అగ్ని / జల", bg: "bg-purple-50/80 border-purple-200 text-purple-950", badgeBg: "bg-purple-600 text-white" }
  ];

  // Full Article & Card Block Renderer with Reduced Compact Headings
  const renderMarkdownContent = (rawText) => {
    if (!rawText) return null;

    const hasLifePathCardsSection = rawText.includes('లైఫ్ పాత్ నంబర్ - 1');
    const hasVastuGridSection = rawText.includes('2. న్యూమరాలజీ వాస్తు 3x3 గ్రిడ్ చార్ట్');

    if (hasVastuGridSection) {
      const startKey = '### 2. న్యూమరాలజీ వాస్తు 3x3 గ్రిడ్ చార్ట్ (Numerology Vastu Grid Chart):';
      const endKey = '### 3. పుట్టిన సంఖ్యను';

      const parts = rawText.split(startKey);
      if (parts.length === 2) {
        const beforeText = parts[0];
        const rest = parts[1];
        const afterParts = rest.split(endKey);
        const afterText = endKey + (afterParts[1] || '');

        return (
          <>
            {renderStandardMarkdown(beforeText)}

            <div className="my-8 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-sm">
                  <Compass className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-telugu">
                    న్యూమరాలజీ వాస్తు 3x3 గ్రిడ్ చార్ట్ (Numerology Vastu 3x3 Compass Grid)
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm font-telugu font-medium">
                    గృహం లేదా ఆఫీసు యొక్క 8 దిక్కులు మరియు బ్రహ్మస్థానంలో సంఖ్యలు, గ్రహాలు & తత్వాల అమరిక.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-6">
                {vastuGridData.map((item, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl p-4 border transition-all flex flex-col justify-between ${item.bg}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200/60">
                        <span className="font-extrabold text-sm font-telugu">
                          {item.direction}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-black rounded-full uppercase tracking-wider ${item.badgeBg}`}>
                          {item.shortDir}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs font-telugu">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">సంఖ్య (Numbers):</span>
                          <span className="font-extrabold text-slate-900 text-sm bg-white/80 px-2 py-0.5 rounded-md border border-slate-200/80">
                            {item.numbers}
                          </span>
                        </div>

                        {item.planet && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-medium">అధిపతి (Planet):</span>
                            <span className="font-bold text-slate-800">
                              {item.planet}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">తత్వము (Element):</span>
                          <span className="font-semibold text-slate-800">
                            {item.element}
                          </span>
                        </div>
                      </div>
                    </div>

                    {item.isCenter && (
                      <div className="mt-3 pt-2 border-t border-amber-300/80 text-center">
                        <span className="inline-block px-2.5 py-0.5 bg-amber-600 text-white font-extrabold text-[11px] rounded-full shadow-sm">
                          ✨ బ్రహ్మస్థానం (ఎల్లప్పుడూ ఖాళీగా ఉంచాలి)
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <hr className="my-8 border-slate-200" />

            {renderStandardMarkdown(afterText)}
          </>
        );
      }
    }

    if (hasLifePathCardsSection) {
      const splitKey = '### 2. 1 నుండి 9 వరకు లైఫ్ పాత్ నంబర్ల స్వభావం - వృత్తి అవకాశాలు:';
      const parts = rawText.split(splitKey);

      if (parts.length === 2) {
        const beforeText = parts[0];
        const afterKey = '---';
        const restParts = parts[1].split(afterKey);
        const cardsRawText = restParts[0];
        const afterText = restParts.slice(1).join(afterKey);

        const cards = extractLifePathCards(cardsRawText);

        return (
          <>
            {renderStandardMarkdown(beforeText)}

            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-6 mb-3 font-telugu flex items-center gap-2">
              <span className="w-1.5 h-5 bg-blue-600 rounded-full inline-block"></span>
              <span>2. 1 నుండి 9 వరకు లైఫ్ పాత్ నంబర్ల స్వభావం - వృత్తి అవకాశాలు:</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              {cards.map((card, cIdx) => (
                <div
                  key={cIdx}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold text-base flex items-center justify-center shadow-sm">
                          {card.num}
                        </div>
                        <span className="font-bold text-slate-900 text-base font-telugu">
                          లైఫ్ పాత్ {card.num}
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-full border border-blue-200">
                        {card.planet}
                      </span>
                    </div>

                    {card.traits && (
                      <div className="mb-3">
                        <span className="text-[11px] uppercase font-extrabold text-slate-400 block mb-1 flex items-center gap-1">
                          <User className="w-3 h-3 text-blue-600" />
                          <span>లక్షణాలు (Personality)</span>
                        </span>
                        <p className="text-slate-800 text-xs sm:text-sm font-telugu leading-relaxed font-medium">
                          {card.traits}
                        </p>
                      </div>
                    )}

                    {card.career && (
                      <div>
                        <span className="text-[11px] uppercase font-extrabold text-slate-400 block mb-1 flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-teal-600" />
                          <span>అనుకూల వృత్తులు (Career)</span>
                        </span>
                        <p className="text-slate-800 text-xs sm:text-sm font-telugu leading-relaxed font-medium">
                          {card.career}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <hr className="my-8 border-slate-200" />

            {renderStandardMarkdown(afterText)}
          </>
        );
      }
    }

    return renderStandardMarkdown(rawText);
  };

  // Compact Headings Line-by-Line Parser
  const renderStandardMarkdown = (rawText) => {
    if (!rawText) return null;
    const lines = rawText.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeBuffer = [];
    let codeLang = 'javascript';
    let inTable = false;
    let tableRows = [];
    let unorderedListItems = [];
    let orderedListItems = [];
    let blockquoteLines = [];

    const flushTable = (idx) => {
      if (inTable && tableRows.length > 0) {
        inTable = false;
        const headerRow = tableRows[0];
        const dataRows = tableRows.slice(2);
        const parseCells = (row) => row.split('|').map(c => c.trim()).filter((c, i, arr) => i > 0 && i < arr.length - 1);
        const headers = parseCells(headerRow);

        elements.push(
          <div key={`table-${idx}`} className="my-6 overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
            <table className="w-full text-left border-collapse text-xs sm:text-sm font-telugu">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-900 font-extrabold">
                  {headers.map((h, i) => (
                    <th key={i} className="p-3 sm:p-3.5 border-r last:border-r-0 border-slate-200">
                      {parseInlineMarkdown(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {dataRows.map((row, rIdx) => {
                  const cells = parseCells(row);
                  return (
                    <tr key={rIdx} className="hover:bg-slate-50 transition">
                      {cells.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3 sm:p-3.5 border-r last:border-r-0 border-slate-200 text-slate-800 font-medium">
                          {parseInlineMarkdown(cell)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
      }
    };

    const flushUnorderedList = (idx) => {
      if (unorderedListItems.length > 0) {
        elements.push(
          <ul key={`ul-${idx}`} className="list-disc pl-6 space-y-1.5 my-3 font-telugu text-slate-800 leading-relaxed text-base">
            {unorderedListItems.map((item, i) => (
              <li key={i}>{parseInlineMarkdown(item.replace(/^[-*]\s+/, ''))}</li>
            ))}
          </ul>
        );
        unorderedListItems = [];
      }
    };

    const flushOrderedList = (idx) => {
      if (orderedListItems.length > 0) {
        elements.push(
          <ol key={`ol-${idx}`} className="list-decimal pl-6 space-y-1.5 my-3 font-telugu text-slate-800 leading-relaxed text-base font-medium">
            {orderedListItems.map((item, i) => (
              <li key={i}>{parseInlineMarkdown(item.replace(/^\d+\.\s+/, ''))}</li>
            ))}
          </ol>
        );
        orderedListItems = [];
      }
    };

    const flushBlockquote = (idx) => {
      if (blockquoteLines.length > 0) {
        elements.push(
          <blockquote key={`bq-${idx}`} className="p-4 sm:p-5 my-5 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/40 border-l-4 border-slate-700 font-telugu text-base leading-relaxed text-slate-800 shadow-sm space-y-2">
            {blockquoteLines.map((bline, bi) => (
              <p key={bi}>{parseInlineMarkdown(bline.replace(/^>\s*/, ''))}</p>
            ))}
          </blockquote>
        );
        blockquoteLines = [];
      }
    };

    const flushAll = (idx) => {
      flushTable(idx);
      flushUnorderedList(idx);
      flushOrderedList(idx);
      flushBlockquote(idx);
    };

    lines.forEach((line, index) => {
      if (line.trim().startsWith('```')) {
        flushAll(index);
        if (inCodeBlock) {
          inCodeBlock = false;
          elements.push(
            <SyntaxHighlighter
              key={`code-${index}`}
              code={codeBuffer.join('\n')}
              language={codeLang || 'javascript'}
            />
          );
          codeBuffer = [];
        } else {
          inCodeBlock = true;
          codeLang = line.trim().replace('```', '') || 'javascript';
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      // Table parsing
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        flushUnorderedList(index);
        flushOrderedList(index);
        if (!inTable) {
          inTable = true;
          tableRows = [];
        }
        tableRows.push(line.trim());
        return;
      }

      // Bullet list items
      if (line.startsWith('- ') || line.startsWith('* ')) {
        flushTable(index);
        flushOrderedList(index);
        unorderedListItems.push(line);
        return;
      }

      // Numbered list items
      if (/^\d+\.\s+/.test(line)) {
        flushTable(index);
        flushUnorderedList(index);
        orderedListItems.push(line);
        return;
      }

      // Flush any active table or list before non-list/non-table elements
      flushAll(index);

      // Skip top-level '# ' heading to prevent duplicate title
      if (line.startsWith('# ')) {
        return;
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-lg sm:text-xl font-bold text-blue-800 mt-6 mb-3 font-telugu border-b border-slate-200 pb-1.5">
            {parseInlineMarkdown(line.replace('## ', ''))}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-base sm:text-lg font-bold text-slate-900 mt-5 mb-2.5 font-telugu">
            {parseInlineMarkdown(line.replace('### ', ''))}
          </h3>
        );
      } else if (/^#{4,6}\s+/.test(line)) {
        elements.push(
          <h4 key={index} className="text-sm sm:text-base font-bold text-slate-800 mt-4 mb-2 font-telugu">
            {parseInlineMarkdown(line.replace(/^#{4,6}\s+/, ''))}
          </h4>
        );
      }
      // Callout Box
      else if (line.startsWith('> [!NOTE]')) {
        elements.push(
          <div key={index} className="p-4 my-4 rounded-xl bg-blue-50 border-l-4 border-blue-600 text-blue-900 text-xs sm:text-sm font-telugu shadow-sm">
            <strong className="block mb-1 text-blue-800 font-bold">గమనిక (Editor's Note):</strong>
          </div>
        );
      } else if (line.startsWith('> [!TIP]')) {
        elements.push(
          <div key={index} className="p-4 my-4 rounded-xl bg-amber-50 border-l-4 border-amber-600 text-amber-900 text-xs sm:text-sm font-telugu shadow-sm">
            <strong className="block mb-1 text-amber-800 font-bold">ముఖ్యమైన సూచన (Key Takeaway):</strong>
          </div>
        );
      } else if (line.startsWith('> ') || line.trim() === '>') {
        flushTable(index);
        flushUnorderedList(index);
        flushOrderedList(index);
        blockquoteLines.push(line);
        return;
      }
      // Horizontal Rule
      else if (line.trim() === '---') {
        elements.push(<hr key={index} className="my-6 border-slate-200" />);
      }
      // Markdown Image
      else if (line.startsWith('![')) {
        const match = line.match(/^!\[(.*?)\]\((.*?)\)/);
        if (match) {
          elements.push(
            <div key={index} className="my-6 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-950 max-w-xl mx-auto">
              <img
                src={match[2]}
                alt={match[1]}
                className="w-full h-auto object-cover max-h-[650px] mx-auto block rounded-2xl"
              />
            </div>
          );
        }
      }
      // Regular Article Paragraphs
      else if (line.trim()) {
        elements.push(
          <p key={index} className={`text-slate-800 leading-relaxed mb-4 font-telugu tracking-wide ${fontSize}`}>
            {parseInlineMarkdown(line.trim())}
          </p>
        );
      }
    });

    flushAll(lines.length);

    return elements;
  };

  const chaptersToPrint = printMode === 'all' ? currentBook.chapters : [activeChapter];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Reading Progress Indicator */}
      <div className="no-print fixed top-0 left-0 right-0 h-1 bg-slate-200 z-50">
        <div
          className="h-full bg-blue-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Reader Sub-Header (Content-Constrained Toolbar) */}
      <div className="no-print sticky top-[49px] z-40 bg-slate-50/95 backdrop-blur-md border-b border-slate-200/80 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Toggle Directory Icon & Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white border border-slate-200 shadow-xs rounded-xl text-slate-800 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition font-bold text-xs leading-none"
            title={isSidebarOpen ? "Hide Directory" : "Show Directory"}
          >
            <Menu className="w-4 h-4 text-blue-600 shrink-0" />
            <span className={isDocument ? "font-sans leading-none" : "font-telugu leading-none"}>
              {isSidebarOpen
                ? (isPersonalNumerology ? 'ప్రొఫైల్స్ దాచు' : isDocument ? 'Hide Sections' : 'అధ్యాయాలు దాచు')
                : (isPersonalNumerology ? 'ప్రొఫైల్స్ చూపు' : isDocument ? 'Show Sections' : 'అధ్యాయాలు చూపు')}
            </span>
          </button>

          {/* Right: Unified Action Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition shadow-xs leading-none"
              title="Share Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600 shrink-0" /> : <Share2 className="w-4 h-4 text-slate-600 shrink-0" />}
              <span className="hidden sm:inline leading-none">{copied ? 'Copied' : 'Share'}</span>
            </button>

            {/* Print / Save PDF Button */}
            <button
              onClick={handleOpenPrintModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#02296c] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition shadow-md leading-none"
              title="Export All Pages into a Single PDF Document"
            >
              <Printer className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-sans leading-none">Export All Pages (Single PDF)</span>
            </button>

            {/* Bookmark / Save Button */}
            <button
              onClick={toggleBookmark}
              className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition shadow-xs leading-none ${
                isBookmarked
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 shrink-0 ${isBookmarked ? 'fill-white' : 'text-slate-600'}`} />
              <span className="hidden sm:inline font-telugu leading-none">
                {isBookmarked ? 'Saved' : 'Save'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* PDF Export Settings Modal */}
      <AnimatePresence>
        {showPrintModal && (
          <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white text-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border-2 border-blue-600 relative space-y-4 font-sans"
            >
              <button onClick={() => setShowPrintModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <div className="w-10 h-10 rounded-xl bg-[#02296c] text-white flex items-center justify-center font-bold">
                  <Printer className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Export {currentBook.title} as PDF</h3>
                  <p className="text-xs text-slate-500 font-telugu">
                    Standard A4 Portrait Clean Print (No Margins / No URLs / No Extra Text)
                  </p>
                </div>
              </div>

              {/* Mode Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Export Selection:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPrintMode('current')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 ${
                      printMode === 'current'
                        ? 'bg-blue-50 border-blue-600 text-[#02296c] font-bold shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-bold">{isDocument ? "Active Section" : "Active Chapter"}</span>
                    <span className="text-[11px] text-slate-500 font-normal truncate">
                      {activeChapter.title}
                    </span>
                  </button>

                  <button
                    onClick={() => setPrintMode('all')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 ${
                      printMode === 'all'
                        ? 'bg-blue-50 border-blue-600 text-[#02296c] font-bold shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-bold">{isDocument ? "Entire SRS Document" : "Entire E-Book"}</span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      All {currentBook.chapters.length} {isDocument ? "Sections" : "Chapters"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Settings Checklist */}
              <div className="space-y-2 text-xs text-slate-700">
                <p className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <Info className="w-4 h-4 text-blue-700" />
                  <span>Important Browser Print Settings:</span>
                </p>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-2 font-medium">
                  <div className="flex items-center justify-between border-b border-blue-200 pb-1.5">
                    <span className="font-bold">1. Destination:</span>
                    <span className="px-2 py-0.5 bg-white rounded font-bold text-[#02296c] border border-blue-300">Save as PDF</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-blue-200 pb-1.5">
                    <span className="font-bold">2. Layout / Orientation:</span>
                    <span className="px-2 py-0.5 bg-white rounded font-bold text-[#02296c] border border-blue-300">Portrait (A4 Size)</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-blue-200 pb-1.5">
                    <span className="font-bold">3. Margins:</span>
                    <span className="px-2 py-0.5 bg-white rounded font-bold text-[#02296c] border border-blue-300">None</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-blue-200 pb-1.5">
                    <span className="font-bold">4. Headers and footers:</span>
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded font-bold border border-red-300">☐ UNCHECKED (Disabled)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">5. Background graphics:</span>
                    <span className="px-2 py-0.5 bg-[#02296c] text-white rounded font-bold">☑ ENABLED (Checked)</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 italic">
                  * Unchecking "Headers and footers" ensures NO extra URLs, page titles, or dates appear around the page borders!
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={executePrint}
                  className="px-5 py-2.5 rounded-xl bg-[#02296c] text-white font-bold hover:bg-blue-900 transition text-xs flex items-center gap-2 shadow-md"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Open Print Dialog Now</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Layout: Article Index Sidebar + Center Canvas (On Screen View) */}
      <div className="no-print flex-1 max-w-7xl w-full mx-auto flex relative py-6 px-4 sm:px-6">
        {/* Left Article Index Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full overflow-hidden'
          } transition-all duration-300 fixed md:sticky top-[100px] h-[calc(100vh-115px)] z-30 bg-white border border-slate-200 rounded-2xl shadow-sm shrink-0 overflow-y-auto p-4 mr-6`}
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-100">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest block">
                {isPersonalNumerology ? 'Profile Series' : isDocument ? 'SRS Document' : 'Article Series'}
              </span>
              <h3 className={`text-base font-extrabold text-slate-900 ${isDocument ? 'font-sans' : 'font-telugu'} mt-0.5`}>
                {currentBook.title}
              </h3>
              <p className={`text-xs text-slate-500 ${isDocument ? 'font-sans' : 'font-telugu'} mt-0.5 font-medium`}>
                {currentBook.teluguTitle}
              </p>
            </div>

            {/* Chapter Index List */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase px-2 tracking-wider">
                {isPersonalNumerology ? 'Profile Directory' : isDocument ? 'SRS Document Sections' : 'Article Directory'} ({currentBook.chapters.length})
              </span>
              {currentBook.chapters.map((ch, idx) => {
                const isActive = ch.id === activeChapter.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => goToChapter(ch.id)}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-start gap-2.5 ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full text-[11px] font-extrabold flex items-center justify-center shrink-0 mt-0.5 ${isActive ? 'bg-white text-blue-600' : 'bg-slate-100 text-slate-700'}`}>
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h5 className={`text-xs sm:text-sm truncate ${isDocument ? 'font-sans font-semibold' : 'font-telugu'} leading-snug`}>{ch.title}</h5>
                      <span className={`text-[10px] block mt-0.5 ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                        {ch.readTime}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Center Article Canvas */}
        <main className="flex-1 min-w-0 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm">
          <div className="max-w-3xl mx-auto">
            {/* Article Header */}
            <header className="mb-8 pb-6 border-b border-slate-200 space-y-3">
              {currentBook.coverImage && safeChapterIndex === 0 && (
                <div className="mb-6 rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-950 max-w-xl mx-auto">
                  <img
                    src={currentBook.coverImage}
                    alt={currentBook.title}
                    className="w-full h-auto object-cover max-h-[600px] mx-auto block"
                  />
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200 uppercase tracking-wider">
                  {isPersonalNumerology ? 'Profile' : isDocument ? 'SRS Section' : 'Article'} {safeChapterIndex + 1} of {currentBook.chapters.length}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{activeChapter.readTime}</span>
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Digibook Editorial</span>
                </span>
              </div>

              {/* Main Article Title */}
              <h1 className={`text-2xl sm:text-3xl font-extrabold text-slate-900 ${isDocument ? 'font-sans' : 'font-telugu'} leading-tight`}>
                {activeChapter.title}
              </h1>

              {/* Lead Summary */}
              <div className="bg-gradient-to-r from-blue-50/70 to-slate-50 p-4 sm:p-5 rounded-xl border-l-4 border-blue-600 shadow-sm">
                <p className={`text-slate-700 text-sm sm:text-base ${isDocument ? 'font-sans' : 'font-telugu'} leading-relaxed font-medium`}>
                  {activeChapter.summary}
                </p>
              </div>
            </header>

            {/* Article Body Content */}
            <article className="reading-content my-6 space-y-4">
              {renderMarkdownContent(activeChapter.content)}
            </article>

            {/* Article Footer Card Navigation */}
            <footer className="mt-12 pt-8 border-t border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prevChapter ? (
                  <button
                    onClick={() => goToChapter(prevChapter.id)}
                    className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Previous Article</span>
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900 font-telugu truncate mt-0.5">{prevChapter.title}</h5>
                    </div>
                  </button>
                ) : <div />}

                {nextChapter ? (
                  <button
                    onClick={() => goToChapter(nextChapter.id)}
                    className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-right transition flex items-center justify-between gap-3 group shadow-sm"
                  >
                    <div className="min-w-0 text-right">
                      <span className="text-[10px] text-blue-100 block font-bold uppercase tracking-wider">Next Article</span>
                      <h5 className="text-xs sm:text-sm font-bold text-white font-telugu truncate mt-0.5">{nextChapter.title}</h5>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </div>
                  </button>
                ) : <div />}
              </div>
            </footer>
          </div>
        </main>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ─── DEDICATED PRINT / PDF EXPORT CONTAINER (A4 PRINT MODE) ─ */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="print-all-pages hidden-on-screen">
        {printMode === 'all' && (
          currentBook.coverImage ? (
            <div className="book-print-page relative bg-slate-950 text-white overflow-hidden flex flex-col justify-between items-center p-0 font-sans">
              <img
                src={currentBook.coverImage}
                alt={currentBook.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ) : (
            <div className="book-print-page relative bg-[#02296c] text-white px-12 py-10 flex flex-col justify-between overflow-hidden font-sans">
              {/* Top & Bottom Accent Bars */}
              <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400" />
              <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400" />

              {/* Header Brand */}
              <div className="relative z-10 flex items-center justify-between border-b border-blue-400/30 pb-6 pt-2">
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-xl bg-white shadow-md flex items-center shrink-0 border border-slate-100">
                    <img src="/assets/digitalks-logo.png" alt="DIGI TALKS INDIA" className="h-8 w-auto object-contain" />
                  </div>
                  <div>
                    <span className="text-sm font-extrabold text-white block tracking-wide">DIGI TALKS INDIA</span>
                    <span className="text-[10px] text-amber-300 font-mono tracking-widest uppercase block font-semibold">Corporate Knowledge Portal</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold rounded-full font-mono tracking-wider">
                    OFFICIAL SRS & QUOTATION
                  </span>
                </div>
              </div>

              {/* Main Center Content Section */}
              <div className="relative z-10 my-auto py-6 space-y-6 text-center max-w-2xl mx-auto">
                <div className="inline-block">
                  <span className="px-5 py-2 bg-amber-400 text-slate-950 text-xs font-black rounded-full tracking-widest uppercase shadow-md">
                    {currentBook.badge || 'Software Requirements Specification (SRS)'}
                  </span>
                </div>

                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">
                    {currentBook.title}
                  </h1>
                  <div className="w-24 h-1 bg-amber-400 mx-auto rounded-full" />
                  <p className="text-blue-100 text-sm leading-relaxed max-w-lg mx-auto font-medium">
                    {currentBook.description}
                  </p>
                </div>

                {/* 3-Column Info Cards */}
                <div className="grid grid-cols-3 gap-4 pt-4 text-left">
                  <div className="p-4 rounded-2xl bg-blue-900/50 border border-blue-400/30 backdrop-blur-sm">
                    <span className="block text-[10px] text-amber-300 uppercase font-extrabold tracking-wider mb-1">Total Sections</span>
                    <span className="font-black text-white text-xl block">{currentBook.chapters.length} Sections</span>
                    <span className="text-[10px] text-blue-200 block mt-1 font-mono">Full Spec & Pricing</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-900/50 border border-blue-400/30 backdrop-blur-sm">
                    <span className="block text-[10px] text-amber-300 uppercase font-extrabold tracking-wider mb-1">Document Type</span>
                    <span className="font-black text-white text-base block truncate">{currentBook.documentName || 'Web Based ERP SRS'}</span>
                    <span className="text-[10px] text-blue-200 block mt-1 font-mono">Technical Architecture</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-900/50 border border-blue-400/30 backdrop-blur-sm">
                    <span className="block text-[10px] text-amber-300 uppercase font-extrabold tracking-wider mb-1">Prepared By</span>
                    <span className="font-black text-white text-base block truncate">DIGI TALKS INDIA</span>
                    <span className="text-[10px] text-blue-200 block mt-1 font-mono">Technology Division</span>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Bar */}
              <div className="relative z-10 border-t border-blue-400/30 pt-4 pb-2 flex items-center justify-between text-xs font-sans">
                <span className="text-amber-300 font-extrabold tracking-wide">https://digitalks.in/</span>
                <span className="text-blue-100 font-semibold">Single Complete PDF Document • All {currentBook.chapters.length} Sections</span>
              </div>
            </div>
          )
        )}

        {chaptersToPrint.map((ch, chIdx) => (
          <div
            key={ch.id}
            className="book-print-page relative bg-white text-slate-900 overflow-hidden flex flex-col justify-between font-sans"
          >
            {/* Top Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#02296c]" />

            {/* Print Header */}
            <div className="relative z-10 px-8 pt-4 pb-3 flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center shrink-0">
                  <img
                    src="/assets/digitalks-logo.png"
                    alt="Digitalks Logo"
                    className="h-6 w-auto object-contain"
                  />
                </div>
                <div className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#02296c] text-xs font-extrabold">
                  {currentBook.title}
                </div>
              </div>
              <div className="text-[11px] text-slate-500 font-mono font-bold tracking-wider uppercase">
                DIGIBOOK EDITORIAL • {isDocument ? 'Section' : 'Chapter'} {chIdx + 1} of {chaptersToPrint.length}
              </div>
            </div>

            {/* Print Chapter Body Content */}
            <div className="relative z-10 px-8 py-4 flex-1 flex flex-col justify-start overflow-hidden text-xs">
              <div className="mb-3 pb-3 border-b border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-widest block font-sans">
                    {currentBook.documentName || currentBook.title}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
                    Section {chIdx + 1}
                  </span>
                </div>
                <h1 className="text-xl font-black text-[#02296c] font-sans leading-tight">
                  {ch.title}
                </h1>
                <p className="text-slate-700 text-xs font-sans leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border-l-4 border-[#02296c]">
                  {ch.summary}
                </p>
              </div>

              <div className="reading-content text-xs leading-relaxed space-y-3 font-sans text-slate-800">
                {renderMarkdownContent(ch.content)}
              </div>
            </div>

            {/* Print Footer */}
            <div className="relative z-10 px-8 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="tracking-wider uppercase font-extrabold text-[#02296c] font-sans">DIGI TALKS INDIA • {currentBook.title}</span>
              <span className="font-mono font-bold text-slate-400">{isDocument ? 'Section' : 'Chapter'} {chIdx + 1} of {chaptersToPrint.length}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
