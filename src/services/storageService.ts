import { 
  UserProfile, MoodEntry, ChatMessage, GameInfo, JourneyLevel, 
  ActivityCard, JournalEntry, Therapist, Achievement, SafetyResource 
} from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr-123',
  name: 'Arjun',
  email: 'arjun@mello.app',
  ageConfirmed: true,
  privacyAgreed: true,
  avatar: '💜',
  mindPoints: 340,
  xp: 620,
  level: 7,
  streak: 12,
  lastCheckIn: new Date().toISOString().split('T')[0],
  onboardingCompleted: true,
  goals: ['Stress relief', 'Building healthy habits', 'Understanding emotions'],
  checkInFrequency: 'daily',
  aiMemoryEnabled: true,
  notificationsEnabled: true
};

export const INITIAL_GAMES: GameInfo[] = [
  {
    id: 'calm-bubble',
    title: 'Calm Bubble 🫧',
    description: 'Tap floating pastel bubbles to release tension and clear your mind.',
    purpose: 'Slow interaction & visual distraction',
    duration: '2 min',
    durationMinutes: 2,
    xpReward: 15,
    icon: 'Sparkles',
    color: 'from-purple-400 to-indigo-500',
    bgGradient: 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100'
  },
  {
    id: 'zen-garden',
    title: 'Zen Garden 🪴',
    description: 'Drag gentle sand patterns and arrange serene stones in your private sanctuary.',
    purpose: 'Creative focus & tactile mindfulness',
    duration: '3 min',
    durationMinutes: 3,
    xpReward: 20,
    icon: 'Feather',
    color: 'from-emerald-400 to-teal-500',
    bgGradient: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100'
  },
  {
    id: 'color-flow',
    title: 'Color Flow 🎨',
    description: 'Connect matching pastel paths without overlapping lines.',
    purpose: 'Gentle cognitive engagement & flow state',
    duration: '3–5 min',
    durationMinutes: 4,
    xpReward: 20,
    icon: 'Palette',
    color: 'from-pink-400 to-purple-500',
    bgGradient: 'bg-gradient-to-br from-pink-50 to-purple-50 border-pink-100'
  },
  {
    id: 'mindful-maze',
    title: 'Mindful Maze 🌀',
    description: 'Slowly guide a glowing marble through a peaceful, pressure-free labyrinth.',
    purpose: 'Motor deceleration & steady breath pairing',
    duration: '2 min',
    durationMinutes: 2,
    xpReward: 15,
    icon: 'Compass',
    color: 'from-amber-400 to-orange-500',
    bgGradient: 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100'
  },
  {
    id: 'cloud-stack',
    title: 'Cloud Stack ☁️',
    description: 'Stack fluffy clouds gently upon one another in a calm sky.',
    purpose: 'Patience & rhythmic focus',
    duration: '2 min',
    durationMinutes: 2,
    xpReward: 15,
    icon: 'Cloud',
    color: 'from-sky-400 to-blue-500',
    bgGradient: 'bg-gradient-to-br from-sky-50 to-blue-50 border-sky-100'
  },
  {
    id: 'breathing-bloom',
    title: 'Breathing Bloom 🌸',
    description: 'Synchronize your breath with an expanding and contracting lotus flower.',
    purpose: 'Vagus nerve stimulation & physiological calm',
    duration: '2–4 min',
    durationMinutes: 3,
    xpReward: 15,
    icon: 'Wind',
    color: 'from-rose-400 to-pink-500',
    bgGradient: 'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100'
  },
  {
    id: 'gratitude-garden',
    title: 'Gratitude Garden 🌻',
    description: 'Plant a virtual blooming flower every time you record something you are grateful for.',
    purpose: 'Positive emotion reflection & growth',
    duration: '3 min',
    durationMinutes: 3,
    xpReward: 20,
    icon: 'Heart',
    color: 'from-yellow-400 to-amber-500',
    bgGradient: 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-100'
  }
];

