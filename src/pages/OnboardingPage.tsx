import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Sparkles, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MelloAvatar } from '../components/common/MelloAvatar';

export const OnboardingPage: React.FC = () => {
  const { user, updateUser, navigate, showToast } = useApp();
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Stress', 'Building healthy habits']);
  const [frequency, setFrequency] = useState<'daily' | 'twice_daily' | 'as_needed'>('daily');

  const goalOptions = [
    'Stress',
    'Feeling overwhelmed',
    'Loneliness',
    'Building healthy habits',
    'Understanding emotions',
    'Just having someone to talk to',
    'General wellness'
  ];

  const frequencyOptions = [
    { id: 'daily', label: 'Once a day', desc: 'A gentle daily pause' },
    { id: 'twice_daily', label: 'Morning & evening', desc: 'Start and end your day with reflection' },
    { id: 'as_needed', label: 'Whenever I need it', desc: 'No pressure, on your own terms' }
  ];

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const handleFinish = () => {
    updateUser({
      goals: selectedGoals,
      checkInFrequency: frequency,
      onboardingCompleted: true
    });
    showToast('Preferences saved! Welcome to Mello.', 'success');
    navigate('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col justify-between p-4 sm:p-6">
      <div className="max-w-lg w-full mx-auto my-auto bg-white rounded-3xl shadow-mello-lg border border-purple-100 p-6 sm:p-10 space-y-8">
        {/* Progress Bar */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
          <span>Step {step} of 4</span>
          <div className="flex space-x-1.5">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s === step ? 'w-8 bg-purple-600' : s < step ? 'w-2 bg-purple-300' : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center space-y-4 py-4">
              <MelloAvatar size="xl" className="mx-auto" />
              <h2 className="text-3xl font-extrabold font-heading text-slate-900">
                Welcome to Mello 🌱
              </h2>
              <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
                Hi {user.name || 'friend'}! I'm Mello, your daily companion. I'm here to listen, support, and help you take small positive steps every day.
              </p>
              <button
                onClick={() => setStep(2)}
                className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-mello flex items-center justify-center gap-2 text-base"
              >
                Let's Get Started <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold font-heading text-slate-900">
                  What would you like Mello to help you with?
                </h2>
                <p className="text-xs text-slate-500">Select all that apply to you.</p>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {goalOptions.map(goal => {
                  const selected = selectedGoals.includes(goal);
                  return (
                    <button
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        selected
                          ? 'bg-purple-50 border-purple-400 text-purple-900 font-bold shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-sm">{goal}</span>
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                        selected ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300'
                      }`}>
                        {selected && <Check className="w-4 h-4" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setStep(3)}
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-mello flex items-center justify-center gap-2 text-sm"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold font-heading text-slate-900">
                  How often would you like to check in?
                </h2>
                <p className="text-xs text-slate-500">You can always adjust this in settings.</p>
              </div>

              <div className="space-y-3">
                {frequencyOptions.map(opt => {
                  const selected = frequency === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setFrequency(opt.id as any)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        selected
                          ? 'bg-purple-50 border-purple-400 text-purple-900 font-bold shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-bold">{opt.label}</div>
                        <div className="text-xs text-slate-500">{opt.desc}</div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                        selected ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300'
                      }`}>
                        {selected && <Check className="w-4 h-4" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setStep(4)}
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-mello flex items-center justify-center gap-2 text-sm"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center space-y-6 py-4">
              <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-10 h-10 animate-bounce" />
              </div>
              <h2 className="text-3xl font-extrabold font-heading text-slate-900">
                You're ready 🌱
              </h2>
              <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
                Let's take the first small step together. Your sanctuary is set up.
              </p>
              <button
                onClick={handleFinish}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold rounded-2xl shadow-mello-lg text-base transform hover:-translate-y-0.5 transition-all"
              >
                Enter Mello ✨
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
