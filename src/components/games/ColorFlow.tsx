import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Trophy,
  Sparkles,
  Check,
  Volume2,
  VolumeX,
  RotateCcw,
  Waves,
  Circle,
  Star,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useApp } from "../../context/AppContext";

interface ColorNode {
  id: string;
  name: string;
  color: string;
  softColor: string;
  ring: string;
  glow: string;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

export const ColorFlow: React.FC<{
  onBack: () => void;
}> = ({ onBack }) => {
  const { earnXP } = useApp();

  /*
   * ---------------------------------------------------------
   * GAME DATA
   * ---------------------------------------------------------
   */

  const colors: ColorNode[] = [
    {
      id: "purple",
      name: "Lavender",
      color: "#a78bfa",
      softColor: "#ede9fe",
      ring: "ring-violet-200",
      glow: "rgba(167,139,250,0.55)",
    },
    {
      id: "teal",
      name: "Mint",
      color: "#34d399",
      softColor: "#d1fae5",
      ring: "ring-emerald-200",
      glow: "rgba(52,211,153,0.55)",
    },
    {
      id: "pink",
      name: "Rose",
      color: "#f472b6",
      softColor: "#fce7f3",
      ring: "ring-pink-200",
      glow: "rgba(244,114,182,0.55)",
    },
    {
      id: "amber",
      name: "Sunset",
      color: "#fbbf24",
      softColor: "#fef3c7",
      ring: "ring-amber-200",
      glow: "rgba(251,191,36,0.55)",
    },
    {
      id: "blue",
      name: "Ocean",
      color: "#60a5fa",
      softColor: "#dbeafe",
      ring: "ring-blue-200",
      glow: "rgba(96,165,250,0.55)",
    },
    {
      id: "rose",
      name: "Peach",
      color: "#fb7185",
      softColor: "#ffe4e6",
      ring: "ring-rose-200",
      glow: "rgba(251,113,133,0.55)",
    },
  ];

  /*
   * ---------------------------------------------------------
   * STATE
   * ---------------------------------------------------------
   */

  const [sequence, setSequence] =
    useState<string[]>([]);

  const [connectedNodes, setConnectedNodes] =
    useState<Record<string, boolean>>({});

  const [isFinished, setIsFinished] =
    useState(false);

  const [isMuted, setIsMuted] =
    useState(false);

  const [score, setScore] =
    useState(0);

  const [combo, setCombo] =
    useState(0);

  const [bestCombo, setBestCombo] =
    useState(0);

  const [mistakes, setMistakes] =
    useState(0);

  const [ripples, setRipples] =
    useState<Ripple[]>([]);

  const [particles, setParticles] =
    useState<Particle[]>([]);

  const [showInstructions, setShowInstructions] =
    useState(true);

  const [lastColor, setLastColor] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("Breathe in...");

  const [level, setLevel] =
    useState(1);

  const audioContextRef =
    useRef<AudioContext | null>(null);

  /*
   * ---------------------------------------------------------
   * INITIALIZE PARTICLES
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const generated: Particle[] =
      Array.from(
        { length: 28 },
        (_, index) => ({
          id: index,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size:
            2 + Math.random() * 5,
          delay:
            Math.random() * 4,
        })
      );

    setParticles(generated);
  }, []);

  /*
   * ---------------------------------------------------------
   * GENERATE SEQUENCE
   * ---------------------------------------------------------
   */

  const generateSequence = useCallback(
    (currentLevel = 1) => {
      const amount =
        Math.min(
          4 + currentLevel - 1,
          colors.length
        );

      const shuffled = [
        ...colors,
      ].sort(
        () => Math.random() - 0.5
      );

      return shuffled
        .slice(0, amount)
        .map(
          (color) =>
            color.id
        );
    },
    []
  );

  /*
   * ---------------------------------------------------------
   * START / RESET
   * ---------------------------------------------------------
   */

  const startGame = useCallback(() => {
    const newSequence =
      generateSequence(1);

    setSequence(newSequence);
    setConnectedNodes({});
    setIsFinished(false);
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setMistakes(0);
    setLastColor(null);
    setLevel(1);
    setMessage(
      "Follow the colors slowly"
    );
    setShowInstructions(true);
  }, [generateSequence]);

  useEffect(() => {
    startGame();
  }, [startGame]);

  /*
   * ---------------------------------------------------------
   * ASMR AUDIO
   * ---------------------------------------------------------
   */

  const playTone = useCallback(
    (
      frequency: number,
      duration = 0.18,
      volume = 0.035
    ) => {
      if (isMuted) return;

      try {
        if (!audioContextRef.current) {
          const AudioContextClass =
            window.AudioContext ||
            (
              window as typeof window & {
                webkitAudioContext?: typeof AudioContext;
              }
            ).webkitAudioContext;

          if (!AudioContextClass) {
            return;
          }

          audioContextRef.current =
            new AudioContextClass();
        }

        const ctx =
          audioContextRef.current;

        if (
          ctx.state ===
          "suspended"
        ) {
          void ctx.resume();
        }

        const oscillator =
          ctx.createOscillator();

        const gain =
          ctx.createGain();

        oscillator.type =
          "sine";

        oscillator.frequency.setValueAtTime(
          frequency,
          ctx.currentTime
        );

        gain.gain.setValueAtTime(
          0.0001,
          ctx.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
          volume,
          ctx.currentTime + 0.03
        );

        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          ctx.currentTime +
            duration
        );

        oscillator.connect(gain);
        gain.connect(
          ctx.destination
        );

        oscillator.start();

        oscillator.stop(
          ctx.currentTime +
            duration
        );
      } catch {
        // Audio is optional.
      }
    },
    [isMuted]
  );

