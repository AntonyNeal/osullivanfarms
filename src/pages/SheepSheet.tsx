import { Helmet } from 'react-helmet-async';
import { Link, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { useTenant } from '../core/hooks/useTenant';
import '../styles/neo-australian.css';

// Import child components
import MobDashboard from './sheep-sheet/MobDashboard';
import MobDetail from './sheep-sheet/MobDetail';

export default function SheepSheet() {
  const { content } = useTenant();
  const [syncStatus] = useState({ is_online: true, pending_changes: 0 });

  return (
    <>
      <Helmet>
        <title>Sheep Sheet - Farm Management - {content.name}</title>
        <meta name="description" content="Sheep farm management and tracking system" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Header Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  to="/sheep-sheet"
                  className="flex items-center space-x-3 hover:opacity-80 transition"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl font-bold">🐑</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">SheepSheet</h1>
                    <p className="text-xs text-gray-500">Farm Management</p>
                  </div>
                </Link>
              </div>

              {/* Sync Status Indicator */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full ${syncStatus.is_online ? 'bg-green-500' : 'bg-red-500'}`}
                  ></div>
                  <span className="text-gray-600">
                    {syncStatus.is_online ? 'Online' : 'Offline'}
                  </span>
                  {syncStatus.pending_changes > 0 && (
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                      {syncStatus.pending_changes} pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route index element={<MobDashboard />} />
            <Route path="mob/:mobId" element={<MobDetail />} />
          </Routes>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden">
          <div className="flex justify-around py-2">
            <Link to="/sheep-sheet" className="flex flex-col items-center px-4 py-2 text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="text-xs mt-1">Dashboard</span>
            </Link>
            <button className="flex flex-col items-center px-4 py-2 text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="text-xs mt-1">Add Mob</span>
            </button>
            <button className="flex flex-col items-center px-4 py-2 text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span className="text-xs mt-1">Filter</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
