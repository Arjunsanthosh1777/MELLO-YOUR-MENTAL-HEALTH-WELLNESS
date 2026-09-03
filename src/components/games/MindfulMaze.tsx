import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Trophy,
  Sparkles,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  RotateCcw,
  Moon,
  Wind,
  Clock,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useApp } from "../../context/AppContext";

interface Position {
  r: number;
  c: number;
}

interface Cell {
  r: number;
  c: number;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
}

interface Firefly {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

const ROWS = 9;
const COLS = 9;

const DIRECTIONS = [
  {
    dr: -1,
    dc: 0,
    wall: "top" as const,
    opposite: "bottom" as const,
  },
  {
    dr: 0,
    dc: 1,
    wall: "right" as const,
    opposite: "left" as const,
  },
  {
    dr: 1,
    dc: 0,
    wall: "bottom" as const,
    opposite: "top" as const,
  },
  {
    dr: 0,
    dc: -1,
    wall: "left" as const,
    opposite: "right" as const,
  },
];

export const MindfulMaze: React.FC<{
  onBack: () => void;
}> = ({ onBack }) => {
  const { earnXP } = useApp();

  const [maze, setMaze] = useState<Cell[]>([]);

  const [playerPos, setPlayerPos] =
    useState<Position>({
      r: 0,
      c: 0,
    });

  const [goalPos, setGoalPos] =
    useState<Position>({
      r: ROWS - 1,
      c: COLS - 1,
    });

  const [isFinished, setIsFinished] =
    useState(false);

  const [isMuted, setIsMuted] =
    useState(false);

  const [moves, setMoves] =
    useState(0);

  const [timeLeft, setTimeLeft] =
    useState(180);

  const [zenScore, setZenScore] =
    useState(100);

  const [level, setLevel] =
    useState(1);

  const [showHint, setShowHint] =
    useState(false);

  const audioContextRef =
    useRef<AudioContext | null>(null);

  /*
   * ---------------------------------------------------------
   * FIREFLIES
   * ---------------------------------------------------------
   */

  const fireflies: Firefly[] = [
    {
      id: 1,
      x: 10,
      y: 18,
      delay: 0,
      duration: 6,
    },
    {
      id: 2,
      x: 82,
      y: 15,
      delay: 1,
      duration: 7,
    },
    {
      id: 3,
      x: 24,
      y: 72,
      delay: 2,
      duration: 8,
    },
    {
      id: 4,
      x: 76,
      y: 70,
      delay: 1.5,
      duration: 6.5,
    },
    {
      id: 5,
      x: 48,
      y: 10,
      delay: 3,
      duration: 7,
    },
    {
      id: 6,
      x: 92,
      y: 48,
      delay: 2.5,
      duration: 8,
    },
    {
      id: 7,
      x: 18,
      y: 45,
      delay: 1,
      duration: 9,
    },
    {
      id: 8,
      x: 65,
      y: 88,
      delay: 2,
      duration: 7,
    },
  ];

  /*
   * ---------------------------------------------------------
   * SOFT ASMR SOUND
   * ---------------------------------------------------------
   */

  const playSoftTone = useCallback(
    (
      frequency: number = 440,
      duration: number = 0.08
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

        const audioContext =
          audioContextRef.current;

        if (
          audioContext.state ===
          "suspended"
        ) {
          void audioContext.resume();
        }

        const oscillator =
          audioContext.createOscillator();

        const gain =
          audioContext.createGain();

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
          frequency,
          audioContext.currentTime
        );

        gain.gain.setValueAtTime(
          0.0001,
          audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
          0.035,
          audioContext.currentTime + 0.015
        );

        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          audioContext.currentTime +
            duration
        );

        oscillator.connect(gain);
        gain.connect(
          audioContext.destination
        );

        oscillator.start();

        oscillator.stop(
          audioContext.currentTime +
            duration
        );
      } catch {
        // Sound is optional.
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

      playSoftTone(392, 0.15);

      window.setTimeout(() => {
        playSoftTone(523, 0.18);
      }, 120);

      window.setTimeout(() => {
        playSoftTone(659, 0.25);
      }, 250);
    }, [isMuted, playSoftTone]);

  /*
   * ---------------------------------------------------------
   * GENERATE MAZE
   * ---------------------------------------------------------
   */

  const generateMaze =
    useCallback(() => {
      const cells: Cell[] = [];

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          cells.push({
            r,
            c,
            walls: {
              top: true,
              right: true,
              bottom: true,
              left: true,
            },
          });
        }
      }

      const visited =
        new Set<string>();

      const getIndex = (
        r: number,
        c: number
      ) => {
        return r * COLS + c;
      };

      const carve = (
        r: number,
        c: number
      ) => {
        visited.add(`${r}-${c}`);

        const shuffled =
          [...DIRECTIONS].sort(
            () => Math.random() - 0.5
          );

        for (const direction of shuffled) {
          const nr =
            r + direction.dr;

          const nc =
            c + direction.dc;

          if (
            nr < 0 ||
            nr >= ROWS ||
            nc < 0 ||
            nc >= COLS
          ) {
            continue;
          }

          if (
            visited.has(
              `${nr}-${nc}`
            )
          ) {
            continue;
          }

          const current =
            cells[getIndex(r, c)];

          const next =
            cells[getIndex(nr, nc)];

          current.walls[
            direction.wall
          ] = false;

          next.walls[
            direction.opposite
          ] = false;

          carve(nr, nc);
        }
      };

      carve(0, 0);

      setMaze(cells);
    }, []);

  /*
   * ---------------------------------------------------------
   * START / RESET GAME
   * ---------------------------------------------------------
   */

  const startNewMaze =
    useCallback(() => {
      generateMaze();

      setPlayerPos({
        r: 0,
        c: 0,
      });

      setGoalPos({
        r: ROWS - 1,
        c: COLS - 1,
      });

      setMoves(0);
      setZenScore(100);
      setTimeLeft(180);
      setIsFinished(false);
      setShowHint(false);
    }, [generateMaze]);

  /*
   * ---------------------------------------------------------
   * INITIALIZE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    startNewMaze();
  }, [startNewMaze]);

  /*
   * ---------------------------------------------------------
   * TIMER
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (isFinished) return;

    const timer =
      window.setInterval(() => {
        setTimeLeft((previous) => {
          if (previous <= 1) {
            return 180;
          }

          return previous - 1;
        });
      }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isFinished]);

  /*
   * ---------------------------------------------------------
   * KEYBOARD CONTROLS
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (isFinished) return;

      switch (event.key) {
        case "ArrowUp":
        case "w":
        case "W":
          event.preventDefault();
          move(-1, 0);
          break;

        case "ArrowDown":
        case "s":
        case "S":
          event.preventDefault();
          move(1, 0);
          break;

        case "ArrowLeft":
        case "a":
        case "A":
          event.preventDefault();
          move(0, -1);
          break;

        case "ArrowRight":
        case "d":
        case "D":
          event.preventDefault();
          move(0, 1);
          break;

        default:
          break;
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
   * MOVE PLAYER
   * ---------------------------------------------------------
   */

  const move = (
    dr: number,
    dc: number
  ) => {
    if (
      isFinished ||
      maze.length === 0
    ) {
      return;
    }

    const currentCell =
      maze.find(
        (cell) =>
          cell.r === playerPos.r &&
          cell.c === playerPos.c
      );

    if (!currentCell) return;

    let allowed = false;

    if (dr === -1) {
      allowed =
        !currentCell.walls.top;
    }

    if (dr === 1) {
      allowed =
        !currentCell.walls.bottom;
    }

    if (dc === -1) {
      allowed =
        !currentCell.walls.left;
    }

    if (dc === 1) {
      allowed =
        !currentCell.walls.right;
    }

    /*
     * Hit a wall
     */

    if (!allowed) {
      playSoftTone(110, 0.06);

      setZenScore(
        (score) =>
          Math.max(
            0,
            score - 0.5
          )
      );

      return;
    }

    const nr =
      playerPos.r + dr;

    const nc =
      playerPos.c + dc;

    setPlayerPos({
      r: nr,
      c: nc,
    });

    setMoves(
      (previous) =>
        previous + 1
    );

    /*
     * Soft musical movement tones
     */

    const tone =
      220 +
      ((nr + nc) % 5) * 35;

    playSoftTone(
      tone,
      0.07
    );

    /*
     * Reaching goal
     */

    if (
      nr === goalPos.r &&
      nc === goalPos.c
    ) {
      window.setTimeout(() => {
        handleFinish();
      }, 350);
    }
  };

  /*
   * ---------------------------------------------------------
   * FINISH
   * ---------------------------------------------------------
   */

  const handleFinish = () => {
    if (isFinished) return;

    setIsFinished(true);

    playSuccessSound();

    confetti({
      particleCount: 65,
      spread: 55,
      startVelocity: 15,
      gravity: 0.45,
      scalar: 0.7,
      origin: {
        y: 0.55,
      },
    });

    const bonus =
      Math.floor(
        zenScore / 10
      );

    earnXP(
      15 + bonus,
      "Mindful Maze completion"
    );
  };

  /*
   * ---------------------------------------------------------
   * FORMAT TIMER
   * ---------------------------------------------------------
   */

  const formatTime = (
    seconds: number
  ) => {
    const minutes =
      Math.floor(seconds / 60);

    const remaining =
      seconds % 60;

    return `${minutes}:${remaining
      .toString()
      .padStart(2, "0")}`;
  };

  /*
   * ---------------------------------------------------------
   * UI
   * ---------------------------------------------------------
   */

  return (
    <div className="min-h-screen bg-[#080B16] text-white p-4 sm:p-8 overflow-hidden relative">

      {/* =====================================================
          AMBIENT BACKGROUND
      ====================================================== */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        <div className="absolute w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] -top-40 -left-40" />

        <div className="absolute w-[450px] h-[450px] rounded-full bg-purple-500/10 blur-[120px] bottom-[-200px] right-[-100px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,100,255,0.06),transparent_55%)]" />

      </div>

      {/* =====================================================
          FIREFLIES
      ====================================================== */}

      {fireflies.map(
        (firefly) => (
          <motion.div
            key={firefly.id}
            className="absolute w-1.5 h-1.5 rounded-full bg-indigo-200 shadow-[0_0_15px_4px_rgba(165,180,252,0.5)] pointer-events-none"
            style={{
              left: `${firefly.x}%`,
              top: `${firefly.y}%`,
            }}
            animate={{
              opacity: [
                0.1,
                0.8,
                0.2,
                0.7,
                0.1,
              ],
              y: [
                -10,
                10,
                -5,
              ],
              x: [
                -5,
                8,
                -3,
              ],
            }}
            transition={{
              duration:
                firefly.duration,
              delay:
                firefly.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )
      )}

      <div className="relative max-w-5xl mx-auto">

        {/* =================================================
            HEADER
        ================================================== */}

        <div className="flex items-center justify-between mb-5">

          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />

            Back to Games
          </button>

          <div className="flex items-center gap-2">

            {/* Timer */}

            <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-xl rounded-full px-4 py-2">

              <Clock className="w-4 h-4 text-indigo-300" />

              <span className="text-sm font-bold text-slate-200">
                {formatTime(
                  timeLeft
                )}
              </span>

            </div>

            {/* Sound */}

            <button
              onClick={() =>
                setIsMuted(
                  (value) =>
                    !value
                )
              }
              className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition"
              aria-label={
                isMuted
                  ? "Unmute sounds"
                  : "Mute sounds"
              }
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-slate-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-indigo-300" />
              )}
            </button>

            {/* Badge */}

            <div className="bg-indigo-500/10 text-indigo-200 px-3 py-1.5 rounded-full text-xs font-bold border border-indigo-400/10">
              🌀 Mindful Maze
            </div>

          </div>

        </div>

        {/* =================================================
            GAME
        ================================================== */}

        {!isFinished ? (
          <div className="grid lg:grid-cols-[1fr_260px] gap-5">

            {/* =============================================
                MAIN GAME
            ============================================== */}

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] backdrop-blur-2xl shadow-2xl overflow-hidden">

              {/* Title */}

              <div className="p-5 sm:p-7 border-b border-white/10">

                <div className="flex items-center justify-between">

                  <div>

                    <div className="flex items-center gap-2 mb-2">

                      <Moon className="w-4 h-4 text-indigo-300" />

                      <span className="text-[10px] uppercase tracking-[0.25em] text-indigo-300 font-bold">
                        Quiet Focus
                      </span>

                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                      Find Your Stillness
                    </h1>

                    <p className="text-sm text-slate-400 mt-1">
                      Move slowly. Listen to the space.
                    </p>

                  </div>

                  <div className="hidden sm:block text-right">

                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                      Zen
                    </p>

                    <p className="text-2xl font-black text-indigo-200">
                      {Math.round(
                        zenScore
                      )}
                    </p>

                  </div>

                </div>

              </div>

              {/* =========================================
                  MAZE
              ========================================== */}

              <div className="p-4 sm:p-8">

                <div
                  className="relative mx-auto max-w-[620px] aspect-square rounded-[2rem] p-3 sm:p-5 overflow-hidden"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(83,78,130,.28), rgba(10,13,27,.95))",
                    boxShadow:
                      "inset 0 0 80px rgba(99,102,241,.08), 0 30px 80px rgba(0,0,0,.35)",
                  }}
                >

                  {/* Breathing aura */}

                  <motion.div
                    className="absolute inset-[18%] rounded-full bg-indigo-400/[0.035] blur-3xl pointer-events-none"
                    animate={{
                      scale: [
                        0.92,
                        1.08,
                        0.92,
                      ],
                      opacity: [
                        0.25,
                        0.6,
                        0.25,
                      ],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Maze */}

                  <div
                    className="relative grid w-full h-full"
                    style={{
                      gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                      gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                    }}
                  >

                    {maze.map(
                      (cell) => {

                        const isPlayer =
                          cell.r ===
                            playerPos.r &&
                          cell.c ===
                            playerPos.c;

                        const isGoal =
                          cell.r ===
                            goalPos.r &&
                          cell.c ===
                            goalPos.c;

                        return (
                          <div
                            key={`${cell.r}-${cell.c}`}
                            className="relative"
                          >

                            {/* TOP WALL */}

                            {cell.walls
                              .top && (
                              <div className="absolute top-0 left-0 right-0 h-[2px] bg-indigo-200/20 shadow-[0_0_5px_rgba(129,140,248,.08)]" />
                            )}

                            {/* RIGHT WALL */}

                            {cell.walls
                              .right && (
                              <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-indigo-200/20" />
                            )}

                            {/* BOTTOM WALL */}

                            {cell.walls
                              .bottom && (
                              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-200/20" />
                            )}

                            {/* LEFT WALL */}

                            {cell.walls
                              .left && (
                              <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-indigo-200/20" />
                            )}

                            {/* GOAL */}

                            {isGoal && (
                              <motion.div
                                className="absolute inset-0 flex items-center justify-center"
                                animate={{
                                  opacity: [
                                    0.45,
                                    1,
                                    0.45,
                                  ],
                                }}
                                transition={{
                                  duration: 2.5,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              >

                                <div className="absolute w-8 h-8 rounded-full bg-violet-400/10 blur-md" />

                                <Sparkles className="w-5 h-5 text-violet-300 drop-shadow-[0_0_10px_rgba(196,181,253,.8)]" />

                              </motion.div>
                            )}

                            {/* PLAYER */}

                            {isPlayer && (
                              <motion.div
                                layoutId="mindful-player"
                                className="absolute inset-0 flex items-center justify-center z-20"
                                transition={{
                                  type: "spring",
                                  stiffness: 280,
                                  damping: 24,
                                }}
                              >

                                {/* Outer glow */}

                                <motion.div
                                  className="absolute w-10 h-10 rounded-full bg-indigo-400/10 blur-md"
                                  animate={{
                                    scale: [
                                      0.8,
                                      1.35,
                                      0.8,
                                    ],
                                    opacity: [
                                      0.35,
                                      0.8,
                                      0.35,
                                    ],
                                  }}
                                  transition={{
                                    duration: 2.8,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                  }}
                                />

                                {/* Orb */}

                                <motion.div
                                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-white via-indigo-200 to-indigo-500 shadow-[0_0_18px_5px_rgba(129,140,248,.65)]"
                                  animate={{
                                    scale: [
                                      0.9,
                                      1.08,
                                      0.9,
                                    ],
                                  }}
                                  transition={{
                                    duration: 2.8,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                  }}
                                />

                              </motion.div>
                            )}

                          </div>
                        );
                      }
                    )}

                  </div>

                </div>

                {/* Mobile timer */}

                <div className="sm:hidden flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">

                  <Clock className="w-3.5 h-3.5" />

                  {formatTime(
                    timeLeft
                  )}

                  <span>•</span>

                  {moves} moves

                </div>

                {/* Instructions */}

                <div className="flex items-center justify-center gap-2 mt-5 text-xs text-slate-500">

                  <Wind className="w-4 h-4 text-indigo-300" />

                  Use the buttons, arrow keys, or WASD.

                </div>

              </div>

            </div>

            {/* =============================================
                SIDE PANEL
            ============================================== */}

            <div className="space-y-4">

              {/* Zen Score */}

              <div className="rounded-[1.75rem] bg-white/[0.035] border border-white/10 backdrop-blur-xl p-5">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">
                      Zen Score
                    </p>

                    <p className="text-4xl font-black text-indigo-200 mt-1">
                      {Math.round(
                        zenScore
                      )}
                    </p>

                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">

                    <Sparkles className="w-6 h-6 text-indigo-300" />

                  </div>

                </div>

                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mt-5">

                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400"
                    animate={{
                      width: `${Math.max(
                        0,
                        Math.min(
                          100,
                          zenScore
                        )
                      )}%`,
                    }}
                    transition={{
                      duration: 0.4,
                    }}
                  />

                </div>

              </div>

              {/* Controls */}

              <div className="rounded-[1.75rem] bg-white/[0.035] border border-white/10 backdrop-blur-xl p-5">

                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-4 text-center">
                  Gentle Controls
                </p>

                <div className="flex flex-col items-center gap-2">

                  <button
                    onClick={() =>
                      move(-1, 0)
                    }
                    className="w-14 h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-indigo-500/15 active:scale-95 transition flex items-center justify-center"
                  >
                    <ChevronUp className="w-5 h-5 text-indigo-200" />
                  </button>

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        move(0, -1)
                      }
                      className="w-14 h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-indigo-500/15 active:scale-95 transition flex items-center justify-center"
                    >
                      <ChevronLeft className="w-5 h-5 text-indigo-200" />
                    </button>

                    <button
                      onClick={() =>
                        move(1, 0)
                      }
                      className="w-14 h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-indigo-500/15 active:scale-95 transition flex items-center justify-center"
                    >
                      <ChevronDown className="w-5 h-5 text-indigo-200" />
                    </button>

                    <button
                      onClick={() =>
                        move(0, 1)
                      }
                      className="w-14 h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-indigo-500/15 active:scale-95 transition flex items-center justify-center"
                    >
                      <ChevronRight className="w-5 h-5 text-indigo-200" />
                    </button>

                  </div>

                </div>

              </div>

              {/* Stats */}

              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-2xl bg-white/[0.035] border border-white/10 p-4">

                  <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
                    Moves
                  </p>

                  <p className="text-xl font-black text-slate-200 mt-1">
                    {moves}
                  </p>

                </div>

                <div className="rounded-2xl bg-white/[0.035] border border-white/10 p-4">

                  <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
                    Level
                  </p>

                  <p className="text-xl font-black text-slate-200 mt-1">
                    {level}
                  </p>

                </div>

              </div>

              {/* Hint */}

              <button
                onClick={() =>
                  setShowHint(
                    (value) =>
                      !value
                  )
                }
                className="w-full rounded-2xl bg-indigo-500/10 border border-indigo-400/10 px-4 py-3 text-xs text-indigo-200 hover:bg-indigo-500/15 transition"
              >
                {showHint
                  ? "✨ Follow the glowing destination."
                  : "Need a gentle hint?"}
              </button>

              {/* New maze */}

              <button
                onClick={
                  startNewMaze
                }
                className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-white/10 transition flex items-center justify-center gap-2"
              >

                <RotateCcw className="w-3.5 h-3.5" />

                New Quiet Maze

              </button>

            </div>

          </div>
        ) : (

          /* =================================================
             COMPLETION SCREEN
          ================================================== */

          <div className="min-h-[70vh] flex items-center justify-center">

            <div className="w-full max-w-xl text-center rounded-[2rem] border border-indigo-300/10 bg-white/[0.035] backdrop-blur-2xl shadow-2xl p-8 sm:p-12">

              {/* Trophy */}

              <motion.div
                initial={{
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 15,
                }}
                className="relative w-24 h-24 mx-auto"
              >

                <motion.div
                  className="absolute inset-0 rounded-full bg-indigo-400/10 blur-xl"
                  animate={{
                    scale: [
                      0.8,
                      1.25,
                      0.8,
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />

                <div className="relative w-full h-full rounded-full bg-indigo-500/10 border border-indigo-300/10 flex items-center justify-center">

                  <Trophy className="w-10 h-10 text-indigo-200" />

                </div>

              </motion.div>

              {/* Content */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.3,
                }}
              >

                <div className="flex items-center justify-center gap-2 mt-7">

                  <Sparkles className="w-4 h-4 text-indigo-300" />

                  <span className="text-[10px] uppercase tracking-[0.3em] text-indigo-300 font-bold">
                    Stillness Found
                  </span>

                  <Sparkles className="w-4 h-4 text-indigo-300" />

                </div>

                <h2 className="text-3xl sm:text-4xl font-black mt-3">
                  You Found Your Way
                </h2>

                <p className="text-slate-400 text-sm max-w-sm mx-auto mt-3 leading-relaxed">
                  You moved through the maze
                  without rushing. Take one slow
                  breath before leaving.
                </p>

                {/* Results */}

                <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mt-7">

                  <div className="rounded-2xl bg-indigo-500/10 border border-indigo-300/10 p-4">

                    <p className="text-[9px] uppercase tracking-widest text-indigo-300 font-bold">
                      Zen Score
                    </p>

                    <p className="text-3xl font-black text-indigo-100 mt-1">
                      {Math.round(
                        zenScore
                      )}
                    </p>

                  </div>

                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">

                    <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
                      Moves
                    </p>

                    <p className="text-3xl font-black text-slate-200 mt-1">
                      {moves}
                    </p>

                  </div>

                </div>

                {/* XP */}

                <div className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-2xl bg-indigo-500/10 border border-indigo-300/10 text-indigo-200 text-sm font-bold">

                  <Sparkles className="w-4 h-4" />

                  +15 Mind Points

                </div>

                {/* Buttons */}

                <div className="flex justify-center gap-3 mt-7">

                  <button
                    onClick={
                      startNewMaze
                    }
                    className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 text-sm font-bold flex items-center gap-2 transition"
                  >

                    <RotateCcw className="w-4 h-4" />

                    Another Maze

                  </button>

                  <button
                    onClick={onBack}
                    className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 transition"
                  >
                    Done
                  </button>

                </div>

              </motion.div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};