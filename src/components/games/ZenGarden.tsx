import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  RefreshCw,
  Trophy,
  Sparkles,
  RotateCcw,
  Leaf,
  Flower2,
  Droplets,
  Mountain,
  Clock,
  Wind,
  Undo2,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useApp } from "../../context/AppContext";

interface Stone {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  type: "stone" | "rock" | "pebble";
}

interface Plant {
  id: number;
  x: number;
  y: number;
  type: "bamboo" | "flower" | "moss";
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  angle: number;
}

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 500;

export const ZenGarden: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const { earnXP } = useApp();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [selectedTool, setSelectedTool] = useState<
    "rake" | "circle" | "wave"
  >("rake");

  const [zenScore, setZenScore] = useState(0);
  const [rakeCount, setRakeCount] = useState(0);

  const [timeLeft, setTimeLeft] = useState(180);

  const [stones, setStones] = useState<Stone[]>([
    {
      id: 1,
      x: 130,
      y: 130,
      size: 30,
      color: "#4B5563",
      rotation: -8,
      type: "stone",
    },
    {
      id: 2,
      x: 330,
      y: 260,
      size: 40,
      color: "#374151",
      rotation: 12,
      type: "rock",
    },
    {
      id: 3,
      x: 650,
      y: 120,
      size: 25,
      color: "#6B7280",
      rotation: -15,
      type: "pebble",
    },
  ]);

  const [plants, setPlants] = useState<Plant[]>([
    {
      id: 1,
      x: 750,
      y: 350,
      type: "bamboo",
    },
    {
      id: 2,
      x: 90,
      y: 380,
      type: "flower",
    },
  ]);

  const ripples = useRef<Ripple[]>([]);
  const leaves = useRef<
    {
      x: number;
      y: number;
      speed: number;
      rotation: number;
    }[]
  >([]);

  /*
   * ---------------------------------------------------------
   * INITIALIZE FLOATING LEAVES
   * ---------------------------------------------------------
   */

  useEffect(() => {
    leaves.current = Array.from({ length: 14 }, () => ({
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      speed: 0.15 + Math.random() * 0.4,
      rotation: Math.random() * Math.PI,
    }));
  }, []);

  /*
   * ---------------------------------------------------------
   * DRAW GARDEN
   * ---------------------------------------------------------
   */

  const drawGarden = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    /*
     * Background
     */

    const gradient = ctx.createLinearGradient(
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );

    gradient.addColorStop(0, "#F4E7C5");
    gradient.addColorStop(1, "#E8D5AA");

    ctx.fillStyle = gradient;

    ctx.fillRect(
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );

    /*
     * Sand texture
     */

    for (let i = 0; i < 600; i++) {
      const x = Math.random() * CANVAS_WIDTH;
      const y = Math.random() * CANVAS_HEIGHT;

      ctx.fillStyle = "rgba(120,90,50,0.05)";

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        Math.random() * 1.2,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }

    /*
     * Raked horizontal waves
     */

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(120,90,50,0.12)";

    for (let y = 20; y < CANVAS_HEIGHT; y += 18) {
      ctx.beginPath();

      ctx.moveTo(0, y);

      for (let x = 0; x < CANVAS_WIDTH; x += 30) {
        const wave =
          Math.sin(x * 0.015 + y * 0.03) * 3;

        ctx.lineTo(x, y + wave);
      }

      ctx.stroke();
    }

    /*
     * Pond
     */

    const pondGradient = ctx.createRadialGradient(
      500,
      410,
      20,
      500,
      410,
      160
    );

    pondGradient.addColorStop(0, "#BFE4E6");
    pondGradient.addColorStop(1, "#86BFC2");

    ctx.fillStyle = pondGradient;

    ctx.beginPath();

    ctx.ellipse(
      520,
      420,
      155,
      65,
      -0.05,
      0,
      Math.PI * 2
    );

    ctx.fill();

    /*
     * Pond waves
     */

    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = 2;

    for (let i = 0; i < 4; i++) {
      ctx.beginPath();

      ctx.ellipse(
        520,
        420,
        35 + i * 25,
        10 + i * 7,
        0,
        0,
        Math.PI * 2
      );

      ctx.stroke();
    }

    /*
     * Animated leaves
     */

    leaves.current.forEach((leaf) => {
      leaf.x += leaf.speed;

      if (leaf.x > CANVAS_WIDTH + 20) {
        leaf.x = -20;
        leaf.y = Math.random() * CANVAS_HEIGHT;
      }

      leaf.rotation += 0.01;

      ctx.save();

      ctx.translate(leaf.x, leaf.y);

      ctx.rotate(leaf.rotation);

      ctx.fillStyle = "rgba(91,125,77,0.35)";

      ctx.beginPath();

      ctx.ellipse(
        0,
        0,
        7,
        3,
        0,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.restore();
    });

    /*
     * Rake ripples
     */

    ripples.current.forEach((ripple) => {
      ctx.save();

      ctx.translate(ripple.x, ripple.y);

      ctx.rotate(ripple.angle);

      ctx.strokeStyle =
        "rgba(150,120,75,0.35)";

      ctx.lineWidth = 2;

      ctx.beginPath();

      ctx.arc(
        0,
        0,
        ripple.radius,
        Math.PI * 0.15,
        Math.PI * 0.85
      );

      ctx.stroke();

      ctx.restore();
    });
  }, []);

  /*
   * ---------------------------------------------------------
   * ANIMATION LOOP
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const animate = () => {
      drawGarden();

      animationRef.current =
        requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawGarden]);

  /*
   * ---------------------------------------------------------
   * TIMER
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);

          handleFinish();

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished]);

  /*
   * ---------------------------------------------------------
   * CANVAS POSITION
   * ---------------------------------------------------------
   */

  const getPointerPosition = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return {
        x: 0,
        y: 0,
      };
    }

    const rect =
      canvas.getBoundingClientRect();

    const clientX =
      "touches" in e
        ? e.touches[0]?.clientX ?? 0
        : e.clientX;

    const clientY =
      "touches" in e
        ? e.touches[0]?.clientY ?? 0
        : e.clientY;

    return {
      x:
        ((clientX - rect.left) /
          rect.width) *
        CANVAS_WIDTH,

      y:
        ((clientY - rect.top) /
          rect.height) *
        CANVAS_HEIGHT,
    };
  };

  /*
   * ---------------------------------------------------------
   * RAKING
   * ---------------------------------------------------------
   */

  const drawRipple = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;

    const { x, y } =
      getPointerPosition(e);

    if (selectedTool === "rake") {
      for (let i = 0; i < 3; i++) {
        ripples.current.push({
          x,
          y: y + i * 9 - 9,
          radius: 30,
          angle: 0,
        });
      }
    }

    if (selectedTool === "circle") {
      ripples.current.push({
        x,
        y,
        radius: 20,
        angle: 0,
      });
    }

    if (selectedTool === "wave") {
      ripples.current.push({
        x,
        y,
        radius: 45,
        angle: Math.sin(x * 0.02),
      });
    }

    if (ripples.current.length > 150) {
      ripples.current.splice(
        0,
        20
      );
    }

    setRakeCount((value) => value + 1);

    setZenScore((value) =>
      Math.min(
        100,
        value + 0.25
      )
    );
  };

  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    setIsDrawing(true);

    drawRipple(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  /*
   * ---------------------------------------------------------
   * RESET
   * ---------------------------------------------------------
   */

  const resetGarden = () => {
    ripples.current = [];

    setRakeCount(0);
    setZenScore(0);
    setTimeLeft(180);
    setIsFinished(false);
  };

  /*
   * ---------------------------------------------------------
   * FINISH
   * ---------------------------------------------------------
   */

  const handleFinish = () => {
    if (isFinished) return;

    setIsFinished(true);

    const bonus =
      Math.round(zenScore) +
      Math.floor(rakeCount / 50);

    confetti({
      particleCount: 120,
      spread: 90,
      origin: {
        y: 0.6,
      },
    });

    earnXP(
      20 + bonus,
      "Zen Garden meditation"
    );
  };

  /*
   * ---------------------------------------------------------
   * FORMAT TIME
   * ---------------------------------------------------------
   */

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(
      seconds / 60
    );

    const remaining =
      seconds % 60;

    return `${minutes}:${remaining
      .toString()
      .padStart(2, "0")}`;
  };

  /*
   * ---------------------------------------------------------
   * TOOL BUTTON
   * ---------------------------------------------------------
 */

  const tools = [
    {
      id: "rake" as const,
      icon: Wind,
      label: "Rake",
    },
    {
      id: "circle" as const,
      icon: RotateCcw,
      label: "Circle",
    },
    {
      id: "wave" as const,
      icon: Sparkles,
      label: "Wave",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef7f2] via-white to-[#e9f5f3] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-5">

          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />

            Back to Games
          </button>

          <div className="flex items-center gap-2">

            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-teal-100">

              <Clock className="w-4 h-4 text-teal-600" />

              <span className="font-bold text-sm text-slate-700">
                {formatTime(timeLeft)}
              </span>

            </div>

            <div className="bg-teal-50 text-teal-800 px-4 py-2 rounded-full text-xs font-bold border border-teal-100">
              🪴 Zen Garden
            </div>

          </div>
        </div>

        {!isFinished ? (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="bg-white rounded-[2rem] shadow-xl border border-teal-100 overflow-hidden"
          >

            {/* TITLE */}

            <div className="p-5 sm:p-7 border-b border-slate-100">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>

                  <h1 className="text-2xl sm:text-3xl font-black text-slate-800">
                    Create Your Sanctuary
                  </h1>

                  <p className="text-sm text-slate-500 mt-1">
                    Slow down. Breathe. Shape your garden.
                  </p>

                </div>

                <div className="flex items-center gap-3">

                  <div className="text-center px-4 py-2 rounded-2xl bg-amber-50 border border-amber-100">

                    <p className="text-[10px] uppercase tracking-wider font-bold text-amber-700">
                      Zen Score
                    </p>

                    <p className="text-xl font-black text-amber-900">
                      {Math.round(zenScore)}
                    </p>

                  </div>

                  <div className="text-center px-4 py-2 rounded-2xl bg-teal-50 border border-teal-100">

                    <p className="text-[10px] uppercase tracking-wider font-bold text-teal-700">
                      Rakes
                    </p>

                    <p className="text-xl font-black text-teal-900">
                      {rakeCount}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* GAME */}

            <div className="p-4 sm:p-7">

              <div className="relative rounded-[1.5rem] overflow-hidden border-[8px] border-[#8C6B43] shadow-2xl bg-[#E8D5AA]">

                <canvas
                  ref={canvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  onMouseDown={startDrawing}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onMouseMove={drawRipple}
                  onTouchStart={startDrawing}
                  onTouchEnd={stopDrawing}
                  onTouchMove={drawRipple}
                  className="w-full aspect-[16/9] cursor-crosshair touch-none"
                />

                {/* STONES */}

                {stones.map((stone) => (
                  <motion.div
                    key={stone.id}
                    drag
                    dragMomentum={false}
                    whileHover={{
                      scale: 1.05,
                    }}
                    whileDrag={{
                      scale: 1.12,
                    }}
                    dragConstraints={{
                      left: 0,
                      right: 750,
                      top: 0,
                      bottom: 400,
                    }}
                    style={{
                      width:
                        stone.size * 2,
                      height:
                        stone.size * 1.4,
                      top:
                        (stone.y /
                          CANVAS_HEIGHT) *
                        100 +
                        "%",
                      left:
                        (stone.x /
                          CANVAS_WIDTH) *
                        100 +
                        "%",
                      background:
                        `linear-gradient(145deg, ${stone.color}, #1f2937)`,
                      transform: `rotate(${stone.rotation}deg)`,
                    }}
                    className="absolute rounded-[45%] shadow-[0_10px_20px_rgba(0,0,0,0.3)] border border-white/10 cursor-grab active:cursor-grabbing"
                  >
                    <div className="absolute top-[18%] left-[25%] w-[25%] h-[15%] bg-white/10 rounded-full blur-[2px]" />
                  </motion.div>
                ))}

                {/* PLANTS */}

                {plants.map((plant) => (
                  <motion.div
                    key={plant.id}
                    initial={{
                      scale: 0,
                    }}
                    animate={{
                      scale: 1,
                    }}
                    className="absolute pointer-events-none"
                    style={{
                      left:
                        (plant.x /
                          CANVAS_WIDTH) *
                        100 +
                        "%",
                      top:
                        (plant.y /
                          CANVAS_HEIGHT) *
                        100 +
                        "%",
                    }}
                  >

                    {plant.type ===
                      "bamboo" && (
                      <div className="relative">

                        <Leaf className="w-10 h-10 text-green-700" />

                        <Leaf className="absolute -left-5 top-4 w-7 h-7 rotate-[-40deg] text-green-600" />

                      </div>
                    )}

                    {plant.type ===
                      "flower" && (
                      <Flower2 className="w-8 h-8 text-pink-400" />
                    )}

                    {plant.type ===
                      "moss" && (
                      <div className="w-8 h-5 rounded-full bg-green-700/70 blur-[1px]" />
                    )}

                  </motion.div>
                ))}

                {/* WATER */}

                <div className="absolute bottom-[8%] left-[50%] -translate-x-1/2 pointer-events-none">

                  <Droplets className="w-8 h-8 text-white/60" />

                </div>

              </div>

              {/* TOOLBAR */}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5">

                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">

                  {tools.map((tool) => {
                    const Icon = tool.icon;

                    const active =
                      selectedTool ===
                      tool.id;

                    return (
                      <button
                        key={tool.id}
                        onClick={() =>
                          setSelectedTool(
                            tool.id
                          )
                        }
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                          active
                            ? "bg-teal-600 text-white shadow-md"
                            : "text-slate-500 hover:bg-white"
                        }`}
                      >

                        <Icon className="w-4 h-4" />

                        {tool.label}

                      </button>
                    );
                  })}

                </div>

                <div className="flex gap-2">

                  <button
                    onClick={resetGarden}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition"
                  >

                    <Undo2 className="w-4 h-4" />

                    Reset

                  </button>

                  <button
                    onClick={handleFinish}
                    className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-teal-600/20 transition"
                  >

                    <Check className="w-4 h-4" />

                    Complete Garden

                  </button>

                </div>

              </div>

              {/* INSTRUCTION */}

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">

                <Sparkles className="w-4 h-4 text-teal-500" />

                Drag across the sand slowly to create peaceful patterns.

              </div>

            </div>

          </motion.div>
        ) : (

          /* COMPLETION */

          <AnimatePresence>

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="bg-white rounded-[2rem] shadow-xl border border-teal-100 p-10 text-center"
            >

              <motion.div
                animate={{
                  rotate: [0, -5, 5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="w-24 h-24 mx-auto rounded-full bg-teal-100 text-teal-600 flex items-center justify-center"
              >

                <Trophy className="w-12 h-12" />

              </motion.div>

              <h2 className="text-3xl font-black text-slate-800 mt-6">
                Your Sanctuary Is Complete
              </h2>

              <p className="text-slate-500 max-w-md mx-auto mt-2">
                You slowed down, focused your attention,
                and created something peaceful.
              </p>

              <div className="grid grid-cols-2 max-w-sm mx-auto gap-3 mt-7">

                <div className="bg-teal-50 rounded-2xl p-4">

                  <p className="text-xs font-bold text-teal-600">
                    ZEN SCORE
                  </p>

                  <p className="text-3xl font-black text-teal-900">
                    {Math.round(zenScore)}
                  </p>

                </div>

                <div className="bg-amber-50 rounded-2xl p-4">

                  <p className="text-xs font-bold text-amber-600">
                    RAKES
                  </p>

                  <p className="text-3xl font-black text-amber-900">
                    {rakeCount}
                  </p>

                </div>

              </div>

              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 font-bold px-5 py-3 rounded-2xl text-sm mt-6">

                <Sparkles className="w-4 h-4 text-amber-600" />

                Mindfulness XP Earned

              </div>

              <div className="flex justify-center gap-3 mt-7">

                <button
                  onClick={resetGarden}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-sm flex items-center gap-2"
                >

                  <RefreshCw className="w-4 h-4" />

                  Create Again

                </button>

                <button
                  onClick={onBack}
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm"
                >
                  Done
                </button>

              </div>

            </motion.div>

          </AnimatePresence>

        )}

      </div>
    </div>
  );
};