export const INITIAL_JOURNEY: JourneyLevel[] = [
  {
    id: 1,
    title: 'Know Yourself',
    subtitle: 'Build self-awareness through gentle daily check-ins',
    xpRequired: 100,
    unlocked: true,
    nodes: [
      { id: '1-1', title: 'First Check-in', type: 'checkin', xp: 10, completed: true, description: 'Record your current mood.' },
      { id: '1-2', title: 'Meet Mello', type: 'talk', xp: 20, completed: true, description: 'Have your first 2-minute conversation.' },
      { id: '1-3', title: 'Breath Awakening', type: 'breathing', xp: 15, completed: true, description: 'Complete a 2-minute box breathing session.' }
    ]
  },
  {
    id: 2,
    title: 'Understand Emotions',
    subtitle: 'Learn to identify and accept what you are feeling',
    xpRequired: 250,
    unlocked: true,
    nodes: [
      { id: '2-1', title: 'Emotion Naming', type: 'reflection', xp: 20, completed: true, description: 'Tag your primary emotions today.' },
      { id: '2-2', title: 'Gratitude Seed', type: 'gratitude', xp: 15, completed: true, description: 'Plant one flower in your Gratitude Garden.' },
      { id: '2-3', title: 'Zen Touch', type: 'game', xp: 20, completed: true, description: 'Spend 3 minutes in Zen Garden.' }
    ]
  },
  {
    id: 3,
    title: 'Build Healthy Habits',
    subtitle: 'Establish small, sustainable routines for your mind',
    xpRequired: 450,
    unlocked: true,
    nodes: [
      { id: '3-1', title: 'Morning Check-in', type: 'checkin', xp: 10, completed: true, description: 'Start your day with an intentional check-in.' },
      { id: '3-2', title: 'Deep Reflection', type: 'journal', xp: 25, completed: true, description: 'Write a short journal reflection.' },
      { id: '3-3', title: 'Cloud Stacking', type: 'game', xp: 15, completed: false, description: 'Play Cloud Stack mini-game.' }
    ]
  },
  {
    id: 4,
    title: 'Coping Skills',
    subtitle: 'Master techniques to handle stress and overwhelm',
    xpRequired: 700,
    unlocked: false,
    nodes: [
      { id: '4-1', title: 'Thought De-escalation', type: 'reflection', xp: 25, completed: false, description: 'Reflect on a challenging thought.' },
      { id: '4-2', title: 'Color Flow Challenge', type: 'game', xp: 20, completed: false, description: 'Complete 3 levels of Color Flow.' },
      { id: '4-3', title: 'Deep Breathing Bloom', type: 'breathing', xp: 20, completed: false, description: 'Complete 4-7-8 breathing practice.' }
    ]
  },
  {
    id: 5,
    title: 'Connect & Grow',
    subtitle: 'Nurture relationships and explore human professional support',
    xpRequired: 1000,
    unlocked: false,
    nodes: [
      { id: '5-1', title: 'Human Connection', type: 'reflection', xp: 30, completed: false, description: 'Explore professional therapist directory.' },
      { id: '5-2', title: 'Weekly Summary', type: 'journal', xp: 35, completed: false, description: 'Review your 7-day emotional growth.' }
    ]
  }
];

