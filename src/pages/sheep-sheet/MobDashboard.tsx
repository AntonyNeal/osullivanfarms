import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MobKPI, MobFilters, FarmSummary } from './types';

// Mock data for demonstration (will be replaced with API calls)
const mockMobs: MobKPI[] = [
  {
    mob_id: 1,
    mob_name: 'Mob 1 - Merino Ewes',
    breed_name: 'Merinos',
    status_name: 'ewe',
    zone_name: 'Deni',
    team_name: 'Self Replacing',
    current_stage: 'Scanning',
    current_location: 'home paddock',
    ewes_joined: 545,
    rams_in: 11,
    joining_date: '2024-11-01',
    scanning_date: '2025-02-06',
    in_lamb: 465,
    dry: 25,
    twins: 200,
    singles: 265,
    scanning_percent: 158.0,
    is_active: true,
    last_updated: '2025-02-06T10:30:00Z',
  },
  {
    mob_id: 2,
    mob_name: 'Mob 2 - Dohne Maidens',
    breed_name: 'Dohnes',
    status_name: 'maidens',
    zone_name: 'Elmore',
    team_name: 'Terminal',
    current_stage: 'Joining',
    current_location: 'north paddock',
    ewes_joined: 320,
    rams_in: 8,
    joining_date: '2024-11-15',
    is_active: true,
    last_updated: '2024-11-15T14:20:00Z',
  },
];

const mockSummary: FarmSummary = {
  total_mobs: 26,
  total_ewes: 12480,
  avg_scanning_percent: 152.3,
  avg_marking_percent: 135.8,
  avg_weaning_percent: 128.4,
};

export default function MobDashboard() {
  const [mobs] = useState<MobKPI[]>(mockMobs);
  const [summary] = useState<FarmSummary>(mockSummary);
  const [_filters, _setFilters] = useState<MobFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'scoreboard' | 'list'>('scoreboard');

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
    <div className={`bg-gradient-to-br ${color} rounded-xl p-6 shadow-lg`}>
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">{title}</h3>
      <div className="text-4xl font-bold text-gray-900 mb-1">{value}</div>
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
    </div>
  );

  // Mob Row Component
  const MobRow = ({ mob }: { mob: MobKPI }) => (
    <Link
      to={`/sheep-sheet/mob/${mob.mob_id}`}
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 border border-gray-200 hover:border-green-400"
    >
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="md:col-span-2">
          <h3 className="font-semibold text-gray-900 mb-1">
            {mob.mob_name || `Mob ${mob.mob_id}`}
          </h3>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{mob.breed_name}</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">{mob.zone_name}</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">{mob.team_name}</span>
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1">Stage</div>
          <div className="font-medium text-gray-900">{mob.current_stage}</div>
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1">Ewes Joined</div>
          <div className="font-medium text-gray-900">{mob.ewes_joined || '-'}</div>
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1">Scanning %</div>
          <div
            className={`font-bold text-lg ${
              mob.scanning_percent && mob.scanning_percent >= 150
                ? 'text-green-600'
                : mob.scanning_percent && mob.scanning_percent >= 130
                  ? 'text-amber-600'
                  : mob.scanning_percent
                    ? 'text-red-600'
                    : 'text-gray-400'
            }`}
          >
            {mob.scanning_percent ? `${mob.scanning_percent.toFixed(0)}%` : '-'}
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
      {/* Scoreboard View */}
      {viewMode === 'scoreboard' && (
        <div className="space-y-6">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
              value={`${summary.avg_scanning_percent?.toFixed(1) || 0}%`}
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

          {/* Stage Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Mobs by Stage</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {['Joining', 'Scanning', 'Lambing', 'Marking', 'Weaning'].map((stage) => (
                <div key={stage} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-gray-900">
                    {Math.floor(Math.random() * 8) + 2}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{stage}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-md p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('scoreboard')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              viewMode === 'scoreboard'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Scoreboard
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              viewMode === 'list'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            List View
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center space-x-2 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Filter Mobs</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">All Breeds</option>
                <option>Merinos</option>
                <option>Dohnes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Zone</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">All Zones</option>
                <option>Deni</option>
                <option>Elmore</option>
                <option>Goolgowi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Team</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">All Teams</option>
                <option>Self Replacing</option>
                <option>Terminal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
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

      {/* Mob List */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900">All Mobs ({mobs.length})</h2>
        {mobs.map((mob) => (
          <MobRow key={mob.mob_id} mob={mob} />
        ))}
      </div>
    </div>
  );
}
