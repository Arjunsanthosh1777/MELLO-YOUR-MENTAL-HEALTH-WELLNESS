import React, { useState } from 'react';
import { Settings, Bell, Moon, Sun, Shield, Lock, Volume2, Brain, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const {
    user,
    updateUser,
    showToast,
    melloMemories,
    melloMemoryEnabled,
    setMelloMemoryEnabled,
    deleteMelloMemory,
    clearMelloMemories,
  } = useApp();
  const [dailyReminder, setDailyReminder] = useState(true);
  const [eveningReflection, setEveningReflection] = useState(true);
  const [wellnessActivity, setWellnessActivity] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSave = () => {
    showToast('Preferences updated!', 'success');
  };

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-mello border border-purple-100 space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center font-bold">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              Settings & Preferences ⚙️
            </h1>
            <p className="text-slate-500 text-sm">
              Customize check-in notifications and gentle sound preferences.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-mello border border-purple-100 space-y-6">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Bell className="w-4 h-4 text-purple-600" /> Notification Reminders
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Daily Morning Check-in</span>
              <span className="text-[10px] text-slate-500">Gentle morning invitation to log how you feel</span>
            </div>
            <input
              type="checkbox"
              checked={dailyReminder}
              onChange={(e) => setDailyReminder(e.target.checked)}
              className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Evening Wind-down Reflection</span>
              <span className="text-[10px] text-slate-500">8:00 PM reflection prompt before sleep</span>
            </div>
            <input
              type="checkbox"
              checked={eveningReflection}
              onChange={(e) => setEveningReflection(e.target.checked)}
              className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Wellness Activity Reminders</span>
              <span className="text-[10px] text-slate-500">Pings for games and box breathing</span>
            </div>
            <input
              type="checkbox"
              checked={wellnessActivity}
              onChange={(e) => setWellnessActivity(e.target.checked)}
              className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-mello text-xs"
        >
          Save Notification Settings
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-mello border border-purple-100 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-600" /> Mello Memory
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Mello can remember useful things to make future conversations more personalized.
            </p>
          </div>
          <input
            type="checkbox"
            checked={melloMemoryEnabled}
            onChange={(event) => setMelloMemoryEnabled(event.target.checked)}
            className="w-5 h-5 accent-purple-600 rounded cursor-pointer shrink-0"
            aria-label="Enable Mello Memory"
          />
        </div>

        {melloMemoryEnabled && (
          <>
            <div className="space-y-2">
              {melloMemories.length === 0 ? (
                <p className="text-xs text-slate-500 bg-slate-50 rounded-2xl p-3">
                  No saved memories yet. Mello only saves useful, longer-term details you explicitly share.
                </p>
              ) : (
                melloMemories.map(memory => (
                  <div key={memory.id} className="flex items-center justify-between gap-3 bg-slate-50 rounded-2xl p-3">
                    <p className="text-xs text-slate-700">{memory.value}</p>
                    <button
                      type="button"
                      onClick={() => deleteMelloMemory(memory.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete memory"
                      aria-label={`Delete memory: ${memory.value}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {melloMemories.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  clearMelloMemories();
                  showToast('Mello memories cleared.', 'success');
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-700"
              >
                Clear Mello memories
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
