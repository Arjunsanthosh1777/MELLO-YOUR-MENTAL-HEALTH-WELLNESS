import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { DemoBar } from './components/layout/DemoBar';
import { SafetyModal } from './components/common/SafetyModal';
import { NotificationToast } from './components/common/NotificationToast';

import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { HomePage } from './pages/HomePage';
import { TalkPage } from './pages/TalkPage';
import { GamesPage } from './pages/GamesPage';
import { JourneyPage } from './pages/JourneyPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { MoodPage } from './pages/MoodPage';
import { JournalPage } from './pages/JournalPage';
import { TherapistsPage } from './pages/TherapistsPage';
import { TalkNowPage } from './pages/TalkNowPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { SafetyPage } from './pages/SafetyPage';
import { AdminPage } from './pages/AdminPage';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  const renderTab = () => {
    switch (activeTab) {
      case 'landing': return <LandingPage />;
      case 'auth': return <AuthPage />;
      case 'onboarding': return <OnboardingPage />;
      case 'home': return <HomePage />;
      case 'talk': return <TalkPage />;
      case 'games': return <GamesPage />;
      case 'journey': return <JourneyPage />;
      case 'activities': return <ActivitiesPage />;
      case 'mood': return <MoodPage />;
      case 'journal': return <JournalPage />;
      case 'therapists': return <TherapistsPage />;
      case 'talk-now': return <TalkNowPage />;
      case 'privacy': return <PrivacyPage />;
      case 'profile': return <ProfilePage />;
      case 'settings': return <SettingsPage />;
      case 'safety': return <SafetyPage />;
      case 'admin': return <AdminPage />;
      default: return <HomePage />;
    }
  };

  const isFullLayout = activeTab !== 'landing' && activeTab !== 'auth' && activeTab !== 'onboarding';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased selection:bg-purple-200">
      <Header />
      <NotificationToast />

      <div className="flex-1 flex w-full">
        {isFullLayout && <Sidebar />}
        
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 ${isFullLayout ? 'pb-24 lg:pb-12' : ''}`}>
          {renderTab()}
        </main>
      </div>

      {isFullLayout && <BottomNav />}
      <SafetyModal />
      <DemoBar />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
