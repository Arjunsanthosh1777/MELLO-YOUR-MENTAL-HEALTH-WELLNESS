
import {
  UserProfile,
  MoodEntry,
  GameInfo,
  JourneyLevel,
  ActivityCard,
  JournalEntry,
  Therapist,
  Achievement,
  SafetyResource
} from '../types';

/* =========================
   USER
========================= */

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
  goals: [
    'Stress relief',
    'Building healthy habits',
    'Understanding emotions'
  ],
  checkInFrequency: 'daily',
  aiMemoryEnabled: true,
  notificationsEnabled: true
};

/* =========================
   GAMES
========================= */

export const INITIAL_GAMES: GameInfo[] = [
  {
    id: 'mind-maze',
    title: 'Mind Maze 🧩',
    description:
      'Solve challenging puzzles, discover patterns, and sharpen your logical thinking.',
    purpose: 'Logic & Problem Solving',
    duration: '3–5 min',
    durationMinutes: 5,
    xpReward: 20,
    icon: 'Brain',
    color: 'from-violet-400 to-purple-600',
    bgGradient:
      'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100'
  },

  {
    id: 'liquid-sort',
    title: 'Liquid Sort 🧪',
    description:
      'Sort colorful liquids into matching tubes and create a satisfying sense of order.',
    purpose: 'Gentle problem solving & focused relaxation',
    duration: '3–6 min',
    durationMinutes: 5,
    xpReward: 25,
    icon: 'FlaskConical',
    color: 'from-cyan-400 to-blue-600',
    bgGradient:
      'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-100'
  },

  {
    id: 'word-bloom',
    title: 'WordBloom 🌸',
    description:
      'Discover hidden words, connect letters and grow your vocabulary while keeping your mind calm and focused.',
    purpose: 'Vocabulary & Mental Focus',
    duration: '3–5 min',
    durationMinutes: 4,
    xpReward: 30,
    icon: 'Flower2',
    color: 'from-pink-400 to-rose-500',
    bgGradient:
      'bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 border-pink-100'
  },

  {
    id: 'memory-glow',
    title: 'MemoryGlow ✨',
    description:
      'Remember glowing patterns, repeat the sequence and strengthen your memory, concentration and attention.',
    purpose: 'Memory & Focus',
    duration: '3–6 min',
    durationMinutes: 5,
    xpReward: 30,
    icon: 'Sparkles',
    color: 'from-amber-400 to-orange-500',
    bgGradient:
      'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-amber-100'
  },

  
];

/* =========================
   JOURNEY
========================= */

