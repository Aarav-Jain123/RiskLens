import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroPanel } from './components/HeroPanel';
import { SummaryCards } from './components/SummaryCards';
import { EntriesTable } from './components/EntriesTable';
import { DashboardView } from './components/DashboardView';
import { UserCarousel } from './components/UserCarousel';
import { UploadPage } from './components/UploadPage';
import { DashboardData } from './types/dashboard';

export default function App() {
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [currentView, setCurrentView] = useState<'overview' | 'dashboard'>('overview');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleUploadComplete = (data: DashboardData) => {
    setDashboardData(data);
    setIsFileUploaded(true);
  };

  const handleNewReport = () => {
    setIsFileUploaded(false);
    setDashboardData(null);
    setCurrentView('overview');
    setSelectedUserId(null);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    setCurrentView('dashboard');
  };

  const handleBackToOverview = () => {
    setCurrentView('overview');
    setSelectedUserId(null);
  };

  // Show upload page if no file has been uploaded yet
  if (!isFileUploaded) {
    return <UploadPage onUploadComplete={handleUploadComplete} />;
  }

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
          </>
        ) : (
          <DashboardView userId={selectedUserId} data={dashboardData} onBack={handleBackToOverview} />
        )}
      </main>
    </div>
  );
}