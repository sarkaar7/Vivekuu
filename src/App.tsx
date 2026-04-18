import React, { useState, useRef, useEffect } from "react";
import SnakeGame from "./components/SnakeGame";
import { MusicPlaylistSidebar, MusicPlayerFooter } from "./components/MusicPlayer";
import { Activity } from "lucide-react";
import { DUMMY_TRACKS } from "./constants";

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Music Player logic
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="w-[1024px] h-[768px] mx-auto my-auto bg-bg border border-border-cyan flex flex-col font-sans relative overflow-hidden">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={skipForward}
      />
      
      <div className="noise" />

      {/* Grid Container */}
      <div className="flex-1 grid grid-cols-[280px_1fr] grid-rows-[80px_1fr] h-full w-full">
        
        {/* Header */}
        <header className="col-span-2 flex items-center justify-between px-10 header-gradient border-b border-border-cyan z-10">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-extrabold tracking-[4px] text-primary neon-text-cyan">
              NEON SYNC
            </div>
          </div>

          <div className="flex gap-10">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-[2px] text-text-dim">Current Score</div>
              <div className="text-xl font-bold text-success shadow-[0_0_5px_theme(colors.success)]">
                {score.toLocaleString().padStart(6, "0")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-[2px] text-text-dim">Peak Performance</div>
              <div className="text-xl font-bold text-primary shadow-[0_0_5px_theme(colors.primary)]">
                {highScore.toLocaleString().padStart(6, "0")}
              </div>
            </div>
          </div>
        </header>

        {/* Sidebar */}
        <MusicPlaylistSidebar currentIndex={currentTrackIndex} onSelect={(i) => setCurrentTrackIndex(i)} />

        {/* Main Game Area */}
        <main className="game-viewport-bg flex items-center justify-center relative overflow-hidden">
          <SnakeGame onScoreChange={handleScoreChange} isPaused={false} />
          
          {/* Subtle decoration */}
          <div className="absolute top-10 right-10 flex items-center gap-2 text-[10px] text-primary/30 font-bold uppercase tracking-widest">
            <Activity size={14} />
            LIVE_FEED_01
          </div>
        </main>
      </div>

      {/* Footer Controls */}
      <MusicPlayerFooter 
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        progress={progress}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onSkipForward={skipForward}
        onSkipBack={skipBack}
      />
    </div>
  );
}
