import React from 'react';
import { 
  Home, MessageCircle, Map, Gamepad2, Smile, BookOpen, 
  UserCheck, ShieldCheck, User, Settings, CheckSquare 
} from 'lucide-react';
import { useApp, AppTab } from '../../context/AppContext';

interface NavItem {
  id: AppTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { activeTab, navigate } = useApp();

  if (activeTab === 'landing' || activeTab === 'auth' || activeTab === 'onboarding') {
    return null;
  }

  const mainNav: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'talk', label: 'Talk to Mello', icon: MessageCircle, badge: 'AI' },
    { id: 'journey', label: 'Journey', icon: Map },
    { id: 'activities', label: 'Activities', icon: CheckSquare },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'mood', label: 'Mood Tracker', icon: Smile },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'therapists', label: 'Therapists', icon: UserCheck },
  ];

  const secondaryNav: NavItem[] = [
    { id: 'privacy', label: 'Privacy', icon: ShieldCheck },
    { id: 'profile', label: 'Profile & Progress', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-purple-100 dark:border-slate-700 p-5 min-h-[calc(100vh-61px)] sticky top-[61px] shrink-0">
      {/* Primary Navigation */}
      <div className="space-y-1.5 flex-1">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Daily Wellness
        </div>
        {mainNav.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-mello'
                  : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                  isActive ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Supportive Affirmation Card */}
      <div className="my-4 p-4 bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-2xl border border-purple-100 text-center">
        <p className="text-xs font-semibold text-purple-900 leading-relaxed">
          "You don't have to carry everything alone today." 🌱
        </p>
      </div>

      {/* Secondary Navigation */}
      <div className="pt-3 border-t border-slate-100 space-y-1">
        {secondaryNav.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl font-medium text-xs transition-colors ${
                isActive ? 'bg-purple-100 text-purple-800 font-bold' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
