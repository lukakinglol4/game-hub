import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Play, RefreshCw, Trophy, X } from 'lucide-react';

interface BuiltinGameRunnerProps {
  gameId: string;
  onClose: () => void;
}

const GRID_SIZE = 12;
const BOARD_COLS = 12;
const BOARD_ROWS = 12;

function randomFood(snake: Array<{ x: number; y: number }>) {
  const occupied = new Set(snake.map((segment) => `${segment.x},${segment.y}`));
  const cells: Array<{ x: number; y: number }> = [];

  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      if (!occupied.has(`${x},${y}`)) {
        cells.push({ x, y });
      }
    }
  }

  return cells[Math.floor(Math.random() * cells.length)] ?? { x: 0, y: 0 };
}

function GameShell({
  title,
  subtitle,
  onReset,
  onClose,
  children,
}: {
  title: string;
  subtitle: string;
  onReset: () => void;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-lg text-white">
      <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-slate-900/70 p-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300">Built-in game</div>
          <div className="text-lg font-bold text-white">{title}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="rounded-lg border border-white/10 bg-white/5 p-2 text-gray-200 transition hover:bg-white/10"
            title="Reset"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-300 transition hover:bg-red-500/20"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-white/10 bg-slate-950/80 p-4">
        <div className="mb-4 flex items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
          <span>{subtitle}</span>
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-emerald-300">
            Live
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

function SnakeGame() {
  const [snake, setSnake] = useState<Array<{ x: number; y: number }>>([
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ]);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [food, setFood] = useState({ x: 8, y: 5 });
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const reset = () => {
    setSnake([
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ]);
    setDirection({ x: 1, y: 0 });
    setFood({ x: 8, y: 5 });
    setScore(0);
    setIsGameOver(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyMap: Record<string, { x: number; y: number }> = {
        ArrowUp: { x: 0, y: -1 },
        w: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        s: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        a: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        d: { x: 1, y: 0 },
      };

      const nextDir = keyMap[event.key] ?? keyMap[event.key.toLowerCase()];
      if (!nextDir) return;
      setDirection((current) => {
        const isOpposite = current.x + nextDir.x === 0 && current.y + nextDir.y === 0;
        return isOpposite ? current : nextDir;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isGameOver) return;

    const interval = window.setInterval(() => {
      setSnake((current) => {
        const head = { x: current[0].x + direction.x, y: current[0].y + direction.y };
        const wallHit = head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE;
        const selfHit = current.some((segment) => segment.x === head.x && segment.y === head.y);

        if (wallHit || selfHit) {
          setIsGameOver(true);
          return current;
        }

        const next = [head, ...current];
        const ateFood = head.x === food.x && head.y === food.y;

        if (ateFood) {
          setScore((value) => value + 10);
          setFood(randomFood(next));
        } else {
          next.pop();
        }

        return next;
      });
    }, 150);

    return () => window.clearInterval(interval);
  }, [direction, food, isGameOver]);

  const board = useMemo(() => {
    const cells = Array.from({ length: GRID_SIZE * GRID_SIZE }, () => 0);
    snake.forEach((segment) => {
      const index = segment.y * GRID_SIZE + segment.x;
      if (index >= 0 && index < cells.length) cells[index] = 1;
    });
    const foodIndex = food.y * GRID_SIZE + food.x;
    if (foodIndex >= 0 && foodIndex < cells.length) cells[foodIndex] = 2;
    return cells;
  }, [food, snake]);

  return (
    <GameShell title="Neon Snake" subtitle="Use arrow keys or WASD" onReset={reset} onClose={() => {}}> 
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-300">
          <span>Score: <strong className="text-emerald-300">{score}</strong></span>
          <span>{isGameOver ? 'Crashed' : 'Running'}</span>
        </div>
        <div className="grid grid-cols-12 gap-1 rounded-xl border border-emerald-500/20 bg-slate-900 p-2">
          {board.map((cell, index) => (
            <div
              key={`${index}-${cell}`}
              className={[
                'h-4 w-4 rounded-[4px] border border-slate-800',
                cell === 1 && 'bg-emerald-400 border-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.7)]',
                cell === 2 && 'bg-rose-400 border-rose-300 shadow-[0_0_12px_rgba(251,113,133,0.8)]',
                cell === 0 && 'bg-slate-800/80',
              ].join(' ')}
            />
          ))}
        </div>
        {isGameOver && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center font-mono text-sm text-red-300">
            Game over — hit reset to play again.
          </div>
        )}
      </div>
    </GameShell>
  );
}

function BreakerGame() {
  const [paddleX, setPaddleX] = useState(4);
  const [ball, setBall] = useState({ x: 6, y: 9, dx: 1, dy: -1 });
  const [score, setScore] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  const reset = () => {
    setPaddleX(4);
    setBall({ x: 6, y: 9, dx: 1, dy: -1 });
    setScore(0);
    setIsRunning(true);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const left = event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a';
      const right = event.key === 'ArrowRight' || event.key.toLowerCase() === 'd';

      if (left) setPaddleX((value) => Math.max(0, value - 1));
      if (right) setPaddleX((value) => Math.min(9, value + 1));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const interval = window.setInterval(() => {
      setBall((current) => {
        let nextX = current.x + current.dx;
        let nextY = current.y + current.dy;
        let nextDx = current.dx;
        let nextDy = current.dy;

        if (nextX <= 0 || nextX >= BOARD_COLS - 1) nextDx *= -1;
        if (nextY <= 0) nextDy *= -1;

        if (nextY >= 10 && nextX >= paddleX && nextX <= paddleX + 2) {
          nextDy = -1;
          setScore((value) => value + 10);
        }

        if (nextY >= 12) {
          setIsRunning(false);
          return current;
        }

        return { x: nextX, y: nextY, dx: nextDx, dy: nextDy };
      });
    }, 120);

    return () => window.clearInterval(interval);
  }, [isRunning, paddleX]);

  const board = Array.from({ length: BOARD_ROWS * BOARD_COLS }, () => 0);
  board[11 * BOARD_COLS + paddleX] = 3;
  board[11 * BOARD_COLS + paddleX + 1] = 3;
  board[11 * BOARD_COLS + paddleX + 2] = 3;
  board[ball.y * BOARD_COLS + ball.x] = 2;

  return (
    <GameShell title="Retro Breaker" subtitle="Use A/D or arrow keys" onReset={reset} onClose={() => {}}>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-300">
          <span>Score: <strong className="text-amber-300">{score}</strong></span>
          <span>{isRunning ? 'In play' : 'Missed it'}</span>
        </div>
        <div className="grid grid-cols-12 gap-1 rounded-xl border border-amber-500/20 bg-slate-900 p-2">
          {board.map((cell, index) => (
            <div
              key={`breaker-${index}`}
              className={[
                'h-3 w-3 rounded-[3px]',
                cell === 2 && 'bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.9)]',
                cell === 3 && 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]',
                cell === 0 && 'bg-slate-800',
              ].join(' ')}
            />
          ))}
        </div>
        {!isRunning && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center font-mono text-sm text-red-300">
            Ball missed — press reset to relaunch.
          </div>
        )}
      </div>
    </GameShell>
  );
}

