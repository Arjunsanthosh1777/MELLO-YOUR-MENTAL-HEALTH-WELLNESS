import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Trophy,
  Sparkles,
  Heart,
  Plus,
  Volume2,
  VolumeX,
  RotateCcw,
  Flower2,
  Sprout,
  Sun,
  Leaf,
  Wind,
  Droplets,
  Moon,
  Star,
  CloudSun,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useApp } from "../../context/AppContext";

interface PlantedFlower {
  id: string;
  gratitude: string;
  type: string;
  name: string;
  date: string;
  growth: number;
  watered: boolean;
}

interface Firefly {
  id: number;
  left: number;
  top: number;
  delay: number;
}

const FLOWERS = [
  {
    emoji: "🌻",
    name: "Sunflower",
    color: "from-yellow-300 to-amber-400",
  },
  {
    emoji: "🌷",
    name: "Tulip",
    color: "from-pink-300 to-rose-400",
  },
  {
    emoji: "🌸",
    name: "Cherry Blossom",
    color: "from-pink-200 to-fuchsia-300",
  },
  {
    emoji: "🌺",
    name: "Hibiscus",
    color: "from-red-300 to-pink-400",
  },
  {
    emoji: "🌼",
    name: "Daisy",
    color: "from-yellow-200 to-lime-300",
  },
  {
    emoji: "🌹",
    name: "Rose",
    color: "from-red-300 to-rose-500",
  },
];

const STORAGE_KEY = "gratitude-garden-v2";

