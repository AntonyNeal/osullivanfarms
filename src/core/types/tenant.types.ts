// Multi-Tenant Platform - Type Definitions
// Shared types across all tenants

/**
 * Tenant Theme Configuration
 * Defines visual styling for each tenant
 */
export interface TenantTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textLight?: string;
    success?: string;
    error?: string;
    warning?: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  layout: 'elegant' | 'modern' | 'minimal';
  spacing?: 'compact' | 'comfortable' | 'spacious';
  borderRadius?: string;
  shadowIntensity?: 'light' | 'medium' | 'strong';
}

/**
 * Service Offering
 */
export interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price?: number;
  priceDisplay?: string;
  featured?: boolean;
  icon?: string;
  category?: string;
}

/**
 * Pricing Configuration
 */
export interface Pricing {
  hourly?: number;
  overnight?: number;
  weekend?: number;
  displayHourly?: boolean;
  currency?: string;
  customRates?: Array<{
    duration: string;
    price: number;
    description?: string;
  }>;
  [key: string]: unknown; // Allow service-specific pricing
}

/**
 * Contact Information
 */
export interface ContactInfo {
  email: string;
  phone?: string;
  phoneDisplay?: string;
  whatsapp?: string;
  telegram?: string;
  availableHours?: string;
  responseTime?: string;
  preferredContact?: 'email' | 'phone' | 'whatsapp' | 'telegram' | 'sms';
  location?: string;
  website?: string;
}

/**
 * Social Media Links
 */
export interface SocialMedia {
  instagram?: string;
  twitter?: string;
  onlyfans?: string;
  bluesky?: string;
  facebook?: string;
  tiktok?: string;
  linkedin?: string;
}

/**
 * Availability Information
 */
export interface Availability {
  location?: string;
  willingToTravel?: boolean;
  travelCities?: string[];
  travelCountries?: string[];
  timezone?: string;
  [key: string]: unknown; // Allow business hours (monday, tuesday, etc.)
}

/**
 * Booking Preferences
 */
export interface BookingPreferences {
  minAge?: number;
  minNotice?: string;
  depositRequired?: boolean;
  depositAmount?: number;
  depositPercentage?: number;
  screeningRequired?: boolean;
  verificationsAccepted?: string[];
  [key: string]: unknown; // Allow additional preferences
}

/**
 * SEO Configuration
 */
export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
}

/**
 * Tenant Content Configuration
 * All text content and business information
 */
export interface TenantContent {
  name: string;
  tagline: string;
  bio: string;
  shortBio?: string;
  services: Service[];
  pricing: Pricing;
  contact: ContactInfo;
  socialMedia?: SocialMedia;
  availability?: Availability;
  preferences?: BookingPreferences;
  settings?: unknown; // Allow additional settings
  seo: SEOConfig;
  customPages?: Array<{
    slug: string;
    title: string;
    content: string;
  }>;
}

/**
 * Photo Configuration
 */
export interface Photo {
  id: number | string;
  url: string;
  alt: string;
  caption?: string;
  category?: string;
  width?: number;
  height?: number;
}

/**
 * A/B Test Photo Variant
 */
export interface PhotoVariant {
  id: string;
  url: string;
  alt?: string;
  weight?: number; // 0.0 to 1.0, defaults to equal distribution
}

/**
 * Hero Photo Configuration with A/B Testing
 */
export interface HeroPhotoConfig {
  control: string | Photo;
  variants?: PhotoVariant[];
}

/**
 * Tenant Photos Configuration
 */
export interface TenantPhotos {
  hero: HeroPhotoConfig;
  gallery: Photo[];
  about?: Photo;
  testimonials?: Photo[];
}

/**
 * Complete Tenant Configuration
 */
export interface TenantConfig {
  id?: string;
  subdomain: string;
  theme: TenantTheme;
  content: TenantContent;
  photos: TenantPhotos;
  status?: 'active' | 'inactive' | 'preview';
  customDomain?: string;
  name?: string;
  features?: {
    bookingEnabled?: boolean;
    galleryEnabled?: boolean;
    blogEnabled?: boolean;
    reviewsEnabled?: boolean;
    chatEnabled?: boolean;
  };
  analytics?: {
    googleAnalyticsId?: string;
    trackingEnabled?: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Tenant Database Record
 */
export interface Tenant {
  id: string;
  subdomain: string;
  name: string;
  email?: string;
  customDomain?: string | null;
  status: 'active' | 'inactive' | 'preview';
  themeConfig: TenantTheme;
  contentConfig: TenantContent;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Session Tracking
 */
export interface Session {
  id: string;
  tenantId: string;
  sessionToken: string;
  fingerprint?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  country?: string;
  region?: string;
  city?: string;
  deviceType?: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  browser?: string;
  os?: string;
  landingPage?: string;
  createdAt: Date;
}

/**
 * Event Tracking
 */
export interface AnalyticsEvent {
  id: string;
  sessionId: string;
  tenantId: string;
  eventType: string;
  eventData?: Record<string, unknown>;
  pageUrl?: string;
  pageTitle?: string;
  createdAt: Date;
}

/**
 * A/B Test Definition
 */
export interface ABTest {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  elementType: 'photo' | 'text' | 'layout' | 'cta' | 'pricing' | 'other';
  variants: ABTestVariant[];
  status: 'draft' | 'active' | 'paused' | 'completed';
  winnerVariantId?: string;
  trafficAllocation?: number;
  startedAt?: Date;
  endedAt?: Date;
}

/**
 * A/B Test Variant
 */
export interface ABTestVariant {
  id: string;
  name: string;
  config: Record<string, unknown>;
  weight: number;
}

/**
 * A/B Test Assignment
 */
export interface ABAssignment {
  id: string;
  sessionId: string;
  testId: string;
  variantId: string;
  assignedAt: Date;
}

/**
 * Booking Submission
 */
export interface Booking {
  id: string;
  tenantId: string;
  sessionId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  serviceType?: string;
  preferredDate?: Date;
  duration?: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  conversionPath?: Array<{
    event: string;
    timestamp: string;
    page?: string;
    data?: Record<string, unknown>;
  }>;
  createdAt: Date;
  confirmedAt?: Date;
  cancelledAt?: Date;
  completedAt?: Date;
}

/**
 * Analytics Dashboard Metrics
 */
export interface DashboardMetrics {
  totalVisits: number;
  uniqueVisitors: number;
  bookingSubmissions: number;
  conversionRate: number;
  sources: Record<
    string,
    {
      visits: number;
      bookings: number;
      conversionRate: number;
    }
  >;
  funnel: {
    pageViews: number;
    photoClicks: number;
    pricingViews: number;
    formStarts: number;
    formSubmits: number;
  };
  activeTests?: ABTest[];
  topPages?: Array<{
    page: string;
    views: number;
  }>;
  deviceBreakdown?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

/**
 * Tenant Context
 */
export interface TenantContextValue {
  tenant: Tenant | null;
  theme: TenantTheme;
  content: TenantContent;
  photos: TenantPhotos;
  loading: boolean;
  error: Error | null;
}

/**
 * API Response Types
 */
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
