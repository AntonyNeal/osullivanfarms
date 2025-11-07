/**
 * Social Media Analytics Controller
 *
 * Exposes social media performance views (public data only)
 */

const db = require('../utils/db');

/**
 * GET /api/social-analytics/:tenantId/post-performance
 * Get individual post performance metrics
 */
const getPostPerformance = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { platform, limit = 50 } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Tenant ID is required',
      });
    }

    // First, check if view exists and tenant has data
    const checkQuery = `
      SELECT EXISTS (
        SELECT 1 FROM information_schema.views 
        WHERE table_name = 'v_social_post_performance'
      ) AS view_exists
    `;

    const checkResult = await db.query(checkQuery);

    if (!checkResult.rows[0].view_exists) {
      console.error('View v_social_post_performance does not exist');
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Social analytics view not found in database',
      });
    }

    let query = `
      SELECT 
        post_id,
        platform,
        post_type,
        posted_at,
        post_url,
        is_promoted,
        likes,
        comments,
        shares,
        views,
        engagement_rate,
        total_clicks,
        total_sessions,
        total_bookings,
        first_touch_sessions,
        last_touch_bookings,
        conversion_rate_pct,
        cost_per_booking,
        utm_source,
        utm_campaign
      FROM v_social_post_performance
      WHERE tenant_id = $1
    `;

    const params = [tenantId];

    if (platform) {
      params.push(platform);
      query += ` AND platform = $${params.length}`;
    }

    query += ` ORDER BY posted_at DESC LIMIT $${params.length + 1}`;
    params.push(parseInt(limit));

    const result = await db.query(query, params);

    res.json({
      success: true,
      data: result.rows.map((row) => ({
        postId: row.post_id,
        platform: row.platform,
        postType: row.post_type,
        postedAt: row.posted_at,
        postUrl: row.post_url,
        isPromoted: row.is_promoted,
        engagement: {
          likes: parseInt(row.likes) || 0,
          comments: parseInt(row.comments) || 0,
          shares: parseInt(row.shares) || 0,
          views: parseInt(row.views) || 0,
          engagementRate: row.engagement_rate ? parseFloat(row.engagement_rate) : 0,
        },
        conversions: {
          clicks: parseInt(row.total_clicks) || 0,
          sessions: parseInt(row.total_sessions) || 0,
          bookings: parseInt(row.total_bookings) || 0,
          conversionRate: row.conversion_rate_pct ? parseFloat(row.conversion_rate_pct) : 0,
        },
        attribution: {
          firstTouchSessions: parseInt(row.first_touch_sessions) || 0,
          lastTouchBookings: parseInt(row.last_touch_bookings) || 0,
        },
        costPerBooking: row.cost_per_booking ? parseFloat(row.cost_per_booking) : null,
        utm: {
          source: row.utm_source,
          campaign: row.utm_campaign,
        },
      })),
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error in getPostPerformance:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to fetch post performance data',
    });
  }
};

/**
 * GET /api/social-analytics/:tenantId/platform-performance
 * Get platform comparison metrics
 */
const getPlatformPerformance = async (req, res) => {
  try {
    const { tenantId } = req.params;

    if (!tenantId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Tenant ID is required',
      });
    }

    const result = await db.query(
      `SELECT 
        platform,
        total_posts,
        promoted_posts,
        total_likes,
        total_comments,
        total_shares,
        total_views,
        avg_engagement_rate,
        total_sessions,
        total_bookings,
        conversion_rate_pct,
        total_ad_spend,
        avg_cost_per_booking,
        last_post_date
      FROM v_platform_performance
      WHERE tenant_id = $1
      ORDER BY total_bookings DESC, total_sessions DESC`,
      [tenantId]
    );

    res.json({
      success: true,
      data: result.rows.map((row) => ({
        platform: row.platform,
        posts: {
          total: parseInt(row.total_posts),
          promoted: parseInt(row.promoted_posts),
        },
        engagement: {
          likes: parseInt(row.total_likes) || 0,
          comments: parseInt(row.total_comments) || 0,
          shares: parseInt(row.total_shares) || 0,
          views: parseInt(row.total_views) || 0,
          avgEngagementRate: row.avg_engagement_rate ? parseFloat(row.avg_engagement_rate) : 0,
        },
        conversions: {
          sessions: parseInt(row.total_sessions) || 0,
          bookings: parseInt(row.total_bookings) || 0,
          conversionRate: row.conversion_rate_pct ? parseFloat(row.conversion_rate_pct) : 0,
        },
        roi: {
          totalAdSpend: row.total_ad_spend ? parseFloat(row.total_ad_spend) : 0,
          avgCostPerBooking: row.avg_cost_per_booking ? parseFloat(row.avg_cost_per_booking) : null,
        },
        lastPostDate: row.last_post_date,
      })),
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error in getPlatformPerformance:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve platform performance',
      details: error.message,
    });
  }
};

/**
 * GET /api/social-analytics/:tenantId/top-posts
 * Get top performing posts (by performance score)
 */
const getTopPosts = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { limit = 10 } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Tenant ID is required',
      });
    }

    const result = await db.query(
      `SELECT 
        post_id,
        platform,
        post_type,
        posted_at,
        post_url,
        caption_preview,
        likes,
        comments,
        views,
        engagement_rate,
        bookings,
        sessions,
        performance_score
      FROM v_top_posts
      WHERE tenant_id = $1
      LIMIT $2`,
      [tenantId, parseInt(limit)]
    );

    res.json({
      success: true,
      data: result.rows.map((row) => ({
        postId: row.post_id,
        platform: row.platform,
        postType: row.post_type,
        postedAt: row.posted_at,
        postUrl: row.post_url,
        captionPreview: row.caption_preview,
        engagement: {
          likes: parseInt(row.likes) || 0,
          comments: parseInt(row.comments) || 0,
          views: parseInt(row.views) || 0,
          engagementRate: row.engagement_rate ? parseFloat(row.engagement_rate) : 0,
        },
        conversions: {
          bookings: parseInt(row.bookings) || 0,
          sessions: parseInt(row.sessions) || 0,
        },
        performanceScore: parseFloat(row.performance_score),
      })),
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error in getTopPosts:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve top posts',
      details: error.message,
    });
  }
};

