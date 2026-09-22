/**
 * IndexedDB storage layer for GameHub
 * Stores user-uploaded HTML games, third-party installer files, and configurations.
 */

export interface Game {
  id: string;
  title: string;
  description: string;
  category: 'arcade' | 'puzzle' | 'action' | 'classic' | 'custom';
  type: 'builtin' | 'html-file' | 'url';
  content?: string; // HTML content for local custom games
  url?: string; // external URL if type is 'url'
  fileSize?: number;
  uploadedAt: number;
  isFavorite: boolean;
  plays: number;
}

export interface FileItem {
  id: string;
  name: string;
  extension: string;
  size: number;
  blob: Blob;
  uploadedAt: number;
}

export interface HubSettings {
  passcode: string;
  errorType: 'nxdomain' | 'server-error' | 'win-blue' | 'classic-404' | 'goguardian' | 'sad-tab';
  hideHint: boolean;
}

const DB_NAME = 'GameHub_Database';
const DB_VERSION = 1;

let dbInstance: IDBDatabase | null = null;

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Failed to open database');
      reject(request.error);
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      
      // Store custom games
      if (!db.objectStoreNames.contains('games')) {
        db.createObjectStore('games', { keyPath: 'id' });
      }

      // Store installation files and other generic files
      if (!db.objectStoreNames.contains('files')) {
        db.createObjectStore('files', { keyPath: 'id' });
      }

      // Store settings and persistent credentials
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings');
      }
    };
  });
}

// GAMES METHODS

export async function getCustomGames(): Promise<Game[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('games', 'readonly');
    const store = transaction.objectStore('games');
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result || []);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function saveCustomGame(game: Game): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('games', 'readwrite');
    const store = transaction.objectStore('games');
    const request = store.put(game);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function deleteCustomGame(id: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('games', 'readwrite');
    const store = transaction.objectStore('games');
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// FILES & INSTALLERS METHODS

export async function getFiles(): Promise<FileItem[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('files', 'readonly');
    const store = transaction.objectStore('files');
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result || []);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function saveFile(file: FileItem): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('files', 'readwrite');
    const store = transaction.objectStore('files');
    const request = store.put(file);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function deleteFile(id: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('files', 'readwrite');
    const store = transaction.objectStore('files');
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// SETTINGS METHODS

const SETTINGS_KEY = 'global_settings';

const DEFAULT_SETTINGS: HubSettings = {
  passcode: 'play',
  errorType: 'sad-tab',
  hideHint: false,
};

export async function getSettings(): Promise<HubSettings> {
  const db = await initDB();
  return new Promise((resolve) => {
    const transaction = db.transaction('settings', 'readonly');
    const store = transaction.objectStore('settings');
    const request = store.get(SETTINGS_KEY);

    request.onsuccess = () => {
      resolve(request.result || DEFAULT_SETTINGS);
    };

    request.onerror = () => {
      resolve(DEFAULT_SETTINGS);
    };
  });
}

export async function saveSettings(settings: HubSettings): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('settings', 'readwrite');
    const store = transaction.objectStore('settings');
    const request = store.put(settings, SETTINGS_KEY);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}
