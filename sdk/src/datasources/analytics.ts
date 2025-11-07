/**
 * Analytics Data Source - API methods for analytics tracking
 */

import { ApiClient } from '../client';
import { AnalyticsSummary, ApiResponse } from '../types';

interface CreateSessionRequest {
  tenantId: number;
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

interface SessionResponse {
  sessionId: string;
  tenantId: number;
  createdAt: string;
}

interface CreateEventRequest {
  sessionId: string;
  eventType: string;
  eventCategory?: string;
  eventLabel?: string;
  eventValue?: number;
  pageUrl?: string;
  metadata?: Record<string, unknown>;
}

export class AnalyticsDataSource {
  private static client = new ApiClient();
  private static currentSessionId: string | null = null;

  /**
   * Create a new analytics session
   */
  static async createSession(data: CreateSessionRequest): Promise<SessionResponse> {
    const response = await this.client.post<ApiResponse<SessionResponse>>(
      '/analytics/sessions',
      data
    );
    this.currentSessionId = response.data.sessionId;
    return response.data;
  }

  /**
   * Track an event
   */
  static async trackEvent(event: CreateEventRequest): Promise<void> {
    await this.client.post('/analytics/events', event);
  }

  /**
   * Track an event for the current session
   */
  static async track(
    eventType: string,
    eventCategory?: string,
    eventLabel?: string,
    eventValue?: number,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    if (!this.currentSessionId) {
      console.warn('No active session. Call createSession() first.');
      return;
    }

    await this.trackEvent({
      sessionId: this.currentSessionId,
      eventType,
      eventCategory,
      eventLabel,
      eventValue,
      pageUrl: window.location.href,
      metadata,
    });
  }

  /**
   * Get session details
   */
  static async getSession(sessionId: string): Promise<SessionResponse> {
    const response = await this.client.get<ApiResponse<SessionResponse>>(
      `/analytics/sessions/${sessionId}`
    );
    return response.data;
  }

  /**
   * Get analytics summary for a tenant
   */
  static async getSummary(
    tenantId: number,
    startDate?: string,
    endDate?: string
  ): Promise<AnalyticsSummary> {
    const params: Record<string, string | number> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await this.client.get<ApiResponse<AnalyticsSummary>>(
      `/analytics/${tenantId}`,
      params
    );
    return response.data;
  }

  /**
   * Initialize session tracking automatically
   */
  static async initialize(tenantId: number, utmParams?: Record<string, string>): Promise<string> {
    const session = await this.createSession({
      tenantId,
      userAgent: navigator.userAgent,
      referrer: document.referrer || undefined,
      ...utmParams,
    });

    // Track page view
    await this.track('page_view', 'engagement', window.location.pathname);

    return session.sessionId;
  }

  /**
   * Get current session ID
   */
  static getSessionId(): string | null {
    return this.currentSessionId;
  }
}
