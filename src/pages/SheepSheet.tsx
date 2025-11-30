import { Helmet } from 'react-helmet-async';
import { Link, Routes, Route } from 'react-router-dom';
import { useFarmData } from '../core/hooks/useFarmData';
import '../styles/neo-australian.css';

// Import child components
import MobDashboard from './sheep-sheet/MobDashboard';
import MobDetail from './sheep-sheet/MobDetail';

export default function SheepSheet() {
  const {
    isOnline,
    pendingCount,
    lastSyncTime,
    refreshData,
    isLoading,
    isSyncing,
    syncPendingChanges,
  } = useFarmData();

  return (
    <>
      <Helmet>
        <title>SheepSheet - Farm Management System</title>
        <meta name="description" content="Professional sheep farm management and tracking system" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-green-700 to-emerald-700 border-b-2 border-green-600 shadow-lg">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <Link
                to="/"
                className="flex items-center space-x-2 sm:space-x-3 hover:opacity-90 transition"
              >
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-xl sm:text-2xl">🐑</span>
                  </div>
                  <div>
                    <h1 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight">
                      SheepSheet
                    </h1>
                    <p className="text-xs text-green-100">Farm Management System</p>
                  </div>
                </div>
              </Link>

              {/* Sync Status & Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Sync Status Indicator */}
                <div
                  className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg backdrop-blur-sm ${
                    !isOnline
                      ? 'bg-red-500/30'
                      : pendingCount > 0
                        ? 'bg-amber-400/30'
                        : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      !isOnline
                        ? 'bg-red-400'
                        : pendingCount > 0
                          ? 'bg-amber-300 animate-pulse'
                          : 'bg-green-300'
                    }`}
                  ></div>
                  <span className="text-white font-medium">
                    {!isOnline
                      ? 'Offline'
                      : pendingCount > 0
                        ? `${pendingCount} pending`
                        : 'Synced'}
                  </span>
                  {lastSyncTime && isOnline && pendingCount === 0 && (
                    <span className="text-green-200 text-xs hidden md:inline">
                      {lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>

                {/* Sync Now Button (when pending) */}
                {isOnline && pendingCount > 0 && (
                  <button
                    onClick={() => syncPendingChanges()}
                    disabled={isSyncing}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 bg-amber-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-amber-600 disabled:opacity-50 flex items-center gap-1 shadow-md"
                  >
                    {isSyncing ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <span>Sync</span>
                    )}
                  </button>
                )}

                {/* Refresh Button */}
                {isOnline && (
                  <button
                    onClick={() => refreshData()}
                    disabled={isLoading}
                    className="p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg disabled:opacity-50 transition"
                    title="Refresh data"
                  >
                    <svg
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${isLoading ? 'animate-spin' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <Routes>
            <Route index element={<MobDashboard />} />
            <Route path="mob/:mobId" element={<MobDetail />} />
          </Routes>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="bg-gradient-to-r from-green-700 to-emerald-700 border-t-2 border-green-600 shadow-lg md:hidden mt-4 sm:mt-6">
          <div className="flex justify-around py-2">
            <Link to="/" className="flex flex-col items-center px-3 sm:px-4 py-2 text-white">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="text-xs mt-1 font-medium">Dashboard</span>
            </Link>
            <button className="flex flex-col items-center px-3 sm:px-4 py-2 text-green-100 hover:text-white">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
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
              <span className="text-xs mt-1 font-medium">Filter</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
