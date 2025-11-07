/**
 * Claire Hamilton Tenant Configuration
 *
 * Main export file for all tenant-specific configuration
 */

import { theme } from './theme.config';
import { content } from './content.config';
import { photos } from './photos.config';
import type { TenantConfig } from '../../core/types/tenant.types';

export const claireConfig: TenantConfig = {
  id: 'claire',
  subdomain: 'claire',
  customDomain: 'clairehamilton.com.au', // Updated to new custom domain
  name: 'Claire Hamilton',
  status: 'active',
  theme,
  content,
  photos,
  features: {
    bookingEnabled: true,
    galleryEnabled: true,
    blogEnabled: false,
    reviewsEnabled: false,
    chatEnabled: false,
  },
  analytics: {
    googleAnalyticsId: undefined,
    trackingEnabled: true,
  },
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date(),
};

export default claireConfig;
