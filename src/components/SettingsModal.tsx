import React, { useState } from 'react';
import { X, Shield, RefreshCcw, Eye, EyeOff, Save, Trash2, Info, Monitor } from 'lucide-react';
import { HubSettings } from '../lib/db';

interface SettingsModalProps {
  settings: HubSettings;
  onSaveSettings: (settings: HubSettings) => void;
  onClose: () => void;
  onClearDatabase: () => void;
  totalCustomGames: number;
  totalFiles: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSaveSettings,
  onClose,
  onClearDatabase,
  totalCustomGames,
  totalFiles,
}) => {
  const [passcode, setPasscode] = useState(settings.passcode);
  const [errorType, setErrorType] = useState<HubSettings['errorType']>(settings.errorType);
  const [hideHint, setHideHint] = useState(settings.hideHint);
  const [showPass, setShowPass] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      passcode: passcode || 'play',
      errorType,
      hideHint,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-slate-950/40 select-none">
          <div className="flex items-center gap-2">
            <Shield className="w-4.5 h-4.5 text-emerald-400" />
            <span className="font-mono text-sm font-bold tracking-wider text-white uppercase">
              Terminal Control Settings
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5 flex-1">
          
          {/* Security Credentials */}
          <div className="space-y-2">
            <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wide">
              Access Decryption Passcode
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passphrase..."
                className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-3.5 pr-10 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-gray-500 font-mono">
              Controls gateway entry. The screen must be bypassed using this code.
            </p>
          </div>

          {/* Decoy Choice */}
          <div className="space-y-2 select-none">
            <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wide">
              Passive Decoy Layout
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setErrorType('goguardian')}
                className={`col-span-2 py-2 px-3 rounded-lg border text-left transition cursor-pointer ${
                  errorType === 'goguardian'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                🏫 GOGUARDIAN SCHOOL LOGIN
              </button>
              <button
                type="button"
                onClick={() => setErrorType('sad-tab')}
                className={`col-span-2 py-2 px-3 rounded-lg border text-left transition cursor-pointer ${
                  errorType === 'sad-tab'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                📄 CHROME SAD TAB (AW, SNAP!)
              </button>
              <button
                type="button"
                onClick={() => setErrorType('nxdomain')}
                className={`py-2 px-3 rounded-lg border text-left transition cursor-pointer ${
                  errorType === 'nxdomain'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                🦖 DNS NXDOMAIN
              </button>
              <button
                type="button"
                onClick={() => setErrorType('server-error')}
                className={`py-2 px-3 rounded-lg border text-left transition cursor-pointer ${
                  errorType === 'server-error'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                🔌 HTTP 500 ERROR
              </button>
              <button
                type="button"
                onClick={() => setErrorType('win-blue')}
                className={`py-2 px-3 rounded-lg border text-left transition cursor-pointer ${
                  errorType === 'win-blue'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                💻 WINDOWS BSOD
              </button>
              <button
                type="button"
                onClick={() => setErrorType('classic-404')}
                className={`py-2 px-3 rounded-lg border text-left transition cursor-pointer ${
                  errorType === 'classic-404'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                📂 CLASSIC 404
              </button>
            </div>
            <p className="text-[10px] text-gray-500 font-mono pt-1">
              Decoy cover page. To unlock, press <kbd className="bg-white/10 px-1 py-0.5 rounded text-gray-300">Alt + H</kbd> on any screen.
            </p>
          </div>

          {/* Toggle Hint Option */}
          <div className="flex items-center justify-between py-2 select-none">
            <div>
              <span className="block text-xs font-mono font-semibold text-white uppercase">
                Lock Screen Hint
              </span>
              <span className="text-[10px] font-mono text-gray-500">
                Display default passcode overrides on the locks.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setHideHint(!hideHint)}
              className={`w-11 h-6 rounded-full transition relative ${
                !hideHint ? 'bg-emerald-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                  !hideHint ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Core Save */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-mono font-bold py-2.5 text-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4.5 h-4.5" /> {isSaved ? 'SAVED_TERMINAL_CONFIGS' : 'SAVE_CONFIGS'}
            </button>
          </div>

        </form>

        {/* Destructive Diagnostics */}
        <div className="p-5 border-t border-white/5 bg-slate-950/20 space-y-3">
          <div className="flex justify-between items-center select-none">
            <div>
              <span className="block text-xs font-mono font-semibold text-gray-400 uppercase">
                Deconstruct Database
              </span>
              <span className="text-[9px] font-mono text-gray-500">
                Purges {totalCustomGames} custom games & {totalFiles} archived files.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('WARNING: Are you absolutely sure you want to permanently clear all uploaded HTML games and archived installers? This is irreversible.')) {
                  onClearDatabase();
                }
              }}
              className="px-3 py-1.5 rounded-lg border border-red-500/25 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/40 text-red-400 text-xs font-mono tracking-wide transition cursor-pointer"
            >
              PURGE_ALL
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
