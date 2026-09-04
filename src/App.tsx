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

/* =========================================================
   AI MOOD
========================================================= */

import { MoodPage1 } from './pages/MoodPage1';
import { MoodDashboard } from './pages/MoodDashboard';

/* =========================================================
   OTHER PAGES
========================================================= */

import { JournalPage } from './pages/JournalPage';
import { TherapistsPage } from './pages/TherapistsPage';

/* THERAPIST FLOW */
import TherapistBooking from './pages/TherapistBooking';
import TherapistPayment from './pages/TherapistPayment';
import TherapistVideoCall from './pages/TherapistVideoCall';

import { PrivacyPage } from './pages/PrivacyPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { SafetyPage } from './pages/SafetyPage';
import { AdminPage } from './pages/AdminPage';

/* =========================================================
   MAIN CONTENT
========================================================= */

const MainContent: React.FC = () => {
  const { activeTab, theme } = useApp();

  const renderTab = () => {
    switch (activeTab) {

      /* =====================================================
         LANDING / AUTH
      ===================================================== */

      case 'landing':
        return <LandingPage />;

      case 'auth':
        return <AuthPage />;

      case 'onboarding':
        return <OnboardingPage />;

      /* =====================================================
         MAIN APP
      ===================================================== */

      case 'home':
        return <HomePage />;

      case 'talk':
        return <TalkPage />;

      case 'games':
        return <GamesPage />;

      case 'journey':
        return <JourneyPage />;

      case 'activities':
        return <ActivitiesPage />;

      /* =====================================================
         AI MOOD
      ===================================================== */

      case 'mood':
        return <MoodPage1 />;

      case 'mood-dashboard':
        return <MoodDashboard />;

      /* =====================================================
         JOURNAL
      ===================================================== */

      case 'journal':
        return <JournalPage />;

      /* =====================================================
         THERAPISTS
      ===================================================== */

      case 'therapists':
        return <TherapistsPage />;

      /* =====================================================
         THERAPIST BOOKING
      ===================================================== */

      case 'therapist-booking':
        return <TherapistBooking />;

      /* =====================================================
         THERAPIST PAYMENT
      ===================================================== */

      case 'therapist-payment':
        return <TherapistPayment />;

      /* =====================================================
         THERAPIST VIDEO CALL
      ===================================================== */

      case 'therapist-video-call':
        return <TherapistVideoCall />;

      /* =====================================================
         PRIVACY / PROFILE / SETTINGS
      ===================================================== */

      case 'privacy':
        return <PrivacyPage />;

      case 'profile':
        return <ProfilePage />;

      case 'settings':
        return <SettingsPage />;

      case 'safety':
        return <SafetyPage />;

      case 'admin':
        return <AdminPage />;

      /* =====================================================
         DEFAULT
      ===================================================== */

      default:
        return <HomePage />;
    }
  };

  /* =========================================================
     FULL DASHBOARD LAYOUT
  ========================================================= */

  const isFullLayout =
    activeTab !== 'landing' &&
    activeTab !== 'auth' &&
    activeTab !== 'onboarding';

  return (
    <div
      className={
        theme === 'dark'
          ? 'theme-dark min-h-screen flex flex-col font-sans antialiased selection:bg-purple-500/30'
          : 'theme-light min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased selection:bg-purple-200'
      }
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header />

      {/* =====================================================
          NOTIFICATIONS
      ===================================================== */}

      <NotificationToast />

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="flex-1 flex w-full">

        {/* SIDEBAR */}

        {isFullLayout && <Sidebar />}

        {/* PAGE CONTENT */}

        <main
          className={`
            flex-1
            p-4
            sm:p-6
            lg:p-8
            ${
              isFullLayout
                ? 'pb-24 lg:pb-12'
                : ''
            }
          `}
        >
          {renderTab()}
        </main>

      </div>

      {/* =====================================================
          MOBILE NAVIGATION
      ===================================================== */}

      {isFullLayout && <BottomNav />}

      {/* =====================================================
          SAFETY
      ===================================================== */}

      <SafetyModal />

      {/* =====================================================
          DEMO BAR
      ===================================================== */}

      <DemoBar />

    </div>
  );
};

/* =========================================================
   APP
========================================================= */

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;