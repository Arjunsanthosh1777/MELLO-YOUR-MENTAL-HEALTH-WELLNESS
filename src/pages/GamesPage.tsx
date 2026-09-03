import React, { useState } from 'react';
import { Sparkles, Gamepad2, Play, Clock, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_GAMES } from '../services/storageService';
import { CalmBubble } from '../components/games/CalmBubble';
import { ZenGarden } from '../components/games/ZenGarden';
import { ColorFlow } from '../components/games/ColorFlow';
import { MindfulMaze } from '../components/games/MindfulMaze';
import { CloudStack } from '../components/games/CloudStack';
import { BreathingBloom } from '../components/games/BreathingBloom';
import { GratitudeGarden } from '../components/games/GratitudeGarden';

export const GamesPage: React.FC = () => {
  const { selectedGameId } = useApp();
  const [activeGameId, setActiveGameId] = useState<string | null>(selectedGameId || null);

  const renderGame = () => {
    switch (activeGameId) {
      case 'calm-bubble': return <CalmBubble onBack={() => setActiveGameId(null)} />;
      case 'zen-garden': return <ZenGarden onBack={() => setActiveGameId(null)} />;
      case 'color-flow': return <ColorFlow onBack={() => setActiveGameId(null)} />;
      case 'mindful-maze': return <MindfulMaze onBack={() => setActiveGameId(null)} />;
      case 'cloud-stack': return <CloudStack onBack={() => setActiveGameId(null)} />;
      case 'breathing-bloom': return <BreathingBloom onBack={() => setActiveGameId(null)} />;
      case 'gratitude-garden': return <GratitudeGarden onBack={() => setActiveGameId(null)} />;
      default: return null;
    }
  };

  if (activeGameId) {
    return <div className="py-4">{renderGame()}</div>;
  }

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-mello border border-purple-100 space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center font-bold">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              Mello Games 🎮
            </h1>
            <p className="text-slate-500 text-sm">
              Short, calming mini-games designed to ease tension and bring gentle focus.
            </p>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INITIAL_GAMES.map(game => (
          <div 
            key={game.id}
            className={`p-6 rounded-3xl border ${game.bgGradient} flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold font-heading">{game.title}</span>
                <span className="px-2.5 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-extrabold text-amber-700 border border-amber-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" /> +{game.xpReward} XP
                </span>
              </div>

              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                {game.description}
              </p>

              <div className="flex items-center space-x-4 text-[11px] text-slate-500 font-semibold pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {game.duration}
                </span>
                <span>• {game.purpose}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveGameId(game.id)}
              className="w-full py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl border border-slate-200 shadow-xs flex items-center justify-center gap-2 text-xs transition-colors"
            >
              <Play className="w-4 h-4 text-purple-600 fill-purple-600" /> Start Relaxation Session
            </button>
          </div>
        ))}
      </div>

      {/* Non-clinical Disclaimer Footer */}
      <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 text-center text-xs text-purple-900">
        💡 Mello Games are stress-relief and relaxation activities. They do not replace clinical treatment for anxiety or depression.
      </div>
    </div>
  );
};
