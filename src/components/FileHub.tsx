import React, { useState, useRef } from 'react';
import { Upload, File, HardDrive, Download, Trash2, ShieldCheck, Check, AlertCircle, FileCode, Archive } from 'lucide-react';
import { FileItem, Game } from '../lib/db';

interface FileHubProps {
  files: FileItem[];
  onUploadFile: (file: FileItem) => void;
  onRegisterCustomGame: (game: Game) => void;
  onDeleteFile: (id: string) => void;
  searchQuery: string;
}

export const FileHub: React.FC<FileHubProps> = ({
  files,
  onUploadFile,
  onRegisterCustomGame,
  onDeleteFile,
  searchQuery,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Custom Game form state when HTML is uploaded
  const [pendingHtmlGame, setPendingHtmlGame] = useState<{ name: string; content: string; size: number } | null>(null);
  const [gameTitle, setGameTitle] = useState('');
  const [gameDesc, setGameDesc] = useState('');
  const [gameCategory, setGameCategory] = useState<'arcade' | 'puzzle' | 'action' | 'classic' | 'custom'>('custom');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // Calculate total IndexedDB space used
  const totalUsedBytes = files.reduce((sum, f) => sum + f.size, 0);
  const formattedSpace = formatSize(totalUsedBytes);

  const processFile = async (file: File) => {
    setUploadSuccess(null);
    setErrorMessage(null);

    // Limit to 60MB for stable IndexedDB client-side execution in general browsers
    const LIMIT_MB = 60;
    if (file.size > LIMIT_MB * 1024 * 1024) {
      setErrorMessage(`File exceeds the safe ${LIMIT_MB}MB local cache limit. Choose a smaller installer or code package.`);
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || '';

    // If it's an HTML file, intercept to register as playable arcade game
    if (extension === 'html' || extension === 'htm') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setPendingHtmlGame({
          name: file.name,
          content: text,
          size: file.size,
        });
        setGameTitle(file.name.replace(/\.[^/.]+$/, "")); // clean extension
        setGameDesc("A custom HTML game compiled inside local terminal sandbox.");
      };
      reader.onerror = () => {
        setErrorMessage('Failed to read internal HTML game source code.');
      };
      reader.readAsText(file);
      return;
    }

    // Otherwise, store as general Installer / File Item
    const fileItem: FileItem = {
      id: crypto.randomUUID(),
      name: file.name,
      extension: extension.toUpperCase(),
      size: file.size,
      blob: file,
      uploadedAt: Date.now(),
    };

    try {
      await onUploadFile(fileItem);
      setUploadSuccess(`Successfully crypt-cached "${file.name}" offline.`);
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch (err) {
      setErrorMessage('Could not write binary data to local repository.');
    }
  };

  const handleHtmlGameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingHtmlGame) return;

    const newGame: Game = {
      id: crypto.randomUUID(),
      title: gameTitle || pendingHtmlGame.name,
      description: gameDesc || 'User cataloged game.',
      category: gameCategory,
      type: 'html-file',
      content: pendingHtmlGame.content,
      fileSize: pendingHtmlGame.size,
      uploadedAt: Date.now(),
      isFavorite: false,
      plays: 0,
    };

    try {
      await onRegisterCustomGame(newGame);
      setPendingHtmlGame(null);
      setUploadSuccess(`Successfully cataloged "${newGame.title}" as playable custom game.`);
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch (err) {
      setErrorMessage('Failed to archive custom game assets.');
    }
  };

  // Drag-and-drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Direct offline download trigger
  const handleDownloadFile = (item: FileItem) => {
    const url = URL.createObjectURL(item.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getExtensionColor = (ext: string) => {
    switch (ext) {
      case 'EXE': return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      case 'APK': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'ZIP':
      case 'RAR':
      case '7Z': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'PDF': return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'PNG':
      case 'JPG': return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      default: return 'bg-slate-500/10 border-slate-500/20 text-slate-400';
    }
  };

  const filteredFiles = files.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.extension.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      
      {/* Upper Grid: Upload Dropzone & Storage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Upload Dropzone Card */}
        <div className="md:col-span-2 bg-slate-900/40 border border-white/5 rounded-xl p-6 flex flex-col justify-between">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4 select-none">
            <Upload className="w-5 h-5 text-emerald-400" />
            <span className="font-mono text-sm font-semibold text-white uppercase tracking-wider">
              Offline Cache Repository
            </span>
          </div>

          <form
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onSubmit={(e) => e.preventDefault()}
            onClick={triggerFileSelect}
            className={`flex-1 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[160px] ${
              dragActive
                ? 'border-emerald-400 bg-emerald-500/5'
                : 'border-white/10 hover:border-emerald-500/40 hover:bg-white/5'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            
            <File className="w-10 h-10 text-gray-500 mb-3 group-hover:text-emerald-400" />
            <p className="text-sm text-gray-300 font-medium">
              Drag & drop any file, installer, or HTML code
            </p>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed font-mono">
              Supports .EXE, .APK, .ZIP, etc. up to 60MB.<br />
              <strong className="text-emerald-400 font-normal">HTML games automatically convert to playable apps.</strong>
            </p>
          </form>

          {/* Status logs */}
          {uploadSuccess && (
            <div className="mt-4 p-3 bg-emerald-950/20 border border-emerald-900/45 rounded-lg text-xs text-emerald-400 font-mono flex items-center gap-2">
              <Check className="w-4 h-4" /> {uploadSuccess}
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 p-3 bg-red-950/20 border border-red-900/45 rounded-lg text-xs text-red-400 font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {errorMessage}
            </div>
          )}
        </div>

        {/* Space Stats Card */}
        <div className="bg-slate-900/40 border border-white/5 rounded-xl p-6 flex flex-col justify-between select-none">
          <div>
            <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
              <HardDrive className="w-5 h-5 text-emerald-400" />
              <span className="font-mono text-sm font-semibold text-white uppercase tracking-wider">
                System Storage
              </span>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed font-mono">
              Secure client-side database partition is isolated inside your browser's IndexedDB. No server synchronizations occur, ensuring complete file privacy.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 font-mono">
            <div className="flex justify-between items-end text-xs mb-1.5">
              <span className="text-gray-500">USED CAPACITY</span>
              <span className="text-white font-bold">{formattedSpace}</span>
            </div>
            
            {/* Visual Progress Bar */}
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                style={{ width: `${Math.min(100, (totalUsedBytes / (500 * 1024 * 1024)) * 100)}%` }}
                className="h-full bg-emerald-500"
              />
            </div>
            
            <div className="flex justify-between text-[10px] text-gray-500 mt-1.5">
              <span>0 B</span>
              <span>500 MB Safe Limit</span>
            </div>
          </div>
        </div>
      </div>

      {/* HTML Game Registrar Modal Form Overlay */}
      {pendingHtmlGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-800 mb-4 text-left select-none">
              <FileCode className="w-5 h-5 text-pink-400" />
              <span className="font-mono text-sm font-semibold text-white uppercase tracking-wider">
                Configure HTML Sandbox Game
              </span>
            </div>

            <form onSubmit={handleHtmlGameSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Game Title</label>
                <input
                  type="text"
                  required
                  value={gameTitle}
                  onChange={(e) => setGameTitle(e.target.value)}
                  placeholder="e.g. Flappy Bird Elite"
                  className="w-full bg-black/60 border border-gray-800 focus:border-pink-500 rounded-lg p-2.5 font-mono text-sm text-pink-400 placeholder-gray-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Short Description</label>
                <textarea
                  value={gameDesc}
                  onChange={(e) => setGameDesc(e.target.value)}
                  rows={2}
                  placeholder="Add some details..."
                  className="w-full bg-black/60 border border-gray-800 focus:border-pink-500 rounded-lg p-2.5 font-mono text-sm text-gray-300 placeholder-gray-600 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Arcade Category</label>
                <select
                  value={gameCategory}
                  onChange={(e) => setGameCategory(e.target.value as any)}
                  className="w-full bg-black/60 border border-gray-800 focus:border-pink-500 rounded-lg p-2.5 font-mono text-sm text-gray-300 focus:outline-none"
                >
                  <option value="arcade">Arcade Game</option>
                  <option value="puzzle">Puzzle System</option>
                  <option value="action">Action Matrix</option>
                  <option value="classic">Classic Retro</option>
                  <option value="custom">Custom Sandbox</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setPendingHtmlGame(null)}
                  className="flex-1 rounded-lg border border-gray-800 py-2.5 text-center text-xs font-mono text-gray-400 hover:bg-gray-800 transition cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-pink-600 hover:bg-pink-700 py-2.5 text-center text-xs font-mono text-white font-bold transition cursor-pointer"
                >
                  SAVE_GAME
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stored Installer / Files Listing */}
      <div className="bg-slate-900/40 border border-white/5 rounded-xl p-6">
        <div className="border-b border-white/5 pb-3 mb-4 select-none">
          <span className="font-mono text-sm font-semibold text-white uppercase tracking-wider">
            Cached Executables & Installers ({filteredFiles.length})
          </span>
        </div>

        {filteredFiles.length === 0 ? (
          <div className="py-12 text-center text-gray-500 font-mono text-xs select-none">
            {searchQuery ? 'No cached files match current filters.' : 'Repository is empty. Upload setup files or zip archives.'}
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredFiles.map((item) => (
              <div
                key={item.id}
                className="py-3.5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className={`px-2 py-1 rounded border font-mono text-[10px] font-bold select-none shrink-0 ${getExtensionColor(item.extension)}`}>
                    .{item.extension}
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-medium text-white truncate" title={item.name}>
                      {item.name}
                    </p>
                    <p className="text-[10px] font-mono text-gray-500 mt-0.5">
                      ARCHIVED {new Date(item.uploadedAt).toLocaleDateString()} • {formatSize(item.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Download button */}
                  <button
                    onClick={() => handleDownloadFile(item)}
                    title="Retrieve file offline"
                    className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => onDeleteFile(item.id)}
                    title="Purge local cache"
                    className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 text-red-400 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
