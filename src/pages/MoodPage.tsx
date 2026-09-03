import React, { useState } from 'react';
import { Smile, Calendar, Plus, Tag, Sparkles, Filter, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MoodType } from '../types';

export const MoodPage: React.FC = () => {
  const { moods, logMood } = useApp();
  const [selectedMood, setSelectedMood] = useState<MoodType>('good');
  const [note, setNote] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Work']);
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');

  const moodConfig: Record<MoodType, { label: string; emoji: string; val: number; color: string }> = {
    great: { label: 'Great', emoji: '😊', val: 5, color: 'bg-emerald-500 text-white' },
    good: { label: 'Good', emoji: '🙂', val: 4, color: 'bg-teal-500 text-white' },
    okay: { label: 'Okay', emoji: '😐', val: 3, color: 'bg-amber-500 text-white' },
    low: { label: 'Low', emoji: '😔', val: 2, color: 'bg-purple-500 text-white' },
    overwhelmed: { label: 'Overwhelmed', emoji: '😣', val: 1, color: 'bg-rose-500 text-white' },
  };

  const tagOptions = ['College', 'Work', 'Relationships', 'Sleep', 'Family', 'Social', 'Self-care', 'Other'];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSubmitMood = (e: React.FormEvent) => {
    e.preventDefault();
    logMood(selectedMood, note, selectedTags);
    setNote('');
  };

  // Weekly dataset for visual graph representation
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const moodScoreMap: Record<string, number> = {
    '2026-08-03': 3,
    '2026-08-04': 4,
    '2026-08-05': 2,
    '2026-08-06': 3,
    '2026-08-07': 4,
    '2026-08-08': 5,
    '2026-08-09': 4,
  };

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-mello border border-purple-100 space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center font-bold">
            <Smile className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              Mood Tracker 📊
            </h1>
            <p className="text-slate-500 text-sm">
              Log your daily emotions and reflect on trends over time.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Log Mood Card */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-mello border border-purple-100 space-y-5">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <Plus className="w-4 h-4 text-purple-600" /> Log Today's Mood
          </h3>

          <form onSubmit={handleSubmitMood} className="space-y-4">
            {/* Mood selector buttons */}
            <div className="grid grid-cols-5 gap-2">
              {(Object.keys(moodConfig) as MoodType[]).map(m => {
                const isSelected = selectedMood === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMood(m)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isSelected ? 'bg-purple-600 text-white border-purple-600 font-bold scale-105 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl">{moodConfig[m].emoji}</span>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Optional Reflection Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What influenced how you felt today?"
                rows={2}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Context Tags</label>
              <div className="flex flex-wrap gap-1.5">
                {tagOptions.map(t => {
                  const sel = selectedTags.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTag(t)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                        sel ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-mello text-xs"
            >
              Save Mood Entry (+10 XP)
            </button>
          </form>
        </div>

        {/* Mood Visual Chart & History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visual Trend Chart */}
          <div className="bg-white p-6 rounded-3xl shadow-mello border border-purple-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-base">This Week's Mood Trend</h3>
              <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setTimeframe('weekly')}
                  className={`px-3 py-1 rounded-lg ${timeframe === 'weekly' ? 'bg-white shadow-xs text-purple-700' : 'text-slate-500'}`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setTimeframe('monthly')}
                  className={`px-3 py-1 rounded-lg ${timeframe === 'monthly' ? 'bg-white shadow-xs text-purple-700' : 'text-slate-500'}`}
                >
                  Monthly
                </button>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="h-44 bg-gradient-to-b from-purple-50/40 to-white rounded-2xl p-4 border border-purple-100 flex items-end justify-between gap-2">
              {daysOfWeek.map((day, idx) => {
                const score = idx === 6 ? moodConfig[selectedMood].val : (idx === 5 ? 5 : (idx === 4 ? 4 : (idx === 3 ? 3 : (idx === 2 ? 2 : 4))));
                const heightPercent = (score / 5) * 100;
                return (
                  <div key={day} className="flex-1 flex flex-col items-center space-y-2 h-full justify-end">
                    <span className="text-xs">{score === 5 ? '😊' : score === 4 ? '🙂' : score === 3 ? '😐' : score === 2 ? '😔' : '😣'}</span>
                    <div className="w-full bg-slate-100 rounded-full h-full max-h-[100px] flex items-end overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-t from-purple-500 to-indigo-500 rounded-t-full transition-all duration-500"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* History Feed */}
          <div className="bg-white p-6 rounded-3xl shadow-mello border border-purple-100 space-y-4">
            <h3 className="font-bold text-slate-800 text-base">Recent Check-in Log</h3>
            <div className="space-y-3">
              {moods.map(m => (
                <div key={m.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{moodConfig[m.mood].emoji}</span>
                    <div>
                      <div className="font-bold text-slate-800 capitalize">{moodConfig[m.mood].label}</div>
                      {m.note && <p className="text-slate-500 text-[11px]">"{m.note}"</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-medium block">{m.date}</span>
                    <div className="flex gap-1 mt-0.5 justify-end">
                      {m.tags.map(t => (
                        <span key={t} className="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded text-[9px] font-bold">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
        <Info className="w-4 h-4 text-purple-600" />
        <span>Mello mood tracking is for personal emotional reflection and never diagnoses clinical conditions.</span>
      </div>
    </div>
  );
};
