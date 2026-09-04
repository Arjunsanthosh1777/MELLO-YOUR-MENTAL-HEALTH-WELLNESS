
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Flower2,
  Heart,
  RotateCcw,
  Sparkles,
  Trophy,
  X
} from 'lucide-react';

interface WordBloomProps {
  onBack?: () => void;
}

interface LetterTile {
  id: number;
  letter: string;
  used: boolean;
}

const WORD_BANK = [
  'CALM',
  'PEACE',
  'SMILE',
  'DREAM',
  'BLOOM',
  'FOCUS',
  'HAPPY',
  'LIGHT',
  'BREATHE',
  'HOPE',
  'MIND',
  'HEART',
  'RELAX',
  'JOY',
  'REST',
  'KIND',
  'GLOW',
  'RAIN',
  'CLOUD',
  'SUN',
  'MOON',
  'STAR',
  'FLOW',
  'GRACE',
  'QUIET'
];

const BONUS_WORDS = [
  'BLOOM',
  'BREATHE',
  'PEACE',
  'DREAM',
  'RELAX'
];

const shuffle = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const createLetters = (word: string): LetterTile[] => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const extraCount = Math.max(2, 7 - word.length);

  const extras = Array.from(
    { length: extraCount },
    () => alphabet[Math.floor(Math.random() * alphabet.length)]
  );

  return shuffle([...word.split(''), ...extras]).map(
    (letter, index) => ({
      id: index,
      letter,
      used: false
    })
  );
};

const getWordForLevel = (level: number): string => {
  const available = WORD_BANK.filter((word) => {
    if (level <= 2) return word.length <= 4;
    if (level <= 5) return word.length <= 5;
    if (level <= 8) return word.length <= 6;

    return true;
  });

  return available[Math.floor(Math.random() * available.length)];
};

