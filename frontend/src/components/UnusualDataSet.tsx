import { useState, useRef } from 'react';
import { Navbar } from './Navbar';
import { HeroPanel } from './HeroPanel';
import { SummaryCards } from './SummaryCards';
import { EntriesTable } from './EntriesTable';
import { DashboardView } from './DashboardView';
import { UserCarousel } from './UserCarousel';
import { DashboardData } from '../types/dashboard';

export default function UnusualDataSet() {
  const [currentView, setCurrentView] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const fetchCleanData = async () => {
    setError(null);
    setUploading(true);

    const isDev = import.meta.env.MODE === 'development';
    const baseURL = isDev
      ? import.meta.env.VITE_API_BASE_URL_LOCAL
      : import.meta.env.VITE_API_BASE_URL_PROD;

    if (!baseURL) {
      setError('API base URL is not configured');
      setUploading(false);
      return;
    }

    try {
      const response = await fetch(`${baseURL}/clean_dataset_page/`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Fetch failed (${response.status}): ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Server did not return JSON');
      }

      const data = await response.json();
      setDashboardData(data);  // Update state instead of undefined callback
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setUploading(false);
    }
  };

  const handleNewReport = () => { /* Implement */ };
  const handleSelectUser = (userId) => setSelectedUserId(userId);
  const handleBackToOverview = () => setSelectedUserId(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentView={currentView} onViewChange={setCurrentView} onNewReport={handleNewReport} />
      
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {currentView === 'overview' ? (
          <>
            <HeroPanel data={dashboardData} />
            <SummaryCards data={dashboardData} />
            <UserCarousel data={dashboardData} onSelectUser={handleSelectUser} />
            <EntriesTable />
            <button onClick={fetchCleanData} disabled={uploading}>
              {uploading ? 'Loading...' : 'Fetch Clean Dataset'}
            </button>
            {error && <p className="text-red-500">{error}</p>}
            <input ref={inputRef} type="file" style={{ display: 'none' }} />
          </>
        ) : (
          <DashboardView userId={selectedUserId} data={dashboardData} onBack={handleBackToOverview} />
        )}
      </main>
    </div>
  );
}
