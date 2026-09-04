import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Phone, ShieldCheck, HeartHandshake, X, Globe, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SAFETY_RESOURCES } from '../../services/storageService';

export const SafetyModal: React.FC = () => {
  const { isSafetyModalOpen, closeSafetyModal, navigate } = useApp();
  const [selectedCountry, setSelectedCountry] = useState<string>('United States');

  if (!isSafetyModalOpen) return null;

  const currentResource = SAFETY_RESOURCES.find(r => r.country === selectedCountry) || SAFETY_RESOURCES[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 p-6 text-white text-center relative">
            <button
              onClick={closeSafetyModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
              <HeartHandshake className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold font-heading">You don't have to carry this alone.</h2>
            <p className="text-rose-100 text-sm mt-1 max-w-md mx-auto">
              We care about your safety and well-being. Mello is a supportive companion, but real human support is available for you right now.
            </p>
          </div>

          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Core Supportive Callout */}
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-rose-900 text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">If you may be in immediate danger:</p>
                <p className="mt-0.5 text-rose-800">
                  Please reach out immediately to emergency services or a dedicated crisis resource below. These services are free, confidential, and available 24/7.
                </p>
              </div>
            </div>

            {/* Country Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-purple-600" /> Select Your Region / Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-rose-400 focus:outline-none"
              >
                {SAFETY_RESOURCES.map(res => (
                  <option key={res.country} value={res.country}>
                    {res.flag} {res.country}
                  </option>
                ))}
              </select>
            </div>

            {/* Helpline Details Card */}
            <div className="p-5 bg-gradient-to-br from-slate-900 to-purple-950 text-white rounded-2xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                  24/7 Free & Confidential Helpline
                </span>
                <span className="text-lg">{currentResource.flag}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-6 h-6 text-emerald-400 shrink-0" />
                <span className="text-xl font-bold text-emerald-300 font-mono">
                  {currentResource.hotline}
                </span>
              </div>
              <div className="text-xs text-slate-300 space-y-1 pt-1 border-t border-slate-800">
                <p><strong className="text-white">Text Support:</strong> {currentResource.textService}</p>
                <p>
                  <strong className="text-white">Official Website: </strong> 
                  <a href={currentResource.website} target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">
                    {currentResource.website}
                  </a>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  closeSafetyModal();
                  navigate('therapists');
                }}
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <UserCheck className="w-5 h-5" />
                Connect With Professional
              </button>
              
              <button
                onClick={() => {
                  closeSafetyModal();
                  navigate('talk-now');
                }}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Talk Now (Live Professionals)
              </button>
            </div>

            {/* Non-clinical statement disclaimer */}
            <p className="text-center text-xs text-slate-400 pt-2 border-t border-slate-100">
              Mello is a mental-wellness companion app, not a medical or diagnostic system. 
              In case of a life-threatening medical emergency, call your local emergency number (e.g. 911/999/112) immediately.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
