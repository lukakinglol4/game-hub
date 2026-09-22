import { useState, useEffect } from 'react';
import { GlassNavbar } from './components/GlassNavbar';
import { FakeErrorScreen } from './components/FakeErrorScreen';
import { GameCard } from './components/GameCard';
import { GameRunner } from './components/GameRunner';
import { FileHub } from './components/FileHub';
import { SettingsModal } from './components/SettingsModal';
import { StandardBrowser } from './components/StandardBrowser';
import { EmulatorsHub } from './components/EmulatorsHub';
import {
  initDB,
  getCustomGames,
  saveCustomGame,
  deleteCustomGame,
  getFiles,
  saveFile,
  deleteFile,
  getSettings,
  saveSettings,
  Game,
  FileItem,
  HubSettings,
} from './lib/db';
import { BUILTIN_GAMES } from './data/builtinGames';
import { Monitor, HelpCircle, Key, Laptop, Wifi, ShieldCheck, Heart, Gamepad2, HardDrive } from 'lucide-react';

export default function App() {
  // Session unlock state (so reload doesn't aggressively lock during active play, but manual lock is possible)
  const [isLocked, setIsLocked] = useState(() => {
    return sessionStorage.getItem('gh_unlocked') !== 'true';
  });

  const [settings, setSettings] = useState<HubSettings>({
    passcode: 'play',
    errorType: 'sad-tab',
    hideHint: false,
  });

  const [customGames, setCustomGames] = useState<Game[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  
  // Navigation & UI States
  const [currentTab, setCurrentTab] = useState<'all' | 'builtin' | 'custom' | 'favorites' | 'files' | 'browser' | 'emulators'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Load Initial Configurations and Cached Files
  useEffect(() => {
    const loadAppData = async () => {
      try {
        await initDB();
        
        // Settings
        const storedSettings = await getSettings();
        setSettings(storedSettings);

        // Custom Games
        const storedGames = await getCustomGames();
        setCustomGames(storedGames);

        // Archived Files
        const storedFiles = await getFiles();
        setFiles(storedFiles);
      } catch (err) {
        console.error('Error bootstrapping GameHub storage:', err);
      }
    };

    loadAppData();

    // Monitor Online/Offline Status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Unlock Controller Portal
  const handleUnlock = () => {
    setIsLocked(false);
    sessionStorage.setItem('gh_unlocked', 'true');
  };

  // Secure Manual Re-lock
  const handleLock = () => {
    setIsLocked(true);
    sessionStorage.removeItem('gh_unlocked');
    setActiveGame(null);
    setShowSettings(false);
  };

  // Save Settings Config
  const handleSaveSettings = async (newSettings: HubSettings) => {
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  // Upload General Installer File
  const handleUploadFile = async (fileItem: FileItem) => {
    await saveFile(fileItem);
    // Refresh local memory state
    const storedFiles = await getFiles();
    setFiles(storedFiles);
  };

  // Delete General Installer File
  const handleDeleteFile = async (id: string) => {
    await deleteFile(id);
    const storedFiles = await getFiles();
    setFiles(storedFiles);
  };

  // Register uploaded HTML source as custom sandbox game
  const handleRegisterCustomGame = async (game: Game) => {
    await saveCustomGame(game);
    const storedGames = await getCustomGames();
    setCustomGames(storedGames);
  };

  // Delete uploaded HTML game
  const handleDeleteCustomGame = async (id: string) => {
    await deleteCustomGame(id);
    const storedGames = await getCustomGames();
    setCustomGames(storedGames);
  };

  // Favorite triggers
  const handleToggleFavorite = async (id: string) => {
    const isBuiltIn = id.startsWith('builtin_');

    if (isBuiltIn) {
      const key = `gh_fav_${id}`;
      const isFav = localStorage.getItem(key) === 'true';
      if (isFav) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, 'true');
      }
      // trigger state force-update to refresh UI favorites lists
      setCustomGames((prev) => [...prev]);
    } else {
      const target = customGames.find((g) => g.id === id);
      if (target) {
        const updated: Game = { ...target, isFavorite: !target.isFavorite };
        await saveCustomGame(updated);
        const storedGames = await getCustomGames();
        setCustomGames(storedGames);
      }
    }
  };

  // Play Game: Update statistics and mount GameRunner overlay
  const handlePlayGame = async (game: Game) => {
    const updatedGame = { ...game, plays: game.plays + 1 };
    
    if (game.type === 'builtin') {
      const key = `gh_plays_${game.id}`;
      const currentPlays = Number(localStorage.getItem(key) || '0');
      localStorage.setItem(key, String(currentPlays + 1));
    } else {
      await saveCustomGame(updatedGame);
      const storedGames = await getCustomGames();
      setCustomGames(storedGames);
    }

    setActiveGame(updatedGame);
  };

  // Consolidate games lists (Builtin + User-uploaded custom games)
  const getAllGames = (): Game[] => {
    const mappedBuiltin: Game[] = BUILTIN_GAMES.map((game) => {
      const isFav = localStorage.getItem(`gh_fav_${game.id}`) === 'true';
      const plays = Number(localStorage.getItem(`gh_plays_${game.id}`) || String(game.plays));
      return {
        ...game,
        isFavorite: isFav,
        plays: plays,
      };
    });

    return [...mappedBuiltin, ...customGames];
  };

  // Get active games matching currently selected Tab filter & search keywords
  const getFilteredGames = (): Game[] => {
    const list = getAllGames();
    const query = searchQuery.toLowerCase();

    const searchFiltered = list.filter(
      (g) =>
        g.title.toLowerCase().includes(query) ||
        g.description.toLowerCase().includes(query) ||
        g.category.toLowerCase().includes(query)
    );

    switch (currentTab) {
      case 'builtin':
        return searchFiltered.filter((g) => g.type === 'builtin');
      case 'custom':
        return searchFiltered.filter((g) => g.type === 'html-file');
      case 'favorites':
        return searchFiltered.filter((g) => g.isFavorite);
      case 'all':
      default:
        return searchFiltered;
    }
  };

  // Hard Reset Portal Database
  const handleClearDatabase = async () => {
    // Clear custom games
    for (const g of customGames) {
      await deleteCustomGame(g.id);
    }
    // Clear files
    for (const f of files) {
      await deleteFile(f.id);
    }
    // Clear local storage metrics
    BUILTIN_GAMES.forEach((game) => {
      localStorage.removeItem(`gh_fav_${game.id}`);
      localStorage.removeItem(`gh_plays_${game.id}`);
    });
    localStorage.removeItem('gh_high_snake');
    localStorage.removeItem('gh_high_breaker');
    localStorage.removeItem('gh_high_tetris');

    setCustomGames([]);
    setFiles([]);
    setShowSettings(false);
  };

  // Render Lock Screen Decoy if needed
  if (isLocked) {
    return <FakeErrorScreen settings={settings} onUnlock={handleUnlock} />;
  }

  const filteredGames = getFilteredGames();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col relative font-sans">
      
      {/* Background visual light ambiance */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full filter blur-[120px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full filter blur-[120px] pointer-events-none select-none z-0" />

      {/* Glassmorphic Navbar */}
      <GlassNavbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isOnline={isOnline}
        onOpenSettings={() => setShowSettings(true)}
        onLock={handleLock}
        totalCustomCount={customGames.length}
        totalFilesCount={files.length}
      />

      {/* Primary Container Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 relative z-10">
        
        {currentTab === 'browser' ? (
          /* Sandbox Web Browser View Mode */
          <StandardBrowser />
        ) : currentTab === 'emulators' ? (
          /* Retro Emulators Console Hub */
          <EmulatorsHub onLaunchGame={(game) => setActiveGame(game)} />
        ) : currentTab === 'files' ? (
          /* File / Executable Storage View Mode */
          <FileHub
            files={files}
            onUploadFile={handleUploadFile}
            onRegisterCustomGame={handleRegisterCustomGame}
            onDeleteFile={handleDeleteFile}
            searchQuery={searchQuery}
          />
        ) : (
          /* Gaming Dashboard Grid View Mode */
          <div className="space-y-8 text-left">
            
            {/* Header branding details block */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/20 border border-white/5 p-6 rounded-2xl select-none">
              <div>
                <h2 className="font-mono text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Gamepad2 className="w-6 h-6 text-emerald-400 animate-pulse" /> Offline Arcade Console
                </h2>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed max-w-xl">
                  Run high-performance built-in offline arcade emulators or upload local HTML/JS source code to launch independent sandboxed games directly from browser cache memory.
                </p>
              </div>

              {/* Mini telemetry quick metric widgets */}
              <div className="flex items-center gap-3 font-mono text-xs text-gray-400">
                <div className="bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-500 block uppercase font-semibold">Loaded games</span>
                  <span className="text-white font-bold text-sm mt-0.5 block">{getAllGames().length} units</span>
                </div>
                <div className="bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-500 block uppercase font-semibold">Local Storage</span>
                  <span className="text-white font-bold text-sm mt-0.5 block">IndexedDB Vault</span>
                </div>
              </div>
            </div>

            {/* Grid List rendering */}
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-6 select-none">
                <span className="font-mono text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  Cataloged Programs ({filteredGames.length})
                </span>
                <span className="text-[10px] font-mono text-gray-500">
                  Search active filters
                </span>
              </div>

              {filteredGames.length === 0 ? (
                <div className="py-24 text-center rounded-2xl bg-slate-900/10 border border-dashed border-white/5">
                  <Gamepad2 className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm font-mono text-gray-400 font-medium">No playable units matching filters found.</p>
                  <p className="text-xs text-gray-500 mt-1 font-mono">
                    {currentTab === 'favorites' ? 'Mark stars on game headers to compile shortcuts here.' : 'Try adjusting the search input or loading custom games.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredGames.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      onPlay={handlePlayGame}
                      onToggleFavorite={handleToggleFavorite}
                      onDelete={handleDeleteCustomGame}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* Global Sandbox Playback Runner overlay */}
      <GameRunner game={activeGame} onClose={() => setActiveGame(null)} />

      {/* Central control configuration modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSaveSettings={handleSaveSettings}
          onClose={() => setShowSettings(false)}
          onClearDatabase={handleClearDatabase}
          totalCustomGames={customGames.length}
          totalFiles={files.length}
        />
      )}

      {/* Offline Alert Sticky HUD popup */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 z-40 bg-amber-500/20 border border-amber-500/30 text-amber-400 font-mono text-xs rounded-xl px-4 py-2.5 shadow-xl flex items-center gap-2 select-none">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          Offline Mode Active — Playing completely from IndexedDB cache.
        </div>
      )}
    </div>
  );
}
