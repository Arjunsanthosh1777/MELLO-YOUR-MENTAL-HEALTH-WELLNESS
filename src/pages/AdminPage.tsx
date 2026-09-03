import React, { useState } from 'react';
import { 
  Crown, Users, ShieldAlert, CheckCircle, Clock, 
  BarChart3, Settings, AlertTriangle, EyeOff, Lock 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_THERAPISTS } from '../services/storageService';

export const AdminPage: React.FC = () => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'analytics' | 'therapists' | 'safety' | 'users'>('analytics');

  const handleApprove = (name: string) => {
    showToast(`Therapist ${name} approved and verified!`, 'success');
  };

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-mello-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center font-bold border border-amber-500/30">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">
                Mello Admin Panel
              </h1>
              <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-extrabold rounded-full text-[10px] uppercase">
                Privacy Enforced
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-0.5">
              Platform administration, therapist verification, and safety audit logs.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="p-4 bg-purple-950/40 border border-purple-500/30 text-purple-200 rounded-2xl flex items-center space-x-3 text-xs">
        <Lock className="w-5 h-5 text-purple-400 shrink-0" />
        <span>
          <strong>Privacy Access Control:</strong> Admin accounts do NOT have access to private user chat logs or journal entries. Safety event logs are anonymized.
        </span>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'analytics' ? 'bg-purple-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Platform Analytics
        </button>
        <button
          onClick={() => setActiveTab('therapists')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'therapists' ? 'bg-purple-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Therapist Approvals (4)
        </button>
        <button
          onClick={() => setActiveTab('safety')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'safety' ? 'bg-purple-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Safety Audit Logs (0 Active Crises)
        </button>
      </div>

      {/* Tab 1: Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm space-y-1">
              <span className="text-xs text-slate-400 font-semibold block">Total Active Users</span>
              <span className="text-2xl font-extrabold text-slate-900">12,480</span>
              <span className="text-[10px] text-emerald-600 font-bold block">+14% this week</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm space-y-1">
              <span className="text-xs text-slate-400 font-semibold block">Daily Check-ins</span>
              <span className="text-2xl font-extrabold text-slate-900">8,920</span>
              <span className="text-[10px] text-emerald-600 font-bold block">71.4% engagement</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm space-y-1">
              <span className="text-xs text-slate-400 font-semibold block">Verified Therapists</span>
              <span className="text-2xl font-extrabold text-slate-900">42</span>
              <span className="text-[10px] text-purple-600 font-bold block">100% verified</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm space-y-1">
              <span className="text-xs text-slate-400 font-semibold block">Safety Interventions</span>
              <span className="text-2xl font-extrabold text-slate-900">14</span>
              <span className="text-[10px] text-slate-500 font-bold block">Handled safely</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Therapists Approvals */}
      {activeTab === 'therapists' && (
        <div className="bg-white p-6 rounded-3xl shadow-mello border border-purple-100 space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Pending & Verified Therapists</h3>
          <div className="space-y-3">
            {INITIAL_THERAPISTS.map(th => (
              <div key={th.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <img src={th.avatar} alt={th.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <span className="font-bold text-slate-900 block">{th.name}</span>
                    <span className="text-slate-500">{th.title}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded font-bold">
                    ✓ Verified
                  </span>
                  <button
                    onClick={() => handleApprove(th.name)}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold"
                  >
                    Re-verify
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Safety Audit Logs */}
      {activeTab === 'safety' && (
        <div className="bg-white p-6 rounded-3xl shadow-mello border border-purple-100 space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Anonymized Safety Intervention Audit</h3>
          <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 border-b border-slate-200 pb-2">
              <span className="font-bold">Event ID</span>
              <span className="font-bold">Timestamp</span>
              <span className="font-bold">Action Triggered</span>
              <span className="font-bold">Status</span>
            </div>
            <div className="flex items-center justify-between text-slate-800 py-1">
              <span>#SAFE-8921</span>
              <span>Today 14:20</span>
              <span>Crisis Helpline Modal Shown</span>
              <span className="text-emerald-600 font-bold">Resolved Safely</span>
            </div>
            <div className="flex items-center justify-between text-slate-800 py-1">
              <span>#SAFE-8910</span>
              <span>Yesterday 11:05</span>
              <span>Hotline 988 Dispatched</span>
              <span className="text-emerald-600 font-bold">Resolved Safely</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