export const INITIAL_JOURNEY: JourneyLevel[] = [
  {
    id: 1,
    title: 'Know Yourself',
    subtitle: 'Build self-awareness through gentle daily check-ins',
    xpRequired: 100,
    unlocked: true,

    nodes: [
      {
        id: '1-1',
        title: 'First Check-in',
        type: 'checkin',
        xp: 10,
        completed: true,
        description: 'Record your current mood.'
      },
      {
        id: '1-2',
        title: 'Meet Mello',
        type: 'talk',
        xp: 20,
        completed: true,
        description: 'Have your first 2-minute conversation.'
      },
      {
        id: '1-3',
        title: 'Breath Awakening',
        type: 'breathing',
        xp: 15,
        completed: true,
        description: 'Complete a 2-minute box breathing session.'
      }
    ]
  },

  {
    id: 2,
    title: 'Understand Emotions',
    subtitle: 'Learn to identify and accept what you are feeling',
    xpRequired: 250,
    unlocked: true,

    nodes: [
      {
        id: '2-1',
        title: 'Emotion Naming',
        type: 'reflection',
        xp: 20,
        completed: true,
        description: 'Tag your primary emotions today.'
      },
      {
        id: '2-2',
        title: 'Gratitude Seed',
        type: 'gratitude',
        xp: 15,
        completed: true,
        description: 'Plant one flower in your Gratitude Garden.'
      },
      {
        id: '2-3',
        title: 'Zen Touch',
        type: 'game',
        xp: 20,
        completed: true,
        description: 'Spend 3 minutes in Zen Garden.'
      }
    ]
  },

  {
    id: 3,
    title: 'Build Healthy Habits',
    subtitle: 'Establish small, sustainable routines for your mind',
    xpRequired: 450,
    unlocked: true,

    nodes: [
      {
        id: '3-1',
        title: 'Morning Check-in',
        type: 'checkin',
        xp: 10,
        completed: true,
        description: 'Start your day with an intentional check-in.'
      },
      {
        id: '3-2',
        title: 'Deep Reflection',
        type: 'journal',
        xp: 25,
        completed: true,
        description: 'Write a short journal reflection.'
      },
      {
        id: '3-3',
        title: 'Cloud Stacking',
        type: 'game',
        xp: 15,
        completed: false,
        description: 'Play Cloud Stack mini-game.'
      }
    ]
  },

  {
    id: 4,
    title: 'Coping Skills',
    subtitle: 'Master techniques to handle stress and overwhelm',
    xpRequired: 700,
    unlocked: false,

    nodes: [
      {
        id: '4-1',
        title: 'Thought De-escalation',
        type: 'reflection',
        xp: 25,
        completed: false,
        description: 'Reflect on a challenging thought.'
      },
      {
        id: '4-2',
        title: 'Color Flow Challenge',
        type: 'game',
        xp: 20,
        completed: false,
        description: 'Complete 3 levels of Color Flow.'
      },
      {
        id: '4-3',
        title: 'Deep Breathing Bloom',
        type: 'breathing',
        xp: 20,
        completed: false,
        description: 'Complete 4-7-8 breathing practice.'
      }
    ]
  },

  {
    id: 5,
    title: 'Connect & Grow',
    subtitle:
      'Nurture relationships and explore human professional support',
    xpRequired: 1000,
    unlocked: false,

    nodes: [
      {
        id: '5-1',
        title: 'Human Connection',
        type: 'reflection',
        xp: 30,
        completed: false,
        description: 'Explore professional therapist directory.'
      },
      {
        id: '5-2',
        title: 'Weekly Summary',
        type: 'journal',
        xp: 35,
        completed: false,
        description: 'Review your 7-day emotional growth.'
      }
    ]
  }
];

/* =========================
   THERAPISTS
========================= */

export const INITIAL_THERAPISTS: Therapist[] = [
  {
    id: 'th-1',
    name: 'Dr. Meera Sharma',
    title: 'Clinical Psychologist, Ph.D.',
    verified: true,
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    specializations: [
      'Stress',
      'Anxiety',
      'Relationships',
      'Burnout'
    ],
    experienceYears: 7,
    languages: ['English', 'Hindi'],
    availability: 'Online',
    isOnline: true,
    rating: 4.9,
    reviewsCount: 128,
    bio:
      'Specializing in Cognitive Behavioral Therapy (CBT) and mindfulness-based stress reduction.',
    pricePerSession: '$60 / 50-min session',
    sessionTypes: ['Chat', 'Voice', 'Video']
  },

  {
    id: 'th-2',
    name: 'Dr. Rohan Verma',
    title: 'Counseling Psychologist, Psy.D.',
    verified: true,
    avatar:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
    specializations: [
      'Depression',
      'Relationships',
      'Student Support'
    ],
    experienceYears: 6,
    languages: ['English'],
    availability: 'Online',
    isOnline: true,
    rating: 4.8,
    reviewsCount: 94,
    bio:
      'Empathetic counselor focused on young adults and students dealing with academic pressure.',
    pricePerSession: '$55 / 50-min session',
    sessionTypes: ['Chat', 'Video']
  },

  {
    id: 'th-3',
    name: 'Dr. Aisha Khan',
    title: 'Psychotherapist & Mindfulness Specialist',
    verified: true,
    avatar:
      'https://images.unsplash.com/photo-1594824813566-88855ce78905?w=300&auto=format&fit=crop&q=80',
    specializations: [
      'Self-esteem',
      'Trauma',
      'General Counseling'
    ],
    experienceYears: 8,
    languages: ['English', 'Urdu'],
    availability: 'Next Available: Today 4 PM',
    isOnline: false,
    rating: 4.9,
    reviewsCount: 112,
    bio:
      'Integrative therapist using mindfulness and acceptance-based approaches.',
    pricePerSession: '$70 / 50-min session',
    sessionTypes: ['Voice', 'Video']
  },

  {
    id: 'th-4',
    name: 'David Chen, LMFT',
    title: 'Licensed Marriage & Family Therapist',
    verified: true,
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    specializations: [
      'Relationships',
      'Family Dynamics',
      'Stress'
    ],
    experienceYears: 10,
    languages: ['English', 'Mandarin'],
    availability: 'Tomorrow',
    isOnline: false,
    rating: 4.9,
    reviewsCount: 156,
    bio:
      'Compassionate therapist focused on communication patterns and healthy boundaries.',
    pricePerSession: '$65 / 50-min session',
    sessionTypes: ['Chat', 'Voice', 'Video']
  }
];

