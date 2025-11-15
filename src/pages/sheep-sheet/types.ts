// =====================================================
// SheepSheet Type Definitions
// Farm Management CRUD Application
// =====================================================

// =====================================================
// LOOKUP/REFERENCE TYPES
// =====================================================

export interface Breed {
  breed_id: number;
  breed_name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Zone {
  zone_id: number;
  zone_name: string;
  region?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Team {
  team_id: number;
  team_name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StatusType {
  status_id: number;
  status_name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BreedingStage {
  stage_id: number;
  stage_name: string;
  stage_order: number;
  description?: string;
  typical_start_month?: number;
  typical_end_month?: number;
  created_at: string;
}

// =====================================================
// CORE ENTITY TYPES
// =====================================================

export interface Mob {
  mob_id: number;
  mob_name?: string;
  breed_id: number;
  status_id: number;
  zone_id: number;
  team_id: number;
  current_stage_id: number;
  current_location?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  deleted_at?: string | null;
}

// =====================================================
// BREEDING CYCLE DATA TYPES
// =====================================================

export interface JoiningData {
  joining_id: number;
  mob_id: number;
  expected_start_date?: string | null;
  expected_end_date?: string | null;
  actual_start_date?: string | null;
  actual_end_date?: string | null;
  ewes_joined?: number | null;
  rams_in?: number | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface ScanningData {
  scanning_id: number;
  mob_id: number;
  expected_date?: string | null;
  actual_date?: string | null;
  total_ewes_scanned?: number | null;
  in_lamb?: number | null;
  dry?: number | null;
  twins?: number | null;
  singles?: number | null;
  scanning_percent?: number | null; // Auto-calculated
  scanner_name?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface LambingData {
  lambing_id: number;
  mob_id: number;
  expected_start_date?: string | null;
  expected_end_date?: string | null;
  actual_start_date?: string | null;
  actual_end_date?: string | null;
  total_ewes?: number | null;
  wet_ewes?: number | null;
  dry_ewes?: number | null;
  lambs_born_alive?: number | null;
  lambs_born_dead?: number | null;
  lamb_survival_percent?: number | null; // Auto-calculated
  notes?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface MarkingData {
  marking_id: number;
  mob_id: number;
  expected_date?: string | null;
  actual_date?: string | null;
  wethers?: number | null;
  ewe_lambs?: number | null;
  rams?: number | null;
  lambs_marked_total?: number | null; // Auto-calculated
  percent_marked_to_joined?: number | null; // Auto-calculated
  percent_marked_to_scanned?: number | null; // Auto-calculated
  notes?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface WeaningData {
  weaning_id: number;
  mob_id: number;
  expected_date?: string | null;
  actual_date?: string | null;
  lambs_weaned?: number | null;
  ewe_lambs_weaned?: number | null;
  wether_lambs_weaned?: number | null;
  avg_weaning_weight_kg?: number | null;
  percent_weaned_to_joined?: number | null; // Auto-calculated
  percent_weaned_to_marked?: number | null; // Auto-calculated
  notes?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// =====================================================
// COMPOSITE/VIEW TYPES
// =====================================================

export interface MobKPI {
  // Core mob info
  mob_id: number;
  mob_name?: string;
  breed_name: string;
  status_name: string;
  zone_name: string;
  team_name: string;
  current_stage: string;
  current_location?: string;

  // Joining data
  ewes_joined?: number | null;
  rams_in?: number | null;
  joining_date?: string | null;

  // Scanning data
  scanning_date?: string | null;
  in_lamb?: number | null;
  dry?: number | null;
  twins?: number | null;
  singles?: number | null;
  scanning_percent?: number | null;

  // Lambing data
  wet_ewes?: number | null;
  lambs_born_alive?: number | null;
  lamb_survival_percent?: number | null;

  // Marking data
  marking_date?: string | null;
  wethers?: number | null;
  ewe_lambs?: number | null;
  lambs_marked_total?: number | null;
  percent_marked_to_joined?: number | null;
  percent_marked_to_scanned?: number | null;

  // Weaning data
  weaning_date?: string | null;
  lambs_weaned?: number | null;
  percent_weaned_to_joined?: number | null;
  percent_weaned_to_marked?: number | null;
  avg_weaning_weight_kg?: number | null;

  // Metadata
  is_active: boolean;
  last_updated: string;
}

export interface FarmSummary {
  total_mobs: number;
  total_ewes?: number | null;
  avg_scanning_percent?: number | null;
  avg_marking_percent?: number | null;
  avg_weaning_percent?: number | null;
}

// =====================================================
// FORM/INPUT TYPES
// =====================================================

export interface MobFormData {
  mob_name?: string;
  breed_id: number;
  status_id: number;
  zone_id: number;
  team_id: number;
  current_stage_id: number;
  current_location?: string;
}

export interface JoiningFormData {
  expected_start_date?: string;
  expected_end_date?: string;
  actual_start_date?: string;
  actual_end_date?: string;
  ewes_joined?: number;
  rams_in?: number;
  notes?: string;
}

export interface ScanningFormData {
  expected_date?: string;
  actual_date?: string;
  total_ewes_scanned?: number;
  in_lamb?: number;
  dry?: number;
  twins?: number;
  singles?: number;
  scanner_name?: string;
  notes?: string;
}

export interface MarkingFormData {
  expected_date?: string;
  actual_date?: string;
  wethers?: number;
  ewe_lambs?: number;
  rams?: number;
  notes?: string;
}

export interface WeaningFormData {
  expected_date?: string;
  actual_date?: string;
  lambs_weaned?: number;
  ewe_lambs_weaned?: number;
  wether_lambs_weaned?: number;
  avg_weaning_weight_kg?: number;
  notes?: string;
}

// =====================================================
// FILTER TYPES
// =====================================================

export interface MobFilters {
  breed_ids?: number[];
  zone_ids?: number[];
  team_ids?: number[];
  status_ids?: number[];
  stage_ids?: number[];
  search?: string;
  min_scanning_percent?: number;
  max_scanning_percent?: number;
  only_active?: boolean;
}

// =====================================================
// OFFLINE SYNC TYPES
// =====================================================

export interface SyncQueueItem {
  sync_id?: number;
  device_id: string;
  operation_type: 'INSERT' | 'UPDATE' | 'DELETE';
  table_name: string;
  record_id?: number;
  payload: Record<string, unknown>;
  client_timestamp: string;
  sync_status: 'pending' | 'synced' | 'conflict' | 'failed';
  conflict_details?: string;
  retry_count?: number;
  last_error?: string;
}

export interface SyncStatus {
  is_online: boolean;
  last_sync: string | null;
  pending_changes: number;
  conflicts: number;
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// =====================================================
// UI/STATE TYPES
// =====================================================

export type ViewMode = 'list' | 'grid' | 'scoreboard';
export type SortField = keyof MobKPI;
export type SortDirection = 'asc' | 'desc';

export interface TableState {
  sortField: SortField;
  sortDirection: SortDirection;
  page: number;
  per_page: number;
}

export type MobDetailTab =
  | 'overview'
  | 'joining'
  | 'scanning'
  | 'lambing'
  | 'marking'
  | 'weaning'
  | 'history';

// =====================================================
// AUDIT/HISTORY TYPES
// =====================================================

export interface AuditLog {
  audit_id: number;
  table_name: string;
  record_id: number;
  action_type: 'INSERT' | 'UPDATE' | 'DELETE';
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  changed_by?: string;
  changed_at: string;
  client_timestamp?: string;
  sync_status: string;
  device_id?: string;
}

// =====================================================
// CALCULATION HELPERS
// =====================================================

export interface CalculatedPercentages {
  scanning_percent: number | null;
  percent_marked_to_joined: number | null;
  percent_marked_to_scanned: number | null;
  lamb_survival_percent: number | null;
  percent_weaned_to_joined: number | null;
  percent_weaned_to_marked: number | null;
}

// =====================================================
// CONSTANTS
// =====================================================

export const BREEDING_STAGES = {
  JOINING: 1,
  SCANNING: 2,
  LAMBING: 3,
  MARKING: 4,
  WEANING: 5,
} as const;

export const SYNC_STATUS = {
  PENDING: 'pending',
  SYNCED: 'synced',
  CONFLICT: 'conflict',
  FAILED: 'failed',
} as const;

export const OPERATION_TYPE = {
  INSERT: 'INSERT',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
} as const;