function TetrisGame() {
  const [board, setBoard] = useState<Array<number[]>>(
    Array.from({ length: 12 }, () => Array(10).fill(0)),
  );
  const [piece, setPiece] = useState({ x: 3, y: 0, shape: [[1, 1], [1, 1]] });
  const [score, setScore] = useState(0);

  const reset = () => {
    setBoard(Array.from({ length: 12 }, () => Array(10).fill(0)));
    setPiece({ x: 3, y: 0, shape: [[1, 1], [1, 1]] });
    setScore(0);
  };

  useEffect(() => {
    const interval = window.setInterval(() => {
      setBoard((currentBoard) => {
        let next = currentBoard.map((row) => [...row]);
        const nextPiece = { ...piece, y: piece.y + 1 };

        if (piece.y + piece.shape.length >= next.length) {
          const boardWithPiece = next.map((row) => [...row]);
          piece.shape.forEach((row, y) => {
            row.forEach((cell, x) => {
              if (cell) {
                const px = piece.x + x;
                const py = piece.y + y;
                if (py >= 0 && py < boardWithPiece.length && px >= 0 && px < boardWithPiece[0].length) {
                  boardWithPiece[py][px] = 1;
                }
              }
            });
          });
          setPiece({ x: 3, y: 0, shape: [[1, 1], [1, 1]] });
          setScore((value) => value + 10);
          return boardWithPiece;
        }

        setPiece(nextPiece);
        return next;
      });
    }, 450);

    return () => window.clearInterval(interval);
  }, [piece]);

  const cells = board.flatMap((row) => row);

  return (
    <GameShell title="Cyber Tetris" subtitle="Auto-falling block" onReset={reset} onClose={() => {}}>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-300">
          <span>Score: <strong className="text-cyan-300">{score}</strong></span>
          <span>Rows: 12</span>
        </div>
        <div className="grid grid-cols-10 gap-1 rounded-xl border border-cyan-500/20 bg-slate-900 p-2">
          {cells.map((cell, index) => (
            <div
              key={`tetris-${index}`}
              className={[
                'h-4 w-4 rounded-[4px]',
                cell === 1 ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'bg-slate-800',
              ].join(' ')}
            />
          ))}
        </div>
      </div>
    </GameShell>
  );
}