/* =========================
   ACHIEVEMENTS
========================= */

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: '🌱 First Step',
    description: 'Completed your first mood check-in',
    icon: '🌱',
    unlocked: true,
    unlockedAt: '2026-08-01',
    xp: 20
  },

  {
    id: 'ach-2',
    title: '🔥 7 Day Journey',
    description: 'Maintained a 7-day wellness check-in journey',
    icon: '🔥',
    unlocked: true,
    unlockedAt: '2026-08-07',
    xp: 50
  },

  {
    id: 'ach-3',
    title: '💜 Helping Hand',
    description: 'Connected with Mello AI for 5 conversations',
    icon: '💜',
    unlocked: true,
    unlockedAt: '2026-08-05',
    xp: 30
  },

  {
    id: 'ach-4',
    title: '🧘 Calm Mind',
    description: 'Completed 5 breathing or relaxation exercises',
    icon: '🧘',
    unlocked: true,
    unlockedAt: '2026-08-08',
    xp: 40
  },

  {
    id: 'ach-5',
    title: '🌟 Reflection Master',
    description: 'Wrote 3 journal entries about your feelings',
    icon: '🌟',
    unlocked: false,
    xp: 50
  },

  {
    id: 'ach-6',
    title: '🌈 One Week Strong',
    description: 'Recorded gratitude for 7 consecutive days',
    icon: '🌈',
    unlocked: false,
    xp: 60
  },

  {
    id: 'ach-7',
    title: '✨ Memory Glow',
    description: 'Completed 5 MemoryGlow challenges',
    icon: '✨',
    unlocked: false,
    xp: 50
  },

  {
    id: 'ach-8',
    title: '🎯 Bottle Blaster',
    description: 'Completed 5 Bottle Blaster challenges',
    icon: '🎯',
    unlocked: false,
    xp: 60
  }
];

/* =========================
   ACTIVITIES
========================= */

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
    description:
      'Set your morning emotional tone with a quick mood selection and prompt.'
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
    description:
      'Slow box-breathing cycle to balance your nervous system.'
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
    description:
      'Share whatever is on your mind today in a judgment-free space.'
  },

  {
    id: 'act-4',
    title: 'MemoryGlow',
    duration: '3 min',
    xpReward: 30,
    type: 'gratitude',
    completedToday: false,
    iconName: 'Sparkles',
    bg: 'from-amber-100 to-orange-100 text-amber-800',
    description:
      'Remember glowing patterns and challenge your memory and focus.'
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
    description:
      'Reflect on one positive moment and wind down for sleep.'
  }
];

/* =========================
   JOURNALS
========================= */

