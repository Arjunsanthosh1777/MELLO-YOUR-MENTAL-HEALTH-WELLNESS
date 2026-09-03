import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  ShieldAlert,
  Sparkles,
  Volume2,
  VolumeX,
  RefreshCw,
  Heart,
  ArrowRight,
  MoreHorizontal,
  Trash2,
  Brain,
  Wind,
  Gamepad2,
  BookOpen,
  Coffee,
  Moon,
  Smile,
  Meh,
  Frown,
  Mic,
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';
import { aiService } from '../services/aiService';
import { MelloAvatar } from '../components/common/MelloAvatar';

interface ExtendedChatMessage extends ChatMessage {
  mood?: string;
  isStreaming?: boolean;
}

type Mood =
  | 'happy'
  | 'calm'
  | 'stressed'
  | 'sad'
  | 'angry'
  | 'anxious'
  | 'tired'
  | 'neutral';

const getTime = () =>
  new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

const detectMood = (text: string): Mood => {
  const value = text.toLowerCase();

  if (
    /suicide|kill myself|end my life|self harm|hurt myself|want to die/.test(
      value
    )
  ) {
    return 'sad';
  }

  if (
    /happy|great|amazing|awesome|excited|love this|good day|wonderful|yay/.test(
      value
    )
  ) {
    return 'happy';
  }

  if (
    /stress|stressed|overwhelmed|pressure|too much|exhausted|deadline|panic/.test(
      value
    )
  ) {
    return 'stressed';
  }

  if (
    /sad|depressed|down|lonely|cry|crying|empty|heartbroken|upset/.test(value)
  ) {
    return 'sad';
  }

  if (
    /angry|mad|furious|hate|annoyed|irritated|pissed/.test(value)
  ) {
    return 'angry';
  }

  if (
    /anxious|anxiety|worried|worry|nervous|scared|afraid|fear/.test(value)
  ) {
    return 'anxious';
  }

  if (
    /tired|sleepy|sleep|drained|fatigue|can't sleep|cannot sleep/.test(value)
  ) {
    return 'tired';
  }

  if (/okay|fine|alright|calm|peaceful|relaxed/.test(value)) {
    return 'calm';
  }

  return 'neutral';
};

const getMoodInfo = (mood: Mood) => {
  switch (mood) {
    case 'happy':
      return {
        label: 'Feeling positive',
        icon: Smile,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
      };

    case 'calm':
      return {
        label: 'Feeling calm',
        icon: Wind,
        color: 'text-teal-600',
        bg: 'bg-teal-50',
      };

    case 'stressed':
      return {
        label: 'Feeling overwhelmed',
        icon: Brain,
        color: 'text-orange-600',
        bg: 'bg-orange-50',
      };

    case 'sad':
      return {
        label: 'Feeling down',
        icon: Frown,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
      };

    case 'angry':
      return {
        label: 'Feeling frustrated',
        icon: Meh,
        color: 'text-red-600',
        bg: 'bg-red-50',
      };

    case 'anxious':
      return {
        label: 'Feeling anxious',
        icon: Brain,
        color: 'text-violet-600',
        bg: 'bg-violet-50',
      };

    case 'tired':
      return {
        label: 'Feeling tired',
        icon: Moon,
        color: 'text-slate-600',
        bg: 'bg-slate-100',
      };

    default:
      return {
        label: 'Listening',
        icon: Heart,
        color: 'text-purple-600',
        bg: 'bg-purple-50',
      };
  }
};

const getQuickReplies = (mood: Mood): string[] => {
  switch (mood) {
    case 'stressed':
      return [
        'Help me calm down',
        'I need to vent',
        'Help me organize everything',
        'Distract me',
      ];

    case 'sad':
      return [
        'I want to talk about it',
        'I just need someone to listen',
        'Help me feel a little better',
        'Distract me',
      ];

    case 'anxious':
      return [
        'Help me slow my thoughts',
        'I want to talk about it',
        'Give me something calming',
        'Distract me',
      ];

    case 'angry':
      return [
        'Let me vent',
        'Help me understand why I feel this way',
        'Help me calm down',
        'I want a distraction',
      ];

    case 'tired':
      return [
        'Help me relax',
        'I cannot switch my brain off',
        'Give me something peaceful',
        'Goodnight routine',
      ];

    case 'happy':
      return [
        'Celebrate with me 🎉',
        'Ask me something fun',
        'Tell me a random question',
        'Give me a challenge',
      ];

    case 'calm':
      return [
        'Keep me relaxed',
        'Give me a peaceful activity',
        'Let’s talk',
        'Try a mindfulness game',
      ];

    default:
      return [
        'I had a rough day',
        'I feel okay',
        'I need advice',
        'I just want to talk',
      ];
  }
};

