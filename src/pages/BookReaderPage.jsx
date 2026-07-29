import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BOOKS_DATA } from '../data/booksData';
import {
  BookOpen, ChevronRight, Bookmark, ArrowLeft, ArrowRight,
  Menu, Share2, Check, Clock, Calendar, Sparkles, UserCheck, Briefcase, User, Compass, Printer, Home
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

  const currentBook = BOOKS_DATA[bookId] || BOOKS_DATA.numerology;

  // Flexible Chapter Finder with legacy alias support
  const currentChapterIndex = currentBook.chapters.findIndex(c => {
    if (c.id === chapterId) return true;
    if (chapterId === 'chapter-5-lucky-remedies' && c.chapterNumber === 5) return true;
    const requestedNum = chapterId ? parseInt(chapterId.replace(/\D/g, ''), 10) : NaN;
    return !isNaN(requestedNum) && c.chapterNumber === requestedNum;
  });

  const activeChapter = currentChapterIndex !== -1 ? currentBook.chapters[currentChapterIndex] : currentBook.chapters[0];
  const safeChapterIndex = currentChapterIndex !== -1 ? currentChapterIndex : 0;

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

  const handlePrint = () => {
    window.print();
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
    {
      direction: "వాయువ్యము (North-West)",
      shortDir: "NW",
      numbers: "7",
      planet: "కేతువు",
      element: "జల (Water)",
      bg: "bg-sky-50/80 border-sky-200 text-sky-950",
      badgeBg: "bg-sky-600 text-white"
    },
    {
      direction: "ఉత్తరము (North)",
      shortDir: "NORTH",
      numbers: "2, 5",
      planet: "చంద్రుడు / బుధుడు",
      element: "జల / భూమి",
      bg: "bg-blue-50/80 border-blue-200 text-blue-950",
      badgeBg: "bg-blue-600 text-white"
    },
    {
      direction: "ఈశాన్యము (North-East)",
      shortDir: "NE",
      numbers: "1, 3",
      planet: "సూర్యుడు / గురువు",
      element: "ఈశ్వర స్థానం / జల",
      bg: "bg-amber-50/80 border-amber-200 text-amber-950",
      badgeBg: "bg-amber-600 text-white"
    },
    {
      direction: "పడమర (West)",
      shortDir: "WEST",
      numbers: "3, 8",
      planet: "గురువు / శని",
      element: "వాయు (Air)",
      bg: "bg-indigo-50/80 border-indigo-200 text-indigo-950",
      badgeBg: "bg-indigo-600 text-white"
    },
    {
      direction: "మధ్య భాగము (Center)",
      shortDir: "CENTER",
      numbers: "5",
      planet: "బుధుడు",
      element: "ఆకాశం (Space)",
      isCenter: true,
      bg: "bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-50 border-amber-400 text-amber-950 shadow-md ring-2 ring-amber-300/80",
      badgeBg: "bg-amber-500 text-white font-black"
    },
    {
      direction: "తూర్పు (East)",
      shortDir: "EAST",
      numbers: "1, 4",
      planet: "సూర్యుడు / రాహువు",
      element: "అగ్ని (Fire)",
      bg: "bg-orange-50/80 border-orange-200 text-orange-950",
      badgeBg: "bg-orange-600 text-white"
    },
    {
      direction: "నైరుతి (South-West)",
      shortDir: "SW",
      numbers: "8, 4",
      planet: "శని / రాహువు",
      element: "భూమి (Earth)",
      bg: "bg-emerald-50/80 border-emerald-200 text-emerald-950",
      badgeBg: "bg-emerald-600 text-white"
    },
    {
      direction: "దక్షిణము (South)",
      shortDir: "SOUTH",
      numbers: "9",
      planet: "కుజుడు",
      element: "అగ్ని (Fire)",
      bg: "bg-rose-50/80 border-rose-200 text-rose-950",
      badgeBg: "bg-rose-600 text-white"
    },
    {
      direction: "ఆగ్నేయము (South-East)",
      shortDir: "SE",
      numbers: "6",
      planet: "శుక్రుడు",
      element: "అగ్ని / జల",
      bg: "bg-purple-50/80 border-purple-200 text-purple-950",
      badgeBg: "bg-purple-600 text-white"
    }
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

    lines.forEach((line, index) => {
      if (line.trim().startsWith('```')) {
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
        if (!inTable) {
          inTable = true;
          tableRows = [];
        }
        tableRows.push(line.trim());
        return;
      } else if (inTable) {
        inTable = false;
        const headerRow = tableRows[0];
        const dataRows = tableRows.slice(2);
        const parseCells = (row) => row.split('|').map(c => c.trim()).filter((c, i, arr) => i > 0 && i < arr.length - 1);
        const headers = parseCells(headerRow);

        elements.push(
          <div key={`table-${index}`} className="my-6 overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
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

      // Skip top-level '# ' heading to prevent duplicate title (since header already renders activeChapter.title)
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
          <h3 key={index} className="text-base sm:text-lg font-bold text-slate-900 mt-5 mb-2.5 font-telugu flex items-center gap-2">
            <span className="w-1.5 h-5 bg-blue-600 rounded-full inline-block"></span>
            <span>{parseInlineMarkdown(line.replace('### ', ''))}</span>
          </h3>
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
      } else if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={index} className="p-4 my-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50/40 border-l-4 border-slate-700 italic text-slate-800 font-telugu text-base leading-relaxed shadow-sm">
            {parseInlineMarkdown(line.replace('> ', ''))}
          </blockquote>
        );
      }
      // Horizontal Rule
      else if (line.trim() === '---') {
        elements.push(<hr key={index} className="my-6 border-slate-200" />);
      }
      // Bullet list items
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li key={index} className="text-slate-800 ml-4 mb-2 font-telugu list-disc leading-relaxed text-base">
            {parseInlineMarkdown(line.replace(/^[-*]\s+/, ''))}
          </li>
        );
      }
      // Numbered list items
      else if (/^\d+\.\s+/.test(line)) {
        elements.push(
          <li key={index} className="text-slate-800 ml-4 mb-2 font-telugu list-decimal leading-relaxed text-base font-medium">
            {parseInlineMarkdown(line.replace(/^\d+\.\s+/, ''))}
          </li>
        );
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

    return elements;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Reading Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 z-50">
        <div
          className="h-full bg-blue-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Reader Sub-Header (Corporate Action Toolbar) */}
      <div className="sticky top-[65px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 px-4 sm:px-8 flex items-center justify-between shadow-xs">
        {/* Left: Breadcrumb Navigation & Directory Toggle */}
        <div className="flex items-center gap-3 text-xs sm:text-sm overflow-x-auto whitespace-nowrap scrollbar-none pr-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-200 transition font-medium text-xs shrink-0"
            title="Toggle Chapter Directory"
          >
            <Menu className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline font-telugu">అధ్యాయాలు</span>
          </button>

          <div className="h-4 w-px bg-slate-200 shrink-0" />

          <Link to="/" className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition font-telugu text-xs font-semibold">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>

          <span className="text-slate-300 font-bold text-xs">/</span>

          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200 text-[11px] font-telugu shrink-0">
            {currentBook.title}
          </span>

          <span className="text-slate-300 font-bold text-xs hidden md:inline">/</span>

          <span className="text-slate-800 font-bold hidden md:inline truncate max-w-[280px] text-xs font-telugu">
            {activeChapter.title}
          </span>
        </div>

        {/* Right: Unified Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Font Size Adjuster Pill */}
          <div className="hidden sm:flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-xs font-bold text-slate-600">
            <button
              onClick={() => setFontSize('text-sm')}
              className={`px-2 py-1 rounded ${fontSize === 'text-sm' ? 'bg-white text-blue-600 shadow-xs font-extrabold' : 'hover:text-slate-900'}`}
              title="Small Text"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('text-base')}
              className={`px-2 py-1 rounded ${fontSize === 'text-base' ? 'bg-white text-blue-600 shadow-xs font-extrabold' : 'hover:text-slate-900'}`}
              title="Normal Text"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('text-lg')}
              className={`px-2 py-1 rounded ${fontSize === 'text-lg' ? 'bg-white text-blue-600 shadow-xs font-extrabold' : 'hover:text-slate-900'}`}
              title="Large Text"
            >
              A+
            </button>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
            title="Share Link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-600" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
          </button>

          {/* Print / Save PDF Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
            title="Print or Save Chapter as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline font-telugu">PDF / Print</span>
          </button>

          {/* Bookmark / Save Button */}
          <button
            onClick={toggleBookmark}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition ${
              isBookmarked
                ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : 'text-slate-600'}`} />
            <span className="hidden sm:inline font-telugu">
              {isBookmarked ? 'Saved' : 'Save'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Layout: Article Index Sidebar + Center Canvas */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex relative py-6 px-4 sm:px-6">
        {/* Left Article Index Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full overflow-hidden'
          } transition-all duration-300 fixed md:sticky top-[125px] h-[calc(100vh-140px)] z-30 bg-white border border-slate-200 rounded-2xl shadow-sm shrink-0 overflow-y-auto p-4 mr-6`}
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-100">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest block">
                Article Series
              </span>
              <h3 className="text-base font-extrabold text-slate-900 font-telugu mt-0.5">
                {currentBook.title}
              </h3>
              <p className="text-xs text-slate-500 font-telugu mt-0.5 font-medium">
                {currentBook.teluguTitle}
              </p>
            </div>

            {/* Chapter Index List */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase px-2 tracking-wider">
                Article Directory ({currentBook.chapters.length})
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
                      <h5 className="text-xs sm:text-sm truncate font-telugu leading-snug">{ch.title}</h5>
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
            {/* Article Header (Compact & Balanced Font Sizes) */}
            <header className="mb-8 pb-6 border-b border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200 uppercase tracking-wider">
                  Article {safeChapterIndex + 1} of {currentBook.chapters.length}
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

              {/* Reduced Main Article Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-telugu leading-tight">
                {activeChapter.title}
              </h1>

              {/* Lead Summary */}
              <div className="bg-gradient-to-r from-blue-50/70 to-slate-50 p-4 sm:p-5 rounded-xl border-l-4 border-blue-600 shadow-sm">
                <p className="text-slate-700 text-sm sm:text-base font-telugu leading-relaxed font-medium">
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
    </div>
  );
}
