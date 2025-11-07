/**
 * Location Data Source - API methods for location management
 */

import { ApiClient } from '../client';
import { Location, ListResponse } from '../types';

export class LocationDataSource {
  private static client = new ApiClient();

  /**
   * Get all locations for a tenant
   */
  static async getByTenant(tenantId: number): Promise<Location[]> {
    const response = await this.client.get<ListResponse<Location>>(`/locations/${tenantId}`);
    return response.data;
  }

  /**
   * Get locations grouped by country
   */
  static async getGroupedByCountry(tenantId: number): Promise<Record<string, Location[]>> {
    const locations = await this.getByTenant(tenantId);

    return locations.reduce(
      (grouped, location) => {
        const country = location.country || 'Other';
        if (!grouped[country]) {
          grouped[country] = [];
        }
        grouped[country].push(location);
        return grouped;
      },
      {} as Record<string, Location[]>
    );
  }

  /**
   * Get locations with availability
   */
  static async getAvailable(tenantId: number): Promise<Location[]> {
    const locations = await this.getByTenant(tenantId);
    return locations.filter(
      (loc) => loc.availableDatesCount !== undefined && loc.availableDatesCount > 0
    );
  }
}
