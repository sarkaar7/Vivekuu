import React from "react";
import { Play, Pause, SkipForward, SkipBack, Music, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Track } from "../types";
import { DUMMY_TRACKS } from "../constants";

interface PlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
  progress: number;
  onTogglePlay: () => void;
  onSkipForward: () => void;
  onSkipBack: () => void;
}

export const MusicPlayerFooter: React.FC<PlayerProps> = ({
  currentTrack,
  isPlaying,
  progress,
  onTogglePlay,
  onSkipForward,
  onSkipBack,
}) => {
  return (
    <footer className="col-span-2 h-[100px] bg-surface border-t border-border-cyan grid grid-cols-[280px_1fr_280px] items-center px-8 z-20">
      <div className="flex items-center gap-4">
        <div className="w-[50px] h-[50px] bg-gradient-to-br from-primary to-secondary rounded overflow-hidden">
          <img src={currentTrack.cover} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="overflow-hidden">
          <div className="text-sm font-semibold truncate">{currentTrack.title}</div>
          <div className="text-xs text-text-dim truncate uppercase tracking-tighter">{currentTrack.artist}</div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-6">
          <button onClick={onSkipBack} className="text-text hover:text-primary transition-colors cursor-pointer">
            <SkipBack size={20} />
          </button>
          <button
            onClick={onTogglePlay}
            className="w-[50px] h-[50px] bg-primary rounded-full flex items-center justify-center text-bg shadow-[0_0_15px_rgba(0,243,255,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="ml-1" fill="currentColor" />}
          </button>
          <button onClick={onSkipForward} className="text-text hover:text-primary transition-colors cursor-pointer">
            <SkipForward size={20} />
          </button>
        </div>
        <div className="w-[400px] h-1 bg-white/10 rounded-full relative overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-primary shadow-[0_0_10px_theme(colors.primary)]"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 text-text-dim">
        <span className="text-[10px] uppercase font-bold tracking-widest">vol</span>
        <div className="w-[100px] h-0.5 bg-white/10 relative">
          <div className="absolute left-0 top-0 h-full bg-text-dim w-[80%] transition-all" />
        </div>
        <span className="text-[10px] tabular-nums">80%</span>
      </div>
    </footer>
  );
};

export const MusicPlaylistSidebar: React.FC<{ currentIndex: number; onSelect: (i: number) => void }> = ({
  currentIndex,
  onSelect,
}) => {
  return (
    <aside className="w-[280px] bg-surface border-r border-border-cyan p-6 flex flex-col gap-6 overflow-y-auto">
      <div>
        <div className="text-[10px] uppercase tracking-[2px] text-text-dim border-b border-border-cyan pb-2 mb-4">
          Live Playlist
        </div>
        <div className="flex flex-col gap-2">
          {DUMMY_TRACKS.map((track, i) => (
            <div
              key={track.id}
              onClick={() => onSelect(i)}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                i === currentIndex
                  ? "bg-primary/10 border-primary"
                  : "bg-white/5 border-transparent hover:bg-white/10"
              }`}
            >
              <div className="text-sm font-semibold truncate leading-tight">{track.title}</div>
              <div className="text-xs text-text-dim truncate uppercase tracking-tighter">{track.artist}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-[2px] text-text-dim border-b border-border-cyan pb-2 mb-4">
          Game Legend
        </div>
        <div className="text-[11px] text-text-dim leading-relaxed space-y-2">
          <p>WASD / ARROWS to Move</p>
          <p>Eat ORBS to increase tempo</p>
          <p>Score resets on wall hit</p>
        </div>
      </div>
    </aside>
  );
};