function TicTacToeGame() {
  const [board, setBoard] = useState<Array<Array<string | null>>>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);
  const [isXTurn, setIsXTurn] = useState(true);

  const reset = () => {
    setBoard([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);
    setIsXTurn(true);
  };

  const winner = (() => {
    const lines = [
      [board[0][0], board[0][1], board[0][2]],
      [board[1][0], board[1][1], board[1][2]],
      [board[2][0], board[2][1], board[2][2]],
      [board[0][0], board[1][0], board[2][0]],
      [board[0][1], board[1][1], board[2][1]],
      [board[0][2], board[1][2], board[2][2]],
      [board[0][0], board[1][1], board[2][2]],
      [board[0][2], board[1][1], board[2][0]],
    ];

    const found = lines.find((line) => line[0] && line[0] === line[1] && line[0] === line[2]);
    return found?.[0] ?? null;
  })();

  useEffect(() => {
    if (winner || !isXTurn) return;

    const emptyCells: Array<[number, number]> = [];
    board.forEach((row, rowIndex) =>
      row.forEach((cell, cellIndex) => {
        if (!cell) emptyCells.push([rowIndex, cellIndex]);
      }),
    );

    if (emptyCells.length === 0) return;

    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const nextBoard = board.map((line) => [...line]);
    nextBoard[row][col] = 'O';
    setBoard(nextBoard);
    setIsXTurn(true);
  }, [board, isXTurn, winner]);

  const handleMove = (row: number, col: number) => {
    if (board[row][col] || winner) return;
    const nextBoard = board.map((line) => [...line]);
    nextBoard[row][col] = isXTurn ? 'X' : 'O';
    setBoard(nextBoard);
    setIsXTurn((current) => !current);
  };

  return (
    <GameShell title="Neon Tic-Tac-Toe" subtitle="Play against the grid" onReset={reset} onClose={() => {}}>
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-300">
          <span>{winner ? `Winner: ${winner}` : isXTurn ? 'Your turn (X)' : 'CPU turn (O)'}</span>
          <Trophy className="h-4 w-4 text-violet-300" />
        </div>
        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-violet-500/20 bg-slate-900 p-3">
          {board.flatMap((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`cell-${rowIndex}-${colIndex}`}
                onClick={() => handleMove(rowIndex, colIndex)}
                className="flex h-16 items-center justify-center rounded-xl border border-white/10 bg-slate-800 text-2xl font-bold text-white transition hover:border-violet-400/50 hover:bg-slate-700"
              >
                {cell}
              </button>
            )),
          )}
        </div>
      </div>
    </GameShell>
  );
}

