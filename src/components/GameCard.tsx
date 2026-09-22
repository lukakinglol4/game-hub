import React from 'react';
import { Star, Play, Trash2, Calendar, HardDrive, Share2 } from 'lucide-react';
import { Game } from '../lib/db';

interface GameCardProps {
  game: Game;
  onPlay: (game: Game) => void;
  onToggleFavorite: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  onPlay,
  onToggleFavorite,
  onDelete,
}) => {
  const isCustom = game.type === 'html-file';

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  // Unique visually appealing decorative neon colors for game thumbnails
  const categoryStyles = {
    arcade: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    action: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    puzzle: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
    classic: 'from-purple-500/20 to-fuchsia-500/10 border-purple-500/30 text-purple-400',
    custom: 'from-pink-500/20 to-rose-500/10 border-pink-500/30 text-pink-400',
  };

  const getEmoji = (cat: string) => {
    switch (cat) {
      case 'arcade': return '👾';
      case 'action': return '💥';
      case 'puzzle': return '🧩';
      case 'classic': return '🎯';
      default: return '🛡️';
    }
  };

  return (
    <div className="group relative flex flex-col bg-slate-900/40 border border-white/5 hover:border-white/10 hover:bg-slate-900/60 rounded-xl overflow-hidden transition-all duration-300">
      
      {/* Upper decorative thumbnail */}
      <div className={`relative h-28 bg-gradient-to-br ${categoryStyles[game.category] || categoryStyles.custom} flex items-center justify-center border-b border-white/5`}>
        <span className="text-4xl filter drop-shadow-md select-none group-hover:scale-110 transition duration-300">
          {getEmoji(game.category)}
        </span>

        {/* Favorite Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(game.id);
          }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 border border-white/10 text-gray-400 hover:text-amber-400 hover:bg-black/60 transition cursor-pointer"
        >
          <Star className={`w-3.5 h-3.5 ${game.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
        </button>

        {/* Play Count Badge */}
        <span className="absolute bottom-2 left-3 bg-black/50 border border-white/5 rounded px-1.5 py-0.5 text-[9px] font-mono text-gray-400">
          PLAYS: {game.plays}
        </span>

        {/* Custom Upload Badge */}
        {isCustom && (
          <span className="absolute bottom-2 right-3 bg-pink-500/20 border border-pink-500/30 rounded px-1.5 py-0.5 text-[9px] font-mono text-pink-400">
            LOCAL_SANDBOX
          </span>
        )}
      </div>

      {/* Info Body */}
      <div className="flex-1 p-4 flex flex-col justify-between text-left">
        <div>
          <h4 className="font-mono text-sm font-semibold tracking-wide text-white group-hover:text-emerald-400 transition truncate">
            {game.title}
          </h4>
          <p className="mt-1.5 text-xs text-gray-400 leading-relaxed line-clamp-2">
            {game.description}
          </p>
        </div>

        {/* Metadata section & buttons */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wide">
              {game.category} System
            </span>
            {isCustom && game.fileSize && (
              <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                <HardDrive className="w-3 h-3" /> {formatSize(game.fileSize)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Play Button */}
            <button
              onClick={() => onPlay(game)}
              className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold text-gray-950 transition cursor-pointer"
            >
              <Play className="w-3 h-3 fill-gray-950" /> ENGAGE
            </button>

            {/* Trash option for uploaded ones */}
            {isCustom && onDelete && (
              <button
                onClick={() => onDelete(game.id)}
                title="Deconstruct game"
                className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 text-red-400 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
