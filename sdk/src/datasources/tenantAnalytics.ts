/**
 * Tenant Analytics Data Source - Advanced analytics views
 */

import { ApiClient } from '../client';
import { ApiResponse } from '../types';

export interface TenantPerformance {
  tenantId: string;
  tenantName: string;
  subdomain: string;
  sessions: number;
  uniqueVisitors: number;
  bookings: number;
  conversionRate: number;
  photoClicks: number;
  formStarts: number;
  lastVisit: string;
}

export interface TrafficSource {
  source: string;
  medium: string;
  sessions: number;
  uniqueVisitors: number;
  conversions: number;
}

export interface LocationBooking {
  city: string;
  country: string;
  locationType: string;
  totalBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  avgDurationHours: number | null;
  firstBookingDate: string;
  lastBookingDate: string;
}

export interface AvailabilityUtilization {
  date: string;
  city: string;
  country: string;
  totalSlots: number;
  availableSlots: number;
  bookedSlots: number;
  blockedSlots: number;
  utilizationRate: number;
}

export interface ConversionFunnelStage {
  stage: string;
  count: number;
  percentage: number;
}

export class TenantAnalyticsDataSource {
  private static client = new ApiClient();

  /**
   * Get tenant performance summary
   */
  static async getPerformance(tenantId: string | number): Promise<TenantPerformance> {
    const response = await this.client.get<ApiResponse<TenantPerformance>>(
      `/tenant-analytics/${tenantId}/performance`
    );
    return response.data;
  }

  /**
   * Get traffic sources (UTM attribution)
   */
  static async getTrafficSources(tenantId: string | number): Promise<TrafficSource[]> {
    const response = await this.client.get<{ success: boolean; data: TrafficSource[] }>(
      `/tenant-analytics/${tenantId}/traffic-sources`
    );
    return response.data;
  }

  /**
   * Get booking analytics by location
   */
  static async getLocationBookings(tenantId: string | number): Promise<LocationBooking[]> {
    const response = await this.client.get<{ success: boolean; data: LocationBooking[] }>(
      `/tenant-analytics/${tenantId}/location-bookings`
    );
    return response.data;
  }

  /**
   * Get availability utilization rates
   */
  static async getAvailabilityUtilization(
    tenantId: string | number,
    startDate?: string,
    endDate?: string
  ): Promise<AvailabilityUtilization[]> {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await this.client.get<{ success: boolean; data: AvailabilityUtilization[] }>(
      `/tenant-analytics/${tenantId}/availability-utilization`,
      params
    );
    return response.data;
  }

  /**
   * Get conversion funnel data
   */
  static async getConversionFunnel(
    tenantId: string | number,
    startDate?: string,
    endDate?: string
  ): Promise<ConversionFunnelStage[]> {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await this.client.get<{ success: boolean; data: ConversionFunnelStage[] }>(
      `/tenant-analytics/${tenantId}/conversion-funnel`,
      params
    );
    return response.data;
  }
}
