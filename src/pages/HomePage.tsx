import React, { useEffect, useMemo, useState } from 'react';

import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  ChevronDown,
  Flame,
  Gamepad2,
  Heart,
  MessageCircle,
  Play,
  Sparkles,
  Target,
  Wind,
} from 'lucide-react';

import { useApp } from '../context/AppContext';

import {
  getSavedMoods,
  getTodayMood,
  saveMood,
  type SavedMood,
} from '../services/moodservice';

import {
  aiService,
} from '../services/aiService';

/* ============================================================
   TYPES
============================================================ */

interface MoodOption {
  label: string;
  emoji: string;
}

interface RecommendationCardProps {
  title: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  bg: string;
  border: string;
  text: string;
  buttonBg: string;
  onClick: () => void;
}

interface TrendPoint {
  day: string;
  level: number;
  emoji: string;
}

/* ============================================================
   MOOD OPTIONS
============================================================ */

const moodOptions: MoodOption[] = [
  {
    label: 'Great',
    emoji: '😄',
  },
  {
    label: 'Good',
    emoji: '🙂',
  },
  {
    label: 'Okay',
    emoji: '😐',
  },
  {
    label: 'Low',
    emoji: '😔',
  },
  {
    label: 'Stressed',
    emoji: '😣',
  },
];

/* ============================================================
   HELPERS
============================================================ */

const getMoodText = (mood: SavedMood): string => {
  return mood.emotion || mood.mood || 'Okay';
};

const getMoodEmoji = (mood: string): string => {
  const value = String(mood || '').toLowerCase();

  if (
    value.includes('great') ||
    value.includes('happy') ||
    value.includes('joy') ||
    value.includes('excited')
  ) {
    return '😄';
  }

  if (
    value.includes('good') ||
    value.includes('positive')
  ) {
    return '🙂';
  }

  if (
    value.includes('calm') ||
    value.includes('relaxed') ||
    value.includes('peace')
  ) {
    return '😌';
  }

  if (
    value.includes('sad') ||
    value.includes('low') ||
    value.includes('down')
  ) {
    return '😔';
  }

  if (
    value.includes('stress') ||
    value.includes('angry') ||
    value.includes('frustrat')
  ) {
    return '😣';
  }

  if (
    value.includes('anxious') ||
    value.includes('anxiety') ||
    value.includes('worried') ||
    value.includes('fear')
  ) {
    return '😟';
  }

  return '😐';
};

const getMoodLevel = (mood: string): number => {
  const value = String(mood || '').toLowerCase();

  if (
    value.includes('great') ||
    value.includes('happy') ||
    value.includes('joy') ||
    value.includes('excited')
  ) {
    return 4;
  }

  if (
    value.includes('good') ||
    value.includes('calm') ||
    value.includes('relaxed') ||
    value.includes('positive')
  ) {
    return 3;
  }

  if (
    value.includes('okay') ||
    value.includes('neutral') ||
    value.includes('normal')
  ) {
    return 2;
  }

  if (
    value.includes('low') ||
    value.includes('sad') ||
    value.includes('down')
  ) {
    return 1;
  }

  if (
    value.includes('stress') ||
    value.includes('angry') ||
    value.includes('anxious') ||
    value.includes('worried')
  ) {
    return 0;
  }

  return 2;
};

/* ============================================================
   LOCAL DATE HELPER
============================================================ */

