import React, { useEffect, useState } from 'react';
import { ArrowLeft, RotateCcw, Lightbulb, Trophy } from 'lucide-react';

interface LiquidSortProps {
  onBack: () => void;
}

type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface Tube {
  id: number;
  colors: string[];
}

const COLORS = [
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#F59E0B',
  '#10B981',
  '#EF4444',
];

const INITIAL_LEVELS: Record<Difficulty, Tube[]> = {
  Easy: [
    { id: 0, colors: [COLORS[0], COLORS[1], COLORS[0], COLORS[1]] },
    { id: 1, colors: [COLORS[1], COLORS[0], COLORS[1], COLORS[0]] },
    { id: 2, colors: [] },
    { id: 3, colors: [] },
  ],

  Medium: [
    {
      id: 0,
      colors: [COLORS[0], COLORS[1], COLORS[2], COLORS[0]],
    },
    {
      id: 1,
      colors: [COLORS[2], COLORS[1], COLORS[0], COLORS[2]],
    },
    {
      id: 2,
      colors: [COLORS[1], COLORS[2], COLORS[0], COLORS[1]],
    },
    { id: 3, colors: [] },
    { id: 4, colors: [] },
  ],

  Hard: [
    {
      id: 0,
      colors: [COLORS[0], COLORS[1], COLORS[2], COLORS[3]],
    },
    {
      id: 1,
      colors: [COLORS[3], COLORS[2], COLORS[1], COLORS[0]],
    },
    {
      id: 2,
      colors: [COLORS[4], COLORS[5], COLORS[4], COLORS[5]],
    },
    {
      id: 3,
      colors: [COLORS[2], COLORS[3], COLORS[1], COLORS[4]],
    },
    {
      id: 4,
      colors: [COLORS[5], COLORS[4], COLORS[3], COLORS[2]],
    },
    { id: 5, colors: [] },
    { id: 6, colors: [] },
  ],
};

const CAPACITY = 4;

