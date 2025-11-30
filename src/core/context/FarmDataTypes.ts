import { createContext } from 'react';
import { MobKPI, FarmSummary } from '../../pages/sheep-sheet/types';

// Pending change type for offline edits
export interface PendingChange {
  id: string;
  mobId: number;
  changes: Partial<MobKPI>;
  timestamp: number;
  retryCount: number;
}

// Context state type
export interface FarmDataContextType {
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

export const FarmDataContext = createContext<FarmDataContextType | null>(null);
