/**
 * Companion SDK - Frontend data sources for companion platform
 * @packageDocumentation
 */

// Export client
export { ApiClient } from './client';

// Export types
export * from './types';

// Export data sources
export { TenantDataSource } from './datasources/tenant';
export { AvailabilityDataSource } from './datasources/availability';
export { LocationDataSource } from './datasources/location';
export { BookingDataSource } from './datasources/booking';
export { AnalyticsDataSource } from './datasources/analytics';
export { TenantAnalyticsDataSource } from './datasources/tenantAnalytics';
export { SocialAnalyticsDataSource } from './datasources/socialAnalytics';

// Export additional types from new datasources
export type {
  TenantPerformance,
  TrafficSource,
  LocationBooking,
  AvailabilityUtilization,
  ConversionFunnelStage,
  ABTestVariant,
  ABTestResult,
} from './datasources/tenantAnalytics';

export type {
  PostPerformance,
  PostEngagement,
  PostConversions,
  PostAttribution,
  PlatformPerformance,
  TopPost,
  TopHashtag,
  DailyMetric,
  FollowerGrowthPoint,
  FollowerGrowthSummary,
} from './datasources/socialAnalytics';

export type {
  TouringLocation,
  CurrentLocation,
  DateAvailability,
  AvailableDate,
} from './datasources/availability';