export const INITIAL_THERAPISTS: Therapist[] = [
  {
    id: 'th-1',
    name: 'Dr. Meera Sharma',
    title: 'Clinical Psychologist, Ph.D.',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    specializations: ['Stress', 'Anxiety', 'Relationships', 'Burnout'],
    experienceYears: 7,
    languages: ['English', 'Hindi'],
    availability: 'Online',
    isOnline: true,
    rating: 4.9,
    reviewsCount: 128,
    bio: 'Specializing in Cognitive Behavioral Therapy (CBT) and mindfulness-based stress reduction. Helping adults navigate anxiety, life transitions, and self-compassion.',
    pricePerSession: '$60 / 50-min session',
    sessionTypes: ['Chat', 'Voice', 'Video']
  },
  {
    id: 'th-2',
    name: 'Dr. Rohan Verma',
    title: 'Counseling Psychologist, Psy.D.',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
    specializations: ['Depression', 'Relationships', 'Student Support'],
    experienceYears: 6,
    languages: ['English'],
    availability: 'Online',
    isOnline: true,
    rating: 4.8,
    reviewsCount: 94,
    bio: 'Empathetic counselor focused on young adults and students dealing with academic pressure, identity, and relational conflicts.',
    pricePerSession: '$55 / 50-min session',
    sessionTypes: ['Chat', 'Video']
  },
  {
    id: 'th-3',
    name: 'Dr. Aisha Khan',
    title: 'Psychotherapist & Mindfulness Specialist',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1594824813566-88855ce78905?w=300&auto=format&fit=crop&q=80',
    specializations: ['Self-esteem', 'Trauma', 'General Counseling'],
    experienceYears: 8,
    languages: ['English', 'Urdu'],
    availability: 'Next Available: Today 4 PM',
    isOnline: false,
    rating: 4.9,
    reviewsCount: 112,
    bio: 'Integrative therapist using somatic experiencing and acceptance commitment therapy to rebuild confidence and emotional resilience.',
    pricePerSession: '$70 / 50-min session',
    sessionTypes: ['Voice', 'Video']
  },
  {
    id: 'th-4',
    name: 'David Chen, LMFT',
    title: 'Licensed Marriage & Family Therapist',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    specializations: ['Relationships', 'Family Dynamics', 'Stress'],
    experienceYears: 10,
    languages: ['English', 'Mandarin'],
    availability: 'Tomorrow',
    isOnline: false,
    rating: 4.9,
    reviewsCount: 156,
    bio: 'Compassionate therapist with a focus on communication patterns, emotional safety, and healthy boundary creation.',
    pricePerSession: '$65 / 50-min session',
    sessionTypes: ['Chat', 'Voice', 'Video']
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-1', title: '🌱 First Step', description: 'Completed your first mood check-in', icon: '🌱', unlocked: true, unlockedAt: '2026-08-01', xp: 20 },
  { id: 'ach-2', title: '🔥 7 Day Journey', description: 'Maintained a 7-day wellness check-in journey', icon: '🔥', unlocked: true, unlockedAt: '2026-08-07', xp: 50 },
  { id: 'ach-3', title: '💜 Helping Hand', description: 'Connected with Mello AI for 5 conversations', icon: '💜', unlocked: true, unlockedAt: '2026-08-05', xp: 30 },
  { id: 'ach-4', title: '🧘 Calm Mind', description: 'Completed 5 breathing or relaxation exercises', icon: '🧘', unlocked: true, unlockedAt: '2026-08-08', xp: 40 },
  { id: 'ach-5', title: '🌟 Reflection Master', description: 'Wrote 3 journal entries about your feelings', icon: '🌟', unlocked: false, xp: 50 },
  { id: 'ach-6', title: '🌈 One Week Strong', description: 'Recorded gratitude for 7 consecutive days', icon: '🌈', unlocked: false, xp: 60 }
];

export const INITIAL_ACTIVITIES: ActivityCard[] = [
  {
    id: 'act-1',
    title: 'Morning Check-in',
    duration: '2 min',
    xpReward: 10,
    type: 'checkin',
    completedToday: true,
    iconName: 'Sun',
    bg: 'from-amber-100 to-orange-100 text-amber-800',
    description: 'Set your morning emotional tone with a quick mood selection and prompt.'
  },
  {
    id: 'act-2',
    title: 'Breathing Exercise',
    duration: '2 min',
    xpReward: 15,
    type: 'breathing',
    completedToday: true,
    iconName: 'Wind',
    bg: 'from-purple-100 to-indigo-100 text-purple-800',
    description: 'Slow box-breathing cycle to balance your nervous system.'
  },
  {
    id: 'act-3',
    title: 'Talk with Mello',
    duration: '3 min',
    xpReward: 20,
    type: 'checkin',
    completedToday: true,
    iconName: 'MessageCircle',
    bg: 'from-pink-100 to-rose-100 text-pink-800',
    description: 'Share whatever is on your mind today in a judgment-free space.'
  },
  {
    id: 'act-4',
    title: 'Stress Relief Game',
    duration: '3 min',
    xpReward: 15,
    type: 'gratitude',
    completedToday: false,
    iconName: 'Gamepad2',
    bg: 'from-emerald-100 to-teal-100 text-emerald-800',
    description: 'Unwind with Zen Garden or Calm Bubble mini-games.'
  },
  {
    id: 'act-5',
    title: 'Evening Reflection',
    duration: '3 min',
    xpReward: 20,
    type: 'reflection',
    completedToday: false,
    iconName: 'Moon',
    bg: 'from-blue-100 to-indigo-100 text-blue-800',
    description: 'Reflect on one positive moment and wind down for sleep.'
  }
];

export const INITIAL_JOURNALS: JournalEntry[] = [
  {
    id: 'j-1',
    date: '2026-08-08',
    timestamp: '2026-08-08T20:15:00Z',
    title: 'A peaceful walk in the park',
    content: 'Took 20 minutes off screens today to walk outside. Watching the trees move in the breeze helped me slow down my racing thoughts about project deadlines.',
    mood: 'good',
    prompt: 'What was one good thing today?',
    tags: ['Work', 'Outdoors', 'Relaxation']
  },
  {
    id: 'j-2',
    date: '2026-08-06',
    timestamp: '2026-08-06T14:30:00Z',
    title: 'Managing presentation anxiety',
    content: 'Felt really nervous before the team demo today, but Mello\'s breathing bloom exercise helped lower my heart rate. Proud that I got through it without rushing.',
    mood: 'okay',
    prompt: 'What felt difficult today?',
    tags: ['College', 'Public Speaking', 'Progress']
  }
];

export const INITIAL_MOODS: MoodEntry[] = [
  { id: 'm-1', userId: 'usr-123', date: '2026-08-03', timestamp: '2026-08-03T09:00:00Z', mood: 'okay', note: 'Busy monday', tags: ['Work'] },
  { id: 'm-2', userId: 'usr-123', date: '2026-08-04', timestamp: '2026-08-04T09:00:00Z', mood: 'good', note: 'Good sleep last night', tags: ['Sleep'] },
  { id: 'm-3', userId: 'usr-123', date: '2026-08-05', timestamp: '2026-08-05T09:00:00Z', mood: 'low', note: 'Stressed about exams', tags: ['College'] },
  { id: 'm-4', userId: 'usr-123', date: '2026-08-06', timestamp: '2026-08-06T09:00:00Z', mood: 'okay', note: 'Felt a bit overwhelmed mid-day', tags: ['Work', 'Social'] },
  { id: 'm-5', userId: 'usr-123', date: '2026-08-07', timestamp: '2026-08-07T09:00:00Z', mood: 'good', note: 'Had coffee with a friend', tags: ['Relationships'] },
  { id: 'm-6', userId: 'usr-123', date: '2026-08-08', timestamp: '2026-08-08T09:00:00Z', mood: 'great', note: 'Finished major milestone!', tags: ['Progress', 'Work'] },
  { id: 'm-7', userId: 'usr-123', date: '2026-08-09', timestamp: '2026-08-09T09:00:00Z', mood: 'good', note: 'Feeling peaceful and ready for the day', tags: ['Self-care'] }
];

export const SAFETY_RESOURCES: SafetyResource[] = [
  { country: 'United States', flag: '🇺🇸', hotline: '988 (Suicide & Crisis Lifeline)', textService: 'Text HOME to 741741', website: 'https://988lifeline.org' },
  { country: 'United Kingdom', flag: '🇬🇧', hotline: '111 (NHS Mental Health) / 116 123 (Samaritans)', textService: 'Text SHOUT to 85258', website: 'https://www.samaritans.org' },
  { country: 'India', flag: '🇮🇳', hotline: '9152987821 (KIRAN) / 14416 (Tele-MANAS)', textService: 'Call 112 (Emergency)', website: 'https://telemanas.mohfw.gov.in' },
  { country: 'Canada', flag: '🇨🇦', hotline: '988 (Suicide Crisis Helpline)', textService: 'Text 988', website: 'https://988.ca' },
  { country: 'Australia', flag: '🇦🇺', hotline: '13 11 14 (Lifeline)', textService: 'Text 0477 13 11 14', website: 'https://www.lifeline.org.au' },
  { country: 'International / Other', flag: '🌐', hotline: 'Find your local hotline at Befrienders Worldwide', textService: 'Visit befrienders.org', website: 'https://www.befrienders.org' }
];

class StorageService {
  private getItem<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem('mello_' + key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem('mello_' + key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }

  public getUser(): UserProfile { return this.getItem('user', INITIAL_USER); }
  public saveUser(user: UserProfile): void { this.setItem('user', user); }

  public getMoods(): MoodEntry[] { return this.getItem('moods', INITIAL_MOODS); }
  public saveMoods(moods: MoodEntry[]): void { this.setItem('moods', moods); }

  public getJournals(): JournalEntry[] { return this.getItem('journals', INITIAL_JOURNALS); }
  public saveJournals(journals: JournalEntry[]): void { this.setItem('journals', journals); }

  public getJourney(): JourneyLevel[] { return this.getItem('journey', INITIAL_JOURNEY); }
  public saveJourney(journey: JourneyLevel[]): void { this.setItem('journey', journey); }

  public getAchievements(): Achievement[] { return this.getItem('achievements', INITIAL_ACHIEVEMENTS); }
  public saveAchievements(achievements: Achievement[]): void { this.setItem('achievements', achievements); }

  public getTherapists(): Therapist[] { return this.getItem('therapists', INITIAL_THERAPISTS); }

  public resetDemoData(): void {
    localStorage.removeItem('mello_user');
    localStorage.removeItem('mello_moods');
    localStorage.removeItem('mello_journals');
    localStorage.removeItem('mello_journey');
    localStorage.removeItem('mello_achievements');
  }
}

export const storageService = new StorageService();
