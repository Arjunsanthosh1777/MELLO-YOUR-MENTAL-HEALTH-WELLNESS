export type MoodType = 'great' | 'good' | 'okay' | 'low' | 'overwhelmed';

export interface MoodOption {
  id: MoodType;
  label: string;
  emoji: string;
  color: string;
  bg: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  ageConfirmed: boolean;
  privacyAgreed: boolean;
  avatar: string;
  mindPoints: number;
  xp: number;
  level: number;
  streak: number;
  lastCheckIn?: string;
  onboardingCompleted: boolean;
  goals: string[];
  checkInFrequency: 'daily' | 'twice_daily' | 'as_needed';
  aiMemoryEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface MoodEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO
  mood: MoodType;
  note?: string;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'mello' | 'user' | 'system';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  suggestedActivity?: {
    id: string;
    title: string;
    type: 'game' | 'breathing' | 'journal' | 'therapist';
  };
  isSafetyTrigger?: boolean;
}

export interface GameInfo {
  id: string;
  title: string;
  description: string;
  purpose: string;
  duration: string;
  durationMinutes: number;
  xpReward: number;
  icon: string;
  color: string;
  bgGradient: string;
}

export interface JourneyLevel {
  id: number;
  title: string;
  subtitle: string;
  xpRequired: number;
  unlocked: boolean;
  nodes: JourneyNode[];
}

export interface JourneyNode {
  id: string;
  title: string;
  type: 'checkin' | 'talk' | 'breathing' | 'gratitude' | 'journal' | 'game' | 'reflection';
  xp: number;
  completed: boolean;
  description: string;
}

export interface ActivityCard {
  id: string;
  title: string;
  duration: string;
  xpReward: number;
  type: 'checkin' | 'breathing' | 'gratitude' | 'thought' | 'body' | 'reflection';
  completedToday: boolean;
  iconName: string;
  bg: string;
  description: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  timestamp: string;
  title: string;
  content: string;
  mood?: MoodType;
  prompt?: string;
  tags: string[];
}

export interface Therapist {
  id: string;
  name: string;
  title: string;
  verified: boolean;
  avatar: string;
  specializations: string[];
  experienceYears: number;
  languages: string[];
  availability: 'Online' | 'Next Available: Today 4 PM' | 'Tomorrow';
  isOnline: boolean;
  rating: number;
  reviewsCount: number;
  bio: string;
  pricePerSession: string;
  sessionTypes: ('Chat' | 'Voice' | 'Video')[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  xp: number;
}

export interface SafetyResource {
  country: string;
  flag: string;
  hotline: string;
  textService: string;
  website: string;
}
