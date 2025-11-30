import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import { MobKPI, FarmSummary } from '../../pages/sheep-sheet/types';
import { mobsApi } from '../../lib/api';

// Storage keys
const STORAGE_KEYS = {
  MOBS: 'farmData_mobs',
  SUMMARY: 'farmData_summary',
  PENDING_CHANGES: 'farmData_pendingChanges',
  LAST_SYNC: 'farmData_lastSync',
};

// Pending change type for offline edits
interface PendingChange {
  id: string;
  mobId: number;
  changes: Partial<MobKPI>;
  timestamp: number;
  retryCount: number;
}

// Context state type
interface FarmDataContextType {
  // Data
  mobs: MobKPI[];
  summary: FarmSummary;

  // Status
  isLoading: boolean;
  isInitialized: boolean;
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  error: string | null;

  // Pending changes
  pendingChanges: PendingChange[];
  pendingCount: number;

  // Actions
  getMobById: (id: number) => MobKPI | undefined;
  updateMob: (id: number, changes: Partial<MobKPI>) => Promise<void>;
  refreshData: () => Promise<void>;
  syncPendingChanges: () => Promise<{ success: number; failed: number }>;
}

const defaultSummary: FarmSummary = {
  total_mobs: 0,
  total_ewes: 0,
  avg_scanning_percent: 0,
  avg_marking_percent: 0,
  avg_weaning_percent: 0,
};

const FarmDataContext = createContext<FarmDataContextType | null>(null);

// Load data from localStorage
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn(`Failed to load ${key} from storage:`, e);
  }
  return defaultValue;
}

