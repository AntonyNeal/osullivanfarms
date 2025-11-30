import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MobKPI, MobDetailTab, MobEditableData } from './types';
import { useFarmData } from '../../core/hooks/useFarmData';
import { calculateDerivedFields } from './calculations';
import MobEditPanel from './MobEditPanel';

// Convert MobKPI to MobEditableData for editing
function mobKpiToEditable(mob: MobKPI): MobEditableData {
  return {
    mob_id: mob.mob_id,
    mob_name: mob.mob_name,
    ewe_breed: mob.breed_name as MobEditableData['ewe_breed'],
    status: mob.status_name as MobEditableData['status'],
    zone: mob.zone_name as MobEditableData['zone'],
    current_location: mob.current_location,
    team: mob.team_name as MobEditableData['team'],
    joining_start: mob.joining_date,
    ewe_count: mob.ewes_joined,
    rams_in: mob.rams_in,
    actual_scanning_date: mob.scanning_date,
    twins: mob.twins,
    singles: mob.singles,
    in_lamb: mob.in_lamb,
    dry: mob.dry,
    scanning_percent:
      typeof mob.scanning_percent === 'string'
        ? parseFloat(mob.scanning_percent)
        : mob.scanning_percent,
    actual_marking_date: mob.marking_date,
    wethers_terminals: mob.wethers,
    ewe_lambs: mob.ewe_lambs,
    weaning_date: mob.weaning_date,
  };
}

export default function MobDetail() {
  const { mobId } = useParams();
  const [activeTab, setActiveTab] = useState<MobDetailTab>('overview');
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);

  // Get data and actions from centralized store
  const { getMobById, updateMob, isLoading, isInitialized } = useFarmData();

  // Get mob from in-memory store (no API call needed!)
  const mob = mobId ? getMobById(parseInt(mobId)) : undefined;

  // Handle save from edit panel - uses store's updateMob (queues if offline)
  const handleSave = async (data: MobEditableData) => {
    if (!mobId) return;
    await updateMob(parseInt(mobId), data);
  };

  // Calculate derived fields for display
  const editableData = mob ? mobKpiToEditable(mob) : ({} as MobEditableData);
  // Note: calculatedData can be used in future to display projected dates/KPIs
  const _calculatedData = calculateDerivedFields(editableData);

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

  // Loading state - only show if store isn't initialized yet
  if (isLoading && !isInitialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading farm data...</p>
        </div>
      </div>
    );
  }

  // Mob not found state
  if (!mob) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-amber-900 mb-2">Mob Not Found</h3>
        <p className="text-amber-700">
          {mobId ? `Mob #${mobId} was not found in the cached data.` : 'No mob ID provided.'}
        </p>
        <p className="text-amber-600 text-sm mt-2">
          This may happen if the data has not been synced yet. Try refreshing from the dashboard.
        </p>
        <Link to="/" className="mt-4 inline-block text-green-600 hover:text-green-700 font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

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

            {/* Edit Button */}
            <button
              onClick={() => setIsEditPanelOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span>Edit</span>
            </button>
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

      {/* Edit Panel */}
      <MobEditPanel
        isOpen={isEditPanelOpen}
        onClose={() => setIsEditPanelOpen(false)}
        initialData={editableData}
        onSave={handleSave}
        mobId={mob.mob_id}
      />
    </div>
  );
}
