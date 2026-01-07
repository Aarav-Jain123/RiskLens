import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from './Navbar';
import { HeroPanel } from './HeroPanel';
import { SummaryCards } from './SummaryCards';
import { EntriesTable } from './EntriesTable';
import { DashboardView } from './DashboardView';
import { UserCarousel } from './UserCarousel';
import { DashboardData } from '../types/dashboard';

// --- 1. Sub-Components with Layout & Mapping Fixes ---

const HeroPanel = ({ data }: { data?: any }) => (
  <div className="w-full bg-gradient-to-br from-indigo-600 to-blue-500 text-white p-8 rounded-2xl shadow-sm border border-blue-400/20">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Model Intelligence</h2>
        <p className="text-4xl font-black">{data?.accuracy ?? '0.00%'}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="h-3 w-3 rounded-full bg-green-400 animate-pulse"></span>
        <span className="text-sm font-semibold text-blue-50">{data?.status ?? 'Goal Met'}</span>
      </div>
    </div>
  </div>
);

const SummaryCards = ({ data }: { data?: any }) => {
  const topThreat = data?.top_threat_subclasses ? Object.keys(data.top_threat_subclasses)[0] : 'None';
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center min-h-[120px]">
        <p className="text-gray-400 text-[10px] font-bold uppercase mb-2">Total Threats</p>
        <p className="text-4xl font-bold text-gray-900">{data?.total_threat_count ?? 0}</p>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center min-h-[120px]">
        <p className="text-gray-400 text-[10px] font-bold uppercase mb-2">Primary Risk Vector</p>
        <p className="text-3xl font-bold text-gray-900 capitalize">{topThreat.replace('_', ' ')}</p>
      </div>
    </div>
  );
};

const UserCarousel = ({ data, onSelectUser }: { data: any[], onSelectUser: (id: string) => void }) => (
  <section className="w-full pt-4">
    <div className="flex justify-between items-end mb-4">
      <h2 className="text-xl font-bold text-gray-800">High Risk Users</h2>
      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">{data?.length ?? 0} active flags</span>
    </div>
    {/* This flex container and overflow-x-auto enables horizontal scrolling */}
    <div className="flex gap-4 overflow-x-auto pb-6 -mx-2 px-2">
      {data?.map((user) => (
        <div
          key={user?.user_id}
          onClick={() => onSelectUser(user.user_id)}
          className="min-w-[280px] bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-500 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="font-mono font-bold text-blue-600">{user?.user_id}</span>
            <span className="bg-red-50 text-red-600 text-[10px] font-black px-2 py-1 rounded-lg">
              {user?.threat_events} EVENTS
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-300 uppercase">Last Activity</p>
            <p className="text-xs text-gray-600 font-mono">{user?.last_active}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// --- 2. Main Dashboard Component ---

export default function CleanDataSet() {
  const [currentView, setCurrentView] = useState<'overview' | 'user'>('overview');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCleanData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://risklensbackend-g8apbyf5dgceefbx.centralindia-01.azurewebsites.net/clean_dataset_page/');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const raw = await response.json();

      setDashboardData({
        model_performance: raw.model_performance || {},
        threat_analytics: raw.threat_analytics || {},
        user_activity_monitor: raw.user_activity_monitor || [],
      });
    } catch (e) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCleanData();
  }, []);

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    setCurrentView('user');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <main className="max-w-6xl mx-auto space-y-10">
        
        {loading && <p className="text-center py-10 animate-pulse">Loading Security Intelligence...</p>}
        {error && <p className="text-red-500 text-center py-10">{error}</p>}

        {!loading && dashboardData && (
          currentView === 'overview' ? (
            <div className="space-y-10">
              <HeroPanel data={dashboardData.model_performance} />
              <SummaryCards data={dashboardData.threat_analytics} />
              {/* handleSelectUser is passed to the onSelectUser prop */}
              <UserCarousel 
                data={dashboardData.user_activity_monitor} 
                onSelectUser={handleSelectUser} 
              />
            </div>
          ) : (
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
              <button onClick={() => setCurrentView('overview')} className="mb-6 text-sm font-bold text-blue-600">
                ← BACK TO OVERVIEW
              </button>
              <h2 className="text-3xl font-black text-gray-900">User Analysis: {selectedUserId}</h2>
              <div className="mt-8 p-12 border-2 border-dashed border-gray-100 rounded-2xl text-center text-gray-400">
                Behavioral mapping and event history for {selectedUserId}
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}
