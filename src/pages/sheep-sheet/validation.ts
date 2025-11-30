// =====================================================
// SheepSheet Validation Utilities
// Validate editable fields before saving
// =====================================================

import { MobEditableData, ValidationResult, ValidationError } from './types';

/**
 * Check if a date string is valid
 */
function isValidDate(dateStr: string | null | undefined): boolean {
  if (!dateStr) return true; // Empty is valid (optional field)
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

/**
 * Check if a number is non-negative
 */
function isNonNegative(value: number | null | undefined): boolean {
  if (value == null) return true; // Empty is valid (optional field)
  return value >= 0;
}

/**
 * Compare two dates
 * Returns true if date1 <= date2, or if either is null
 */
function dateIsBeforeOrEqual(
  date1: string | null | undefined,
  date2: string | null | undefined
): boolean {
  if (!date1 || !date2) return true;
  return new Date(date1) <= new Date(date2);
}

/**
 * Validate all editable mob data
 */
export function validateMobData(data: MobEditableData): ValidationResult {
  const errors: ValidationError[] = [];

  // =====================================================
  // DATE VALIDATIONS
  // =====================================================

  // All dates must be valid format
  const dateFields: Array<{ field: keyof MobEditableData; label: string }> = [
    { field: 'shearing_date', label: 'Shearing Date' },
    { field: 'joining_start', label: 'Joining Start' },
    { field: 'joining_finish', label: 'Joining Finish' },
    { field: 'actual_scanning_date', label: 'Scanning Date' },
    { field: 'actual_marking_date', label: 'Marking Date' },
    { field: 'weaning_date', label: 'Weaning Date' },
  ];

  for (const { field, label } of dateFields) {
    const value = data[field] as string | null | undefined;
    if (value && !isValidDate(value)) {
      errors.push({ field, message: `${label} must be a valid date` });
    }
  }

  // Joining finish must be after joining start
  if (data.joining_start && data.joining_finish) {
    if (!dateIsBeforeOrEqual(data.joining_start, data.joining_finish)) {
      errors.push({
        field: 'joining_finish',
        message: 'Joining Finish must be on or after Joining Start',
      });
    }
  }

  // Scanning date should be after joining finish (if both provided)
  if (data.joining_finish && data.actual_scanning_date) {
    if (!dateIsBeforeOrEqual(data.joining_finish, data.actual_scanning_date)) {
      errors.push({
        field: 'actual_scanning_date',
        message: 'Scanning Date should be after Joining Finish',
      });
    }
  }

  // Marking date should be after scanning date (if both provided)
  if (data.actual_scanning_date && data.actual_marking_date) {
    if (!dateIsBeforeOrEqual(data.actual_scanning_date, data.actual_marking_date)) {
      errors.push({
        field: 'actual_marking_date',
        message: 'Marking Date should be after Scanning Date',
      });
    }
  }

  // Weaning date should be after marking date (if both provided)
  if (data.actual_marking_date && data.weaning_date) {
    if (!dateIsBeforeOrEqual(data.actual_marking_date, data.weaning_date)) {
      errors.push({
        field: 'weaning_date',
        message: 'Weaning Date should be after Marking Date',
      });
    }
  }

  // =====================================================
  // NUMBER VALIDATIONS (must be non-negative)
  // =====================================================

  const numberFields: Array<{ field: keyof MobEditableData; label: string }> = [
    { field: 'ewe_count', label: 'Ewe Count' },
    { field: 'rams_in', label: 'Rams In' },
    { field: 'rams_out', label: 'Rams Out' },
    { field: 'twins', label: 'Twins' },
    { field: 'singles', label: 'Singles' },
    { field: 'in_lamb', label: 'In Lamb' },
    { field: 'dry', label: 'Dry' },
    { field: 'scanning_percent', label: 'Scanning %' },
    { field: 'total_ewe_count', label: 'Total Ewe Count' },
    { field: 'wet_ewes', label: 'Wet Ewes' },
    { field: 'dry_ewes', label: 'Dry Ewes' },
    { field: 'wethers_terminals', label: 'Wethers/Terminals' },
    { field: 'ewe_lambs', label: 'Ewe Lambs' },
    { field: 'final_ewe_count_staying', label: 'Final Ewe Count Staying' },
    { field: 'cull_ewe_count', label: 'Cull Ewe Count' },
    { field: 'lambs_sold', label: 'Lambs Sold' },
  ];

  for (const { field, label } of numberFields) {
    const value = data[field] as number | null | undefined;
    if (!isNonNegative(value)) {
      errors.push({ field, message: `${label} must be a non-negative number` });
    }
  }

  // =====================================================
  // LOGICAL VALIDATIONS
  // =====================================================

  // Rams out should not exceed rams in
  if (data.rams_in != null && data.rams_out != null && data.rams_out > data.rams_in) {
    errors.push({
      field: 'rams_out',
      message: 'Rams Out cannot exceed Rams In',
    });
  }

  // Dry ewes should not exceed total ewes at marking
  if (
    data.total_ewe_count != null &&
    data.dry_ewes != null &&
    data.dry_ewes > data.total_ewe_count
  ) {
    errors.push({
      field: 'dry_ewes',
      message: 'Dry Ewes cannot exceed Total Ewe Count',
    });
  }

  // In lamb + dry should roughly equal total scanned (allow some variance)
  if (data.in_lamb != null && data.dry != null && data.ewe_count != null) {
    const totalScanned = data.in_lamb + data.dry;
    // Allow 10% variance for missing/lost ewes
    if (totalScanned > data.ewe_count * 1.1) {
      errors.push({
        field: 'in_lamb',
        message: 'In Lamb + Dry should not significantly exceed original Ewe Count',
      });
    }
  }

  // Lambs sold should not exceed wethers/terminals
  if (
    data.wethers_terminals != null &&
    data.lambs_sold != null &&
    data.lambs_sold > data.wethers_terminals
  ) {
    errors.push({
      field: 'lambs_sold',
      message: 'Lambs Sold cannot exceed Wethers/Terminals',
    });
  }

  // Scanning percent should be between 0 and 300 (realistic range)
  if (data.scanning_percent != null && (data.scanning_percent < 0 || data.scanning_percent > 300)) {
    errors.push({
      field: 'scanning_percent',
      message: 'Scanning % should be between 0 and 300',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get error message for a specific field
 */
export function getFieldError(result: ValidationResult, field: string): string | undefined {
  return result.errors.find((e) => e.field === field)?.message;
}

/**
 * Check if a specific field has an error
 */
export function hasFieldError(result: ValidationResult, field: string): boolean {
  return result.errors.some((e) => e.field === field);
}
