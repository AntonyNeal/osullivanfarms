import React, { useState } from 'react';
import { Download, Plus, Filter, Search, Camera, MapPin, AlertCircle } from 'lucide-react';

/**
 * Sheep Flock Management Spreadsheet Component
 * Interactive demo of the upcoming digital flock management system
 * Showcases the MVP features for Hope & Leigh's operation
 */

interface SheepRecord {
  id: string;
  mobName: string;
  tagNumber: string;
  paddock: string;
  count: number;
  breed: string;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  lastTreatment: string;
  withholdingUntil?: string;
  notes: string;
  photoCount: number;
  lastUpdated: string;
  updatedBy: string;
}

const mockData: SheepRecord[] = [
  {
    id: '1',
    mobName: 'East Paddock Ewes',
    tagNumber: 'MOB-001',
    paddock: 'East 40',
    count: 85,
    breed: 'Merino',
    condition: 'Excellent',
    lastTreatment: 'Drench - 15/10/2025',
    withholdingUntil: '29/10/2025',
    notes: 'Ready for joining. Water trough checked.',
    photoCount: 3,
    lastUpdated: '08/11/2025 2:30 PM',
    updatedBy: 'Leigh',
  },
  {
    id: '2',
    mobName: 'Lambing Mob A',
    tagNumber: 'MOB-002',
    paddock: 'West 15',
    count: 42,
    breed: 'Border Leicester x Merino',
    condition: 'Good',
    lastTreatment: 'Vaccination - 01/11/2025',
    notes: 'Due to lamb mid-November. Monitor closely.',
    photoCount: 5,
    lastUpdated: '07/11/2025 8:15 AM',
    updatedBy: 'Hope',
  },
  {
    id: '3',
    mobName: 'Weaners North',
    tagNumber: 'MOB-003',
    paddock: 'North 22',
    count: 68,
    breed: 'Merino',
    condition: 'Good',
    lastTreatment: 'Drench - 20/10/2025',
    withholdingUntil: '03/11/2025',
    notes: 'Growing well. Move to better feed next week.',
    photoCount: 2,
    lastUpdated: '06/11/2025 4:45 PM',
    updatedBy: 'Leigh',
  },
  {
    id: '4',
    mobName: 'Ram Group',
    tagNumber: 'MOB-004',
    paddock: 'South 8',
    count: 12,
    breed: 'Merino',
    condition: 'Excellent',
    lastTreatment: 'Feet trim - 28/10/2025',
    notes: 'Condition scoring good. Ready for joining season.',
    photoCount: 1,
    lastUpdated: '05/11/2025 11:20 AM',
    updatedBy: 'Leigh',
  },
  {
    id: '5',
    mobName: 'Hoggets',
    tagNumber: 'MOB-005',
    paddock: 'East 28',
    count: 55,
    breed: 'Poll Merino',
    condition: 'Fair',
    lastTreatment: 'Drench - 25/10/2025',
    notes: 'Moved from dry paddock. Watch for improvement.',
    photoCount: 4,
    lastUpdated: '08/11/2025 9:00 AM',
    updatedBy: 'Hope',
  },
];

export const SheepManagementSpreadsheet: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState<string>('all');

  const filteredData = mockData.filter((record) => {
    const matchesSearch =
      record.mobName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.paddock.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.breed.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterCondition === 'all' || record.condition === filterCondition;

    return matchesSearch && matchesFilter;
  });

  const conditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent':
        return 'bg-green-100 text-green-800';
      case 'Good':
        return 'bg-blue-100 text-blue-800';
      case 'Fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'Poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-2 border-emerald-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                🐑 Flock Management System
              </h1>
              <p className="text-gray-600">
                Digital sheep tracking for O&apos;Sullivan Farms •{' '}
                <span className="text-amber-600 font-semibold">BETA PREVIEW</span>
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                <Plus size={20} />
                <span className="hidden md:inline">Add Mob</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Download size={20} />
                <span className="hidden md:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
              <div className="text-2xl font-bold text-emerald-700">262</div>
              <div className="text-sm text-gray-600">Total Sheep</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">5</div>
              <div className="text-sm text-gray-600">Active Mobs</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
              <div className="text-2xl font-bold text-amber-700">2</div>
              <div className="text-sm text-gray-600">Withholding</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <div className="text-2xl font-bold text-purple-700">15</div>
              <div className="text-sm text-gray-600">Photos Today</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search mobs, paddocks, breeds..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Condition Filter */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filterCondition}
                onChange={(e) => setFilterCondition(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Conditions</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Spreadsheet Table */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Mob Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Paddock</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Count</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Breed</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Condition</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Last Treatment</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Notes</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Photos</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((record, idx) => (
                  <tr
                    key={record.id}
                    className={`hover:bg-emerald-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{record.mobName}</div>
                      <div className="text-xs text-gray-500">{record.tagNumber}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-gray-700">
                        <MapPin size={14} className="text-emerald-600" />
                        {record.paddock}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-bold text-gray-900">{record.count}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{record.breed}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${conditionColor(record.condition)}`}
                      >
                        {record.condition}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-700">{record.lastTreatment}</div>
                      {record.withholdingUntil && (
                        <div className="flex items-center gap-1 text-xs text-amber-600 mt-1">
                          <AlertCircle size={12} />
                          <span>Until {record.withholdingUntil}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600 max-w-xs truncate">{record.notes}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-600">
                        <Camera size={16} className="text-emerald-600" />
                        <span className="text-sm font-medium">{record.photoCount}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-gray-600">{record.lastUpdated}</div>
                      <div className="text-xs text-gray-400">by {record.updatedBy}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feature Callouts */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border-2 border-emerald-200">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-bold text-gray-900 mb-2">Offline-First</h3>
            <p className="text-sm text-gray-600">
              Works in paddocks without signal. Syncs automatically when back in range.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="font-bold text-gray-900 mb-2">Multi-Worker</h3>
            <p className="text-sm text-gray-600">
              Leigh and Hope can both update records simultaneously without conflicts.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-bold text-gray-900 mb-2">AI Assistance</h3>
            <p className="text-sm text-gray-600">
              Future: AI analyzes photos to flag potential health issues automatically.
            </p>
          </div>
        </div>

        {/* Beta Notice */}
        <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-amber-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-gray-900 mb-2">🚀 Beta Program - Q1 2026</h3>
              <p className="text-gray-700 mb-3">
                This flock management system is currently in development. Hope & Leigh are working
                with us to design the perfect tool for real farm conditions.
              </p>
              <p className="text-sm text-gray-600">
                <strong>MVP Features:</strong> Offline spreadsheet replacement • Photo attachments •
                Treatment tracking • Paddock rotation • Multi-worker sync • Voice-to-text notes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SheepManagementSpreadsheet;
