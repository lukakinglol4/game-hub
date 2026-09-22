import React, { useState } from 'react';
import { Search, RotateCw, ArrowLeft, ArrowRight, Home, ExternalLink, Globe, Bookmark, ShieldAlert, Sparkles } from 'lucide-react';

interface BookmarkItem {
  title: string;
  url: string;
  icon: string;
}

export const StandardBrowser: React.FC = () => {
  const [url, setUrl] = useState('https://en.m.wikipedia.org');
  const [inputValue, setInputValue] = useState('https://en.m.wikipedia.org');
  const [key, setKey] = useState(0);
  const [history, setHistory] = useState<string[]>(['https://en.m.wikipedia.org']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const bookmarks: BookmarkItem[] = [
    { title: 'Wikipedia', url: 'https://en.m.wikipedia.org', icon: '📚' },
    { title: 'DuckDuckGo', url: 'https://html.duckduckgo.com/html/', icon: '🦆' },
    { title: 'Archive.org', url: 'https://archive.org', icon: '🏛️' },
    { title: 'OpenStreetMap', url: 'https://www.openstreetmap.org', icon: '🗺️' },
    { title: 'Lichess', url: 'https://lichess.org', icon: '♟️' },
  ];

  const handleNavigate = (targetUrl: string) => {
    let finalUrl = targetUrl.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      if (finalUrl.includes('.') && !finalUrl.includes(' ')) {
        finalUrl = `https://${finalUrl}`;
      } else {
        // Search query fallback
        finalUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(finalUrl)}`;
      }
    }

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(finalUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    setUrl(finalUrl);
    setInputValue(finalUrl);
    setKey(prev => prev + 1);
  };

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleNavigate(inputValue);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setInputValue(history[newIndex]);
      setKey(prev => prev + 1);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setInputValue(history[newIndex]);
      setKey(prev => prev + 1);
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[650px] text-white">
      {/* Browser Header / Chrome */}
      <div className="bg-slate-950/80 border-b border-white/10 p-3 flex flex-col gap-3 select-none">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={goBack}
              disabled={historyIndex === 0}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-gray-300 transition cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goForward}
              disabled={historyIndex >= history.length - 1}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-gray-300 transition cursor-pointer"
              title="Forward"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setKey(prev => prev + 1)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition cursor-pointer"
              title="Reload"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleNavigate('https://en.m.wikipedia.org')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition cursor-pointer"
              title="Home"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={onSubmitForm} className="flex-1 max-w-2xl flex items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <Globe className="absolute left-3.5 w-4 h-4 text-emerald-400" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search DuckDuckGo or enter URL..."
                className="w-full pl-10 pr-10 py-2 bg-black/40 border border-white/15 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition font-mono"
              />
              <button type="submit" className="absolute right-3 text-gray-400 hover:text-emerald-400 cursor-pointer">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition flex items-center gap-1.5 text-xs font-mono"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Bookmarks Bar */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <span className="text-[11px] font-mono text-gray-500 flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3 text-yellow-400" /> Quick Sites:
          </span>
          {bookmarks.map((bm, idx) => (
            <button
              key={idx}
              onClick={() => handleNavigate(bm.url)}
              className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-gray-300 hover:text-white transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <span>{bm.icon}</span>
              <span>{bm.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Viewport Frame */}
      <div className="flex-1 relative bg-white min-h-[550px] flex flex-col">
        <iframe
          key={key}
          src={url}
          className="w-full flex-1 border-none"
          title="Web Browser Viewport"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
        <div className="bg-slate-950 p-2 border-t border-white/10 text-[11px] text-gray-400 flex items-center justify-between font-mono">
          <span className="truncate">Current URL: {url}</span>
          <span className="text-emerald-400 shrink-0">Secure Sandbox Active</span>
        </div>
      </div>
    </div>
  );
};
