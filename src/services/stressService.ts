// src/services/stressService.ts

export type StressLevel = 'low' | 'moderate' | 'high' | 'critical';

export type StressFactor =
  | 'Academic pressure'
  | 'Exam pressure'
  | 'Assignment / deadline pressure'
  | 'Career concerns'
  | 'Financial concerns'
  | 'Family concerns'
  | 'Relationship / social concerns'
  | 'Sleep / fatigue'
  | 'Workload'
  | 'General emotional stress'
  | 'Multiple factors';

export interface StressAnalysis {
  level: StressLevel;
  score: number;
  mood: string;
  factors: StressFactor[];
  confidence: number;
  explanation: string;
  recommendations: string[];
  safetyConcern: boolean;
}

const KEYWORDS: Record<StressFactor, string[]> = {
  'Academic pressure': [
    'study',
    'studying',
    'college',
    'university',
    'class',
    'classes',
    'academic',
    'marks',
    'grade',
    'grades',
    'assignment',
    'assignments',
    'homework',
    'project',
  ],

  'Exam pressure': [
    'exam',
    'exams',
    'test',
    'tests',
    'midterm',
    'final',
    'finals',
    'quiz',
    'result',
    'results',
  ],

  'Assignment / deadline pressure': [
    'deadline',
    'deadlines',
    'due tomorrow',
    'due today',
    'submission',
    'submissions',
    'submit',
    'late',
    'pending',
  ],

  'Career concerns': [
    'career',
    'job',
    'jobs',
    'placement',
    'placements',
    'internship',
    'internships',
    'future',
    'interview',
    'interviews',
    'resume',
    'cv',
  ],

  'Financial concerns': [
    'money',
    'financial',
    'finance',
    'fees',
    'fee',
    'loan',
    'debt',
    'rent',
    'expenses',
    'expensive',
  ],

  'Family concerns': [
    'family',
    'parents',
    'parent',
    'mother',
    'father',
    'home',
    'siblings',
  ],

  'Relationship / social concerns': [
    'friend',
    'friends',
    'friendship',
    'relationship',
    'breakup',
    'lonely',
    'loneliness',
    'social',
    'bullying',
    'alone',
  ],

  'Sleep / fatigue': [
    'sleep',
    'sleeping',
    'insomnia',
    'tired',
    'fatigue',
    'exhausted',
    'awake',
    'rest',
    'restless',
  ],

  Workload: [
    'workload',
    'too much work',
    'lots of work',
    'so much work',
    'overwhelmed',
    'busy',
    'pressure',
    'tasks',
    'task',
  ],

  'General emotional stress': [
    'stress',
    'stressed',
    'anxious',
    'anxiety',
    'worried',
    'worry',
    'nervous',
    'panic',
    'frustrated',
    'frustration',
    'upset',
    'burnout',
    'burned out',
    'burnt out',
  ],

  'Multiple factors': [],
};

const HIGH_INTENSITY = [
  'extremely',
  'very stressed',
  'cannot concentrate',
  "can't concentrate",
  'overwhelmed',
  'falling apart',
  'breaking down',
  'unbearable',
  'too much',
  'completely exhausted',
  'cannot cope',
  "can't cope",
  'cannot handle',
  "can't handle",
  'desperate',
];

const MODERATE_INTENSITY = [
  'stressed',
  'stress',
  'worried',
  'worry',
  'anxious',
  'anxiety',
  'nervous',
  'frustrated',
  'tired',
  'pressure',
  'overthinking',
  'overwhelmed',
];

const LOW_INTENSITY = [
  'a little',
  'slightly',
  'somewhat',
  'bit stressed',
  'little stressed',
  'minor',
];

const SAFETY_KEYWORDS = [
  'kill myself',
  'suicide',
  'suicidal',
  'want to die',
  'wanna die',
  'end my life',
  'ending my life',
  'self harm',
  'self-harm',
  'hurt myself',
  'harm myself',
  'cut myself',
  'cutting myself',
  'no reason to live',
];

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

function containsPhrase(text: string, phrase: string): boolean {
  return text.includes(phrase);
}

function detectSafetyConcern(text: string): boolean {
  return SAFETY_KEYWORDS.some((keyword) =>
    containsPhrase(text, keyword),
  );
}

function detectFactors(text: string): StressFactor[] {
  const found: StressFactor[] = [];

  (Object.keys(KEYWORDS) as StressFactor[]).forEach((factor) => {
    if (factor === 'Multiple factors') return;

    const matched = KEYWORDS[factor].some((keyword) =>
      containsPhrase(text, keyword),
    );

    if (matched) {
      found.push(factor);
    }
  });

  if (found.length === 0) {
    return ['General emotional stress'];
  }

  if (found.length >= 3) {
    return [...found.slice(0, 3), 'Multiple factors'];
  }

  return found.slice(0, 3);
}

