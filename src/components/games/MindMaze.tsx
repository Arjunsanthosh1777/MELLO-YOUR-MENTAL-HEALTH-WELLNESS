import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Brain,
  Trophy,
  Heart,
  Clock,
  Flame,
  Lock,
  CheckCircle,
  RotateCcw,
  Sparkles,
  Target,
  Award,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  onBack: () => void;
}

type PuzzleType =
  | 'sequence'
  | 'odd'
  | 'missing'
  | 'logic';

interface Puzzle {
  type: PuzzleType;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface Level {
  level: number;
  title: string;
  difficulty: string;
  time: number;
  xp: number;
  puzzles: number;
}

interface GameData {
  unlockedLevel: number;
  bestScore: number;
  totalSolved: number;
  totalGames: number;
  achievements: string[];
}

const STORAGE_KEY = 'mello-mind-maze-data';

const DEFAULT_DATA: GameData = {
  unlockedLevel: 1,
  bestScore: 0,
  totalSolved: 0,
  totalGames: 0,
  achievements: [],
};

const LEVELS: Level[] = [
  {
    level: 1,
    title: 'First Steps',
    difficulty: 'Easy',
    time: 20,
    xp: 10,
    puzzles: 5,
  },
  {
    level: 2,
    title: 'Warm Up',
    difficulty: 'Easy',
    time: 19,
    xp: 12,
    puzzles: 5,
  },
  {
    level: 3,
    title: 'Think Fast',
    difficulty: 'Easy',
    time: 18,
    xp: 15,
    puzzles: 5,
  },
  {
    level: 4,
    title: 'Pattern Hunter',
    difficulty: 'Normal',
    time: 17,
    xp: 18,
    puzzles: 6,
  },
  {
    level: 5,
    title: 'Number Ninja',
    difficulty: 'Normal',
    time: 16,
    xp: 20,
    puzzles: 6,
  },
  {
    level: 6,
    title: 'Logic Lab',
    difficulty: 'Normal',
    time: 15,
    xp: 22,
    puzzles: 6,
  },
  {
    level: 7,
    title: 'Quick Mind',
    difficulty: 'Normal',
    time: 14,
    xp: 25,
    puzzles: 7,
  },
  {
    level: 8,
    title: 'Brain Storm',
    difficulty: 'Hard',
    time: 13,
    xp: 28,
    puzzles: 7,
  },
  {
    level: 9,
    title: 'Mind Bender',
    difficulty: 'Hard',
    time: 12,
    xp: 30,
    puzzles: 7,
  },
  {
    level: 10,
    title: 'Puzzle Master',
    difficulty: 'Hard',
    time: 11,
    xp: 35,
    puzzles: 8,
  },
  {
    level: 11,
    title: 'Sharp Mind',
    difficulty: 'Hard',
    time: 11,
    xp: 38,
    puzzles: 8,
  },
  {
    level: 12,
    title: 'Logic Storm',
    difficulty: 'Hard',
    time: 10,
    xp: 40,
    puzzles: 8,
  },
  {
    level: 13,
    title: 'Brain Crusher',
    difficulty: 'Expert',
    time: 10,
    xp: 45,
    puzzles: 8,
  },
  {
    level: 14,
    title: 'Impossible?',
    difficulty: 'Expert',
    time: 9,
    xp: 50,
    puzzles: 9,
  },
  {
    level: 15,
    title: 'Master Thinker',
    difficulty: 'Expert',
    time: 9,
    xp: 55,
    puzzles: 9,
  },
  {
    level: 16,
    title: 'Mind Warrior',
    difficulty: 'Expert',
    time: 8,
    xp: 60,
    puzzles: 9,
  },
  {
    level: 17,
    title: 'Genius Mode',
    difficulty: 'Extreme',
    time: 8,
    xp: 70,
    puzzles: 10,
  },
  {
    level: 18,
    title: 'Final Challenge',
    difficulty: 'Extreme',
    time: 7,
    xp: 80,
    puzzles: 10,
  },
  {
    level: 19,
    title: 'Ultimate Mind',
    difficulty: 'Extreme',
    time: 6,
    xp: 90,
    puzzles: 10,
  },
  {
    level: 20,
    title: 'Mind Maze Master',
    difficulty: 'Legendary',
    time: 6,
    xp: 120,
    puzzles: 10,
  },
];

const getRandom = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const makeOptions = (
  answer: number,
  difficulty: number
): string[] => {
  const values = new Set<number>();

  values.add(answer);

  while (values.size < 4) {
    const offset = getRandom(
      -Math.max(3, difficulty),
      Math.max(3, difficulty)
    );

    if (offset !== 0) {
      values.add(answer + offset);
    }
  }

  return shuffle(
    Array.from(values).map(String)
  );
};

const generateSequencePuzzle = (
  level: number
): Puzzle => {
  const pattern = getRandom(0, 3);

  let numbers: number[] = [];
  let answer = 0;
  let explanation = '';

  if (pattern === 0) {
    const start = getRandom(2, 15);
    const difference = getRandom(
      2,
      Math.min(3 + level, 10)
    );

    numbers = [
      start,
      start + difference,
      start + difference * 2,
      start + difference * 3,
    ];

    answer = start + difference * 4;

    explanation = `Each number increases by ${difference}.`;
  }

  if (pattern === 1) {
    const start = getRandom(1, 8);

    numbers = [
      start,
      start * 2,
      start * 4,
      start * 8,
    ];

    answer = start * 16;

    explanation = 'Each number is multiplied by 2.';
  }

  if (pattern === 2) {
    const start = getRandom(1, 8);

    numbers = [
      start,
      start + 2,
      start + 6,
      start + 12,
    ];

    answer = start + 20;

    explanation =
      'The differences are +2, +4, +6, +8.';
  }

  if (pattern === 3) {
    const start = getRandom(1, 6);

    numbers = [
      start,
      start + 3,
      start + 8,
      start + 15,
    ];

    answer = start + 24;

    explanation =
      'The differences increase by 2 each time: +3, +5, +7, +9.';
  }

  return {
    type: 'sequence',
    question: `What number comes next?\n\n${numbers.join(
      '   →   '
    )}   →   ?`,
    options: makeOptions(
      answer,
      Math.max(4, level)
    ),
    answer: String(answer),
    explanation,
  };
};

const generateOddPuzzle = (
  level: number
): Puzzle => {
  const base = getRandom(10, 40);

  const values = [
    base + 2,
    base + 4,
    base + 6,
    base + 8,
  ];

  const oddIndex = getRandom(0, 3);

  values[oddIndex] += getRandom(
    1,
    3
  );

  const answer = String(values[oddIndex]);

  return {
    type: 'odd',
    question:
      'Which number does NOT follow the pattern?',
    options: shuffle(
      values.map(String)
    ),
    answer,
    explanation:
      'Three numbers follow the same even-number pattern while one breaks it.',
  };
};

const generateMissingPuzzle = (
  level: number
): Puzzle => {
  const a = getRandom(2, 10);
  const b = getRandom(2, 10);

  const product = a * b;

  return {
    type: 'missing',
    question: `${a} × ? = ${product}`,
    options: makeOptions(
      b,
      Math.max(3, level)
    ),
    answer: String(b),
    explanation: `${a} × ${b} = ${product}.`,
  };
};

const generateLogicPuzzle = (
  level: number
): Puzzle => {
  const type = getRandom(0, 2);

  if (type === 0) {
    return {
      type: 'logic',
      question:
        'A farmer has 5 sheep. All but 2 run away. How many sheep remain?',
      options: ['2', '3', '5', '0'],
      answer: '2',
      explanation:
        '“All but 2” means 2 sheep did not run away.',
    };
  }

  if (type === 1) {
    return {
      type: 'logic',
      question:
        'If you overtake the person in 2nd place, what position are you in?',
      options: [
        '1st',
        '2nd',
        '3rd',
        'Last',
      ],
      answer: '2nd',
      explanation:
        'You take the position of the person you overtook.',
    };
  }

  return {
    type: 'logic',
    question:
      'A clock shows 3:00. What angle is between the hour and minute hands?',
    options: [
      '45°',
      '90°',
      '120°',
      '180°',
    ],
    answer: '90°',
    explanation:
      'At 3:00 the hands form a right angle.',
  };
};

const generatePuzzle = (
  level: number
): Puzzle => {
  const types: PuzzleType[] = [
    'sequence',
    'odd',
    'missing',
    'logic',
  ];

  const type =
    types[
      getRandom(
        0,
        Math.min(
          types.length - 1,
          Math.floor(level / 4) + 1
        )
      )
    ];

  switch (type) {
    case 'sequence':
      return generateSequencePuzzle(level);

    case 'odd':
      return generateOddPuzzle(level);

    case 'missing':
      return generateMissingPuzzle(level);

    case 'logic':
      return generateLogicPuzzle(level);

    default:
      return generateSequencePuzzle(level);
  }
};

export const MindMaze: React.FC<Props> = ({
  onBack,
}) => {
  const { earnXP } = useApp();

  const [data, setData] = useState<GameData>(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY);

      if (saved) {
        return {
          ...DEFAULT_DATA,
          ...JSON.parse(saved),
        };
      }
    } catch {
      // Ignore invalid saved data
    }