function Puzzle2048Game() {
  const [board, setBoard] = useState<number[][]>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [score, setScore] = useState(0);

  const addTile = (grid: number[][]) => {
    const empty: Array<[number, number]> = [];
    grid.forEach((row, rowIndex) =>
      row.forEach((cell, colIndex) => {
        if (!cell) empty.push([rowIndex, colIndex]);
      }),
    );

    if (!empty.length) return grid;
    const [row, col] = empty[Math.floor(Math.random() * empty.length)];
    const next = grid.map((line) => [...line]);
    next[row][col] = Math.random() > 0.75 ? 4 : 2;
    return next;
  };

  const reset = () => {
    const next = Array.from({ length: 4 }, () => Array(4).fill(0));
    setBoard(addTile(addTile(next)));
    setScore(0);
  };

  useEffect(() => {
    reset();
  }, []);

  const move = (direction: 'left' | 'right' | 'up' | 'down') => {
    const rows = board.length;
    const cols = board[0].length;
    const next = board.map((row) => [...row]);

    const collapse = (line: number[]) => {
      const filtered = line.filter(Boolean);
      const merged: number[] = [];
      for (let i = 0; i < filtered.length; i += 1) {
        if (filtered[i] === filtered[i + 1]) {
          const value = filtered[i] * 2;
          merged.push(value);
          setScore((current) => current + value);
          i += 1;
        } else {
          merged.push(filtered[i]);
        }
      }
      while (merged.length < 4) merged.push(0);
      return merged;
    };

    if (direction === 'left') {
      for (let i = 0; i < rows; i += 1) next[i] = collapse(next[i]);
    }

    if (direction === 'right') {
      for (let i = 0; i < rows; i += 1) next[i] = collapse([...next[i]].reverse()).reverse();
    }

    if (direction === 'up') {
      for (let i = 0; i < cols; i += 1) {
        const column = Array.from({ length: rows }, (_, rowIndex) => next[rowIndex][i]);
        const collapsed = collapse(column);
        collapsed.forEach((value, rowIndex) => {
          next[rowIndex][i] = value;
        });
      }
    }

    if (direction === 'down') {
      for (let i = 0; i < cols; i += 1) {
        const column = Array.from({ length: rows }, (_, rowIndex) => next[rowIndex][i]).reverse();
        const collapsed = collapse(column).reverse();
        collapsed.forEach((value, rowIndex) => {
          next[rowIndex][i] = value;
        });
      }
    }

    setBoard(addTile(next));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') move('left');
      if (event.key === 'ArrowRight') move('right');
      if (event.key === 'ArrowUp') move('up');
      if (event.key === 'ArrowDown') move('down');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board]);

  return (
    <GameShell title="Neon 2048" subtitle="Arrow controls" onReset={reset} onClose={() => {}}>
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-300">
          <span>Score: <strong className="text-violet-300">{score}</strong></span>
          <span>4×4</span>
        </div>
        <div className="grid grid-cols-4 gap-2 rounded-2xl border border-violet-500/20 bg-slate-900 p-3">
          {board.flatMap((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`tile-${rowIndex}-${colIndex}`}
                className={[
                  'flex h-16 items-center justify-center rounded-xl text-lg font-bold text-white',
                  cell === 0 && 'bg-slate-800',
                  cell === 2 && 'bg-emerald-500/70',
                  cell === 4 && 'bg-cyan-500/70',
                  cell === 8 && 'bg-sky-500/70',
                  cell === 16 && 'bg-violet-500/70',
                  cell >= 32 && 'bg-rose-500/70',
                ].join(' ')}
              >
                {cell || ''}
              </div>
            )),
          )}
        </div>
      </div>
    </GameShell>
  );
}

function PongGame() {
  const [paddleLeft, setPaddleLeft] = useState(2);
  const [paddleRight, setPaddleRight] = useState(2);
  const [ball, setBall] = useState({ x: 6, y: 6, dx: 1, dy: 1 });
  const [score, setScore] = useState({ left: 0, right: 0 });

  const reset = () => {
    setPaddleLeft(2);
    setPaddleRight(2);
    setBall({ x: 6, y: 6, dx: 1, dy: 1 });
    setScore({ left: 0, right: 0 });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'w' || event.key === 'W') setPaddleLeft((value) => Math.max(0, value - 1));
      if (event.key === 's' || event.key === 'S') setPaddleLeft((value) => Math.min(6, value + 1));
      if (event.key === 'ArrowUp') setPaddleRight((value) => Math.max(0, value - 1));
      if (event.key === 'ArrowDown') setPaddleRight((value) => Math.min(6, value + 1));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setBall((current) => {
        let nextX = current.x + current.dx;
        let nextY = current.y + current.dy;
        let nextDx = current.dx;
        let nextDy = current.dy;

        if (nextY <= 0 || nextY >= 11) nextDy *= -1;
        if (nextX <= 0) {
          if (nextY >= paddleLeft && nextY <= paddleLeft + 2) {
            nextDx = 1;
          } else {
            setScore((value) => ({ ...value, right: value.right + 1 }));
            return { x: 6, y: 6, dx: 1, dy: 1 };
          }
        }
        if (nextX >= 12) {
          if (nextY >= paddleRight && nextY <= paddleRight + 2) {
            nextDx = -1;
          } else {
            setScore((value) => ({ ...value, left: value.left + 1 }));
            return { x: 6, y: 6, dx: -1, dy: 1 };
          }
        }

        return { x: nextX, y: nextY, dx: nextDx, dy: nextDy };
      });
    }, 140);

    return () => window.clearInterval(interval);
  }, [paddleLeft, paddleRight]);

  const board = Array.from({ length: 12 * 14 }, () => 0);
  for (let i = 0; i < 3; i += 1) board[(paddleLeft + i) * 14] = 1;
  for (let i = 0; i < 3; i += 1) board[(paddleRight + i) * 14 + 13] = 1;
  board[ball.y * 14 + ball.x] = 2;

  return (
    <GameShell title="Pulse Pong" subtitle="W/S vs arrow keys" onReset={reset} onClose={() => {}}>
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-300">
          <span>Left: <strong className="text-emerald-300">{score.left}</strong></span>
          <span>Right: <strong className="text-amber-300">{score.right}</strong></span>
        </div>
        <div className="grid grid-cols-14 gap-1 rounded-xl border border-emerald-500/20 bg-slate-900 p-2">
          {board.map((cell, index) => (
            <div
              key={`pong-${index}`}
              className={[
                'h-3 w-3 rounded-[3px]',
                cell === 1 && 'bg-emerald-400',
                cell === 2 && 'bg-rose-400',
                cell === 0 && 'bg-slate-800',
              ].join(' ')}
            />
          ))}
        </div>
      </div>
    </GameShell>
  );
}

