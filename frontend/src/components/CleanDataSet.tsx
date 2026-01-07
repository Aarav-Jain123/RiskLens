import { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { HeroPanel } from './HeroPanel';
import { SummaryCards } from './SummaryCards';
import { EntriesTable } from './EntriesTable';
import { DashboardView } from './DashboardView';
import { UserCarousel } from './UserCarousel';
import { UploadPage } from './UploadPage';

export default function App() {
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [currentView, setCurrentView] = useState<'overview' | 'dashboard'>('overview');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Model performance
  const [accuracy, setAccuracy] = useState<string | null>(null);
  const [modelStatus, setModelStatus] = useState<string | null>(null);

  // 🔹 Threat analytics
  const [totalThreatCount, setTotalThreatCount] = useState<number | null>(null);
  const [threatsPerDay, setThreatsPerDay] = useState<Record<string, number>>({});
  const [topThreatSubclasses, setTopThreatSubclasses] = useState<Record<string, number>>({});
  const [riskPercentageByEvent, setRiskPercentageByEvent] = useState<Record<string, string>>({});

  // 🔹 User activity
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          'https://risklensbackend-g8apbyf5dgceefbx.centralindia-01.azurewebsites.net/clean_dataset_page/'
        );

        if (!res.ok) throw new Error('Fetch failed');

        const raw = await res.json();

        // ✅ FLATTEN EVERYTHING HERE
        setAccuracy(raw.model_performance?.accuracy ?? null);
        setModelStatus(raw.model_performance?.status ?? null);

        setTotalThreatCount(raw.threat_analytics?.total_threat_count ?? null);
        setThreatsPerDay(raw.threat_analytics?.threats_per_day ?? {});
        setTopThreatSubclasses(raw.threat_analytics?.top_threat_subclasses ?? {});
        setRiskPercentageByEvent(raw.threat_analytics?.risk_percentage_by_event ?? {});

        setUsers(raw.user_activity_monitor ?? []);

        setIsFileUploaded(true);
      } catch (err) {
        console.error('Dashboard fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleNewReport = () => {
    setIsFileUploaded(false);
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

  if (loading) return <div>Loading...</div>;

  if (!isFileUploaded) {
    return <UploadPage onUploadComplete={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        onNewReport={handleNewReport}
      />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {currentView === 'overview' ? (
          <>
            {accuracy && modelStatus && (
              <HeroPanel data={{ accuracy, status: modelStatus }} />
            )}

            {totalThreatCount !== null && (
              <SummaryCards
                data={{
                  total_threat_count: totalThreatCount,
                  threats_per_day: threatsPerDay,
                  top_threat_subclasses: topThreatSubclasses,
                  risk_percentage_by_event: riskPercentageByEvent,
                }}
              />
            )}

            {users.length > 0 && (
              <UserCarousel data={users} onSelectUser={handleSelectUser} />
            )}

            <EntriesTable />
          </>
        ) : (
          selectedUserId && (
            <DashboardView
              userId={selectedUserId}
              data={{
                model_performance: { accuracy, status: modelStatus },
                threat_analytics: {
                  total_threat_count: totalThreatCount,
                  threats_per_day: threatsPerDay,
                  top_threat_subclasses: topThreatSubclasses,
                  risk_percentage_by_event: riskPercentageByEvent,
                },
                user_activity_monitor: users,
              }}
              onBack={handleBackToOverview}
            />
          )
        )}
      </main>
    </div>
  );
}
