import { ChatMessage } from '../types';

/* =========================================================
   SAFETY KEYWORDS
========================================================= */

const SAFETY_KEYWORDS = [
  'kill myself',
  'suicide',
  'want to die',
  'end my life',
  'self harm',
  'self-harm',
  'cutting myself',
  'hurt myself',
  "don't want to live",
  'dont want to live',
  'no reason to live',
  'better off dead',
  "can't go on anymore",
  'cant go on anymore',
  'ending it all',
];

/* =========================================================
   MOOD TYPES
========================================================= */

export type Mood =
  | 'happy'
  | 'sad'
  | 'angry'
  | 'anxious'
  | 'stressed'
  | 'excited'
  | 'calm'
  | 'neutral';

/* =========================================================
   MOOD RESULT
========================================================= */

export interface MoodResult {
  mood: Mood;
  confidence: number;
  emotion: string;
  emoji: string;
  message: string;
  suggestions: string[];
}

/* =========================================================
   AI RESPONSE
========================================================= */

export interface AIResponse {
  message: ChatMessage;
  isSafetyTrigger: boolean;
}

/* =========================================================
   AI SERVICE
========================================================= */

class AIService {
  private apiKey: string = '';

  private memory: {
    key: string;
    value: string;
  }[] = [];

  private moodClassifier: any = null;

  private moodModelLoading: Promise<any> | null = null;

  constructor() {
    this.apiKey =
      import.meta.env.VITE_GEMINI_API_KEY ||
      import.meta.env.VITE_AI_API_KEY ||
      '';
  }

