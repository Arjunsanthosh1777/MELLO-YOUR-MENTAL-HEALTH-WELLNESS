import React, { useCallback, useEffect, useRef, useState } from 'react';

interface MemoryGlowProps {
  onBack: () => void;
}

type TileState = 'idle' | 'active' | 'correct' | 'wrong';

const TILE_COUNT = 9;
const START_SEQUENCE = 3;

const tileColors = [
  'from-pink-400 to-rose-500',
  'from-purple-400 to-violet-600',
  'from-blue-400 to-cyan-500',
  'from-emerald-400 to-teal-500',
  'from-yellow-300 to-orange-400',
  'from-fuchsia-400 to-pink-600',
  'from-indigo-400 to-blue-600',
  'from-cyan-300 to-sky-500',
  'from-violet-400 to-fuchsia-500',
];

export const MemoryGlow: React.FC<MemoryGlowProps> = ({ onBack }) => {
  const [started, setStarted] = useState(false);
  const [showing, setShowing] = useState(false);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [tileStates, setTileStates] = useState<TileState[]>(
    Array(TILE_COUNT).fill('idle')
  );

  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [bestScore, setBestScore] = useState(() => {
    return Number(localStorage.getItem('mello-memory-glow-highscore') || 0);
  });

  const [message, setMessage] = useState('Watch the glow...');
  const [gameOver, setGameOver] = useState(false);

  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  };

  const generateSequence = useCallback((length: number) => {
    const result: number[] = [];

    while (result.length < length) {
      const random = Math.floor(Math.random() * TILE_COUNT);

      if (!result.includes(random)) {
        result.push(random);
      }
    }

    return result;
  }, []);

  const showSequence = useCallback((newSequence: number[]) => {
    clearTimers();

    setShowing(true);
    setMessage('✨ Watch carefully...');

    setTileStates(Array(TILE_COUNT).fill('idle'));

    newSequence.forEach((tile, index) => {
      const timer = window.setTimeout(() => {
        setTileStates((previous) => {
          const next = [...previous];
          next[tile] = 'active';
          return next;
        });

        const offTimer = window.setTimeout(() => {
          setTileStates((previous) => {
            const next = [...previous];
            next[tile] = 'idle';
            return next;
          });
        }, 400);

        timers.current.push(offTimer);
      }, index * 650);

      timers.current.push(timer);
    });

    const finishTimer = window.setTimeout(
      () => {
        setShowing(false);
        setPlayerSequence([]);
        setTileStates(Array(TILE_COUNT).fill('idle'));
        setMessage('Your turn! Repeat the sequence.');
      },
      newSequence.length * 650 + 450
    );

    timers.current.push(finishTimer);
  }, []);

  const startGame = useCallback(() => {
    clearTimers();

    const firstSequence = generateSequence(START_SEQUENCE);

    setStarted(true);
    setGameOver(false);
    setLevel(1);
    setScore(0);
    setCombo(0);
    setLives(3);
    setPlayerSequence([]);
    setSequence(firstSequence);

    showSequence(firstSequence);
  }, [generateSequence, showSequence]);

  const finishGame = useCallback(() => {
    clearTimers();

    setGameOver(true);
    setStarted(false);
    setShowing(false);

    setBestScore((currentBest) => {
      const newBest = Math.max(currentBest, score);

      localStorage.setItem(
        'mello-memory-glow-highscore',
        String(newBest)
      );

      return newBest;
    });

    setMessage('The glow faded...');
  }, [score]);

  const handleTileClick = (index: number) => {
    if (!started || showing || gameOver) return;

    const expectedTile = sequence[playerSequence.length];

    // Correct tile
    if (index === expectedTile) {
      const newPlayerSequence = [...playerSequence, index];

      setPlayerSequence(newPlayerSequence);

      setTileStates((previous) => {
        const next = [...previous];
        next[index] = 'correct';
        return next;
      });

      const newCombo = combo + 1;

      setCombo(newCombo);

      const points = 20 + level * 5 + newCombo * 2;

      setScore((current) => current + points);

      // Sequence completed
      if (newPlayerSequence.length === sequence.length) {
        const nextLevel = level + 1;

        setMessage('🌸 Perfect! Get ready...');

        setTimeout(() => {
          const nextSequence = generateSequence(
            Math.min(START_SEQUENCE + nextLevel - 1, TILE_COUNT)
          );

          setSequence(nextSequence);
          setLevel(nextLevel);

          showSequence(nextSequence);
        }, 650);
      }

      return;
    }

    // Wrong tile
    setTileStates((previous) => {
      const next = [...previous];
      next[index] = 'wrong';
      return next;
    });

    const newLives = lives - 1;

    setLives(newLives);
    setCombo(0);
    setMessage('💫 Not quite. Stay focused!');

    setTimeout(() => {
      setTileStates(Array(TILE_COUNT).fill('idle'));
    }, 400);

    if (newLives <= 0) {
      finishGame();
      return;
    }

    // Replay current sequence
    setTimeout(() => {
      setPlayerSequence([]);
      showSequence(sequence);
    }, 700);
  };

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#17152f] via-[#302451] to-[#11101f] text-white flex items-center justify-center p-4">

      <div className="w-full max-w-4xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">

          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-semibold"
          >
            ← Back
          </button>

          <div className="text-right">
            <div className="text-xs text-white/40">
              HIGH SCORE
            </div>

            <div className="font-black text-xl">
              🏆 {bestScore}
            </div>
          </div>

        </div>

        {/* Game Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/20 shadow-2xl">

          {/* Title */}
          <div className="p-6 text-center">

            <div className="text-5xl mb-2">
              ✨
            </div>

            <h1 className="text-3xl md:text-4xl font-black">
              Memory Glow
            </h1>

            <p className="text-white/50 text-sm mt-1">
              Watch the light. Remember the pattern. Stay calm.
            </p>

          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 px-5">

            <div className="bg-white/5 rounded-2xl p-3 text-center">
              <div className="text-[10px] text-white/40">
                LEVEL
              </div>

              <div className="font-black text-lg">
                {level}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-3 text-center">
              <div className="text-[10px] text-white/40">
                SCORE
              </div>

              <div className="font-black text-lg">
                {score}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-3 text-center">
              <div className="text-[10px] text-white/40">
                COMBO
              </div>

              <div className="font-black text-lg">
                ×{combo}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-3 text-center">
              <div className="text-[10px] text-white/40">
                LIVES
              </div>

              <div className="font-black text-lg">
                {'❤️'.repeat(lives)}
              </div>
            </div>

          </div>

          {/* Message */}
          <div className="text-center py-5">

            <div className="inline-flex px-5 py-2 rounded-full bg-white/10 border border-white/10 text-sm font-semibold">
              {message}
            </div>

          </div>

          {/* Tiles */}
          <div className="px-6 pb-6">

            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">

              {Array.from({ length: TILE_COUNT }).map((_, index) => {

                const state = tileStates[index];

                return (
                  <button
                    key={index}
                    onClick={() => handleTileClick(index)}
                    disabled={!started || showing || gameOver}
                    className={`
                      aspect-square rounded-2xl
                      bg-gradient-to-br ${tileColors[index]}
                      transition-all duration-200
                      border border-white/10
                      shadow-lg
                      relative overflow-hidden
                      ${
                        state === 'active'
                          ? 'scale-110 brightness-150 shadow-[0_0_35px_rgba(255,255,255,0.8)]'
                          : ''
                      }
                      ${
                        state === 'correct'
                          ? 'scale-105 brightness-125'
                          : ''
                      }
                      ${
                        state === 'wrong'
                          ? 'animate-pulse brightness-75'
                          : ''
                      }
                      ${
                        !started || showing || gameOver
                          ? 'cursor-default'
                          : 'hover:scale-105 active:scale-95 cursor-pointer'
                      }
                    `}
                  >

                    {/* Glow */}
                    <div className="absolute inset-0 bg-white/10" />

                    {/* Center */}
                    <div className="absolute inset-0 flex items-center justify-center">

                      {state === 'active' && (
                        <div className="w-8 h-8 rounded-full bg-white shadow-[0_0_30px_white]" />
                      )}

                      {state === 'correct' && (
                        <span className="text-2xl">
                          ✓
                        </span>
                      )}

                      {state === 'wrong' && (
                        <span className="text-2xl">
                          ✕
                        </span>
                      )}

                    </div>

                  </button>
                );
              })}

            </div>

          </div>

          {/* Start Overlay */}
          {!started && !gameOver && (
            <div className="absolute inset-0 top-[145px] flex items-center justify-center bg-black/50 backdrop-blur-sm">

              <div className="text-center p-6">

                <div className="text-5xl mb-4">
                  🌸
                </div>

                <h2 className="text-2xl font-black mb-2">
                  Ready to Glow?
                </h2>

                <p className="text-white/50 text-sm mb-6 max-w-xs">
                  Watch the glowing tiles and tap them back in exactly
                  the same order.
                </p>

                <button
                  onClick={startGame}
                  className="px-8 py-3 rounded-2xl bg-white text-black font-black hover:scale-105 active:scale-95 transition-transform"
                >
                  ✨ Start Game
                </button>

              </div>

            </div>
          )}

          {/* Game Over */}
          {gameOver && (
            <div className="absolute inset-0 top-[145px] flex items-center justify-center bg-black/60 backdrop-blur-md">

              <div className="text-center p-6">

                <div className="text-6xl mb-3">
                  🌙
                </div>

                <h2 className="text-3xl font-black">
                  Glow Faded
                </h2>

                <p className="text-white/50 mt-2">
                  You reached level {level}
                </p>

                <div className="mt-5 text-3xl font-black">
                  {score}
                </div>

                <div className="text-yellow-300 text-sm mt-2">
                  🏆 Best: {Math.max(score, bestScore)}
                </div>

                <button
                  onClick={startGame}
                  className="mt-6 px-8 py-3 rounded-2xl bg-white text-black font-black hover:scale-105 transition-transform"
                >
                  🔄 Try Again
                </button>

              </div>

            </div>
          )}

        </div>

        {/* Instructions */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="text-xl mb-1">
              👀
            </div>

            <div className="font-bold text-sm">
              Watch
            </div>

            <p className="text-xs text-white/40 mt-1">
              Memorize the glowing sequence.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="text-xl mb-1">
              🧠
            </div>

            <div className="font-bold text-sm">
              Remember
            </div>

            <p className="text-xs text-white/40 mt-1">
              The sequence gets longer every level.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="text-xl mb-1">
              🌸
            </div>

            <div className="font-bold text-sm">
              Stay Calm
            </div>

            <p className="text-xs text-white/40 mt-1">
              Three mistakes and the run ends.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default MemoryGlow;