  /*
   * ---------------------------------------------------------
   * COLOR FREQUENCIES
   * ---------------------------------------------------------
   */

  const frequencies: Record<
    string,
    number
  > = {
    purple: 392,
    teal: 440,
    pink: 494,
    amber: 523,
    blue: 587,
    rose: 659,
  };

  /*
   * ---------------------------------------------------------
   * CREATE RIPPLE
   * ---------------------------------------------------------
   */

  const createRipple = (
    color: ColorNode
  ) => {
    const ripple: Ripple = {
      id: Date.now() + Math.random(),
      x: 50 + (Math.random() * 25 - 12.5),
      y: 50 + (Math.random() * 25 - 12.5),
      color: color.color,
    };

    setRipples(
      (previous) => [
        ...previous,
        ripple,
      ]
    );

    window.setTimeout(() => {
      setRipples(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !==
              ripple.id
          )
      );
    }, 1000);
  };

  /*
   * ---------------------------------------------------------
   * GET COLOR
   * ---------------------------------------------------------
   */

  const getColor = (
    id: string
  ) =>
    colors.find(
      (color) =>
        color.id === id
    );

  /*
   * ---------------------------------------------------------
   * COMPLETE GAME
   * ---------------------------------------------------------
   */

  const handleFinish = useCallback(() => {
    setIsFinished(true);
    setMessage(
      "Everything is flowing"
    );

    /*
     * Completion melody
     */

    if (!isMuted) {
      [
        392,
        494,
        587,
        659,
      ].forEach(
        (
          frequency,
          index
        ) => {
          window.setTimeout(
            () => {
              playTone(
                frequency,
                0.25,
                0.045
              );
            },
            index * 140
          );
        }
      );
    }

    confetti({
      particleCount: 100,
      spread: 75,
      startVelocity: 16,
      gravity: 0.5,
      scalar: 0.7,
      origin: {
        y: 0.55,
      },
    });

    earnXP(
      20 +
        Math.min(
          10,
          bestCombo
        ),
      "Color Flow mindfulness"
    );
  }, [
    bestCombo,
    earnXP,
    isMuted,
    playTone,
  ]);

  /*
   * ---------------------------------------------------------
   * NODE INTERACTION
   * ---------------------------------------------------------
   */

  const connectColor = (
    id: string
  ) => {
    if (isFinished) return;

    const color =
      getColor(id);

    if (!color) return;

    setShowInstructions(false);

    /*
     * Already connected
     */

    if (connectedNodes[id]) {
      return;
    }

    /*
     * EXPECTED COLOR
     */

    const expectedIndex =
      Object.keys(
        connectedNodes
      ).length;

    const expectedColor =
      sequence[
        expectedIndex
      ];

    /*
     * CORRECT
     */

    if (id === expectedColor) {
      const newCombo =
        combo + 1;

      setCombo(newCombo);

      setBestCombo(
        (previous) =>
          Math.max(
            previous,
            newCombo
          )
      );

      setConnectedNodes(
        (previous) => ({
          ...previous,
          [id]: true,
        })
      );

      setLastColor(id);

      setScore(
        (previous) =>
          previous +
          15 +
          combo * 5
      );

      setMessage(
        newCombo >= 3
          ? "Beautiful rhythm ✨"
          : "Let the color flow..."
      );

      createRipple(color);

      playTone(
        frequencies[id] ||
          440
      );

      /*
       * Check level completion
       */

      if (
        expectedIndex + 1 >=
        sequence.length
      ) {
        window.setTimeout(
          () => {
            if (
              level >= 3
            ) {
              handleFinish();
              return;
            }

            const nextLevel =
              level + 1;

            setLevel(
              nextLevel
            );

            const nextSequence =
              generateSequence(
                nextLevel
              );

            setSequence(
              nextSequence
            );

            setConnectedNodes(
              {}
            );

            setLastColor(
              null
            );

            setMessage(
              nextLevel === 2
                ? "The flow deepens..."
                : "You found the rhythm 🌈"
            );

            playTone(
              784,
              0.25,
              0.04
            );
          },
          700
        );
      }

      return;
    }

    /*
     * WRONG COLOR
     */

    setMistakes(
      (previous) =>
        previous + 1
    );

    setCombo(0);

    setMessage(
      "No rush. Follow the glow."
    );

    playTone(
      220,
      0.12,
      0.025
    );

    /*
     * Small shake effect
     */

    setLastColor(
      `wrong-${Date.now()}`
    );

    window.setTimeout(
      () => {
        setLastColor(null);
      },
      400
    );
  };

  /*
   * ---------------------------------------------------------
   * PROGRESS
   * ---------------------------------------------------------
   */

  const progress =
    sequence.length === 0
      ? 0
      : (
          Object.keys(
            connectedNodes
          ).length /
          sequence.length
        ) * 100;

  /*
   * ---------------------------------------------------------
   * UI
   * ---------------------------------------------------------
   */

  return (
    <div className="min-h-screen bg-[#fff8fc] p-4 sm:p-8">

      <div className="max-w-6xl mx-auto">

        {/* =================================================
            HEADER
        ================================================== */}

        <div className="flex items-center justify-between mb-5">

          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />

            Back to Games
          </button>

          <div className="flex items-center gap-2">

            <button
              onClick={() =>
                setIsMuted(
                  (previous) =>
                    !previous
                )
              }
              className="p-2.5 rounded-full bg-white border border-pink-100 shadow-sm hover:bg-pink-50 transition"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-slate-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-pink-500" />
              )}
            </button>

            <span className="bg-white text-pink-600 px-3 py-1.5 rounded-full text-xs font-bold border border-pink-100 shadow-sm">
              🎨 Color Flow
            </span>

          </div>

        </div>

        {!isFinished ? (

          <div className="grid lg:grid-cols-[1fr_260px] gap-5">

            {/* =================================================
                MAIN GAME
            ================================================== */}

            <div className="bg-white rounded-[2rem] border border-pink-100 shadow-xl shadow-pink-100/50 overflow-hidden">

              {/* TOP */}

              <div className="p-5 sm:p-6 border-b border-pink-100">

                <div className="flex items-center justify-between">

                  <div>

                    <div className="flex items-center gap-2 mb-1">

                      <Waves className="w-4 h-4 text-pink-400" />

                      <span className="text-[10px] uppercase tracking-[0.25em] font-black text-pink-400">
                        Mindful Flow
                      </span>

                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-slate-800">
                      Follow the Colors
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                      Slow down. Watch the glow. Follow the flow.
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                      Score
                    </p>

                    <motion.p
                      key={score}
                      initial={{
                        scale: 1.3,
                      }}
                      animate={{
                        scale: 1,
                      }}
                      className="text-2xl font-black text-pink-500"
                    >
                      {score}
                    </motion.p>

                  </div>

                </div>

              </div>

              {/* =================================================
                  FLOW CANVAS
              ================================================== */}

              <div className="p-4 sm:p-7">

                <div className="relative h-[480px] rounded-[2rem] overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 border border-white">

                  {/* SOFT GRADIENT ORBS */}

                  <motion.div
                    className="absolute w-64 h-64 rounded-full bg-purple-200/30 blur-3xl"
                    animate={{
                      x: [
                        -50,
                        80,
                        -50,
                      ],
                      y: [
                        20,
                        80,
                        20,
                      ],
                    }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  <motion.div
                    className="absolute right-0 bottom-0 w-72 h-72 rounded-full bg-pink-200/30 blur-3xl"
                    animate={{
                      x: [
                        40,
                        -50,
                        40,
                      ],
                      y: [
                        20,
                        -50,
                        20,
                      ],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* FLOATING PARTICLES */}

                  {particles.map(
                    (particle) => (
                      <motion.div
                        key={
                          particle.id
                        }
                        className="absolute rounded-full bg-white/70"
                        style={{
                          left: `${particle.x}%`,
                          top: `${particle.y}%`,
                          width: particle.size,
                          height: particle.size,
                        }}
                        animate={{
                          y: [
                            0,
                            -20,
                            0,
                          ],
                          opacity: [
                            0.2,
                            0.8,
                            0.2,
                          ],
                        }}
                        transition={{
                          duration:
                            4 +
                            particle.delay,
                          delay:
                            particle.delay,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    )
                  )}

                  {/* CENTER VORTEX */}

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

                    <motion.div
                      className="absolute w-64 h-64 rounded-full border border-white/60"
                      animate={{
                        scale: [
                          0.85,
                          1.1,
                          0.85,
                        ],
                        rotate: [
                          0,
                          180,
                          360,
                        ],
                      }}
                      transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    <motion.div
                      className="absolute w-44 h-44 rounded-full border border-white/50"
                      animate={{
                        scale: [
                          1.1,
                          0.85,
                          1.1,
                        ],
                        rotate: [
                          360,
                          180,
                          0,
                        ],
                      }}
                      transition={{
                        duration: 13,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    <div className="w-24 h-24 rounded-full bg-white/50 backdrop-blur-md shadow-inner flex items-center justify-center">

                      <motion.div
                        animate={{
                          scale: [
                            1,
                            1.08,
                            1,
                          ],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                        }}
                      >
                        <Waves className="w-8 h-8 text-pink-400" />
                      </motion.div>

                    </div>

                  </div>

                  {/* RIPPLE EFFECTS */}

                  <AnimatePresence>
                    {ripples.map(
                      (ripple) => (
                        <motion.div
                          key={
                            ripple.id
                          }
                          initial={{
                            opacity: 0.7,
                            scale: 0.2,
                          }}
                          animate={{
                            opacity: 0,
                            scale: 3,
                          }}
                          exit={{
                            opacity: 0,
                          }}
                          transition={{
                            duration: 1,
                            ease: "easeOut",
                          }}
                          className="absolute w-16 h-16 rounded-full border-2 pointer-events-none"
                          style={{
                            left: `calc(${ripple.x}% - 32px)`,
                            top: `calc(${ripple.y}% - 32px)`,
                            borderColor:
                              ripple.color,
                          }}
                        />
                      )
                    )}
                  </AnimatePresence>

                  {/* MESSAGE */}

                  <motion.div
                    key={message}
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="absolute top-7 left-1/2 -translate-x-1/2"
                  >
                    <div className="px-5 py-2 rounded-full bg-white/70 backdrop-blur-md border border-white shadow-sm text-xs font-bold text-slate-600 whitespace-nowrap">
                      {message}
                    </div>
                  </motion.div>

                  {/* COLOR NODES */}

                  <div className="absolute inset-0">

                    {sequence.map(
                      (id, index) => {
                        const color =
                          getColor(
                            id
                          );

                        if (!color)
                          return null;

                        /*
                         * Positions around the
                         * center.
                         */

                        const positions = [
                          {
                            left: "18%",
                            top: "25%",
                          },
                          {
                            left: "70%",
                            top: "25%",
                          },
                          {
                            left: "20%",
                            top: "65%",
                          },
                          {
                            left: "68%",
                            top: "66%",
                          },
                          {
                            left: "43%",
                            top: "12%",
                          },
                          {
                            left: "44%",
                            top: "77%",
                          },
                        ];

                        const position =
                          positions[
                            index %
                              positions.length
                          ];

                        const isConnected =
                          !!connectedNodes[
                            id
                          ];

                        const isExpected =
                          sequence[
                            Object.keys(
                              connectedNodes
                            ).length
                          ] === id;

                        const isWrong =
                          lastColor?.startsWith(
                            "wrong"
                          );

                        return (
                          <motion.button
                            key={id}
                            onClick={() =>
                              connectColor(
                                id
                              )
                            }
                            style={{
                              left:
                                position.left,
                              top:
                                position.top,
                            }}
                            animate={
                              isWrong
                                ? {
                                    x: [
                                      0,
                                      -5,
                                      5,
                                      -3,
                                      0,
                                    ],
                                  }
                                : {
                                    y: [
                                      0,
                                      -5,
                                      0,
                                    ],
                                  }
                            }
                            transition={
                              isWrong
                                ? {
                                    duration:
                                      0.25,
                                  }
                                : {
                                    duration:
                                      3 +
                                      index *
                                        0.3,
                                    repeat:
                                      Infinity,
                                    ease: "easeInOut",
                                  }
                            }
                            className="absolute -translate-x-1/2 -translate-y-1/2"
                          >

                            {/* OUTER GLOW */}

                            <motion.div
                              animate={{
                                scale:
                                  isExpected
                                    ? [
                                        1,
                                        1.18,
                                        1,
                                      ]
                                    : 1,
                                opacity:
                                  isExpected
                                    ? [
                                        0.35,
                                        0.7,
                                        0.35,
                                      ]
                                    : 0.2,
                              }}
                              transition={{
                                duration: 1.8,
                                repeat:
                                  Infinity,
                              }}
                              className="absolute inset-[-12px] rounded-full blur-md"
                              style={{
                                background:
                                  color.color,
                              }}
                            />

                            {/* NODE */}

                            <div
                              className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border-4 border-white shadow-xl transition ${
                                isConnected
                                  ? "scale-90"
                                  : "scale-100"
                              }`}
                              style={{
                                background:
                                  isConnected
                                    ? color.color
                                    : color.softColor,
                                boxShadow: `0 10px 30px ${color.glow}`,
                              }}
                            >

                              {isConnected ? (
                                <Check className="w-7 h-7 text-white" />
                              ) : (
                                <motion.div
                                  animate={{
                                    scale:
                                      isExpected
                                        ? [
                                            1,
                                            1.12,
                                            1,
                                          ]
                                        : 1,
                                  }}
                                  transition={{
                                    duration: 1.5,
                                    repeat:
                                      Infinity,
                                  }}
                                >
                                  <Circle
                                    className="w-7 h-7"
                                    style={{
                                      color:
                                        color.color,
                                    }}
                                  />
                                </motion.div>
                              )}

                            </div>

                            {/* LABEL */}

                            <div className="mt-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md shadow-sm text-[10px] font-bold text-slate-600 whitespace-nowrap">
                              {color.name}
                            </div>

                          </motion.button>
                        );
                      }
                    )}

                  </div>

                  {/* INTRO */}

                  <AnimatePresence>
                    {showInstructions && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          scale: 0.9,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.9,
                        }}
                        className="absolute bottom-7 left-1/2 -translate-x-1/2"
                      >
                        <div className="bg-white/80 backdrop-blur-md border border-white px-5 py-3 rounded-2xl shadow-lg text-center">

                          <p className="text-xs font-black text-slate-700">
                            Follow the glowing node
                          </p>

                          <p className="text-[10px] text-slate-400 mt-1">
                            There is no rush.
                          </p>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                {/* PROGRESS */}

                <div className="mt-5">

                  <div className="flex justify-between mb-2">

                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                      Flow Progress
                    </span>

                    <span className="text-[10px] font-bold text-pink-500">
                      {Math.round(
                        progress
                      )}%
                    </span>

                  </div>

                  <div className="h-2 rounded-full bg-pink-50 overflow-hidden">

                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400"
                      animate={{
                        width: `${progress}%`,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                      }}
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                SIDE PANEL
            ================================================== */}

            <div className="space-y-4">

              {/* LEVEL */}

              <div className="bg-white rounded-3xl border border-pink-100 shadow-sm p-5">

                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                      Flow Level
                    </p>

                    <p className="text-3xl font-black text-pink-500 mt-1">
                      {level}
                      <span className="text-sm text-slate-300">
                        /3
                      </span>
                    </p>

                  </div>

                  <Waves className="w-8 h-8 text-pink-300" />

                </div>

              </div>

              {/* SCORE */}

              <div className="bg-white rounded-3xl border border-pink-100 shadow-sm p-5">

                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                  Mind Score
                </p>

                <p className="text-3xl font-black text-slate-700 mt-1">
                  {score}
                </p>

              </div>

              {/* COMBO */}

              <div className="bg-white rounded-3xl border border-pink-100 shadow-sm p-5">

                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                      Current Flow
                    </p>

                    <p className="text-3xl font-black text-purple-500 mt-1">
                      ×{combo}
                    </p>

                  </div>

                  <Sparkles className="w-7 h-7 text-amber-400" />

                </div>

              </div>

              {/* BEST COMBO */}

              <div className="bg-white rounded-3xl border border-pink-100 shadow-sm p-5">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">

                    <Star className="w-5 h-5 text-amber-400 fill-amber-200" />

                  </div>

                  <div>

                    <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                      Best Flow
                    </p>

                    <p className="font-black text-slate-700">
                      {bestCombo}
                    </p>

                  </div>

                </div>

              </div>

              {/* MISTAKES */}

              <div className="bg-white rounded-3xl border border-pink-100 shadow-sm p-5">

                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                  Gentle Resets
                </p>

                <p className="text-2xl font-black text-slate-600 mt-1">
                  {mistakes}
                </p>

                <p className="text-[10px] text-slate-400 mt-1">
                  Mistakes are part of the flow.
                </p>

              </div>

              {/* RESET */}

              <button
                onClick={
                  startGame
                }
                className="w-full py-3 rounded-2xl bg-white border border-pink-100 hover:bg-pink-50 text-slate-500 hover:text-pink-600 font-bold text-xs transition flex items-center justify-center gap-2"
              >

                <RotateCcw className="w-3.5 h-3.5" />

                Start New Flow

              </button>

            </div>

          </div>

        ) : (

          /* =================================================
             COMPLETION SCREEN
          ================================================== */

          <div className="min-h-[70vh] flex items-center justify-center">

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              className="w-full max-w-xl bg-white rounded-[2rem] border border-pink-100 shadow-2xl shadow-pink-100/70 p-8 sm:p-12 text-center"
            >

              <motion.div
                initial={{
                  scale: 0,
                  rotate: -20,
                }}
                animate={{
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 15,
                }}
                className="relative w-24 h-24 mx-auto"
              >

                <motion.div
                  className="absolute inset-0 rounded-full bg-pink-300/20 blur-xl"
                  animate={{
                    scale: [
                      0.8,
                      1.2,
                      0.8,
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />

                <div className="relative w-full h-full rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center">

                  <Trophy className="w-10 h-10 text-pink-500" />

                </div>

              </motion.div>

              <div className="flex justify-center items-center gap-2 mt-7">

                <Sparkles className="w-4 h-4 text-amber-400" />

                <span className="text-[10px] uppercase tracking-[0.3em] text-pink-500 font-black">
                  Complete Harmony
                </span>

                <Sparkles className="w-4 h-4 text-amber-400" />

              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mt-3">
                Harmonious Flow! 🎨
              </h2>

              <p className="text-slate-500 text-sm max-w-sm mx-auto mt-3 leading-relaxed">
                You followed the colors,
                found the rhythm, and
                allowed everything to
                settle into balance.
              </p>

              {/* RESULTS */}

              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mt-7">

                <div className="bg-pink-50 rounded-2xl p-4">

                  <p className="text-[8px] uppercase tracking-widest text-pink-500 font-bold">
                    Score
                  </p>

                  <p className="text-2xl font-black text-pink-700 mt-1">
                    {score}
                  </p>

                </div>

                <div className="bg-purple-50 rounded-2xl p-4">

                  <p className="text-[8px] uppercase tracking-widest text-purple-500 font-bold">
                    Best Flow
                  </p>

                  <p className="text-2xl font-black text-purple-700 mt-1">
                    ×{bestCombo}
                  </p>

                </div>

                <div className="bg-amber-50 rounded-2xl p-4">

                  <p className="text-[8px] uppercase tracking-widest text-amber-500 font-bold">
                    Resets
                  </p>

                  <p className="text-2xl font-black text-amber-700 mt-1">
                    {mistakes}
                  </p>

                </div>

              </div>

              {/* XP */}

              <div className="inline-flex items-center gap-2 mt-7 px-5 py-3 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700 text-sm font-black">

                <Sparkles className="w-4 h-4" />

                +20 Mind Points Earned!

              </div>

              {/* BUTTONS */}

              <div className="flex justify-center gap-3 mt-7">

                <button
                  onClick={
                    startGame
                  }
                  className="px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-600 text-sm font-bold flex items-center gap-2 transition"
                >

                  <RotateCcw className="w-4 h-4" />

                  Flow Again

                </button>

                <button
                  onClick={onBack}
                  className="px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-sm font-bold shadow-lg shadow-pink-200 transition"
                >
                  Done
                </button>

              </div>

            </motion.div>

          </div>

        )}

      </div>
    </div>
  );
};