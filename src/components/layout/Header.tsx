import React from 'react';
import { Flame, Sparkles, ShieldAlert, Moon, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MelloAvatar } from '../common/MelloAvatar';

export const Header: React.FC = () => {
  const { user, activeTab, navigate, openSafetyModal, isDarkMode, toggleDarkMode } = useApp();

  if (activeTab === 'landing' || activeTab === 'auth' || activeTab === 'onboarding') {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-slate-900/90 backdrop-blur-md border-b border-purple-100 dark:border-slate-700 px-4 sm:px-8 py-3 flex items-center justify-between">
      {/* Brand & Page Title */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('home')}>
        <div className="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center border border-purple-200">
          <MelloAvatar size="sm" animate={false} />
        </div>
        <div>
          <span className="text-xl font-bold font-heading gradient-text-mello tracking-tight">Mello</span>
          <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
            Daily Companion
          </span>
        </div>
      </div>

      {/* Gamification Stats & Header Controls */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Streak */}
        <div className="flex items-center space-x-1.5 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-xl border border-amber-200 text-xs sm:text-sm font-semibold">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>{user.streak} Days</span>
        </div>

        {/* Mind Points */}
        <div className="flex items-center space-x-1.5 bg-purple-50 text-purple-800 px-3 py-1.5 rounded-xl border border-purple-200 text-xs sm:text-sm font-semibold">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>{user.mindPoints} Pts</span>
        </div>

        {/* Emergency Safety Trigger */}
        <button
          onClick={openSafetyModal}
          className="flex items-center space-x-1 bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-semibold transition-colors"
          title="Need Immediate Crisis Support?"
        >
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span className="hidden md:inline">Need Help Now?</span>
        </button>

        <button
          onClick={toggleDarkMode}
          className="w-9 h-9 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-amber-300 rounded-xl flex items-center justify-center transition-colors border border-slate-200 dark:border-slate-600"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications & Profile */}
        <button 
          onClick={() => navigate('profile')}
          className="w-9 h-9 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl flex items-center justify-center font-bold text-sm transition-colors border border-purple-200"
        >
          {user.avatar || '💜'}
        </button>
      </div>
    </header>
  );
};
