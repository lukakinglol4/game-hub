import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT || 3001);

app.use(express.json({ limit: '2mb' }));

const gameCatalog = [
  {
    id: 'builtin_snake',
    title: 'Neon Snake Arcade',
    description: 'Grow your glowing cyber-snake by eating glowing energy cells.',
    category: 'arcade',
    type: 'builtin',
    tags: ['snake', 'arcade', 'classic'],
  },
  {
    id: 'builtin_breaker',
    title: 'Retro Brick Breaker',
    description: 'Deflect the energy ball to shatter grid defenses and keep the ball alive.',
    category: 'action',
    type: 'builtin',
    tags: ['breaker', 'arcade', 'paddle'],
  },
  {
    id: 'builtin_tetris',
    title: 'Cyber Block Puzzle',
    description: 'Arrange falling blocks into solid rows to clear the board.',
    category: 'puzzle',
    type: 'builtin',
    tags: ['tetris', 'puzzle', 'blocks'],
  },
  {
    id: 'builtin_tictactoe',
    title: 'Neon Tic-Tac-Toe',
    description: 'Take on the AI on a glowing neon board.',
    category: 'classic',
    type: 'builtin',
    tags: ['tic-tac-toe', 'classic', 'strategy'],
  },
  {
    id: 'builtin_2048',
    title: 'Neon 2048',
    description: 'Slide numbered tiles together to build the highest value tile.',
    category: 'puzzle',
    type: 'builtin',
    tags: ['2048', 'puzzle', 'merge'],
  },
  {
    id: 'builtin_pong',
    title: 'Pulse Pong',
    description: 'A lightweight multiplayer-style arcade rally with a neon glow.',
    category: 'classic',
    type: 'builtin',
    tags: ['pong', 'arena', 'arcade'],
  },
  {
    id: 'builtin_maze',
    title: 'Glass Maze',
    description: 'Navigate the labyrinth and reach the glowing endpoint without touching the walls.',
    category: 'action',
    type: 'builtin',
    tags: ['maze', 'navigation', 'logic'],
  },
];

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'gamehub-server',
    uptime: process.uptime(),
    games: gameCatalog.length,
  });
});

app.get('/api/games', (_req, res) => {
  res.json({
    games: gameCatalog,
    generatedAt: new Date().toISOString(),
  });
});

app.get('/api/proxy', async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl || typeof targetUrl !== 'string') {
    return res.status(400).json({ error: 'Missing ?url= parameter' });
  }

  try {
    const url = new URL(targetUrl);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('Only http and https URLs are allowed.');
    }

    const remoteResponse = await fetch(url, {
      headers: {
        'User-Agent': 'GameHubBrowserProxy/1.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    });

    const contentType = remoteResponse.headers.get('content-type') ?? 'text/html; charset=utf-8';
    const body = Buffer.from(await remoteResponse.arrayBuffer());

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(remoteResponse.status).send(body);
  } catch (error) {
    console.error('Proxy fetch failed:', error);
    return res.status(400).json({
      error: 'Invalid or inaccessible URL.',
      detail: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

const distDir = path.join(__dirname, 'dist');

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    return res.sendFile(path.join(distDir, 'index.html'));
  });
} else {
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    return res.status(200).json({
      ok: true,
      service: 'gamehub-server',
      message: 'Build the frontend with npm run build before starting the production server.',
    });
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`GameHub server is running on http://localhost:${PORT}`);
});
