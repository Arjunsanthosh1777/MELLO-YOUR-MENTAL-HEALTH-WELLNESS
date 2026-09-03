import React from 'react';
import { Home, MessageCircle, Map, Gamepad2, User } from 'lucide-react';
import { useApp, AppTab } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, navigate } = useApp();

  if (activeTab === 'landing' || activeTab === 'auth' || activeTab === 'onboarding') {
    return null;
  }

  const items: { id: AppTab; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'talk', label: 'Talk', icon: MessageCircle },
    { id: 'journey', label: 'Journey', icon: Map },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-purple-100 dark:border-slate-700 px-3 py-2 flex items-center justify-around shadow-lg">
      {items.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isActive ? 'text-purple-700 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1 rounded-xl ${isActive ? 'bg-purple-100' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
