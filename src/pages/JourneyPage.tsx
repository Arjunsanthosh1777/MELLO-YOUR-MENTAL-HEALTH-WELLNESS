import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle2, Lock, Sparkles, Trophy, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const JourneyPage: React.FC = () => {
  const { user, journey, completeNode, navigate, showToast } = useApp();

  const handleNodeClick = (levelId: number, nodeId: string, completed: boolean, unlocked: boolean, type: string) => {
    if (!unlocked) {
      showToast('Unlock previous levels to reach this node!', 'info');
      return;
    }

    if (!completed) {
      completeNode(levelId, nodeId);
    }

    // Direct user to corresponding feature
    if (type === 'talk') navigate('talk');
    else if (type === 'breathing' || type === 'game') navigate('games');
    else if (type === 'journal' || type === 'reflection' || type === 'gratitude') navigate('journal');
    else navigate('mood');
  };

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6 sm:p-8 rounded-3xl shadow-mello-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-purple-200">Gamified Progression</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">
              Your Mello Journey 🗺️
            </h1>
            <p className="text-purple-100 text-sm mt-1">
              Welcome back. No pressure — let's continue taking small steps from today.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center">
            <span className="text-xs text-purple-200 block">Current Stage</span>
            <span className="font-bold text-sm">Level {user.level} • Mind Explorer</span>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-semibold text-purple-100">
            <span>LEVEL {user.level}</span>
            <span>{user.xp} / 1000 XP</span>
          </div>
          <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-300 to-amber-500 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (user.xp / 1000) * 100)}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Duolingo-inspired Winding Level Path */}
      <div className="relative py-8 space-y-12 bg-white p-6 sm:p-10 rounded-3xl shadow-mello border border-purple-100">
        <div className="absolute left-1/2 top-10 bottom-10 w-1.5 bg-gradient-to-b from-purple-300 via-indigo-200 to-slate-200 -translate-x-1/2 rounded-full hidden sm:block" />

        {journey.map((level, levelIdx) => (
          <div key={level.id} className="relative z-10 space-y-6">
            {/* Level Banner */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              level.unlocked 
                ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 text-purple-900' 
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600">
                  Level {level.id}
                </span>
                <h3 className="text-lg font-bold font-heading">{level.title}</h3>
                <p className="text-xs text-slate-500">{level.subtitle}</p>
              </div>

              {!level.unlocked && <Lock className="w-5 h-5 text-slate-400" />}
            </div>

            {/* Winding Activity Nodes */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
              {level.nodes.map((node, nodeIdx) => {
                const isEven = (levelIdx + nodeIdx) % 2 === 0;
                return (
                  <motion.button
                    key={node.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNodeClick(level.id, node.id, node.completed, level.unlocked, node.type)}
                    className={`relative flex flex-col items-center p-4 rounded-2xl border shadow-sm transition-all max-w-[180px] text-center ${
                      node.completed 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                        : level.unlocked 
                        ? 'bg-white border-purple-300 text-slate-800 hover:border-purple-500 shadow-md' 
                        : 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 font-bold ${
                      node.completed 
                        ? 'bg-emerald-500 text-white' 
                        : level.unlocked 
                        ? 'bg-purple-600 text-white shadow-mello' 
                        : 'bg-slate-300 text-slate-500'
                    }`}>
                      {node.completed ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : level.unlocked ? (
                        <Sparkles className="w-5 h-5" />
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>

                    <span className="font-bold text-xs line-clamp-1">{node.title}</span>
                    <span className="text-[10px] text-slate-500 mt-1">{node.description}</span>
                    
                    <span className="mt-2 px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full text-[10px] font-extrabold">
                      +{node.xp} XP
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
