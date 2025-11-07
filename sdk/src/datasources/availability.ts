/**
 * Availability Data Source - API methods for availability calendar
 */

import { ApiClient } from '../client';
import { AvailabilitySlot, ApiResponse, ListResponse } from '../types';

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
}