export const LiquidSort: React.FC<LiquidSortProps> = ({ onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [tubes, setTubes] = useState<Tube[]>(INITIAL_LEVELS.Easy);
  const [selectedTube, setSelectedTube] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [won, setWon] = useState(false);
  const [hints, setHints] = useState(3);

  useEffect(() => {
    if (won) return;

    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [won]);

  const restartGame = (level = difficulty) => {
    setTubes(
      INITIAL_LEVELS[level].map((tube) => ({
        ...tube,
        colors: [...tube.colors],
      }))
    );

    setSelectedTube(null);
    setMoves(0);
    setSeconds(0);
    setWon(false);
    setHints(3);
  };

  const changeDifficulty = (level: Difficulty) => {
    setDifficulty(level);
    restartGame(level);
  };

  const canPour = (from: Tube, to: Tube) => {
    if (from.colors.length === 0) return false;

    if (to.colors.length >= CAPACITY) return false;

    if (to.colors.length === 0) return true;

    return (
      to.colors[to.colors.length - 1] ===
      from.colors[from.colors.length - 1]
    );
  };

  const pourLiquid = (fromId: number, toId: number) => {
    setTubes((current) => {
      const next = current.map((tube) => ({
        ...tube,
        colors: [...tube.colors],
      }));

      const from = next.find((tube) => tube.id === fromId)!;
      const to = next.find((tube) => tube.id === toId)!;

      if (!canPour(from, to)) return current;

      const movingColor = from.colors[from.colors.length - 1];

      let count = 0;

      for (
        let i = from.colors.length - 1;
        i >= 0 &&
        from.colors[i] === movingColor &&
        to.colors.length + count < CAPACITY;
        i--
      ) {
        count++;
      }

      for (let i = 0; i < count; i++) {
        from.colors.pop();
        to.colors.push(movingColor);
      }

      setMoves((m) => m + 1);

      setTimeout(() => {
        checkWin(next);
      }, 0);

      return next;
    });
  };

  const handleTubeClick = (id: number) => {
    if (won) return;

    if (selectedTube === null) {
      const tube = tubes.find((t) => t.id === id);

      if (tube && tube.colors.length > 0) {
        setSelectedTube(id);
      }

      return;
    }

    if (selectedTube === id) {
      setSelectedTube(null);
      return;
    }

    const from = tubes.find((t) => t.id === selectedTube)!;
    const to = tubes.find((t) => t.id === id)!;

    if (canPour(from, to)) {
      pourLiquid(selectedTube, id);
    }

    setSelectedTube(null);
  };

  const checkWin = (currentTubes: Tube[]) => {
    const complete = currentTubes.every(
      (tube) =>
        tube.colors.length === 0 ||
        (tube.colors.length === CAPACITY &&
          tube.colors.every((color) => color === tube.colors[0]))
    );

    if (complete) {
      setWon(true);
    }
  };

  const getHint = () => {
    if (hints <= 0 || won) return;

    for (const from of tubes) {
      if (from.colors.length === 0) continue;

      for (const to of tubes) {
        if (from.id === to.id) continue;

        if (canPour(from, to)) {
          setSelectedTube(from.id);

          setTimeout(() => {
            setSelectedTube(null);
          }, 1200);

          setHints((h) => h - 1);
          return;
        }
      }
    }
  };

  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(
      2,
      '0'
    )}`;
  };

  return (
    <div className="min-h-screen px-4 py-6">

      {/* Header */}
      <div className="max-w-5xl mx-auto">

        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 text-slate-600 hover:text-purple-600 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Games
        </button>

        {/* Title */}
        <div className="text-center mb-6">

          <div className="text-5xl mb-3">
            🧪
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Liquid Sort
          </h1>

          <p className="text-slate-500 mt-2">
            Sort the colorful liquids into matching tubes.
          </p>

        </div>

        {/* Difficulty */}
        <div className="flex justify-center gap-2 mb-6">

          {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((level) => (
            <button
              key={level}
              onClick={() => changeDifficulty(level)}
              className={`px-5 py-2 rounded-xl font-bold text-sm transition ${
                difficulty === level
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-purple-50'
              }`}
            >
              {level}
            </button>
          ))}

        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto mb-8">

          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-purple-100">
            <div className="text-xs text-slate-400">
              MOVES
            </div>

            <div className="text-xl font-extrabold text-purple-600">
              {moves}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-purple-100">
            <div className="text-xs text-slate-400">
              TIME
            </div>

            <div className="text-xl font-extrabold text-pink-500">
              {formatTime()}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-purple-100">
            <div className="text-xs text-slate-400">
              HINTS
            </div>

            <div className="text-xl font-extrabold text-amber-500">
              {hints}
            </div>
          </div>

        </div>

        {/* Game Area */}
        <div className="bg-white rounded-3xl shadow-mello p-6 sm:p-10 border border-purple-100">

          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">

            {tubes.map((tube) => (

              <button
                key={tube.id}
                onClick={() => handleTubeClick(tube.id)}
                className={`relative w-20 h-56 sm:w-24 sm:h-64 rounded-b-[40px] border-4 border-slate-300 bg-slate-50 overflow-hidden transition-all duration-300 ${
                  selectedTube === tube.id
                    ? 'border-purple-500 -translate-y-3 shadow-lg'
                    : 'hover:-translate-y-1'
                }`}
              >

                {/* Glass shine */}
                <div className="absolute left-2 top-3 bottom-3 w-2 bg-white/50 rounded-full z-10" />

                {/* Liquid */}
                <div className="absolute inset-x-0 bottom-0 flex flex-col-reverse">

                  {tube.colors.map((color, index) => (

                    <div
                      key={index}
                      className="w-full h-12 sm:h-14 transition-all duration-300"
                      style={{
                        backgroundColor: color,
                      }}
                    />

                  ))}

                </div>

              </button>

            ))}

          </div>

          {/* Instructions */}
          <div className="text-center mt-8">

            <p className="text-sm text-slate-500">
              {selectedTube === null
                ? 'Tap a tube to select it'
                : 'Now tap another tube to pour'}
            </p>

          </div>

        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 mt-6">

          <button
            onClick={() => restartGame()}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="w-4 h-4" />
            Restart
          </button>

          <button
            onClick={getHint}
            disabled={hints <= 0}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 disabled:opacity-40"
          >
            <Lightbulb className="w-4 h-4" />
            Hint
          </button>

        </div>

        {/* Win */}
        {won && (

          <div className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-3xl p-8 text-center">

            <Trophy className="w-12 h-12 mx-auto text-amber-500 mb-3" />

            <h2 className="text-2xl font-extrabold text-slate-900">
              Beautifully Sorted! 🎉
            </h2>

            <p className="text-slate-500 mt-2">
              You completed the {difficulty} level in {moves} moves.
            </p>

            <button
              onClick={() => restartGame()}
              className="mt-5 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700"
            >
              Play Again
            </button>

          </div>

        )}

        {/* Relaxation Message */}
        <div className="mt-8 text-center text-sm text-slate-400">
          🌿 Take your time. There is no need to rush.
        </div>

      </div>
    </div>
  );
};

export default LiquidSort;