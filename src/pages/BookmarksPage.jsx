import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, ArrowRight, BookOpen } from 'lucide-react';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('digibook_bookmarks');
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  const removeBookmark = (bookId, chapterId) => {
    const updated = bookmarks.filter(b => !(b.bookId === bookId && b.chapterId === chapterId));
    setBookmarks(updated);
    localStorage.setItem('digibook_bookmarks', JSON.stringify(updated));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8 min-h-[70vh] bg-slate-50">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl border border-blue-200">
          <Bookmark className="w-7 h-7 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-telugu">
            Saved Bookmarks (సేవ్ చేసుకున్న పాఠాలు)
          </h1>
          <p className="text-sm text-slate-600 font-telugu font-medium">
            మీరు ఇష్టపడిన మరియు సేవ్‌ చేసుకున్న ట్యుటోరియల్ చాప్టర్ల జాబితా
          </p>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-slate-200 shadow-sm space-y-4">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-xl font-bold text-slate-800 font-telugu">
            ఇంకా ఎలాంటి చాప్టర్లు సేవ్ చేయలేదు
          </h3>
          <p className="text-sm text-slate-600 font-telugu max-w-md mx-auto font-medium">
            పాఠాలు చదువుతున్నప్పుడు "Save" బటన్ క్లిక్ చేయడం ద్వారా ఇక్కడ సులభంగా తిరిగి చదువుకోవచ్చు.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition"
          >
            <span>Explore Tutorials (పాఠాలు చూడండి)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookmarks.map((bm, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-xs uppercase font-extrabold text-blue-700 tracking-wider">
                  {bm.bookTitle}
                </span>
                <h4 className="text-xl font-bold text-slate-900 font-telugu">{bm.chapterTitle}</h4>
                <p className="text-xs text-slate-600 font-telugu line-clamp-2 font-medium">{bm.summary}</p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-4">
                <Link
                  to={`/book/${bm.bookId}/${bm.chapterId}`}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-blue-700 font-bold text-xs flex items-center gap-1.5 transition font-telugu"
                >
                  <span>Read Chapter (చదవండి)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => removeBookmark(bm.bookId, bm.chapterId)}
                  className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                  title="Remove Bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
