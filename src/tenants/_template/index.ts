/**
 * Template Tenant Configuration
 * Generic template configuration for creating new tenants
 */

import { content } from './content.config';
import { theme } from './theme.config';
import { photos } from './photos.config';
import type { TenantConfig } from '../../core/types/tenant.types';

export const templateTenant: TenantConfig = {
  id: 'template',
  name: 'Service Provider Template',
  subdomain: 'template',
  content,
  theme,
  photos,
  status: 'active',
  customDomain: 'template.yourdomain.com',
  features: {
    bookingEnabled: true,
    galleryEnabled: false,
    blogEnabled: false,
    reviewsEnabled: true,
    chatEnabled: false,
  },
  analytics: {
    googleAnalyticsId: 'GA_MEASUREMENT_ID',
    trackingEnabled: true,
  },
};

export default templateTenant;
