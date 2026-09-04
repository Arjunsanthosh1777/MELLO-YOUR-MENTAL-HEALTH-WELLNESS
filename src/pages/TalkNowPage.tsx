import React, { useState } from 'react';
import { PhoneCall, Video, MessageSquare, ShieldCheck, CheckCircle2, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_THERAPISTS } from '../services/storageService';
import { Therapist } from '../types';
import { VideoCallModal } from '../components/therapist/VideoCallModal';

export const TalkNowPage: React.FC = () => {
  const { navigate } = useApp();
  const [activeCallTherapist, setActiveCallTherapist] = useState<Therapist | null>(null);

  const onlineTherapists = INITIAL_THERAPISTS.filter(t => t.isOnline);

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 rounded-3xl shadow-mello-lg space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center font-bold backdrop-blur-sm">
            <PhoneCall className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">
              Need someone to talk to? 💚
            </h1>
            <p className="text-emerald-100 text-sm">
              Connect in real-time with available verified mental-health professionals right now.
            </p>
          </div>
        </div>
      </div>

      {/* Distinction Badge */}
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center space-x-3 text-xs text-emerald-900">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <span>
          <strong>Live Verified Professionals:</strong> Every therapist on this page is licensed and available for real-time video, voice, or chat sessions.
        </span>
      </div>

      {/* Online Therapists Cards */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-emerald-600" /> Professionals Online Now ({onlineTherapists.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {onlineTherapists.map(th => (
            <div key={th.id} className="bg-white p-6 rounded-3xl shadow-mello border border-emerald-100 flex flex-col justify-between space-y-4">
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <img
                    src={th.avatar}
                    alt={th.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-200 shadow-sm"
                  />
                  <span className="w-4 h-4 bg-emerald-500 border-2 border-white rounded-full absolute -top-1 -right-1 shadow-sm" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-900 text-base">{th.name}</h4>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100" />
                  </div>
                  <p className="text-xs text-slate-500">{th.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                      ● Online Now
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{th.pricePerSession}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setActiveCallTherapist(th)}
                  className="py-2.5 px-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Start Chat
                </button>
                <button
                  onClick={() => setActiveCallTherapist(th)}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5" /> Video Call
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <VideoCallModal
        therapist={activeCallTherapist}
        onClose={() => setActiveCallTherapist(null)}
      />
    </div>
  );
};
