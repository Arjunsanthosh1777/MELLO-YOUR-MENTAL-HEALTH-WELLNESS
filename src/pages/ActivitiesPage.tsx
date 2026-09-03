import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckSquare, Play, Clock, CheckCircle2, X, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_ACTIVITIES } from '../services/storageService';
import { ActivityCard } from '../types';

export const ActivitiesPage: React.FC = () => {
  const { earnXP, navigate } = useApp();
  const [selectedActivity, setSelectedActivity] = useState<ActivityCard | null>(null);
  const [inProgress, setInProgress] = useState(false);
  const [completed, setCompleted] = useState(false);

  const startCard = (act: ActivityCard) => {
    if (act.id === 'act-4') { navigate('games'); return; }
    if (act.type === 'breathing') { navigate('games', { gameId: 'breathing-bloom' }); return; }
    setSelectedActivity(act);
    setInProgress(true);
    setCompleted(false);
  };

  const finishCard = () => {
    if (!selectedActivity) return;
    setCompleted(true);
    earnXP(selectedActivity.xpReward, selectedActivity.title);
  };

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-mello border border-purple-100 space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center font-bold">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              Small Steps 🐾
            </h1>
            <p className="text-slate-500 text-sm">
              Bite-sized daily wellness actions designed to take 2–5 minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Activity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INITIAL_ACTIVITIES.map(act => (
          <div
            key={act.id}
            className={`p-6 rounded-3xl border bg-gradient-to-br ${act.bg} flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold font-heading text-slate-900">{act.title}</span>
                <span className="px-2.5 py-1 bg-white/80 rounded-full text-xs font-bold text-amber-800 border border-amber-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" /> +{act.xpReward} XP
                </span>
              </div>
              <p className="text-xs leading-relaxed opacity-90">{act.description}</p>
              <div className="flex items-center space-x-2 text-[11px] font-semibold opacity-75 pt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{act.duration}</span>
              </div>
            </div>

            <button
              onClick={() => startCard(act)}
              className="w-full py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl border border-slate-200 shadow-xs flex items-center justify-center gap-2 text-xs transition-colors"
            >
              <Play className="w-4 h-4 text-purple-600 fill-purple-600" /> Start {act.title}
            </button>
          </div>
        ))}
      </div>

      {/* Activity Player Modal */}
      <AnimatePresence>
        {selectedActivity && inProgress && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-6 text-center border border-purple-100"
            >
              <button
                onClick={() => setSelectedActivity(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>

              {!completed ? (
                <div className="space-y-6 py-4">
                  <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-8 h-8 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold font-heading text-slate-900">{selectedActivity.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                      {selectedActivity.description}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-2xl text-xs text-purple-900 font-medium">
                    Take a slow breath. Relax your jaw, shoulders, and hands. Allow yourself to be present for these {selectedActivity.duration}.
                  </div>
                  <button
                    onClick={finishCard}
                    className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-mello text-sm"
                  >
                    Complete Activity (+{selectedActivity.xpReward} XP)
                  </button>
                </div>
              ) : (
                <div className="space-y-4 py-6">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                  <h3 className="text-2xl font-bold font-heading text-slate-900">Step Completed! 🌱</h3>
                  <p className="text-xs text-slate-600">
                    You earned +{selectedActivity.xpReward} XP for completing {selectedActivity.title}.
                  </p>
                  <button
                    onClick={() => setSelectedActivity(null)}
                    className="w-full py-3 bg-purple-600 text-white font-bold rounded-2xl shadow-md text-sm"
                  >
                    Back to Activities
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
