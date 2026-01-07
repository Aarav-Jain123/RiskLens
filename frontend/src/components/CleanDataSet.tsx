import React, { useState, useRef, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { Navbar } from './Navbar';
import { HeroPanel } from './HeroPanel';
import { SummaryCards } from './SummaryCards';
import { EntriesTable } from './EntriesTable';
import { DashboardView } from './DashboardView';
import { UserCarousel } from './UserCarousel';
import { DashboardData } from '../types/dashboard';

// --- 1. Error Boundary (The Safety Net) ---
// This prevents the whole app from turning into a white screen if one component fails.
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error("UI Error:", error, errorInfo); }
  render() {
    if (this.state.hasError) return <div className="p-10 text-center"><h2>Something went wrong.</h2><button onClick={() => window.location.reload()} className="text-blue-500 underline">Refresh Page</button></div>;
    return this.props.children;
  }
}

// --- 2. Types & Interfaces ---
interface DashboardData {
  model_performance: { accuracy: string; status: string };
  threat_analytics: {
    total_threat_count: number;
    threats_per_day: Record<string, number>;
    top_threat_subclasses: Record<string, number>;
  };
  user_activity_monitor: any[];
}

// --- 3. Sub-Components with Defensive Coding ---

const HeroPanel = ({ data }: { data?: DashboardData['model_performance'] }) => (
  <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-8 rounded-2xl shadow-lg transition-all hover:scale-[1.01]">
    <h2 className="text-sm font-semibold uppercase tracking-wider opacity-80">Model Accuracy</h2>
    <p className="text-5xl font-black mt-1">{data?.accuracy ?? '0.00%'}</p>
    <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-xs font-medium">
       Status: {data?.status ?? 'Initializing'}
    </div>
  </div>
);

const SummaryCards = ({ data }: { data?: DashboardData['threat_analytics'] }) => {
  // Defensive check for object keys
  const topThreat = data?.top_threat_subclasses ? Object.keys(data.top_threat_subclasses)[0] : 'None';
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-sm font-medium text-gray-500 uppercase">Total Threats</p>
        <p className="text-3xl font-bold text-gray-900">{data?.total_threat_count ?? 0}</p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-sm font-medium text-gray-500 uppercase">Primary Risk Vector</p>
        <p className="text-3xl font-bold text-gray-900 capitalize">{topThreat.replace('_', ' ')}</p>
      </div>
    </div>
  );
};

const UserCarousel = ({ data, onSelectUser }: { data: any[], onSelectUser: (id: string) => void }) => (
  <section className="space-y-4">
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold text-gray-800">High Risk Users</h2>
      <span className="text-sm text-gray-500">{data?.length || 0} active flags</span>
    </div>
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {data?.map((user) => (
        <div
          key={user?.user_id ?? Math.random()}
          onClick={() => user?.user_id && onSelectUser(user.user_id)}
          className="min-w-[300px] bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-500 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="font-mono font-bold text-blue-600 group-hover:text-blue-700">{user?.user_id}</span>
            <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
              {user?.threat_events} Events
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] text-gray-400">LAST ACTIVITY</p>
            <p className="text-sm text-gray-700 font-medium">{user?.last_active ?? 'N/A'}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// --- 4. Main Component ---

export default function CleanDataSet() {
  const [currentView, setCurrentView] = useState<'overview' | 'user'>('overview');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Start as loading
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const fetchCleanData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://risklensbackend-g8apbyf5dgceefbx.centralindia-01.azurewebsites.net/clean_dataset_page/');
      if (!response.ok) throw new Error(`Server Error: ${response.status}`);
      const raw = await response.json();

      // Data Sanitization: Ensure properties exist before setting state
      setDashboardData({
        model_performance: raw.model_performance || { accuracy: '0%', status: 'Offline' },
        threat_analytics: raw.threat_analytics || { total_threat_count: 0, threats_per_day: {}, top_threat_subclasses: {} },
        user_activity_monitor: Array.isArray(raw.user_activity_monitor) ? raw.user_activity_monitor : [],
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unexpected error occurred');
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
    <ErrorBoundary>
      <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
        <main className="max-w-6xl mx-auto space-y-10">
          
          {loading && (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 font-medium italic">Analyzing dataset...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex justify-between items-center">
              <div>
                <p className="font-bold">Data Fetch Error</p>
                <p className="text-sm opacity-80">{error}</p>
              </div>
              <button onClick={fetchCleanData} className="bg-red-700 text-white px-4 py-2 rounded-lg text-sm">Retry</button>
            </div>
          )}

          {!loading && !error && dashboardData && (
            currentView === 'overview' ? (
              <div className="space-y-10 animate-in fade-in duration-500">
                <HeroPanel data={dashboardData.model_performance} />
                <SummaryCards data={dashboardData.threat_analytics} />
                <UserCarousel
                  data={dashboardData.user_activity_monitor}
                  onSelectUser={handleSelectUser}
                />
              </div>
            ) : (
              <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 animate-in slide-in-from-bottom-4 duration-300">
                <button 
                  onClick={() => setCurrentView('overview')} 
                  className="mb-6 flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <span className="mr-2">←</span> BACK TO OVERVIEW
                </button>
                <h2 className="text-3xl font-black text-gray-900">User Analysis: {selectedUserId}</h2>
                <div className="mt-8 p-12 border-2 border-dashed border-gray-100 rounded-2xl text-center text-gray-400">
                  Detailed event logs and behavioral mapping for {selectedUserId} would be rendered here.
                </div>
              </div>
            )
          )}
        </main>
        <input ref={inputRef} type="file" hidden />
      </div>
    </ErrorBoundary>
  );
}
