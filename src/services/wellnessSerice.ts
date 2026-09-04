export type Mood =
  | 'Calm'
  | 'Happy'
  | 'Neutral'
  | 'Stressed'
  | 'Sad'
  | 'Anxious';

export interface WellnessState {
  mood: Mood;
  moodScore: number;
  wellnessScore: number;
  goalsCompleted: number;
  totalGoals: number;
  streak: number;
  lastUpdated: string;
}

const DEFAULT_STATE: WellnessState = {
  mood: 'Neutral',
  moodScore: 50,
  wellnessScore: 79,
  goalsCompleted: 3,
  totalGoals: 4,
  streak: 12,
  lastUpdated: 'Just now',
};

const STORAGE_KEY = 'mello-wellness-state';

export const getWellnessState = (): WellnessState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load wellness state:', error);
  }

  return DEFAULT_STATE;
};

export const saveWellnessState = (
  state: WellnessState
): void => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );
};

export const updateMood = (
  mood: Mood,
  moodScore: number
): WellnessState => {
  const current = getWellnessState();

  /*
   * Mood contributes to the wellness score.
   * This is a demo scoring model and can later
   * be replaced with your actual AI model.
   */

  const moodContribution = Math.round(moodScore * 0.35);

  const activityContribution =
    Math.round(current.goalsCompleted / current.totalGoals * 45);

  let wellnessScore =
    moodContribution + activityContribution;

  wellnessScore = Math.max(
    0,
    Math.min(100, wellnessScore)
  );

  const updated: WellnessState = {
    ...current,
    mood,
    moodScore,
    wellnessScore,
    lastUpdated: 'Just now',
  };

  saveWellnessState(updated);

  return updated;
};

export const completeGoal = (): WellnessState => {
  const current = getWellnessState();

  const goalsCompleted = Math.min(
    current.goalsCompleted + 1,
    current.totalGoals
  );

  const updated = {
    ...current,
    goalsCompleted,
    wellnessScore: Math.min(
      100,
      current.wellnessScore + 5
    ),
  };

  saveWellnessState(updated);

  return updated;
};

export const getMoodEmoji = (mood: Mood): string => {
  switch (mood) {
    case 'Calm':
      return '😌';

    case 'Happy':
      return '😊';

    case 'Neutral':
      return '😐';

    case 'Stressed':
      return '😣';

    case 'Sad':
      return '😔';

    case 'Anxious':
      return '😟';

    default:
      return '😐';
  }
};

export const getMoodColor = (mood: Mood): string => {
  switch (mood) {
    case 'Calm':
      return 'text-emerald-600';

    case 'Happy':
      return 'text-yellow-500';

    case 'Neutral':
      return 'text-purple-600';

    case 'Stressed':
      return 'text-orange-500';

    case 'Sad':
      return 'text-blue-500';

    case 'Anxious':
      return 'text-rose-500';

    default:
      return 'text-purple-600';
  }
};