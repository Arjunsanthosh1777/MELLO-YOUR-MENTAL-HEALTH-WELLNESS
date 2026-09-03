import React, { useState } from 'react';
import { ShieldAlert, Sparkles, User, Settings, RefreshCw, Eye, Crown, ChevronRight, ChevronLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DemoBar: React.FC = () => {
  const { navigate, openSafetyModal, earnXP, setIsDemoUser, resetDemoData } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="fixed bottom-16 sm:bottom-4 right-4 z-40">
      {collapsed ? (
        <button
          onClick={() => setCollapsed(false)}
          className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-xl hover:scale-105 transition-all flex items-center gap-1.5 font-bold text-xs"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Demo Controls</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      ) : (
        <div className="bg-slate-900/90 text-white backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-purple-500/30 flex items-center space-x-2 text-xs">
          <div className="flex items-center gap-1 font-bold text-purple-300 pr-2 border-r border-slate-700">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Judge Demo Bar</span>
          </div>

          <button
            onClick={() => setIsDemoUser(true)}
            className="px-2.5 py-1.5 bg-purple-600/80 hover:bg-purple-600 rounded-lg flex items-center gap-1 text-white font-medium transition-colors"
            title="Load demo user profile"
          >
            <User className="w-3.5 h-3.5 text-purple-200" />
            <span>Demo Login</span>
          </button>

          <button
            onClick={openSafetyModal}
            className="px-2.5 py-1.5 bg-rose-600/80 hover:bg-rose-600 rounded-lg flex items-center gap-1 text-white font-medium transition-colors"
            title="Test Safety Intervention Protocol"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Safety Demo</span>
          </button>

          <button
            onClick={() => earnXP(150, 'Judge Demo Bonus')}
            className="px-2.5 py-1.5 bg-amber-500/80 hover:bg-amber-500 rounded-lg flex items-center gap-1 text-slate-900 font-bold transition-colors"
            title="Add +150 XP"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+150 XP</span>
          </button>

          <button
            onClick={() => navigate('admin')}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1 font-medium transition-colors"
            title="Open Admin Dashboard"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin</span>
          </button>

          <button
            onClick={resetDemoData}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
            title="Reset data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setCollapsed(true)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
