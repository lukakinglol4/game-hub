import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, ShieldCheck, HelpCircle, Terminal, RefreshCw, AlertTriangle } from 'lucide-react';
import { HubSettings } from '../lib/db';

interface FakeErrorScreenProps {
  settings: HubSettings;
  onUnlock: () => void;
}

export const FakeErrorScreen: React.FC<FakeErrorScreenProps> = ({ settings, onUnlock }) => {
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [liveTimestamp, setLiveTimestamp] = useState('');

  // Live GoGuardian formatted UTC clock
  useEffect(() => {
    const getTimestamp = () => {
      const now = new Date();
      const YYYY = now.getUTCFullYear();
      const MM = String(now.getUTCMonth() + 1).padStart(2, '0');
      const DD = String(now.getUTCDate()).padStart(2, '0');
      const hh = String(now.getUTCHours()).padStart(2, '0');
      const mm = String(now.getUTCMinutes()).padStart(2, '0');
      const ss = String(now.getUTCSeconds()).padStart(2, '0');
      return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss} UTC`;
    };
    setLiveTimestamp(getTimestamp());
    
    const interval = setInterval(() => {
      setLiveTimestamp(getTimestamp());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Shortcut handler: Alt + H (or Option + H)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // altKey is true when Alt/Option is pressed
      if (e.altKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setShowUnlockModal((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === settings.passcode) {
      onUnlock();
    } else {
      setIsError(true);
      // Shake effect timeout
      setTimeout(() => setIsError(false), 500);
    }
  };

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
    }, 1500);
  };

  // Chrome Dino NXDOMAIN Layout
  const renderNxdomain = () => (
    <div className="max-w-xl px-8 py-16 text-left" id="nxdomain-screen">
      {/* Grey browser warning design */}
      <div className="mb-8 select-none text-6xl text-gray-400">
        🦖
      </div>
      <h1 className="text-2xl font-normal text-gray-800 dark:text-gray-200 leading-tight">
        This site can’t be reached
      </h1>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        The web page might be temporarily down or it may have moved permanently to a new web address.
      </p>
      <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-6">
        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">
          Error details
        </p>
        <p className="mt-1 text-sm font-mono text-gray-600 dark:text-gray-400">
          ERR_CONNECTION_REFUSED
        </p>
      </div>
      <div className="mt-8 flex gap-3">
        <button
          onClick={handleRetry}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none transition flex items-center gap-2"
        >
          {isRetrying && <RefreshCw className="w-4 h-4 animate-spin" />}
          {isRetrying ? 'Checking connection...' : 'Reload'}
        </button>
      </div>
      <p className="mt-8 text-xs text-gray-400 dark:text-gray-500">
        Tip: Pressing certain shortcut keys like <kbd className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-[10px] font-mono">Alt + H</kbd> might trigger recovery procedures.
      </p>
    </div>
  );

  // standard Nginx 500 Internal Server Error Layout
  const renderServerError = () => (
    <div className="w-full text-center p-8 font-serif" id="server-error-screen">
      <h1 className="text-4xl text-gray-800 dark:text-gray-200 font-bold mb-4">500 Internal Server Error</h1>
      <hr className="border-gray-300 dark:border-gray-800 max-w-lg mx-auto my-4" />
      <p className="text-gray-600 dark:text-gray-400 font-mono text-sm">
        The server encountered an internal error or misconfiguration and was unable to complete your request.
      </p>
      <p className="mt-6 text-xs text-gray-400 dark:text-gray-500 font-mono">
        nginx/1.24.0 (Ubuntu)
      </p>
    </div>
  );

  // standard Windows BSOD
  const renderWinBlue = () => (
    <div className="w-full h-screen bg-[#0078d7] text-white p-8 md:p-24 flex flex-col justify-between select-none" id="bsod-screen">
      <div className="max-w-3xl">
        <div className="text-[100px] md:text-[140px] font-light leading-none mb-8">:(</div>
        <h1 className="text-xl md:text-3xl font-light leading-relaxed mb-6">
          Your PC ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.
        </h1>
        <p className="text-lg font-light mb-8">
          {isRetrying ? '100% complete' : '0% complete'}
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="bg-white p-2 rounded">
            <div className="w-24 h-24 bg-black flex items-center justify-center text-xs font-bold text-white font-mono">
              GAME_HUB
            </div>
          </div>
          <div className="text-sm font-light">
            <p className="mb-2">For more information about this issue and possible fixes, visit:</p>
            <p className="font-semibold underline mb-4">https://windows.com/stopcode</p>
            <p className="text-xs opacity-80">If you call a support person, give them this info:</p>
            <p className="text-xs font-mono opacity-80">Stop code: SYSTEM_SERVICE_EXCEPTION (gamehub.sys)</p>
          </div>
        </div>
      </div>
      <div className="text-xs opacity-60">
        Try keyboard diagnostics using system overrides like <kbd className="bg-white/10 px-1 py-0.5 rounded border border-white/20">Alt + H</kbd>.
      </div>
    </div>
  );

  // Classic 404
  const renderClassic404 = () => (
    <div className="w-full text-center p-12 font-mono" id="classic-404-screen">
      <div className="text-8xl text-red-500 font-bold mb-4">404</div>
      <h1 className="text-2xl text-gray-800 dark:text-gray-200 font-bold uppercase tracking-wider mb-2">Page Not Found</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
        The requested URL was not found on this server. That’s all we know.
      </p>
      <div className="mt-8">
        <button
          onClick={handleRetry}
          className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
        >
          Return Home
        </button>
      </div>
    </div>
  );

  // GoGuardian School Login Screen (Image 1)
  const renderGoGuardian = () => (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#f8fafc] text-slate-800 font-sans p-6 select-none" id="goguardian-screen">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-transparent">
        
        {/* Left Side: School Keyhole Illustration & Kids */}
        <div className="relative flex flex-col items-center justify-center select-none">
          {/* Main Keyhole Mask Container */}
          <div className="relative w-72 h-96 flex items-center justify-center">
            {/* School Building inside keyhole layout */}
            <div className="absolute inset-0 bg-[#3b82f6]/10 rounded-full border-[10px] border-[#3b82f6] overflow-hidden flex flex-col justify-end">
              <div className="w-full h-full bg-[#e0f2fe] relative flex flex-col justify-between p-4 overflow-hidden">
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-12 h-16 bg-[#3b82f6]/20 rounded-t-full" />
                {/* Cloud & Flag */}
                <div className="absolute top-4 left-12 w-6 h-4 bg-white/80 rounded-full" />
                <div className="absolute top-10 right-8 w-12 h-6 bg-white/70 rounded-full" />
                <div className="w-1.5 h-12 bg-slate-400 absolute bottom-16 left-1/2 -translate-x-1/2" />
                <div className="w-8 h-5 bg-[#3b82f6] absolute bottom-28 left-1/2 -translate-x-1/2 rounded-sm" />
                
                {/* School House */}
                <div className="w-36 h-28 bg-[#f1f5f9] border-t-[8px] border-t-[#3b82f6] rounded-t-md mx-auto relative z-10 shadow-md">
                  <div className="w-8 h-10 bg-[#f97316] absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t flex items-center justify-center gap-1">
                    <div className="w-1 h-3 bg-white/40" />
                    <div className="w-1 h-3 bg-white/40" />
                  </div>
                  {/* Windows */}
                  <div className="w-4 h-6 bg-[#3b82f6]/20 absolute top-4 left-3 rounded-sm" />
                  <div className="w-4 h-6 bg-[#3b82f6]/20 absolute top-4 right-3 rounded-sm" />
                  {/* Clock */}
                  <div className="w-5 h-5 bg-white border border-[#3b82f6] rounded-full absolute -top-8 left-1/2 -translate-x-1/2 flex items-center justify-center text-[8px] font-bold text-slate-600">
                    L
                  </div>
                </div>
                {/* Winding Path */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-12 bg-[#22c55e]/25 rounded-t-full border-t border-white/40" />
              </div>
            </div>
          </div>

          {/* Teacher holding key on Left */}
          <div className="absolute -left-4 bottom-4 flex flex-col items-center">
            {/* Simple Vector Teacher */}
            <div className="w-12 h-12 bg-[#b45309] rounded-full" /> {/* Head */}
            <div className="w-14 h-32 bg-[#3b82f6] rounded-t-2xl relative flex flex-col items-center">
              {/* Giant key */}
              <div className="absolute -left-8 top-6 w-24 h-4 bg-slate-300 rounded border-y border-white">
                <div className="absolute -left-2 -top-2 w-8 h-8 rounded-full border-4 border-slate-300" />
                <div className="absolute right-2 top-4 w-2 h-4 bg-slate-300" />
                <div className="absolute right-5 top-4 w-2 h-4 bg-slate-300" />
              </div>
            </div>
            <div className="flex gap-4 mt-1">
              <div className="w-3.5 h-16 bg-slate-300 rounded" />
              <div className="w-3.5 h-16 bg-slate-300 rounded" />
            </div>
          </div>

          {/* Kid carrying key on Right */}
          <div className="absolute -right-6 bottom-4 flex flex-col items-center scale-90">
            <div className="w-10 h-10 bg-[#f59e0b] rounded-full" />
            <div className="w-12 h-24 bg-[#64748b] rounded-t-xl relative">
              <div className="absolute -left-12 top-4 w-24 h-3.5 bg-slate-300 rounded">
                <div className="absolute -right-2 -top-2 w-7 h-7 rounded-full border-3 border-slate-300" />
                <div className="absolute left-2 top-3 w-1.5 h-3.5 bg-slate-300" />
                <div className="absolute left-4 top-3 w-1.5 h-3.5 bg-slate-300" />
              </div>
            </div>
            <div className="flex gap-3 mt-1">
              <div className="w-3 h-12 bg-slate-300 rounded" />
              <div className="w-3 h-12 bg-slate-300 rounded" />
            </div>
          </div>

        </div>

        {/* Right Side: Login Frame Panel */}
        <div className="bg-white border border-slate-100 rounded-3xl p-10 md:p-12 shadow-xl text-center flex flex-col justify-center min-h-[380px]">
          <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">
            Login to continue
          </h2>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed max-w-xs mx-auto">
            Please log in with your school email and password.
          </p>

          <div className="mt-8 space-y-3.5 max-w-sm mx-auto w-full">
            {/* Google Sign In */}
            <button
              type="button"
              className="w-full flex items-center justify-center bg-[#0066cc] hover:bg-[#0052a3] text-white rounded font-medium border border-transparent shadow-sm select-none transition cursor-pointer"
              style={{ height: '46px' }}
            >
              <div className="bg-white flex items-center justify-center rounded-l border-r border-slate-200" style={{ width: '44px', height: '44px' }}>
                <svg className="w-5.5 h-5.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </div>
              <span className="flex-1 text-center font-sans font-semibold text-[15px] tracking-wide pl-2 pr-6">
                Login with Google
              </span>
            </button>

            {/* Azure / Microsoft Sign In */}
            <button
              type="button"
              className="w-full flex items-center bg-white hover:bg-slate-50 text-slate-600 rounded font-medium border border-slate-300 shadow-sm select-none transition cursor-pointer"
              style={{ height: '46px' }}
            >
              <div className="flex items-center justify-center" style={{ width: '44px', height: '44px' }}>
                <svg className="w-5.5 h-5.5" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M0 0h11v11H0z" />
                  <path fill="#80bb00" d="M12 0h11v11H12z" />
                  <path fill="#00a4ef" d="M0 12h11v11H0z" />
                  <path fill="#ffb900" d="M12 12h11v11H12z" />
                </svg>
              </div>
              <span className="flex-1 text-center font-sans font-medium text-[14px] text-[#5e5e5e] pr-6 pl-2">
                Login with Microsoft Azure AD
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  // Chrome Sad Tab "Aw, Snap!" Screen (Image 2)
  const renderSadTab = () => (
    <div className="w-full min-h-screen bg-[#f1f3f4] text-[#3c4043] flex flex-col p-12 select-none" id="sad-tab-screen">
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col justify-center text-left">
        
        {/* Sad Sheet Icon */}
        <div className="mb-6">
          <svg className="w-14 h-14 text-[#5f6368] opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 17c.5-1 1.5-2 3-2s2.5 1 3 2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="9" y1="9" x2="9.01" y2="9" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="15" y1="9" x2="15.01" y2="9" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 3v4a1 1 0 0 0 1 1h4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Chrome Header Text */}
        <h1 className="text-2xl font-semibold text-[#202124] tracking-tight">
          Aw, Snap!
        </h1>
        
        <p className="text-sm text-[#5f6368] mt-3 leading-relaxed max-w-xl font-sans">
          Something went wrong while displaying this webpage. To continue, reload or go to another page.
        </p>

        {/* Action Button Controls */}
        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-md bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium text-sm transition shadow-sm cursor-pointer select-none"
          >
            Reload
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 text-[#1a73e8] font-medium text-sm transition cursor-pointer select-none"
          >
            Details
          </button>
        </div>

        {/* Code metrics info list */}
        <div className="mt-12 border-t border-gray-300/60 pt-6">
          <p className="text-[11px] font-mono text-[#5f6368] uppercase tracking-wide">
            Error Code: RESULT_CODE_KILLED_BAD_MESSAGE
          </p>
        </div>

      </div>
    </div>
  );

  // Update tab title to match Chrome crash / error
  useEffect(() => {
    if (settings.errorType === 'sad-tab') {
      document.title = 'Aw, Snap!';
    } else if (settings.errorType === 'nxdomain') {
      document.title = 'Site can’t be reached';
    } else if (settings.errorType === 'server-error') {
      document.title = '500 Internal Server Error';
    } else if (settings.errorType === 'goguardian') {
      document.title = 'Blocked - GoGuardian';
    } else {
      document.title = 'Aw, Snap!';
    }
  }, [settings.errorType]);

  return (
    <div className={`relative min-h-screen w-full flex items-center justify-center overflow-hidden ${
      settings.errorType === 'goguardian' ? 'bg-[#f8fafc]' : 
      settings.errorType === 'sad-tab' ? 'bg-[#f1f3f4]' : 
      'bg-gray-50 dark:bg-[#0b0f19]'
    }`}>
      {/* Dynamic Error Content */}
      {settings.errorType === 'goguardian' && renderGoGuardian()}
      {settings.errorType === 'sad-tab' && renderSadTab()}
      {settings.errorType === 'nxdomain' && renderNxdomain()}
      {settings.errorType === 'server-error' && renderServerError()}
      {settings.errorType === 'win-blue' && renderWinBlue()}
      {settings.errorType === 'classic-404' && renderClassic404()}


      {/* Unlock Terminal Screen */}
      <AnimatePresence>
        {showUnlockModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-xl bg-gray-900 border border-gray-800 p-6 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-400" />
                  <span className="font-mono text-sm font-semibold tracking-wider uppercase text-gray-200">
                    Console Override Decryptor
                  </span>
                </div>
                <button
                  onClick={() => setShowUnlockModal(false)}
                  className="text-gray-400 hover:text-white text-sm font-mono"
                >
                  [ESC]
                </button>
              </div>

              <form onSubmit={handleUnlockSubmit} className="space-y-4">
                <p className="text-xs text-gray-400 font-mono">
                  ENTER SECURE DECRYPTION ACCESS PASSWORD TO INITIATE FULL-SCREEN VIRTUAL HUB DEPLOYMENT:
                </p>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter passphrase..."
                    autoFocus
                    className={`w-full bg-black/60 border ${
                      isError ? 'border-red-500 animate-shake' : 'border-gray-800 focus:border-emerald-500'
                    } rounded-lg py-3 px-4 font-mono text-emerald-400 placeholder-gray-600 focus:outline-none transition`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {isError && (
                  <p className="text-xs text-red-500 font-mono flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3" /> ACCESS DENIED: INVALID DECRYPTION PASSCODE.
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUnlockModal(false)}
                    className="flex-1 rounded-lg border border-gray-800 py-2.5 text-center text-xs font-mono font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 py-2.5 text-center text-xs font-mono font-medium text-white shadow-lg transition flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" /> DECRYPT_PORTAL
                  </button>
                </div>
              </form>

              {!settings.hideHint && (
                <div className="mt-6 border-t border-gray-800 pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowHint(!showHint)}
                    className="text-[11px] text-gray-500 hover:text-gray-400 flex items-center gap-1 font-mono"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> {showHint ? 'Hide override details' : 'Override details?'}
                  </button>
                  {showHint && (
                    <span className="text-[11px] font-mono text-emerald-500 bg-emerald-950/40 border border-emerald-900/50 px-2 py-0.5 rounded">
                      Default Passcode: <strong className="font-bold">play</strong>
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
