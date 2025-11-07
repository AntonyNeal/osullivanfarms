/**
 * Companion SDK - Type Definitions
 */

export interface Tenant {
  id: string;
  subdomain: string;
  name: string;
  email: string;
  customDomain: string | null;
  status: 'active' | 'inactive' | 'suspended';
  themeConfig: Record<string, any>;
  contentConfig: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilitySlot {
  id: string;
  tenantId: string;
  date: string;
  timeSlotStart: string | null;
  timeSlotEnd: string | null;
  status: 'available' | 'booked' | 'blocked';
  isAllDay: boolean;
  minDurationHours: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  tenantId: string;
  locationType: 'home_base' | 'touring' | 'temporary';
  city: string;
  stateProvince: string | null;
  country: string;
  countryName: string;
  latitude: number | null;
  longitude: number | null;
  availableFrom: string | null;
  availableUntil: string | null;
  isCurrent: boolean;
  isPublic: boolean;
  notes: string | null;
  availableDatesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  tenantId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;
  preferredDate: string;
  preferredDateEnd: string | null;
  duration: string;
  locationCity: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsSummary {
  totalSessions: number;
  uniqueVisitors: number;
  avgPageViews: number | null;
  bounceRate: number;
  totalEvents: number;
  totalBookings: number;
  confirmedBookings: number;
  conversionRate: number;
  avgTimeToBooking: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ListResponse<T> extends ApiResponse<T[]> {
  count: number;
  pagination?: {
    limit: number;
    offset: number;
  };
}