export const GratitudeGarden: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const { earnXP, addJournal } = useApp();

  const [gratitudeText, setGratitudeText] = useState("");
  const [flowers, setFlowers] = useState<PlantedFlower[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isNight, setIsNight] = useState(false);
  const [waterDrops, setWaterDrops] = useState<number[]>([]);
  const [showTip, setShowTip] = useState(true);

  const audioContextRef = useRef<AudioContext | null>(null);

  /* --------------------------------
     FIREPLIES
  -------------------------------- */

  const fireflies = useMemo<Firefly[]>(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: Math.random() * 92 + 4,
        top: Math.random() * 60 + 10,
        delay: Math.random() * 4,
      })),
    []
  );

  /* --------------------------------
     LOAD SAVED GARDEN
  -------------------------------- */

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setFlowers(parsed);
        }
      }
    } catch (error) {
      console.warn("Could not load gratitude garden:", error);
    }
  }, []);

  /* --------------------------------
     SAVE GARDEN
  -------------------------------- */

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(flowers));
    } catch (error) {
      console.warn("Could not save gratitude garden:", error);
    }
  }, [flowers]);

  /* --------------------------------
     AUDIO
  -------------------------------- */

  const playSoftSound = (
    frequency = 520,
    duration = 0.12,
    volume = 0.025
  ) => {
    if (!soundEnabled) return;

    try {
      const AudioContextClass =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;

      if (!AudioContextClass) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }

      const ctx = audioContextRef.current;

      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);

      gain.gain.exponentialRampToValueAtTime(
        volume,
        ctx.currentTime + 0.02
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + duration
      );

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + duration + 0.02);
    } catch (error) {
      console.warn("Audio unavailable:", error);
    }
  };

  /* --------------------------------
     PLANT FLOWER
  -------------------------------- */

  const plantFlower = (e: React.FormEvent) => {
    e.preventDefault();

    const text = gratitudeText.trim();

    if (!text) return;

    const selected =
      FLOWERS[Math.floor(Math.random() * FLOWERS.length)];

    const newFlower: PlantedFlower = {
      id: Date.now().toString(),
      gratitude: text,
      type: selected.emoji,
      name: selected.name,
      date: "Just now",
      growth: 25,
      watered: false,
    };

    setFlowers((prev) => [newFlower, ...prev]);

    addJournal(
      "Gratitude Seed",
      text,
      "good",
      ["Gratitude"],
      "What was one good thing today?"
    );

    setGratitudeText("");
    setShowTip(false);

    playSoftSound(420, 0.2, 0.035);

    setTimeout(() => {
      playSoftSound(620, 0.25, 0.025);
    }, 120);

    earnXP(20, "Gratitude Garden planting");
  };

  /* --------------------------------
     WATER FLOWER
  -------------------------------- */

  const waterFlower = (id: string) => {
    playSoftSound(700, 0.18, 0.03);

    const drops = Array.from({ length: 6 }, (_, i) => Date.now() + i);

    setWaterDrops(drops);

    setTimeout(() => {
      setWaterDrops([]);
    }, 800);

    setFlowers((prev) =>
      prev.map((flower) =>
        flower.id === id
          ? {
              ...flower,
              growth: Math.min(flower.growth + 25, 100),
              watered: true,
            }
          : flower
      )
    );
  };

  /* --------------------------------
     CLICK FLOWER
  -------------------------------- */

  const interactWithFlower = (flower: PlantedFlower) => {
    playSoftSound(520, 0.15, 0.025);

    setFlowers((prev) =>
      prev.map((item) =>
        item.id === flower.id
          ? {
              ...item,
              growth: Math.min(item.growth + 5, 100),
            }
          : item
      )
    );
  };

  /* --------------------------------
     FINISH
  -------------------------------- */

  const finishGarden = () => {
    if (flowers.length === 0) return;

    setIsFinished(true);

    playSoftSound(780, 0.35, 0.04);

    confetti({
      particleCount: 90,
      spread: 75,
      startVelocity: 20,
      origin: {
        y: 0.6,
      },
    });
  };

  /* --------------------------------
     RESET
  -------------------------------- */

  const resetGarden = () => {
    setFlowers([]);
    setIsFinished(false);
    setGratitudeText("");
    localStorage.removeItem(STORAGE_KEY);

    playSoftSound(300, 0.15, 0.025);
  };

  /* --------------------------------
     STATS
  -------------------------------- */

  const averageGrowth =
    flowers.length > 0
      ? Math.round(
          flowers.reduce((sum, flower) => sum + flower.growth, 0) /
            flowers.length
        )
      : 0;

  const fullyGrown = flowers.filter(
    (flower) => flower.growth >= 100
  ).length;

  /* --------------------------------
     FLOWER STAGE
  -------------------------------- */

  const getFlowerStage = (growth: number) => {
    if (growth < 35) return "🌱";
    if (growth < 70) return "🌿";
    if (growth < 100) return "🌷";

    return "🌸";
  };

  return (
    <div
      className={`relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border shadow-2xl transition-all duration-1000 ${
        isNight
          ? "border-indigo-200/20 bg-slate-950"
          : "border-yellow-100 bg-white"
      }`}
    >
      {/* --------------------------------
          AMBIENT BACKGROUND
      -------------------------------- */}

      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-1000 ${
          isNight
            ? "bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950"
            : "bg-gradient-to-br from-yellow-50 via-white to-emerald-50"
        }`}
      />

      {/* Soft glow */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-yellow-200 blur-3xl"
      />

      {/* Fireflies */}
      {isNight &&
        fireflies.map((fly) => (
          <motion.div
            key={fly.id}
            className="absolute h-1.5 w-1.5 rounded-full bg-yellow-200 shadow-[0_0_12px_rgba(253,224,71,0.9)]"
            style={{
              left: `${fly.left}%`,
              top: `${fly.top}%`,
            }}
            animate={{
              opacity: [0.1, 1, 0.1],
              scale: [0.7, 1.4, 0.7],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3 + fly.delay,
              repeat: Infinity,
              delay: fly.delay,
              ease: "easeInOut",
            }}
          />
        ))}

      {/* --------------------------------
          HEADER
      -------------------------------- */}

      <div className="relative z-10 flex items-center justify-between p-4 sm:p-6">
        <button
          onClick={onBack}
          className={`flex items-center gap-1.5 text-sm font-semibold transition ${
            isNight
              ? "text-slate-300 hover:text-white"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Games
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSoundEnabled((prev) => !prev);
              if (!soundEnabled) {
                setTimeout(() => playSoftSound(600, 0.15, 0.02), 50);
              }
            }}
            className={`rounded-full border p-2 transition ${
              isNight
                ? "border-white/10 bg-white/10 text-white"
                : "border-yellow-100 bg-yellow-50 text-yellow-700"
            }`}
            title="Toggle ambient sound"
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>

          <button
            onClick={() => setIsNight((prev) => !prev)}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
              isNight
                ? "border-indigo-300/20 bg-indigo-400/10 text-indigo-200"
                : "border-yellow-100 bg-yellow-50 text-yellow-800"
            }`}
          >
            {isNight ? (
              <>
                <Moon className="mr-1 inline h-3.5 w-3.5" />
                Night
              </>
            ) : (
              <>
                <Sun className="mr-1 inline h-3.5 w-3.5" />
                Day
              </>
            )}
          </button>
        </div>
      </div>

      {/* --------------------------------
          TITLE
      -------------------------------- */}

      {!isFinished && (
        <div className="relative z-10 px-5 pb-4 text-center">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mb-2 inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-800"
          >
            🌻 Gratitude Garden
          </motion.div>

          <h1
            className={`text-2xl font-bold sm:text-3xl ${
              isNight ? "text-white" : "text-slate-800"
            }`}
          >
            Grow Something Beautiful
          </h1>

          <p
            className={`mx-auto mt-2 max-w-lg text-sm ${
              isNight ? "text-slate-300" : "text-slate-500"
            }`}
          >
            Plant one small thought of gratitude and watch your
            peaceful garden slowly bloom.
          </p>
        </div>
      )}

      {/* --------------------------------
          MAIN
      -------------------------------- */}

      {!isFinished ? (
        <div className="relative z-10 space-y-5 px-4 pb-6 sm:px-6">
          {/* Garden stats */}

          <div className="grid grid-cols-3 gap-2">
            <div
              className={`rounded-2xl border p-3 text-center ${
                isNight
                  ? "border-white/10 bg-white/5"
                  : "border-yellow-100 bg-yellow-50/70"
              }`}
            >
              <Flower2
                className={`mx-auto mb-1 h-5 w-5 ${
                  isNight ? "text-pink-300" : "text-pink-500"
                }`}
              />
              <p
                className={`text-lg font-bold ${
                  isNight ? "text-white" : "text-slate-800"
                }`}
              >
                {flowers.length}
              </p>
              <p
                className={`text-[10px] ${
                  isNight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Flowers
              </p>
            </div>

            <div
              className={`rounded-2xl border p-3 text-center ${
                isNight
                  ? "border-white/10 bg-white/5"
                  : "border-emerald-100 bg-emerald-50/70"
              }`}
            >
              <Sprout className="mx-auto mb-1 h-5 w-5 text-emerald-500" />
              <p
                className={`text-lg font-bold ${
                  isNight ? "text-white" : "text-slate-800"
                }`}
              >
                {fullyGrown}
              </p>
              <p
                className={`text-[10px] ${
                  isNight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Fully Grown
              </p>
            </div>

            <div
              className={`rounded-2xl border p-3 text-center ${
                isNight
                  ? "border-white/10 bg-white/5"
                  : "border-purple-100 bg-purple-50/70"
              }`}
            >
              <Heart className="mx-auto mb-1 h-5 w-5 text-rose-500" />
              <p
                className={`text-lg font-bold ${
                  isNight ? "text-white" : "text-slate-800"
                }`}
              >
                {averageGrowth}%
              </p>
              <p
                className={`text-[10px] ${
                  isNight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Garden Health
              </p>
            </div>
          </div>

          {/* --------------------------------
              GRATITUDE INPUT
          -------------------------------- */}

          <motion.form
            onSubmit={plantFlower}
            whileHover={{ y: -1 }}
            className={`rounded-3xl border p-4 shadow-sm ${
              isNight
                ? "border-white/10 bg-white/5"
                : "border-yellow-100 bg-white/80"
            }`}
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
                <Sprout className="h-5 w-5" />
              </div>

              <div>
                <h2
                  className={`text-sm font-bold ${
                    isNight ? "text-white" : "text-slate-800"
                  }`}
                >
                  Plant a gratitude seed
                </h2>

                <p
                  className={`text-[11px] ${
                    isNight ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  What is one small thing you're thankful for?
                </p>
              </div>
            </div>

            <textarea
              value={gratitudeText}
              onChange={(e) => setGratitudeText(e.target.value)}
              placeholder="I'm grateful for..."
              rows={3}
              maxLength={250}
              className={`w-full resize-none rounded-2xl border p-4 text-sm outline-none transition focus:ring-2 focus:ring-emerald-300 ${
                isNight
                  ? "border-white/10 bg-black/20 text-white placeholder:text-slate-500"
                  : "border-yellow-100 bg-yellow-50/40 text-slate-800 placeholder:text-slate-400"
              }`}
            />

            <div className="mt-3 flex items-center justify-between">
              <span
                className={`text-[10px] ${
                  isNight ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {gratitudeText.length}/250
              </span>

              <button
                type="submit"
                disabled={!gratitudeText.trim()}
                className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
                Plant Seed
              </button>
            </div>
          </motion.form>

          {/* Tip */}

          <AnimatePresence>
            {showTip && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex items-start gap-3 rounded-2xl border p-3 ${
                  isNight
                    ? "border-indigo-300/10 bg-indigo-400/5"
                    : "border-blue-100 bg-blue-50/60"
                }`}
              >
                <CloudSun className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />

                <div>
                  <p
                    className={`text-xs font-semibold ${
                      isNight ? "text-white" : "text-slate-700"
                    }`}
                  >
                    Slow down 🌿
                  </p>

                  <p
                    className={`mt-0.5 text-[11px] ${
                      isNight ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Take one slow breath before planting your
                    gratitude.
                  </p>
                </div>

                <button
                  onClick={() => setShowTip(false)}
                  className="ml-auto text-xs text-slate-400"
                >
                  ×
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* --------------------------------
              GARDEN
          -------------------------------- */}

          <div
            className={`relative min-h-[360px] overflow-hidden rounded-[2rem] border ${
              isNight
                ? "border-indigo-300/10 bg-gradient-to-b from-indigo-950 via-indigo-900 to-emerald-950"
                : "border-emerald-100 bg-gradient-to-b from-sky-100 via-emerald-50 to-emerald-200"
            }`}
          >
            {/* Sun */}

            <motion.div
              animate={{
                y: [0, 5, 0],
                rotate: [0, 3, -3, 0],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`absolute right-7 top-6 ${
                isNight ? "opacity-0" : "opacity-100"
              }`}
            >
              <Sun className="h-14 w-14 fill-yellow-300 text-yellow-400" />
            </motion.div>

            {/* Moon */}

            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`absolute right-8 top-7 transition-opacity ${
                isNight ? "opacity-100" : "opacity-0"
              }`}
            >
              <Moon className="h-12 w-12 fill-slate-100 text-slate-200" />
            </motion.div>

            {/* Wind */}

            <motion.div
              animate={{
                x: [-10, 15, -10],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-5 top-20"
            >
              <Wind className="h-7 w-7 text-white/70" />
            </motion.div>

            {/* Ground */}

            <div
              className={`absolute bottom-0 left-0 right-0 h-24 ${
                isNight ? "bg-emerald-950/80" : "bg-emerald-300/70"
              }`}
            />

            {/* Flowers */}

            <div className="absolute bottom-8 left-0 right-0 flex flex-wrap items-end justify-center gap-4 px-5">
              <AnimatePresence>
                {flowers.map((flower) => (
                  <motion.div
                    key={flower.id}
                    layout
                    initial={{
                      scale: 0,
                      y: 40,
                      opacity: 0,
                    }}
                    animate={{
                      scale: 1,
                      y: 0,
                      opacity: 1,
                    }}
                    exit={{
                      scale: 0,
                      opacity: 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 150,
                      damping: 15,
                    }}
                    className="group relative flex w-28 flex-col items-center"
                  >
                    {/* Flower */}

                    <motion.button
                      onClick={() => interactWithFlower(flower)}
                      animate={
                        flower.growth >= 100
                          ? {
                              rotate: [-3, 3, -3],
                              scale: [1, 1.05, 1],
                            }
                          : {}
                      }
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="relative text-5xl drop-shadow-lg transition hover:scale-110"
                      title={flower.gratitude}
                    >
                      {flower.growth >= 100
                        ? flower.type
                        : getFlowerStage(flower.growth)}
                    </motion.button>

                    {/* Water */}

                    <button
                      onClick={() => waterFlower(flower.id)}
                      className="mt-1 flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 text-[9px] font-bold text-blue-600 shadow-sm backdrop-blur hover:bg-white"
                    >
                      <Droplets className="h-3 w-3" />
                      Water
                    </button>

                    {/* Growth */}

                    <div className="mt-2 h-1.5 w-20 overflow-hidden rounded-full bg-black/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${flower.growth}%`,
                        }}
                        className="h-full rounded-full bg-emerald-500"
                      />
                    </div>

                    <span className="mt-1 max-w-24 truncate text-[9px] font-medium text-slate-600">
                      {flower.name}
                    </span>

                    {/* Gratitude tooltip */}

                    <div className="pointer-events-none absolute bottom-full z-20 mb-3 hidden w-48 rounded-2xl bg-slate-900/90 p-3 text-left text-xs text-white shadow-xl group-hover:block">
                      <p className="font-semibold">
                        “{flower.gratitude}”
                      </p>

                      <p className="mt-1 text-[9px] text-slate-400">
                        {flower.growth}% grown
                      </p>
                    </div>

                    {/* Water drops */}

                    {waterDrops.map((drop) => (
                      <motion.div
                        key={drop}
                        initial={{
                          y: -40,
                          opacity: 1,
                        }}
                        animate={{
                          y: 10,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.7,
                        }}
                        className="pointer-events-none absolute top-0 text-blue-400"
                      >
                        💧
                      </motion.div>
                    ))}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty garden */}

            {flowers.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                  }}
                  className="mb-3 text-6xl"
                >
                  🌱
                </motion.div>

                <h3 className="font-bold text-slate-700">
                  Your garden is waiting
                </h3>

                <p className="mt-1 max-w-xs text-xs text-slate-500">
                  Plant your first gratitude seed above and watch
                  something beautiful grow.
                </p>
              </div>
            )}

            {/* Garden label */}

            <div className="absolute left-4 top-4 rounded-full bg-white/60 px-3 py-1.5 text-[10px] font-bold text-slate-600 shadow-sm backdrop-blur">
              🌿 Peaceful Sanctuary
            </div>
          </div>

          {/* --------------------------------
              CONTROLS
          -------------------------------- */}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              className={`flex items-center gap-2 text-xs ${
                isNight ? "text-slate-400" : "text-slate-500"
              }`}
            >
              <Leaf className="h-4 w-4 text-emerald-500" />
              {flowers.length === 0
                ? "Your first flower is waiting."
                : `${fullyGrown} flowers have fully bloomed.`}
            </div>

            <div className="flex gap-2">
              <button
                onClick={resetGarden}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  isNight
                    ? "bg-white/10 text-slate-300 hover:bg-white/15"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>

              <button
                onClick={finishGarden}
                disabled={flowers.length === 0}
                className="flex items-center gap-1.5 rounded-xl bg-yellow-500 px-4 py-2 text-xs font-bold text-slate-900 shadow-md transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Heart className="h-3.5 w-3.5" />
                Finish Garden
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* --------------------------------
           FINISHED SCREEN
        -------------------------------- */

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="relative z-10 px-6 py-16 text-center"
        >
          <motion.div
            animate={{
              y: [0, -8, 0],
              rotate: [-2, 2, -2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100 text-yellow-500 shadow-lg"
          >
            <Flower2 className="h-12 w-12" />
          </motion.div>

          <h2
            className={`mt-6 text-3xl font-bold ${
              isNight ? "text-white" : "text-slate-800"
            }`}
          >
            Your Garden Is Blooming 🌻
          </h2>

          <p
            className={`mx-auto mt-3 max-w-md text-sm ${
              isNight ? "text-slate-300" : "text-slate-600"
            }`}
          >
            You planted {flowers.length} gratitude{" "}
            {flowers.length === 1 ? "seed" : "seeds"} and created
            a small digital sanctuary for positive thoughts.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-amber-100 px-5 py-3 text-sm font-bold text-amber-900">
            <Sparkles className="h-4 w-4 text-amber-500" />
            +20 Mind Points Earned
          </div>

          <div className="mx-auto mt-5 flex max-w-sm justify-center gap-2 text-3xl">
            {flowers.slice(0, 7).map((flower) => (
              <motion.span
                key={flower.id}
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random(),
                }}
              >
                {flower.growth >= 100
                  ? flower.type
                  : getFlowerStage(flower.growth)}
              </motion.span>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={() => {
                setIsFinished(false);
                playSoftSound(450, 0.15, 0.025);
              }}
              className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Keep Gardening
            </button>

            <button
              onClick={onBack}
              className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-emerald-600"
            >
              Done
            </button>
          </div>
        </motion.div>
      )}

      {/* --------------------------------
          FOOTER
      -------------------------------- */}

      <div
        className={`relative z-10 border-t px-5 py-3 text-center text-[10px] ${
          isNight
            ? "border-white/10 text-slate-500"
            : "border-yellow-100 text-slate-400"
        }`}
      >
        🌿 A quiet space for reflection · Take a slow breath ·
        Nothing needs to be rushed
      </div>
    </div>
  );
};