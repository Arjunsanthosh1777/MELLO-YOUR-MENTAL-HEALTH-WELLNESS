import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, Gamepad2, Heart, ShieldCheck, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MelloAvatar } from '../components/common/MelloAvatar';

export const LandingPage: React.FC = () => {
  const { navigate, setIsDemoUser } = useApp();

  const floatingBadges = [
    { label: 'Mood 😊', pos: '-top-6 -left-8', bg: 'bg-amber-100 text-amber-800' },
    { label: 'Talk 💬', pos: 'top-8 -right-12', bg: 'bg-purple-100 text-purple-800' },
    { label: 'Relax 🧘', pos: 'bottom-10 -left-12', bg: 'bg-emerald-100 text-emerald-800' },
    { label: 'Journey 🗺️', pos: '-bottom-4 right-2', bg: 'bg-sky-100 text-sky-800' }
  ];

  const featureCards = [
    {
      title: 'Talk to Mello',
      desc: 'Have supportive, judgment-free conversations whenever you need someone to listen.',
      icon: MessageCircle,
      bg: 'bg-purple-50 border-purple-100 text-purple-700'
    },
    {
      title: 'Relax & Reset',
      desc: 'Play calming mini-games and guided breathing exercises designed to lower stress.',
      icon: Gamepad2,
      bg: 'bg-emerald-50 border-emerald-100 text-emerald-700'
    },
    {
      title: 'Reflect & Track',
      desc: 'Understand your emotional patterns over time through mood logging and private journals.',
      icon: Heart,
      bg: 'bg-pink-50 border-pink-100 text-pink-700'
    },
    {
      title: 'Human Support',
      desc: 'Seamlessly connect with verified mental-health professionals when you need extra guidance.',
      icon: UserCheck,
      bg: 'bg-sky-50 border-sky-100 text-sky-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/80 via-white to-slate-50 text-slate-800">
      {/* Navigation Header */}
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('landing')}>
          <div className="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center border border-purple-200">
            <MelloAvatar size="sm" animate={false} />
          </div>
          <span className="text-2xl font-extrabold font-heading gradient-text-mello tracking-tight">Mello</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsDemoUser(true)}
            className="px-4 py-2 text-xs font-bold text-purple-700 bg-purple-100/80 hover:bg-purple-200 rounded-xl transition-colors border border-purple-200"
          >
            ⚡ Quick Judge Demo
          </button>
          <button
            onClick={() => navigate('auth')}
            className="px-5 py-2 text-sm font-semibold text-slate-700 hover:text-purple-700 transition-colors"
          >
            Log In
          </button>
          <button
            onClick={() => navigate('auth')}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl shadow-mello transition-all transform hover:-translate-y-0.5"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 bg-purple-100/70 border border-purple-200 px-4 py-1.5 rounded-full text-xs font-bold text-purple-800">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Your Daily Mental-Wellness Companion</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold font-heading text-slate-900 leading-tight">
            You don't have to carry everything <span className="gradient-text-mello">alone.</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed mx-auto lg:mx-0">
            Mello is your friendly daily space for supportive conversations, calming activities, emotional reflection, and meaningful human care.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
            <button
              onClick={() => navigate('auth')}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-mello-lg text-base flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1"
            >
              Start Your Mello Journey <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsDemoUser(true)}
              className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-2xl border border-slate-200 shadow-sm text-base transition-colors"
            >
              Explore Demo Mode
            </button>
          </div>

          <div className="pt-4 flex items-center justify-center lg:justify-start space-x-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Private & Safe
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-500" /> Non-Clinical & Gentle
            </span>
          </div>
        </div>

        {/* Hero Visual Mascot with Floating Badges */}
        <div className="relative flex justify-center py-10">
          <div className="relative p-10 bg-gradient-to-br from-purple-100/60 via-pink-100/40 to-indigo-100/60 rounded-full border border-purple-200/50 shadow-2xl">
            <MelloAvatar size="xl" animate={true} />

            {/* Floating Orbit Elements */}
            {floatingBadges.map((badge, idx) => (
              <motion.div
                key={idx}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3 + idx, repeat: Infinity, ease: 'easeInOut' }}
                className={`absolute ${badge.pos} px-4 py-2 rounded-2xl shadow-lg border border-white/60 font-bold text-xs ${badge.bg}`}
              >
                {badge.label}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="bg-white py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold font-heading text-slate-900">
              Your mind deserves small moments of care.
            </h2>
            <p className="text-slate-600 text-sm">
              Mello provides gentle, science-informed daily tools designed to help you check in with yourself.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className={`p-6 rounded-3xl border ${feat.bg} space-y-4 shadow-sm hover:shadow-md transition-shadow`}>
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{feat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Non-Clinical Position Disclaimer Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800 text-center text-xs space-y-4">
        <div className="max-w-3xl mx-auto space-y-2">
          <p className="text-slate-300 font-semibold">Important Medical & Safety Disclaimer</p>
          <p className="leading-relaxed">
            Mello is a friendly daily mental-wellness companion created for emotional support, stress relief, and habit building. 
            Mello does NOT diagnose, treat, or cure medical conditions, depression, or mental health disorders, and does not replace licensed medical or psychological therapy.
            If you are in distress or danger, please access our 24/7 emergency safety resources.
          </p>
        </div>
        <p className="text-slate-500">© 2026 Mello Inc. "A little support, every day."</p>
      </footer>
    </div>
  );
};
