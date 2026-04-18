import { Track } from "./types";

export const DUMMY_TRACKS: Track[] = [
  {
    id: "1",
    title: "Cyber City Vibe",
    artist: "AI Synthwave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/cyber1/400/400",
  },
  {
    id: "2",
    title: "Neon Dreams",
    artist: "Digital Drift",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/cyber2/400/400",
  },
  {
    id: "3",
    title: "Midnight Matrix",
    artist: "Circuit Breaker",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/cyber3/400/400",
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = "UP";
export const GAME_SPEED = 150;
