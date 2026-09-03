import React, { useState } from 'react';
import { ShieldCheck, Download, Trash2, Database, Eye, Lock, RefreshCw, Key } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PrivacyPage: React.FC = () => {
  const { user, updateUser, showToast, resetDemoData } = useApp();
  const [memoryEnabled, setMemoryEnabled] = useState(user.aiMemoryEnabled);

  const handleToggleMemory = () => {
    const next = !memoryEnabled;
    setMemoryEnabled(next);
    updateUser({ aiMemoryEnabled: next });
    showToast(next ? 'AI Memory Enabled' : 'AI Memory Disabled', 'info');
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      user,
      exportDate: new Date().toISOString(),
      platform: 'Mello Mental Wellness'
    }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mello_privacy_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Your Mello data export JSON downloaded!', 'success');
  };

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-mello border border-purple-100 space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              Your Privacy 🔒
            </h1>
            <p className="text-slate-500 text-sm">
              Your data is private. You own your conversations, moods, and reflections.
            </p>
          </div>
        </div>
      </div>

      {/* Controls Container */}
      <div className="space-y-6">
        {/* AI Memory Control Card */}
        <div className="bg-white p-6 rounded-3xl shadow-mello border border-purple-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-600" /> AI Memory Control
              </h3>
              <p className="text-xs text-slate-500 max-w-md">
                When enabled, Mello remembers selected information (like your preferred name and goals) to make future conversations more useful.
              </p>
            </div>
            
            <button
              onClick={handleToggleMemory}
              className={`px-4 py-2 rounded-2xl font-bold text-xs transition-colors ${
                memoryEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {memoryEnabled ? 'AI Memory ON' : 'AI Memory OFF'}
            </button>
          </div>
        </div>

        {/* Data Ownership & Export */}
        <div className="bg-white p-6 rounded-3xl shadow-mello border border-purple-100 space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Download className="w-4 h-4 text-purple-600" /> Export Your Personal Data
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            You can download a complete JSON file containing your profile, mood logs, and journal reflections at any time.
          </p>
          <button
            onClick={handleExportData}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Complete Data Export (JSON)
          </button>
        </div>

        {/* Permanent Data Wiping Controls */}
        <div className="bg-rose-50/70 p-6 rounded-3xl border border-rose-200 space-y-4">
          <h3 className="font-bold text-rose-900 text-base flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-600" /> Danger Zone & Permanent Deletion
          </h3>
          <p className="text-xs text-rose-800 leading-relaxed">
            Permanently clear all conversation history, mood entries, and journal reflections from your device.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={resetDemoData}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Clear All Local Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
