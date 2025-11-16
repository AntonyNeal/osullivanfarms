import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MobKPI, MobFilters, FarmSummary } from './types';
import { mobsApi } from '../../lib/api';

export default function MobDashboard() {
  const [mobs, setMobs] = useState<MobKPI[]>([]);
  const [summary, setSummary] = useState<FarmSummary>({
    total_mobs: 0,
    total_ewes: 0,
    avg_scanning_percent: 0,
    avg_marking_percent: 0,
    avg_weaning_percent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [_filters, _setFilters] = useState<MobFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(true);
  const [showListView, setShowListView] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch mobs and statistics in parallel
        const [mobsResponse, statsResponse] = await Promise.all([
          mobsApi.getAllMobs(),
          mobsApi.getFarmStatistics(),
        ]);

        setMobs(mobsResponse.data || []);
        setSummary({
          total_mobs: parseInt(statsResponse.data.total_mobs) || 0,
          total_ewes: parseInt(statsResponse.data.total_ewes) || 0,
          avg_scanning_percent: parseFloat(statsResponse.data.avg_scanning_percent) || 0,
          avg_marking_percent: parseFloat(statsResponse.data.avg_marking_percent) || 0,
          avg_weaning_percent: parseFloat(statsResponse.data.avg_weaning_percent) || 0,
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load farm data. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // KPI Card Component
  const KPICard = ({
    title,
    value,
    subtitle,
    color,
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    color: string;
  }) => (
    <div
      className={`bg-gradient-to-br ${color} rounded-lg md:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg`}
    >
      <h3 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1 sm:mb-2">
        {title}
      </h3>
      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1">{value}</div>
      {subtitle && <p className="text-xs sm:text-sm text-gray-600">{subtitle}</p>}
    </div>
  );

  // Mob Row Component
  const MobRow = ({ mob }: { mob: MobKPI }) => (
    <Link
      to={`/mob/${mob.mob_id}`}
      className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-3 sm:p-4 border border-gray-200 hover:border-green-400 min-h-0"
    >
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 sm:gap-4">
        <div className="md:col-span-2">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
            {mob.mob_name || `Mob ${mob.mob_id}`}
          </h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{mob.breed_name}</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">{mob.zone_name}</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">{mob.team_name}</span>
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1">Stage</div>
          <div className="text-sm sm:text-base font-medium text-gray-900">{mob.current_stage}</div>
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1">Ewes Joined</div>
          <div className="text-sm sm:text-base font-medium text-gray-900">
            {mob.ewes_joined || '-'}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1">Scanning %</div>
          <div
            className={`font-bold text-base sm:text-lg ${
              mob.scanning_percent && parseFloat(mob.scanning_percent as string) >= 150
                ? 'text-green-600'
                : mob.scanning_percent && parseFloat(mob.scanning_percent as string) >= 130
                  ? 'text-amber-600'
                  : mob.scanning_percent
                    ? 'text-red-600'
                    : 'text-gray-400'
            }`}
          >
            {mob.scanning_percent
              ? `${parseFloat(mob.scanning_percent as string).toFixed(0)}%`
              : '-'}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1">Location</div>
          <div className="font-medium text-gray-700 text-sm">{mob.current_location || '-'}</div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Loading State */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="animate-pulse">
            <div className="text-lg font-semibold text-blue-900 mb-2">Loading farm data...</div>
            <div className="text-sm text-blue-700">Fetching mobs and statistics from database</div>
          </div>
        </div>
      )}
      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <svg
              className="w-6 h-6 text-red-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-1">Error Loading Data</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      {/* Toolbar - Usage frequency: Scoreboard (10-15x) > List View (5-10x) > Filters (2-3x) > Farm Advisor (1-2x) */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {/* HIGHEST PRIORITY: Scoreboard - Largest, Blue */}
          <button
            onClick={() => setShowScoreboard(!showScoreboard)}
            className={`px-5 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ${
              showScoreboard
                ? 'bg-blue-600 text-white shadow-blue-300'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            📊 Scoreboard
          </button>

          {/* SECOND PRIORITY: List View - Large, Green */}
          <button
            onClick={() => setShowListView(!showListView)}
            className={`px-5 sm:px-7 py-2.5 sm:py-3 text-base sm:text-lg rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ${
              showListView
                ? 'bg-green-600 text-white shadow-green-300'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            📋 List View
          </button>

          {/* THIRD PRIORITY: Filters - Medium, Amber */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg font-semibold flex items-center space-x-1.5 transition-all ${
              showFilters
                ? 'bg-amber-600 text-white'
                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            }`}
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span>Filters</span>
          </button>

          {/* FOURTH PRIORITY: Farm Advisor - Smaller, Purple */}
          <button
            onClick={() => setShowAssistant(!showAssistant)}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg font-semibold flex items-center space-x-1.5 transition-all ${
              showAssistant
                ? 'bg-purple-600 text-white'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <span>Farm Advisor</span>
          </button>
        </div>
      )}{' '}
      {/* Filter Panel - THIRD PRIORITY: Occasional use 2-3x/day */}
      {!loading && !error && showFilters && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-5">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">Filter Mobs</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Breed</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">All Breeds</option>
                <option>Merinos</option>
                <option>Dohnes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Zone</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">All Zones</option>
                <option>Deni</option>
                <option>Elmore</option>
                <option>Goolgowi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Team</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">All Teams</option>
                <option>Self Replacing</option>
                <option>Terminal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Stage</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">All Stages</option>
                <option>Joining</option>
                <option>Scanning</option>
                <option>Lambing</option>
                <option>Marking</option>
                <option>Weaning</option>
              </select>
            </div>
          </div>
        </div>
      )}
      {/* Farm Advisor Panel - FOURTH PRIORITY: Infrequent use 1-2x/day */}
      {!loading && !error && showAssistant && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Farm Advisor</h3>
            <span className="text-xs text-gray-500">AI Assistant</span>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-sm text-gray-700">
                👋 G&apos;day! I&apos;m your Farm Advisor. Ask me about your mobs, breeding
                statistics, or farm management advice.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about your flock..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium">
                Ask
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs transition">
                What&apos;s my best performing mob?
              </button>
              <button className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs transition">
                Show scanning trends
              </button>
              <button className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs transition">
                Compare zones
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Scoreboard View - HIGHEST PRIORITY: Quick glance 10-15x/day */}
      {!loading && !error && showScoreboard && (
        <div className="space-y-4 sm:space-y-6">
          {/* KPI Summary Cards - Large, prominent display */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            <KPICard
              title="Total Mobs"
              value={summary.total_mobs}
              color="from-blue-100 to-blue-50"
            />
            <KPICard
              title="Total Ewes"
              value={summary.total_ewes?.toLocaleString() || 0}
              color="from-green-100 to-green-50"
            />
            <KPICard
              title="Avg Scanning"
              value={`${summary.avg_scanning_percent ? parseFloat(summary.avg_scanning_percent.toString()).toFixed(1) : 0}%`}
              color="from-purple-100 to-purple-50"
            />
            <KPICard
              title="Avg Marking"
              value={`${summary.avg_marking_percent?.toFixed(1) || 0}%`}
              color="from-amber-100 to-amber-50"
            />
            <KPICard
              title="Avg Weaning"
              value={`${summary.avg_weaning_percent?.toFixed(1) || 0}%`}
              color="from-emerald-100 to-emerald-50"
            />
          </div>

          {/* Stage Distribution - Tall for easy reading */}
          <div className="bg-white rounded-lg md:rounded-xl shadow-md p-4 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Mobs by Stage
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {['Joining', 'Scanning', 'Lambing', 'Marking', 'Weaning'].map((stage) => (
                <div key={stage} className="text-center p-4 sm:p-6 md:p-8 bg-gray-50 rounded-lg">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                    {Math.floor(Math.random() * 8) + 2}
                  </div>
                  <div className="text-sm sm:text-base text-gray-600 mt-2">{stage}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Mob List - SECOND PRIORITY: Main working view 5-10x/day */}
      {!loading && !error && showListView && (
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">All Mobs ({mobs.length})</h2>
          {mobs.map((mob) => (
            <MobRow key={mob.mob_id} mob={mob} />
          ))}
        </div>
      )}
    </div>
  );
}
