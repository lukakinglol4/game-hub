import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Play, RotateCcw, Award, ShieldAlert, ArrowUp, ArrowDown, ArrowLeft as ArrowLeftIcon, ArrowRight, Zap } from 'lucide-react';

interface BuiltinGameProps {
  gameId: string;
  onClose: () => void;
}

// ==========================================
// 1. NEON SNAKE ARCADE COMPONENT
// ==========================================
const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem('gh_high_snake') || '0');
  });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  // Direction state refs to avoid useEffect interval delays
  const dirRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
  const snakeRef = useRef<{ x: number; y: number }[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const foodRef = useRef<{ x: number; y: number }>({ x: 15, y: 15 });

  const GRID_SIZE = 20;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentDir = dirRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y === 0) dirRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y === 0) dirRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x === 0) dirRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x === 0) dirRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const changeDirection = (x: number, y: number) => {
    if (gameOver) return;
    setIsPaused(false);
    const currentDir = dirRef.current;
    if (x !== 0 && currentDir.x === 0) dirRef.current = { x, y: 0 };
    if (y !== 0 && currentDir.y === 0) dirRef.current = { x: 0, y };
  };

  const spawnFood = () => {
    let newFood: { x: number; y: number };
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food on snake
      const onSnake = snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    foodRef.current = newFood;
  };

  const resetGame = () => {
    snakeRef.current = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    dirRef.current = { x: 1, y: 0 };
    spawnFood();
    setScore(0);
    setGameOver(false);
    setIsPaused(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let lastRenderTime = 0;
    const SPEED = 130; // ms per tick

    const draw = (currentTime: number) => {
      animationId = requestAnimationFrame(draw);

      if (isPaused || gameOver) {
        // Draw static state with overlay
        renderCanvas();
        return;
      }

      if (currentTime - lastRenderTime < SPEED) return;
      lastRenderTime = currentTime;

      // Update snake position
      const head = { ...snakeRef.current[0] };
      const dir = dirRef.current;
      head.x += dir.x;
      head.y += dir.y;

      // Collision checks
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        return;
      }

      const hitSelf = snakeRef.current.some(segment => segment.x === head.x && segment.y === head.y);
      if (hitSelf) {
        setGameOver(true);
        return;
      }

      snakeRef.current.unshift(head);

      // Check if food eaten
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        const nextScore = score + 10;
        setScore(nextScore);
        if (nextScore > highScore) {
          setHighScore(nextScore);
          localStorage.setItem('gh_high_snake', String(nextScore));
        }
        spawnFood();
      } else {
        snakeRef.current.pop();
      }

      renderCanvas();
    };

    const renderCanvas = () => {
      const size = canvas.width;
      const cellSize = size / GRID_SIZE;

      // Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, size, size);

      // Grid Lines (subtle)
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, size);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(size, i * cellSize);
        ctx.stroke();
      }

      // Draw Food
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#f43f5e';
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(
        foodRef.current.x * cellSize + cellSize / 2,
        foodRef.current.y * cellSize + cellSize / 2,
        cellSize / 2.5,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw Snake
      snakeRef.current.forEach((segment, idx) => {
        const isHead = idx === 0;
        ctx.shadowBlur = isHead ? 15 : 6;
        ctx.shadowColor = isHead ? '#10b981' : '#34d399';
        ctx.fillStyle = isHead ? '#10b981' : '#059669';

        ctx.fillRect(
          segment.x * cellSize + 1,
          segment.y * cellSize + 1,
          cellSize - 2,
          cellSize - 2
        );
      });

      ctx.shadowBlur = 0; // reset
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused, gameOver, score]);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg">
      {/* Score Header */}
      <div className="w-full flex items-center justify-between px-4 py-2 bg-slate-900/60 rounded-xl border border-white/5 font-mono text-sm">
        <span className="text-gray-400">SCORE: <strong className="text-emerald-400 font-bold">{score}</strong></span>
        <span className="text-gray-400 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-400" /> BEST: <strong className="text-amber-400 font-bold">{highScore}</strong>
        </span>
      </div>

      {/* Screen Box */}
      <div className="relative border border-emerald-500/30 rounded-2xl overflow-hidden bg-slate-950 shadow-2xl shadow-emerald-950/20 w-full aspect-square">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full h-full object-cover"
        />

        {/* Start Overlay */}
        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center p-4 text-center">
            <h3 className="text-xl font-mono text-emerald-400 font-bold mb-2">NEON SNAKE READY</h3>
            <p className="text-xs text-gray-400 mb-6 font-mono max-w-xs">
              Press W/A/S/D or Arrow keys to move, or click Play to engage.
            </p>
            <button
              onClick={() => setIsPaused(false)}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 rounded-xl text-sm font-mono text-gray-950 font-bold tracking-wider transition"
            >
              <Play className="w-4 h-4 fill-gray-950" /> START_MISSION
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-4 text-center">
            <ShieldAlert className="w-12 h-12 text-rose-500 mb-3" />
            <h3 className="text-xl font-mono text-rose-500 font-bold mb-1">SYSTEM CRASHED</h3>
            <p className="text-xs text-gray-400 mb-6 font-mono">
              Snake collided with boundary parameters.
            </p>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 px-5 py-2.5 rounded-xl text-sm font-mono text-white font-bold tracking-wider transition"
            >
              <RotateCcw className="w-4 h-4" /> REBOOT_SYSTEM
            </button>
          </div>
        )}
      </div>

      {/* Mobile Controllers */}
      <div className="w-full max-w-[200px] flex flex-col items-center gap-1.5 mt-2">
        <button
          onClick={() => changeDirection(0, -1)}
          className="w-14 h-14 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-xl border border-white/5 flex items-center justify-center text-emerald-400 transition"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        <div className="flex gap-1.5">
          <button
            onClick={() => changeDirection(-1, 0)}
            className="w-14 h-14 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-xl border border-white/5 flex items-center justify-center text-emerald-400 transition"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div className="w-14 h-14" /> {/* center gap */}
          <button
            onClick={() => changeDirection(1, 0)}
            className="w-14 h-14 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-xl border border-white/5 flex items-center justify-center text-emerald-400 transition"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
        <button
          onClick={() => changeDirection(0, 1)}
          className="w-14 h-14 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-xl border border-white/5 flex items-center justify-center text-emerald-400 transition"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};


