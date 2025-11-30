// =====================================================
// SheepSheet Offline Queue
// Store edits locally when offline, sync when online
// =====================================================

import { MobEditableData, OfflineEdit } from './types';

const STORAGE_KEY = 'sheepsheet_offline_queue';
const MAX_RETRIES = 3;

/**
 * Generate a unique ID for an offline edit
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all pending offline edits from localStorage
 */
export function getOfflineQueue(): OfflineEdit[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading offline queue:', error);
    return [];
  }
}

/**
 * Save the offline queue to localStorage
 */
function saveOfflineQueue(queue: OfflineEdit[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Error saving offline queue:', error);
  }
}

/**
 * Add an edit to the offline queue
 */
export function queueOfflineEdit(mob_id: number, changes: Partial<MobEditableData>): OfflineEdit {
  const queue = getOfflineQueue();

  // Check if there's already a pending edit for this mob
  const existingIndex = queue.findIndex((edit) => edit.mob_id === mob_id && !edit.synced);

  const edit: OfflineEdit = {
    id: generateId(),
    mob_id,
    changes,
    timestamp: new Date().toISOString(),
    synced: false,
    retryCount: 0,
  };

  if (existingIndex >= 0) {
    // Merge changes with existing edit
    queue[existingIndex] = {
      ...queue[existingIndex],
      changes: { ...queue[existingIndex].changes, ...changes },
      timestamp: edit.timestamp,
    };
  } else {
    queue.push(edit);
  }

  saveOfflineQueue(queue);
  return edit;
}

/**
 * Mark an edit as synced
 */
export function markEditSynced(editId: string): void {
  const queue = getOfflineQueue();
  const index = queue.findIndex((edit) => edit.id === editId);

  if (index >= 0) {
    queue[index].synced = true;
    saveOfflineQueue(queue);
  }
}

/**
 * Mark an edit as failed with error
 */
export function markEditFailed(editId: string, error: string): void {
  const queue = getOfflineQueue();
  const index = queue.findIndex((edit) => edit.id === editId);

  if (index >= 0) {
    queue[index].retryCount++;
    queue[index].lastError = error;
    saveOfflineQueue(queue);
  }
}

/**
 * Remove synced edits from the queue
 */
export function clearSyncedEdits(): void {
  const queue = getOfflineQueue();
  const pending = queue.filter((edit) => !edit.synced);
  saveOfflineQueue(pending);
}

/**
 * Remove edits that have exceeded max retries
 */
export function clearFailedEdits(): OfflineEdit[] {
  const queue = getOfflineQueue();
  const failed = queue.filter((edit) => edit.retryCount >= MAX_RETRIES);
  const remaining = queue.filter((edit) => edit.retryCount < MAX_RETRIES);
  saveOfflineQueue(remaining);
  return failed;
}

/**
 * Get count of pending (unsynced) edits
 */
export function getPendingCount(): number {
  const queue = getOfflineQueue();
  return queue.filter((edit) => !edit.synced && edit.retryCount < MAX_RETRIES).length;
}

/**
 * Get pending edits ready for sync
 */
export function getPendingEdits(): OfflineEdit[] {
  const queue = getOfflineQueue();
  return queue.filter((edit) => !edit.synced && edit.retryCount < MAX_RETRIES);
}

/**
 * Check if we're online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Sync all pending edits to the server
 */
export async function syncOfflineEdits(
  syncFn: (mob_id: number, changes: Partial<MobEditableData>) => Promise<void>
): Promise<{ success: number; failed: number }> {
  const pending = getPendingEdits();
  let success = 0;
  let failed = 0;

  for (const edit of pending) {
    try {
      await syncFn(edit.mob_id, edit.changes);
      markEditSynced(edit.id);
      success++;
    } catch (error) {
      markEditFailed(edit.id, error instanceof Error ? error.message : 'Unknown error');
      failed++;
    }
  }

  // Clean up synced edits
  clearSyncedEdits();

  return { success, failed };
}

/**
 * Hook to listen for online/offline events
 */
export function setupOnlineListener(onOnline: () => void, onOffline: () => void): () => void {
  const handleOnline = () => {
    console.log('[OfflineQueue] Back online');
    onOnline();
  };

  const handleOffline = () => {
    console.log('[OfflineQueue] Gone offline');
    onOffline();
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}
