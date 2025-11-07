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
}

interface Slot {
  status: string;
}

export function SDKTests() {
  const [results, setResults] = useState<TestResult[]>([
    { name: 'Tenant API - Fetch Claire', status: 'idle', message: '' },
    { name: 'Locations API - List Locations', status: 'idle', message: '' },
    { name: 'Availability API - Check Calendar', status: 'idle', message: '' },
    { name: 'Analytics API - Get Summary', status: 'idle', message: '' },
  ]);

  // Force the API base URL to avaliable.pro
  const API_BASE = 'https://avaliable.pro/api';

  const updateTestStatus = (testName: string, status: TestResult['status'], message: string) => {
    setResults((prev) =>
      prev.map((r) => (r.name === testName ? { ...r, status, message } : r))
    );
  };

  const runAllTests = async () => {
    // Reset all tests to idle first
    setResults((prev) => prev.map((r) => ({ ...r, status: 'idle' as const, message: '' })));

    const id = await testTenant();
    if (id) {
      await testLocations(id);
      await testAvailability(id);
      await testAnalytics(id);
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
      const res = await fetch(`${API_BASE}/locations/tenant/${id}`);

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

  const successCount = results.filter((r) => r.status === 'success').length;
  const failedCount = results.filter((r) => r.status === 'error').length;
  const runningCount = results.filter((r) => r.status === 'running').length;
  const totalTests = results.length;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">API Endpoint Tests</h3>
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

      <div className="space-y-3">
        {results.map((result, idx) => (
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
            } rounded-lg p-4 transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-semibold text-white">{result.name}</h4>
              {result.status === 'running' && (
                <span className="animate-spin text-yellow-400">⏳</span>
              )}
              {result.status === 'success' && <span className="text-green-400">✓</span>}
              {result.status === 'error' && <span className="text-red-400">✗</span>}
            </div>
            {result.message && (
              <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono bg-slate-900/50 p-3 rounded">
                {result.message}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
