/**
 * Tenant Data Source
 * Provides easy access to tenant information
 */

import { apiClient } from './client';
import type { Tenant } from '../../core/types/tenant.types';

interface TenantResponse {
  success: boolean;
  data: Tenant;
}

interface TenantsListResponse {
  success: boolean;
  data: Tenant[];
  count: number;
}

export class TenantDataSource {
  /**
   * Get tenant by subdomain
   * @example const tenant = await TenantDataSource.getBySubdomain('claire');
   */
  static async getBySubdomain(subdomain: string): Promise<Tenant> {
    const response = await apiClient.get<TenantResponse>(`/tenants/${subdomain}`);
    return response.data;
  }

  /**
   * Get tenant by custom domain
   * @example const tenant = await TenantDataSource.getByDomain('clairehamilton.vip');
   */
  static async getByDomain(domain: string): Promise<Tenant> {
    const response = await apiClient.get<TenantResponse>(`/tenants/domain/${domain}`);
    return response.data;
  }

  /**
   * Get current tenant based on current hostname
   * @example const tenant = await TenantDataSource.getCurrent();
   */
  static async getCurrent(): Promise<Tenant> {
    const hostname = window.location.hostname;

    // Extract subdomain (e.g., claire.example.com -> claire)
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      const subdomain = parts[0];
      return this.getBySubdomain(subdomain);
    }

    // Use full domain for custom domains
    return this.getByDomain(hostname);
  }

  /**
   * List all tenants (admin use)
   * @example const tenants = await TenantDataSource.list();
   */
  static async list(): Promise<Tenant[]> {
    const response = await apiClient.get<TenantsListResponse>('/tenants');
    return response.data;
  }
}
