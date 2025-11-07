/**
 * Availability Data Source - API methods for availability calendar
 */

import { ApiClient } from '../client';
import { AvailabilitySlot, ApiResponse, ListResponse } from '../types';

export interface TouringLocation {
  locationId: string;
  locationType: string;
  city: string;
  stateProvince: string | null;
  country: string;
  availableFrom: string;
  availableUntil: string | null;
  daysAvailable: number | null;
}

export interface CurrentLocation {
  locationId: string;
  city: string;
  stateProvince: string | null;
  country: string;
  availableFrom: string;
  availableUntil: string | null;
}

export interface DateAvailability {
  isAvailable: boolean;
  availabilityId: string;
  status: string;
  timeSlotStart: string | null;
  timeSlotEnd: string | null;
  locationCity: string | null;
}

export interface AvailableDate {
  date: string;
  availabilityCount: number;
  city: string | null;
}

export class AvailabilityDataSource {
  private static client = new ApiClient();

  /**
   * Get availability calendar for a tenant
   */
  static async getCalendar(
    tenantId: string | number,
    startDate?: string,
    endDate?: string
  ): Promise<AvailabilitySlot[]> {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await this.client.get<ListResponse<AvailabilitySlot>>(
      `/availability/${tenantId}`,
      params
    );
    return response.data;
  }

  /**
   * Check availability for a specific date
   */
  static async checkDate(
    tenantId: string | number,
    date: string
  ): Promise<{ available: boolean; slot?: AvailabilitySlot }> {
    const response = await this.client.get<
      ApiResponse<{ available: boolean; slot?: AvailabilitySlot }>
    >(`/availability/${tenantId}/check`, { date });
    return response.data;
  }

  /**
   * Get available dates within a range
   */
  static async getAvailableDates(
    tenantId: string | number,
    startDate: string,
    endDate: string
  ): Promise<string[]> {
    const slots = await this.getCalendar(tenantId, startDate, endDate);
    return slots.filter((slot) => slot.status === 'available').map((slot) => slot.date);
  }

  /**
   * Get touring schedule (upcoming locations)
   */
  static async getTouringSchedule(
    tenantId: string | number,
    daysAhead: number = 90
  ): Promise<TouringLocation[]> {
    const response = await this.client.get<{ success: boolean; data: TouringLocation[] }>(
      `/availability/${tenantId}/touring-schedule`,
      { daysAhead }
    );
    return response.data;
  }

  /**
   * Get current location
   */
  static async getCurrentLocation(tenantId: string | number): Promise<CurrentLocation> {
    const response = await this.client.get<ApiResponse<CurrentLocation>>(
      `/availability/${tenantId}/current-location`
    );
    return response.data;
  }

  /**
   * Check availability for a specific date (advanced)
   */
  static async checkAvailabilityForDate(
    tenantId: string | number,
    date: string,
    durationHours?: number
  ): Promise<DateAvailability[]> {
    const params: Record<string, string | number> = {};
    if (durationHours) params.durationHours = durationHours;

    const response = await this.client.get<{ success: boolean; data: DateAvailability[] }>(
      `/availability/${tenantId}/check/${date}`,
      params
    );
    return response.data;
  }

  /**
   * Get available dates in range (optimized)
   */
  static async getAvailableDatesList(
    tenantId: string | number,
    startDate: string,
    endDate: string
  ): Promise<AvailableDate[]> {
    const response = await this.client.get<{ success: boolean; data: AvailableDate[] }>(
      `/availability/${tenantId}/dates`,
      { startDate, endDate }
    );
    return response.data;
  }
}
