import React, { useState } from 'react';

import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Video,
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import { INITIAL_THERAPISTS } from '../services/storageService';

const TherapistBooking: React.FC = () => {
  const {
    navigate,
    selectedTherapistId,
  } = useApp();

  const therapist = INITIAL_THERAPISTS.find(
    (t) => t.id === selectedTherapistId
  );

  const [selectedDate, setSelectedDate] = useState('Tomorrow');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');

  const dates = [
    'Tomorrow',
    'Sep 5',
    'Sep 6',
    'Sep 7',
  ];

  const times = [
    '10:00 AM',
    '12:00 PM',
    '3:00 PM',
    '5:00 PM',
    '7:00 PM',
  ];

  /* =========================================================
     NO THERAPIST SELECTED
  ========================================================= */

  if (!therapist) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-purple-100 shadow-mello p-8 text-center max-w-md">

          <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-50 flex items-center justify-center">
            <Video className="w-7 h-7 text-purple-600" />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 mt-4">
            Therapist not selected
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Please select a therapist before booking a session.
          </p>

          <button
            type="button"
            onClick={() => navigate('therapists')}
            className="mt-6 px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold"
          >
            Choose Therapist
          </button>

        </div>
      </div>
    );
  }

  /* =========================================================
     CONTINUE TO PAYMENT
     
     IMPORTANT:
     We do NOT pass therapistId here because
     selectedTherapistId is already stored in AppContext.
  ========================================================= */

  const continueToPayment = () => {
    navigate('therapist-payment');
  };

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="max-w-5xl mx-auto py-4 pb-12">

      {/* BACK BUTTON */}

      <button
        type="button"
        onClick={() => navigate('therapists')}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-purple-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Therapists
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* =====================================================
            THERAPIST DETAILS
        ===================================================== */}

        <div className="lg:col-span-2">

          <div className="bg-white rounded-3xl border border-purple-100 shadow-mello p-6">

            <p className="text-xs font-extrabold uppercase tracking-wider text-purple-600">
              Your Therapist
            </p>

            <div className="flex items-center gap-4 mt-5">

              <img
                src={therapist.avatar}
                alt={therapist.name}
                className="w-20 h-20 rounded-2xl object-cover border border-purple-100 shadow-sm"
              />

              <div>

                <div className="flex items-center gap-1.5">

                  <h2 className="text-lg font-extrabold text-slate-900">
                    {therapist.name}
                  </h2>

                  {therapist.verified && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}

                </div>

                <p className="text-xs text-slate-500 mt-1">
                  {therapist.title}
                </p>

                <p className="text-[10px] text-slate-400 font-bold mt-1">
                  {therapist.experienceYears}+ years experience
                </p>

              </div>

            </div>

            {/* SPECIALIZATIONS */}

            <div className="mt-6 pt-5 border-t border-slate-100">

              <p className="text-xs font-bold text-slate-500 mb-2">
                Specializations
              </p>

              <div className="flex flex-wrap gap-2">

                {therapist.specializations.map((specialization) => (
                  <span
                    key={specialization}
                    className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-[10px] font-bold"
                  >
                    {specialization}
                  </span>
                ))}

              </div>

            </div>

            {/* VIDEO INFO */}

            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">

              <div className="flex items-center gap-2">

                <Video className="w-4 h-4 text-emerald-600" />

                <p className="text-xs font-bold text-emerald-800">
                  Video consultation
                </p>

              </div>

              <p className="text-[10px] text-emerald-700 mt-1">
                Your private video session will be available after successful payment.
              </p>

            </div>

            {/* PRICE */}

            <div className="mt-6 flex items-center justify-between">

              <span className="text-xs text-slate-500">
                Session fee
              </span>

              <span className="text-xl font-extrabold text-purple-600">
                {therapist.pricePerSession}
              </span>

            </div>

          </div>

        </div>

        {/* =====================================================
            BOOKING
        ===================================================== */}

        <div className="lg:col-span-3">

          <div className="bg-white rounded-3xl border border-purple-100 shadow-mello p-6 sm:p-8">

            {/* HEADER */}

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-2xl bg-purple-100 flex items-center justify-center">

                <Calendar className="w-5 h-5 text-purple-600" />

              </div>

              <div>

                <h1 className="text-2xl font-extrabold text-slate-900">
                  Book a Session
                </h1>

                <p className="text-xs text-slate-500 mt-1">
                  Choose a convenient date and time.
                </p>

              </div>

            </div>

            {/* =================================================
                DATE
            ================================================= */}

            <div className="mt-8">

              <div className="flex items-center gap-2 mb-3">

                <Calendar className="w-4 h-4 text-purple-600" />

                <h3 className="text-sm font-extrabold text-slate-800">
                  Select Date
                </h3>

              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">

                {dates.map((date) => (

                  <button
                    key={date}
                    type="button"
                    onClick={() => setSelectedDate(date)}
                    className={`p-3 rounded-xl border-2 text-xs font-bold transition-all ${
                      selectedDate === date
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-slate-200 text-slate-600 hover:border-purple-200'
                    }`}
                  >

                    {selectedDate === date && (
                      <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                    )}

                    {date}

                  </button>

                ))}

              </div>

            </div>

            {/* =================================================
                TIME
            ================================================= */}

            <div className="mt-8">

              <div className="flex items-center gap-2 mb-3">

                <Clock className="w-4 h-4 text-purple-600" />

                <h3 className="text-sm font-extrabold text-slate-800">
                  Select Time
                </h3>

              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">

                {times.map((time) => (

                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 rounded-xl border-2 text-xs font-bold transition-all ${
                      selectedTime === time
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-slate-200 text-slate-600 hover:border-purple-200'
                    }`}
                  >

                    <Clock className="w-4 h-4 mx-auto mb-1" />

                    {time}

                  </button>

                ))}

              </div>

            </div>

            {/* =================================================
                APPOINTMENT SUMMARY
            ================================================= */}

            <div className="mt-8 p-5 rounded-2xl bg-slate-50 border border-slate-100">

              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">
                Appointment Summary
              </p>

              <div className="mt-4 space-y-3">

                <div className="flex justify-between text-sm">

                  <span className="text-slate-500">
                    Therapist
                  </span>

                  <span className="font-bold text-slate-800">
                    {therapist.name}
                  </span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-slate-500">
                    Date
                  </span>

                  <span className="font-bold text-slate-800">
                    {selectedDate}
                  </span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-slate-500">
                    Time
                  </span>

                  <span className="font-bold text-slate-800">
                    {selectedTime}
                  </span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-slate-500">
                    Session
                  </span>

                  <span className="font-bold text-slate-800">
                    Video • 50 min
                  </span>

                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between">

                  <span className="font-extrabold text-slate-900">
                    Total
                  </span>

                  <span className="font-extrabold text-purple-600">
                    {therapist.pricePerSession}
                  </span>

                </div>

              </div>

            </div>

            {/* =================================================
                CONTINUE TO PAYMENT
            ================================================= */}

            <button
              type="button"
              onClick={continueToPayment}
              className="w-full mt-6 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              Continue to Payment

              <ArrowLeft className="w-4 h-4 rotate-180" />

            </button>

            <p className="text-center text-[10px] text-slate-400 mt-4">
              You will review and complete payment on the next step.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default TherapistBooking;