import React, { useEffect, useState } from 'react';
import { X, RefreshCw, Maximize2, Shield, Info, Keyboard } from 'lucide-react';
import { Game } from '../lib/db';
import { BuiltinGameRunner } from './BuiltinGames';

interface GameRunnerProps {
  game: Game | null;
  onClose: () => void;
}

export const GameRunner: React.FC<GameRunnerProps> = ({ game, onClose }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0); // for reloading
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!game) {
      setBlobUrl(null);
      return;
    }

    // If it's an uploaded HTML file, convert string content into offline-safe Blob Object URL
    if (game.type === 'html-file' && game.content) {
      const blob = new Blob([game.content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [game]);

  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  const toggleFullscreen = () => {
    const element = document.getElementById('game-sandbox-container');
    if (!element) return;

    if (!document.fullscreenElement) {
      element.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Keep state updated in case they use ESC to exit fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!game) return null;

  const isBuiltIn = game.type === 'builtin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-6 overflow-y-auto">
      <div
        id="game-sandbox-container"
        className={`w-full max-w-4xl bg-slate-950 border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl transition-all duration-300 ${
          isFullscreen ? 'h-screen max-w-none border-none rounded-none p-0' : 'h-[85vh]'
        }`}
      >
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0d121f] border-b border-white/10 select-none">
          <div className="flex items-center gap-2 max-w-[60%]">
            <span className="flex items-center justify-center w-5 h-5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold">
              ★
            </span>
            <h3 className="font-mono text-xs sm:text-sm font-semibold text-white truncate">
              RUNNING_PROCESS: <strong className="text-emerald-400 font-bold uppercase">{game.title}</strong>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Reload Option for Web Sandbox */}
            {!isBuiltIn && (
              <button
                onClick={handleReload}
                title="Re-compile Sandbox"
                className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            {/* Fullscreen Option */}
            <button
              onClick={toggleFullscreen}
              title="Toggle Immersive Fullscreen"
              className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Close Runner */}
            <button
              onClick={onClose}
              title="Terminate Sandbox"
              className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 hover:text-white hover:bg-red-500 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Play Sandbox Canvas Stage */}
        <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden p-2 sm:p-4">
          {isBuiltIn ? (
            <div className="w-full h-full max-w-lg flex items-center justify-center overflow-y-auto">
              <BuiltinGameRunner gameId={game.id} onClose={onClose} />
            </div>
          ) : blobUrl ? (
            <div className="w-full h-full bg-white rounded-xl overflow-hidden shadow-inner relative transform-gpu translate-z-0">
              <iframe
                key={iframeKey}
                src={blobUrl}
                title={game.title}
                sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-pointer-lock allow-popups allow-downloads"
                className="w-full h-full border-none gpu-accelerated"
                referrerPolicy="no-referrer"
                loading="eager"
              />
            </div>
          ) : (
            <div className="text-center font-mono text-sm text-gray-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-2" />
              Compiling virtual HTML sandbox parameters...
            </div>
          )}
        </div>

        {/* Bottom Status Panel */}
        <div className="px-4 py-2 bg-[#0c101c] border-t border-white/5 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono text-gray-400 select-none">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-400" /> Sandboxed Safe-Play Zone Active (Cookies Restricted)
          </span>
          <span className="flex items-center gap-1 text-[9px]">
            <Keyboard className="w-3.5 h-3.5 text-gray-500" /> Controls: Keyboard & Mouse (D-Pad for mobile overlays)
          </span>
        </div>

      </div>
    </div>
  );
};
