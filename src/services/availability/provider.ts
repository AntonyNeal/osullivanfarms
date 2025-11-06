import type { AvailabilityFetchParams, AvailabilityResponse } from '../types/availability.types';
import { fetchDummyNextAvailability } from './dummyData';

/**
 * Availability provider interface
 */
export interface IAvailabilityProvider {
  fetchNextAvailability(params?: AvailabilityFetchParams): Promise<AvailabilityResponse>;
}

/**
 * Dummy provider for development
 */
class DummyAvailabilityProvider implements IAvailabilityProvider {
  async fetchNextAvailability(params?: AvailabilityFetchParams): Promise<AvailabilityResponse> {
    console.log('[AvailabilityProvider] Fetching dummy next slot:', params);
    return fetchDummyNextAvailability(params);
  }
}

/**
 * Real API provider
 */
class ApiAvailabilityProvider implements IAvailabilityProvider {
  constructor(private apiUrl: string) {}

  async fetchNextAvailability(params?: AvailabilityFetchParams): Promise<AvailabilityResponse> {
    console.log('[AvailabilityProvider] Fetching from API:', params);

    const queryParams = new URLSearchParams();

    if (params?.serviceId) {
      queryParams.append('serviceId', params.serviceId);
    }
    if (params?.duration) {
      queryParams.append('duration', String(params.duration));
    }
    if (params?.fromDate) {
      queryParams.append('from', params.fromDate.toISOString());
    }

    const response = await fetch(`${this.apiUrl}?${queryParams}`, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = (await response.json()) as Record<string, unknown>;

    // Transform your API response to standard format
    return {
      nextSlot: (data.nextSlot || data.next || data.slot) as
        | { start: string; end: string; [key: string]: unknown }
        | undefined,
      available: (data.available ?? !!data.nextSlot) as boolean,
    };
  }
}

/**
 * Provider factory
 */
export function createAvailabilityProvider(): IAvailabilityProvider {
  // Use dummy data in development
  if (import.meta.env.MODE === 'development' && !import.meta.env.VITE_USE_REAL_API) {
    return new DummyAvailabilityProvider();
  }

  // Use real API in production
  const apiUrl = import.meta.env.VITE_NEXT_AVAILABILITY_API_URL || '/api/next-available';
  return new ApiAvailabilityProvider(apiUrl);
}

/**
 * Singleton instance
 */
export const availabilityProvider = createAvailabilityProvider();
