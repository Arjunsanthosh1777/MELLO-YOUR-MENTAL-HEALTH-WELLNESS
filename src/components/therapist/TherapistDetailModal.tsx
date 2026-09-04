import React, { useState } from 'react';

import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import {
  X,
  CheckCircle,
  Star,
  Calendar,
  MessageSquare,
  Video,
  Phone,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';

import { Therapist } from '../../types';
import { useApp } from '../../context/AppContext';

interface Props {
  therapist: Therapist | null;
  onClose: () => void;
}

export const TherapistDetailModal: React.FC<Props> = ({
  therapist,
  onClose,
}) => {
  const { showToast, navigate } = useApp();

  const [selectedSessionType, setSelectedSessionType] =
    useState<'Chat' | 'Voice' | 'Video'>('Video');

  const [selectedDate, setSelectedDate] =
    useState('Tomorrow 3:00 PM');

  if (!therapist) return null;

  /* =====================================================
     AVAILABLE DATES
  ===================================================== */

  const dateOptions = [
    'Tomorrow 3:00 PM',
    'Tomorrow 5:00 PM',
    'Tomorrow 7:00 PM',
    'Friday 10:00 AM',
    'Friday 4:00 PM',
  ];

  /* =====================================================
     CONTINUE TO PAYMENT
  ===================================================== */

  const handleBooking = () => {
    /*
     * Store the selected therapist in AppContext.
     * This allows the booking/payment/video-call pages
     * to display the SAME therapist.
     */

    navigate('therapist-payment', {
      therapistId: therapist.id,
    });

    showToast(
      `Booking details saved for ${therapist.name}.`,
      'info'
    );

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            y: 20,
          }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100 max-h-[90vh] flex flex-col"
        >

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white relative">

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-4">

              <img
                src={therapist.avatar}
                alt={therapist.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
              />

              <div>

                <div className="flex items-center gap-1.5">

                  <h3 className="text-xl font-bold font-heading">
                    {therapist.name}
                  </h3>

                  {therapist.verified && (
                    <CheckCircle className="w-5 h-5 text-emerald-400 fill-emerald-400" />
                  )}

                </div>

                <p className="text-purple-200 text-xs font-medium">
                  {therapist.title}
                </p>

                <div className="flex items-center space-x-3 mt-1.5 text-xs text-purple-100">

                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-300" />
                    {therapist.rating} ({therapist.reviewsCount})
                  </span>

                  <span>
                    • {therapist.experienceYears}+ yrs exp
                  </span>

                </div>

              </div>
            </div>
          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="p-6 space-y-5 overflow-y-auto flex-1">

            {/* AVAILABILITY */}

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl text-xs">

              <span className="font-semibold text-purple-900">
                Current Availability
              </span>

              <span
                className={`px-2.5 py-1 rounded-full font-bold ${
                  therapist.isOnline
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                ● {therapist.availability}
              </span>

            </div>

            {/* BIO */}

            <div>

              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                About Practitioner
              </h4>

              <p className="text-slate-600 text-sm leading-relaxed">
                {therapist.bio}
              </p>

            </div>

            {/* SPECIALIZATIONS */}

            <div>

              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Specializations
              </h4>

              <div className="flex flex-wrap gap-1.5">

                {therapist.specializations.map(
                  (spec) => (
                    <span
                      key={spec}
                      className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                    >
                      {spec}
                    </span>
                  )
                )}

              </div>

            </div>

            {/* =================================================
                SESSION TYPE
            ================================================= */}

            <div>

              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Choose Session Type
              </h4>

              <div className="grid grid-cols-3 gap-2">

                {therapist.sessionTypes.map(
                  (type) => (
                    <button
                      key={type}
                      onClick={() =>
                        setSelectedSessionType(type)
                      }
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                        selectedSessionType === type
                          ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-md'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >

                      {type === 'Chat' && (
                        <MessageSquare className="w-4 h-4" />
                      )}

                      {type === 'Voice' && (
                        <Phone className="w-4 h-4" />
                      )}

                      {type === 'Video' && (
                        <Video className="w-4 h-4" />
                      )}

                      <span className="text-xs">
                        {type}
                      </span>

                    </button>
                  )
                )}

              </div>

            </div>

            {/* =================================================
                DATE / TIME
            ================================================= */}

            <div>

              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Choose Date & Time
              </h4>

              <div className="space-y-2">

                {dateOptions.map((date) => (
                  <button
                    key={date}
                    onClick={() =>
                      setSelectedDate(date)
                    }
                    className={`w-full p-3 rounded-xl border flex items-center gap-3 text-left transition-all ${
                      selectedDate === date
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >

                    <Calendar
                      className={`w-4 h-4 ${
                        selectedDate === date
                          ? 'text-purple-600'
                          : 'text-slate-400'
                      }`}
                    />

                    <span className="text-xs font-semibold">
                      {date}
                    </span>

                    {selectedDate === date && (
                      <CheckCircle className="w-4 h-4 ml-auto text-purple-600" />
                    )}

                  </button>
                ))}

              </div>

            </div>

            {/* =================================================
                SESSION SUMMARY
            ================================================= */}

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">

              <div className="flex items-center justify-between">

                <div>

                  <span className="text-xs text-slate-500 font-medium">
                    Session
                  </span>

                  <p className="text-sm font-bold text-slate-800">
                    {selectedSessionType} Therapy
                  </p>

                </div>

                <div className="text-right">

                  <span className="text-xs text-slate-500 font-medium">
                    Rate
                  </span>

                  <p className="text-lg font-extrabold text-slate-800">
                    {therapist.pricePerSession}
                  </p>

                </div>

              </div>

              <div className="border-t border-slate-200 my-3" />

              <div className="flex items-center gap-2 text-xs text-slate-600">

                <Calendar className="w-4 h-4 text-purple-600" />

                <span>
                  {selectedDate}
                </span>

              </div>

            </div>

            {/* =================================================
                PAYMENT BUTTON
            ================================================= */}

            <button
              onClick={handleBooking}
              className="w-full px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >

              <CreditCard className="w-4 h-4" />

              Continue to Payment

            </button>

            {/* =================================================
                VIDEO NOTICE
            ================================================= */}

            {selectedSessionType === 'Video' && (
              <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">

                <Video className="w-4 h-4 text-emerald-600 mt-0.5" />

                <p className="text-[10px] text-emerald-800 leading-relaxed">
                  Your private video session will unlock
                  automatically after successful payment.
                </p>

              </div>
            )}

            {/* SECURITY */}

            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">

              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />

              <span>
                Secure Session • Protected Information
              </span>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};