export const TalkPage: React.FC = () => {
  const {
    user,
    navigate,
    openSafetyModal,
    earnXP,
  } = useApp();

  const [messages, setMessages] = useState<ExtendedChatMessage[]>([
    {
      id: 'init-1',
      sender: 'mello',
      text: `Hey 👋 I'm glad you're here, ${
        user.name || 'friend'
      }. You don't have to have everything figured out right now. What's on your mind?`,
      timestamp: getTime(),
      quickReplies: [
        'I had a rough day',
        'I feel okay',
        'I need advice',
        'I just want to relax',
      ],
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentMood, setCurrentMood] = useState<Mood>('neutral');
  const [showMenu, setShowMenu] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const moodInfo = useMemo(
    () => getMoodInfo(currentMood),
    [currentMood]
  );

  const MoodIcon = moodInfo.icon;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, isTyping]);

  /*
   * Keep the browser voice calm and optional.
   */
  const speakMessage = (text: string) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 0.9;
    utterance.pitch = 1.03;
    utterance.volume = 0.65;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend ?? inputText).trim();

    if (!text || isTyping) return;

    const detectedMood = detectMood(text);

    setCurrentMood(detectedMood);

    const userMessage: ExtendedChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: getTime(),
    };

    /*
     * Add the user's message immediately.
     */
    setMessages((prev) => [...prev, userMessage]);

    setInputText('');
    setIsTyping(true);

    /*
     * Give the AI the complete current conversation.
     *
     * This is important because Mello should not treat
     * every message as a completely new conversation.
     */
    const conversationContext = [...messages, userMessage];

    try {
      /*
       * Keep your existing aiService API.
       *
       * Your aiService should use the conversation history
       * to generate the actual personalized response.
       */
      const response = await aiService.generateResponse(
        text,
        conversationContext,
        user.name || 'friend'
      );

      /*
       * Small delay makes the response feel less robotic.
       */
      await new Promise((resolve) =>
        setTimeout(resolve, 350 + Math.random() * 500)
      );

      setIsTyping(false);

      const melloMessage: ExtendedChatMessage = {
        ...response.message,
        quickReplies:
          response.message.quickReplies?.length
            ? response.message.quickReplies
            : getQuickReplies(detectedMood),
      };

      setMessages((prev) => [...prev, melloMessage]);

      if (response.isSafetyTrigger) {
        openSafetyModal();
      } else {
        earnXP(10, 'Mello AI Conversation');
      }

      /*
       * Optional voice response.
       */
      if (soundEnabled) {
        speakMessage(melloMessage.text);
      }
    } catch (error) {
      console.error('Mello chat error:', error);

      setIsTyping(false);

      const fallbackMessage: ExtendedChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'mello',
        text:
          "I'm still here 💜 Something interrupted my response. You can try sending that again.",
        timestamp: getTime(),
        quickReplies: [
          'Try again',
          'I want to talk about something else',
        ],
      };

      setMessages((prev) => [...prev, fallbackMessage]);
    }
  };

  const regenerateLastResponse = async () => {
    if (isTyping) return;

    const lastUserMessage = [...messages]
      .reverse()
      .find((message) => message.sender === 'user');

    if (!lastUserMessage) return;

    /*
     * Remove the previous Mello answer and regenerate it.
     */
    setMessages((prev) => {
      const lastMelloIndex = [...prev]
        .map((message) => message.sender)
        .lastIndexOf('mello');

      if (lastMelloIndex === -1) return prev;

      return prev.filter((_, index) => index !== lastMelloIndex);
    });

    setIsTyping(true);

    try {
      const response = await aiService.generateResponse(
        lastUserMessage.text,
        messages,
        user.name || 'friend'
      );

      await new Promise((resolve) => setTimeout(resolve, 500));

      setIsTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          ...response.message,
          id: `regen-${Date.now()}`,
          timestamp: getTime(),
          quickReplies:
            response.message.quickReplies ||
            getQuickReplies(currentMood),
        },
      ]);
    } catch {
      setIsTyping(false);
    }
  };

  const startNewConversation = () => {
    window.speechSynthesis?.cancel();

    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'mello',
        text: `Fresh page, fresh start 🌿 What's on your mind, ${
          user.name || 'friend'
        }?`,
        timestamp: getTime(),
        quickReplies: [
          'I want to talk',
          'I need advice',
          'I feel stressed',
          'I want to relax',
        ],
      },
    ]);

    setCurrentMood('neutral');
    setInputText('');
    setShowMenu(false);
  };

  const handleActivity = (
    activity?: ChatMessage['suggestedActivity']
  ) => {
    if (!activity) return;

    if (activity.type === 'game') {
      navigate('games');
    } else if (activity.type === 'breathing') {
      navigate('games', {
        gameId: 'breathing-bloom',
      });
    } else if (activity.type === 'therapist') {
      navigate('therapists');
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-105px)] min-h-[620px] flex flex-col bg-white rounded-[2rem] shadow-mello border border-purple-100 overflow-hidden relative">

      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.25, 0.4, 0.25],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-32 -left-32 w-80 h-80 bg-purple-200/30 blur-3xl rounded-full"
        />

        <motion.div
          animate={{
            scale: [1.05, 1, 1.05],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-32 -right-32 w-80 h-80 bg-pink-200/30 blur-3xl rounded-full"
        />
      </div>

      {/* HEADER */}
      <div className="relative z-10 p-4 sm:p-5 bg-gradient-to-r from-purple-50/95 via-white/95 to-pink-50/95 backdrop-blur-xl border-b border-purple-100">

        <div className="flex items-center justify-between gap-3">

          <div className="flex items-center gap-3 min-w-0">

            <div className="relative">
              <MelloAvatar
                size="sm"
                mood={isTyping ? 'listening' : 'happy'}
              />

              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
            </div>

            <div className="min-w-0">

              <div className="flex items-center gap-2">

                <h2 className="text-lg font-bold font-heading text-slate-900">
                  Talk with Mello
                </h2>

                <span className="hidden sm:inline-flex text-[9px] font-extrabold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  AI COMPANION
                </span>

              </div>

              <div className="flex items-center gap-1.5">

                <span
                  className={`text-xs ${
                    isTyping
                      ? 'text-purple-600'
                      : 'text-slate-500'
                  }`}
                >
                  {isTyping
                    ? 'Mello is thinking...'
                    : 'Here to listen • No judgment'}
                </span>

              </div>

            </div>
          </div>

          <div className="flex items-center gap-2">

            {/* Mood */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl ${moodInfo.bg} ${moodInfo.color}`}
            >
              <MoodIcon className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">
                {moodInfo.label}
              </span>
            </div>

            {/* Sound */}
            <button
              onClick={() => {
                if (isSpeaking) {
                  window.speechSynthesis?.cancel();
                  setIsSpeaking(false);
                }

                setSoundEnabled((prev) => !prev);
              }}
              className="p-2 rounded-xl bg-white/80 hover:bg-white border border-purple-100 text-slate-500 hover:text-purple-600 transition"
              title="Toggle voice"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Menu */}
            <div className="relative">

              <button
                onClick={() => setShowMenu((prev) => !prev)}
                className="p-2 rounded-xl bg-white/80 hover:bg-white border border-purple-100 text-slate-500"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    className="absolute right-0 top-11 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-50"
                  >
                    <button
                      onClick={startNewConversation}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-purple-50"
                    >
                      <RefreshCw className="w-4 h-4" />
                      New conversation
                    </button>

                    <button
                      onClick={openSafetyModal}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      Crisis support
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>
        </div>

        {/* Mood indicator */}
        <AnimatePresence>
          {currentMood !== 'neutral' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3"
            >
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <Heart className="w-3.5 h-3.5 text-purple-400" />

                <span>
                  Mello is adjusting the conversation to your mood.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MESSAGE AREA */}
      <div className="relative z-10 flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 bg-slate-50/50">

        {/* Wellness disclaimer */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-400 px-3 py-1.5 bg-white/70 rounded-full border border-purple-100">
            💜 Mello is a supportive AI companion, not a therapist or diagnostic tool.
          </span>
        </div>

        <AnimatePresence initial={false}>

          {messages.map((msg, index) => {

            const isUser = msg.sender === 'user';
            const isLast = index === messages.length - 1;

            return (
              <motion.div
                key={msg.id}
                initial={{
                  opacity: 0,
                  y: 12,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.25,
                  ease: 'easeOut',
                }}
                className={`flex ${
                  isUser ? 'justify-end' : 'justify-start'
                }`}
              >

                <div
                  className={`flex items-start gap-2 ${
                    isUser ? 'flex-row-reverse' : ''
                  } max-w-[92%] sm:max-w-[78%]`}
                >

                  {!isUser && (
                    <MelloAvatar
                      size="sm"
                      className="shrink-0 mt-1"
                      mood="happy"
                    />
                  )}

                  <div>

                    {/* Message */}
                    <div
                      className={`p-4 rounded-[1.35rem] text-sm leading-relaxed ${
                        isUser
                          ? 'bg-purple-600 text-white rounded-tr-md shadow-sm'
                          : msg.isSafetyTrigger
                          ? 'bg-rose-50 text-rose-900 border border-rose-200 rounded-tl-md'
                          : 'bg-white/95 text-slate-800 border border-purple-100 rounded-tl-md shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Message actions */}
                    {!isUser && isLast && !isTyping && (
                      <div className="flex items-center gap-1.5 mt-1.5 ml-1">

                        <button
                          onClick={() => speakMessage(msg.text)}
                          className="p-1.5 rounded-lg hover:bg-purple-50 text-slate-400 hover:text-purple-600"
                          title="Read aloud"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={regenerateLastResponse}
                          className="p-1.5 rounded-lg hover:bg-purple-50 text-slate-400 hover:text-purple-600"
                          title="Regenerate"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    )}

                    {/* Activity suggestion */}
                    {msg.suggestedActivity && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 5,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        className="mt-2"
                      >
                        <button
                          onClick={() =>
                            handleActivity(msg.suggestedActivity)
                          }
                          className="group px-3.5 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold rounded-xl text-xs flex items-center gap-2 border border-purple-200 transition"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-purple-600" />

                          <span>
                            Try {msg.suggestedActivity.title}
                          </span>

                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                        </button>
                      </motion.div>
                    )}

                    {/* Quick replies */}
                    {msg.quickReplies &&
                      msg.quickReplies.length > 0 &&
                      isLast &&
                      !isTyping && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            y: 5,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          className="flex flex-wrap gap-1.5 mt-3"
                        >
                          {msg.quickReplies.map(
                            (reply, idx) => (
                              <button
                                key={`${reply}-${idx}`}
                                onClick={() =>
                                  handleSend(reply)
                                }
                                className="px-3 py-1.5 bg-white hover:bg-purple-50 text-purple-700 font-semibold border border-purple-200 rounded-full text-xs shadow-sm transition active:scale-95"
                              >
                                {reply}
                              </button>
                            )
                          )}
                        </motion.div>
                      )}

                    {/* Timestamp */}
                    <span
                      className={`text-[9px] text-slate-400 mt-1 block px-1 ${
                        isUser ? 'text-right' : ''
                      }`}
                    >
                      {msg.timestamp}
                    </span>

                  </div>
                </div>
              </motion.div>
            );
          })}

        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="flex items-center gap-2"
          >

            <MelloAvatar
              size="sm"
              mood="listening"
            />

            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-md border border-purple-100 shadow-sm">

              <div className="flex items-center gap-1.5">

                <motion.span
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                  }}
                  className="w-2 h-2 bg-purple-300 rounded-full"
                />

                <motion.span
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: 0.15,
                  }}
                  className="w-2 h-2 bg-purple-400 rounded-full"
                />

                <motion.span
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: 0.3,
                  }}
                  className="w-2 h-2 bg-purple-500 rounded-full"
                />

              </div>

            </div>

            <span className="text-[10px] text-purple-400">
              Mello is reflecting...
            </span>

          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* QUICK ACTIONS */}
      <div className="relative z-10 px-3 sm:px-4 pt-2 bg-white">

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">

          <button
            onClick={() =>
              handleSend('I want something calming to do')
            }
            disabled={isTyping}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl text-[11px] font-bold border border-teal-100 disabled:opacity-50"
          >
            <Wind className="w-3.5 h-3.5" />
            Calm me
          </button>

          <button
            onClick={() =>
              handleSend('I want to play a relaxing game')
            }
            disabled={isTyping}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-[11px] font-bold border border-indigo-100 disabled:opacity-50"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            Play
          </button>

          <button
            onClick={() =>
              handleSend('I want to reflect on my day')
            }
            disabled={isTyping}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-[11px] font-bold border border-amber-100 disabled:opacity-50"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Reflect
          </button>

          <button
            onClick={() =>
              handleSend('I just want some company')
            }
            disabled={isTyping}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl text-[11px] font-bold border border-pink-100 disabled:opacity-50"
          >
            <Heart className="w-3.5 h-3.5" />
            Talk
          </button>

        </div>
      </div>

      {/* INPUT */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative z-10 p-3 sm:p-4 bg-white border-t border-purple-100"
      >

        <div className="flex items-center gap-2">

          <div className="flex-1 relative">

            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) =>
                setInputText(e.target.value)
              }
              disabled={isTyping}
              placeholder={
                isTyping
                  ? 'Mello is thinking...'
                  : 'Tell Mello what is on your mind...'
              }
              className="w-full p-3.5 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-300 focus:border-purple-300 focus:outline-none transition"
            />

            <button
              type="button"
              disabled
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-300"
              title="Voice input coming soon"
            >
              <Mic className="w-4 h-4" />
            </button>

          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="p-3.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl shadow-mello transition-all active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>

        </div>

        <div className="flex justify-center items-center gap-1 mt-2">
          <Heart className="w-3 h-3 text-pink-300" />
          <p className="text-[9px] text-slate-400">
            Take your time. There is no wrong way to talk here.
          </p>
        </div>

      </form>

    </div>
  );
};