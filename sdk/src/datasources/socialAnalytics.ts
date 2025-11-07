/**
 * Social Analytics Data Source - Social media performance tracking
 */

import { ApiClient } from '../client';

export interface PostEngagement {
  likes: number;
  comments: number;
  shares: number;
  views: number;
  engagementRate: number;
}

export interface PostConversions {
  clicks: number;
  sessions: number;
  bookings: number;
  conversionRate: number;
}

export interface PostAttribution {
  firstTouchSessions: number;
  lastTouchBookings: number;
}

export interface PostPerformance {
  postId: string;
  platform: string;
  postType: string;
  postedAt: string;
  postUrl: string;
  isPromoted: boolean;
  engagement: PostEngagement;
  conversions: PostConversions;
  attribution: PostAttribution;
  costPerBooking: number | null;
  utm: {
    source: string | null;
    campaign: string | null;
  };
}

export interface PlatformPosts {
  total: number;
  promoted: number;
}

export interface PlatformEngagement {
  likes: number;
  comments: number;
  shares: number;
  views: number;
  avgEngagementRate: number;
}

export interface PlatformConversions {
  sessions: number;
  bookings: number;
  conversionRate: number;
}

export interface PlatformROI {
  totalAdSpend: number;
  avgCostPerBooking: number | null;
}

export interface PlatformPerformance {
  platform: string;
  posts: PlatformPosts;
  engagement: PlatformEngagement;
  conversions: PlatformConversions;
  roi: PlatformROI;
  lastPostDate: string;
}

export interface TopPost {
  postId: string;
  platform: string;
  postType: string;
  postedAt: string;
  postUrl: string;
  captionPreview: string;
  engagement: {
    likes: number;
    comments: number;
    views: number;
    engagementRate: number;
  };
  conversions: {
    bookings: number;
    sessions: number;
  };
  performanceScore: number;
}

export interface TopHashtag {
  hashtag: string;
  postCount: number;
  avgEngagementRate: number;
  totalBookings: number;
}

export interface DailyMetric {
  platform: string;
  date: string;
  followers: number;
  following: number;
  engagementRate: number;
  postsCount: number;
  reach: number;
  impressions: number;
  profileViews: number;
  websiteClicks: number;
}

export interface FollowerGrowthPoint {
  platform: string;
  date: string;
  followers: number;
  growth: number;
  growthRate: number;
}

export interface FollowerGrowthSummary {
  platform: string;
  currentFollowers: number;
  totalGrowth: number;
  avgDailyGrowth: number;
  dataPoints: number;
}

export class SocialAnalyticsDataSource {
  private static client = new ApiClient();

  /**
   * Get individual post performance metrics
   */
  static async getPostPerformance(
    tenantId: string | number,
    platform?: string,
    limit: number = 50
  ): Promise<PostPerformance[]> {
    const params: Record<string, string | number> = { limit };
    if (platform) params.platform = platform;

    const response = await this.client.get<{ success: boolean; data: PostPerformance[] }>(
      `/social-analytics/${tenantId}/post-performance`,
      params
    );
    return response.data;
  }

  /**
   * Get platform comparison metrics
   */
  static async getPlatformPerformance(tenantId: string | number): Promise<PlatformPerformance[]> {
    const response = await this.client.get<{ success: boolean; data: PlatformPerformance[] }>(
      `/social-analytics/${tenantId}/platform-performance`
    );
    return response.data;
  }

  /**
   * Get top performing posts
   */
  static async getTopPosts(tenantId: string | number, limit: number = 10): Promise<TopPost[]> {
    const response = await this.client.get<{ success: boolean; data: TopPost[] }>(
      `/social-analytics/${tenantId}/top-posts`,
      { limit }
    );
    return response.data;
  }

  /**
   * Get top performing hashtags
   */
  static async getTopHashtags(
    tenantId: string | number,
    days: number = 90,
    limit: number = 20
  ): Promise<TopHashtag[]> {
    const response = await this.client.get<{ success: boolean; data: TopHashtag[] }>(
      `/social-analytics/${tenantId}/top-hashtags`,
      { days, limit }
    );
    return response.data;
  }

  /**
   * Get daily social media metrics
   */
  static async getDailyMetrics(
    tenantId: string | number,
    platform?: string,
    startDate?: string,
    endDate?: string,
    limit: number = 90
  ): Promise<DailyMetric[]> {
    const params: Record<string, string | number> = { limit };
    if (platform) params.platform = platform;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await this.client.get<{ success: boolean; data: DailyMetric[] }>(
      `/social-analytics/${tenantId}/daily-metrics`,
      params
    );
    return response.data;
  }

  /**
   * Get follower growth over time
   */
  static async getFollowerGrowth(
    tenantId: string | number,
    platform?: string,
    days: number = 90
  ): Promise<{ data: FollowerGrowthPoint[]; summary: FollowerGrowthSummary[] }> {
    const params: Record<string, string | number> = { days };
    if (platform) params.platform = platform;

    const response = await this.client.get<{
      success: boolean;
      data: FollowerGrowthPoint[];
      summary: FollowerGrowthSummary[];
    }>(`/social-analytics/${tenantId}/follower-growth`, params);

    return {
      data: response.data,
      summary: response.summary,
    };
  }
}
