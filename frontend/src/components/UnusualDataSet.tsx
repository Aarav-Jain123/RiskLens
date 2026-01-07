import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroPanel } from './components/HeroPanel';
import { SummaryCards } from './components/SummaryCards';
import { EntriesTable } from './components/EntriesTable';
import { DashboardView } from './components/DashboardView';
import { UserCarousel } from './components/UserCarousel';
import { UploadPage } from './components/UploadPage';
import { DashboardData } from './types/dashboard';

export default function UnusualDataSet() {
  const handleFileChange = async (

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

    const response = await fetch(`https://risklensbackend-g8apbyf5dgceefbx.centralindia-01.azurewebsites.net/dirty_dataset_page/`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Upload failed (${response.status}): ${errorText}`
      );
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new Error('Server did not return JSON');
    }

    const data: DashboardData = await response.json();
    onUploadComplete(data);
  } catch (error) {
    console.error('Upload error:', error);
    setError(
      error instanceof Error
        ? error.message
        : 'Failed to upload file'
    );
  } finally {
    setUploading(false);
    input.value = ''; // allow re-upload of same file
  }
};


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
