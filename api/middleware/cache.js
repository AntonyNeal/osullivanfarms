/**
 * Response Caching Middleware
 *
 * Caches API responses in memory to reduce database load
 * Useful for analytics endpoints that don't need real-time data
 *
 * Features:
 * - In-memory LRU cache
 * - Configurable TTL per route
 * - Cache invalidation
 * - Cache statistics
 */

class ResponseCache {
  constructor(maxSize = 100, defaultTTL = 300000) {
    // 300000ms = 5 minutes
    this.cache = new Map();
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Generate cache key from request
   */
  generateKey(req) {
    const { method, originalUrl, body, query } = req;
    const queryString = JSON.stringify(query);
    const bodyString = method !== 'GET' ? JSON.stringify(body) : '';
    return `${method}:${originalUrl}:${queryString}:${bodyString}`;
  }

  /**
   * Get cached response
   */
  get(key) {
    const cached = this.cache.get(key);

    if (!cached) {
      this.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;

    // Move to end (LRU - most recently used)
    this.cache.delete(key);
    this.cache.set(key, cached);

    return cached.data;
  }

  /**
   * Set cached response
   */
  set(key, data, ttl = this.defaultTTL) {
    // Enforce max size (LRU eviction)
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry (first item in Map)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl,
      createdAt: Date.now(),
    });
  }

  /**
   * Clear cache
   */
  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get cache statistics
   */
  stats() {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? ((this.hits / total) * 100).toFixed(2) : 0;

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      hitRate: `${hitRate}%`,
      entries: Array.from(this.cache.entries()).map(([key, value]) => ({
        key,
        expiresIn: Math.max(0, value.expiresAt - Date.now()),
        age: Date.now() - value.createdAt,
      })),
    };
  }

  /**
   * Invalidate cache entries matching pattern
   */
  invalidate(pattern) {
    let removed = 0;
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        removed++;
      }
    }
    return removed;
  }
}

// Global cache instance
const globalCache = new ResponseCache(100, 300000); // 100 entries, 5 min TTL

/**
 * Caching middleware factory
 *
 * @param {object} options - Cache options
 * @param {number} options.ttl - Time to live in milliseconds
 * @param {boolean} options.enabled - Enable/disable caching
 * @param {function} options.shouldCache - Function to determine if response should be cached
 * @returns {function} Express middleware
 */
function cacheMiddleware(options = {}) {
  const {
    ttl = 300000, // 5 minutes
    enabled = true,
    shouldCache = () => true,
  } = options;

  return (req, res, next) => {
    // Skip if caching disabled or not GET request
    if (!enabled || req.method !== 'GET') {
      return next();
    }

    const key = globalCache.generateKey(req);
    const cached = globalCache.get(key);

    // Return cached response if available
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('X-Cache-Key', key);
      return res.json(cached);
    }

    // Cache miss - intercept response
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('X-Cache-Key', key);

    // Store original json function
    const originalJson = res.json.bind(res);

    // Override json function to cache response
    res.json = function (body) {
      // Only cache successful responses
      if (res.statusCode === 200 && shouldCache(req, body)) {
        globalCache.set(key, body, ttl);
      }

      return originalJson(body);
    };

    next();
  };
}

/**
 * Cache statistics endpoint handler
 */
function cacheStatsHandler(req, res) {
  res.json({
    success: true,
    data: globalCache.stats(),
  });
}

/**
 * Cache clear endpoint handler
 */
function cacheClearHandler(req, res) {
  const { pattern } = req.query;

  if (pattern) {
    const removed = globalCache.invalidate(pattern);
    res.json({
      success: true,
      message: `Invalidated ${removed} cache entries matching '${pattern}'`,
      removed,
    });
  } else {
    globalCache.clear();
    res.json({
      success: true,
      message: 'Cache cleared',
    });
  }
}

module.exports = {
  cacheMiddleware,
  cacheStatsHandler,
  cacheClearHandler,
  globalCache,
};