export const WordBloom: React.FC<WordBloomProps> = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [flowers, setFlowers] = useState(0);
  const [lives, setLives] = useState(3);

  const [targetWord, setTargetWord] = useState(() =>
    getWordForLevel(1)
  );

  const [tiles, setTiles] = useState<LetterTile[]>(() =>
    createLetters(targetWord)
  );

  const [selected, setSelected] = useState<number[]>([]);
  const [message, setMessage] = useState(
    'Find the hidden word 🌸'
  );

  const [showSuccess, setShowSuccess] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(
        localStorage.getItem('mello-wordbloom-highscore') || 0
      );
    } catch {
      return 0;
    }
  });

  const progress = useMemo(() => {
    return Math.min(
      100,
      Math.round((selected.length / targetWord.length) * 100)
    );
  }, [selected.length, targetWord.length]);

  const selectedWord = useMemo(() => {
    return selected
      .map((id) => tiles.find((tile) => tile.id === id)?.letter || '')
      .join('');
  }, [selected, tiles]);

  const startNextLevel = useCallback(() => {
    const nextLevel = level + 1;
    const nextWord = getWordForLevel(nextLevel);

    setLevel(nextLevel);
    setTargetWord(nextWord);
    setTiles(createLetters(nextWord));
    setSelected([]);
    setMessage('A new flower is waiting 🌱');
    setShowSuccess(false);
  }, [level]);

  const finishGame = useCallback(() => {
    setGameOver(true);

    if (score > highScore) {
      setHighScore(score);

      try {
        localStorage.setItem(
          'mello-wordbloom-highscore',
          String(score)
        );
      } catch {
        // Ignore storage errors.
      }
    }
  }, [score, highScore]);

  const resetGame = useCallback(() => {
    const firstWord = getWordForLevel(1);

    setLevel(1);
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setFlowers(0);
    setLives(3);

    setTargetWord(firstWord);
    setTiles(createLetters(firstWord));

    setSelected([]);
    setMessage('Find the hidden word 🌸');
    setShowSuccess(false);
    setGameOver(false);
  }, []);

  const selectTile = (id: number) => {
    if (gameOver || showSuccess) return;

    const tile = tiles.find((item) => item.id === id);

    if (!tile || tile.used) return;

    const nextSelected = [...selected, id];

    setSelected(nextSelected);

    setTiles((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, used: true }
          : item
      )
    );

    const currentWord = nextSelected
      .map(
        (selectedId) =>
          tiles.find((item) => item.id === selectedId)?.letter || ''
      )
      .join('');

    /*
     * Correct word
     */
    if (currentWord === targetWord) {
      const nextCombo = combo + 1;

      const basePoints = targetWord.length * 10;
      const comboBonus = Math.min(nextCombo * 5, 50);
      const flowerBonus = BONUS_WORDS.includes(targetWord)
        ? 25
        : 0;

      const earned =
        basePoints + comboBonus + flowerBonus;

      setScore((current) => current + earned);
      setCombo(nextCombo);
      setBestCombo((current) =>
        Math.max(current, nextCombo)
      );
      setFlowers((current) => current + 1);

      setMessage(
        BONUS_WORDS.includes(targetWord)
          ? `Beautiful! +${earned} 🌸✨`
          : `Bloom complete! +${earned} 🌱`
      );

      setShowSuccess(true);

      return;
    }

    /*
     * Wrong word / impossible path
     */
    if (!targetWord.startsWith(currentWord)) {
      const remainingLives = lives - 1;

      setLives(remainingLives);
      setCombo(0);

      setMessage('That path faded away... try again 💜');

      setTimeout(() => {
        setSelected([]);
        setTiles((current) =>
          current.map((item) => ({
            ...item,
            used: false
          }))
        );
      }, 450);

      if (remainingLives <= 0) {
        setTimeout(() => finishGame(), 500);
      }
    }
  };

  const removeLastLetter = () => {
    if (gameOver || showSuccess || selected.length === 0) {
      return;
    }

    const lastId = selected[selected.length - 1];

    setSelected((current) => current.slice(0, -1));

    setTiles((current) =>
      current.map((tile) =>
        tile.id === lastId
          ? { ...tile, used: false }
          : tile
      )
    );

    setMessage('Choose another letter ✨');
  };

  const clearWord = () => {
    if (gameOver || showSuccess) return;

    setSelected([]);

    setTiles((current) =>
      current.map((tile) => ({
        ...tile,
        used: false
      }))
    );

    setMessage('Fresh start 🌱');
  };

  /*
   * Keyboard controls
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameOver || showSuccess) return;

      const key = event.key.toUpperCase();

      if (/^[A-Z]$/.test(key)) {
        const tile = tiles.find(
          (item) => item.letter === key && !item.used
        );

        if (tile) {
          selectTile(tile.id);
        }
      }

      if (event.key === 'Backspace') {
        removeLastLetter();
      }

      if (event.key === 'Escape') {
        clearWord();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [
    tiles,
    gameOver,
    showSuccess,
    selected,
    lives
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff7fc] via-[#f5f1ff] to-[#eefaff] text-slate-800 p-4">

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">

          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-black">
              WordBloom 🌸
            </h1>

            <p className="text-sm text-slate-500">
              Connect letters. Grow your garden.
            </p>
          </div>

          <div className="w-[78px]" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">

          <div className="bg-white rounded-2xl p-3 border border-purple-100 shadow-sm">
            <div className="text-xs text-slate-400">
              LEVEL
            </div>
            <div className="font-black text-xl">
              {level}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-purple-100 shadow-sm">
            <div className="text-xs text-slate-400">
              SCORE
            </div>
            <div className="font-black text-xl">
              {score}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-purple-100 shadow-sm">
            <div className="text-xs text-slate-400">
              COMBO
            </div>
            <div className="font-black text-xl">
              ×{combo}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-purple-100 shadow-sm">
            <div className="text-xs text-slate-400">
              BLOOMS
            </div>
            <div className="font-black text-xl">
              🌸 {flowers}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-purple-100 shadow-sm">
            <div className="text-xs text-slate-400">
              LIVES
            </div>

            <div className="font-black text-xl">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i}>
                  {i < lives ? '❤️' : '🖤'}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Main Game */}
        <div className="relative overflow-hidden rounded-[2rem] border border-purple-100 shadow-xl bg-white">

          {/* Garden background */}
          <div className="absolute inset-0 pointer-events-none">

            <div className="absolute -top-20 -left-20 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl" />

            <div className="absolute top-20 right-0 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />

            <div className="absolute bottom-0 left-1/3 w-96 h-48 bg-cyan-100/30 rounded-full blur-3xl" />

          </div>

          <div className="relative p-5 sm:p-8">

            {/* Progress */}
            <div className="flex items-center justify-between mb-3">

              <div className="flex items-center gap-2 text-sm font-bold text-purple-700">
                <Flower2 className="w-4 h-4" />
                Bloom Progress
              </div>

              <div className="text-sm font-bold text-slate-500">
                {selected.length}/{targetWord.length}
              </div>

            </div>

            <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-8">

              <div
                className="h-full bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 transition-all duration-300"
                style={{
                  width: `${progress}%`
                }}
              />

            </div>

            {/* Garden */}
            <div className="relative min-h-[180px] rounded-3xl bg-gradient-to-b from-indigo-100/60 to-pink-100/60 border border-white mb-7 overflow-hidden">

              {/* Clouds */}
              <div className="absolute top-5 left-10 text-3xl opacity-50">
                ☁️
              </div>

              <div className="absolute top-10 right-16 text-2xl opacity-40">
                ☁️
              </div>

              {/* Sun */}
              <div className="absolute top-5 right-8 text-4xl">
                ☀️
              </div>

              {/* Flowers */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-around items-end text-3xl sm:text-4xl">

                {Array.from({
                  length: Math.min(flowers, 10)
                }).map((_, index) => (
                  <span
                    key={index}
                    className="animate-pulse"
                    style={{
                      animationDelay: `${index * 0.15}s`
                    }}
                  >
                    {['🌷', '🌸', '🌻', '🌼'][index % 4]}
                  </span>
                ))}

              </div>

              {/* Current word */}
              <div className="absolute inset-0 flex items-center justify-center">

                <div className="text-center">

                  <div className="text-xs uppercase tracking-[0.3em] text-purple-500 font-bold mb-3">
                    Your Word
                  </div>

                  <div className="text-3xl sm:text-5xl font-black tracking-[0.2em] text-slate-800 min-h-[60px]">
                    {selectedWord || '· · ·'}
                  </div>

                  <div className="mt-3 text-sm text-slate-500">
                    {message}
                  </div>

                </div>

              </div>

            </div>

            {/* Letter Tiles */}
            <div className="max-w-2xl mx-auto">

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 justify-items-center">

                {tiles.map((tile) => (

                  <button
                    key={tile.id}
                    onClick={() => selectTile(tile.id)}
                    disabled={tile.used || gameOver || showSuccess}
                    className={`
                      w-16 h-16 sm:w-[72px] sm:h-[72px]
                      rounded-2xl
                      font-black text-2xl
                      border
                      shadow-sm
                      transition-all duration-200
                      ${
                        tile.used
                          ? 'bg-slate-100 text-slate-300 border-slate-100 scale-90'
                          : 'bg-white text-purple-700 border-purple-100 hover:-translate-y-1 hover:shadow-lg hover:border-purple-300 active:scale-95'
                      }
                    `}
                  >
                    {tile.letter}
                  </button>

                ))}

              </div>

            </div>

            {/* Selected letters */}
            <div className="flex justify-center gap-2 mt-7 min-h-[48px]">

              {targetWord.split('').map((_, index) => {

                const letter =
                  selectedWord[index];

                return (
                  <div
                    key={index}
                    className={`
                      w-10 h-10 rounded-xl
                      flex items-center justify-center
                      font-black
                      ${
                        letter
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'bg-slate-50 text-slate-300 border border-dashed border-slate-200'
                      }
                    `}
                  >
                    {letter || '·'}
                  </div>
                );

              })}

            </div>

            {/* Controls */}
            <div className="flex justify-center gap-3 mt-6">

              <button
                onClick={removeLastLetter}
                disabled={
                  selected.length === 0 ||
                  gameOver ||
                  showSuccess
                }
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 font-bold flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Undo
              </button>

              <button
                onClick={clearWord}
                disabled={
                  selected.length === 0 ||
                  gameOver ||
                  showSuccess
                }
                className="px-5 py-3 rounded-xl bg-purple-100 hover:bg-purple-200 disabled:opacity-40 text-purple-700 font-bold flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Clear
              </button>

            </div>

            {/* Hint */}
            <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 text-center">

              <div className="flex items-center justify-center gap-2 text-purple-700 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                Focus Tip
              </div>

              <p className="text-xs text-slate-500 mt-1">
                Look for a word that matches the calm garden theme.
                There is no rush.
              </p>

            </div>

          </div>

          {/* Success overlay */}
          {showSuccess && !gameOver && (

            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">

              <div className="bg-white rounded-3xl shadow-2xl border border-purple-100 p-8 text-center max-w-sm mx-4">

                <div className="text-6xl mb-4">
                  🌸
                </div>

                <h2 className="text-3xl font-black text-slate-900">
                  Beautiful Bloom!
                </h2>

                <p className="text-slate-500 mt-2">
                  You found
                  <span className="font-black text-purple-600">
                    {' '}{targetWord}
                  </span>
                </p>

                <div className="flex items-center justify-center gap-2 mt-4 text-yellow-500 font-black">
                  <Sparkles className="w-5 h-5" />
                  Combo ×{combo}
                </div>

                <button
                  onClick={startNextLevel}
                  className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black shadow-lg hover:scale-[1.02] transition-transform"
                >
                  Grow Next Flower 🌱
                </button>

              </div>

            </div>
          )}

          {/* Game over */}
          {gameOver && (

            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center">

              <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-sm mx-4">

                <div className="text-6xl mb-3">
                  🌙
                </div>

                <h2 className="text-3xl font-black">
                  Garden Resting
                </h2>

                <p className="text-slate-500 mt-2">
                  Your flowers will be waiting for you.
                </p>

                <div className="grid grid-cols-2 gap-3 mt-6">

                  <div className="bg-purple-50 rounded-2xl p-4">
                    <div className="text-xs text-purple-400">
                      SCORE
                    </div>
                    <div className="text-2xl font-black text-purple-700">
                      {score}
                    </div>
                  </div>

                  <div className="bg-pink-50 rounded-2xl p-4">
                    <div className="text-xs text-pink-400">
                      BLOOMS
                    </div>
                    <div className="text-2xl font-black text-pink-700">
                      {flowers}
                    </div>
                  </div>

                </div>

                <div className="flex items-center justify-center gap-2 mt-4 text-yellow-500 font-bold">
                  <Trophy className="w-5 h-5" />
                  Best Combo ×{bestCombo}
                </div>

                <div className="text-sm text-slate-500 mt-2">
                  🏆 High Score: {Math.max(score, highScore)}
                </div>

                <button
                  onClick={resetGame}
                  className="mt-6 w-full py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition"
                >
                  <span className="inline-flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Grow Again
                  </span>
                </button>

              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">

          <div className="flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-pink-400" />
            Gentle play for focus and relaxation
          </div>

          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            Keyboard supported
          </div>

        </div>

      </div>
    </div>
  );
};

export default WordBloom;
