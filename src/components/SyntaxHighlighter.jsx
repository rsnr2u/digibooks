import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';

export default function SyntaxHighlighter({ code, language = 'javascript' }) {
  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  return (
    <div className="relative group my-4 rounded-xl overflow-hidden border border-slate-800 shadow-lg">
      <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800 text-xs text-slate-400 font-mono">
        <span>{language.toUpperCase()}</span>
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="hover:text-purple-400 transition"
          title="Copy Code"
        >
          Copy
        </button>
      </div>
      <pre className="!bg-slate-950 !m-0 !p-4 font-mono text-sm overflow-x-auto text-purple-200">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