// Save data to localStorage
function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Failed to save ${key} to storage:`, e);
  }
}

export function FarmDataProvider({ children }: { children: ReactNode }) {
  // State
  const [mobs, setMobs] = useState<MobKPI[]>(() => loadFromStorage(STORAGE_KEYS.MOBS, []));
  const [summary, setSummary] = useState<FarmSummary>(() =>
    loadFromStorage(STORAGE_KEYS.SUMMARY, defaultSummary)
  );
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>(() =>
    loadFromStorage(STORAGE_KEYS.PENDING_CHANGES, [])
  );
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(() => {
    const stored = loadFromStorage<string | null>(STORAGE_KEYS.LAST_SYNC, null);
    return stored ? new Date(stored) : null;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [error, setError] = useState<string | null>(null);

  // Ref to track if initial load has been attempted
  const initialLoadAttempted = useRef(false);

  // Persist mobs to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      saveToStorage(STORAGE_KEYS.MOBS, mobs);
    }
  }, [mobs, isInitialized]);

  // Persist summary to localStorage
  useEffect(() => {
    if (isInitialized) {
      saveToStorage(STORAGE_KEYS.SUMMARY, summary);
    }
  }, [summary, isInitialized]);

  // Persist pending changes to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PENDING_CHANGES, pendingChanges);
  }, [pendingChanges]);

  // Persist last sync time
  useEffect(() => {
    if (lastSyncTime) {
      saveToStorage(STORAGE_KEYS.LAST_SYNC, lastSyncTime.toISOString());
    }
  }, [lastSyncTime]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      console.log('[FarmData] Back online');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('[FarmData] Gone offline');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch all data from API
  const refreshData = useCallback(async () => {
    console.log('[FarmData] Refreshing data from API...');
    setIsLoading(true);
    setError(null);

    try {
      // Fetch mobs and statistics in parallel
      const [mobsResponse, statsResponse] = await Promise.all([
        mobsApi.getAllMobs(),
        mobsApi.getFarmStatistics(),
      ]);

      const newMobs = mobsResponse.data || [];
      const newSummary: FarmSummary = {
        total_mobs: parseInt(statsResponse.data.total_mobs) || 0,
        total_ewes: parseInt(statsResponse.data.total_ewes) || 0,
        avg_scanning_percent: parseFloat(statsResponse.data.avg_scanning_percent) || 0,
        avg_marking_percent: parseFloat(statsResponse.data.avg_marking_percent) || 0,
        avg_weaning_percent: parseFloat(statsResponse.data.avg_weaning_percent) || 0,
      };

      setMobs(newMobs);
      setSummary(newSummary);
      setLastSyncTime(new Date());
      setIsInitialized(true);

      console.log(`[FarmData] Loaded ${newMobs.length} mobs from API`);
    } catch (err) {
      console.warn('[FarmData] API fetch failed:', err);
      setError('Unable to connect to server. Using cached data.');

      // If we have cached data, mark as initialized anyway
      if (mobs.length > 0) {
        setIsInitialized(true);
        console.log(`[FarmData] Using ${mobs.length} cached mobs`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [mobs.length]);

  // Initial data load
  useEffect(() => {
    if (!initialLoadAttempted.current) {
      initialLoadAttempted.current = true;

      // If we have cached data, show it immediately
      if (mobs.length > 0) {
        console.log(`[FarmData] Found ${mobs.length} cached mobs, showing immediately`);
        setIsInitialized(true);
        setIsLoading(false);
      }

      // Then try to refresh from API if online
      if (navigator.onLine) {
        refreshData();
      } else {
        setIsLoading(false);
        if (mobs.length === 0) {
          setError('No cached data available and currently offline.');
        }
      }
    }
  }, [mobs.length, refreshData]);

  // Sync all pending changes to server
  const syncPendingChanges = useCallback(async (): Promise<{
    success: number;
    failed: number;
  }> => {
    if (!isOnline || pendingChanges.length === 0 || isSyncing) {
      return { success: 0, failed: 0 };
    }

    console.log(`[FarmData] Syncing ${pendingChanges.length} pending changes...`);
    setIsSyncing(true);

    let success = 0;
    let failed = 0;
    const remainingChanges: PendingChange[] = [];

    for (const change of pendingChanges) {
      try {
        await mobsApi.updateMob(change.mobId, change.changes);
        success++;
        console.log(`[FarmData] Synced change for mob ${change.mobId}`);
      } catch (err) {
        console.warn(`[FarmData] Failed to sync change for mob ${change.mobId}:`, err);
        failed++;

        // Keep for retry if under max retries
        if (change.retryCount < 3) {
          remainingChanges.push({
            ...change,
            retryCount: change.retryCount + 1,
          });
        }
      }
    }

    setPendingChanges(remainingChanges);
    setIsSyncing(false);

    // Refresh data from server after successful syncs
    if (success > 0) {
      setLastSyncTime(new Date());
    }

    console.log(`[FarmData] Sync complete: ${success} success, ${failed} failed`);
    return { success, failed };
  }, [isOnline, pendingChanges, isSyncing]);

  // Auto-sync pending changes when coming back online
  useEffect(() => {
    if (isOnline && pendingChanges.length > 0 && !isSyncing) {
      console.log('[FarmData] Online with pending changes, initiating sync...');
      syncPendingChanges();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  // Get a single mob by ID from in-memory cache
  const getMobById = useCallback(
    (id: number): MobKPI | undefined => {
      return mobs.find((m) => m.mob_id === id);
    },
    [mobs]
  );

  // Update a mob (applies locally immediately, queues for sync)
  const updateMob = useCallback(
    async (id: number, changes: Partial<MobKPI>) => {
      console.log(`[FarmData] Updating mob ${id}:`, changes);

      // Apply changes to local state immediately (optimistic update)
      setMobs((currentMobs) =>
        currentMobs.map((mob) =>
          mob.mob_id === id ? { ...mob, ...changes, last_updated: new Date().toISOString() } : mob
        )
      );

      // If online, try to sync immediately
      if (isOnline) {
        try {
          await mobsApi.updateMob(id, changes);
          console.log(`[FarmData] Mob ${id} synced to server`);
          return;
        } catch (err) {
          console.warn(`[FarmData] Failed to sync mob ${id} to server, queueing:`, err);
        }
      }

      // Queue the change for later sync
      const pendingChange: PendingChange = {
        id: `${id}-${Date.now()}`,
        mobId: id,
        changes,
        timestamp: Date.now(),
        retryCount: 0,
      };

      setPendingChanges((current) => {
        // Merge with existing pending changes for same mob
        const existing = current.filter((c) => c.mobId !== id);
        const existingForMob = current.find((c) => c.mobId === id);

        if (existingForMob) {
          // Merge changes
          return [
            ...existing,
            {
              ...existingForMob,
              changes: { ...existingForMob.changes, ...changes },
              timestamp: Date.now(),
            },
          ];
        }

        return [...current, pendingChange];
      });
    },
    [isOnline]
  );

  const value: FarmDataContextType = {
    mobs,
    summary,
    isLoading,
    isInitialized,
    isOnline,
    isSyncing,
    lastSyncTime,
    error,
    pendingChanges,
    pendingCount: pendingChanges.length,
    getMobById,
    updateMob,
    refreshData,
    syncPendingChanges,
  };

  return <FarmDataContext.Provider value={value}>{children}</FarmDataContext.Provider>;
}

export function useFarmData() {
  const context = useContext(FarmDataContext);
  if (!context) {
    throw new Error('useFarmData must be used within a FarmDataProvider');
  }
  return context;
}