function MazeGame() {
  const [player, setPlayer] = useState({ x: 0, y: 0 });
  const [goal, setGoal] = useState({ x: 7, y: 7 });
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const reset = () => {
    setPlayer({ x: 0, y: 0 });
    setGoal({ x: 7, y: 7 });
    setMoves(0);
    setWon(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (won) return;
      const map: Record<string, { x: number; y: number }> = {
        ArrowUp: { x: 0, y: -1 },
        w: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        s: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        a: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        d: { x: 1, y: 0 },
      };

      const delta = map[event.key] ?? map[event.key.toLowerCase()];
      if (!delta) return;

      setPlayer((current) => {
        const next = { x: current.x + delta.x, y: current.y + delta.y };
        if (next.x < 0 || next.x >= 8 || next.y < 0 || next.y >= 8) return current;
        if ((next.x === 2 && next.y >= 1 && next.y <= 5) || (next.y === 2 && next.x >= 3 && next.x <= 7) || (next.x === 5 && next.y >= 2 && next.y <= 5)) {
          return current;
        }
        setMoves((value) => value + 1);
        if (next.x === goal.x && next.y === goal.y) setWon(true);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goal, won]);

  const cells = Array.from({ length: 64 }, (_, index) => {
    const row = Math.floor(index / 8);
    const col = index % 8;
    if (row === player.y && col === player.x) return 'player';
    if (row === goal.y && col === goal.x) return 'goal';
    if ((col === 2 && row >= 1 && row <= 5) || (row === 2 && col >= 3 && col <= 7) || (col === 5 && row >= 2 && row <= 5)) return 'wall';
    return 'empty';
  });

  return (
    <GameShell title="Glass Maze" subtitle="WASD to navigate" onReset={reset} onClose={() => {}}>
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-300">
          <span>Moves: <strong className="text-emerald-300">{moves}</strong></span>
          <span>{won ? 'Goal reached' : 'Exploring'}</span>
        </div>
        <div className="grid grid-cols-8 gap-1 rounded-xl border border-emerald-500/20 bg-slate-900 p-2">
          {cells.map((cell, index) => (
            <div
              key={`maze-${index}`}
              className={[
                'flex h-6 w-6 items-center justify-center rounded-[4px]',
                cell === 'player' && 'bg-emerald-400',
                cell === 'goal' && 'bg-amber-400',
                cell === 'wall' && 'bg-slate-700',
                cell === 'empty' && 'bg-slate-800',
              ].join(' ')}
            />
          ))}
        </div>
        {won && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center font-mono text-sm text-emerald-300">
            You escaped the maze.
          </div>
        )}
      </div>
    </GameShell>
  );
}

export const BuiltinGameRunner: React.FC<BuiltinGameRunnerProps> = ({ gameId, onClose }) => {
  const gameMap: Record<string, JSX.Element> = {
    builtin_snake: <SnakeGame />,
    builtin_breaker: <BreakerGame />,
    builtin_tetris: <TetrisGame />,
    builtin_tictactoe: <TicTacToeGame />,
    builtin_2048: <Puzzle2048Game />,
    builtin_pong: <PongGame />,
    builtin_maze: <MazeGame />,
  };

  return gameMap[gameId] ?? (
    <div className="w-full max-w-lg rounded-2xl border border-amber-500/20 bg-slate-950/80 p-6 text-center text-sm text-amber-300">
      Built-in game {gameId} is unavailable.
    </div>
  );
};
