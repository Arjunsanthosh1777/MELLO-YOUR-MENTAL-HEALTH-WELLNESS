import React from 'react';
import { User, Sparkles, Flame, Trophy, Award, Shield, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MelloAvatar } from '../components/common/MelloAvatar';

export const ProfilePage: React.FC = () => {
  const { user, achievements } = useApp();

  const avatars = ['💜', '🌱', '🌸', '🌻', '🧘', '⭐', '🎈'];

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      {/* User Header Profile Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-mello border border-purple-100 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="relative">
          <div className="w-20 h-20 bg-purple-100 rounded-3xl flex items-center justify-center text-4xl shadow-inner border border-purple-200">
            {user.avatar || '💜'}
          </div>
          <span className="w-6 h-6 bg-emerald-500 border-2 border-white rounded-full absolute -bottom-1 -right-1 shadow-sm" />
        </div>

        <div className="text-center sm:text-left space-y-2 flex-1">
          <h1 className="text-2xl font-extrabold font-heading text-slate-900">{user.name || 'Arjun'}</h1>
          <p className="text-xs text-slate-500">{user.email}</p>
          
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Level {user.level} Mind Explorer
            </span>
            <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {user.streak} Day Journey
            </span>
            <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold">
              {user.mindPoints} Mind Points
            </span>
          </div>
        </div>
      </div>

      {/* Achievement Badges Grid */}
      <div className="bg-white p-6 rounded-3xl shadow-mello border border-purple-100 space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" /> Achievements & Badges
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {achievements.map(ach => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                ach.unlocked ? 'bg-gradient-to-br from-amber-50 to-purple-50 border-amber-200 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <span className="text-3xl block">{ach.icon}</span>
              <div>
                <h4 className="font-bold text-xs text-slate-900">{ach.title}</h4>
                <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{ach.description}</p>
              </div>
              <span className="inline-block px-2 py-0.5 bg-white/80 rounded-full text-[9px] font-extrabold text-amber-800 border border-amber-200">
                +{ach.xp} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
