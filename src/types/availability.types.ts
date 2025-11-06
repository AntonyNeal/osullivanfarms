/**
 * Represents the next available time slot
 */
export interface NextAvailability {
  date: Date; // Date of next available slot
  time: string; // Formatted time (e.g., "2:00 PM")
  daysUntil: number; // Days from now (0 = today, 1 = tomorrow, etc.)
  hoursUntil: number; // Total hours until slot
  displayText: string; // Human-readable text (e.g., "Today at 2:00 PM")
}

/**
 * Props for availability fetching
 */
export interface AvailabilityFetchParams {
  serviceId?: string; // Optional service/resource identifier
  duration?: number; // Appointment duration in minutes
  fromDate?: Date; // Start searching from this date
}

/**
 * Response from availability API
 */
export interface AvailabilityResponse {
  nextSlot?: {
    start: string; // ISO 8601 date-time string
    end: string; // ISO 8601 date-time string
    [key: string]: unknown; // Provider-specific fields
  };
  available: boolean; // Whether any slots exist
}
