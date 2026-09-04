import React, { useState } from 'react';
import { ShieldAlert, Phone, HeartHandshake, Globe, ExternalLink, UserCheck } from 'lucide-react';
import { SAFETY_RESOURCES } from '../services/storageService';
import { useApp } from '../context/AppContext';

export const SafetyPage: React.FC = () => {
  const { navigate } = useApp();
  const [selectedCountry, setSelectedCountry] = useState('United States');

  const currentResource = SAFETY_RESOURCES.find(r => r.country === selectedCountry) || SAFETY_RESOURCES[0];

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-700 text-white p-6 sm:p-8 rounded-3xl shadow-mello-lg space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center font-bold backdrop-blur-sm">
            <HeartHandshake className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">
              Safety & Crisis Support 🛡️
            </h1>
            <p className="text-rose-100 text-sm">
              You are never alone. Free, confidential 24/7 human crisis support is available.
            </p>
          </div>
        </div>
      </div>

      {/* Main Crisis Hotline Selector Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-mello border border-rose-100 space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-purple-600" /> Select Your Country / Region
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold focus:ring-2 focus:ring-rose-400 focus:outline-none text-sm"
          >
            {SAFETY_RESOURCES.map(res => (
              <option key={res.country} value={res.country}>
                {res.flag} {res.country}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Helpline Info */}
        <div className="p-6 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-950 text-white rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-400">
              24/7 Crisis Hotline
            </span>
            <span className="text-2xl">{currentResource.flag}</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center font-bold">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-extrabold font-mono text-emerald-300">
                {currentResource.hotline}
              </span>
              <p className="text-xs text-slate-300 mt-0.5">Free, confidential, and available 24 hours a day, 7 days a week.</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-1">
            <p><strong className="text-white">Text Service:</strong> {currentResource.textService}</p>
            <p className="flex items-center gap-1">
              <strong className="text-white">Website:</strong>
              <a href={currentResource.website} target="_blank" rel="noopener noreferrer" className="text-purple-300 underline flex items-center gap-1">
                {currentResource.website} <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('therapists')}
          className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-mello text-xs flex items-center justify-center gap-2"
        >
          <UserCheck className="w-4 h-4" /> Connect With Verified Therapists
        </button>
      </div>
    </div>
  );
};
