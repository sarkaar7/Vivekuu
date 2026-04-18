import React, { useEffect, useRef, useState, useCallback } from "react";
import { Point, Direction } from "../types";
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from "../constants";

interface Props {
  onScoreChange: (score: number) => void;
  isPaused: boolean;
}

const SnakeGame: React.FC<Props> = ({ onScoreChange, isPaused }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case "UP": newHead.y -= 1; break;
        case "DOWN": newHead.y += 1; break;
        case "LEFT": newHead.x -= 1; break;
        case "RIGHT": newHead.x += 1; break;
      }

      // Check walls
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        setFood({
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        });
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, onScoreChange]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp": if (direction !== "DOWN") setDirection("UP"); break;
        case "ArrowDown": if (direction !== "UP") setDirection("DOWN"); break;
        case "ArrowLeft": if (direction !== "RIGHT") setDirection("LEFT"); break;
        case "ArrowRight": if (direction !== "LEFT") setDirection("RIGHT"); break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear board
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines (subtle)
    ctx.strokeStyle = "rgba(0, 243, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Food
    ctx.fillStyle = "#ff00ff"; // Secondary
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff00ff";
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Snake
    ctx.shadowBlur = 15;
    snake.forEach((segment, i) => {
      if (i === 0) {
        ctx.fillStyle = "#39ff14"; // Success
        ctx.shadowColor = "#39ff14";
      } else {
        ctx.fillStyle = "rgba(57, 255, 20, 0.6)";
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
      }
      
      const padding = i === 0 ? 2 : 3;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - (padding * 2),
        cellSize - (padding * 2)
      );
    });

    if (gameOver) {
      ctx.fillStyle = "rgba(10, 10, 20, 0.9)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00f3ff";
      ctx.font = "800 40px 'Inter', sans-serif";
      ctx.textAlign = "center";
      ctx.letterSpacing = "4px";
      ctx.fillText("SYSTEM FAILURE", canvas.width / 2, canvas.height / 2);
      ctx.font = "12px 'Inter', sans-serif";
      ctx.fillStyle = "#707090";
      ctx.fillText("PRESS SPACE TO REBOOT", canvas.width / 2, canvas.height / 2 + 50);
    }
  }, [snake, food, gameOver]);

  const restart = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood({ x: 5, y: 5 });
    setScore(0);
    setGameOver(false);
    onScoreChange(0);
  };

  useEffect(() => {
    const handleRestart = (e: KeyboardEvent) => {
      if (e.code === "Space" && gameOver) {
        restart();
      }
    };
    window.addEventListener("keydown", handleRestart);
    return () => window.removeEventListener("keydown", handleRestart);
  }, [gameOver]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={480}
        height={480}
        className="relative bg-black/50 border-2 border-primary shadow-[0_0_30px_rgba(0,243,255,0.15)]"
        id="snake-canvas"
      />
      <div className="scanline" />
    </div>
  );
};

export default SnakeGame;