/**
 * GET /api/social-analytics/:tenantId/top-hashtags
 * Get top performing hashtags
 */
const getTopHashtags = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { days = 90, limit = 20 } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Tenant ID is required',
      });
    }

    const result = await db.query(`SELECT * FROM get_top_hashtags($1::uuid, $2::int, $3::int)`, [
      tenantId,
      parseInt(days),
      parseInt(limit),
    ]);

    res.json({
      success: true,
      data: result.rows.map((row) => ({
        hashtag: row.hashtag,
        postCount: parseInt(row.post_count),
        avgEngagementRate: row.avg_engagement_rate ? parseFloat(row.avg_engagement_rate) : 0,
        totalBookings: parseInt(row.total_bookings),
      })),
      count: result.rows.length,
      timeframe: {
        days: parseInt(days),
      },
    });
  } catch (error) {
    console.error('Error in getTopHashtags:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve top hashtags',
      details: error.message,
    });
  }
};

/**
 * GET /api/social-analytics/:tenantId/daily-metrics
 * Get daily social media account metrics
 */
const getDailyMetrics = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { platform, startDate, endDate, limit = 90 } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Tenant ID is required',
      });
    }

    let query = `
      SELECT 
        platform,
        metric_date,
        followers,
        following,
        engagement_rate,
        posts_count,
        reach,
        impressions,
        profile_views,
        website_clicks
      FROM social_media_metrics
      WHERE tenant_id = $1
    `;

    const params = [tenantId];

    if (platform) {
      params.push(platform);
      query += ` AND platform = $${params.length}`;
    }

    if (startDate) {
      params.push(startDate);
      query += ` AND metric_date >= $${params.length}`;
    }

    if (endDate) {
      params.push(endDate);
      query += ` AND metric_date <= $${params.length}`;
    }

    query += ` ORDER BY metric_date DESC LIMIT $${params.length + 1}`;
    params.push(parseInt(limit));

    const result = await db.query(query, params);

    res.json({
      success: true,
      data: result.rows.map((row) => ({
        platform: row.platform,
        date: row.metric_date,
        followers: parseInt(row.followers) || 0,
        following: parseInt(row.following) || 0,
        engagementRate: row.engagement_rate ? parseFloat(row.engagement_rate) : 0,
        postsCount: parseInt(row.posts_count) || 0,
        reach: parseInt(row.reach) || 0,
        impressions: parseInt(row.impressions) || 0,
        profileViews: parseInt(row.profile_views) || 0,
        websiteClicks: parseInt(row.website_clicks) || 0,
      })),
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error in getDailyMetrics:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve daily metrics',
      details: error.message,
    });
  }
};

/**
 * GET /api/social-analytics/:tenantId/follower-growth
 * Get follower growth over time (aggregated view)
 */
const getFollowerGrowth = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { platform, days = 90 } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Tenant ID is required',
      });
    }

    let query = `
      SELECT 
        platform,
        metric_date,
        followers,
        LAG(followers) OVER (PARTITION BY platform ORDER BY metric_date) as prev_followers
      FROM social_media_metrics
      WHERE tenant_id = $1
        AND metric_date >= CURRENT_DATE - $2::int
    `;

    const params = [tenantId, parseInt(days)];

    if (platform) {
      params.push(platform);
      query += ` AND platform = $${params.length}`;
    }

    query += ` ORDER BY platform, metric_date DESC`;

    const result = await db.query(query, params);

    const growth = result.rows.map((row) => ({
      platform: row.platform,
      date: row.metric_date,
      followers: parseInt(row.followers) || 0,
      growth: row.prev_followers ? parseInt(row.followers) - parseInt(row.prev_followers) : 0,
      growthRate: row.prev_followers
        ? ((parseInt(row.followers) - parseInt(row.prev_followers)) /
            parseInt(row.prev_followers)) *
          100
        : 0,
    }));

    // Calculate summary stats per platform
    const summary = {};
    growth.forEach((g) => {
      if (!summary[g.platform]) {
        summary[g.platform] = {
          platform: g.platform,
          currentFollowers: 0,
          totalGrowth: 0,
          avgDailyGrowth: 0,
          dataPoints: 0,
        };
      }
      if (g.date && summary[g.platform].dataPoints === 0) {
        summary[g.platform].currentFollowers = g.followers;
      }
      summary[g.platform].totalGrowth += g.growth;
      summary[g.platform].dataPoints++;
    });

    Object.values(summary).forEach((s) => {
      s.avgDailyGrowth = s.dataPoints > 0 ? s.totalGrowth / s.dataPoints : 0;
    });

    res.json({
      success: true,
      data: growth,
      summary: Object.values(summary),
      timeframe: {
        days: parseInt(days),
      },
    });
  } catch (error) {
    console.error('Error in getFollowerGrowth:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve follower growth',
      details: error.message,
    });
  }
};

module.exports = {
  getPostPerformance,
  getPlatformPerformance,
  getTopPosts,
  getTopHashtags,
  getDailyMetrics,
  getFollowerGrowth,
};
