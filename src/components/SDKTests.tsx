/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';

// SDK Tests Component
interface TestResult {
  name: string;
  status: 'idle' | 'running' | 'success' | 'error';
  message: string;
}

interface Location {
  city: string;
  country: string;
  availableFrom: string;
  availableUntil?: string;
}

interface Slot {
  status: string;
  isAvailable?: boolean;
  locationCity?: string;
}

interface DateAvailability {
  date: string;
  availabilityCount: number;
}

// Generic interface for API responses
interface GenericObject {
  [key: string]: unknown;
  utilizationRate?: number;
  stage?: string;
  count?: number;
  percentage?: string;
  hashtag?: string;
  postCount?: number;
  totalBookings?: number;
  date?: string;
  followers?: number;
  engagement?: number;
}

// Additional interfaces for type safety
interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

export default function SDKTests() {
  const [results, setResults] = useState<TestResult[]>([
    // Core APIs
    { name: 'Tenant API - Fetch Claire', status: 'idle', message: '' },
    { name: 'Locations API - List Locations', status: 'idle', message: '' },
    { name: 'Availability API - Check Calendar', status: 'idle', message: '' },
    { name: 'Analytics API - Get Summary', status: 'idle', message: '' },

    // Advanced Availability
    { name: 'Availability - Touring Schedule', status: 'idle', message: '' },
    { name: 'Availability - Current Location', status: 'idle', message: '' },
    { name: 'Availability - Check Specific Date', status: 'idle', message: '' },
    { name: 'Availability - Date Range', status: 'idle', message: '' },

    // Tenant Analytics
    { name: 'Analytics - Performance Metrics', status: 'idle', message: '' },
    { name: 'Analytics - Traffic Sources', status: 'idle', message: '' },
    { name: 'Analytics - Location Bookings', status: 'idle', message: '' },
    { name: 'Analytics - Utilization Rate', status: 'idle', message: '' },
    { name: 'Analytics - Conversion Funnel', status: 'idle', message: '' },
    { name: 'Analytics - A/B Test Results', status: 'idle', message: '' },

    // Social Media Analytics
    { name: 'Social - Post Performance', status: 'idle', message: '' },
    { name: 'Social - Platform Comparison', status: 'idle', message: '' },
    { name: 'Social - Top Posts', status: 'idle', message: '' },
    { name: 'Social - Top Hashtags', status: 'idle', message: '' },
    { name: 'Social - Daily Metrics', status: 'idle', message: '' },
    { name: 'Social - Follower Growth', status: 'idle', message: '' },
  ]);

  // Force the API base URL to avaliable.pro
  const API_BASE = 'https://avaliable.pro/api';

  const updateTestStatus = (testName: string, status: TestResult['status'], message: string) => {
    setResults((prev) => prev.map((r) => (r.name === testName ? { ...r, status, message } : r)));
  };

  const runAllTests = async () => {
    // Reset all tests to idle first
    setResults((prev) => prev.map((r) => ({ ...r, status: 'idle' as const, message: '' })));

    const id = await testTenant();
    if (id) {
      // Core APIs
      await testLocations(id);
      await testAvailability(id);
      await testAnalytics(id);

      // Advanced Availability
      await testTouringSchedule(id);
      await testCurrentLocation(id);
      await testCheckSpecificDate(id);
      await testDateRange(id);

      // Tenant Analytics
      await testPerformanceMetrics(id);
      await testTrafficSources(id);
      await testLocationBookings(id);
      await testUtilizationRate(id);
      await testConversionFunnel(id);
      await testABTestResults(id);

      // Social Media Analytics
      await testPostPerformance(id);
      await testPlatformComparison(id);
      await testTopPosts(id);
      await testTopHashtags(id);
      await testDailyMetrics(id);
      await testFollowerGrowth(id);
    }
  };

  const testTenant = async (): Promise<string | null> => {
    const testName = 'Tenant API - Fetch Claire';
    updateTestStatus(testName, 'running', 'Fetching tenant data...');

    try {
      const res = await fetch(`${API_BASE}/tenants/claire`);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();

      if (!json.data || !json.data.id) {
        throw new Error('Invalid response: missing tenant data');
      }

      const id = json.data.id;
      updateTestStatus(
        testName,
        'success',
        `✅ Tenant: ${json.data.name}\nID: ${id}\nSubdomain: ${json.data.subdomain}\nDomain: ${json.data.customDomain || 'N/A'}`
      );
      return id;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      updateTestStatus(testName, 'error', `❌ ${errorMsg}`);
      return null;
    }
  };

  const testLocations = async (id: string) => {
    const testName = 'Locations API - List Locations';
    updateTestStatus(testName, 'running', 'Fetching locations...');

    try {
      const res = await fetch(`${API_BASE}/locations/${id}`);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();
      const locations = json.data as Location[];

      if (!locations || locations.length === 0) {
        throw new Error('No locations found');
      }

      updateTestStatus(
        testName,
        'success',
        `✅ Found ${locations.length} location(s):\n${locations.map((l) => `  • ${l.city}, ${l.country}`).join('\n')}`
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      updateTestStatus(testName, 'error', `❌ ${errorMsg}`);
    }
  };

  const testAvailability = async (id: string) => {
    const testName = 'Availability API - Check Calendar';
    updateTestStatus(testName, 'running', 'Checking availability...');

    try {
      const res = await fetch(
        `${API_BASE}/availability/${id}?startDate=2025-12-01&endDate=2025-12-31`
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();
      const slots = json.data as Slot[];

      const available = slots.filter((s) => s.status === 'available').length;
      const booked = slots.filter((s) => s.status === 'booked').length;

      updateTestStatus(
        testName,
        'success',
        `✅ Calendar loaded\nTotal slots: ${slots.length}\n  • Available: ${available}\n  • Booked: ${booked}`
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      updateTestStatus(testName, 'error', `❌ ${errorMsg}`);
    }
  };

  const testAnalytics = async (id: string) => {
    const testName = 'Analytics API - Get Summary';
    updateTestStatus(testName, 'running', 'Fetching analytics...');

    try {
      const res = await fetch(
        `${API_BASE}/analytics/${id}?startDate=2025-01-01&endDate=2025-12-31`
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();

      updateTestStatus(
        testName,
        'success',
        `✅ Analytics retrieved\n${JSON.stringify(json.data, null, 2).substring(0, 200)}...`
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      updateTestStatus(testName, 'error', `❌ ${errorMsg}`);
    }
  };

  // Advanced Availability Tests
  const testTouringSchedule = async (id: string) => {
    const testName = 'Availability - Touring Schedule';
    updateTestStatus(testName, 'running', 'Fetching touring schedule...');

    try {
      const res = await fetch(`${API_BASE}/availability/${id}/touring-schedule?daysAhead=180`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const json = await res.json();
      const schedule = json.data || [];

      updateTestStatus(
        testName,
        'success',
        `✅ ${schedule.length} upcoming location(s)\n${schedule
          .slice(0, 3)
          .map(
            (loc: Location) =>
              `  • ${loc.city}, ${loc.country} (${loc.availableFrom} to ${loc.availableUntil || 'ongoing'})`
          )
          .join('\n')}`
      );
    } catch (error) {
      updateTestStatus(
        testName,
        'error',
        `❌ ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  const testCurrentLocation = async (id: string) => {
    const testName = 'Availability - Current Location';
    updateTestStatus(testName, 'running', 'Fetching current location...');

    try {
      const res = await fetch(`${API_BASE}/availability/${id}/current-location`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const json = await res.json();
      const loc = json.data;

      updateTestStatus(
        testName,
        'success',
        `✅ Currently in: ${loc.city}, ${loc.country}\nFrom: ${loc.availableFrom}\nUntil: ${loc.availableUntil || 'Ongoing'}`
      );
    } catch (error) {
      updateTestStatus(
        testName,
        'error',
        `❌ ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  const testCheckSpecificDate = async (id: string) => {
    const testName = 'Availability - Check Specific Date';
    updateTestStatus(testName, 'running', 'Checking date availability...');

    try {
      const testDate = '2025-12-15';
      const res = await fetch(`${API_BASE}/availability/${id}/check/${testDate}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const json = await res.json();
      const slots = json.data || [];
      const available = slots.filter((s: Slot) => s.isAvailable);

      updateTestStatus(
        testName,
        'success',
        `✅ Date: ${testDate}\n${available.length} available slot(s)\nLocation: ${slots[0]?.locationCity || 'TBD'}`
      );
    } catch (error) {
      updateTestStatus(
        testName,
        'error',
        `❌ ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  const testDateRange = async (id: string) => {
    const testName = 'Availability - Date Range';
    updateTestStatus(testName, 'running', 'Fetching date range...');

    try {
      const res = await fetch(
        `${API_BASE}/availability/${id}/dates?startDate=2025-12-01&endDate=2025-12-31`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const json = await res.json();
      const dates = json.data || [];

      updateTestStatus(
        testName,
        'success',
        `✅ ${dates.length} available dates in December\nTotal slots: ${dates.reduce((sum: number, d: DateAvailability) => sum + d.availabilityCount, 0)}`
      );
    } catch (error) {
      updateTestStatus(
        testName,
        'error',
        `❌ ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  // Tenant Analytics Tests
  const testPerformanceMetrics = async (id: string) => {
    const testName = 'Analytics - Performance Metrics';
    updateTestStatus(testName, 'running', 'Fetching performance...');

    try {
      const res = await fetch(`${API_BASE}/tenant-analytics/${id}/performance`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const json = await res.json();
      const data = json.data;

      updateTestStatus(
        testName,
        'success',
        `✅ Sessions: ${data.sessions}\nUnique Visitors: ${data.uniqueVisitors}\nBookings: ${data.bookings}\nConversion Rate: ${data.conversionRate}%`
      );
    } catch (error) {
      updateTestStatus(
        testName,
        'error',
        `❌ ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  const testTrafficSources = async (id: string) => {
    const testName = 'Analytics - Traffic Sources';
    updateTestStatus(testName, 'running', 'Fetching traffic sources...');

    try {
      const res = await fetch(`${API_BASE}/tenant-analytics/${id}/traffic-sources`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const json = await res.json();
      const sources = json.data || [];

      updateTestStatus(
        testName,
        'success',
        `✅ ${sources.length} traffic source(s)\n${sources
          .slice(0, 3)
          .map(
            (s: GenericObject) =>
              `  • ${s.source}/${s.medium}: ${s.sessions} sessions, ${s.conversions} conversions`
          )
          .join('\n')}`
      );
    } catch (error) {
      updateTestStatus(
        testName,
        'error',
        `❌ ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  const testLocationBookings = async (id: string) => {
    const testName = 'Analytics - Location Bookings';
    updateTestStatus(testName, 'running', 'Fetching location stats...');

    try {
      const res = await fetch(`${API_BASE}/tenant-analytics/${id}/location-bookings`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const json = await res.json();
      const locations = json.data || [];

      updateTestStatus(
        testName,
        'success',
        `✅ ${locations.length} location(s) tracked\n${locations
          .slice(0, 2)
          .map(
            (l: GenericObject) =>
              `  • ${l.city}: ${l.totalBookings} bookings (${l.completedBookings} completed)`
          )
          .join('\n')}`
      );
    } catch (error) {
      updateTestStatus(
        testName,
        'error',
        `❌ ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  const testUtilizationRate = async (id: string) => {
    const testName = 'Analytics - Utilization Rate';
    updateTestStatus(testName, 'running', 'Calculating utilization...');

    try {
      const res = await fetch(
        `${API_BASE}/tenant-analytics/${id}/availability-utilization?startDate=2025-11-01&endDate=2025-11-30`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const json = await res.json();
      const data = json.data || [];
      const avgUtil =
        data.length > 0
          ? (
              data.reduce(
                (sum: number, d: GenericObject) => sum + (d.utilizationRate as number),
                0
              ) / data.length
            ).toFixed(1)
          : 0;

      updateTestStatus(
        testName,
        'success',
        `✅ ${data.length} days analyzed\nAverage utilization: ${avgUtil}%`
      );
    } catch (error) {
      updateTestStatus(
        testName,
        'error',
        `❌ ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  const testConversionFunnel = async (id: string) => {
    const testName = 'Analytics - Conversion Funnel';
    updateTestStatus(testName, 'running', 'Building funnel...');

    try {
      const res = await fetch(
        `${API_BASE}/tenant-analytics/${id}/conversion-funnel?startDate=2025-01-01&endDate=2025-12-31`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const json = await res.json();
      const stages = json.data || [];

      updateTestStatus(
        testName,
        'success',
        `✅ Conversion Funnel:\n${stages
          .map((s: GenericObject) => `  ${s.stage}: ${s.count} (${s.percentage}%)`)
          .join('\n')}`
      );
    } catch (error) {
      updateTestStatus(
        testName,
        'error',
        `❌ ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  // Social Media Analytics Tests
  const testPostPerformance = async (id: string) => {
    const testName = 'Social - Post Performance';
    updateTestStatus(testName, 'running', 'Analyzing posts...');

    try {
      const res = await fetch(`${API_BASE}/social-analytics/${id}/post-performance?limit=5`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const json = await res.json();
      const posts = json.data || [];

      updateTestStatus(
        testName,
        'success',
        `✅ ${posts.length} posts analyzed\n${posts
          .slice(0, 2)
          .map(
            (p: GenericObject) =>
              `  • ${p.platform}: ${p.engagement?.likes} likes, ${p.conversions?.bookings} bookings`
          )
          .join('\n')}`
      );
    } catch (error) {
      updateTestStatus(
        testName,
        'error',
        `❌ ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  const testPlatformComparison = async (id: string) => {
    const testName = 'Social - Platform Comparison';
    updateTestStatus(testName, 'running', 'Comparing platforms...');

    try {
      const res = await fetch(`${API_BASE}/social-analytics/${id}/platform-performance`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const json = await res.json();
      const platforms = json.data || [];

      updateTestStatus(
        testName,
        'success',
        `✅ ${platforms.length} platform(s) active\n${platforms
          .map(
            (p: any) =>
              `  • ${p.platform}: ${p.posts.total} posts, ${p.conversions.bookings} bookings`
          )
          .join('\n')}`
      );
    } catch (error) {
      updateTestStatus(
        testName,
        'error',
        `❌ ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  const testTopPosts = async (id: string) => {
    const testName = 'Social - Top Posts';
    updateTestStatus(testName, 'running', 'Finding top posts...');

    try {
      const res = await fetch(`${API_BASE}/social-analytics/${id}/top-posts?limit=3`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const json = await res.json();
      const posts = json.data || [];

      updateTestStatus(
        testName,
        'success',
        `✅ Top ${posts.length} posts:\n${posts
          .map(
            (p: any) =>
              `  • ${p.platform} (${p.performanceScore.toFixed(0)} score): ${p.engagement.likes} likes`
          )
          .join('\n')}`
      );
    } catch (error) {
      updateTestStatus(
        testName,
        'error',
        `❌ ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  const testTopHashtags = async (id: string) => {
    const testName = 'Social - Top Hashtags';
    updateTestStatus(testName, 'running', 'Analyzing hashtags...');

    try {
      const res = await fetch(`${API_BASE}/social-analytics/${id}/top-hashtags?days=90&limit=5`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const json = await res.json();
      const hashtags = json.data || [];

      updateTestStatus(
        testName,
        'success',
        `✅ Top ${hashtags.length} hashtags:\n${hashtags
          .map((h: any) => `  ${h.hashtag}: ${h.postCount} posts, ${h.totalBookings} bookings`)
          .join('\n')}`
      );
    } catch (error) {
      updateTestStatus(
        testName,
        'error',
        `❌ ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  const testABTestResults = async (id: string) => {
    const testName = 'Analytics - A/B Test Results';
    updateTestStatus(testName, 'running', 'Fetching A/B test data...');

    try {
      const res = await fetch(`${API_BASE}/tenant-analytics/${id}/ab-test-results`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const json = await res.json();
      const tests = json.data || [];

      updateTestStatus(
        testName,
        'success',
        `✅ ${tests.length} A/B tests:\n${tests
          .slice(0, 2)
          .map(
            (t: any) =>
              `  • ${t.testName}: ${t.variants.length} variants (best: ${(t.variants[0]?.conversionRate * 100 || 0).toFixed(1)}%)`
          )
          .join('\n')}`
      );
    } catch (error) {
      updateTestStatus(
        testName,
        'error',
        `❌ ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  const testDailyMetrics = async (id: string) => {
    const testName = 'Social - Daily Metrics';
    updateTestStatus(testName, 'running', 'Fetching daily metrics...');

    try {
      const res = await fetch(`${API_BASE}/social-analytics/${id}/daily-metrics?days=7`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const json = await res.json();
      const metrics = json.data || [];

      updateTestStatus(
        testName,
        'success',
        `✅ ${metrics.length} days of data:\n${metrics
          .slice(0, 2)
          .map((m: any) => `  • ${m.date}: ${m.followers} followers, ${m.engagement} engagements`)
          .join('\n')}`
      );
    } catch (error) {
      updateTestStatus(
        testName,
        'error',
        `❌ ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  const testFollowerGrowth = async (id: string) => {
    const testName = 'Social - Follower Growth';
    updateTestStatus(testName, 'running', 'Analyzing follower growth...');

    try {
      const res = await fetch(`${API_BASE}/social-analytics/${id}/follower-growth?days=30`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const json = await res.json();
      const summary = json.summary || {};

      updateTestStatus(
        testName,
        'success',
        `✅ Growth summary:\n  • Total gain: ${summary.totalGrowth || 0}\n  • Avg rate: ${(summary.avgGrowthRate || 0).toFixed(2)}%/day\n  • Peak day: ${summary.peakGrowthDate || 'N/A'} (+${summary.peakGrowth || 0})`
      );
    } catch (error) {
      updateTestStatus(
        testName,
        'error',
        `❌ ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  const successCount = results.filter((r) => r.status === 'success').length;
  const failedCount = results.filter((r) => r.status === 'error').length;
  const runningCount = results.filter((r) => r.status === 'running').length;
  const totalTests = results.length;

  // Group tests by category
  const categories = [
    {
      name: 'Core APIs',
      icon: '🔌',
      tests: results.filter((r) =>
        ['Tenant API', 'Locations API', 'Availability API', 'Analytics API'].some((prefix) =>
          r.name.startsWith(prefix)
        )
      ),
    },
    {
      name: 'Advanced Availability',
      icon: '📅',
      tests: results.filter((r) => r.name.startsWith('Availability - ')),
    },
    {
      name: 'Tenant Analytics',
      icon: '📊',
      tests: results.filter((r) => r.name.startsWith('Analytics - ')),
    },
    {
      name: 'Social Media',
      icon: '📱',
      tests: results.filter((r) => r.name.startsWith('Social - ')),
    },
  ];

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">🧪 Comprehensive API Tests</h3>
          <p className="text-slate-400 text-sm">Testing: {API_BASE}</p>
        </div>
        <button
          onClick={runAllTests}
          disabled={runningCount > 0}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/50 disabled:cursor-not-allowed"
        >
          {runningCount > 0 ? '⏳ Running Tests...' : '▶️ Run All Tests'}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900/50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-400">{totalTests}</div>
          <div className="text-sm text-slate-400">Total Tests</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-400">{successCount}</div>
          <div className="text-sm text-slate-400">Passed</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-red-400">{failedCount}</div>
          <div className="text-sm text-slate-400">Failed</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-yellow-400">{runningCount}</div>
          <div className="text-sm text-slate-400">Running</div>
        </div>
      </div>

      <div className="space-y-6">
        {categories.map((category, catIdx) => (
          <div key={catIdx}>
            <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span>{category.icon}</span>
              <span>{category.name}</span>
              <span className="text-sm font-normal text-slate-400">
                ({category.tests.filter((t) => t.status === 'success').length}/
                {category.tests.length} passed)
              </span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {category.tests.map((result, idx) => (
                <div
                  key={idx}
                  className={`border-l-4 ${
                    result.status === 'success'
                      ? 'border-green-500 bg-green-900/20'
                      : result.status === 'error'
                        ? 'border-red-500 bg-red-900/20'
                        : result.status === 'running'
                          ? 'border-yellow-500 bg-yellow-900/20'
                          : 'border-slate-500 bg-slate-900/20'
                  } rounded-lg p-4 transition-all duration-300 hover:shadow-lg`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-base font-semibold text-white">{result.name}</h5>
                    {result.status === 'running' && (
                      <span className="animate-spin text-yellow-400">⏳</span>
                    )}
                    {result.status === 'success' && (
                      <span className="text-green-400 text-xl">✓</span>
                    )}
                    {result.status === 'error' && <span className="text-red-400 text-xl">✗</span>}
                  </div>
                  {result.message && (
                    <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono bg-slate-900/50 p-2 rounded max-h-32 overflow-y-auto">
                      {result.message}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
