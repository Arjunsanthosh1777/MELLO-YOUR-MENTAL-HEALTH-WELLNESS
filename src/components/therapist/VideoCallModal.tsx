import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Send, ShieldCheck } from 'lucide-react';
import { Therapist } from '../../types';

interface Props {
  therapist: Therapist | null;
  onClose: () => void;
}

export const VideoCallModal: React.FC<Props> = ({ therapist, onClose }) => {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [messages, setMessages] = useState<{ sender: 'user' | 'therapist'; text: string; time: string }[]>([
    { sender: 'therapist', text: 'Hello! I am ready for our session whenever you are ready.', time: 'Just now' }
  ]);
  const [input, setInput] = useState('');

  if (!therapist) return null;

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { sender: 'user' as const, text: input.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, {
        sender: 'therapist',
        text: 'Thank you for sharing that. Take your time, I am listening.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 h-[80vh] flex flex-col lg:flex-row text-white"
        >
          {/* Main Video Stage */}
          <div className="flex-1 flex flex-col justify-between p-4 bg-slate-950 relative">
            {/* Video Header */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center space-x-2 bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                <span className="font-bold">{therapist.name}</span>
                <span className="text-slate-400">({therapist.title})</span>
              </div>
              <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Feeds Container */}
            <div className="my-auto relative flex items-center justify-center min-h-[300px]">
              {videoOn ? (
                <div className="relative w-full max-w-lg h-64 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
                  <img
                    src={therapist.avatar}
                    alt={therapist.name}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 px-2.5 py-1 rounded-lg text-xs font-semibold">
                    {therapist.name} (Live)
                  </div>
                </div>
              ) : (
                <div className="w-40 h-40 bg-purple-900/40 rounded-full flex items-center justify-center border border-purple-500/40">
                  <span className="text-3xl font-bold text-purple-300">{therapist.name.substring(0, 2)}</span>
                </div>
              )}

              {/* Self Video PIP */}
              <div className="absolute bottom-2 right-2 w-28 h-20 bg-slate-800 rounded-xl overflow-hidden border-2 border-slate-700 shadow-xl flex items-center justify-center text-xs text-slate-400">
                You (Camera)
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="flex items-center justify-center space-x-4 pt-3 border-t border-slate-900">
              <button
                onClick={() => setMicOn(!micOn)}
                className={`p-3 rounded-2xl font-bold transition-colors ${micOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'}`}
              >
                {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setVideoOn(!videoOn)}
                className={`p-3 rounded-2xl font-bold transition-colors ${videoOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'}`}
              >
                {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-lg flex items-center gap-2 text-sm"
              >
                <PhoneOff className="w-5 h-5" /> End Session
              </button>
            </div>
          </div>

          {/* In-Call Chat Sidebar */}
          <div className="w-full lg:w-80 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-4 flex flex-col justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-800">
              <MessageSquare className="w-4 h-4 text-purple-400" /> Session Chat & Notes
            </div>

            {/* Messages */}
            <div className="flex-1 my-3 overflow-y-auto space-y-3 pr-1 text-xs">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[85%] ${
                    m.sender === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                  }`}>
                    {m.text}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1">{m.time}</span>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="flex gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Send a private note..."
                className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
              <button type="submit" className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