    return DEFAULT_DATA;
  });

  const [selectedLevel, setSelectedLevel] =
    useState<Level | null>(null);

  const [puzzle, setPuzzle] =
    useState<Puzzle | null>(null);

  const [puzzleNumber, setPuzzleNumber] =
    useState(1);

  const [score, setScore] = useState(0);

  const [lives, setLives] = useState(3);

  const [combo, setCombo] = useState(0);

  const [timeLeft, setTimeLeft] =
    useState(20);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [isFinished, setIsFinished] =
    useState(false);

  const [isCorrect, setIsCorrect] =
    useState<boolean | null>(null);

  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  const [showExplanation, setShowExplanation] =
    useState(false);

  const [lastScore, setLastScore] =
    useState(0);

  const [showStats, setShowStats] =
    useState(false);

  const [achievement, setAchievement] =
    useState<string | null>(null);

  /*
   * Save game data
   */
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );
    } catch {
      // Ignore storage errors
    }
  }, [data]);

  /*
   * Generate puzzle
   */
  const createPuzzle = (
    level: Level,
    number: number
  ) => {
    setPuzzle(
      generatePuzzle(
        Math.min(level.level, 20)
      )
    );

    setPuzzleNumber(number);
    setTimeLeft(level.time);
    setIsCorrect(null);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  /*
   * Start level
   */
  const startLevel = (level: Level) => {
    setSelectedLevel(level);
    setScore(0);
    setLives(3);
    setCombo(0);
    setPuzzleNumber(1);
    setIsFinished(false);
    setIsPlaying(true);
    setLastScore(0);

    createPuzzle(level, 1);
  };

  /*
   * Timer
   */
  useEffect(() => {
    if (
      !isPlaying ||
      !selectedLevel ||
      !puzzle ||
      isFinished ||
      isCorrect !== null
    ) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(previous => {
        if (previous <= 1) {
          handleAnswer(null);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    isPlaying,
    selectedLevel,
    puzzle,
    isFinished,
    isCorrect,
  ]);

  /*
   * Complete level
   */
  const completeLevel = (
    finalScore: number
  ) => {
    if (!selectedLevel) return;

    setIsPlaying(false);
    setIsFinished(true);
    setLastScore(finalScore);

    setData(previous => {
      const nextUnlocked = Math.min(
        20,
        Math.max(
          previous.unlockedLevel,
          selectedLevel.level + 1
        )
      );

      return {
        ...previous,
        unlockedLevel: nextUnlocked,
        bestScore: Math.max(
          previous.bestScore,
          finalScore
        ),
        totalGames:
          previous.totalGames + 1,
      };
    });

    earnXP(
      selectedLevel.xp,
      `Mind Maze - Level ${selectedLevel.level}`
    );
  };

  /*
   * Answer puzzle
   */
  const handleAnswer = (
    answer: string | null
  ) => {
    if (
      !puzzle ||
      !selectedLevel ||
      isCorrect !== null
    ) {
      return;
    }

    const correct =
      answer === puzzle.answer;

    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowExplanation(true);

    if (correct) {
      const timeBonus =
        timeLeft * 5;

      const comboBonus =
        combo * 10;

      const points =
        100 +
        timeBonus +
        comboBonus +
        selectedLevel.level * 10;

      setLastScore(points);

      setScore(previous => {
        const newScore =
          previous + points;

        return newScore;
      });

      setCombo(previous => previous + 1);

      setData(previous => ({
        ...previous,
        totalSolved:
          previous.totalSolved + 1,
      }));

      setTimeout(() => {
        moveToNextPuzzle();
      }, 1300);
    } else {
      setLives(previous => {
        const remaining = previous - 1;

        if (remaining <= 0) {
          setTimeout(() => {
            completeLevel(score);
          }, 1000);
        }

        return remaining;
      });

      setCombo(0);

      if (lives > 1) {
        setTimeout(() => {
          moveToNextPuzzle();
        }, 1600);
      }
    }
  };

  /*
   * Move to next puzzle
   */
  const moveToNextPuzzle = () => {
    if (!selectedLevel) return;

    if (
      puzzleNumber >=
      selectedLevel.puzzles
    ) {
      setScore(currentScore => {
        completeLevel(currentScore);
        return currentScore;
      });

      return;
    }

    createPuzzle(
      selectedLevel,
      puzzleNumber + 1
    );
  };

  /*
   * Restart level
   */
  const restartLevel = () => {
    if (!selectedLevel) return;

    startLevel(selectedLevel);
  };

  /*
   * Return to menu
   */
  const backToLevels = () => {
    setSelectedLevel(null);
    setPuzzle(null);
    setIsPlaying(false);
    setIsFinished(false);
  };

  /*
   * Achievements
   */
  useEffect(() => {
    const achievements = [
      ...data.achievements,
    ];

    let unlocked: string | null = null;

    if (
      data.totalSolved >= 1 &&
      !achievements.includes(
        'First Puzzle'
      )
    ) {
      achievements.push('First Puzzle');
      unlocked = '🧩 First Puzzle';
    }

    if (
      data.totalSolved >= 25 &&
      !achievements.includes(
        'Puzzle Hunter'
      )
    ) {
      achievements.push('Puzzle Hunter');
      unlocked = '🎯 Puzzle Hunter';
    }

    if (
      data.totalSolved >= 50 &&
      !achievements.includes(
        'Brain Trainer'
      )
    ) {
      achievements.push('Brain Trainer');
      unlocked = '🧠 Brain Trainer';
    }

    if (
      data.unlockedLevel >= 10 &&
      !achievements.includes(
        'Halfway There'
      )
    ) {
      achievements.push('Halfway There');
      unlocked = '🔥 Halfway There';
    }

    if (
      data.unlockedLevel >= 20 &&
      !achievements.includes(
        'Mind Maze Master'
      )
    ) {
      achievements.push(
        'Mind Maze Master'
      );
      unlocked = '🏆 Mind Maze Master';
    }

    if (
      data.bestScore >= 5000 &&
      !achievements.includes(
        'High Scorer'
      )
    ) {
      achievements.push('High Scorer');
      unlocked = '⚡ High Scorer';
    }

    if (
      achievements.length !==
      data.achievements.length
    ) {
      setData(previous => ({
        ...previous,
        achievements,
      }));

      setAchievement(unlocked);

      setTimeout(() => {
        setAchievement(null);
      }, 4000);
    }
  }, [
    data.totalSolved,
    data.unlockedLevel,
    data.bestScore,
  ]);

  /*
   * Difficulty color class
   */
  const difficultyClass = (
    difficulty: string
  ) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-100 text-emerald-700';

      case 'Normal':
        return 'bg-blue-100 text-blue-700';

      case 'Hard':
        return 'bg-orange-100 text-orange-700';

      case 'Expert':
        return 'bg-red-100 text-red-700';

      case 'Extreme':
        return 'bg-purple-100 text-purple-700';

      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  /*
   * LEVEL MENU
   */
  if (!selectedLevel) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-mello border border-purple-100">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">

          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </button>

          <button
            onClick={() =>
              setShowStats(!showStats)
            }
            className="px-3 py-2 rounded-xl bg-purple-50 text-purple-600 text-xs font-bold"
          >
            <Brain className="w-4 h-4 inline mr-1" />
            Stats
          </button>

        </div>

        {/* Title */}
        <div className="text-center mb-7">

          <motion.div
            animate={{
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center"
          >
            <Brain className="w-10 h-10 text-purple-600" />
          </motion.div>

          <h1 className="text-3xl font-extrabold font-heading text-slate-800">
            Mind Maze 🧩
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Challenge your logic, memory and
            pattern recognition.
          </p>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-6">

          <div className="p-3 bg-purple-50 rounded-2xl text-center">
            <Trophy className="w-5 h-5 mx-auto text-purple-500" />

            <p className="text-lg font-extrabold text-slate-800">
              {data.bestScore}
            </p>

            <p className="text-[10px] text-slate-500">
              Best Score
            </p>
          </div>

          <div className="p-3 bg-rose-50 rounded-2xl text-center">
            <Target className="w-5 h-5 mx-auto text-rose-500" />

            <p className="text-lg font-extrabold text-slate-800">
              {data.totalSolved}
            </p>

            <p className="text-[10px] text-slate-500">
              Solved
            </p>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl text-center">
            <Award className="w-5 h-5 mx-auto text-amber-500" />

            <p className="text-lg font-extrabold text-slate-800">
              {data.achievements.length}
            </p>

            <p className="text-[10px] text-slate-500">
              Achievements
            </p>
          </div>

        </div>

        {/* Stats panel */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: 'auto',
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="mb-5 p-4 bg-purple-50 rounded-2xl"
            >

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <p className="text-xs text-purple-500">
                    Levels Unlocked
                  </p>

                  <p className="text-xl font-bold text-purple-900">
                    {data.unlockedLevel}/20
                  </p>
                </div>

                <div>
                  <p className="text-xs text-purple-500">
                    Games Played
                  </p>

                  <p className="text-xl font-bold text-purple-900">
                    {data.totalGames}
                  </p>
                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Level list */}
        <div className="space-y-2">

          {LEVELS.map(level => {

            const unlocked =
              level.level <=
              data.unlockedLevel;

            const completed =
              level.level <
              data.unlockedLevel;

            return (
              <motion.button
                key={level.level}
                whileHover={{
                  scale: unlocked
                    ? 1.015
                    : 1,
                }}
                whileTap={{
                  scale: unlocked
                    ? 0.985
                    : 1,
                }}
                disabled={!unlocked}
                onClick={() => {
                  if (unlocked) {
                    startLevel(level);
                  }
                }}
                className={`w-full p-4 rounded-2xl border text-left transition-all ${
                  unlocked
                    ? 'bg-white border-slate-200 hover:border-purple-300 hover:bg-purple-50/40'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >

                <div className="flex items-center gap-4">

                  <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">

                    {unlocked ? (
                      completed ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <span className="font-extrabold text-purple-600">
                          {level.level}
                        </span>
                      )
                    ) : (
                      <Lock className="w-5 h-5 text-slate-400" />
                    )}

                  </div>

                  <div className="flex-1 min-w-0">

                    <div className="flex items-center gap-2">

                      <h3 className="font-bold text-slate-800">
                        {level.title}
                      </h3>

                      <span
                        className={`text-[9px] px-2 py-1 rounded-full font-bold ${difficultyClass(
                          level.difficulty
                        )}`}
                      >
                        {level.difficulty}
                      </span>

                    </div>

                    <div className="flex gap-3 mt-1 text-[10px] text-slate-400">

                      <span>
                        ⏱️ {level.time}s
                      </span>

                      <span>
                        🧩 {level.puzzles} puzzles
                      </span>

                      <span>
                        ✨ +{level.xp} XP
                      </span>

                    </div>

                  </div>

                  {unlocked && (
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  )}

                </div>

              </motion.button>
            );
          })}

        </div>

        {/* Achievements */}
        <div className="mt-6 p-4 bg-slate-50 rounded-2xl">

          <div className="flex items-center gap-2 mb-3">

            <Award className="w-5 h-5 text-amber-500" />

            <h3 className="font-bold text-slate-700">
              Achievements
            </h3>

            <span className="ml-auto text-xs text-slate-400">
              {data.achievements.length}/6
            </span>

          </div>

          <div className="flex flex-wrap gap-2">

            {[
              ['First Puzzle', '🧩'],
              ['Puzzle Hunter', '🎯'],
              ['Brain Trainer', '🧠'],
              ['Halfway There', '🔥'],
              ['Mind Maze Master', '🏆'],
              ['High Scorer', '⚡'],
            ].map(([name, icon]) => (

              <div
                key={name}
                className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                  data.achievements.includes(name)
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-white text-slate-400 border border-slate-200'
                }`}
              >
                {data.achievements.includes(name)
                  ? icon
                  : '🔒'}{' '}
                {name}
              </div>

            ))}

          </div>

        </div>

        <p className="text-center text-[11px] text-slate-400 mt-6">
          🧠 Think carefully • Beat the clock •
          Build your combo
        </p>

      </div>
    );
  }

  /*
   * COMPLETION SCREEN
   */
  if (isFinished) {
    const perfect =
      lives === 3;

    return (
      <div className="max-w-2xl mx-auto p-5 bg-white rounded-3xl shadow-mello border border-purple-100">

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="text-center py-8"
        >

          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
            className="w-24 h-24 mx-auto mb-5 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center"
          >
            <Trophy className="w-12 h-12 text-amber-500" />
          </motion.div>

          <h2 className="text-3xl font-extrabold font-heading text-slate-800">
            {lives > 0
              ? 'Puzzle Complete! 🧩'
              : 'Game Over'}
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Level {selectedLevel.level}:{' '}
            {selectedLevel.title}
          </p>

          {/* Score */}
          <div className="my-7 p-5 bg-purple-50 rounded-3xl">

            <p className="text-xs font-bold text-purple-500 uppercase tracking-wider">
              Final Score
            </p>

            <p className="text-5xl font-extrabold text-purple-700 mt-1">
              {lastScore}
            </p>

            {lastScore ===
              data.bestScore && (
              <div className="flex items-center justify-center gap-1 mt-2 text-amber-600 text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                New Best Score!
              </div>
            )}

          </div>

          <div className="grid grid-cols-3 gap-2 mb-6">

            <div className="p-3 bg-rose-50 rounded-2xl">
              <Heart className="w-5 h-5 mx-auto text-rose-500" />

              <p className="font-bold text-slate-800 mt-1">
                {lives}/3
              </p>

              <p className="text-[10px] text-slate-400">
                Lives
              </p>
            </div>

            <div className="p-3 bg-orange-50 rounded-2xl">
              <Flame className="w-5 h-5 mx-auto text-orange-500" />

              <p className="font-bold text-slate-800 mt-1">
                ×{combo}
              </p>

              <p className="text-[10px] text-slate-400">
                Combo
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl">
              <Sparkles className="w-5 h-5 mx-auto text-amber-500" />

              <p className="font-bold text-slate-800 mt-1">
                +{selectedLevel.xp}
              </p>

              <p className="text-[10px] text-slate-400">
                XP
              </p>
            </div>

          </div>

          {perfect && (
            <div className="mb-5 p-3 bg-emerald-50 rounded-2xl text-emerald-700 text-sm font-bold">
              🏆 Perfect Run! You kept all
              three lives.
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3">

            <button
              onClick={restartLevel}
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>

            <button
              onClick={backToLevels}
              className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold"
            >
              Level Select
            </button>

            {selectedLevel.level <
              20 &&
              selectedLevel.level <
                data.unlockedLevel && (
                <button
                  onClick={() =>
                    startLevel(
                      LEVELS[
                        selectedLevel.level
                      ]
                    )
                  }
                  className="px-5 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold flex items-center gap-2"
                >
                  Next Level
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

          </div>

        </motion.div>

      </div>
    );
  }

  /*
   * GAME SCREEN
   */
  if (!puzzle) {
    return null;
  }

  const progress =
    ((puzzleNumber - 1) /
      selectedLevel.puzzles) *
    100;

  const timerProgress =
    (timeLeft / selectedLevel.time) *
    100;

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-mello border border-purple-100 min-h-[580px]">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">

        <button
          onClick={backToLevels}
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Levels
        </button>

        <div className="flex items-center gap-2">

          <div className="px-3 py-1.5 bg-purple-50 rounded-full text-xs font-bold text-purple-700">
            Level {selectedLevel.level}
          </div>

          <div className="px-3 py-1.5 bg-amber-50 rounded-full text-xs font-bold text-amber-700">
            {score} pts
          </div>

        </div>

      </div>

      {/* Level title */}
      <div className="text-center mb-5">

        <div className="flex justify-center items-center gap-2">

          <Brain className="w-5 h-5 text-purple-500" />

          <h2 className="text-xl font-extrabold text-slate-800">
            {selectedLevel.title}
          </h2>

        </div>

        <p className="text-xs text-slate-400 mt-1">
          Puzzle {puzzleNumber} of{' '}
          {selectedLevel.puzzles}
        </p>

      </div>

      {/* Progress */}
      <div className="mb-5">

        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">

          <motion.div
            animate={{
              width: `${Math.min(
                100,
                progress
              )}%`,
            }}
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
          />

        </div>

      </div>

      {/* Game stats */}
      <div className="grid grid-cols-3 gap-2 mb-6">

        <div className="p-3 bg-rose-50 rounded-2xl text-center">

          <Heart className="w-4 h-4 mx-auto text-rose-500" />

          <div className="flex justify-center gap-0.5 mt-1">

            {[1, 2, 3].map(life => (
              <span
                key={life}
                className={
                  life <= lives
                    ? 'text-sm'
                    : 'text-sm opacity-20'
                }
              >
                ❤️
              </span>
            ))}

          </div>

          <p className="text-[9px] text-slate-400 mt-1">
            Lives
          </p>

        </div>

        <div className="p-3 bg-orange-50 rounded-2xl text-center">

          <Flame className="w-4 h-4 mx-auto text-orange-500" />

          <p className="font-extrabold text-slate-800">
            ×{Math.max(1, combo)}
          </p>

          <p className="text-[9px] text-slate-400">
            Combo
          </p>

        </div>

        <div className="p-3 bg-blue-50 rounded-2xl text-center">

          <Clock className="w-4 h-4 mx-auto text-blue-500" />

          <p
            className={`font-extrabold ${
              timeLeft <= 5
                ? 'text-red-500'
                : 'text-slate-800'
            }`}
          >
            {timeLeft}s
          </p>

          <p className="text-[9px] text-slate-400">
            Time
          </p>

        </div>

      </div>

      {/* Timer bar */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full mb-7 overflow-hidden">

        <motion.div
          animate={{
            width: `${timerProgress}%`,
          }}
          className={`h-full rounded-full ${
            timeLeft <= 5
              ? 'bg-red-500'
              : 'bg-blue-400'
          }`}
        />

      </div>

      {/* Puzzle */}
      <AnimatePresence mode="wait">

        <motion.div
          key={`${puzzleNumber}-${puzzle.question}`}
          initial={{
            opacity: 0,
            x: 30,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          exit={{
            opacity: 0,
            x: -30,
          }}
        >

          {/* Puzzle type */}
          <div className="flex justify-center mb-4">

            <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-500">

              {puzzle.type ===
                'sequence' &&
                '🔢 Number Sequence'}

              {puzzle.type === 'odd' &&
                '🎯 Odd One Out'}

              {puzzle.type ===
                'missing' &&
                '🧮 Missing Number'}

              {puzzle.type === 'logic' &&
                '🧠 Logic Puzzle'}

            </span>

          </div>

          {/* Question */}
          <div className="p-6 sm:p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border border-purple-100 mb-6 text-center">

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 whitespace-pre-line leading-relaxed">
              {puzzle.question}
            </h3>

          </div>

          {/* Answers */}
          <div className="grid grid-cols-2 gap-3">

            {puzzle.options.map(
              option => {

                const isSelected =
                  selectedAnswer ===
                  option;

                const isRight =
                  option ===
                  puzzle.answer;

                let buttonClass =
                  'bg-white border-slate-200 hover:border-purple-300 hover:bg-purple-50';

                if (
                  isCorrect !== null
                ) {
                  if (isRight) {
                    buttonClass =
                      'bg-emerald-50 border-emerald-400 text-emerald-700';
                  } else if (
                    isSelected
                  ) {
                    buttonClass =
                      'bg-red-50 border-red-400 text-red-700';
                  } else {
                    buttonClass =
                      'bg-slate-50 border-slate-200 opacity-50';
                  }
                }

                return (
                  <motion.button
                    key={option}
                    whileHover={{
                      scale:
                        isCorrect === null
                          ? 1.02
                          : 1,
                    }}
                    whileTap={{
                      scale:
                        isCorrect === null
                          ? 0.98
                          : 1,
                    }}
                    disabled={
                      isCorrect !== null
                    }
                    onClick={() =>
                      handleAnswer(option)
                    }
                    className={`min-h-[64px] rounded-2xl border-2 font-extrabold text-lg transition-all ${buttonClass}`}
                  >
                    <span className="flex items-center justify-center gap-2">

                      {isCorrect !==
                        null &&
                        isRight && (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        )}

                      {isCorrect !==
                        null &&
                        isSelected &&
                        !isRight && (
                          <span>
                            ❌
                          </span>
                        )}

                      {option}

                    </span>
                  </motion.button>
                );
              }
            )}

          </div>

          {/* Result */}
          <AnimatePresence>

            {isCorrect !== null && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className={`mt-5 p-4 rounded-2xl ${
                  isCorrect
                    ? 'bg-emerald-50 border border-emerald-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >

                <div className="flex items-start gap-3">

                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                  ) : (
                    <Zap className="w-5 h-5 text-red-500 mt-0.5" />
                  )}

                  <div>

                    <p
                      className={`font-bold ${
                        isCorrect
                          ? 'text-emerald-700'
                          : 'text-red-700'
                      }`}
                    >
                      {isCorrect
                        ? `Correct! +${lastScore} points`
                        : `Wrong! The answer is ${puzzle.answer}`}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {puzzle.explanation}
                    </p>

                  </div>

                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </motion.div>

      </AnimatePresence>

      {/* Bottom hint */}
      <div className="flex items-center justify-center gap-2 mt-7 text-[11px] text-slate-400">

        <Sparkles className="w-3.5 h-3.5" />

        {isCorrect === null
          ? 'Think carefully — speed gives bonus points!'
          : 'Next puzzle coming up...'}

      </div>

      {/* Achievement popup */}
      <AnimatePresence>

        {achievement && (
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              x: '-50%',
            }}
            animate={{
              opacity: 1,
              y: 0,
              x: '-50%',
            }}
            exit={{
              opacity: 0,
              y: 30,
              x: '-50%',
            }}
            className="fixed bottom-6 left-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-bold"
          >

            <Award className="w-5 h-5 text-amber-400" />

            Achievement Unlocked:{' '}
            {achievement}

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};

export default MindMaze;