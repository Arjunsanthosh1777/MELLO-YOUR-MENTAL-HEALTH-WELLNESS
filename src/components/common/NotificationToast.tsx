import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationToast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        className="fixed top-5 right-5 z-50 flex items-center space-x-3 px-5 py-3.5 bg-slate-900/90 text-white rounded-2xl shadow-2xl backdrop-blur-md border border-purple-500/30 font-medium text-sm"
      >
        {toast.type === 'xp' && <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />}
        {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
        {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400" />}
        <span>{toast.text}</span>
      </motion.div>
    </AnimatePresence>
  );
};
