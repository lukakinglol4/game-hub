import React, { useState } from 'react';
import { Search, Monitor, Wifi, WifiOff, Settings, Lock, Download, Menu, X, Star, FileCode, Archive, Globe, Cpu } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface GlassNavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentTab: 'all' | 'builtin' | 'custom' | 'favorites' | 'files' | 'browser' | 'emulators';
  setCurrentTab: (tab: 'all' | 'builtin' | 'custom' | 'favorites' | 'files' | 'browser' | 'emulators') => void;
  isOnline: boolean;
  onOpenSettings: () => void;
  onLock: () => void;
  totalCustomCount: number;
  totalFilesCount: number;
}

export const GlassNavbar: React.FC<GlassNavbarProps> = ({
  searchQuery,
  setSearchQuery,
  currentTab,
  setCurrentTab,
  isOnline,
  onOpenSettings,
  onLock,
  totalCustomCount,
  totalFilesCount,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: {
    id: 'all' | 'builtin' | 'custom' | 'favorites' | 'files' | 'browser' | 'emulators';
    label: string;
    count?: number | null;
    icon?: React.ComponentType<any>;
  }[] = [
    { id: 'all', label: 'All Arena', count: null },
    { id: 'builtin', label: 'Offline Arcade', count: null },
    { id: 'emulators', label: 'Emulators', icon: Cpu },
    { id: 'custom', label: 'My HTML Games', count: totalCustomCount },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'browser', label: 'Proxy Browser', icon: Globe },
    { id: 'files', label: 'Files & Installers', count: totalFilesCount },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0f19]/60 backdrop-blur-md border-b border-white/10 px-4 py-3">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
        
        {/* Branding */}
        <div className="flex items-center gap-2 select-none min-w-fit">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
            <Monitor className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-mono text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              GAME<span className="text-emerald-400">HUB</span>
            </span>
          </div>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search game, installer, or file..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/60 focus:bg-white/10 transition"
          />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wide uppercase transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                    : 'text-gray-400 border border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{item.label}</span>
                {typeof item.count === 'number' && item.count > 0 && (
                  <span className="ml-1 bg-white/10 px-1.5 py-0.5 rounded-full text-[10px] text-gray-300">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Tools & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono select-none ${
              isOnline
                ? 'bg-emerald-950/20 border-emerald-800/30 text-emerald-400'
                : 'bg-amber-950/20 border-amber-800/30 text-amber-400 animate-pulse'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isOnline ? 'CLOUD_ONLINE' : 'LOCAL_OFFLINE'}</span>
          </div>

          {/* PWA Direct Installation Controls */}
          {!isInstalled && isInstallable && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 text-xs font-mono font-semibold text-gray-950 shadow-md transition cursor-pointer h-[38px]"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">INSTALL PWA</span>
            </button>
          )}

          {!isInstalled && isIOS && (
            <>
              <button
                onClick={() => setShowIOSGuide(true)}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-mono font-medium text-gray-200 hover:bg-white/5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>IOS APP</span>
              </button>

              {showIOSGuide && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                  <div className="w-full max-w-sm rounded-xl bg-gray-900 border border-gray-800 p-6 shadow-2xl">
                    <h3 className="text-lg font-mono font-semibold text-white">Install GameHub PWA on iOS</h3>
                    <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                      1. Tap the <strong className="text-white font-semibold">Share</strong> icon in the Safari navigation bar.<br />
                      2. Scroll down and choose <strong className="text-white font-semibold">Add to Home Screen</strong>.<br />
                      3. Launch directly from your home screen for high-performance offline gaming.
                    </p>
                    <button
                      onClick={() => setShowIOSGuide(false)}
                      className="mt-5 w-full rounded-lg bg-gray-800 py-2 text-sm font-mono text-white hover:bg-gray-700 transition cursor-pointer"
                    >
                      Close Guide
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* About:Blank Cloak Button */}
          <button
            onClick={() => {
              const win = window.open('about:blank', '_blank');
              if (win) {
                const doc = win.document;
                doc.write(`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <title>Google Drive</title>
                      <link rel="icon" href="https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico">
                      <style>
                        body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #0b0f19; }
                        iframe { width: 100%; height: 100%; border: none; }
                      </style>
                    </head>
                    <body>
                      <iframe src="${window.location.href}"></iframe>
                    </body>
                  </html>
                `);
                doc.close();
              }
            }}
            title="Open in about:blank tab"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-mono transition cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">about:blank</span>
          </button>

          {/* Settings Control Button */}
          <button
            onClick={onOpenSettings}
            title="Console Settings"
            className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-gray-300 hover:text-white transition cursor-pointer"
          >
            <Settings className="w-4.5 h-4.5" />
          </button>

          {/* Secure Lock App Button */}
          <button
            onClick={onLock}
            title="Lock Console (Deploy Decoy)"
            className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-red-400 hover:text-red-300 transition cursor-pointer"
          >
            <Lock className="w-4.5 h-4.5" />
          </button>

          {/* Mobile Hamburguer Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:text-white transition cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-white/10 space-y-3">
          {/* Mobile Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Mobile Nav Links */}
          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono uppercase transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    {item.label}
                  </span>
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span className="bg-white/10 px-1.5 py-0.5 rounded-full text-[10px]">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
