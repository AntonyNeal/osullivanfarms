/**
 * Service Booking Platform SDK - Frontend data sources and app generators
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
export { PaymentDataSource } from './datasources/payment';
export { AnalyticsDataSource } from './datasources/analytics';
export { TenantAnalyticsDataSource } from './datasources/tenantAnalytics';
export { SocialAnalyticsDataSource } from './datasources/socialAnalytics';

// Export generators
export {
  generateTheme,
  parseThemePrompt,
  generateTailwindConfig as generateThemeTailwindConfig,
  generateThemedButton,
  suggestIndustry,
  type ThemePrompt,
  type ThemeConfig,
} from './generators/theme';

export {
  parsePrompt,
  generateApp,
  generateFileStructure,
  type AppPrompt,
  type AppConfig,
  type ContentStructure,
  type PageConfig,
  type FormConfig,
  type DeploymentConfig,
} from './generators/app';

export {
  generateSocialTags,
  generateStructuredData,
  generateRobotsTxt,
  generateSitemap,
  generatePageMeta,
  type SEOConfig,
  type SocialTagsInput,
} from './generators/seo';

export {
  suggestAssets,
  generateAssetChecklist,
  generateAssetCSS,
  type AssetSuggestions,
  type OGImageSpec,
  type FaviconSpec,
  type HeroImageSpec,
  type LogoSpec,
} from './generators/assets';

// Export tools
export {
  auditFile,
  auditFiles,
  formatAuditReport,
  generateMigrationScript,
  exportAuditJSON,
  type AuditResult,
  type AuditIssue,
  type AuditReport,
  type AuditSummary,
} from './tools/audit';

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

export type { Payment } from './datasources/payment';

export type {
  TouringLocation,
  CurrentLocation,
  DateAvailability,
  AvailableDate,
} from './datasources/availability';