export const INITIAL_JOURNALS: JournalEntry[] = [
  {
    id: 'j-1',
    date: '2026-08-08',
    timestamp: '2026-08-08T20:15:00Z',
    title: 'A peaceful walk in the park',
    content:
      'Took 20 minutes off screens today to walk outside. Watching the trees move in the breeze helped me slow down my racing thoughts about project deadlines.',
    mood: 'good',
    prompt: 'What was one good thing today?',
    tags: ['Work', 'Outdoors', 'Relaxation']
  },

  {
    id: 'j-2',
    date: '2026-08-06',
    timestamp: '2026-08-06T14:30:00Z',
    title: 'Managing presentation anxiety',
    content:
      "Felt really nervous before the team demo today, but Mello's breathing bloom exercise helped lower my heart rate. Proud that I got through it without rushing.",
    mood: 'okay',
    prompt: 'What felt difficult today?',
    tags: ['College', 'Public Speaking', 'Progress']
  }
];

/* =========================
   MOODS
========================= */

export const INITIAL_MOODS: MoodEntry[] = [
  {
    id: 'm-1',
    userId: 'usr-123',
    date: '2026-08-03',
    timestamp: '2026-08-03T09:00:00Z',
    mood: 'okay',
    note: 'Busy monday',
    tags: ['Work']
  },

  {
    id: 'm-2',
    userId: 'usr-123',
    date: '2026-08-04',
    timestamp: '2026-08-04T09:00:00Z',
    mood: 'good',
    note: 'Good sleep last night',
    tags: ['Sleep']
  },

  {
    id: 'm-3',
    userId: 'usr-123',
    date: '2026-08-05',
    timestamp: '2026-08-05T09:00:00Z',
    mood: 'low',
    note: 'Stressed about exams',
    tags: ['College']
  },

  {
    id: 'm-4',
    userId: 'usr-123',
    date: '2026-08-06',
    timestamp: '2026-08-06T09:00:00Z',
    mood: 'okay',
    note: 'Felt a bit overwhelmed mid-day',
    tags: ['Work', 'Social']
  },

  {
    id: 'm-5',
    userId: 'usr-123',
    date: '2026-08-07',
    timestamp: '2026-08-07T09:00:00Z',
    mood: 'good',
    note: 'Had coffee with a friend',
    tags: ['Relationships']
  },

  {
    id: 'm-6',
    userId: 'usr-123',
    date: '2026-08-08',
    timestamp: '2026-08-08T09:00:00Z',
    mood: 'great',
    note: 'Finished major milestone!',
    tags: ['Progress', 'Work']
  },

  {
    id: 'm-7',
    userId: 'usr-123',
    date: '2026-08-09',
    timestamp: '2026-08-09T09:00:00Z',
    mood: 'good',
    note: 'Feeling peaceful and ready for the day',
    tags: ['Self-care']
  }
];

/* =========================
   SAFETY RESOURCES
========================= */

export const SAFETY_RESOURCES: SafetyResource[] = [
  {
    country: 'United States',
    flag: '🇺🇸',
    hotline: '988 (Suicide & Crisis Lifeline)',
    textService: 'Text HOME to 741741',
    website: 'https://988lifeline.org'
  },

  {
    country: 'United Kingdom',
    flag: '🇬🇧',
    hotline: '111 (NHS Mental Health) / 116 123 (Samaritans)',
    textService: 'Text SHOUT to 85258',
    website: 'https://www.samaritans.org'
  },

  {
    country: 'India',
    flag: '🇮🇳',
    hotline: '9152987821 (KIRAN) / 14416 (Tele-MANAS)',
    textService: 'Call 112 (Emergency)',
    website: 'https://telemanas.mohfw.gov.in'
  },

  {
    country: 'Canada',
    flag: '🇨🇦',
    hotline: '988 (Suicide Crisis Helpline)',
    textService: 'Text 988',
    website: 'https://988.ca'
  },

  {
    country: 'Australia',
    flag: '🇦🇺',
    hotline: '13 11 14 (Lifeline)',
    textService: 'Text 0477 13 11 14',
    website: 'https://www.lifeline.org.au'
  },

  {
    country: 'International / Other',
    flag: '🌐',
    hotline: 'Find your local hotline at Befrienders Worldwide',
    textService: 'Visit befrienders.org',
    website: 'https://www.befrienders.org'
  }
];