const getLocalDate = (dateValue?: string | Date): string => {
  const date = dateValue
    ? new Date(dateValue)
    : new Date();

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    date.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/* ============================================================
   FORMAT DAY
============================================================ */

const formatDay = (
  dateValue: string | undefined
): string => {
  if (!dateValue) {
    return '';
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString(
    'en-US',
    {
      weekday: 'short',
    }
  );
};

/* ============================================================
   WELLNESS SCORE FROM AI MOOD
============================================================ */

const getWellnessScore = (
  mood: string,
  confidence: number
): number => {
  const value = String(mood || '').toLowerCase();

  let baseScore = 70;

  if (
    value.includes('great') ||
    value.includes('happy') ||
    value.includes('joy') ||
    value.includes('excited')
  ) {
    baseScore = 92;
  } else if (
    value.includes('good') ||
    value.includes('calm') ||
    value.includes('relaxed') ||
    value.includes('positive')
  ) {
    baseScore = 82;
  } else if (
    value.includes('okay') ||
    value.includes('neutral') ||
    value.includes('normal')
  ) {
    baseScore = 70;
  } else if (
    value.includes('low') ||
    value.includes('sad') ||
    value.includes('down')
  ) {
    baseScore = 55;
  } else if (
    value.includes('stress') ||
    value.includes('angry') ||
    value.includes('anxious') ||
    value.includes('worried')
  ) {
    baseScore = 48;
  }

  const confidenceAdjustment =
    (confidence - 50) * 0.08;

  return Math.round(
    Math.min(
      100,
      Math.max(
        0,
        baseScore + confidenceAdjustment
      )
    )
  );
};

/* ============================================================
   RECOMMENDATION CARD
============================================================ */

const RecommendationCard: React.FC<
  RecommendationCardProps
> = ({
  title,
  category,
  description,
  icon,
  bg,
  border,
  text,
  buttonBg,
  onClick,
}) => {
  return (
    <div
      className={`
        group
        flex
        min-h-[124px]
        items-center
        gap-4
        rounded-2xl
        border
        p-4
        transition
        duration-200
        hover:-translate-y-1
        hover:shadow-lg
        ${bg}
        ${border}
      `}
    >
      <div
        className="
          flex
          h-20
          w-20
          shrink-0
          items-center
          justify-center
          rounded-2xl
          bg-white/70
        "
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-black ${text}`}
        >
          {title}
        </p>

        <p className="mt-1 text-[10px] font-semibold text-slate-500">
          {category}
        </p>

        <p className="mt-1 text-[11px] leading-4 text-slate-600">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onClick}
        className={`
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-full
          text-white
          shadow-md
          transition
          hover:scale-105
          ${buttonBg}
        `}
        aria-label={`Start ${title}`}
      >
        <Play className="ml-0.5 h-4 w-4 fill-current" />
      </button>
    </div>
  );
};

/* ============================================================
   HOME PAGE
============================================================ */

export const HomePage: React.FC = () => {
  const {
    user,
    journals,
    navigate,
  } = useApp();

  /* ==========================================================
     AI MOOD STATE
  ========================================================== */

  const [aiMood, setAiMood] =
    useState<SavedMood | null>(() => {
      try {
        return getTodayMood();
      } catch {
        return null;
      }
    });

  const [allMoods, setAllMoods] =
    useState<SavedMood[]>(() => {
      try {
        return getSavedMoods();
      } catch {
        return [];
      }
    });

  const [selectedMood, setSelectedMood] =
    useState('');

  const [moodText, setMoodText] =
    useState('');

  const [isDetecting, setIsDetecting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState('');

  /*
   * Used only to force HomePage to recalculate
   * activity/journal goals when another page
   * updates them.
   */
  const [, setGoalRefresh] =
    useState(0);

  /* ==========================================================
     TODAY
  ========================================================== */

  const today = getLocalDate();

  /* ==========================================================
     LOAD AI MOOD FROM MOOD SERVICE
  ========================================================== */

  useEffect(() => {
    const loadMood = () => {
      try {
        const todayMood =
          getTodayMood();

        const savedMoods =
          getSavedMoods();

        setAiMood(todayMood);
        setAllMoods(savedMoods);

        if (todayMood) {
          setSelectedMood(
            todayMood.emotion ||
              todayMood.mood ||
              ''
          );
        }
      } catch (error) {
        console.error(
          'Unable to load mood:',
          error
        );

        setAiMood(null);
        setAllMoods([]);
      }
    };

    loadMood();

    window.addEventListener(
      'mello:mood-updated',
      loadMood
    );

    window.addEventListener(
      'storage',
      loadMood
    );

    return () => {
      window.removeEventListener(
        'mello:mood-updated',
        loadMood
      );

      window.removeEventListener(
        'storage',
        loadMood
      );
    };
  }, []);

  /* ==========================================================
     REFRESH GOALS
  ========================================================== */

  useEffect(() => {
    const refreshGoals = () => {
      setGoalRefresh(
        (value) => value + 1
      );
    };

    window.addEventListener(
      'storage',
      refreshGoals
    );

    window.addEventListener(
      'mello:goal-updated',
      refreshGoals
    );

    window.addEventListener(
      'mello:activity-completed',
      refreshGoals
    );

    window.addEventListener(
      'mello:journal-updated',
      refreshGoals
    );

    return () => {
      window.removeEventListener(
        'storage',
        refreshGoals
      );

      window.removeEventListener(
        'mello:goal-updated',
        refreshGoals
      );

      window.removeEventListener(
        'mello:activity-completed',
        refreshGoals
      );

      window.removeEventListener(
        'mello:journal-updated',
        refreshGoals
      );
    };
  }, []);

  /* ==========================================================
     CURRENT MOOD
  ========================================================== */

  const currentMood =
    aiMood
      ? getMoodText(aiMood)
      : 'Not Checked';

  const currentEmoji =
    aiMood?.emoji ||
    getMoodEmoji(currentMood);

  /* ==========================================================
     AI CONFIDENCE
  ========================================================== */

  const confidence =
    aiMood
      ? Math.min(
          100,
          Math.max(
            0,
            Math.round(
              Number(
                aiMood.confidence
              ) || 0
            )
          )
        )
      : 0;

  /* ==========================================================
     WELLNESS SCORE
  ========================================================== */

  const wellnessScore =
    useMemo(() => {
      if (!aiMood) {
        return 0;
      }

      return getWellnessScore(
        currentMood,
        confidence
      );
    }, [
      aiMood,
      currentMood,
      confidence,
    ]);

  /* ==========================================================
     WELLNESS LABEL
  ========================================================== */

  const wellnessLabel =
    useMemo(() => {
      if (!aiMood) {
        return 'Not checked';
      }

      if (wellnessScore >= 90) {
        return 'Excellent';
      }

      if (wellnessScore >= 75) {
        return 'Good';
      }

      if (wellnessScore >= 60) {
        return 'Steady';
      }

      if (wellnessScore >= 45) {
        return 'Needs Care';
      }

      return 'Take a Pause';
    }, [
      aiMood,
      wellnessScore,
    ]);

  /* ==========================================================
     JOURNAL GOAL
     
     A journal entry made today counts as
     one completed daily goal.
  ========================================================== */

  const journalCompleted =
    journals?.some((journal) => {
      if (!journal?.date) {
        return false;
      }

      /*
       * Compare calendar dates instead of raw
       * strings so timestamps also work correctly.
       */
      return (
        getLocalDate(
          journal.date
        ) === today
      );
    }) ?? false;

  /* ==========================================================
     ACTIVITY GOAL
  ========================================================== */

  const activityCompleted =
    typeof window !== 'undefined'
      ? window.localStorage.getItem(
          'mello_daily_activity'
        ) === today
      : false;

  /* ==========================================================
     MOOD GOAL
     
     Completing AI mood detection today
     completes the mood goal.
  ========================================================== */

  const moodGoalCompleted =
    Boolean(aiMood);

  /* ==========================================================
     TOTAL GOALS
  ========================================================== */

  const completedGoals =
    Number(moodGoalCompleted) +
    Number(journalCompleted) +
    Number(activityCompleted);

  /* ==========================================================
     GOAL PROGRESS
  ========================================================== */

  const goalProgress =
    Math.round(
      (completedGoals / 3) * 100
    );

  /* ==========================================================
     GOAL STATUS TEXT
  ========================================================== */

  const goalStatusText =
    completedGoals === 3
      ? 'All daily goals completed!'
      : `${completedGoals}/3 daily goals completed`;

  /* ==========================================================
     AI GOAL ASSISTANCE

     Uses the user's current AI-detected mood and today's
     progress to suggest one small, realistic goal.
     The panel is an overlay, so it does NOT change the
     size of the four dashboard boxes.
  ========================================================== */

  const [showAIGoal, setShowAIGoal] =
    useState(false);

  const [aiGoal, setAIGoal] =
    useState(() => {
      if (typeof window === 'undefined') return '';
      return window.localStorage.getItem(
        'mello_ai_daily_goal'
      ) || '';
    });

  const [isGeneratingGoal, setIsGeneratingGoal] =
    useState(false);

  const generateAIGoal = () => {
    setIsGeneratingGoal(true);

    window.setTimeout(() => {
      const mood = String(
        currentMood || ''
      ).toLowerCase();

      let goal = '';

      if (mood.includes('stress') ||
          mood.includes('anxious') ||
          mood.includes('worried') ||
          mood.includes('angry')) {
        goal = 'Take 5 minutes to breathe and reset.';
      } else if (mood.includes('sad') ||
                 mood.includes('low') ||
                 mood.includes('down')) {
        goal = 'Write one kind thought about yourself today.';
      } else if (mood.includes('great') ||
                 mood.includes('happy') ||
                 mood.includes('good')) {
        goal = 'Use your positive energy for one healthy activity.';
      } else if (!journalCompleted) {
        goal = 'Write a short journal entry about how you feel.';
      } else if (!activityCompleted) {
        goal = 'Complete one 5-minute wellness activity.';
      } else {
        goal = 'Take a mindful 5-minute break for yourself.';
      }

      setAIGoal(goal);
      window.localStorage.setItem(
        'mello_ai_daily_goal',
        goal
      );
      setIsGeneratingGoal(false);
      setShowAIGoal(true);
    }, 350);
  };

  /* ==========================================================
     STREAK
     
     Streak is calculated ONLY from saved AI moods.
  ========================================================== */

  const streak = useMemo(() => {
    if (!allMoods.length) {
      return 0;
    }

    const dates = Array.from(
      new Set(
        allMoods
          .map(
            (item) =>
              getLocalDate(item.date)
          )
          .filter(Boolean)
      )
    ).sort(
      (a, b) =>
        new Date(b).getTime() -
        new Date(a).getTime()
    );

    if (!dates.length) {
      return 0;
    }

    const todayDate =
      new Date();

    todayDate.setHours(
      0,
      0,
      0,
      0
    );

    let currentStreak = 0;

    for (
      let i = 0;
      i < dates.length;
      i += 1
    ) {
      const expectedDate =
        new Date(todayDate);

      expectedDate.setDate(
        todayDate.getDate() - i
      );

      const expected =
        getLocalDate(
          expectedDate
        );

      if (
        dates.includes(expected)
      ) {
        currentStreak += 1;
      } else {
        break;
      }
    }

    return currentStreak;
  }, [allMoods]);

  /* ==========================================================
     MOOD TREND
  ========================================================== */

  const trendMoods =
    useMemo<TrendPoint[]>(() => {
      if (!allMoods.length) {
        return [
          {
            day: 'Mon',
            level: 2,
            emoji: '😐',
          },
          {
            day: 'Tue',
            level: 2,
            emoji: '😐',
          },
          {
            day: 'Wed',
            level: 2,
            emoji: '😐',
          },
          {
            day: 'Thu',
            level: 2,
            emoji: '😐',
          },
          {
            day: 'Fri',
            level: 2,
            emoji: '😐',
          },
          {
            day: 'Sat',
            level: 2,
            emoji: '😐',
          },
          {
            day: 'Sun',
            level: 2,
            emoji: '😐',
          },
        ];
      }

      const latest =
        allMoods
          .slice()
          .sort(
            (a, b) =>
              new Date(
                a.date
              ).getTime() -
              new Date(
                b.date
              ).getTime()
          )
          .slice(-7);

      const result =
        latest.map(
          (item) => {
            const mood =
              getMoodText(item);

            return {
              day:
                formatDay(
                  item.date
                ) || 'Day',

              level:
                getMoodLevel(
                  mood
                ),

              emoji:
                item.emoji ||
                getMoodEmoji(
                  mood
                ),
            };
          }
        );

      while (
        result.length < 7
      ) {
        result.unshift({
          day: '',
          level: 2,
          emoji: '😐',
        });
      }

      return result.slice(-7);
    }, [allMoods]);

  /* ==========================================================
     CHART POINTS
  ========================================================== */

  const chartPoints =
    useMemo(() => {
      const width = 470;
      const height = 180;

      const left = 30;
      const right = 10;
      const top = 15;
      const bottom = 25;

      const usableWidth =
        width -
        left -
        right;

      const usableHeight =
        height -
        top -
        bottom;

      return trendMoods.map(
        (item, index) => {
          const x =
            left +
            (index *
              usableWidth) /
              6;

          const y =
            top +
            ((4 -
              item.level) *
              usableHeight) /
              4;

          return {
            ...item,
            x,
            y,
          };
        }
      );
    }, [trendMoods]);

  /* ==========================================================
     CHART LINE
  ========================================================== */

  const chartLine =
    useMemo(() => {
      if (!chartPoints.length) {
        return '';
      }

      let path =
        `M ${chartPoints[0].x} ${chartPoints[0].y}`;

      for (
        let i = 1;
        i < chartPoints.length;
        i += 1
      ) {
        const previous =
          chartPoints[i - 1];

        const current =
          chartPoints[i];

        const midX =
          (previous.x +
            current.x) /
          2;

        path +=
          ` C ${midX} ${previous.y}, ${midX} ${current.y}, ${current.x} ${current.y}`;
      }

      return path;
    }, [chartPoints]);

  /* ==========================================================
     CHART AREA
  ========================================================== */

  const chartArea =
    chartPoints.length > 0
      ? `
        ${chartLine}
        L ${
          chartPoints[
            chartPoints.length - 1
          ].x
        } 155
        L ${chartPoints[0].x} 155
        Z
      `
      : '';

  /* ==========================================================
     AI DETECTION
  ========================================================== */

  const handleDetectMood =
    async () => {
      const text =
        moodText.trim();

      /*
       * If the user writes something,
       * use the written text.
       *
       * Otherwise use the selected mood.
       */
      const input =
        text ||
        selectedMood;

      if (!input) {
        setErrorMessage(
          'Please select a mood or write how you are feeling.'
        );

        return;
      }

      setErrorMessage('');
      setIsDetecting(true);

      try {
        /*
         * IMPORTANT:
         * Send `input`, not only `moodText`.
         *
         * This allows buttons like "Great"
         * to work even when the textarea is empty.
         */
        const result =
          await aiService.detectMood(
            input
          );

        /*
         * Save AI result.
         */
        const savedMood =
          saveMood(result);

        /*
         * Update HomePage immediately.
         */
        setAiMood(
          savedMood
        );

        setAllMoods(
          getSavedMoods()
        );

        setSelectedMood(
          savedMood.emotion ||
            savedMood.mood ||
            ''
        );

        setMoodText('');

        /*
         * Tell the Goals card and
         * other components that the
         * mood goal has changed.
         */
        window.dispatchEvent(
          new Event(
            'mello:mood-updated'
          )
        );

        window.dispatchEvent(
          new Event(
            'mello:goal-updated'
          )
        );

      } catch (error) {
        console.error(
          'AI mood detection failed:',
          error
        );

        setErrorMessage(
          'Mood detection failed. Please try again.'
        );
      } finally {
        setIsDetecting(false);
      }
    };

  /* ==========================================================
     AI INSIGHT
  ========================================================== */

  const aiInsight =
    aiMood
      ? `AI detected ${currentMood} with ${confidence}% confidence. Your wellness score is ${wellnessScore}/100.`
      : 'Tell Mello how you are feeling and AI will detect your mood and update your wellness dashboard.';

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="min-h-screen bg-[#fbfaff] px-4 py-5 text-[#17152b] sm:px-6 lg:px-8">

      <div className="mx-auto max-w-[1220px]">

        {/* ==================================================
            HERO
        ================================================== */}

        <section className="relative overflow-hidden rounded-[28px] border border-purple-100 bg-gradient-to-br from-white via-[#fcf9ff] to-[#f1e8ff] px-7 py-7 shadow-[0_12px_40px_rgba(124,58,237,0.08)] sm:px-9">

          <div className="pointer-events-none absolute -right-24 -top-28 h-[300px] w-[300px] rounded-full bg-purple-100/70" />

          <div className="pointer-events-none absolute right-24 top-20 h-28 w-28 rounded-full bg-fuchsia-100/80" />

          <div className="relative z-10">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <h1 className="text-3xl font-black tracking-tight text-[#111326] sm:text-[32px]">

                  Good evening,{' '}

                  {user?.name ||
                    'Google User'}!{' '}

                  <span>
                    👋
                  </span>

                </h1>

                <p className="mt-2 text-sm font-medium text-[#65618b] sm:text-base">

                  Here&apos;s your AI-powered wellness snapshot for today.

                </p>

              </div>

              <div className="hidden pr-8 lg:block">

                <div className="relative flex h-28 w-36 items-center justify-center">

                  <div className="absolute h-28 w-28 rounded-full bg-purple-200/70" />

                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#b78aff] to-[#7c2cff] text-4xl shadow-[0_12px_25px_rgba(124,44,255,0.3)]">

                    🤖

                  </div>

                  <span className="absolute -right-1 top-1 text-xl">
                    💗
                  </span>

                  <span className="absolute bottom-0 left-0 text-xl">
                    ✨
                  </span>

                </div>

              </div>

            </div>

            {/* ==================================================
                LIVE AI STATS
            ================================================== */}

            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              {/* MOOD */}

              <div className="rounded-2xl border border-purple-100 bg-white/90 p-5 shadow-sm">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <Heart className="h-5 w-5 fill-purple-600 text-purple-600" />

                    <span className="text-sm font-black text-purple-950">
                      Mood
                    </span>

                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-2xl">

                    {currentEmoji}

                  </div>

                </div>

                <p className="mt-5 text-2xl font-black text-purple-600">

                  {currentMood}

                </p>

                <p className="mt-1 text-xs text-slate-500">

                  {aiMood
                    ? `${confidence}% AI confidence`
                    : 'Waiting for AI detection'}

                </p>

              </div>

              {/* WELLNESS */}

              <div className="rounded-2xl border border-purple-100 bg-white/90 p-5 shadow-sm">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <Brain className="h-5 w-5 text-purple-600" />

                    <span className="text-sm font-black text-purple-950">
                      Wellness Score
                    </span>

                  </div>

                  <div className="relative h-14 w-14">

                    <svg
                      className="h-14 w-14 -rotate-90"
                      viewBox="0 0 50 50"
                    >

                      <circle
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        stroke="#eee8ff"
                        strokeWidth="6"
                      />

                      <circle
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        stroke="#7c2cff"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray="125.6"
                        strokeDashoffset={
                          125.6 -
                          (125.6 *
                            wellnessScore) /
                            100
                        }
                      />

                    </svg>

                  </div>

                </div>

                <p className="mt-4 text-2xl font-black text-purple-600">

                  {aiMood
                    ? wellnessScore
                    : '—'}

                  {aiMood && (
                    <span className="text-base">
                      /100
                    </span>
                  )}

                </p>

                <p className="mt-1 text-xs font-semibold text-emerald-600">

                  {aiMood
                    ? wellnessLabel
                    : 'Run AI detection'}

                </p>

              </div>

              {/* ==================================================
                  GOALS
              ================================================== */}

              <div className="relative rounded-2xl border border-purple-100 bg-white/90 p-5 shadow-sm">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <Target className="h-5 w-5 text-emerald-600" />

                    <span className="text-sm font-black text-purple-950">
                      Goals
                    </span>

                    {/* AI GOAL ASSISTANCE BUTTON */}
                    <button
                      type="button"
                      onClick={generateAIGoal}
                      disabled={isGeneratingGoal}
                      title="Get AI Goal Assistance"
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-600 transition hover:scale-105 hover:bg-purple-200 disabled:opacity-60"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                    </button>

                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">

                    <Target className="h-9 w-9 text-emerald-400" />

                  </div>

                </div>

                <p className="mt-4 text-2xl font-black text-purple-600">

                  {completedGoals}

                  <span className="text-base">
                    /3
                  </span>

                </p>

                <p className="mt-1 text-xs text-slate-500">

                  {completedGoals === 3
                    ? 'All daily goals completed!'
                    : goalStatusText}

                </p>

                {/* GOAL PROGRESS BAR */}

                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{
                      width: `${goalProgress}%`,
                    }}
                  />

                </div>

                {/* AI GOAL OVERLAY - DOES NOT CHANGE BOX SIZE */}
                {showAIGoal && (
                  <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-[280px] rounded-2xl border border-purple-200 bg-white p-4 shadow-xl">

                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                      </div>

                      <div>
                        <p className="text-xs font-black text-purple-900">
                          AI Goal Assistance
                        </p>
                        <p className="text-[9px] text-slate-500">
                          Personalized for you
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-xs font-semibold leading-5 text-slate-700">
                      {isGeneratingGoal
                        ? 'Creating your goal...'
                        : aiGoal || 'Tap the ✨ button for a personalized goal.'}
                    </p>

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={generateAIGoal}
                        className="flex-1 rounded-lg bg-purple-600 px-3 py-2 text-[10px] font-black text-white hover:bg-purple-700"
                      >
                        {isGeneratingGoal ? 'Creating...' : 'New AI Goal'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowAIGoal(false)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-bold text-slate-600 hover:bg-slate-50"
                      >
                        Close
                      </button>
                    </div>

                  </div>
                )}

              </div>

              {/* STREAK */}

              <div className="rounded-2xl border border-purple-100 bg-white/90 p-5 shadow-sm">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <Flame className="h-5 w-5 fill-orange-500 text-orange-500" />

                    <span className="text-sm font-black text-purple-950">
                      Streak
                    </span>

                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-3xl">
                    🔥
                  </div>

                </div>

                <p className="mt-4 text-2xl font-black text-orange-500">

                  {streak}{' '}

                  {streak === 1
                    ? 'day'
                    : 'days'}

                </p>

                <p className="mt-1 text-xs text-slate-500">
                  AI mood check-in streak
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ==================================================
            AI MOOD DETECTION + TREND
        ================================================== */}

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.03fr_1fr]">

          {/* AI DETECTION */}

          <div className="rounded-[24px] border border-purple-100 bg-white p-5 shadow-[0_8px_30px_rgba(124,58,237,0.05)] sm:p-6">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white shadow-lg shadow-purple-200">

                <Brain className="h-6 w-6" />

              </div>

              <div>

                <div className="flex items-center gap-2">

                  <h2 className="text-lg font-black text-slate-900">
                    AI Mood Detection
                  </h2>

                  <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[9px] font-black text-purple-600">
                    AI
                  </span>

                </div>

                <p className="mt-0.5 text-xs text-[#716d96]">
                  Let Mello understand how you&apos;re feeling
                </p>

              </div>

            </div>

            <div className="mt-5">

              <p className="mb-2 text-xs font-semibold text-[#403c66]">
                How are you feeling today?
              </p>

              {/* MOOD OPTIONS */}

              <div className="flex flex-wrap gap-2">

                {moodOptions.map(
                  (option) => {

                    const active =
                      selectedMood.toLowerCase() ===
                      option.label.toLowerCase();

                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() =>
                          setSelectedMood(
                            option.label
                          )
                        }
                        className={`
                          flex
                          items-center
                          gap-1.5
                          rounded-xl
                          border
                          px-3.5
                          py-2
                          text-xs
                          font-bold
                          transition
                          ${
                            active
                              ? 'border-purple-400 bg-purple-50 text-purple-700 shadow-sm'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-purple-200 hover:bg-purple-50'
                          }
                        `}
                      >

                        <span>
                          {option.emoji}
                        </span>

                        {option.label}

                      </button>
                    );

                  }
                )}

              </div>

              {/* TEXT INPUT */}

              <div className="relative mt-4 rounded-xl border border-slate-200 bg-white transition focus-within:border-purple-300 focus-within:ring-2 focus-within:ring-purple-50">

                <textarea
                  value={moodText}
                  onChange={(event) => {

                    setMoodText(
                      event.target.value.slice(
                        0,
                        500
                      )
                    );

                    if (
                      errorMessage
                    ) {
                      setErrorMessage(
                        ''
                      );
                    }

                  }}
                  placeholder="Write how you feel and let AI detect your mood..."
                  className="min-h-[90px] w-full resize-none rounded-xl bg-transparent p-3.5 pb-11 text-xs text-slate-700 outline-none placeholder:text-[#8984a7]"
                  maxLength={500}
                />

                <div className="absolute bottom-2.5 left-3.5 text-[10px] text-slate-500">

                  {moodText.length}/500 characters

                </div>

                <button
                  type="button"
                  onClick={
                    handleDetectMood
                  }
                  disabled={
                    isDetecting
                  }
                  className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-3.5 py-2 text-xs font-black text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >

                  <Sparkles className="h-3.5 w-3.5" />

                  {isDetecting
                    ? 'AI Detecting...'
                    : 'Detect My Mood'}

                </button>

              </div>

              {/* ERROR */}

              {errorMessage && (
                <div className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">

                  {errorMessage}

                </div>
              )}

              {/* AI INSIGHT */}

              <div className="mt-4 rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-fuchsia-50 p-3.5">

                <div className="flex gap-3">

                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />

                  <div className="min-w-0 flex-1">

                    <div className="flex items-center gap-2">

                      <span className="text-xs font-black text-purple-800">
                        AI Insight
                      </span>

                      <span className="rounded-full border border-purple-200 bg-white px-2 py-0.5 text-[9px] font-bold text-purple-600">
                        Live
                      </span>

                    </div>

                    <p className="mt-1 text-[11px] leading-4 text-[#625e85]">
                      {aiInsight}
                    </p>

                  </div>

                  {aiMood && (
                    <div className="hidden shrink-0 sm:block">

                      <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5">

                        <p className="text-[9px] font-semibold text-slate-600">
                          Confidence: {confidence}%
                        </p>

                        <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-slate-200">

                          <div
                            className="h-full rounded-full bg-emerald-500 transition-all"
                            style={{
                              width: `${confidence}%`,
                            }}
                          />

                        </div>

                      </div>

                    </div>
                  )}

                </div>

              </div>

              {/* CURRENT AI RESULT */}

              {aiMood && (
                <div className="mt-4 grid grid-cols-3 gap-2">

                  <div className="rounded-xl bg-purple-50 p-3 text-center">

                    <p className="text-[9px] font-black uppercase text-purple-500">
                      Mood
                    </p>

                    <p className="mt-1 text-sm font-black text-purple-900">

                      {currentEmoji}{' '}

                      {currentMood}

                    </p>

                  </div>

                  <div className="rounded-xl bg-fuchsia-50 p-3 text-center">

                    <p className="text-[9px] font-black uppercase text-fuchsia-500">
                      Wellness
                    </p>

                    <p className="mt-1 text-sm font-black text-fuchsia-900">
                      {wellnessScore}/100
                    </p>

                  </div>

                  <div className="rounded-xl bg-emerald-50 p-3 text-center">

                    <p className="text-[9px] font-black uppercase text-emerald-500">
                      Status
                    </p>

                    <p className="mt-1 text-sm font-black text-emerald-900">
                      Updated
                    </p>

                  </div>

                </div>
              )}

            </div>

          </div>

          {/* ==================================================
              MOOD TREND
          ================================================== */}

          <div className="rounded-[24px] border border-purple-100 bg-white p-5 shadow-[0_8px_30px_rgba(124,58,237,0.05)] sm:p-6">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white">

                  <BarChart3 className="h-5 w-5" />

                </div>

                <h2 className="text-lg font-black text-slate-900">
                  Mood Trend
                </h2>

              </div>

              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-purple-100 px-3 py-2 text-[10px] font-bold text-purple-800"
              >
                This Week

                <ChevronDown className="h-3 w-3" />

              </button>

            </div>

            <div className="mt-4">

              <div className="relative">

                <div className="absolute left-0 top-0 flex h-[180px] w-8 flex-col justify-between text-[9px] font-semibold text-slate-500">

                  <span>
                    Great
                  </span>

                  <span>
                    Good
                  </span>

                  <span>
                    Okay
                  </span>

                  <span>
                    Low
                  </span>

                  <span>
                    Stressed
                  </span>

                </div>

                <div className="ml-9 overflow-hidden">

                  <svg
                    viewBox="0 0 470 180"
                    className="h-[180px] w-full"
                    preserveAspectRatio="none"
                  >

                    {/* GRID */}

                    {[15, 50, 85, 120, 155].map(
                      (y) => (
                        <line
                          key={y}
                          x1="30"
                          y1={y}
                          x2="460"
                          y2={y}
                          stroke="#eeeef5"
                          strokeWidth="1"
                          strokeDasharray="3 3"
                        />
                      )
                    )}

                    {/* AREA */}

                    <path
                      d={chartArea}
                      fill="#7c2cff"
                      fillOpacity="0.10"
                    />

                    {/* LINE */}

                    <path
                      d={chartLine}
                      fill="none"
                      stroke="#7c2cff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* POINTS */}

                    {chartPoints.map(
                      (
                        point,
                        index
                      ) => (
                        <g
                          key={`${point.day}-${index}`}
                        >

                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="5"
                            fill="#7c2cff"
                            stroke="white"
                            strokeWidth="2"
                          />

                          <text
                            x={point.x}
                            y={
                              point.y -
                              9
                            }
                            textAnchor="middle"
                            fontSize="15"
                          >
                            {
                              point.emoji
                            }
                          </text>

                        </g>
                      )
                    )}

                    {/* X LABELS */}

                    {chartPoints.map(
                      (
                        point,
                        index
                      ) => (
                        <text
                          key={`label-${index}`}
                          x={point.x}
                          y="176"
                          textAnchor="middle"
                          fontSize="10"
                          fill="#55516f"
                        >
                          {point.day}
                        </text>
                      )
                    )}

                  </svg>

                </div>

              </div>

            </div>

            <div className="mt-2 rounded-xl bg-purple-50 px-4 py-3 text-center text-xs font-semibold text-purple-900">

              {aiMood
                ? `AI has recorded ${allMoods.length} mood ${
                    allMoods.length === 1
                      ? 'check-in'
                      : 'check-ins'
                  }.`
                : 'Complete your first AI mood detection to start your trend.'}

            </div>

          </div>

        </section>

        {/* ==================================================
            RECOMMENDED
        ================================================== */}

        <section className="mt-6">

          <div className="mb-3 flex items-center justify-between">

            <div className="flex items-center gap-2">

              <Sparkles className="h-5 w-5 text-amber-400" />

              <h2 className="text-base font-black text-slate-900">
                Recommended for you
              </h2>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  'activities'
                )
              }
              className="flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-800"
            >

              View all

              <ArrowRight className="h-3.5 w-3.5" />

            </button>

          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">

            <RecommendationCard
              title="5-min Calm Down"
              category="Breathing · 5 min"
              description="Reduce stress & relax your mind"
              icon={
                <Wind className="h-11 w-11 text-purple-600" />
              }
              bg="bg-[#f8f0ff]"
              border="border-purple-100"
              text="text-purple-700"
              buttonBg="bg-purple-600"
              onClick={() =>
                navigate(
                  'activities'
                )
              }
            />

            <RecommendationCard
              title="Mind Maze"
              category="Game · 10 min"
              description="Challenge your mind and have fun"
              icon={
                <Gamepad2 className="h-12 w-12 text-blue-600" />
              }
              bg="bg-[#eff7ff]"
              border="border-blue-100"
              text="text-blue-700"
              buttonBg="bg-blue-600"
              onClick={() =>
                navigate(
                  'games'
                )
              }
            />

            <RecommendationCard
              title="Gratitude Journal"
              category="Journal · 5 min"
              description="Write down 3 things you’re grateful for"
              icon={
                <BookOpen className="h-11 w-11 text-amber-600" />
              }
              bg="bg-[#f2fff3]"
              border="border-emerald-100"
              text="text-emerald-700"
              buttonBg="bg-emerald-600"
              onClick={() =>
                navigate(
                  'journal'
                )
              }
            />

            <RecommendationCard
              title="AI Mood Check-in"
              category="AI · 2 min"
              description="Use AI to understand your current emotional state"
              icon={
                <Heart className="h-11 w-11 fill-pink-400 text-pink-500" />
              }
              bg="bg-[#fff0f7]"
              border="border-pink-100"
              text="text-pink-700"
              buttonBg="bg-pink-600"
              onClick={() => {
                document
                  .querySelector(
                    'textarea'
                  )
                  ?.focus();
              }}
            />

          </div>

        </section>

        {/* ==================================================
            MELLO BANNER
        ================================================== */}

        <section className="relative mt-4 overflow-hidden rounded-[20px] bg-gradient-to-r from-[#8138ff] via-[#a33cff] to-[#c43cff] px-6 py-5 text-white shadow-[0_12px_35px_rgba(139,54,255,0.25)] sm:px-8">

          <div className="absolute -right-10 -top-20 h-40 w-40 rounded-full bg-white/10" />

          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl">
                🤍
              </div>

              <div>

                <p className="text-sm font-black sm:text-base">
                  “You matter. You&apos;re enough. You&apos;re doing better than you think.” 💗
                </p>

                <p className="mt-1 text-xs font-semibold text-white/80">
                  — Mello
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate('talk')
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-black text-purple-700 shadow-lg transition hover:-translate-y-0.5"
            >

              <MessageCircle className="h-4 w-4" />

              Talk to Mello

            </button>

          </div>

        </section>

      </div>

    </div>
  );
};

export default HomePage;