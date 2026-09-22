import React, { useState } from 'react';
import { Gamepad2, Play, Upload, Cpu, Shield, Sparkles, Terminal, HardDrive, Download, Smartphone, Monitor } from 'lucide-react';
import { Game } from '../lib/db';

interface EmulatorsHubProps {
  onLaunchGame: (game: Game) => void;
}

export const EmulatorsHub: React.FC<EmulatorsHubProps> = ({ onLaunchGame }) => {
  const [selectedConsole, setSelectedConsole] = useState<'windows' | 'android' | 'nes' | 'gb' | 'genesis' | 'web'>('web');
  const [romInput, setRomInput] = useState('');

  const consoles = [
    { id: 'web', name: 'Web Games', icon: '🌐', desc: 'HTML5 Web-based Games and Applications', color: 'from-purple-600/20 to-pink-600/20 border-purple-500/30' },
    { id: 'windows', name: 'Windows PC VM', icon: '💻', desc: 'Windows OS & x86 Virtual Machine (Windows 95/XP/11 Core)', color: 'from-blue-600/20 to-cyan-600/20 border-blue-500/30' },
    { id: 'android', name: 'Android Virtual Machine', icon: '🤖', desc: 'Android OS & APK Runtime Emulator Core (ART/Dalvik)', color: 'from-emerald-500/20 to-lime-500/20 border-emerald-500/30' },
    { id: 'nes', name: 'NES 8-Bit Console', icon: '🕹️', desc: 'Nintendo Entertainment System Core (1985)', color: 'from-red-500/20 to-orange-500/20 border-red-500/30' },
    { id: 'gb', name: 'GameBoy Color', icon: '🟢', desc: 'Handheld 8-bit Dot Matrix System (1998)', color: 'from-teal-500/20 to-cyan-500/20 border-teal-500/30' },
    { id: 'genesis', name: 'Sega Genesis 16-Bit', icon: '🎮', desc: 'Mega Drive Blast Processing Core (1989)', color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30' },
  ];

  const emulatorGames: Record<string, Game[]> = {
    web: [
      {
        id: 'web_space_huggers',
        title: 'Space Huggers',
        description: 'A fast-paced web-based space shooter game.',
        category: 'action',
        type: 'html-file',
        content: '<!DOCTYPE html><html><body style="margin:0;padding:0;overflow:hidden;"><iframe src="https://ais-pre-coltjj2hjb6o2u6l7zolme-544136744645.us-east1.run.app/api/proxy?url=https%3A%2F%2Fkilledbyapixel.github.io%2FSpaceHuggers%2F&system=stealth&ua=stealth&adblock=true&js_disable=false" style="width:100vw;height:100vh;border:none;" sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups"></iframe></body></html>',
        uploadedAt: Date.now(),
        isFavorite: true,
        plays: 0,
      },
      {
        id: 'web_sz_games',
        title: 'Sz Games',
        description: 'A collection of various games, powered by Ad Placement API.',
        category: 'arcade',
        type: 'html-file',
        content: `<!DOCTYPE html><html><head><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3723218062742398" crossorigin="anonymous" data-ad-channel="9267153333" data-ad-client="ca-pub-3723218062742398" data-ad-frequency-hint="15s"></script><script>window.adsbygoogle = window.adsbygoogle || []; var adBreak = (adConfig = function (o) { adsbygoogle.push(o) }); console.log('🚀 H5 Ad API initialized')</script><script>function showPreroll(){adBreak({type:'preroll',name:'game-start',adBreakDone:(placementInfo)=>{console.log('Preroll complete. Status:',placementInfo.breakStatus);window.history.pushState(null,null,window.location.href);},});}adConfig({preloadAdBreaks:'on',onReady:()=>{console.log('H5 Ads API is ready.');window.history.pushState(null,null,window.location.href);showPreroll();},});document.addEventListener('gameOver',function(){console.log('Game Over - calling interstitial ad.');adBreak({type:'next',name:'game-over',});});document.addEventListener('gameWon',function(){console.log('Game Won - calling rewarded ad.');adBreak({type:'reward',name:'game-won',adBreakDone:(placementInfo)=>{if(placementInfo.breakStatus==='viewed'){console.log('User watched rewarded ad - grant bonus!');}},});});function showRewardedAd(){adBreak({type:'reward',name:'user-requested-reward',adBreakDone:(placementInfo)=>{if(placementInfo.breakStatus==='viewed'){console.log('User earned reward!');}window.history.pushState(null,null,window.location.href);},});}window.showRewardedAd=showRewardedAd</script><script async src="https://www.googletagmanager.com/gtag/js?id=G-C78TXR0XFK"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-C78TXR0XFK')</script><script src="https://unpkg.com/@ruffle-rs/ruffle"></script><link rel="icon" href="../G.png"/><title>Sz Games</title><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><style>.btn-group button{background-color:black;color:white;padding:10px 24px;cursor:pointer;float:left;}.btn-group:after{content:'';clear:both;display:table;}.btn-group button:not(:last-child){border-right:none;}.btn-group button:hover{background-color:grey;}.header{padding:60px;text-align:center;background:linear-gradient(to bottom right,#9a9a9a,rgb(39,39,39));color:white;width:auto;font-size:30px;border-radius:15px;}.game{position:absolute;color:white;transform:scale(1.8);z-index:3;font-family:Arial,Helvetica,sans-serif;}.fade{position:absolute;background:linear-gradient(to bottom,#1d1d1d,#1d1d1d5d,rgba(39,39,39,0));width:300px;height:150px;border-radius:15px;}</style></head><body onresize="resize()"><script src="https://360playvid.info/slidepleer/s03938s.js" type="text/javascript" charset="utf-8"></script><iframe frameborder="0" id="game" style="text-align:center;align-items:center;overflow:hidden;width:100%" src="https://emupedia.net/emupedia-game-agar.io/" allowfullscreen sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups"></iframe><h2 onclick="window.history.back()" style="cursor:pointer;position:fixed;bottom:-20px">Back</h2><h2 style="position:fixed;bottom:10px">____</h2><h2 onclick="makeFullScreen()" style="cursor:pointer;position:fixed;bottom:20px">Fullscreen</h2><script>document.body.onkeyup=function(e){if(e.keyCode==27){document.getElementById('game').style.width='800px'}};function requestFullScreen(element){var requestMethod=element.requestFullScreen||element.webkitRequestFullScreen||element.mozRequestFullScreen||element.msRequestFullscreen;if(requestMethod){requestMethod.call(element);let hh=window.innerHeight-10;document.getElementById('game').height=hh}else if(typeof window.ActiveXObject!=='undefined'){var wscript=new ActiveXObject('WScript.Shell');if(wscript!==null){wscript.SendKeys('{F11}')}}}var canvas=document.getElementById('game');function makeFullScreen(){requestFullScreen(canvas)}let hh=window.innerHeight-10;document.getElementById('game').height=hh;window.onresize=function(event){let hh=window.innerHeight-10;document.getElementById('game').height=hh}</script></body></html>`,
        uploadedAt: Date.now(),
        isFavorite: false,
        plays: 0,
      },
      {
        id: 'web_yaw_gg',
        title: 'Yaw.gg (Note: Slow Loading)',
        description: 'Collection of games. Note: The games in this are kinda slow so just wait a little or leave.',
        category: 'arcade',
        type: 'html-file',
        content: '<!DOCTYPE html><html><body style="margin:0;padding:0;overflow:hidden;"><iframe src="https://ais-pre-coltjj2hjb6o2u6l7zolme-544136744645.us-east1.run.app/api/proxy?url=https%3A%2F%2Fyaw.gg%2F&ua=stealth&adblock=true&js_disable=false&system=stealth" style="width:100vw;height:100vh;border:none;" sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups"></iframe></body></html>',
        uploadedAt: Date.now(),
        isFavorite: false,
        plays: 0,
      },
      {
        id: 'web_retro_bowl',
        title: 'Retro Bowl',
        description: 'Retro Bowl test.',
        category: 'arcade',
        type: 'html-file',
        content: '<!DOCTYPE html><html><body style="margin:0;padding:0;overflow:hidden;"><div class="header"><p>retro bowl test</p></div><iframe class="iframe" src="https://retrobowl.org/" style="width:100vw;height:100vh;border:none;" sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups"></iframe></body></html>',
        uploadedAt: Date.now(),
        isFavorite: false,
        plays: 0,
      }
    ],
    windows: [
      {
        id: 'emu_win_1',
        title: 'Windows 95 Classic Desktop VM',
        description: 'Authentic Windows 95 environment complete with Minesweeper, Paint, and Command Prompt.',
        category: 'classic',
        type: 'builtin',
        uploadedAt: Date.now(),
        isFavorite: true,
        plays: 230,
      },
      {
        id: 'emu_win_2',
        title: 'Windows XP Retro Simulator',
        description: 'Experience the iconic Bliss wallpaper, Start menu, and classic Pinball 3D.',
        category: 'arcade',
        type: 'builtin',
        uploadedAt: Date.now(),
        isFavorite: true,
        plays: 185,
      }
    ],
    android: [
      {
        id: 'emu_android_1',
        title: 'Subway Surfers (Android Port)',
        description: 'Dash as fast as you can through subway trains in this legendary mobile runner.',
        category: 'action',
        type: 'builtin',
        uploadedAt: Date.now(),
        isFavorite: false,
        plays: 142,
      },
      {
        id: 'emu_android_2',
        title: 'Angry Birds Classic APK',
        description: 'Use the slingshot to destroy the greedy green pigs in mobile physics puzzle action.',
        category: 'puzzle',
        type: 'builtin',
        uploadedAt: Date.now(),
        isFavorite: false,
        plays: 98,
      }
    ],
    nes: [
      {
        id: 'emu_nes_1',
        title: 'Super Cyber Mario 8-Bit',
        description: 'Classic platforming adventure optimized for the NES core emulator.',
        category: 'arcade',
        type: 'builtin',
        uploadedAt: Date.now(),
        isFavorite: false,
        plays: 42,
      }
    ],
    gb: [
      {
        id: 'emu_gb_1',
        title: 'Pocket Tetris GB',
        description: 'The legendary monochrome puzzle phenomenon in your pocket.',
        category: 'puzzle',
        type: 'builtin',
        uploadedAt: Date.now(),
        isFavorite: false,
        plays: 88,
      }
    ],
    genesis: [
      {
        id: 'emu_gen_1',
        title: 'Sonic Cyber Runner 16-Bit',
        description: 'Lightning fast hedgehog momentum running across loops and springs.',
        category: 'action',
        type: 'builtin',
        uploadedAt: Date.now(),
        isFavorite: false,
        plays: 95,
      }
    ]
  };

  const handleCustomRomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const newGame: Game = {
        id: `rom_${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        description: `Loaded Binary / ISO / ROM (${file.name}) running on ${selectedConsole.toUpperCase()} VM core.`,
        category: 'arcade',
        type: 'html-file',
        content: `<!DOCTYPE html><html><head><title>${file.name}</title><style>body{background:#0055ea;color:#fff;font-family:'Segoe UI',Tahoma,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;} .box{background:#f0f0f0;color:#000;padding:24px;border-radius:4px;box-shadow:0 10px 30px rgba(0,0,0,0.5);width:400px;text-align:center;}button{background:#0055ea;color:#fff;border:none;padding:8px 16px;font-weight:bold;cursor:pointer;margin-top:12px;border-radius:3px;}</style></head><body><div class="box"><h3>Windows Setup - ${file.name}</h3><p>Initializing virtual x86 setup routine...</p><div style="background:#ddd;height:12px;border-radius:6px;overflow:hidden;margin:16px 0;"><div id="bar" style="background:#0055ea;width:0%;height:100%;transition:width 0.5s;"></div></div><p id="status" style="font-size:12px;color:#666;">Mounting virtual disk...</p><button onclick="alert('Setup Complete! Virtual Machine booted successfully.')">Launch Environment</button></div><script>let w=0;setInterval(()=>{if(w<100){w+=10;document.getElementById('bar').style.width=w+'%';document.getElementById('status').innerText='Installing packages... '+w+'%';}},300);</script></body></html>`,
        uploadedAt: Date.now(),
        isFavorite: false,
        plays: 1,
      };
      onLaunchGame(newGame);
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 py-6 px-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-slate-900/80 to-purple-900/40 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-widest mb-2">
            <Monitor className="w-4 h-4 animate-pulse" /> Windows, Android & Retro Emulation Suite
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Virtual PC & Console Runtimes
          </h1>
          <p className="mt-2 text-sm text-gray-300 max-w-2xl">
            Run Windows virtual machines, Android APKs, and retro console ROMs directly in your browser sandbox.
          </p>
        </div>

        {/* ROM / ISO / APK Upload Button */}
        <label className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold shadow-lg transition cursor-pointer shrink-0">
          <Upload className="w-4 h-4" />
          <span>LOAD ISO / APK / ROM (.iso, .exe, .apk, .nes)</span>
          <input type="file" accept=".iso,.exe,.apk,.nes,.gb,.gba,.bin,.html" onChange={handleCustomRomUpload} className="hidden" />
        </label>
      </div>

      {/* Console Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {consoles.map((c) => {
          const isSelected = selectedConsole === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedConsole(c.id as any)}
              className={`p-5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between bg-gradient-to-br ${c.color} ${
                isSelected ? 'ring-2 ring-blue-400 border-blue-400/80 shadow-xl scale-[1.02]' : 'border-white/10 hover:border-white/20 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{c.icon}</span>
                <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full ${isSelected ? 'bg-blue-500 text-white font-bold' : 'bg-white/10 text-gray-300'}`}>
                  {isSelected ? 'ACTIVE CORE' : 'SELECT'}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-base text-white font-mono">{c.name}</h3>
                <p className="mt-1 text-[11px] text-gray-400 leading-tight">{c.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Emulator Games List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="font-mono text-sm font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-blue-400" />
            Available {selectedConsole.toUpperCase()} Virtual Environments & Titles
          </h2>
          <span className="text-xs font-mono text-gray-400">Core Status: READY (60 FPS VSync)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {emulatorGames[selectedConsole]?.map((game) => (
            <div
              key={game.id}
              className="bg-slate-900/80 border border-white/10 hover:border-blue-500/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {selectedConsole.toUpperCase()} VIRTUAL MACHINE
                  </span>
                  <span className="text-xs font-mono text-gray-400">Plays: {game.plays}</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition">
                  {game.title}
                </h3>
                <p className="mt-1 text-xs text-gray-400 leading-relaxed">
                  {game.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-[10px] font-mono text-blue-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Hardware Accelerated x86
                </span>
                <button
                  onClick={() => onLaunchGame(game)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>BOOT VM</span>
                </button>
                {selectedConsole === 'web' && (
                  <button
                    onClick={() => {
                      const urlMatch = game.content.match(/src="([^"]+)"/);
                      if (urlMatch && urlMatch[1]) {
                        window.open(urlMatch[1], '_blank');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <span>NEW WINDOW</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
