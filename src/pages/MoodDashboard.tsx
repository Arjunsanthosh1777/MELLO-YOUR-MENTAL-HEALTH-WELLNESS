import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  Heart,
  Sparkles,
  Smile,
  Activity,
  MessageCircle,
  Gamepad2,
  BookOpen,
  ArrowRight,
  Send,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  X,
} from 'lucide-react';

import { useApp } from '../context/AppContext';

import {
  analyzeStudentStress,
  type StressAnalysis,
} from '../services/stressService';

export const MoodDashboard: React.FC = () => {
  const { navigate } = useApp();

  /* =========================================================
     STRESS ANALYZER STATE
  ========================================================= */

  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [studentText, setStudentText] = useState('');
  const [stressAnalysis, setStressAnalysis] =
    useState<StressAnalysis | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  /* =========================================================
     DEMO MOOD DATA
  ========================================================= */

  const moodData = [
    { day: 'Mon', emoji: '😊', score: 78 },
    { day: 'Tue', emoji: '😌', score: 82 },
    { day: 'Wed', emoji: '😟', score: 55 },
    { day: 'Thu', emoji: '😔', score: 48 },
    { day: 'Fri', emoji: '😌', score: 70 },
    { day: 'Sat', emoji: '😊', score: 86 },
    { day: 'Sun', emoji: '😊', score: 91 },
  ];

  const emotions = [
    { name: 'Happy', emoji: '😊', value: 45 },
    { name: 'Calm', emoji: '😌', value: 30 },
    { name: 'Stressed', emoji: '😟', value: 15 },
    { name: 'Sad', emoji: '😔', value: 10 },
  ];

  /* =========================================================
     ANALYZE STUDENT STRESS
  ========================================================= */

  const handleAnalyzeStress = async () => {
    if (!studentText.trim()) return;

    setIsAnalyzing(true);
    setStressAnalysis(null);

    // Small delay makes the AI analysis feel natural in the demo.
    await new Promise((resolve) => setTimeout(resolve, 700));

    const result = analyzeStudentStress(studentText);

    setStressAnalysis(result);
    setIsAnalyzing(false);
  };

  /* =========================================================
     STRESS LEVEL UI
  ========================================================= */

  const getStressColor = (
    level: StressAnalysis['level'],
  ) => {
    switch (level) {
      case 'low':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-700',
          bar: 'bg-emerald-500',
          label: 'LOW',
          emoji: '🟢',
        };

      case 'moderate':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-700',
          bar: 'bg-amber-500',
          label: 'MODERATE',
          emoji: '🟡',
        };

      case 'high':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-700',
          bar: 'bg-orange-500',
          label: 'HIGH',
          emoji: '🟠',
        };

      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          bar: 'bg-red-500',
          label: 'CRITICAL',
          emoji: '🔴',
        };
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
                Mood Dashboard
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Understand your emotional journey with Mello.
              </p>
            </div>

          </div>
        </div>

        <button
          onClick={() => {
            setShowAnalyzer((previous) => !previous);

            if (showAnalyzer) {
              setStressAnalysis(null);
            }
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold transition shadow-lg shadow-purple-200"
        >
          {showAnalyzer ? (
            <>
              <X className="w-4 h-4" />
              Close Analyzer
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Check My Mood
            </>
          )}
        </button>
      </motion.div>

      {/* =====================================================
          AI STUDENT STRESS ANALYZER
      ===================================================== */}

      {showAnalyzer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-purple-100 bg-white shadow-mello overflow-hidden"
        >

          {/* Analyzer Header */}

          <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 p-6 sm:p-8 text-white">

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold">
                  AI Student Stress Analyzer
                </h2>

                <p className="text-sm text-purple-100 mt-1">
                  Tell Mello what is on your mind and get a personalized
                  wellness insight.
                </p>
              </div>

            </div>

          </div>

          <div className="p-6 sm:p-8">

            {/* Input */}

            <label className="block text-sm font-bold text-slate-800 mb-3">
              How are you feeling today?
            </label>

            <textarea
              value={studentText}
              onChange={(event) =>
                setStudentText(event.target.value)
              }
              placeholder="Example: I have two exams next week and several assignments due. I am feeling overwhelmed and I cannot concentrate..."
              rows={5}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-800 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4">

              <p className="text-xs text-slate-400">
                Mello analyzes emotional and stress signals.
              </p>

              <button
                onClick={handleAnalyzeStress}
                disabled={
                  !studentText.trim() || isAnalyzing
                }
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-bold transition"
              >
                {isAnalyzing ? (
                  <>
                    <Activity className="w-4 h-4 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Analyze My Stress
                  </>
                )}
              </button>

            </div>

            {/* =================================================
                ANALYSIS RESULT
            ================================================= */}

            {stressAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 space-y-5"
              >

                {/* Safety Result */}

                {stressAnalysis.safetyConcern ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

                    <div className="flex items-start gap-3">

                      <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-5 h-5 text-red-600" />
                      </div>

                      <div>
                        <h3 className="font-bold text-red-800">
                          You deserve immediate support
                        </h3>

                        <p className="text-sm text-red-700 mt-1 leading-relaxed">
                          Your message contains signals that may need
                          immediate human support. Please connect with
                          someone you trust or a qualified professional.
                          If you may be in immediate danger, contact
                          your local emergency service.
                        </p>
                      </div>

                    </div>

                  </div>
                ) : null}

                {/* Main Result */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                  {/* Stress Score */}

                  <div
                    className={`rounded-3xl border p-6 ${
                      getStressColor(stressAnalysis.level).bg
                    } ${
                      getStressColor(stressAnalysis.level).border
                    }`}
                  >

                    <div className="flex items-center justify-between">

                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Stress Level
                      </span>

                      <span className="text-xl">
                        {getStressColor(
                          stressAnalysis.level,
                        ).emoji}
                      </span>

                    </div>

                    <div className="mt-5">

                      <h3
                        className={`text-3xl font-extrabold ${
                          getStressColor(
                            stressAnalysis.level,
                          ).text
                        }`}
                      >
                        {
                          getStressColor(
                            stressAnalysis.level,
                          ).label
                        }
                      </h3>

                      <div className="flex items-end gap-2 mt-2">

                        <span className="text-4xl font-extrabold text-slate-900">
                          {stressAnalysis.score}
                        </span>

                        <span className="text-sm text-slate-400 mb-1">
                          / 100
                        </span>

                      </div>

                      <div className="h-2.5 bg-white/80 rounded-full overflow-hidden mt-4">

                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${stressAnalysis.score}%`,
                          }}
                          transition={{ duration: 0.8 }}
                          className={`h-full rounded-full ${
                            getStressColor(
                              stressAnalysis.level,
                            ).bar
                          }`}
                        />

                      </div>

                      <p className="text-xs text-slate-500 mt-3">
                        AI confidence:{' '}
                        {stressAnalysis.confidence}%
                      </p>

                    </div>

                  </div>

                  {/* Mood */}

                  <div className="rounded-3xl border border-purple-100 bg-purple-50/60 p-6">

                    <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                      Detected Mood
                    </span>

                    <div className="flex items-center gap-4 mt-5">

                      <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-sm">
                        {stressAnalysis.mood === 'Positive'
                          ? '😊'
                          : stressAnalysis.mood === 'Stressed'
                            ? '😟'
                            : stressAnalysis.mood === 'Highly stressed'
                              ? '😣'
                              : stressAnalysis.mood === 'Concerned'
                                ? '😕'
                                : '😐'}
                      </div>

                      <div>
                        <h3 className="text-xl font-extrabold text-slate-900">
                          {stressAnalysis.mood}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                          Emotional signal detected
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* Factors */}

                  <div className="rounded-3xl border border-purple-100 bg-white p-6">

                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Possible Stress Factors
                    </span>

                    <div className="flex flex-wrap gap-2 mt-5">

                      {stressAnalysis.factors.map(
                        (factor) => (
                          <span
                            key={factor}
                            className="px-3 py-2 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold"
                          >
                            {factor}
                          </span>
                        ),
                      )}

                    </div>

                  </div>

                </div>

                {/* AI Insight */}

                <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-6">

                  <div className="flex items-start gap-3">

                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                      <Brain className="w-5 h-5 text-indigo-600" />
                    </div>

                    <div>

                      <h3 className="font-bold text-slate-900">
                        Mello's AI Insight
                      </h3>

                      <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                        {stressAnalysis.explanation}
                      </p>

                    </div>

                  </div>

                </div>

                {/* Recommendations */}

                {stressAnalysis.recommendations.length >
                  0 && (
                  <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6">

                    <div className="flex items-center gap-3 mb-5">

                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900">
                          Personalized Support
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                          Suggestions based on your current result
                        </p>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                      {stressAnalysis.recommendations.map(
                        (recommendation, index) => (
                          <div
                            key={`${recommendation}-${index}`}
                            className="flex items-start gap-3 bg-white rounded-2xl p-4 border border-emerald-100"
                          >

                            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 text-xs font-bold text-emerald-700">
                              {index + 1}
                            </div>

                            <p className="text-sm text-slate-600 leading-relaxed">
                              {recommendation}
                            </p>

                          </div>
                        ),
                      )}

                    </div>

                  </div>
                )}

                {/* Actions */}

                {!stressAnalysis.safetyConcern && (
                  <div className="flex flex-col sm:flex-row gap-3">

                    <button
                      onClick={() =>
                        navigate('games', {
                          gameId: 'breathing-bloom',
                        })
                      }
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold transition"
                    >
                      <Activity className="w-4 h-4" />
                      Try a Breathing Exercise
                    </button>

                    <button
                      onClick={() => navigate('talk')}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-purple-200 bg-white hover:bg-purple-50 text-purple-700 text-sm font-bold transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Talk to Mello
                    </button>

                  </div>
                )}

                <p className="text-[11px] text-slate-400 text-center">
                  This is a wellness-support tool and not a medical
                  diagnosis.
                </p>

              </motion.div>
            )}

          </div>

        </motion.div>
      )}

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

        {/* Current Mood */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border border-purple-100 shadow-mello p-6"
        >

          <div className="flex items-center justify-between">

            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Current Mood
            </span>

            <Heart className="w-5 h-5 text-pink-500" />

          </div>

          <div className="flex items-center gap-4 mt-5">

            <div className="text-5xl">
              😊
            </div>

            <div>

              <h2 className="text-2xl font-extrabold text-slate-900">
                Happy
              </h2>

              <p className="text-sm text-slate-500">
                Feeling positive
              </p>

            </div>

          </div>

        </motion.div>

        {/* Mood Score */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl border border-purple-100 shadow-mello p-6"
        >

          <div className="flex items-center justify-between">

            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Mood Score
            </span>

            <Activity className="w-5 h-5 text-purple-500" />

          </div>

          <div className="flex items-end gap-2 mt-5">

            <span className="text-4xl font-extrabold text-purple-600">
              82
            </span>

            <span className="text-sm text-slate-400 mb-1">
              / 100
            </span>

          </div>

          <div className="mt-4 h-2.5 bg-purple-100 rounded-full overflow-hidden">

            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
              style={{ width: '82%' }}
            />

          </div>

        </motion.div>

        {/* Trend */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-100 p-6"
        >

          <div className="flex items-center justify-between">

            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Weekly Trend
            </span>

            <TrendingUp className="w-5 h-5 text-emerald-600" />

          </div>

          <div className="mt-5">

            <h2 className="text-2xl font-extrabold text-emerald-800">
              Improving
            </h2>

            <p className="text-sm text-slate-600 mt-1">
              Your mood is getting better.
            </p>

          </div>

        </motion.div>

      </div>

      {/* =====================================================
          WEEKLY MOOD CHART
      ===================================================== */}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white rounded-3xl border border-purple-100 shadow-mello p-6 sm:p-8"
      >

        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              Your Mood This Week
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              A quick look at your emotional pattern.
            </p>

          </div>

          <span className="hidden sm:block text-xs font-bold bg-purple-50 text-purple-600 px-3 py-2 rounded-xl">
            Last 7 Days
          </span>

        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-64">

          {moodData.map((item) => (

            <div
              key={item.day}
              className="h-full flex flex-col items-center justify-end gap-2"
            >

              <span className="text-2xl">
                {item.emoji}
              </span>

              <div className="w-full max-w-10 h-40 bg-purple-50 rounded-2xl flex items-end overflow-hidden">

                <motion.div
                  initial={{ height: 0 }}
                  animate={{
                    height: `${item.score}%`,
                  }}
                  transition={{ duration: 0.7 }}
                  className="w-full bg-gradient-to-t from-purple-600 to-indigo-400 rounded-2xl"
                />

              </div>

              <span className="text-xs font-bold text-slate-500">
                {item.day}
              </span>

            </div>

          ))}

        </div>

      </motion.div>

      {/* =====================================================
          EMOTION BREAKDOWN
      ===================================================== */}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl border border-purple-100 shadow-mello p-6 sm:p-8"
      >

        <div className="flex items-center gap-3 mb-6">

          <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
            <Smile className="w-5 h-5 text-pink-500" />
          </div>

          <div>

            <h2 className="font-bold text-slate-900">
              Emotion Breakdown
            </h2>

            <p className="text-xs text-slate-500">
              Your emotions over the last 7 days
            </p>

          </div>

        </div>

        <div className="space-y-5">

          {emotions.map((emotion) => (

            <div key={emotion.name}>

              <div className="flex items-center justify-between mb-2">

                <div className="flex items-center gap-2">

                  <span className="text-xl">
                    {emotion.emoji}
                  </span>

                  <span className="text-sm font-semibold text-slate-700">
                    {emotion.name}
                  </span>

                </div>

                <span className="text-xs font-bold text-purple-600">
                  {emotion.value}%
                </span>

              </div>

              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${emotion.value}%`,
                  }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                />

              </div>

            </div>

          ))}

        </div>

      </motion.div>

      {/* =====================================================
          AI INSIGHT
      ===================================================== */}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-700 p-6 sm:p-8 text-white shadow-mello-lg relative overflow-hidden"
      >

        <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10">

          <div className="flex items-center gap-3 mb-4">

            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>

            <div>

              <h2 className="font-bold text-lg">
                Mello's AI Insight
              </h2>

              <p className="text-xs text-purple-200">
                Based on your recent mood pattern
              </p>

            </div>

          </div>

          <p className="text-sm sm:text-base text-purple-100 leading-relaxed max-w-3xl">
            Your mood appears to be improving this week. You
            have experienced more positive emotions during the
            last few days. Keep taking small moments for yourself
            and continue the activities that help you feel calm.
          </p>

        </div>

      </motion.div>

      {/* =====================================================
          RECOMMENDED ACTIVITIES
      ===================================================== */}

      <div>

        <div className="flex items-center justify-between mb-4">

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              Recommended For You
            </h2>

            <p className="text-sm text-slate-500">
              Small steps based on your mood.
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

          {/* Breathing */}

          <div className="bg-white rounded-3xl border border-purple-100 shadow-mello p-5">

            <div className="w-11 h-11 rounded-xl bg-sky-100 flex items-center justify-center mb-4">
              <Activity className="w-5 h-5 text-sky-600" />
            </div>

            <h3 className="font-bold text-slate-900">
              Breathing Exercise
            </h3>

            <p className="text-xs text-slate-500 mt-2">
              Take a few peaceful minutes to reset.
            </p>

            <button
              onClick={() =>
                navigate('games', {
                  gameId: 'breathing-bloom',
                })
              }
              className="mt-4 text-xs font-bold text-purple-600 flex items-center gap-1"
            >
              Start
              <ArrowRight className="w-3 h-3" />
            </button>

          </div>

          {/* Game */}

          <div className="bg-white rounded-3xl border border-purple-100 shadow-mello p-5">

            <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
              <Gamepad2 className="w-5 h-5 text-amber-600" />
            </div>

            <h3 className="font-bold text-slate-900">
              Relaxing Game
            </h3>

            <p className="text-xs text-slate-500 mt-2">
              Give your mind a fun little break.
            </p>

            <button
              onClick={() => navigate('games')}
              className="mt-4 text-xs font-bold text-purple-600 flex items-center gap-1"
            >
              Play
              <ArrowRight className="w-3 h-3" />
            </button>

          </div>

          {/* Journal */}

          <div className="bg-white rounded-3xl border border-purple-100 shadow-mello p-5">

            <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5 text-emerald-600" />
            </div>

            <h3 className="font-bold text-slate-900">
              Write in Journal
            </h3>

            <p className="text-xs text-slate-500 mt-2">
              Put your thoughts into words.
            </p>

            <button
              onClick={() => navigate('journal')}
              className="mt-4 text-xs font-bold text-purple-600 flex items-center gap-1"
            >
              Journal
              <ArrowRight className="w-3 h-3" />
            </button>

          </div>

        </div>

      </div>

      {/* =====================================================
          TALK TO MELLO
      ===================================================== */}

      <div className="rounded-3xl bg-purple-50 border border-purple-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
            <MessageCircle className="w-6 h-6 text-purple-600" />
          </div>

          <div>

            <h3 className="font-bold text-slate-900">
              Want to talk about your feelings?
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Mello is here to listen without judgment.
            </p>

          </div>

        </div>

        <button
          onClick={() => navigate('talk')}
          className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold"
        >
          Talk to Mello
        </button>

      </div>

    </div>
  );
};

export default MoodDashboard;