/* =========================
   STORAGE SERVICE
========================= */

class StorageService {
  private prefix = 'mello_';

  private getItem<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(this.prefix + key);

      if (!data) {
        return fallback;
      }

      return JSON.parse(data) as T;
    } catch (error) {
      console.warn(`Storage read failed for "${key}":`, error);
      return fallback;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(
        this.prefix + key,
        JSON.stringify(value)
      );
    } catch (error) {
      console.warn(`Storage save failed for "${key}":`, error);
    }
  }

  /* USER */

  public getUser(): UserProfile {
    return this.getItem<UserProfile>('user', INITIAL_USER);
  }

  public saveUser(user: UserProfile): void {
    this.setItem<UserProfile>('user', user);
  }

  /* MOODS */

  public getMoods(): MoodEntry[] {
    return this.getItem<MoodEntry[]>('moods', INITIAL_MOODS);
  }

  public saveMoods(moods: MoodEntry[]): void {
    this.setItem<MoodEntry[]>('moods', moods);
  }

  /* JOURNALS */

  public getJournals(): JournalEntry[] {
    return this.getItem<JournalEntry[]>(
      'journals',
      INITIAL_JOURNALS
    );
  }

  public saveJournals(journals: JournalEntry[]): void {
    this.setItem<JournalEntry[]>(
      'journals',
      journals
    );
  }

  /* JOURNEY */

  public getJourney(): JourneyLevel[] {
    return this.getItem<JourneyLevel[]>(
      'journey',
      INITIAL_JOURNEY
    );
  }

  public saveJourney(journey: JourneyLevel[]): void {
    this.setItem<JourneyLevel[]>(
      'journey',
      journey
    );
  }

  /* ACHIEVEMENTS */

  public getAchievements(): Achievement[] {
    return this.getItem<Achievement[]>(
      'achievements',
      INITIAL_ACHIEVEMENTS
    );
  }

  public saveAchievements(
    achievements: Achievement[]
  ): void {
    this.setItem<Achievement[]>(
      'achievements',
      achievements
    );
  }

  /* GAMES */

  public getGames(): GameInfo[] {
    return this.getItem<GameInfo[]>(
      'games',
      INITIAL_GAMES
    );
  }

  public saveGames(games: GameInfo[]): void {
    this.setItem<GameInfo[]>(
      'games',
      games
    );
  }

  /* THERAPISTS */

  public getTherapists(): Therapist[] {
    return this.getItem<Therapist[]>(
      'therapists',
      INITIAL_THERAPISTS
    );
  }

  /* ACTIVITIES */

  public getActivities(): ActivityCard[] {
    return this.getItem<ActivityCard[]>(
      'activities',
      INITIAL_ACTIVITIES
    );
  }

  public saveActivities(
    activities: ActivityCard[]
  ): void {
    this.setItem<ActivityCard[]>(
      'activities',
      activities
    );
  }

  /* SAFETY RESOURCES */

  public getSafetyResources(): SafetyResource[] {
    return this.getItem<SafetyResource[]>(
      'safety-resources',
      SAFETY_RESOURCES
    );
  }

  /* RESET DEMO DATA */

  public resetDemoData(): void {
    const keys = [
      'user',
      'moods',
      'journals',
      'journey',
      'achievements',
      'games',
      'activities',
      'therapists',
      'safety-resources'
    ];

    keys.forEach((key) => {
      localStorage.removeItem(this.prefix + key);
    });
  }
}

export const storageService = new StorageService();
