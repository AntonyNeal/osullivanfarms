/**
 * Tenant Data Source - API methods for tenant operations
 */

import { ApiClient } from '../client';
import { Tenant, ApiResponse, ListResponse } from '../types';

export class TenantDataSource {
  private static client = new ApiClient();

  /**
   * Get tenant by subdomain
   */
  static async getBySubdomain(subdomain: string): Promise<Tenant> {
    const response = await this.client.get<ApiResponse<Tenant>>(`/tenants/${subdomain}`);
    return response.data;
  }

  /**
   * Get tenant by custom domain
   */
  static async getByDomain(domain: string): Promise<Tenant> {
    const response = await this.client.get<ApiResponse<Tenant>>(`/tenants/domain/${domain}`);
    return response.data;
  }

  /**
   * Get current tenant from hostname
   */
  static async getCurrent(): Promise<Tenant> {
    const hostname = window.location.hostname;

    // Check if custom domain
    if (!hostname.includes('clairehamilton.vip')) {
      return this.getByDomain(hostname);
    }

    // Extract subdomain
    const subdomain = hostname.split('.')[0];
    if (subdomain && subdomain !== 'www') {
      return this.getBySubdomain(subdomain);
    }

    throw new Error('Unable to determine tenant from current hostname');
  }

  /**
   * List all tenants (admin only)
   */
  static async list(page: number = 1, limit: number = 20): Promise<ListResponse<Tenant>> {
    return this.client.get<ListResponse<Tenant>>('/tenants', { page, limit });
  }
}
