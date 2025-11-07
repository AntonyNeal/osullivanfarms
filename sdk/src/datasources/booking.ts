/**
 * Booking Data Source - API methods for booking management
 */

import { ApiClient } from '../client';
import { Booking, ApiResponse, ListResponse } from '../types';

interface CreateBookingRequest {
  tenantId: string | number;
  locationId: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;
  startDate: string;
  endDate: string;
  durationHours: number;
  specialRequests?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

interface UpdateStatusRequest {
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

export class BookingDataSource {
  private static client = new ApiClient();

  /**
   * Create a new booking
   */
  static async create(booking: CreateBookingRequest): Promise<Booking> {
    const response = await this.client.post<ApiResponse<Booking>>('/bookings', booking);
    return response.data;
  }

  /**
   * Get a booking by ID
   */
  static async getById(bookingId: string | number): Promise<Booking> {
    const response = await this.client.get<ApiResponse<Booking>>(`/bookings/${bookingId}`);
    return response.data;
  }

  /**
   * Update booking status
   */
  static async updateStatus(bookingId: string | number, update: UpdateStatusRequest): Promise<Booking> {
    const response = await this.client.patch<ApiResponse<Booking>>(
      `/bookings/${bookingId}/status`,
      update
    );
    return response.data;
  }

  /**
   * Get all bookings for a tenant
   */
  static async getByTenant(
    tenantId: string | number,
    status?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ListResponse<Booking>> {
    const params: Record<string, string | number> = { page, limit };
    if (status) params.status = status;

    return this.client.get<ListResponse<Booking>>(`/bookings/tenant/${tenantId}`, params);
  }

  /**
   * Cancel a booking
   */
  static async cancel(bookingId: string | number, reason?: string): Promise<Booking> {
    return this.updateStatus(bookingId, {
      status: 'cancelled',
      notes: reason,
    });
  }

  /**
   * Confirm a booking
   */
  static async confirm(bookingId: string | number): Promise<Booking> {
    return this.updateStatus(bookingId, { status: 'confirmed' });
  }
}
