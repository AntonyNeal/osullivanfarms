// =====================================================
// SheepSheet Calculation Utilities
// Auto-compute read-only fields from editable inputs
// =====================================================

import { MobEditableData, MobCalculatedData } from './types';

/**
 * Add days to a date string
 */
function addDays(dateStr: string | null | undefined, days: number): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

/**
 * Subtract days from a date string
 */
function subtractDays(dateStr: string | null | undefined, days: number): string | null {
  return addDays(dateStr, -days);
}

/**
 * Calculate days between two dates
 */
function daysBetween(
  startStr: string | null | undefined,
  endStr: string | null | undefined
): number | null {
  if (!startStr || !endStr) return null;
  const start = new Date(startStr);
  const end = new Date(endStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Safe division - returns null if divisor is 0 or null
 */
function safeDivide(
  numerator: number | null | undefined,
  denominator: number | null | undefined
): number | null {
  if (numerator == null || denominator == null || denominator === 0) return null;
  return numerator / denominator;
}

/**
 * Calculate percentage
 */
function calcPercent(
  numerator: number | null | undefined,
  denominator: number | null | undefined
): number | null {
  const result = safeDivide(numerator, denominator);
  if (result === null) return null;
  return Math.round(result * 1000) / 10; // Round to 1 decimal place
}

/**
 * Calculate all derived/computed fields from editable data
 * These fields are READ-ONLY and auto-calculated
 */
export function calculateDerivedFields(data: MobEditableData): MobCalculatedData {
  const calculated: MobCalculatedData = {};

  // =====================================================
  // PROJECTED DATES
  // =====================================================

  // joining_days = DAYS(joining_finish, joining_start)
  calculated.joining_days = daysBetween(data.joining_start, data.joining_finish);

  // prescribed_scanning_date = joining_finish + 42 days
  calculated.prescribed_scanning_date = addDays(data.joining_finish, 42);

  // lambing_start = joining_start + 147 days
  calculated.lambing_start = addDays(data.joining_start, 147);

  // lambing_end = joining_finish + 147 days
  calculated.lambing_end = addDays(data.joining_finish, 147);

  // pre_lamber_vaccine_date = lambing_start - 42 days
  calculated.pre_lamber_vaccine_date = subtractDays(calculated.lambing_start, 42);

  // prescribed_marking_date = lambing_end + 14 days
  calculated.prescribed_marking_date = addDays(calculated.lambing_end, 14);

  // prescribed_weaning_date = lambing_start + 77 days
  calculated.prescribed_weaning_date = addDays(calculated.lambing_start, 77);

  // =====================================================
  // PERFORMANCE KPIs
  // =====================================================

  // Total lambs marked = wethers_terminals + ewe_lambs
  const totalLambsMarked = (data.wethers_terminals || 0) + (data.ewe_lambs || 0);

  // percent_marked = (wethers_terminals + ewe_lambs) / total_ewe_count
  calculated.percent_marked = calcPercent(totalLambsMarked, data.total_ewe_count);

  // percent_marked_to_joined = (wethers_terminals + ewe_lambs) / ewe_count
  calculated.percent_marked_to_joined = calcPercent(totalLambsMarked, data.ewe_count);

  // percent_marked_to_scanned = (wethers_terminals + ewe_lambs) / in_lamb
  calculated.percent_marked_to_scanned = calcPercent(totalLambsMarked, data.in_lamb);

  // ewes_lost_scanning_to_marking = in_lamb - total_ewe_count
  if (data.in_lamb != null && data.total_ewe_count != null) {
    calculated.ewes_lost_scanning_to_marking = data.in_lamb - data.total_ewe_count;
  }

  // gross_annual_culls = cull_ewe_count + dry + dry_ewes
  const cullCount = data.cull_ewe_count || 0;
  const dryCount = data.dry || 0;
  const dryEwesCount = data.dry_ewes || 0;
  if (cullCount > 0 || dryCount > 0 || dryEwesCount > 0) {
    calculated.gross_annual_culls = cullCount + dryCount + dryEwesCount;
  }

  // sale_lambs_remaining = wethers_terminals - lambs_sold
  if (data.wethers_terminals != null && data.lambs_sold != null) {
    calculated.sale_lambs_remaining = data.wethers_terminals - data.lambs_sold;
  }

  return calculated;
}

/**
 * Format a date for display
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format a percentage for display
 */
export function formatPercent(value: number | null | undefined): string {
  if (value == null) return '-';
  return `${value.toFixed(1)}%`;
}

/**
 * Format a number for display
 */
export function formatNumber(value: number | null | undefined): string {
  if (value == null) return '-';
  return value.toLocaleString();
}
