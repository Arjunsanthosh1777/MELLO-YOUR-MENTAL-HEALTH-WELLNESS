import type { MoodResult } from './aiService';

export interface SavedMood {
  date: string;
  mood: string;
  emotion: string;
  emoji: string;
  confidence: number;
}

const STORAGE_KEY = 'mello_moods';

/**
 * Save AI detected mood.
 * Today's previous mood is replaced by the newest result.
 */
export const saveMood = (result: MoodResult): SavedMood => {
  const today = new Date()
    .toISOString()
    .split('T')[0];

  const existingMoods = getSavedMoods();

  const newMood: SavedMood = {
    date: today,
    mood: result.mood,
    emotion: result.emotion,
    emoji: result.emoji,
    confidence: result.confidence,
  };

  const updatedMoods = [
    ...existingMoods.filter(
      (item) => item.date !== today
    ),
    newMood,
  ];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedMoods)
  );

  // Tell HomePage that the mood changed.
  window.dispatchEvent(
    new CustomEvent('mello:mood-updated')
  );

  return newMood;
};

/**
 * Get all AI detected moods.
 */
export const getSavedMoods = (): SavedMood[] => {
  try {
    const saved = localStorage.getItem(
      STORAGE_KEY
    );

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch (error) {
    console.error(
      'Error reading saved moods:',
      error
    );

    return [];
  }
};

/**
 * Get today's AI detected mood.
 */
export const getTodayMood = (): SavedMood | null => {
  const today = new Date()
    .toISOString()
    .split('T')[0];

  const moods = getSavedMoods();

  return (
    moods.find(
      (mood) => mood.date === today
    ) || null
  );
};