function calculateStressScore(
  text: string,
  factorCount: number,
  safetyConcern: boolean,
): number {
  if (safetyConcern) return 100;

  let score = 25;

  const highMatches = HIGH_INTENSITY.filter((word) =>
    containsPhrase(text, word),
  ).length;

  const moderateMatches = MODERATE_INTENSITY.filter((word) =>
    containsPhrase(text, word),
  ).length;

  const lowMatches = LOW_INTENSITY.filter((word) =>
    containsPhrase(text, word),
  ).length;

  score += highMatches * 14;
  score += moderateMatches * 8;
  score += factorCount * 6;
  score -= lowMatches * 10;

  if (text.length > 250) score += 5;
  if (text.length > 500) score += 5;

  return Math.max(0, Math.min(99, Math.round(score)));
}

function getLevel(score: number): StressLevel {
  if (score >= 85) return 'critical';
  if (score >= 65) return 'high';
  if (score >= 40) return 'moderate';

  return 'low';
}

function detectMood(
  text: string,
  level: StressLevel,
): string {
  if (level === 'critical' || level === 'high') {
    return 'Highly stressed';
  }

  const positiveWords = [
    'happy',
    'good',
    'great',
    'excited',
    'calm',
    'relaxed',
    'confident',
    'hopeful',
    'positive',
  ];

  const negativeWords = [
    'sad',
    'upset',
    'worried',
    'anxious',
    'stress',
    'stressed',
    'angry',
    'frustrated',
    'lonely',
    'tired',
  ];

  const positive = positiveWords.filter((word) =>
    containsPhrase(text, word),
  ).length;

  const negative = negativeWords.filter((word) =>
    containsPhrase(text, word),
  ).length;

  if (negative > positive) return 'Stressed';
  if (positive > negative) return 'Positive';
  if (level === 'moderate') return 'Concerned';

  return 'Neutral';
}

function getExplanation(
  level: StressLevel,
  factors: StressFactor[],
): string {
  const factorText = factors
    .filter((factor) => factor !== 'Multiple factors')
    .slice(0, 2)
    .join(' and ');

  switch (level) {
    case 'low':
      return factorText
        ? `Your message shows mild stress signals, mainly related to ${factorText.toLowerCase()}.`
        : 'Your message shows relatively mild stress signals.';

    case 'moderate':
      return factorText
        ? `Your message shows noticeable stress signals, particularly around ${factorText.toLowerCase()}.`
        : 'Your message shows noticeable stress signals that may benefit from a short wellness break.';

    case 'high':
      return factorText
        ? `Your message suggests elevated stress, with ${factorText.toLowerCase()} appearing to be important contributors.`
        : 'Your message suggests elevated stress and may benefit from immediate wellbeing support.';

    case 'critical':
      return 'Your message contains signals that require a safety-focused response and support from a trusted person or qualified professional.';
  }
}

function getRecommendations(
  level: StressLevel,
  factors: StressFactor[],
): string[] {
  const recommendations: string[] = [];

  if (level === 'critical') {
    return [
      'Connect with a trusted person who can stay with you.',
      'Consider contacting a qualified mental-health professional or local emergency support if you may be in immediate danger.',
      'Move to a safe environment and avoid being alone if you feel unable to stay safe.',
    ];
  }

  if (level === 'low') {
    recommendations.push(
      'Take a 2–5 minute breathing or relaxation break.',
    );

    recommendations.push(
      'Keep a simple routine and check in with yourself later.',
    );
  }

  if (level === 'moderate') {
    recommendations.push(
      'Take a 5-minute breathing or grounding break.',
    );

    recommendations.push(
      'Write down your top three priorities and handle them one at a time.',
    );
  }

  if (level === 'high') {
    recommendations.push(
      'Pause and take a short calming break before continuing your tasks.',
    );

    recommendations.push(
      'Break your largest task into smaller, manageable steps.',
    );

    recommendations.push(
      'Reach out to someone you trust if the stress is becoming difficult to manage.',
    );
  }

  if (
    factors.includes('Academic pressure') ||
    factors.includes('Exam pressure') ||
    factors.includes('Assignment / deadline pressure')
  ) {
    recommendations.push(
      'Create a realistic study plan with short focused sessions and breaks.',
    );
  }

  if (factors.includes('Sleep / fatigue')) {
    recommendations.push(
      'Prioritize rest and avoid sacrificing sleep repeatedly for coursework.',
    );
  }

  if (factors.includes('Career concerns')) {
    recommendations.push(
      'Choose one small career task today instead of trying to solve everything at once.',
    );
  }

  return [...new Set(recommendations)].slice(0, 4);
}

export function analyzeStudentStress(
  input: string,
): StressAnalysis {
  const text = normalize(input);

  if (!text) {
    return {
      level: 'low',
      score: 0,
      mood: 'Not checked',
      factors: [],
      confidence: 0,
      explanation:
        'Write a few sentences about how you are feeling.',
      recommendations: [],
      safetyConcern: false,
    };
  }

  const safetyConcern = detectSafetyConcern(text);
  const factors = detectFactors(text);

  const score = calculateStressScore(
    text,
    factors.length,
    safetyConcern,
  );

  const level = getLevel(score);
  const mood = detectMood(text, level);

  const confidence = safetyConcern
    ? 98
    : Math.min(
        96,
        Math.max(
          62,
          62 +
            factors.length * 7 +
            Math.round(score / 10),
        ),
      );

  return {
    level,
    score,
    mood,
    factors,
    confidence,
    explanation: getExplanation(level, factors),
    recommendations: getRecommendations(level, factors),
    safetyConcern,
  };
}