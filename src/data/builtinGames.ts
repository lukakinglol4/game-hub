import { Game } from '../lib/db';

export const BUILTIN_GAMES: Game[] = [
  {
    id: 'builtin_snake',
    title: 'Neon Snake Arcade',
    description: 'Grow your glowing cyber-snake by consuming glowing energy cells. Avoid slamming into boundaries or your own tail.',
    category: 'arcade',
    type: 'builtin',
    uploadedAt: 1789830000000,
    isFavorite: true,
    plays: 12,
  },
  {
    id: 'builtin_breaker',
    title: 'Retro Brick Breaker',
    description: 'Deflect the energy ball to shatter grid defenses. Catch golden power-ups to expand your paddle.',
    category: 'action',
    type: 'builtin',
    uploadedAt: 1789830100000,
    isFavorite: false,
    plays: 8,
  },
  {
    id: 'builtin_tetris',
    title: 'Cyber Block Puzzle',
    description: 'Arrange falling tetromino matrixes into solid rows to clear them and maintain grid equilibrium.',
    category: 'puzzle',
    type: 'builtin',
    uploadedAt: 1789830200000,
    isFavorite: true,
    plays: 25,
  },
  {
    id: 'builtin_tictactoe',
    title: 'Neon Tic-Tac-Toe',
    description: 'Face off against an intelligent quantum AI algorithm in an illuminated neon tactical board game.',
    category: 'classic',
    type: 'builtin',
    uploadedAt: 1789830300000,
    isFavorite: false,
    plays: 15,
  }
];
