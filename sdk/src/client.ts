/**
 * API Client - Base HTTP client for all API calls
 */

interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number>;
  body?: unknown;
}

export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = 'https://clairehamilton.vip/api') {
    this.baseURL = baseURL;
  }

  private buildURL(endpoint: string, params?: Record<string, string | number>): string {
    // Remove leading slash from endpoint to avoid replacing baseURL path
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = new URL(
      cleanEndpoint,
      this.baseURL.endsWith('/') ? this.baseURL : this.baseURL + '/'
    );

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, body, ...fetchOptions } = options;
    const url = this.buildURL(endpoint, params);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}
