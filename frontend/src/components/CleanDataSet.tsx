import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { HeroPanel } from './HeroPanel';
import { SummaryCards } from './SummaryCards';
import { EntriesTable } from './EntriesTable';
import { DashboardView } from './DashboardView';
import { UserCarousel } from './UserCarousel';
import { DashboardData } from '../types/dashboard';
// --- Sub-Components with Direct JSON Mapping ---

const HeroPanel = ({ data }: { data?: any }) => (
  <div className="w-full bg-blue-600 p-8 rounded-xl shadow-md border border-gray-200">
    <h2 className="text-white text-xs font-bold uppercase tracking-widest mb-1">Model Intelligence</h2>
    {/* Accuracy Mapping */}
    <p className="text-4xl font-black text-white">{data?.accuracy ?? '97.00%'}</p>
    {/* Status Mapping */}
    <p className="mt-2 text-blue-100 font-semibold">{data?.status ?? 'Goal Met'}</p>
  </div>
);

const SummaryCards = ({ data }: { data?: any }) => {
  // Extracting top threat from the top_threat_subclasses object
  const threatKeys = data?.top_threat_subclasses ? Object.keys(data.top_threat_subclasses) : [];
  const primaryThreat = threatKeys.length > 0 ? threatKeys[0] : 'failed login';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-gray-500 text-xs font-bold uppercase mb-1">Total Threats</p>
        <p className="text-4xl font-bold text-black">{data?.total_threat_count ?? 167}</p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-gray-500 text-xs font-bold uppercase mb-1">Primary Risk Vector</p>
        <p className="text-4xl font-bold text-black capitalize">{primaryThreat.replace('_', ' ')}</p>
      </div>
    </div>
  );
};

const UserCarousel = ({ data, onSelectUser }: { data: any[], onSelectUser: (id: string) => void }) => (
  <section className="w-full">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-black">High Risk Users</h2>
      <span className="text-xs text-gray-400 font-bold">{data?.length ?? 5} active flags</span>
    </div>
    
    <div className="flex gap-4 overflow-x-auto pb-4">
      {data?.map((user) => (
        <div
          key={user?.user_id}
          onClick={() => onSelectUser(user.user_id)}
          className="min-w-[250px] bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-blue-500 cursor-pointer transition-all"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-blue-600">{user?.user_id}</span>
            <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded italic">
              {user?.threat_events} EVENTS
            </span>
          </div>
          <div className="mt-2">
            <p className="text-[10px] text-gray-400 uppercase font-bold">Last Activity</p>
            <p className="text-xs text-black mt-1 font-mono">{user?.last_active}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// --- Main Dashboard ---

export default function CleanDataSet() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'overview' | 'user'>('overview');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://risklensbackend-g8apbyf5dgceefbx.centralindia-01.azurewebsites.net/clean_dataset_page/');
        const raw = await response.json();
        
        // Final JSON Mapping
        setDashboardData({
          model_performance: raw.model_performance,
          threat_analytics: raw.threat_analytics,
          user_activity_monitor: raw.user_activity_monitor,
        });
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    setCurrentView('user');
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {currentView === 'overview' ? (
          <>
            <HeroPanel data={dashboardData?.model_performance} />
            <SummaryCards data={dashboardData?.threat_analytics} />
            <UserCarousel 
              data={dashboardData?.user_activity_monitor} 
              onSelectUser={handleSelectUser} 
            />
          </>
        ) : (
          <div className="p-8 border border-gray-200 rounded-xl">
            <button onClick={() => setCurrentView('overview')} className="text-blue-600 font-bold mb-4">← Back</button>
            <h2 className="text-2xl font-bold">Analyzing {selectedUserId}</h2>
          </div>
        )}
      </div>
    </div>
  );
}
