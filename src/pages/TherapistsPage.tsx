import React, { useState } from 'react';

import {
  UserCheck,
  CheckCircle,
  Search,
  ShieldCheck,
  CalendarDays,
  Star,
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import { INITIAL_THERAPISTS } from '../services/storageService';
import { Therapist } from '../types';
import { TherapistDetailModal } from '../components/therapist/TherapistDetailModal';

export const TherapistsPage: React.FC = () => {
  const { navigate } = useApp();

  const [selectedFilter, setSelectedFilter] =
    useState<string>('All');

  const [searchQuery, setSearchQuery] =
    useState<string>('');

  const [activeModalTherapist, setActiveModalTherapist] =
    useState<Therapist | null>(null);

  /* =====================================================
     FILTER OPTIONS
  ===================================================== */

  const filterOptions = [
    'All',
    'Stress',
    'Anxiety',
    'Relationships',
    'Self-esteem',
    'Student support',
    'General counseling',
  ];

  /* =====================================================
     FILTER THERAPISTS
  ===================================================== */

  const filteredTherapists =
    INITIAL_THERAPISTS.filter((th) => {
      const search = searchQuery.toLowerCase().trim();

      const matchesSearch =
        th.name.toLowerCase().includes(search) ||
        th.title.toLowerCase().includes(search) ||
        th.specializations.some((s) =>
          s.toLowerCase().includes(search)
        );

      const matchesFilter =
        selectedFilter === 'All' ||
        th.specializations.some(
          (s) =>
            s.toLowerCase() ===
            selectedFilter.toLowerCase()
        );

      return matchesSearch && matchesFilter;
    });

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-purple-50/40 pb-12">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="bg-white rounded-[28px] border border-purple-100 shadow-sm px-6 sm:px-8 py-7">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center flex-shrink-0">

              <UserCheck className="w-7 h-7 text-purple-600" />

            </div>

            <div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
                Connect with a Professional 👩‍⚕️
              </h1>

              <p className="mt-1 text-sm sm:text-base text-slate-500">
                Verified, licensed mental-health therapists
                for deeper human support.
              </p>

            </div>

          </div>

        </div>

        {/* =====================================================
            AI VS PROFESSIONAL BANNER
        ===================================================== */}

        <div className="rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 px-5 sm:px-6 py-5">

          <div className="flex items-start gap-4">

            <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center flex-shrink-0">

              <ShieldCheck className="w-5 h-5 text-purple-600" />

            </div>

            <div>

              <h2 className="text-sm font-extrabold text-purple-800">
                Human Professional vs Mello AI:
              </h2>

              <p className="mt-1 text-xs sm:text-sm leading-5 text-slate-600">
                Mello AI is your daily companion for habits,
                stress games, and mood check-ins. Licensed
                therapists provide formal diagnosis, psychological
                treatment, and specialized human care.
              </p>

            </div>

          </div>

        </div>

        {/* =====================================================
            SEARCH
        ===================================================== */}

        <div className="relative">

          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search by name, specialty (e.g. Anxiety, CBT, Relationships)..."
            className="w-full h-14 pl-13 pr-5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
          />

        </div>

        {/* =====================================================
            FILTERS
        ===================================================== */}

        <div className="flex flex-wrap gap-2">

          {filterOptions.map((filter) => {

            const active =
              selectedFilter === filter;

            return (
              <button
                key={filter}
                onClick={() =>
                  setSelectedFilter(filter)
                }
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  active
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-purple-200 hover:text-purple-700 hover:bg-purple-50'
                }`}
              >
                {filter}
              </button>
            );
          })}

        </div>

        {/* =====================================================
            THERAPIST DIRECTORY
        ===================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {filteredTherapists.map((th) => (

            <div
              key={th.id}
              className="group bg-white rounded-[28px] border border-purple-100 shadow-sm hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300 overflow-hidden"
            >

              <div className="p-6 sm:p-7">

                {/* =================================================
                    PROFILE HEADER
                ================================================= */}

                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-center gap-4 min-w-0">

                    {/* AVATAR */}

                    <div className="relative flex-shrink-0">

                      <img
                        src={th.avatar}
                        alt={th.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-purple-100 shadow-sm"
                      />

                      {th.isOnline && (
                        <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-[3px] border-white" />
                      )}

                    </div>

                    {/* NAME / TITLE */}

                    <div className="min-w-0">

                      <div className="flex items-center gap-1.5">

                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
                          {th.name}
                        </h3>

                        {th.verified && (
                          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        )}

                      </div>

                      <p className="mt-1 text-sm text-purple-600 font-medium">
                        {th.title}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-slate-400">
                        {th.experienceYears}+ years exp
                      </p>

                    </div>

                  </div>

                  {/* AVAILABILITY */}

                  <span
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold ${
                      th.isOnline
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-purple-50 text-purple-700'
                    }`}
                  >
                    <span className="mr-1">•</span>
                    {th.availability}
                  </span>

                </div>

                {/* =================================================
                    RATING
                ================================================= */}

                <div className="mt-4 flex items-center gap-2">

                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />

                  <span className="text-sm font-bold text-slate-800">
                    {th.rating}
                  </span>

                  <span className="text-xs text-slate-400">
                    ({th.reviewsCount} reviews)
                  </span>

                </div>

                {/* =================================================
                    BIO
                ================================================= */}

                <p className="mt-5 text-sm leading-6 text-slate-600 min-h-[48px]">
                  {th.bio}
                </p>

                {/* =================================================
                    SPECIALIZATIONS
                ================================================= */}

                <div className="mt-5 flex flex-wrap gap-2">

                  {th.specializations.map((specialization) => (

                    <span
                      key={specialization}
                      className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-[10px] sm:text-xs font-bold"
                    >
                      {specialization}
                    </span>

                  ))}

                </div>

                {/* =================================================
                    DIVIDER
                ================================================= */}

                <div className="my-6 h-px bg-slate-100" />

                {/* =================================================
                    RATE + CENTERED BUTTON
                ================================================= */}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-5">

                  {/* RATE */}

                  <div className="text-center sm:text-left">

                    <p className="text-xs text-slate-400 font-medium">
                      Rate
                    </p>

                    <p className="mt-1 text-sm sm:text-base font-extrabold text-slate-900">
                      {th.pricePerSession}
                    </p>

                  </div>

                  {/* CENTER PROFILE / BOOK BUTTON */}

                  <button
                    onClick={() =>
                      setActiveModalTherapist(th)
                    }
                    className="group/button min-w-[190px] px-6 py-3 rounded-xl border-2 border-purple-300 bg-white text-purple-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-purple-600 hover:border-purple-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-purple-200"
                  >

                    <CalendarDays className="w-4 h-4 transition-transform group-hover/button:scale-110" />

                    View Profile / Book

                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {filteredTherapists.length === 0 && (

          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-50 flex items-center justify-center">

              <UserCheck className="w-8 h-8 text-purple-300" />

            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-800">
              No therapists found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try a different name or specialization.
            </p>

            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('All');
              }}
              className="mt-5 px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition"
            >
              Clear Filters
            </button>

          </div>

        )}

      </div>

      {/* =====================================================
          THERAPIST DETAIL MODAL
      ===================================================== */}

      <TherapistDetailModal
        therapist={activeModalTherapist}
        onClose={() =>
          setActiveModalTherapist(null)
        }
      />

    </div>
  );
};

export default TherapistsPage;