# GameHub

A polished offline-first game browser and arcade launcher built with Vite + React + TypeScript.

## Features

- Built-in game library with playable arcade and puzzle titles
- Custom HTML game uploads saved locally in IndexedDB
- File vault for installers and archives
- Browser view with proxy to avoid direct CORS issues
- PWA install support and offline caching
- Express API server for browser proxy and metadata endpoints

## Run locally

```bash
npm install
npm run dev
```

For the browser proxy and API server:

```bash
npm run serve
```

For production build:

```bash
npm run build
npm run start
```

## API endpoints

- `GET /api/health`
- `GET /api/games`
- `GET /api/proxy?url=https://example.com`

## Notes

The browser view routes through the local GameHub server so remote content can load more reliably without direct iframe restrictions.

