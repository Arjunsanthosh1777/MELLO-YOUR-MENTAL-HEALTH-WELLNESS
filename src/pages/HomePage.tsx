import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, Flame, Sparkles, CheckCircle2, Circle, 
  UserCheck, ArrowRight, Gamepad2, Heart, Wind, Compass 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MoodType } from '../types';
import { MelloAvatar } from '../components/common/MelloAvatar';
import { INITIAL_ACTIVITIES } from '../services/storageService';

export const HomePage: React.FC = () => {
  const { user, moods, logMood, navigate } = useApp();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(
    moods.length > 0 ? moods[0].mood : null
  );

  const moodOptions: { id: MoodType; label: string; emoji: string; color: string }[] = [
    { id: 'great', label: 'Great', emoji: '😊', color: 'hover:bg-emerald-100 border-emerald-200 text-emerald-800' },
    { id: 'good', label: 'Good', emoji: '🙂', color: 'hover:bg-teal-100 border-teal-200 text-teal-800' },
    { id: 'okay', label: 'Okay', emoji: '😐', color: 'hover:bg-amber-100 border-amber-200 text-amber-800' },
    { id: 'low', label: 'Low', emoji: '😔', color: 'hover:bg-purple-100 border-purple-200 text-purple-800' },
    { id: 'overwhelmed', label: 'Overwhelmed', emoji: '😣', color: 'hover:bg-rose-100 border-rose-200 text-rose-800' },
  ];

  const handleSelectMood = (m: MoodType) => {
    setSelectedMood(m);
    logMood(m, `Checked in as ${m}`);
  };

  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto">
      {/* Header & Mood Check-in */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-mello border border-purple-100 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              {getGreetingTime()}, {user.name || 'Friend'} 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1">How are you feeling today?</p>
          </div>

          <div className="flex items-center space-x-3 bg-purple-50 px-4 py-2 rounded-2xl border border-purple-100 text-xs font-bold text-purple-900">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Level {user.level} • Mind Explorer</span>
          </div>
        </div>

        {/* Mood Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {moodOptions.map(m => {
            const isSelected = selectedMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleSelectMood(m.id)}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                  isSelected 
                    ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-md scale-105' 
                    : `bg-slate-50 border-slate-200 ${m.color}`
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-xs font-medium">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Card & Today's Plan Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main AI Companion Hero Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-mello-lg relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10 space-y-4 max-w-md">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-white">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Talk to Mello</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading">
              I'm here to listen.
            </h2>
            <p className="text-purple-100 text-sm leading-relaxed">
              You can start with whatever is on your mind. No judgment, just a quiet safe space.
            </p>
            <button
              onClick={() => navigate('talk')}
              className="px-6 py-3.5 bg-white hover:bg-purple-50 text-purple-900 font-bold rounded-2xl shadow-md transition-all text-sm inline-flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              Start a Conversation <ArrowRight className="w-4 h-4 text-purple-700" />
            </button>
          </div>

          <div className="absolute right-4 bottom-2 opacity-90 hidden sm:block">
            <MelloAvatar size="xl" animate={true} />
          </div>
        </div>

        {/* Today's Plan Checklist */}
        <div className="bg-white p-6 rounded-3xl shadow-mello border border-purple-100 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Today's Plan</h3>
              <span className="text-xs text-purple-600 font-bold">3/5 Done</span>
            </div>

            <div className="space-y-2.5">
              {INITIAL_ACTIVITIES.map((act) => (
                <div 
                  key={act.id} 
                  onClick={() => {
                    if (act.id === 'act-4') navigate('games');
                    else if (act.type === 'breathing') navigate('games', { gameId: 'breathing-bloom' });
                    else navigate('activities');
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50/60 cursor-pointer transition-colors text-xs font-medium"
                >
                  <div className="flex items-center space-x-2.5">
                    {act.completedToday ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300" />
                    )}
                    <span className={act.completedToday ? 'line-through text-slate-400' : 'text-slate-700'}>
                      {act.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">{act.duration}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('activities')}
            className="w-full py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl text-xs transition-colors text-center"
          >
            View All Activities →
          </button>
        </div>
      </div>

      {/* Progress & Professional Support Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Journey Progress Card */}
        <div className="bg-white p-6 rounded-3xl shadow-mello border border-purple-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h3 className="font-bold text-slate-800 text-base">{user.streak} Day Journey</h3>
            </div>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
              {user.mindPoints} Mind Points
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Level {user.level}: Mind Explorer</span>
              <span>{user.xp} / 1000 XP</span>
            </div>
            <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (user.xp / 1000) * 100)}%` }} 
              />
            </div>
          </div>

          <button
            onClick={() => navigate('journey')}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-sm transition-colors"
          >
            Continue Journey Path →
          </button>
        </div>

        {/* Professional Human Support Card */}
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 p-6 rounded-3xl border border-teal-100 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-teal-800 font-bold text-sm">
              <UserCheck className="w-5 h-5 text-teal-600" />
              <span>Need human support?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connect with verified mental-health professionals when you'd like additional human guidance or structured therapy.
            </p>
          </div>

          <button
            onClick={() => navigate('therapists')}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
          >
            Find Professional Support →
          </button>
        </div>
      </div>
    </div>
  );
};
