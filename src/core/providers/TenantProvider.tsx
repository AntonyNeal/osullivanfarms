import { useEffect, useState, ReactNode } from 'react';
import type {
  Tenant,
  TenantContextValue,
  TenantTheme,
  TenantContent,
  TenantPhotos,
} from '../types/tenant.types';
import { TenantContext } from '../context/TenantContext';

interface TenantProviderProps {
  children: ReactNode;
}

/**
 * TenantProvider
 *
 * Provides tenant configuration throughout the app based on subdomain.
 * Handles tenant detection, loading tenant data, and providing theme/content/photos.
 */
export function TenantProvider({ children }: TenantProviderProps) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [theme, setTheme] = useState<TenantTheme | null>(null);
  const [content, setContent] = useState<TenantContent | null>(null);
  const [photos, setPhotos] = useState<TenantPhotos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadTenant = async () => {
      try {
        setLoading(true);

        // Detect subdomain or domain
        const hostname = window.location.hostname;
        const subdomain = getSubdomain(hostname);

        console.debug('[Tenant] Detected hostname:', hostname);
        console.debug('[Tenant] Extracted subdomain:', subdomain);

        // For development: localhost always maps to 'claire'
        if (hostname === 'localhost' || hostname.startsWith('127.0.0.1')) {
          console.debug('[Tenant] Development mode - loading claire tenant');
          await loadDevelopmentTenant();
          return;
        }

        // For platform pages (www, companionconnect, etc.)
        if (isPlatformDomain(subdomain)) {
          console.debug('[Tenant] Platform domain detected');
          setTenant(null); // No tenant, show platform pages
          setLoading(false);
          return;
        }

        // Load tenant by subdomain or custom domain
        const tenantData = await fetchTenant(subdomain, hostname);

        if (!tenantData) {
          throw new Error(`Tenant not found: ${subdomain}`);
        }

        setTenant(tenantData);
        setTheme(tenantData.themeConfig);
        setContent(tenantData.contentConfig);

        // Photos would come from database or be dynamically loaded
        // For now, we'll load from tenant config files
        const photosConfig = await loadTenantPhotos(subdomain);
        setPhotos(photosConfig);

        setLoading(false);
      } catch (err) {
        console.error('[Tenant] Error loading tenant:', err);
        setError(err as Error);
        setLoading(false);
      }
    };

    loadTenant();
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (theme) {
      applyTheme(theme);
    }
  }, [theme]);

  const value: TenantContextValue = {
    tenant,
    theme: theme!,
    content: content!,
    photos: photos!,
    loading,
    error,
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

/**
 * Extract subdomain from hostname
 */
function getSubdomain(hostname: string): string {
  // Remove port if present
  const host = hostname.split(':')[0];

  // Split by dots
  const parts = host.split('.');

  // If localhost or IP, return empty
  if (host === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    return '';
  }

  // For xxx.avaliable.pro, return 'xxx'
  if (host.endsWith('.avaliable.pro')) {
    return parts[0];
  }

  // For xxx.prebooking.pro, return 'xxx' (legacy)
  if (host.endsWith('.prebooking.pro')) {
    return parts[0];
  }

  // For clairehamilton.com.au or www.clairehamilton.com.au, return 'claire'
  if (host === 'clairehamilton.com.au' || host === 'www.clairehamilton.com.au') {
    return 'claire';
  }

  // For xxx.companionconnect.app, return 'xxx' (legacy)
  // For companionconnect.app, return ''
  if (parts.length >= 3) {
    return parts[0];
  }

  return '';
}

/**
 * Check if domain is a platform domain (not tenant-specific)
 */
function isPlatformDomain(subdomain: string): boolean {
  const platformSubdomains = [
    '',
    'www',
    'companionconnect',
    'platform',
    'admin',
    'prebooking',
    'avaliable',
  ];
  return platformSubdomains.includes(subdomain);
}

/**
 * Fetch tenant data from API
 */
async function fetchTenant(subdomain: string, hostname: string): Promise<Tenant | null> {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;

    // Try subdomain first
    let response = await fetch(`${apiBaseUrl}/api/tenants/${subdomain}`);

    // If not found, try by custom domain
    if (!response.ok && response.status === 404) {
      response = await fetch(`${apiBaseUrl}/api/tenants/domain/${hostname}`);
    }

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch tenant: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data; // Fixed: API returns {success: true, data: {...}}
  } catch (error) {
    console.error('[Tenant] Error fetching from API:', error);
    // Fall back to local config if API fails
    return loadLocalTenantConfig(subdomain);
  }
}

/**
 * Load tenant configuration from local files (fallback)
 */
async function loadLocalTenantConfig(subdomain: string): Promise<Tenant | null> {
  try {
    // Import tenant registry
    const { getTenantBySubdomain } = await import('../../tenants');
    const config = getTenantBySubdomain(subdomain);

    if (!config) {
      return null;
    }

    // Create tenant object from config
    return {
      id: config.id || `local-${subdomain}`,
      subdomain: config.subdomain,
      name: config.name || config.content.name,
      email: config.content.contact?.email,
      customDomain: config.customDomain || null,
      status: config.status || 'active',
      themeConfig: config.theme,
      contentConfig: config.content,
      createdAt: config.createdAt || new Date(),
      updatedAt: config.updatedAt || new Date(),
    };
  } catch (error) {
    console.error('[Tenant] Error loading local config:', error);
    return null;
  }
}

/**
 * Load tenant photos configuration
 */
async function loadTenantPhotos(subdomain: string): Promise<TenantPhotos> {
  try {
    const { getTenantBySubdomain } = await import('../../tenants');
    const config = getTenantBySubdomain(subdomain);

    if (config?.photos) {
      return config.photos;
    }

    // Fallback to empty photos
    return {
      hero: { control: '' },
      gallery: [],
    };
  } catch (error) {
    console.error('[Tenant] Error loading photos config:', error);
    return {
      hero: { control: '' },
      gallery: [],
    };
  }
}

/**
 * Load development tenant (Claire)
 */
async function loadDevelopmentTenant() {
  // In development, always load Claire's config
  return loadLocalTenantConfig('claire');
}

/**
 * Apply theme to document
 */
function applyTheme(theme: TenantTheme) {
  const root = document.documentElement;

  // Set CSS custom properties
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-secondary', theme.colors.secondary);
  root.style.setProperty('--color-accent', theme.colors.accent);
  root.style.setProperty('--color-background', theme.colors.background);
  root.style.setProperty('--color-text', theme.colors.text);

  if (theme.colors.textLight) {
    root.style.setProperty('--color-text-light', theme.colors.textLight);
  }

  if (theme.borderRadius) {
    root.style.setProperty('--border-radius', theme.borderRadius);
  }

  // Apply fonts
  root.style.setProperty('--font-heading', theme.fonts.heading);
  root.style.setProperty('--font-body', theme.fonts.body);

  // Apply spacing based on layout
  const spacingMap = {
    compact: '0.75rem',
    comfortable: '1rem',
    spacious: '1.5rem',
  };

  if (theme.spacing) {
    root.style.setProperty('--spacing-base', spacingMap[theme.spacing]);
  }

  console.debug('[Tenant] Theme applied:', theme);
}
