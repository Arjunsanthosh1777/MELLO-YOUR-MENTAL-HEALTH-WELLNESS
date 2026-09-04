import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Trophy,
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  Wind,
  Heart,
  Waves
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  drift: number;
  delay: number;
  hue: number;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const TARGET_BUBBLES = 20;
const SESSION_TIME = 120;

export const CalmBubble: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { earnXP } = useApp();

  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SESSION_TIME);
  const [isFinished, setIsFinished] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [breathingPhase, setBreathingPhase] = useState('Breathe in');
  const [isBreathing, setIsBreathing] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const completedRef = useRef(false);
  const nextBubbleId = useRef(100);

  // ------------------------------------------------------------
  // AUDIO
  // ------------------------------------------------------------

  const createAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }).webkitAudioContext;

      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
      }
    }

    return audioContextRef.current;
  };

  const playPopSound = useCallback(() => {
    if (!soundEnabled) return;

    const ctx = createAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Soft glassy pop
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(520, now);
    oscillator.frequency.exponentialRampToValueAtTime(190, now + 0.12);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, now);
    filter.frequency.exponentialRampToValueAtTime(500, now + 0.15);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.18);

    // Tiny high-frequency sparkle
    const sparkle = ctx.createOscillator();
    const sparkleGain = ctx.createGain();

    sparkle.type = 'sine';
    sparkle.frequency.setValueAtTime(1300, now);

    sparkleGain.gain.setValueAtTime(0.0001, now);
    sparkleGain.gain.exponentialRampToValueAtTime(0.035, now + 0.01);
    sparkleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    sparkle.connect(sparkleGain);
    sparkleGain.connect(ctx.destination);

    sparkle.start(now);
    sparkle.stop(now + 0.09);
  }, [soundEnabled]);

  // ------------------------------------------------------------
  // BUBBLE GENERATION
  // ------------------------------------------------------------

  const createBubble = useCallback((): Bubble => {
    const id = nextBubbleId.current++;

    return {
      id,
      x: 8 + Math.random() * 84,
      y: 105 + Math.random() * 20,
      size: 42 + Math.random() * 48,
      duration: 9 + Math.random() * 7,
      drift: -35 + Math.random() * 70,
      delay: Math.random() * 3,
      hue: Math.floor(Math.random() * 360)
    };
  }, []);

  const createInitialBubbles = useCallback(() => {
    const initialBubbles = Array.from(
      { length: 9 },
      () => createBubble()
    );

    setBubbles(initialBubbles);
  }, [createBubble]);

  // ------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------

  useEffect(() => {
    createInitialBubbles();
  }, [createInitialBubbles]);

  // ------------------------------------------------------------
  // TIMER
  // ------------------------------------------------------------

  useEffect(() => {
    if (isFinished) return;

    const timer = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isFinished]);

  useEffect(() => {
    if (timeLeft === 0 && !isFinished) {
      finishGame();
    }
  }, [timeLeft, isFinished]);

  // ------------------------------------------------------------
  // BREATHING GUIDE
  // ------------------------------------------------------------

  useEffect(() => {
    if (isFinished) return;

    setIsBreathing(true);

    const phases = [
      { text: 'Breathe in', duration: 4000 },
      { text: 'Hold softly', duration: 2000 },
      { text: 'Breathe out', duration: 5000 },
      { text: 'Rest', duration: 2000 }
    ];

    let phaseIndex = 0;
    let timeout: number;

    const nextPhase = () => {
      setBreathingPhase(phases[phaseIndex].text);

      timeout = window.setTimeout(() => {
        phaseIndex = (phaseIndex + 1) % phases.length;
        nextPhase();
      }, phases[phaseIndex].duration);
    };

    nextPhase();

    return () => {
      window.clearTimeout(timeout);
      setIsBreathing(false);
    };
  }, [isFinished]);

  // ------------------------------------------------------------
  // FINISH GAME
  // ------------------------------------------------------------

  const finishGame = useCallback(() => {
    if (completedRef.current) return;

    completedRef.current = true;
    setIsFinished(true);

    earnXP(15, 'Calm Bubble relaxation');
  }, [earnXP]);

  // ------------------------------------------------------------
  // POP BUBBLE
  // ------------------------------------------------------------

  const popBubble = (bubble: Bubble) => {
    if (isFinished) return;

    playPopSound();

    const nextCount = poppedCount + 1;

    setPoppedCount(nextCount);

    // Create ripple
    const ripple: Ripple = {
      id: Date.now() + Math.random(),
      x: bubble.x,
      y: 70
    };

    setRipples(prev => [...prev, ripple]);

    window.setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== ripple.id));
    }, 900);

    // Replace bubble
    setBubbles(prev =>
      prev.map(current =>
        current.id === bubble.id
          ? createBubble()
          : current
      )
    );

    if (nextCount >= TARGET_BUBBLES) {
      window.setTimeout(() => {
        finishGame();
      }, 700);
    }
  };

  // ------------------------------------------------------------
  // RESET
  // ------------------------------------------------------------

  const resetGame = () => {
    completedRef.current = false;

    setPoppedCount(0);
    setTimeLeft(SESSION_TIME);
    setIsFinished(false);
    setRipples([]);

    createInitialBubbles();
  };

  // ------------------------------------------------------------
  // HELPERS
  // ------------------------------------------------------------

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = Math.min(
    (poppedCount / TARGET_BUBBLES) * 100,
    100
  );

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);

    if (!audioContextRef.current) {
      createAudioContext();
    }
  };

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------

  return (
    <div className="relative max-w-3xl mx-auto overflow-hidden rounded-[32px] border border-indigo-100 bg-white shadow-[0_20px_70px_rgba(99,102,241,0.12)]">

      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-200/20 blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />

        <motion.div
          className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-cyan-200/20 blur-3xl"
          animate={{
            scale: [1.15, 1, 1.15],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between p-5 sm:p-6 border-b border-slate-100">

        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Games
        </button>

        <div className="flex items-center gap-2">

          <button
            onClick={toggleSound}
            aria-label="Toggle ASMR sound"
            className="h-9 w-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full border border-purple-100 text-xs font-bold">
            <Waves className="w-3.5 h-3.5" />
            Calm Flow
          </div>

        </div>
      </div>

      {!isFinished ? (
        <div className="relative z-10 p-5 sm:p-6">

          {/* Top stats */}
          <div className="flex items-center justify-between mb-5">

            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-bold">
                Gentle Session
              </p>

              <p className="text-lg font-bold text-slate-700">
                {poppedCount}
                <span className="text-slate-300">
                  {' '}
                  / {TARGET_BUBBLES}
                </span>
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-bold">
                Remaining
              </p>

              <p className="text-lg font-bold text-slate-700">
                {formatTime(timeLeft)}
              </p>
            </div>

          </div>

          {/* Progress */}
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Breathing guide */}
          <motion.div
            animate={{
              scale: isBreathing
                ? breathingPhase === 'Breathe in'
                  ? 1.03
                  : breathingPhase === 'Breathe out'
                  ? 0.98
                  : 1
                : 1
            }}
            transition={{ duration: 2 }}
            className="mb-5 flex items-center justify-center gap-2 text-xs text-indigo-400"
          >
            <Wind className="w-4 h-4" />

            <AnimatePresence mode="wait">
              <motion.span
                key={breathingPhase}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
              >
                {breathingPhase}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          {/* GAME ARENA */}
          <div
            className="
              relative
              h-[420px]
              sm:h-[470px]
              overflow-hidden
              rounded-[28px]
              border
              border-indigo-100
              bg-gradient-to-b
              from-[#eef2ff]
              via-[#f8f7ff]
              to-[#ecfeff]
              shadow-inner
            "
          >

            {/* Soft atmospheric light */}
            <motion.div
              className="absolute left-1/2 top-1/2 w-72 h-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.35, 0.6, 0.35]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />

            {/* Instruction */}
            <div className="absolute top-5 left-0 right-0 z-10 text-center pointer-events-none">

              <motion.div
                animate={{
                  opacity: [0.55, 1, 0.55]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/70 text-indigo-400 text-xs"
              >
                <Heart className="w-3.5 h-3.5" />
                Tap gently
              </motion.div>

            </div>

            {/* Decorative floating particles */}
            {Array.from({ length: 18 }).map((_, index) => (
              <motion.div
                key={`particle-${index}`}
                className="absolute w-1 h-1 rounded-full bg-white/60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.1, 0.6, 0.1]
                }}
                transition={{
                  duration: 4 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: 'easeInOut'
                }}
              />
            ))}

            {/* Bubbles */}
            <AnimatePresence>
              {bubbles.map(bubble => (
                <motion.button
                  key={bubble.id}
                  onClick={() => popBubble(bubble)}
                  initial={{
                    y: 480,
                    x: `${bubble.x}%`,
                    opacity: 0,
                    scale: 0.65
                  }}
                  animate={{
                    y: -120,
                    x: [
                      `${bubble.x}%`,
                      `calc(${bubble.x}% + ${bubble.drift}px)`,
                      `${bubble.x}%`
                    ],
                    opacity: [0, 1, 1, 0],
                    scale: [0.8, 1, 1.04, 0.9]
                  }}
                  transition={{
                    duration: bubble.duration,
                    delay: bubble.delay,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  whileHover={{
                    scale: 1.12
                  }}
                  whileTap={{
                    scale: 1.3
                  }}
                  style={{
                    width: bubble.size,
                    height: bubble.size,
                    background: `radial-gradient(
                      circle at 30% 25%,
                      hsla(${bubble.hue}, 90%, 98%, 0.95) 0%,
                      hsla(${bubble.hue}, 80%, 90%, 0.45) 28%,
                      hsla(${bubble.hue}, 75%, 75%, 0.18) 60%,
                      hsla(${bubble.hue}, 70%, 65%, 0.08) 100%
                    )`,
                    borderColor: `hsla(${bubble.hue}, 70%, 75%, 0.55)`
                  }}
                  className="
                    absolute
                    rounded-full
                    border
                    backdrop-blur-md
                    shadow-[inset_0_0_25px_rgba(255,255,255,0.7),0_8px_30px_rgba(99,102,241,0.08)]
                    cursor-pointer
                    touch-manipulation
                    outline-none
                  "
                >

                  {/* Main shine */}
                  <span className="absolute left-[18%] top-[14%] w-[22%] h-[18%] rounded-full bg-white/80 blur-[1px]" />

                  {/* Tiny shine */}
                  <span className="absolute left-[29%] top-[35%] w-[7%] h-[7%] rounded-full bg-white/60" />

                  {/* Bottom reflection */}
                  <span className="absolute left-[25%] bottom-[13%] w-[50%] h-[10%] rounded-full bg-white/20 blur-[3px]" />

                </motion.button>
              ))}
            </AnimatePresence>

            {/* Ripples */}
            <AnimatePresence>
              {ripples.map(ripple => (
                <motion.div
                  key={ripple.id}
                  initial={{
                    left: `${ripple.x}%`,
                    top: `${ripple.y}%`,
                    width: 10,
                    height: 10,
                    opacity: 0.8
                  }}
                  animate={{
                    width: 100,
                    height: 100,
                    opacity: 0
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: 'easeOut'
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 pointer-events-none"
                />
              ))}
            </AnimatePresence>

            {/* Bottom ambience */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-indigo-100/20 to-transparent pointer-events-none" />

          </div>

          {/* Relaxation instruction */}
          <div className="mt-5 text-center">

            <p className="text-xs text-slate-400">
              Follow the bubbles slowly. There is no need to rush.
            </p>

            <motion.div
              animate={{
                y: [0, -3, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="mt-2 text-[11px] text-indigo-300"
            >
              inhale · notice · tap · exhale
            </motion.div>

          </div>

        </div>
      ) : (

        /* ------------------------------------------------------
           COMPLETION SCREEN
        ------------------------------------------------------ */

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 min-h-[560px] flex items-center justify-center p-6"
        >

          {/* Soft breathing circle */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{
              scale: [0.95, 1.08, 0.95],
              opacity: 1
            }}
            transition={{
              scale: {
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut'
              }
            }}
            className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-purple-100/60 via-pink-100/40 to-cyan-100/50 blur-2xl"
          />

          <div className="relative text-center space-y-5">

            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 160,
                damping: 14
              }}
              className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-500 shadow-inner"
            >
              <Waves className="w-11 h-11" />
            </motion.div>

            <div>
              <h2 className="text-3xl font-bold text-slate-800">
                A Little Lighter 🫧
              </h2>

              <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                You slowed down, followed the bubbles, and gave yourself
                a quiet moment to breathe.
              </p>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-3">

              <div className="px-4 py-3 rounded-2xl bg-purple-50 border border-purple-100">
                <p className="text-lg font-bold text-purple-600">
                  {poppedCount}
                </p>
                <p className="text-[10px] text-purple-400 uppercase tracking-wider">
                  Bubbles
                </p>
              </div>

              <div className="px-4 py-3 rounded-2xl bg-cyan-50 border border-cyan-100">
                <p className="text-lg font-bold text-cyan-600">
                  2:00
                </p>
                <p className="text-[10px] text-cyan-400 uppercase tracking-wider">
                  Session
                </p>
              </div>

            </div>

            {/* XP */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 border border-amber-100 px-5 py-3 rounded-2xl font-bold text-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              +15 Mind Points
            </motion.div>

            {/* Buttons */}
            <div className="pt-2 flex justify-center gap-3">

              <button
                onClick={resetGame}
                className="
                  px-5
                  py-2.5
                  bg-slate-100
                  hover:bg-slate-200
                  text-slate-700
                  font-semibold
                  rounded-xl
                  flex
                  items-center
                  gap-2
                  transition
                "
              >
                <RotateCcw className="w-4 h-4" />
                Again
              </button>

              <button
                onClick={onBack}
                className="
                  px-6
                  py-2.5
                  bg-indigo-500
                  hover:bg-indigo-600
                  text-white
                  font-bold
                  rounded-xl
                  shadow-lg
                  shadow-indigo-200
                  transition
                "
              >
                Finish
              </button>

            </div>

            <p className="pt-2 text-[10px] text-slate-400">
              Take one more slow breath before you continue.
            </p>

          </div>

        </motion.div>
      )}

      {/* Footer */}
      <div className="relative z-10 px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
          <Sparkles className="w-3 h-3" />
          A gentle, non-clinical relaxation activity
        </div>
      </div>

    </div>
  );
};