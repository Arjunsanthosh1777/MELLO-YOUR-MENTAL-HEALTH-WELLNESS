import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, Trophy, Sparkles, Wind } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

export const BreathingBloom: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { earnXP } = useApp();
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');
  const [timer, setTimer] = useState<number>(4);
  const [cycleCount, setCycleCount] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (!isActive || isFinished) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev > 1) return prev - 1;

        // Phase transitions (Box breathing: 4s Inhale, 4s Hold, 4s Exhale, 4s Hold)
        if (phase === 'Inhale') { setPhase('Hold'); return 4; }
        if (phase === 'Hold') { setPhase('Exhale'); return 4; }
        if (phase === 'Exhale') { setPhase('Pause'); return 4; }
        if (phase === 'Pause') { 
          setCycleCount(c => {
            const next = c + 1;
            if (next >= 4) {
              setTimeout(handleFinish, 300);
            }
            return next;
          });
          setPhase('Inhale'); 
          return 4; 
        }
        return 4;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase, isFinished]);

  const handleFinish = () => {
    setIsFinished(true);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    earnXP(15, 'Breathing Bloom session');
  };

  const getPetalScale = () => {
    if (phase === 'Inhale') return 1.4;
    if (phase === 'Hold') return 1.4;
    if (phase === 'Exhale') return 0.8;
    return 0.8;
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-mello border border-rose-100 flex flex-col justify-between min-h-[480px]">
      <div className="flex items-center justify-between z-10 mb-4">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800">
          <ArrowLeft className="w-4 h-4" /> Back to Games
        </button>
        <span className="bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-xs font-bold border border-rose-100">
          Breathing Bloom 🌸 (Cycle {cycleCount + 1}/4)
        </span>
      </div>

      {!isFinished ? (
        <div className="my-auto text-center space-y-6">
          {/* Animated Blooming Flower */}
          <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
            {/* Outer Aura */}
            <motion.div
              animate={{ scale: getPetalScale() }}
              transition={{ duration: 4, ease: 'easeInOut' }}
              className="absolute inset-0 bg-gradient-to-br from-rose-200/50 via-purple-200/40 to-pink-200/50 rounded-full blur-xl"
            />

            {/* Petals */}
            <motion.div
              animate={{ scale: getPetalScale(), rotate: phase === 'Inhale' ? 45 : 0 }}
              transition={{ duration: 4, ease: 'easeInOut' }}
              className="relative w-40 h-40 bg-gradient-to-br from-rose-400 via-pink-400 to-purple-400 rounded-full shadow-mello-glow flex items-center justify-center text-white"
            >
              <Wind className="w-12 h-12 text-white/90" />
            </motion.div>
          </div>

          {/* Phase Guidance & Countdown */}
          <div className="space-y-1">
            <h3 className="text-3xl font-extrabold font-heading text-slate-800">
              {phase === 'Inhale' && 'Breathe In... 🌬️'}
              {phase === 'Hold' && 'Hold Gently... 🧘'}
              {phase === 'Exhale' && 'Breathe Out Slowly... 💨'}
              {phase === 'Pause' && 'Rest & Pause... 🌸'}
            </h3>
            <p className="text-4xl font-bold font-mono text-purple-600">{timer}s</p>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => setIsActive(!isActive)}
              className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center gap-2 text-sm"
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isActive ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 space-y-4">
          <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-slate-800">Calm Physiology Restored! 🌸</h2>
          <p className="text-slate-600 text-sm max-w-sm mx-auto">
            You completed 4 full cycles of box breathing. Your heart rate and nervous system thank you!
          </p>
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 font-bold px-4 py-2 rounded-2xl text-sm">
            <Sparkles className="w-4 h-4 text-amber-600" /> +15 Mind Points Earned!
          </div>
          <div className="pt-4 flex justify-center gap-3">
            <button onClick={onBack} className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-md">
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
