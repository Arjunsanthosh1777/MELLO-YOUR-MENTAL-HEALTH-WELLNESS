import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ShieldAlert, Sparkles, Volume2, RefreshCw, Heart, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';
import { aiService } from '../services/aiService';
import { MelloAvatar } from '../components/common/MelloAvatar';

export const TalkPage: React.FC = () => {
  const { user, navigate, openSafetyModal, earnXP } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'mello',
      text: `Hey 👋 I'm glad you're here, ${user.name || 'friend'}. How has your day been so far?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickReplies: ['It was really overwhelming', 'I feel okay', 'I\'m feeling down today', 'I just want to relax']
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const response = await aiService.generateResponse(text, messages, user.name || 'friend');
      setIsTyping(false);
      setMessages(prev => [...prev, response.message]);

      if (response.isSafetyTrigger) {
        openSafetyModal();
      } else {
        earnXP(10, 'Mello AI Conversation');
      }
    } catch (e) {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: 'err-' + Date.now(),
        sender: 'mello',
        text: "Mello couldn't connect right now. Your progress is safe. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col bg-white rounded-3xl shadow-mello border border-purple-100 overflow-hidden">
      {/* Companion Chat Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-50 via-white to-pink-50 border-b border-purple-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MelloAvatar size="sm" mood={isTyping ? 'listening' : 'happy'} />
          <div>
            <h2 className="text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
              Talk with Mello <span className="text-[10px] font-extrabold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">AI Companion</span>
            </h2>
            <p className="text-xs text-slate-500">
              {isTyping ? 'Mello is reflecting...' : 'Online & listening • Non-judgmental space'}
            </p>
          </div>
        </div>

        <button
          onClick={openSafetyModal}
          className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold border border-rose-200"
          title="Crisis Support Protocol"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          <span className="hidden sm:inline">Crisis Support</span>
        </button>
      </div>

      {/* Message Feed */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/40">
        <div className="text-center text-[11px] text-slate-400 max-w-sm mx-auto p-2 bg-purple-50/60 rounded-xl border border-purple-100">
          💜 Mello is a supportive companion, not a licensed therapist or diagnostic tool.
        </div>

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[85%] sm:max-w-[75%]`}>
                {msg.sender === 'mello' && (
                  <MelloAvatar size="sm" className="shrink-0 mt-1" />
                )}
                
                <div>
                  <div className={`p-4 rounded-3xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white rounded-tr-none shadow-sm font-medium'
                      : msg.isSafetyTrigger
                      ? 'bg-rose-50 text-rose-900 border border-rose-200 rounded-tl-none font-medium'
                      : 'bg-white text-slate-800 border border-purple-100 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>

                  {/* Suggested Activity Pill */}
                  {msg.suggestedActivity && (
                    <div className="mt-2">
                      <button
                        onClick={() => {
                          if (msg.suggestedActivity?.type === 'game') navigate('games');
                          else if (msg.suggestedActivity?.type === 'breathing') navigate('games', { gameId: 'breathing-bloom' });
                          else if (msg.suggestedActivity?.type === 'therapist') navigate('therapists');
                        }}
                        className="px-3.5 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-purple-200"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>Try Activity: {msg.suggestedActivity.title}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Quick Replies */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && msg.id === messages[messages.length - 1].id && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {msg.quickReplies.map((reply, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(reply)}
                          className="px-3 py-1.5 bg-white hover:bg-purple-50 text-purple-700 font-semibold border border-purple-200 rounded-full text-xs shadow-xs transition-colors"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400 mt-1 block px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-2 text-xs text-purple-600 font-medium">
            <MelloAvatar size="sm" mood="listening" />
            <div className="flex space-x-1 bg-white p-3 rounded-2xl border border-purple-100 shadow-xs">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 sm:p-4 bg-white border-t border-purple-100 flex items-center space-x-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Share whatever is on your mind today..."
          className="flex-1 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="p-3.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-2xl shadow-mello transition-all font-bold"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
