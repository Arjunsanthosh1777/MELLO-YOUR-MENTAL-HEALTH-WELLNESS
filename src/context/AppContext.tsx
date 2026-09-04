import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import {
  UserProfile,
  MoodEntry,
  JournalEntry,
  JourneyLevel,
  Achievement,
  MoodType,
} from '../types';

import { storageService } from '../services/storageService';

/* =========================================================
   APP TABS
========================================================= */

export type AppTab =
  | 'landing'
  | 'auth'
  | 'onboarding'
  | 'home'
  | 'talk'
  | 'games'
  | 'journey'
  | 'activities'
  | 'mood'
  | 'mood-dashboard'
  | 'journal'
  | 'therapists'
  | 'talk-now'

  /* THERAPIST FLOW */
  | 'therapist-booking'
  | 'therapist-payment'
  | 'therapist-video-call'

  | 'privacy'
  | 'profile'
  | 'settings'
  | 'safety'
  | 'admin';

/* =========================================================
   TOAST
========================================================= */

interface Toast {
  text: string;
  type: 'xp' | 'success' | 'info';
}

/* =========================================================
   APP CONTEXT TYPE
========================================================= */

interface AppContextType {
  user: UserProfile;

  moods: MoodEntry[];

  journals: JournalEntry[];

  journey: JourneyLevel[];

  achievements: Achievement[];

  /* =====================================================
     WELLNESS DASHBOARD
  ===================================================== */

  currentMood: MoodType | null;

  wellnessScore: number;

  goalsCompleted: number;

  totalGoals: number;

  streak: number;

  /* =====================================================
     APP STATE
  ===================================================== */

  activeTab: AppTab;

  selectedGameId: string | null;

  selectedTherapistId: string | null;

  isSafetyModalOpen: boolean;

  toast: Toast | null;

  /* =====================================================
     NAVIGATION
  ===================================================== */

  navigate: (
    tab: AppTab,
    options?: {
      gameId?: string;
      therapistId?: string;
    }
  ) => void;

  /* =====================================================
     MOOD
  ===================================================== */

  logMood: (
    mood: MoodType,
    note?: string,
    tags?: string[]
  ) => void;

  updateAIMood: (
    mood: MoodType,
    confidence?: number
  ) => void;

  /* =====================================================
     GOALS
  ===================================================== */

  completeGoal: () => void;

  /* =====================================================
     JOURNAL
  ===================================================== */

  addJournal: (
    title: string,
    content: string,
    mood?: MoodType,
    tags?: string[],
    prompt?: string
  ) => void;

  deleteJournal: (
    id: string
  ) => void;

  /* =====================================================
     XP
  ===================================================== */

  earnXP: (
    amount: number,
    reason: string
  ) => void;

  /* =====================================================
     JOURNEY
  ===================================================== */

  completeNode: (
    levelId: number,
    nodeId: string
  ) => void;

  /* =====================================================
     USER
  ===================================================== */

  updateUser: (
    fields: Partial<UserProfile>
  ) => void;

  /* =====================================================
     SAFETY
  ===================================================== */

  openSafetyModal: () => void;

  closeSafetyModal: () => void;

  /* =====================================================
     TOAST
  ===================================================== */

  showToast: (
    text: string,
    type?: 'xp' | 'success' | 'info'
  ) => void;

  /* =====================================================
     DEMO
  ===================================================== */

  resetDemoData: () => void;

  setIsDemoUser: (
    isDemo: boolean
  ) => void;
}

/* =========================================================
   CREATE CONTEXT
========================================================= */

const AppContext =
  createContext<AppContextType | undefined>(
    undefined
  );

/* =========================================================
   APP PROVIDER
========================================================= */

