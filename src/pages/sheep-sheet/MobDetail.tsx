import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MobKPI, MobDetailTab } from './types';

// Mock mob data
const mockMob: MobKPI = {
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
};

export default function MobDetail() {
  const { mobId: _mobId } = useParams();
  const [activeTab, setActiveTab] = useState<MobDetailTab>('overview');
  const [mob] = useState<MobKPI>(mockMob);
  const [_isEditing, _setIsEditing] = useState(false);

  const tabs: { id: MobDetailTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'joining', label: 'Joining', icon: '🐏' },
    { id: 'scanning', label: 'Scanning', icon: '📡' },
    { id: 'lambing', label: 'Lambing', icon: '🐑' },
    { id: 'marking', label: 'Marking', icon: '✂️' },
    { id: 'weaning', label: 'Weaning', icon: '👶' },
    { id: 'history', label: 'History', icon: '📜' },
  ];

  const DataField = ({
    label,
    value,
    unit = '',
  }: {
    label: string;
    value: string | number | null | undefined;
    unit?: string;
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <div className="text-lg font-semibold text-gray-900">
        {value !== null && value !== undefined ? `${value}${unit}` : '-'}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-600 font-medium">Ewes Joined</div>
                <div className="text-2xl font-bold text-blue-900">{mob.ewes_joined || '-'}</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm text-purple-600 font-medium">Scanning %</div>
                <div className="text-2xl font-bold text-purple-900">
                  {mob.scanning_percent ? `${mob.scanning_percent}%` : '-'}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-green-600 font-medium">In Lamb</div>
                <div className="text-2xl font-bold text-green-900">{mob.in_lamb || '-'}</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-4">
                <div className="text-sm text-amber-600 font-medium">Current Stage</div>
                <div className="text-xl font-bold text-amber-900">{mob.current_stage}</div>
              </div>
            </div>

            {/* Mob Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Mob Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <DataField label="Breed" value={mob.breed_name} />
                <DataField label="Status" value={mob.status_name} />
                <DataField label="Zone" value={mob.zone_name} />
                <DataField label="Team" value={mob.team_name} />
                <DataField label="Current Location" value={mob.current_location} />
                <DataField
                  label="Last Updated"
                  value={new Date(mob.last_updated).toLocaleString()}
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Breeding Timeline</h3>
              <div className="space-y-4">
                {[
                  { stage: 'Joining', date: mob.joining_date, status: 'completed' },
                  { stage: 'Scanning', date: mob.scanning_date, status: 'completed' },
                  { stage: 'Lambing', date: null, status: 'upcoming' },
                  { stage: 'Marking', date: null, status: 'upcoming' },
                  { stage: 'Weaning', date: null, status: 'upcoming' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.status === 'completed'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {item.status === 'completed' ? '✓' : idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{item.stage}</div>
                      <div className="text-sm text-gray-500">
                        {item.date ? new Date(item.date).toLocaleDateString() : 'Not started'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'joining':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Joining Data</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <DataField label="Start Date" value={mob.joining_date} />
              <DataField label="End Date" value="-" />
              <DataField label="Ewes Joined" value={mob.ewes_joined} />
              <DataField label="Rams In" value={mob.rams_in} />
            </div>
          </div>
        );

      case 'scanning':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Scanning Data</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <DataField label="Scanning Date" value={mob.scanning_date} />
                <DataField label="In Lamb" value={mob.in_lamb} />
                <DataField label="Dry" value={mob.dry} />
                <DataField label="Twins" value={mob.twins} />
                <DataField label="Singles" value={mob.singles} />
                <DataField label="Scanning %" value={mob.scanning_percent} unit="%" />
              </div>
            </div>

            {/* Scanning Calculation Breakdown */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h4 className="font-semibold text-blue-900 mb-3">Calculation Details</h4>
              <div className="text-sm text-blue-800 space-y-2">
                <div>Formula: ((Twins × 2) + Singles) ÷ In Lamb × 100</div>
                <div>
                  Calculation: (({mob.twins} × 2) + {mob.singles}) ÷ {mob.in_lamb} × 100 ={' '}
                  {mob.scanning_percent}%
                </div>
              </div>
            </div>
          </div>
        );

      case 'marking':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Marking Data</h3>
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">✂️</div>
              <p>No marking data recorded yet</p>
            </div>
          </div>
        );

      case 'weaning':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Weaning Data</h3>
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">👶</div>
              <p>No weaning data recorded yet</p>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Change History</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 pb-4 border-b border-gray-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Scanning data recorded</div>
                  <div className="text-xs text-gray-500">Feb 6, 2025 at 10:30 AM</div>
                  <div className="text-sm text-gray-600 mt-1">Scanning % updated to 158%</div>
                </div>
              </div>
              <div className="flex items-start space-x-4 pb-4 border-b border-gray-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Joining completed</div>
                  <div className="text-xs text-gray-500">Dec 15, 2024 at 4:00 PM</div>
                  <div className="text-sm text-gray-600 mt-1">545 ewes joined with 11 rams</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">{String(activeTab)} Data</h3>
            <div className="text-center text-gray-500 py-8">
              <p>No data available yet</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header with Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Link
                to="/"
                className="text-green-600 hover:text-green-700 text-sm font-medium mb-2 inline-flex items-center"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{mob.mob_name}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {mob.breed_name}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  {mob.zone_name}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {mob.team_name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="overflow-x-auto">
          <div className="flex border-b border-gray-200 min-w-max">
            {tabs.map((tab) => (
              <button
                key={String(tab.id)}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                    : 'text-gray-900 hover:text-green-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}