// ==========================================
// 2. RETRO BRICK BREAKER COMPONENT
// ==========================================
const BrickBreakerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem('gh_high_breaker') || '0');
  });
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  // Core dimensions and state
  const paddleRef = useRef({ x: 160, width: 80, height: 10, speed: 8 });
  const ballRef = useRef({ x: 200, y: 350, dx: 3, dy: -3, radius: 6 });
  const bricksRef = useRef<{ x: number; y: number; active: boolean }[]>([]);
  const particlesRef = useRef<{ x: number; y: number; dx: number; dy: number; radius: number; color: string; life: number; maxLife: number }[]>([]);
  const trailRef = useRef<{ x: number; y: number }[]>([]);

  const ROWS = 4;
  const COLS = 7;
  const BRICK_HEIGHT = 16;
  const BRICK_GAP = 6;

  const initBricks = () => {
    const list = [];
    const width = (400 - (COLS + 1) * BRICK_GAP) / COLS;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        list.push({
          x: c * (width + BRICK_GAP) + BRICK_GAP,
          y: r * (BRICK_HEIGHT + BRICK_GAP) + 40,
          active: true,
        });
      }
    }
    bricksRef.current = list;
  };

  const handleMouseMove = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const rootX = e.clientX - rect.left;
    const relativeX = (rootX / rect.width) * 400; // translate scale
    const halfWidth = paddleRef.current.width / 2;
    paddleRef.current.x = Math.max(0, Math.min(400 - paddleRef.current.width, relativeX - halfWidth));
    if (isPaused) {
      // Sync ball to paddle when paused initially
      ballRef.current.x = paddleRef.current.x + halfWidth;
    }
  };

  // Touch triggers
  const movePaddle = (dir: number) => {
    if (gameOver || gameWon) return;
    setIsPaused(false);
    const p = paddleRef.current;
    p.x = Math.max(0, Math.min(400 - p.width, p.x + dir * 25));
  };

  const resetGame = () => {
    paddleRef.current = { x: 160, width: 80, height: 10, speed: 8 };
    ballRef.current = { x: 200, y: 340, dx: 3 + Math.random() * 2 - 1, dy: -4, radius: 6 };
    initBricks();
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setIsPaused(true);
  };

  useEffect(() => {
    initBricks();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener('mousemove', handleMouseMove);
    return () => canvas.removeEventListener('mousemove', handleMouseMove);
  }, [isPaused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const colors = ['#fbbf24', '#f59e0b', '#d97706', '#b45309'];

    const draw = () => {
      animationId = requestAnimationFrame(draw);

      if (isPaused || gameOver || gameWon) {
        render();
        return;
      }

      // Move Ball
      const ball = ballRef.current;
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Log trail coordinates
      trailRef.current.push({ x: ball.x, y: ball.y });
      if (trailRef.current.length > 10) {
        trailRef.current.shift();
      }

      // Ball Wall Collisions
      if (ball.x - ball.radius < 0 || ball.x + ball.radius > 400) {
        ball.dx = -ball.dx;
      }
      if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
      }

      // Ball Out (Dead)
      if (ball.y + ball.radius > 400) {
        setGameOver(true);
        return;
      }

      // Ball Paddle Collision
      const paddle = paddleRef.current;
      if (
        ball.y + ball.radius >= 380 &&
        ball.y - ball.radius <= 390 &&
        ball.x >= paddle.x &&
        ball.x <= paddle.x + paddle.width
      ) {
        // bounce with deflection based on impact point
        const hitPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
        ball.dx = hitPoint * 4.5;
        ball.dy = -Math.abs(ball.dy); // guarantee upwards
      }

      // Ball Brick Collision
      let activeBricks = 0;
      bricksRef.current.forEach((b, index) => {
        if (!b.active) return;
        activeBricks++;

        const brickWidth = (400 - (COLS + 1) * BRICK_GAP) / COLS;

        if (
          ball.x + ball.radius >= b.x &&
          ball.x - ball.radius <= b.x + brickWidth &&
          ball.y + ball.radius >= b.y &&
          ball.y - ball.radius <= b.y + BRICK_HEIGHT
        ) {
          b.active = false;
          ball.dy = -ball.dy;
          const nextScore = score + 20;
          setScore(nextScore);

          const row = Math.floor(index / COLS);
          const particleColor = colors[row % colors.length];

          // Spawn explosion particles
          for (let i = 0; i < 12; i++) {
            particlesRef.current.push({
              x: b.x + brickWidth / 2,
              y: b.y + BRICK_HEIGHT / 2,
              dx: (Math.random() - 0.5) * 6,
              dy: (Math.random() - 0.5) * 6,
              radius: Math.random() * 3 + 1,
              color: particleColor,
              life: 0,
              maxLife: Math.random() * 20 + 15,
            });
          }

          if (nextScore > highScore) {
            setHighScore(nextScore);
            localStorage.setItem('gh_high_breaker', String(nextScore));
          }
        }
      });

      // Simulate particles physics
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.dx;
        p.y += p.dy;
        p.dy += 0.05; // light gravity drift
        p.life++;
        return p.life < p.maxLife;
      });

      if (activeBricks === 0 && bricksRef.current.length > 0) {
        setGameWon(true);
      }

      render();
    };

    const render = () => {
      const size = 400;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, size, size);

      // Draw Ball Trail
      trailRef.current.forEach((point, index) => {
        const ratio = (index + 1) / trailRef.current.length;
        ctx.fillStyle = `rgba(255, 255, 255, ${ratio * 0.25})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, ballRef.current.radius * ratio, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw bricks
      const brickWidth = (size - (COLS + 1) * BRICK_GAP) / COLS;
      bricksRef.current.forEach((b, index) => {
        if (!b.active) return;
        
        // beautiful neon colors based on row
        const row = Math.floor(index / COLS);
        ctx.fillStyle = colors[row % colors.length];
        ctx.shadowBlur = 4;
        ctx.shadowColor = colors[row % colors.length];

        ctx.fillRect(b.x, b.y, brickWidth, BRICK_HEIGHT);
      });

      // Draw Particles
      particlesRef.current.forEach((p) => {
        const alpha = 1 - p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Paddle
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#fbbf24';
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(paddleRef.current.x, 380, paddleRef.current.width, paddleRef.current.height);

      // Draw Ball
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffffff';
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused, gameOver, gameWon, score]);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg">
      <div className="w-full flex items-center justify-between px-4 py-2 bg-slate-900/60 rounded-xl border border-white/5 font-mono text-sm">
        <span className="text-gray-400">SCORE: <strong className="text-amber-400 font-bold">{score}</strong></span>
        <span className="text-gray-400 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-400" /> BEST: <strong className="text-amber-400 font-bold">{highScore}</strong>
        </span>
      </div>

      <div className="relative border border-amber-500/30 rounded-2xl overflow-hidden bg-slate-950 shadow-2xl shadow-amber-950/20 w-full aspect-square">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full h-full object-cover cursor-none"
        />

        {/* Start Overlay */}
        {isPaused && !gameOver && !gameWon && (
          <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center p-4 text-center">
            <h3 className="text-xl font-mono text-amber-400 font-bold mb-2">PADDLE ONLINE</h3>
            <p className="text-xs text-gray-400 mb-6 font-mono max-w-xs">
              Move your mouse/finger across the screen to direct the slide bar.
            </p>
            <button
              onClick={() => setIsPaused(false)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 px-5 py-2.5 rounded-xl text-sm font-mono text-gray-950 font-bold tracking-wider transition"
            >
              <Play className="w-4 h-4 fill-gray-950" /> DEPLOY_BALL
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-4 text-center">
            <ShieldAlert className="w-12 h-12 text-rose-500 mb-3" />
            <h3 className="text-xl font-mono text-rose-500 font-bold mb-1">BALL DEACTIVATED</h3>
            <p className="text-xs text-gray-400 mb-6 font-mono">
              The ball crossed deep terminal sensors.
            </p>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 px-5 py-2.5 rounded-xl text-sm font-mono text-white font-bold tracking-wider transition"
            >
              <RotateCcw className="w-4 h-4" /> RESET_GRID
            </button>
          </div>
        )}

        {/* Victory Overlay */}
        {gameWon && (
          <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center p-4 text-center border border-emerald-500">
            <Zap className="w-12 h-12 text-emerald-400 mb-3 animate-bounce" />
            <h3 className="text-xl font-mono text-emerald-400 font-bold mb-1">VICTORY REGISTERED</h3>
            <p className="text-xs text-gray-400 mb-6 font-mono">
              All defensive barriers have been cleared.
            </p>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 rounded-xl text-sm font-mono text-gray-950 font-bold tracking-wider transition"
            >
              <RotateCcw className="w-4 h-4" /> PLAY_AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Mobile D-pad control bar */}
      <div className="flex gap-4 w-full justify-center mt-2 max-w-[240px]">
        <button
          onClick={() => movePaddle(-1)}
          className="flex-1 h-14 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-xl border border-white/5 flex items-center justify-center text-amber-400 transition"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <button
          onClick={() => movePaddle(1)}
          className="flex-1 h-14 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-xl border border-white/5 flex items-center justify-center text-amber-400 transition"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};


// ==========================================
// 3. CYBER BLOCK PUZZLE (TETRIS)
// ==========================================
const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1, 1], [0, 1, 0]], // T
  [[1, 1, 1], [1, 0, 0]], // L
  [[1, 1, 1], [0, 0, 1]], // J
  [[1, 1], [1, 1]], // O
  [[1, 1, 0], [0, 1, 1]], // Z
  [[0, 1, 1], [1, 1, 0]]  // S
];

const SHAPE_COLORS = [
  '#06b6d4', // cyan
  '#a855f7', // purple
  '#f97316', // orange
  '#3b82f6', // blue
  '#eab308', // yellow
  '#ef4444', // red
  '#22c55e'  // green
];

const TetrisGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem('gh_high_tetris') || '0');
  });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const [grid, setGrid] = useState<number[][]>(() =>
    Array(20).fill(null).map(() => Array(10).fill(0))
  );

  const [currPiece, setCurrPiece] = useState({
    shape: SHAPES[0],
    color: SHAPE_COLORS[0],
    colorIdx: 1,
    x: 3,
    y: 0,
  });

  const [nextPieceIndex, setNextPieceIndex] = useState(() =>
    Math.floor(Math.random() * SHAPES.length)
  );

  // Use refs to keep track of variables inside requestAnimationFrame loop
  const gridRef = useRef<number[][]>([]);
  gridRef.current = grid;

  const currPieceRef = useRef(currPiece);
  currPieceRef.current = currPiece;

  const nextPieceIdxRef = useRef(nextPieceIndex);
  nextPieceIdxRef.current = nextPieceIndex;

  const gameOverRef = useRef(gameOver);
  gameOverRef.current = gameOver;

  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  const spawnPiece = () => {
    const idx = nextPieceIdxRef.current;
    const nextIdx = Math.floor(Math.random() * SHAPES.length);
    setNextPieceIndex(nextIdx);

    const newPiece = {
      shape: SHAPES[idx],
      color: SHAPE_COLORS[idx],
      colorIdx: idx + 1,
      x: 3,
      y: 0,
    };

    if (checkCollision(newPiece.shape, newPiece.x, newPiece.y, gridRef.current)) {
      setGameOver(true);
    } else {
      setCurrPiece(newPiece);
    }
  };

  const checkCollision = (shape: number[][], x: number, y: number, board: number[][]) => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const nextX = x + c;
          const nextY = y + r;
          if (nextX < 0 || nextX >= 10 || nextY >= 20) return true;
          if (nextY >= 0 && board[nextY][nextX]) return true;
        }
      }
    }
    return false;
  };

  const rotatePiece = () => {
    if (gameOverRef.current || isPausedRef.current) return;
    const curr = currPieceRef.current;
    const shape = curr.shape;
    const rotated = shape[0].map((_, i) => shape.map((row) => row[i]).reverse());

    // Make sure rotation doesn't push out of bounds
    let nextX = curr.x;
    if (nextX + rotated[0].length > 10) {
      nextX = 10 - rotated[0].length;
    }
    if (nextX < 0) nextX = 0;

    if (!checkCollision(rotated, nextX, curr.y, gridRef.current)) {
      setCurrPiece({
        ...curr,
        shape: rotated,
        x: nextX,
      });
    }
  };

  const moveSide = (dir: number) => {
    if (gameOverRef.current || isPausedRef.current) return;
    const curr = currPieceRef.current;
    if (!checkCollision(curr.shape, curr.x + dir, curr.y, gridRef.current)) {
      setCurrPiece({
        ...curr,
        x: curr.x + dir,
      });
    }
  };

  const dropPiece = () => {
    if (gameOverRef.current || isPausedRef.current) return;
    const curr = currPieceRef.current;
    const nextY = curr.y + 1;

    if (!checkCollision(curr.shape, curr.x, nextY, gridRef.current)) {
      setCurrPiece({
        ...curr,
        y: nextY,
      });
    } else {
      // Merge with grid
      const nextGrid = gridRef.current.map(row => [...row]);
      for (let r = 0; r < curr.shape.length; r++) {
        for (let c = 0; c < curr.shape[r].length; c++) {
          if (curr.shape[r][c]) {
            const gy = curr.y + r;
            const gx = curr.x + c;
            if (gy >= 0 && gy < 20 && gx >= 0 && gx < 10) {
              nextGrid[gy][gx] = curr.colorIdx;
            }
          }
        }
      }

      // Check row clears
      let linesCleared = 0;
      const clearedGrid = nextGrid.filter((row) => {
        const isFull = row.every((val) => val > 0);
        if (isFull) linesCleared++;
        return !isFull;
      });

      while (clearedGrid.length < 20) {
        clearedGrid.unshift(Array(10).fill(0));
      }

      setGrid(clearedGrid);

      if (linesCleared > 0) {
        const points = [0, 100, 300, 500, 800];
        const clearedPoints = points[Math.min(linesCleared, 4)];
        setScore((prev) => {
          const n = prev + clearedPoints;
          if (n > highScore) {
            setHighScore(n);
            localStorage.setItem('gh_high_tetris', String(n));
          }
          return n;
        });
      }

      spawnPiece();
    }
  };

  const handleRestart = () => {
    setGrid(Array(20).fill(null).map(() => Array(10).fill(0)));
    setScore(0);
    setGameOver(false);
    setIsPaused(true);
    setCurrPiece({
      shape: SHAPES[0],
      color: SHAPE_COLORS[0],
      colorIdx: 1,
      x: 3,
      y: 0,
    });
  };

  // Main ticking effect
  useEffect(() => {
    if (isPaused || gameOver) return;

    const interval = setInterval(() => {
      dropPiece();
    }, 700);

    return () => clearInterval(interval);
  }, [isPaused, gameOver]);

  // Bind keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isPausedRef.current || gameOverRef.current) return;
      if (e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        rotatePiece();
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        e.preventDefault();
        moveSide(-1);
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        e.preventDefault();
        moveSide(1);
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        e.preventDefault();
        dropPiece();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      {/* Score and Stats */}
      <div className="w-full flex items-center justify-between px-4 py-2 bg-slate-900/60 rounded-xl border border-white/5 font-mono text-sm">
        <span className="text-gray-400">SCORE: <strong className="text-cyan-400 font-bold">{score}</strong></span>
        <span className="text-gray-400 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-400" /> BEST: <strong className="text-amber-400 font-bold">{highScore}</strong>
        </span>
      </div>

      <div className="flex gap-4 w-full items-start justify-center">
        {/* Game Area Grid */}
        <div className="relative flex-1 aspect-[1/2] max-w-[200px] bg-slate-950 border border-cyan-500/30 rounded-xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-10 grid-rows-20 h-full w-full p-1 gap-0.5">
            {grid.map((row, y) =>
              row.map((cellIdx, x) => {
                // Determine if part of current moving block
                let color = '#0f172a';
                let isMoving = false;

                const curr = currPiece;
                for (let r = 0; r < curr.shape.length; r++) {
                  for (let c = 0; c < curr.shape[r].length; c++) {
                    if (curr.shape[r][c] && curr.x + c === x && curr.y + r === y) {
                      color = curr.color;
                      isMoving = true;
                    }
                  }
                }

                if (!isMoving && cellIdx > 0) {
                  color = SHAPE_COLORS[cellIdx - 1];
                }

                const style = color !== '#0f172a' ? {
                  backgroundColor: color,
                  boxShadow: `0 0 4px ${color}`
                } : undefined;

                return (
                  <div
                    key={`${y}-${x}`}
                    style={style}
                    className={`rounded-sm transition-all duration-75 ${
                      color === '#0f172a' ? 'bg-[#0f172a] border border-[#1e293b]/20' : ''
                    }`}
                  />
                );
              })
            )}
          </div>

          {/* Overlays */}
          {isPaused && !gameOver && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-3 text-center">
              <span className="text-sm font-mono text-cyan-400 font-bold mb-3">TETRIS CONSOLE</span>
              <button
                onClick={() => setIsPaused(false)}
                className="bg-cyan-500 text-gray-950 px-3 py-1.5 rounded-lg text-xs font-mono font-bold hover:bg-cyan-600 transition"
              >
                PLAY
              </button>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-3 text-center">
              <span className="text-sm font-mono text-red-500 font-bold mb-3">STACK FULL</span>
              <button
                onClick={handleRestart}
                className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-mono font-bold hover:bg-red-600 transition"
              >
                RELOAD
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Panel */}
        <div className="w-28 flex flex-col gap-3 font-mono">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 text-center">
            <div className="text-[10px] text-gray-500 uppercase tracking-wide">Next Unit</div>
            <div className="mt-2 h-12 flex items-center justify-center bg-black/40 rounded-lg border border-white/5">
              <div className="grid grid-cols-4 grid-rows-2 gap-0.5 p-1">
                {/* Visualizer for next block */}
                {SHAPES[nextPieceIndex].map((row, r) => (
                  <div key={r} className="flex gap-0.5 justify-center">
                    {row.map((cell, c) => (
                      <div
                        key={c}
                        className={`w-2.5 h-2.5 rounded-sm ${
                          cell ? '' : 'opacity-0'
                        }`}
                        style={{
                          backgroundColor: cell ? SHAPE_COLORS[nextPieceIndex] : 'transparent',
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick instructions */}
          <div className="bg-slate-900/30 p-2.5 rounded-xl border border-white/5 text-[9px] text-gray-400 leading-relaxed">
            <strong className="text-cyan-400">INPUTS:</strong><br />
            • A/D / Left/Right: Shift<br />
            • W / Up: Rotate<br />
            • S / Down: Soft Drop
          </div>
        </div>
      </div>

      {/* Touch D-Pad */}
      <div className="flex flex-col items-center gap-1 mt-2 w-full max-w-[200px]">
        <button
          onClick={rotatePiece}
          className="w-14 h-12 bg-slate-800 rounded-xl border border-white/5 flex items-center justify-center text-cyan-400 active:bg-slate-700 transition"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex gap-2 w-full">
          <button
            onClick={() => moveSide(-1)}
            className="flex-1 h-12 bg-slate-800 rounded-xl border border-white/5 flex items-center justify-center text-cyan-400 active:bg-slate-700 transition"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={dropPiece}
            className="flex-1 h-12 bg-slate-800 rounded-xl border border-white/5 flex items-center justify-center text-cyan-400 active:bg-slate-700 transition"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <button
            onClick={() => moveSide(1)}
            className="flex-1 h-12 bg-slate-800 rounded-xl border border-white/5 flex items-center justify-center text-cyan-400 active:bg-slate-700 transition"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 4. NEON TIC TAC TOE COMPONENT
// ==========================================
const TicTacToeGame: React.FC = () => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ user: 0, bot: 0, ties: 0 });
  const [winnerInfo, setWinnerInfo] = useState<{ winner: string; line: number[] } | null>(null);

  const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  const checkWinner = (squares: (string | null)[]) => {
    for (let i = 0; i < winningLines.length; i++) {
      const [a, b, c] = winningLines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: winningLines[i] };
      }
    }
    if (squares.every(sq => sq !== null)) {
      return { winner: 'tie', line: [] };
    }
    return null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winnerInfo || !isXNext) return;

    const nextBoard = [...board];
    nextBoard[index] = 'X';
    setBoard(nextBoard);

    const winResult = checkWinner(nextBoard);
    if (winResult) {
      handleGameEnd(winResult);
    } else {
      setIsXNext(false);
    }
  };

  // Bot Turn (AI Algorithm)
  useEffect(() => {
    if (isXNext || winnerInfo) return;

    // Simulate AI computing delay
    const timer = setTimeout(() => {
      const botMove = computeBotMove(board);
      if (botMove !== -1) {
        const nextBoard = [...board];
        nextBoard[botMove] = 'O';
        setBoard(nextBoard);

        const winResult = checkWinner(nextBoard);
        if (winResult) {
          handleGameEnd(winResult);
        } else {
          setIsXNext(true);
        }
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [isXNext, board, winnerInfo]);

  const computeBotMove = (squares: (string | null)[]): number => {
    // 1. Can bot win in this move?
    for (let i = 0; i < winningLines.length; i++) {
      const [a, b, c] = winningLines[i];
      if (squares[a] === 'O' && squares[b] === 'O' && squares[c] === null) return c;
      if (squares[a] === 'O' && squares[c] === 'O' && squares[b] === null) return b;
      if (squares[b] === 'O' && squares[c] === 'O' && squares[a] === null) return a;
    }

    // 2. Can bot block user from winning?
    for (let i = 0; i < winningLines.length; i++) {
      const [a, b, c] = winningLines[i];
      if (squares[a] === 'X' && squares[b] === 'X' && squares[c] === null) return c;
      if (squares[a] === 'X' && squares[c] === 'X' && squares[b] === null) return b;
      if (squares[b] === 'X' && squares[c] === 'X' && squares[a] === null) return a;
    }

    // 3. Take Center
    if (squares[4] === null) return 4;

    // 4. Take Corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(c => squares[c] === null);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // 5. Take Sides
    const sides = [1, 3, 5, 7];
    const availableSides = sides.filter(s => squares[s] === null);
    if (availableSides.length > 0) {
      return availableSides[Math.floor(Math.random() * availableSides.length)];
    }

    return -1;
  };

  const handleGameEnd = (result: { winner: string; line: number[] }) => {
    setWinnerInfo(result);
    if (result.winner === 'X') {
      setScores(prev => ({ ...prev, user: prev.user + 1 }));
    } else if (result.winner === 'O') {
      setScores(prev => ({ ...prev, bot: prev.bot + 1 }));
    } else {
      setScores(prev => ({ ...prev, ties: prev.ties + 1 }));
    }
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinnerInfo(null);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      {/* Score Header */}
      <div className="grid grid-cols-3 gap-2 w-full text-center font-mono text-xs">
        <div className="bg-slate-900/60 py-2 px-3 border border-purple-500/15 rounded-xl">
          <div className="text-purple-400 font-bold">X (YOU)</div>
          <div className="text-lg font-bold text-white mt-0.5">{scores.user}</div>
        </div>
        <div className="bg-slate-900/60 py-2 px-3 border border-gray-800 rounded-xl">
          <div className="text-gray-400">TIES</div>
          <div className="text-lg font-bold text-white mt-0.5">{scores.ties}</div>
        </div>
        <div className="bg-slate-900/60 py-2 px-3 border border-rose-500/15 rounded-xl">
          <div className="text-rose-400 font-bold">O (BOT)</div>
          <div className="text-lg font-bold text-white mt-0.5">{scores.bot}</div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="relative aspect-square w-full bg-slate-950 border border-purple-500/30 rounded-2xl p-4 shadow-2xl flex items-center justify-center">
        <div className="grid grid-cols-3 grid-rows-3 gap-3 w-full h-full">
          {board.map((cell, idx) => {
            const isWinnerCell = winnerInfo?.line.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => handleCellClick(idx)}
                disabled={cell !== null || winnerInfo !== null || !isXNext}
                className={`w-full h-full bg-slate-900/60 border border-white/5 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  isWinnerCell
                    ? 'bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-950/20'
                    : 'hover:bg-slate-800'
                }`}
              >
                {cell === 'X' && (
                  <span className="text-4xl font-bold font-mono text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                    X
                  </span>
                )}
                {cell === 'O' && (
                  <span className="text-4xl font-bold font-mono text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">
                    O
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Turn indicator banner or end status overlay */}
        {winnerInfo && (
          <div className="absolute inset-0 bg-black/85 rounded-2xl flex flex-col items-center justify-center p-4 text-center">
            {winnerInfo.winner === 'X' ? (
              <h3 className="text-xl font-mono text-purple-400 font-bold mb-1">X WON THE MATCH</h3>
            ) : winnerInfo.winner === 'O' ? (
              <h3 className="text-xl font-mono text-rose-400 font-bold mb-1">BOT DEFEATED YOU</h3>
            ) : (
              <h3 className="text-xl font-mono text-gray-400 font-bold mb-1">MATCH DRAW</h3>
            )}
            <p className="text-xs text-gray-500 mb-6 font-mono">
              The board parameters are locked.
            </p>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 px-5 py-2.5 rounded-xl text-xs font-mono text-white font-bold tracking-wider transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> PLAY_AGAIN
            </button>
          </div>
        )}

        {!winnerInfo && !isXNext && (
          <div className="absolute bottom-2 bg-slate-900 border border-white/5 rounded-full px-3 py-1 text-[10px] font-mono text-gray-400 animate-pulse">
            O (BOT) is computing next choice...
          </div>
        )}
      </div>
    </div>
  );
};


// ==========================================
// PRIMARY DISPATCHER COMPONENT
// ==========================================
export const BuiltinGameRunner: React.FC<BuiltinGameProps> = ({ gameId, onClose }) => {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-white border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> BACK TO PORTAL
        </button>
        <span className="text-xs font-mono text-gray-500 tracking-wider">OFFLINE_ARCADE_MODE_ACTIVE</span>
      </div>

      {gameId === 'builtin_snake' && <SnakeGame />}
      {gameId === 'builtin_breaker' && <BrickBreakerGame />}
      {gameId === 'builtin_tetris' && <CyberBlockPuzzle />}
      {gameId === 'builtin_tictactoe' && <TicTacToeGame />}
    </div>
  );
};

// Map alias for simpler export
const CyberBlockPuzzle = TetrisGame;