export const AppProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {

  /* =====================================================
     USER
  ===================================================== */

  const [user, setUser] =
    useState<UserProfile>(() =>
      storageService.getUser()
    );

  /* =====================================================
     MOODS
  ===================================================== */

  const [moods, setMoods] =
    useState<MoodEntry[]>(() =>
      storageService.getMoods()
    );

  /* =====================================================
     JOURNALS
  ===================================================== */

  const [journals, setJournals] =
    useState<JournalEntry[]>(() =>
      storageService.getJournals()
    );

  /* =====================================================
     JOURNEY
  ===================================================== */

  const [journey, setJourney] =
    useState<JourneyLevel[]>(() =>
      storageService.getJourney()
    );

  /* =====================================================
     ACHIEVEMENTS
  ===================================================== */

  const [achievements, setAchievements] =
    useState<Achievement[]>(() =>
      storageService.getAchievements()
    );

  /* =====================================================
     WELLNESS DASHBOARD
  ===================================================== */

  const [currentMood, setCurrentMood] =
    useState<MoodType | null>(null);

  const [wellnessScore, setWellnessScore] =
    useState<number>(50);

  const [goalsCompleted, setGoalsCompleted] =
    useState<number>(0);

  const totalGoals = 4;

  const [streak, setStreak] =
    useState<number>(0);

  /* =====================================================
     APP STATE
  ===================================================== */

  const [activeTab, setActiveTab] =
    useState<AppTab>('landing');

  const [selectedGameId, setSelectedGameId] =
    useState<string | null>(null);

  const [selectedTherapistId, setSelectedTherapistId] =
    useState<string | null>(null);

  const [isSafetyModalOpen, setIsSafetyModalOpen] =
    useState<boolean>(false);

  const [toast, setToast] =
    useState<Toast | null>(null);

  /* =====================================================
     LOCAL STORAGE
  ===================================================== */

  useEffect(() => {
    storageService.saveUser(user);
  }, [user]);

  useEffect(() => {
    storageService.saveMoods(moods);
  }, [moods]);

  useEffect(() => {
    storageService.saveJournals(journals);
  }, [journals]);

  useEffect(() => {
    storageService.saveJourney(journey);
  }, [journey]);

  useEffect(() => {
    storageService.saveAchievements(
      achievements
    );
  }, [achievements]);

  /* =====================================================
     RESTORE CURRENT MOOD
  ===================================================== */

  useEffect(() => {

    if (moods.length === 0) {
      setCurrentMood(null);
      return;
    }

    const latestMood = moods[0];

    if (latestMood) {
      setCurrentMood(
        latestMood.mood
      );
    }

  }, [moods]);

  /* =====================================================
     RESTORE WELLNESS SCORE
  ===================================================== */

  useEffect(() => {

    if (!currentMood) {
      return;
    }

    const score = getMoodScore(
      currentMood
    );

    setWellnessScore(score);

  }, [currentMood]);

  /* =====================================================
     TOAST
  ===================================================== */

  const showToast = (
    text: string,
    type: 'xp' | 'success' | 'info' = 'info'
  ) => {

    setToast({
      text,
      type,
    });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  /* =====================================================
     NAVIGATION
  ===================================================== */

  const navigate = (
    tab: AppTab,
    options?: {
      gameId?: string;
      therapistId?: string;
    }
  ) => {

    setActiveTab(tab);

    if (options?.gameId) {
      setSelectedGameId(
        options.gameId
      );
    }

    /* =====================================================
       THERAPIST SELECTION
    ===================================================== */

    if (options?.therapistId) {
      setSelectedTherapistId(
        options.therapistId
      );
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  /* =====================================================
     MOOD SCORE
  ===================================================== */

  const getMoodScore = (
    mood: MoodType
  ): number => {

    const moodName =
      String(mood).toLowerCase();

    if (
      moodName.includes('great') ||
      moodName.includes('happy') ||
      moodName.includes('excellent')
    ) {
      return 95;
    }

    if (
      moodName.includes('good') ||
      moodName.includes('positive')
    ) {
      return 85;
    }

    if (
      moodName.includes('calm') ||
      moodName.includes('peace')
    ) {
      return 80;
    }

    if (
      moodName.includes('okay') ||
      moodName.includes('neutral') ||
      moodName.includes('normal')
    ) {
      return 65;
    }

    if (
      moodName.includes('sad') ||
      moodName.includes('low')
    ) {
      return 45;
    }

    if (
      moodName.includes('stress') ||
      moodName.includes('anxious') ||
      moodName.includes('angry')
    ) {
      return 30;
    }

    return 60;
  };

  /* =====================================================
     AI MOOD → WELLNESS
  ===================================================== */

  const updateAIMood = (
    mood: MoodType,
    confidence: number = 1
  ) => {

    setCurrentMood(mood);

    const baseScore =
      getMoodScore(mood);

    const safeConfidence =
      Math.max(
        0,
        Math.min(1, confidence)
      );

    const confidenceAdjustment =
      Math.round(
        safeConfidence * 5
      );

    const newScore =
      Math.min(
        100,
        baseScore +
          confidenceAdjustment
      );

    setWellnessScore(
      newScore
    );

    showToast(
      `🤖 AI detected your mood as ${String(mood)}.`,
      'info'
    );
  };

  /* =====================================================
     MOOD STREAK
  ===================================================== */

  useEffect(() => {

    if (moods.length === 0) {
      setStreak(0);
      return;
    }

    const uniqueDates = [
      ...new Set(
        moods.map(
          mood => mood.date
        )
      ),
    ].sort().reverse();

    let currentStreak = 0;

    const today =
      new Date();

    for (
      let i = 0;
      i < uniqueDates.length;
      i++
    ) {

      const expectedDate =
        new Date(today);

      expectedDate.setDate(
        today.getDate() - i
      );

      const expected =
        expectedDate
          .toISOString()
          .split('T')[0];

      if (
        uniqueDates[i] ===
        expected
      ) {
        currentStreak++;
      } else {
        break;
      }
    }

    setStreak(
      currentStreak
    );

  }, [moods]);

  /* =====================================================
     XP
  ===================================================== */

  const earnXP = (
    amount: number,
    reason: string
  ) => {

    setUser(prev => {

      const newXP =
        prev.xp + amount;

      const newPoints =
        prev.mindPoints + amount;

      const newLevel =
        Math.floor(
          newXP / 100
        ) + 1;

      if (
        newLevel > prev.level
      ) {

        showToast(
          `🎉 Level Up! You reached Level ${newLevel}!`,
          'success'
        );

      } else {

        showToast(
          `+${amount} XP earned for ${reason}!`,
          'xp'
        );
      }

      return {
        ...prev,
        xp: newXP,
        mindPoints: newPoints,
        level: newLevel,
      };
    });
  };

  /* =====================================================
     LOG MOOD
  ===================================================== */

  const logMood = (
    mood: MoodType,
    note?: string,
    tags: string[] = []
  ) => {

    updateAIMood(
      mood,
      1
    );

    const todayStr =
      new Date()
        .toISOString()
        .split('T')[0];

    const newEntry: MoodEntry = {

      id:
        'm-' +
        Date.now(),

      userId:
        user.id,

      date:
        todayStr,

      timestamp:
        new Date()
          .toISOString(),

      mood,

      note,

      tags,
    };

    setMoods(prev => [

      newEntry,

      ...prev.filter(
        m =>
          m.date !==
          todayStr
      ),

    ]);

    earnXP(
      10,
      'Daily Mood Check-in'
    );
  };

  /* =====================================================
     COMPLETE GOAL
  ===================================================== */

  const completeGoal = () => {

    setGoalsCompleted(
      previous =>
        Math.min(
          totalGoals,
          previous + 1
        )
    );

    earnXP(
      10,
      'Wellness Goal'
    );

    showToast(
      '🎯 Wellness goal completed!',
      'success'
    );
  };

  /* =====================================================
     JOURNAL
  ===================================================== */

  const addJournal = (
    title: string,
    content: string,
    mood?: MoodType,
    tags: string[] = [],
    prompt?: string
  ) => {

    const newJournal: JournalEntry = {

      id:
        'j-' +
        Date.now(),

      date:
        new Date()
          .toISOString()
          .split('T')[0],

      timestamp:
        new Date()
          .toISOString(),

      title,

      content,

      mood,

      tags,

      prompt,
    };

    setJournals(prev => [
      newJournal,
      ...prev,
    ]);

    earnXP(
      20,
      'Journal Reflection'
    );
  };

  /* =====================================================
     DELETE JOURNAL
  ===================================================== */

  const deleteJournal = (
    id: string
  ) => {

    setJournals(prev =>
      prev.filter(
        journal =>
          journal.id !== id
      )
    );

    showToast(
      'Journal entry deleted permanently.',
      'info'
    );
  };

  /* =====================================================
     JOURNEY
  ===================================================== */

  const completeNode = (
    levelId: number,
    nodeId: string
  ) => {

    setJourney(prev =>
      prev.map(level => {

        if (
          level.id !==
          levelId
        ) {
          return level;
        }

        return {

          ...level,

          nodes:
            level.nodes.map(
              node =>
                node.id ===
                nodeId
                  ? {
                      ...node,
                      completed:
                        true,
                    }
                  : node
            ),
        };
      })
    );

    earnXP(
      15,
      'Journey Activity'
    );
  };

  /* =====================================================
     USER
  ===================================================== */

  const updateUser = (
    fields: Partial<UserProfile>
  ) => {

    setUser(prev => ({
      ...prev,
      ...fields,
    }));
  };

  /* =====================================================
     SAFETY
  ===================================================== */

  const openSafetyModal =
    () => {
      setIsSafetyModalOpen(
        true
      );
    };

  const closeSafetyModal =
    () => {
      setIsSafetyModalOpen(
        false
      );
    };

  /* =====================================================
     RESET DEMO DATA
  ===================================================== */

  const resetDemoData = () => {

    storageService
      .resetDemoData();

    setUser(
      storageService.getUser()
    );

    setMoods(
      storageService.getMoods()
    );

    setJournals(
      storageService.getJournals()
    );

    setJourney(
      storageService.getJourney()
    );

    setAchievements(
      storageService
        .getAchievements()
    );

    setCurrentMood(null);

    setWellnessScore(50);

    setGoalsCompleted(0);

    setStreak(0);

    setSelectedTherapistId(null);

    showToast(
      'Demo data reset to default state.',
      'info'
    );
  };

  /* =====================================================
     DEMO USER
  ===================================================== */

  const setIsDemoUser = (
    isDemo: boolean
  ) => {

    if (isDemo) {

      setUser(prev => ({
        ...prev,

        name: 'Arjun',

        onboardingCompleted:
          true,
      }));

      navigate(
        'home'
      );

      showToast(
        'Switched to Demo User (Arjun)',
        'success'
      );
    }
  };

  /* =====================================================
     PROVIDER
  ===================================================== */

  return (

    <AppContext.Provider
      value={{

        /* Existing data */

        user,

        moods,

        journals,

        journey,

        achievements,

        /* Wellness */

        currentMood,

        wellnessScore,

        goalsCompleted,

        totalGoals,

        streak,

        /* App */

        activeTab,

        selectedGameId,

        selectedTherapistId,

        isSafetyModalOpen,

        toast,

        /* Functions */

        navigate,

        logMood,

        updateAIMood,

        completeGoal,

        addJournal,

        deleteJournal,

        earnXP,

        completeNode,

        updateUser,

        openSafetyModal,

        closeSafetyModal,

        showToast,

        resetDemoData,

        setIsDemoUser,

      }}
    >

      {children}

    </AppContext.Provider>
  );
};

/* =========================================================
   useApp HOOK
========================================================= */

export const useApp = () => {

  const context =
    useContext(
      AppContext
    );

  if (!context) {

    throw new Error(
      'useApp must be used within an AppProvider'
    );
  }

  return context;
};