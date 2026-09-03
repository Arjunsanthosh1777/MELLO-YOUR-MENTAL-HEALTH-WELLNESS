import React, { useState } from 'react';
import { UserCheck, Star, CheckCircle, Search, Filter, ShieldCheck, Calendar, PhoneCall } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_THERAPISTS } from '../services/storageService';
import { Therapist } from '../types';
import { TherapistDetailModal } from '../components/therapist/TherapistDetailModal';

export const TherapistsPage: React.FC = () => {
  const { navigate } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalTherapist, setActiveModalTherapist] = useState<Therapist | null>(null);

  const filterOptions = ['All', 'Stress', 'Anxiety', 'Relationships', 'Self-esteem', 'Student support', 'General counseling'];

  const filteredTherapists = INITIAL_THERAPISTS.filter(th => {
    const matchesSearch = th.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          th.specializations.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = selectedFilter === 'All' || th.specializations.includes(selectedFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-mello border border-purple-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              Connect with a Professional 👩‍⚕️
            </h1>
            <p className="text-slate-500 text-sm">
              Verified, licensed mental-health therapists for deeper human support.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('talk-now')}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md text-xs flex items-center gap-2"
        >
          <PhoneCall className="w-4 h-4" /> Live "Talk Now" Room
        </button>
      </div>

      {/* AI vs Professional Distinction Banner */}
      <div className="p-4 bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 rounded-2xl border border-purple-100 text-xs text-purple-900 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Human Professional vs Mello AI:</strong>
          <p className="mt-0.5 text-slate-600">
            Mello AI is your daily companion for habits, stress games, and mood check-ins. Licensed therapists provide formal diagnosis, psychological treatment, and specialized human care.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, specialty (e.g. Anxiety, CBT, Relationships)..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filterOptions.map(f => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                selectedFilter === f ? 'bg-purple-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Therapists Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTherapists.map(th => (
          <div key={th.id} className="bg-white p-6 rounded-3xl shadow-mello border border-purple-100 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={th.avatar}
                    alt={th.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-purple-100 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-slate-900 text-base">{th.name}</h3>
                      {th.verified && <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-100" />}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{th.title}</p>
                    <span className="text-[10px] font-bold text-slate-400">{th.experienceYears}+ years exp</span>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                  th.isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  ● {th.availability}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{th.bio}</p>

              <div className="flex flex-wrap gap-1">
                {th.specializations.map(s => (
                  <span key={s} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-bold">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Rate</span>
                <span className="text-xs font-extrabold text-slate-800">{th.pricePerSession}</span>
              </div>
              <button
                onClick={() => setActiveModalTherapist(th)}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-sm transition-colors"
              >
                View Profile / Book
              </button>
            </div>
          </div>
        ))}
      </div>

      <TherapistDetailModal
        therapist={activeModalTherapist}
        onClose={() => setActiveModalTherapist(null)}
      />
    </div>
  );
};
