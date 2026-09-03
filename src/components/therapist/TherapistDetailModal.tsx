import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Star, Calendar, MessageSquare, Video, Phone, ShieldCheck } from 'lucide-react';
import { Therapist } from '../../types';
import { useApp } from '../../context/AppContext';

interface Props {
  therapist: Therapist | null;
  onClose: () => void;
}

export const TherapistDetailModal: React.FC<Props> = ({ therapist, onClose }) => {
  const { showToast, navigate } = useApp();
  const [selectedSessionType, setSelectedSessionType] = useState<'Chat' | 'Voice' | 'Video'>('Video');
  const [selectedDate, setSelectedDate] = useState('Tomorrow 3:00 PM');
  const [booked, setBooked] = useState(false);

  if (!therapist) return null;

  const handleBooking = () => {
    setBooked(true);
    showToast(`Session booked with ${therapist.name}!`, 'success');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100 max-h-[85vh] flex flex-col"
        >
          {/* Header Image & Title */}
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
                  <h3 className="text-xl font-bold font-heading">{therapist.name}</h3>
                  {therapist.verified && <CheckCircle className="w-5 h-5 text-emerald-400 fill-emerald-400" />}
                </div>
                <p className="text-purple-200 text-xs font-medium">{therapist.title}</p>
                <div className="flex items-center space-x-3 mt-1.5 text-xs text-purple-100">
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-300" /> {therapist.rating} ({therapist.reviewsCount})
                  </span>
                  <span>• {therapist.experienceYears}+ yrs exp</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Online Status Banner */}
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl text-xs">
              <span className="font-semibold text-purple-900">Current Availability</span>
              <span className={`px-2.5 py-1 rounded-full font-bold ${
                therapist.isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
              }`}>
                ● {therapist.availability}
              </span>
            </div>

            {/* Bio */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">About Practitioner</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{therapist.bio}</p>
            </div>

            {/* Specializations */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Specializations</h4>
              <div className="flex flex-wrap gap-1.5">
                {therapist.specializations.map(spec => (
                  <span key={spec} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {!booked ? (
              <>
                {/* Session Format Selection */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Choose Session Type</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {therapist.sessionTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => setSelectedSessionType(type)}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                          selectedSessionType === type ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-md' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {type === 'Chat' && <MessageSquare className="w-4 h-4" />}
                        {type === 'Voice' && <Phone className="w-4 h-4" />}
                        {type === 'Video' && <Video className="w-4 h-4" />}
                        <span className="text-xs">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Session Price */}
                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-200">
                  <div>
                    <span className="text-xs text-slate-500 font-medium">Session Rate</span>
                    <p className="text-lg font-extrabold text-slate-800">{therapist.pricePerSession}</p>
                  </div>
                  <button
                    onClick={handleBooking}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md transition-colors text-sm"
                  >
                    Confirm Booking
                  </button>
                </div>
              </>
            ) : (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-emerald-900">Session Confirmed!</h3>
                <p className="text-xs text-emerald-800">
                  Your appointment with {therapist.name} for {selectedDate} ({selectedSessionType}) is booked. 
                  A confirmation email has been sent.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    navigate('talk-now');
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Go to Talk Now Room
                </button>
              </div>
            )}

            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>HIPAA Compliant • End-to-End Encrypted</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