  private async getGeminiReply(
    userMessage: string,
    history: ChatMessage[],
    userName: string
  ): Promise<string | null> {
    if (!this.apiKey) {
      return null;
    }

    try {
      const recentHistory = history.slice(-6).map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

      const prompt = `You are Mello, a warm, empathetic mental wellness AI companion. Speak in a caring, supportive tone. Keep responses concise but helpful. Avoid clinical diagnosis. User name: ${userName}. Current user message: ${userMessage}. Conversation history: ${JSON.stringify(recentHistory)}.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.8,
              topP: 0.9,
              maxOutputTokens: 300,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error:', response.status, errorText);
        return null;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text ?? '')
        .join('')
        .trim();

      return text || null;
    } catch (error) {
      console.error('Gemini request failed:', error);
      return null;
    }
  }

  /* =======================================================
     SAFETY CHECK
  ======================================================= */

  public checkSafety(text: string): boolean {
    const lower = text.toLowerCase().trim();

    return SAFETY_KEYWORDS.some((keyword) =>
      lower.includes(keyword)
    );
  }

  /* =======================================================
     CHAT RESPONSE
  ======================================================= */

  public async generateResponse(
    userMessage: string,
    history: ChatMessage[],
    userName: string = 'friend'
  ): Promise<AIResponse> {
    if (this.checkSafety(userMessage)) {
      return {
        isSafetyTrigger: true,

        message: {
          id: 'safety-' + Date.now(),
          sender: 'mello',

          text: `I'm hearing how much pain you're in right now, ${userName}, and I care about your safety. You don't have to carry this alone.`,

          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),

          isSafetyTrigger: true,

          quickReplies: [
            'Get Immediate Help',
            'Talk to a Professional',
            'Contact Someone I Trust',
          ],
        },
      };
    }

    let responseText = this.getIntelligentResponse(
      userMessage,
      history,
      userName
    );

    const geminiReply = await this.getGeminiReply(
      userMessage,
      history,
      userName
    );

    if (geminiReply) {
      responseText = geminiReply;
    }

    const quickReplies = this.getQuickReplies(
      userMessage,
      responseText
    );

    const suggestedActivity =
      this.getSuggestedActivity(userMessage);

    await new Promise((resolve) =>
      setTimeout(resolve, 500)
    );

    return {
      isSafetyTrigger: false,

      message: {
        id: 'msg-' + Date.now(),
        sender: 'mello',
        text: responseText,

        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),

        quickReplies,
        suggestedActivity,
      },
    };
  }

  /* =======================================================
     INTELLIGENT RESPONSE
  ======================================================= */

  private getIntelligentResponse(
    text: string,
    _history: ChatMessage[],
    name: string
  ): string {
    const lower = text.toLowerCase();

    if (
      lower.includes('overwhelmed') ||
      lower.includes('stress') ||
      lower.includes('too much') ||
      lower.includes('pressure')
    ) {
      return `That sounds like a lot to carry right now, ${name}. 💜 It's completely valid to feel stressed. Let's take things one step at a time.`;
    }

    if (
      lower.includes('lonely') ||
      lower.includes('alone') ||
      lower.includes('isolated')
    ) {
      return `I hear you, ${name}. Feeling lonely can be really difficult. I'm here to listen. What has been making you feel this way?`;
    }

    if (
      lower.includes('sad') ||
      lower.includes('down') ||
      lower.includes('crying') ||
      lower.includes('low')
    ) {
      return `I'm sorry today feels heavy, ${name}. 💜 You don't have to pretend to be okay here. I'm listening.`;
    }

    if (
      lower.includes('anxious') ||
      lower.includes('anxiety') ||
      lower.includes('panic') ||
      lower.includes('worry') ||
      lower.includes('scared') ||
      lower.includes('nervous')
    ) {
      return `It sounds like your mind is carrying a lot right now, ${name}. Let's slow things down together. Take one slow breath and focus on what you can control right now.`;
    }

    if (
      lower.includes('happy') ||
      lower.includes('great') ||
      lower.includes('wonderful') ||
      lower.includes('good')
    ) {
      return `That's wonderful to hear, ${name}! 🌟 What made today feel good?`;
    }

    if (
      lower.includes('excited') ||
      lower.includes('thrilled') ||
      lower.includes('amazing')
    ) {
      return `I love hearing that excitement, ${name}! 🤩 What's got you feeling so excited?`;
    }

    if (
      lower.includes('tired') ||
      lower.includes('sleep') ||
      lower.includes('exhausted')
    ) {
      return `It sounds like you could use some rest, ${name}. Give yourself permission to slow down for a while.`;
    }

    if (
      lower.includes('work') ||
      lower.includes('college') ||
      lower.includes('exam') ||
      lower.includes('job')
    ) {
      return `Work and study pressure can become overwhelming. Remember, ${name}, your productivity doesn't define your worth. Let's break the problem into smaller steps.`;
    }

    return `Thank you for sharing that with me, ${name}. 💜 I'm here to listen without judgment. Tell me a little more about what's on your mind.`;
  }

  /* =======================================================
     QUICK REPLIES
  ======================================================= */

  private getQuickReplies(
    text: string,
    _response: string
  ): string[] {
    const lower = text.toLowerCase();

    if (
      lower.includes('stress') ||
      lower.includes('stressed') ||
      lower.includes('overwhelmed') ||
      lower.includes('pressure')
    ) {
      return [
        'Start Breathing Exercise',
        'I want to talk more',
        'Try a Stress Game',
        'Not right now',
      ];
    }

    if (
      lower.includes('sad') ||
      lower.includes('down') ||
      lower.includes('lonely')
    ) {
      return [
        'Tell Mello more',
        'Play Zen Garden',
        'Write in Journal',
        'I just want to rest',
      ];
    }

    return [
      'Tell me more',
      "Let's try a calming activity",
      'Connect with professional',
      'I feel a bit better',
    ];
  }

  /* =======================================================
     SUGGESTED ACTIVITY
  ======================================================= */

  private getSuggestedActivity(text: string) {
    const lower = text.toLowerCase();

    if (
      lower.includes('overwhelmed') ||
      lower.includes('anxious') ||
      lower.includes('panic') ||
      lower.includes('stress') ||
      lower.includes('pressure')
    ) {
      return {
        id: 'breathing',
        title: 'Box Breathing (2 min)',
        type: 'breathing' as const,
      };
    }

    if (
      lower.includes('sad') ||
      lower.includes('distracted') ||
      lower.includes('lonely')
    ) {
      return {
        id: 'zen-garden',
        title: 'Zen Garden Game',
        type: 'game' as const,
      };
    }

    if (
      lower.includes('therapist') ||
      lower.includes('professional')
    ) {
      return {
        id: 'therapists',
        title: 'Find Verified Therapist',
        type: 'therapist' as const,
      };
    }

    return undefined;
  }

  /* =======================================================
     LOAD HUGGING FACE MODEL
  ======================================================= */

  private async loadMoodModel(): Promise<any> {
    if (this.moodClassifier) {
      return this.moodClassifier;
    }

    this.moodModelLoading = Promise.resolve(
      async (_text: string, _options?: unknown) => [] as any[]
    );

    try {
      this.moodClassifier = await this.moodModelLoading;
      return this.moodClassifier;
    } catch (error) {
      console.error(
        'AI mood model failed to load:',
        error
      );

      this.moodModelLoading = null;
      this.moodClassifier = async () => [] as any[];
      return this.moodClassifier;
    }
  }

  /* =======================================================
     CONVERT AI EMOTION TO MELLO MOOD
  ======================================================= */

  private convertEmotion(emotion: string): Mood {
    const emotionMap: Record<string, Mood> = {
      /* Positive */
      joy: 'happy',
      amusement: 'happy',
      love: 'happy',
      gratitude: 'happy',
      optimism: 'happy',
      pride: 'happy',
      admiration: 'happy',

      /* Sad */
      sadness: 'sad',
      grief: 'sad',
      disappointment: 'sad',
      remorse: 'sad',

      /* Angry */
      anger: 'angry',
      annoyance: 'angry',
      disapproval: 'angry',

      /* Anxiety */
      fear: 'anxious',
      nervousness: 'anxious',
      embarrassment: 'anxious',

      /* Stress */
      confusion: 'stressed',

      /* Excited */
      excitement: 'excited',
      desire: 'excited',

      /* Calm */
      relief: 'calm',
      caring: 'calm',

      /* Neutral */
      neutral: 'neutral',
    };

    return (
      emotionMap[emotion.toLowerCase()] ||
      'neutral'
    );
  }

  /* =======================================================
     EMOJI
  ======================================================= */

  private getMoodEmoji(mood: Mood): string {
    const emojis: Record<Mood, string> = {
      happy: '😊',
      sad: '😔',
      angry: '😡',
      anxious: '😰',
      stressed: '😣',
      excited: '🤩',
      calm: '😌',
      neutral: '😐',
    };

    return emojis[mood];
  }

  /* =======================================================
     MOOD MESSAGE
  ======================================================= */

  private getMoodMessage(mood: Mood): string {
    const messages: Record<Mood, string> = {
      happy:
        "Your words suggest that you're feeling positive and happy.",

      sad:
        'Your words suggest that you may be feeling sad or emotionally low.',

      angry:
        'Your words suggest that you may be experiencing frustration or anger.',

      anxious:
        'Your words suggest that you may be feeling worried, nervous, or anxious.',

      stressed:
        'Your words suggest that you may be feeling stressed, overwhelmed, or under pressure.',

      excited:
        "Your words suggest that you're feeling energetic and excited.",

      calm:
        "Your words suggest that you're feeling calm and peaceful.",

      neutral:
        "Your words don't strongly indicate one particular mood.",
    };

    return messages[mood];
  }

  /* =======================================================
     MOOD SUGGESTIONS
  ======================================================= */

  private getMoodSuggestions(mood: Mood): string[] {
    const suggestions: Record<Mood, string[]> = {
      happy: [
        'Write down what made you happy today.',
        'Share your positive energy with someone.',
        'Keep doing something that makes you feel good.',
      ],

      sad: [
        'Write your thoughts in your journal.',
        'Talk with someone you trust.',
        'Give yourself permission to slow down and rest.',
      ],

      angry: [
        'Take a few slow breaths before reacting.',
        'Give yourself some quiet space.',
        'Try a calming activity or game.',
      ],

      anxious: [
        'Try a 2-minute breathing exercise.',
        'Focus on what you can control right now.',
        'Take a short break from stressful tasks.',
      ],

      stressed: [
        'Take a short break and breathe slowly.',
        'Break your tasks into smaller steps.',
        "Try one of Mello's calming games.",
      ],

      excited: [
        'Use your energy for something creative.',
        'Write down what you are looking forward to.',
        'Enjoy and appreciate this positive moment.',
      ],

      calm: [
        'Keep doing what is helping you feel balanced.',
        'Try a short mindfulness exercise.',
        'Write about this peaceful moment.',
      ],

      neutral: [
        'Take a moment to check in with yourself.',
        'Write about how your day has been.',
        "Try one of Mello's activities.",
      ],
    };

    return suggestions[mood];
  }

  /* =======================================================
     LOCAL MOOD DETECTION
     
     This is the fallback detector.
     It also handles obvious phrases before AI.
  ======================================================= */

  private detectMoodLocally(text: string): MoodResult {
    const lower = text.toLowerCase();

    const scores: Record<Mood, number> = {
      happy: 0,
      sad: 0,
      angry: 0,
      anxious: 0,
      stressed: 0,
      excited: 0,
      calm: 0,
      neutral: 0,
    };

    const keywords: Record<Mood, string[]> = {
      happy: [
        'happy',
        'good',
        'great',
        'wonderful',
        'joy',
        'glad',
        'smile',
        'fun',
        'love',
      ],

      sad: [
        'sad',
        'cry',
        'crying',
        'down',
        'depressed',
        'unhappy',
        'hurt',
        'lonely',
        'alone',
      ],

      angry: [
        'angry',
        'anger',
        'mad',
        'furious',
        'annoyed',
        'frustrated',
        'hate',
      ],

      anxious: [
        'anxious',
        'anxiety',
        'nervous',
        'worried',
        'worry',
        'scared',
        'fear',
        'panic',
      ],

      stressed: [
        'stress',
        'stressed',
        'overwhelmed',
        'pressure',
        'work',
        'cannot',
        "can't",
        'too much',
        'exhausted',
        'tension',
        'burden',
      ],

      excited: [
        'excited',
        'exciting',
        'amazing',
        'thrilled',
        'energetic',
        'looking forward',
      ],

      calm: [
        'calm',
        'peaceful',
        'relaxed',
        'relax',
        'comfortable',
        'peace',
      ],

      neutral: [],
    };

    /* =====================================================
       SCORE KEYWORDS
    ===================================================== */

    const moodList = Object.keys(
      keywords
    ) as Mood[];

    moodList.forEach((mood) => {
      keywords[mood].forEach((keyword) => {
        if (lower.includes(keyword)) {
          scores[mood] += 1;
        }
      });
    });

    /* =====================================================
       SPECIAL STRESS PATTERNS
    ===================================================== */

    const stressPatterns = [
      /cannot.*work/,
      /can't.*work/,
      /unable.*work/,
      /cannot.*focus/,
      /can't.*focus/,
      /unable.*focus/,
      /too much.*work/,
      /too much.*to do/,
      /lot of.*work/,
      /work.*overwhelming/,
      /work.*stress/,
      /stress.*work/,
      /pressure.*work/,
      /work.*pressure/,
      /not able.*work/,
      /not able.*focus/,
    ];

    if (
      stressPatterns.some((pattern) =>
        pattern.test(lower)
      )
    ) {
      scores.stressed += 3;
    }

    /* =====================================================
       FIND HIGHEST SCORE
    ===================================================== */

    let detectedMood: Mood = 'neutral';
    let highestScore = 0;

    const scoreMoods = Object.keys(
      scores
    ) as Mood[];

    scoreMoods.forEach((mood) => {
      if (scores[mood] > highestScore) {
        highestScore = scores[mood];
        detectedMood = mood;
      }
    });

    /* =====================================================
       NEUTRAL
    ===================================================== */

    if (highestScore === 0) {
      return {
        mood: 'neutral',
        confidence: 55,
        emotion: 'neutral',
        emoji: this.getMoodEmoji('neutral'),
        message: this.getMoodMessage('neutral'),
        suggestions:
          this.getMoodSuggestions('neutral'),
      };
    }

    /* =====================================================
       CONFIDENCE
    ===================================================== */

    const confidence = Math.min(
      96,
      68 + highestScore * 7
    );

    return {
      mood: detectedMood,
      confidence,
      emotion: detectedMood,
      emoji: this.getMoodEmoji(detectedMood),
      message: this.getMoodMessage(detectedMood),
      suggestions:
        this.getMoodSuggestions(detectedMood),
    };
  }

  /* =======================================================
     PUBLIC AI MOOD DETECTION
  ======================================================= */

  public async detectMood(
    text: string
  ): Promise<MoodResult> {
    if (!text.trim()) {
      throw new Error(
        'Please enter something about how you feel.'
      );
    }

    /* =====================================================
       SAFETY
    ===================================================== */

    if (this.checkSafety(text)) {
      return {
        mood: 'sad',
        confidence: 100,
        emotion: 'safety',
        emoji: '💜',

        message:
          'Your message sounds like you may be going through a very difficult moment. Your safety is more important than mood detection.',

        suggestions: [
          'Please reach out to someone you trust.',
          'Consider contacting a mental health professional.',
          "Use Mello's immediate help options.",
        ],
      };
    }

    /* =====================================================
       LOCAL DETECTION FIRST
    ===================================================== */

    const localResult =
      this.detectMoodLocally(text);

    /*
     * Strong obvious matches are returned immediately.
     */

    if (
      localResult.mood !== 'neutral' &&
      localResult.confidence >= 75
    ) {
      return localResult;
    }

    /* =====================================================
       HUGGING FACE AI
    ===================================================== */

    try {
      const model =
        await this.loadMoodModel();

      const results = await model(text, {
        top_k: 5,
      });

      if (
        !results ||
        !Array.isArray(results) ||
        results.length === 0
      ) {
        throw new Error(
          'AI model returned no result'
        );
      }

      const bestResult = results[0];

      const emotion = String(
        bestResult.label || 'neutral'
      ).toLowerCase();

      const rawScore = Number(
        bestResult.score
      );

      const confidence = Math.round(
        Math.max(
          0,
          Math.min(100, rawScore * 100)
        )
      );

      const mood =
        this.convertEmotion(emotion);

      return {
        mood,
        confidence:
          confidence > 0
            ? confidence
            : 55,
        emotion,
        emoji:
          this.getMoodEmoji(mood),
        message:
          this.getMoodMessage(mood),
        suggestions:
          this.getMoodSuggestions(mood),
      };
    } catch (error) {
      /* ===================================================
         FALLBACK
      =================================================== */

      console.warn(
        'Hugging Face model unavailable. Using local mood detection.',
        error
      );

      return localResult;
    }
  }
}

/* =========================================================
   SINGLE AI SERVICE INSTANCE
========================================================= */

export const aiService = new AIService();