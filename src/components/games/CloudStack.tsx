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
  Cloud,
  Volume2,
  VolumeX,
  RotateCcw,
  Wind,
  Star,
  Moon,
  Sun,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useApp } from "../../context/AppContext";

interface CloudPiece {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  perfect: boolean;
}

interface CloudStackProps {
  onBack: () => void;
}

const TARGET_CLOUDS = 10;
const ARENA_HEIGHT = 430;
const CLOUD_HEIGHT = 52;
const BASE_WIDTH = 170;

export const CloudStack: React.FC<CloudStackProps> = ({
  onBack,
}) => {
  const { earnXP } = useApp();

  const arenaRef = useRef<HTMLDivElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const [clouds, setClouds] = useState<CloudPiece[]>([]);

  const [currentX, setCurrentX] = useState(50);

  const [direction, setDirection] =
    useState<1 | -1>(1);

  const [speed, setSpeed] = useState(0.28);

  const [isDropping, setIsDropping] =
    useState(false);

  const [isFinished, setIsFinished] =
    useState(false);

  const [isMuted, setIsMuted] =
    useState(false);

  const [score, setScore] = useState(0);

  const [combo, setCombo] = useState(0);

  const [perfectStacks, setPerfectStacks] =
    useState(0);

  const [showPerfect, setShowPerfect] =
    useState(false);

  const [showInstructions, setShowInstructions] =
    useState(true);

  const [skyMode, setSkyMode] =
    useState<"day" | "sunset" | "night">(
      "day"
    );

  /*
   * ---------------------------------------------------------
   * SOFT ASMR SOUND
   * ---------------------------------------------------------
   */

  const playTone = useCallback(
    (
      frequency: number,
      duration = 0.12,
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

          if (!AudioContextClass) return;

          audioContextRef.current =
            new AudioContextClass();
        }

        const ctx =
          audioContextRef.current;

        if (ctx.state === "suspended") {
          void ctx.resume();
        }

        const oscillator =
          ctx.createOscillator();

        const gain =
          ctx.createGain();

        oscillator.type = "sine";

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
          ctx.currentTime + 0.025
        );

        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          ctx.currentTime + duration
        );

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start();

        oscillator.stop(
          ctx.currentTime + duration
        );
      } catch {
        // Audio is optional.
      }
    },
    [isMuted]
  );

  /*
   * ---------------------------------------------------------
   * SUCCESS SOUND
   * ---------------------------------------------------------
   */

  const playSuccessSound =
    useCallback(() => {
      if (isMuted) return;

      playTone(392, 0.18, 0.04);

      window.setTimeout(() => {
        playTone(523, 0.18, 0.04);
      }, 130);

      window.setTimeout(() => {
        playTone(659, 0.25, 0.045);
      }, 260);

      window.setTimeout(() => {
        playTone(784, 0.35, 0.035);
      }, 420);
    }, [isMuted, playTone]);

  /*
   * ---------------------------------------------------------
   * SKY COLORS
   * ---------------------------------------------------------
   */

  const skyClasses = {
    day: {
      background:
        "bg-gradient-to-b from-sky-300 via-sky-200 to-indigo-100",
      sun:
        "bg-yellow-200/80 shadow-[0_0_80px_25px_rgba(253,224,71,.25)]",
      stars: false,
    },

    sunset: {
      background:
        "bg-gradient-to-b from-orange-300 via-pink-200 to-purple-300",
      sun:
        "bg-orange-100 shadow-[0_0_80px_30px_rgba(251,146,60,.3)]",
      stars: false,
    },

    night: {
      background:
        "bg-gradient-to-b from-[#11152f] via-[#1c2348] to-[#090d20]",
      sun:
        "bg-indigo-200 shadow-[0_0_70px_20px_rgba(165,180,252,.25)]",
      stars: true,
    },
  };

  /*
   * ---------------------------------------------------------
   * STAR POSITIONS
   * ---------------------------------------------------------
   */

  const stars = [
    { x: 8, y: 15, delay: 0 },
    { x: 17, y: 32, delay: 1 },
    { x: 27, y: 10, delay: 2 },
    { x: 42, y: 21, delay: 0.5 },
    { x: 58, y: 12, delay: 1.5 },
    { x: 72, y: 27, delay: 2.2 },
    { x: 83, y: 11, delay: 0.7 },
    { x: 92, y: 35, delay: 1.8 },
    { x: 35, y: 40, delay: 2.5 },
    { x: 65, y: 42, delay: 1.1 },
  ];

  /*
   * ---------------------------------------------------------
   * RESET
   * ---------------------------------------------------------
   */

  const resetGame = useCallback(() => {
    setClouds([]);
    setCurrentX(50);
    setDirection(1);
    setSpeed(0.28);
    setIsDropping(false);
    setIsFinished(false);
    setScore(0);
    setCombo(0);
    setPerfectStacks(0);
    setShowPerfect(false);
    setSkyMode("day");
    setShowInstructions(true);
  }, []);

  /*
   * ---------------------------------------------------------
   * CLOUD ANIMATION
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (isFinished || isDropping) return;

    let frameId = 0;
    let previousTime = performance.now();

    const animate = (
      currentTime: number
    ) => {
      const delta =
        currentTime - previousTime;

      previousTime = currentTime;

      const movement =
        speed * delta;

      setCurrentX((previous) => {
        let next =
          previous +
          direction * movement;

        if (next >= 86) {
          next = 86;
          setDirection(-1);
        }

        if (next <= 14) {
          next = 14;
          setDirection(1);
        }

        return next;
      });

      frameId =
        requestAnimationFrame(animate);
    };

    frameId =
      requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [
    direction,
    isDropping,
    isFinished,
    speed,
  ]);

  /*
   * ---------------------------------------------------------
   * CHANGE SKY
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (clouds.length >= 4) {
      setSkyMode("sunset");
    }

    if (clouds.length >= 7) {
      setSkyMode("night");
    }
  }, [clouds.length]);

  /*
   * ---------------------------------------------------------
   * PERFECT STACK CALCULATION
   * ---------------------------------------------------------
   */

  const calculatePlacement =
    useCallback(() => {
      if (clouds.length === 0) {
        return {
          perfect: true,
          overlap: 1,
        };
      }

      const lastCloud =
        clouds[clouds.length - 1];

      const distance =
        Math.abs(
          currentX -
            lastCloud.x
        );

      const overlap =
        Math.max(
          0,
          1 - distance / 28
        );

      return {
        perfect: distance < 7,
        overlap,
      };
    }, [clouds, currentX]);

  /*
   * ---------------------------------------------------------
   * DROP CLOUD
   * ---------------------------------------------------------
   */

  const dropCloud = () => {
    if (
      isFinished ||
      isDropping
    ) {
      return;
    }

    setShowInstructions(false);
    setIsDropping(true);

    const placement =
      calculatePlacement();

    const cloudIndex =
      clouds.length;

    const cloudWidth =
      Math.max(
        105,
        BASE_WIDTH -
          cloudIndex * 5
      );

    const targetY =
      ARENA_HEIGHT -
      62 -
      cloudIndex * 38;

    const rotation =
      Math.random() * 6 - 3;

    const newCloud: CloudPiece = {
      id: Date.now(),
      x: currentX,
      y: targetY,
      width: cloudWidth,
      height: CLOUD_HEIGHT,
      rotation,
      opacity: 1,
      perfect: placement.perfect,
    };

    /*
     * SOFT DROP SOUND
     */

    playTone(
      placement.perfect
        ? 523
        : 330,
      placement.perfect
        ? 0.18
        : 0.1
    );

    /*
     * SCORE
     */

    const basePoints =
      10 +
      cloudIndex * 5;

    const perfectBonus =
      placement.perfect
        ? 20
        : Math.round(
            placement.overlap * 10
          );

    const comboBonus =
      placement.perfect
        ? combo * 5
        : 0;

    setScore(
      (previous) =>
        previous +
        basePoints +
        perfectBonus +
        comboBonus
    );

    if (placement.perfect) {
      setCombo(
        (previous) =>
          previous + 1
      );

      setPerfectStacks(
        (previous) =>
          previous + 1
      );

      setShowPerfect(true);

      window.setTimeout(() => {
        setShowPerfect(false);
      }, 850);
    } else {
      setCombo(0);
    }

    setClouds((previous) => [
      ...previous,
      newCloud,
    ]);

    /*
     * INCREASE DIFFICULTY
     */

    setSpeed(
      (previous) =>
        Math.min(
          0.52,
          previous + 0.025
        )
    );

    /*
     * FINISH
     */

    if (
      cloudIndex + 1 >=
      TARGET_CLOUDS
    ) {
      window.setTimeout(() => {
        finishGame();
      }, 800);
    } else {
      window.setTimeout(() => {
        setIsDropping(false);
      }, 400);
    }
  };

  /*
   * ---------------------------------------------------------
   * FINISH GAME
   * ---------------------------------------------------------
   */

  const finishGame = () => {
    setIsFinished(true);
    setIsDropping(false);

    playSuccessSound();

    confetti({
      particleCount: 100,
      spread: 75,
      startVelocity: 18,
      gravity: 0.45,
      scalar: 0.75,
      origin: {
        y: 0.55,
      },
    });

    const xpBonus =
      Math.min(
        10,
        Math.floor(
          perfectStacks / 2
        )
      );

    earnXP(
      15 + xpBonus,
      "Cloud Stack relaxation"
    );
  };

  /*
   * ---------------------------------------------------------
   * KEYBOARD
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        event.code === "Space"
      ) {
        event.preventDefault();
        dropCloud();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  });

  /*
   * ---------------------------------------------------------
   * MOUSE / TOUCH POSITIONING
   * ---------------------------------------------------------
   */

  const updatePositionFromPointer =
    (
      clientX: number
    ) => {
      if (!arenaRef.current) return;

      const rect =
        arenaRef.current.getBoundingClientRect();

      const relativeX =
        clientX - rect.left;

      const percentage =
        (relativeX /
          rect.width) *
        100;

      setCurrentX(
        Math.max(
          14,
          Math.min(
            86,
            percentage
          )
        )
      );
    };

  /*
   * ---------------------------------------------------------
   * RENDER CLOUD
   * ---------------------------------------------------------
   */

  const renderCloudShape = (
    className = ""
  ) => {
    return (
      <div
        className={`relative ${className}`}
      >
        <div className="absolute left-[5%] bottom-0 w-[90%] h-[60%] rounded-full bg-white shadow-[0_5px_15px_rgba(100,116,139,.12)]" />

        <div className="absolute left-[22%] bottom-[25%] w-[35%] aspect-square rounded-full bg-white" />

        <div className="absolute left-[42%] bottom-[20%] w-[42%] aspect-square rounded-full bg-white" />

        <div className="absolute left-[58%] bottom-[25%] w-[25%] aspect-square rounded-full bg-white" />

        <div className="absolute left-[30%] bottom-[43%] w-[25%] aspect-square rounded-full bg-white" />

        <div className="absolute left-[8%] bottom-[12%] w-[84%] h-[25%] rounded-full bg-white/95" />
      </div>
    );
  };

  /*
   * ---------------------------------------------------------
   * UI
   * ---------------------------------------------------------
   */

  const currentSky =
    skyClasses[skyMode];

  return (
    <div className="min-h-screen bg-[#eef7ff] p-4 sm:p-8">

      <div className="max-w-5xl mx-auto">

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
                  (value) =>
                    !value
                )
              }
              className="p-2.5 rounded-full bg-white border border-sky-100 shadow-sm hover:bg-sky-50 transition"
              aria-label={
                isMuted
                  ? "Turn sound on"
                  : "Turn sound off"
              }
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-slate-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-sky-500" />
              )}
            </button>

            <div className="bg-white text-sky-700 px-3 py-1.5 rounded-full text-xs font-bold border border-sky-100 shadow-sm">
              ☁️ Cloud Stack
            </div>

          </div>

        </div>

        {/* =================================================
            GAME
        ================================================== */}

        {!isFinished ? (
          <div className="grid lg:grid-cols-[1fr_250px] gap-5">

            {/* =============================================
                MAIN ARENA
            ============================================== */}

            <div className="bg-white rounded-[2rem] shadow-xl shadow-sky-100/70 border border-sky-100 overflow-hidden">

              {/* TOP BAR */}

              <div className="p-5 sm:p-6 border-b border-sky-100">

                <div className="flex items-center justify-between">

                  <div>

                    <div className="flex items-center gap-2 mb-1">

                      <Cloud className="w-4 h-4 text-sky-400" />

                      <span className="text-[10px] uppercase tracking-[0.25em] text-sky-500 font-bold">
                        Slow Down
                      </span>

                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-slate-800">
                      Build Your Sky
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                      Place each cloud gently. Find your rhythm.
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
                        opacity: 0.5,
                      }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                      }}
                      className="text-2xl font-black text-sky-600"
                    >
                      {score}
                    </motion.p>

                  </div>

                </div>

              </div>

              {/* =========================================
                  SKY ARENA
              ========================================== */}

              <div className="p-4 sm:p-7">

                <div
                  ref={arenaRef}
                  onPointerMove={(event) => {
                    if (
                      event.pointerType !==
                      "touch"
                    ) {
                      updatePositionFromPointer(
                        event.clientX
                      );
                    }
                  }}
                  onPointerDown={(event) => {
                    if (
                      event.pointerType ===
                      "touch"
                    ) {
                      updatePositionFromPointer(
                        event.clientX
                      );
                    }
                  }}
                  className={`relative h-[430px] sm:h-[500px] rounded-[2rem] overflow-hidden border border-white/50 select-none touch-none ${currentSky.background}`}
                >

                  {/* SUN / MOON */}

                  <motion.div
                    className={`absolute top-8 right-8 w-16 h-16 sm:w-20 sm:h-20 rounded-full ${currentSky.sun}`}
                    animate={{
                      y: [
                        0,
                        -8,
                        0,
                      ],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {skyMode ===
                    "night" ? (
                      <Moon className="w-8 h-8 text-indigo-500/50 absolute inset-0 m-auto" />
                    ) : (
                      <Sun className="w-8 h-8 text-orange-400/50 absolute inset-0 m-auto" />
                    )}
                  </motion.div>

                  {/* STARS */}

                  {currentSky.stars &&
                    stars.map(
                      (
                        star,
                        index
                      ) => (
                        <motion.div
                          key={index}
                          className="absolute"
                          style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                          }}
                          animate={{
                            opacity: [
                              0.2,
                              1,
                              0.25,
                            ],
                            scale: [
                              0.8,
                              1.15,
                              0.8,
                            ],
                          }}
                          transition={{
                            duration: 2.5,
                            delay: star.delay,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <Star className="w-2.5 h-2.5 text-white fill-white/70" />
                        </motion.div>
                      )
                    )}

                  {/* FLOATING BACKGROUND CLOUDS */}

                  <motion.div
                    className="absolute left-[5%] top-[15%] w-28 h-14 opacity-40"
                    animate={{
                      x: [
                        0,
                        30,
                        0,
                      ],
                    }}
                    transition={{
                      duration: 18,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {renderCloudShape()}
                  </motion.div>

                  <motion.div
                    className="absolute right-[2%] top-[32%] w-36 h-16 opacity-30"
                    animate={{
                      x: [
                        0,
                        -35,
                        0,
                      ],
                    }}
                    transition={{
                      duration: 21,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {renderCloudShape()}
                  </motion.div>

                  {/* HORIZON HAZE */}

                  <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white/30 to-transparent pointer-events-none" />

                  {/* GROUND */}

                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/20" />

                  {/* EXISTING STACK */}

                  <AnimatePresence>
                    {clouds.map(
                      (cloud) => (
                        <motion.div
                          key={cloud.id}
                          initial={{
                            y: -200,
                            opacity: 0,
                            scale: 0.75,
                          }}
                          animate={{
                            y: 0,
                            opacity: cloud.opacity,
                            scale: 1,
                            rotate:
                              cloud.rotation,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 120,
                            damping: 16,
                          }}
                          className="absolute pointer-events-none"
                          style={{
                            width: `${cloud.width}px`,
                            height: `${cloud.height}px`,
                            left: `calc(${cloud.x}% - ${cloud.width / 2}px)`,
                            bottom: `${
                              15 +
                              clouds.indexOf(
                                cloud
                              ) *
                                38
                            }px`,
                          }}
                        >
                          {renderCloudShape(
                            "w-full h-full"
                          )}

                          {cloud.perfect && (
                            <motion.div
                              initial={{
                                opacity: 0,
                              }}
                              animate={{
                                opacity: [
                                  0,
                                  1,
                                  0,
                                ],
                              }}
                              transition={{
                                duration: 1,
                              }}
                              className="absolute inset-0 rounded-full bg-white/20"
                            />
                          )}
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>

                  {/* CURRENT MOVING CLOUD */}

                  {!isDropping && (
                    <motion.div
                      className="absolute pointer-events-none"
                      style={{
                        width: `${Math.max(
                          105,
                          BASE_WIDTH -
                            clouds.length *
                              5
                        )}px`,
                        height: `${CLOUD_HEIGHT}px`,
                        left: `calc(${currentX}% - ${Math.max(
                          105,
                          BASE_WIDTH -
                            clouds.length *
                              5
                        ) / 2}px)`,
                        top: "28px",
                      }}
                      animate={{
                        y: [
                          0,
                          -5,
                          0,
                        ],
                      }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {renderCloudShape(
                        "w-full h-full drop-shadow-[0_8px_8px_rgba(100,116,139,.15)]"
                      )}
                    </motion.div>
                  )}

                  {/* PERFECT MESSAGE */}

                  <AnimatePresence>
                    {showPerfect && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 15,
                          scale: 0.8,
                        }}
                        animate={{
                          opacity: 1,
                          y: -5,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          y: -25,
                        }}
                        className="absolute top-24 left-1/2 -translate-x-1/2 pointer-events-none z-30"
                      >
                        <div className="px-5 py-2 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-white text-sky-600 text-sm font-black flex items-center gap-2">

                          <Sparkles className="w-4 h-4" />

                          Perfect Stack!

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* INSTRUCTIONS */}

                  <AnimatePresence>
                    {showInstructions && (
                      <motion.div
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: 1,
                        }}
                        exit={{
                          opacity: 0,
                        }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      >
                        <div className="text-center bg-white/50 backdrop-blur-sm px-6 py-5 rounded-3xl border border-white/70 shadow-lg">

                          <Wind className="w-7 h-7 text-sky-500 mx-auto mb-2" />

                          <p className="text-sm font-bold text-slate-700">
                            Move the cloud
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            Tap anywhere or press Space
                          </p>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* CLICK AREA */}

                  <button
                    aria-label="Drop cloud"
                    onClick={dropCloud}
                    className="absolute inset-0 w-full h-full cursor-pointer bg-transparent"
                  />

                </div>

                {/* CONTROL */}

                <div className="text-center mt-5">

                  <motion.button
                    whileTap={{
                      scale: 0.94,
                    }}
                    onClick={dropCloud}
                    disabled={isDropping}
                    className="relative px-7 py-3.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-60 text-white font-black rounded-2xl shadow-lg shadow-sky-200 transition overflow-hidden"
                  >

                    <span className="relative z-10 flex items-center gap-2">

                      <Cloud className="w-5 h-5 fill-white/20" />

                      Place Cloud

                    </span>

                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      animate={{
                        x: [
                          "-100%",
                          "100%",
                        ],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                  </motion.button>

                  <p className="text-[10px] text-slate-400 mt-3">
                    Tap gently • Spacebar also works
                  </p>

                </div>

              </div>

            </div>

            {/* =============================================
                SIDE PANEL
            ============================================== */}

            <div className="space-y-4">

              {/* PROGRESS */}

              <div className="bg-white rounded-3xl border border-sky-100 shadow-sm p-5">

                <div className="flex justify-between items-center mb-3">

                  <div>

                    <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                      Sky Height
                    </p>

                    <p className="text-3xl font-black text-sky-600">
                      {clouds.length}
                      <span className="text-lg text-slate-300">
                        /{TARGET_CLOUDS}
                      </span>
                    </p>

                  </div>

                  <Cloud className="w-8 h-8 text-sky-300" />

                </div>

                <div className="h-2 rounded-full bg-sky-50 overflow-hidden">

                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-400"
                    animate={{
                      width: `${
                        (clouds.length /
                          TARGET_CLOUDS) *
                        100
                      }%`,
                    }}
                  />

                </div>

              </div>

              {/* SCORE */}

              <div className="bg-white rounded-3xl border border-sky-100 shadow-sm p-5">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                      Mind Score
                    </p>

                    <p className="text-3xl font-black text-slate-700 mt-1">
                      {score}
                    </p>

                  </div>

                  <Sparkles className="w-7 h-7 text-amber-400" />

                </div>

              </div>

              {/* COMBO */}

              <div className="bg-white rounded-3xl border border-sky-100 shadow-sm p-5">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                      Perfect Combo
                    </p>

                    <p className="text-3xl font-black text-indigo-500 mt-1">
                      {combo}
                    </p>

                  </div>

                  <div className="text-2xl">
                    ✨
                  </div>

                </div>

              </div>

              {/* PERFECT STACKS */}

              <div className="bg-white rounded-3xl border border-sky-100 shadow-sm p-5">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">

                    <Star className="w-5 h-5 text-amber-400 fill-amber-200" />

                  </div>

                  <div>

                    <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                      Perfect Clouds
                    </p>

                    <p className="font-black text-slate-700">
                      {perfectStacks}
                    </p>

                  </div>

                </div>

              </div>

              {/* SKY MODE */}

              <div className="bg-white rounded-3xl border border-sky-100 shadow-sm p-5">

                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-3">
                  Sky Mood
                </p>

                <div className="flex gap-2">

                  <button
                    onClick={() =>
                      setSkyMode("day")
                    }
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                      skyMode ===
                      "day"
                        ? "bg-sky-100 text-sky-600"
                        : "bg-slate-50 text-slate-400"
                    }`}
                  >
                    ☀️
                  </button>

                  <button
                    onClick={() =>
                      setSkyMode(
                        "sunset"
                      )
                    }
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                      skyMode ===
                      "sunset"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-slate-50 text-slate-400"
                    }`}
                  >
                    🌅
                  </button>

                  <button
                    onClick={() =>
                      setSkyMode("night")
                    }
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                      skyMode ===
                      "night"
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-slate-50 text-slate-400"
                    }`}
                  >
                    🌙
                  </button>

                </div>

              </div>

              {/* RESET */}

              <button
                onClick={resetGame}
                className="w-full py-3 rounded-2xl bg-white border border-sky-100 text-slate-500 hover:text-sky-600 hover:bg-sky-50 font-bold text-xs transition flex items-center justify-center gap-2"
              >

                <RotateCcw className="w-3.5 h-3.5" />

                Start New Sky

              </button>

            </div>

          </div>
        ) : (

          /* =================================================
             COMPLETION
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
              className="w-full max-w-xl bg-white rounded-[2rem] border border-sky-100 shadow-2xl shadow-sky-100/70 p-8 sm:p-12 text-center"
            >

              {/* TROPHY */}

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
                  className="absolute inset-0 rounded-full bg-sky-300/20 blur-xl"
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

                <div className="relative w-full h-full rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center">

                  <Trophy className="w-10 h-10 text-sky-500" />

                </div>

              </motion.div>

              {/* TITLE */}

              <div className="flex justify-center items-center gap-2 mt-7">

                <Sparkles className="w-4 h-4 text-amber-400" />

                <span className="text-[10px] uppercase tracking-[0.3em] text-sky-500 font-black">
                  Peaceful Sky Created
                </span>

                <Sparkles className="w-4 h-4 text-amber-400" />

              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mt-3">
                Sky Sanctuary Built! ☁️
              </h2>

              <p className="text-slate-500 text-sm max-w-sm mx-auto mt-3 leading-relaxed">
                You slowly built a tower of{" "}
                {TARGET_CLOUDS} clouds.
                The sky is yours to rest in.
              </p>

              {/* RESULTS */}

              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mt-7">

                <div className="bg-sky-50 rounded-2xl p-4">

                  <p className="text-[8px] uppercase tracking-widest text-sky-500 font-bold">
                    Score
                  </p>

                  <p className="text-2xl font-black text-sky-700 mt-1">
                    {score}
                  </p>

                </div>

                <div className="bg-indigo-50 rounded-2xl p-4">

                  <p className="text-[8px] uppercase tracking-widest text-indigo-500 font-bold">
                    Perfect
                  </p>

                  <p className="text-2xl font-black text-indigo-700 mt-1">
                    {perfectStacks}
                  </p>

                </div>

                <div className="bg-amber-50 rounded-2xl p-4">

                  <p className="text-[8px] uppercase tracking-widest text-amber-500 font-bold">
                    Combo
                  </p>

                  <p className="text-2xl font-black text-amber-700 mt-1">
                    {combo}
                  </p>

                </div>

              </div>

              {/* XP */}

              <div className="inline-flex items-center gap-2 mt-7 px-5 py-3 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700 text-sm font-black">

                <Sparkles className="w-4 h-4" />

                +15 Mind Points Earned!

              </div>

              {/* BUTTONS */}

              <div className="flex justify-center gap-3 mt-7">

                <button
                  onClick={
                    resetGame
                  }
                  className="px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-600 text-sm font-bold flex items-center gap-2 transition"
                >

                  <RotateCcw className="w-4 h-4" />

                  Build Again

                </button>

                <button
                  onClick={onBack}
                  className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold shadow-lg shadow-sky-200 transition"
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