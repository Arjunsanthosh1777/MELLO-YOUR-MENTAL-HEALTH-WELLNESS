import { ChatMessage } from '../types';

// Keywords that trigger safety protocol
const SAFETY_KEYWORDS = [
  'kill myself', 'suicide', 'want to die', 'end my life', 'self harm', 
  'cutting myself', 'hurt myself', 'don\'t want to live', 'no reason to live',
  'better off dead', 'can\'t go on anymore', 'ending it all'
];

export interface AIResponse {
  message: ChatMessage;
  isSafetyTrigger: boolean;
}

class AIService {
  private apiKey: string;
  private memory: { key: string; value: string }[] = [];

  constructor() {
    this.apiKey = import.meta.env.VITE_AI_API_KEY || '';
  }

  // Safety Pre-Moderation
  public checkSafety(text: string): boolean {
    const lower = text.toLowerCase();
    return SAFETY_KEYWORDS.some(keyword => lower.includes(keyword));
  }

  // Generate Mello Companion Response
  public async generateResponse(
    userMessage: string, 
    history: ChatMessage[], 
    userName: string = 'friend'
  ): Promise<AIResponse> {
    // 1. Safety Check
    if (this.checkSafety(userMessage)) {
      return {
        isSafetyTrigger: true,
        message: {
          id: 'safety-' + Date.now(),
          sender: 'mello',
          text: `I'm hearing how much pain you're in right now, ${userName}, and I care about your safety. You don't have to carry this alone. I want to make sure you have real human support right away.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSafetyTrigger: true,
          quickReplies: ['Get Immediate Help', 'Talk to a Professional', 'Contact Someone I Trust']
        }
      };
    }

    const responseText = this.apiKey
      ? await this.getGeminiResponse(userMessage, history, userName)
      : this.getIntelligentResponse(userMessage, history, userName);
    const quickReplies = this.getQuickReplies(userMessage, responseText);
    const suggestedActivity = this.getSuggestedActivity(userMessage);

    // Artificial gentle delay to feel organic
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600));

    return {
      isSafetyTrigger: false,
      message: {
        id: 'msg-' + Date.now(),
        sender: 'mello',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies,
        suggestedActivity
      }
    };
  }

  private async getGeminiResponse(
    userMessage: string,
    history: ChatMessage[],
    userName: string
  ): Promise<string> {
    try {
      const contents = history
        .filter((message) => message.sender === 'user' || message.sender === 'mello')
        .map((message) => ({
          role: message.sender === 'user' ? 'user' : 'model',
          parts: [{ text: message.text }],
        }));

      if (contents.at(-1)?.role !== 'user') {
        contents.push({ role: 'user', parts: [{ text: userMessage }] });
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(this.apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{
                text: `You are Mello, a warm and emotionally intelligent mental-wellness companion. The user's name is ${userName}. Reply naturally like a thoughtful human listener: acknowledge what they said, ask at most one gentle follow-up question, and keep responses concise (2-4 short paragraphs). Never claim to be a therapist, diagnose, or pretend to have human feelings. Offer practical calming ideas only when relevant. Encourage trusted people or licensed professionals for serious concerns. Do not be overly cheerful when the user is hurting.`,
              }],
            },
            contents,
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 300,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini request failed with status ${response.status}`);
      }

      const data = await response.json() as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const text = data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || '')
        .join('')
        .trim();

      if (!text) throw new Error('Gemini returned an empty response');
      return text;
    } catch (error) {
      console.warn('Gemini unavailable; using local Mello responses.', error);
      return this.getIntelligentResponse(userMessage, history, userName);
    }
  }

  private getIntelligentResponse(text: string, history: ChatMessage[], name: string): string {
    const lower = text.toLowerCase();

    if (lower.includes('overwhelmed') || lower.includes('stress') || lower.includes('too much')) {
      return `That sounds like a lot to carry on your shoulders right now, ${name}. 💜 It's completely valid to feel overwhelmed. When everything feels heavy, taking just one slow breath can help ground us. Would you like to try a 2-minute breathing exercise together, or tell me what's feeling hardest right now?`;
    }

    if (lower.includes('lonely') || lower.includes('alone') || lower.includes('isolated')) {
      return `I hear you, ${name}. Feeling lonely can feel really cold, but I'm right here with you. You're not alone today. How long have you been feeling this way?`;
    }

    if (lower.includes('sad') || lower.includes('down') || lower.includes('crying') || lower.includes('low')) {
      return `I'm so sorry today feels heavy, ${name}. Thank you for sharing that with me. It takes courage to acknowledge sadness. You don't have to pretend to be okay here. Want to talk about it, or would you prefer a quick calming game to give your mind a gentle break?`;
    }

    if (lower.includes('anxious') || lower.includes('panic') || lower.includes('worry') || lower.includes('scared')) {
      return `Anxiety can make your mind feel like it's racing. Let's slow things down together, ${name}. Try placing your hand over your heart and taking a slow breath in... and out. What's the main thought keeping you up right now?`;
    }

    if (lower.includes('good') || lower.includes('great') || lower.includes('happy') || lower.includes('wonderful')) {
      return `That brings a huge smile to my face, ${name}! 🌟 I love hearing when you're having a good day. What was something positive or peaceful that happened today?`;
    }

    if (lower.includes('sleep') || lower.includes('tired') || lower.includes('insomnia') || lower.includes('exhausted')) {
      return `Rest is so important for your mind and body. Being exhausted makes everything feel ten times harder. Have you been able to unplug for a bit tonight, or is your mind still racing with thoughts?`;
    }

    if (lower.includes('work') || lower.includes('college') || lower.includes('exam') || lower.includes('job')) {
      return `Pressure from work or studies can drain your energy fast. Remember that your productivity doesn't define your worth as a person. How can I best support you with this right now?`;
    }

    if (lower.includes('therapist') || lower.includes('doctor') || lower.includes('professional')) {
      return `Connecting with a licensed professional is such a powerful and healthy step! Mello is here for your daily check-ins, but human therapists can offer deep personalized guidance. Would you like me to help you find verified professionals on Mello?`;
    }

    // Default friendly response
    const defaultResponses = [
      `Thank you for opening up to me, ${name}. I'm here listening without any judgment. How does it feel to share that?`,
      `I really appreciate you sharing what's on your mind. Small steps make a big difference over time. How are you holding up right now?`,
      `I'm glad you came to talk today. Every emotion you have is valid. Would you like to explore this further or take a relaxing pause?`
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  private getQuickReplies(text: string, response: string): string[] {
    const lower = text.toLowerCase();
    if (lower.includes('overwhelmed') || lower.includes('stress')) {
      return ['Start Breathing Exercise', 'I want to talk more', 'Try a Stress Game', 'Not right now'];
    }
    if (lower.includes('sad') || lower.includes('down')) {
      return ['Tell Mello more', 'Play Zen Garden', 'Write in Journal', 'I just want to rest'];
    }
    return ['Tell me more', 'Let\'s try a calming activity', 'Connect with professional', 'I feel a bit better'];
  }

  private getSuggestedActivity(text: string) {
    const lower = text.toLowerCase();
    if (lower.includes('overwhelmed') || lower.includes('anxious') || lower.includes('panic')) {
      return { id: 'breathing', title: 'Box Breathing (2 min)', type: 'breathing' as const };
    }
    if (lower.includes('sad') || lower.includes('distracted')) {
      return { id: 'zen-garden', title: 'Zen Garden Game', type: 'game' as const };
    }
    if (lower.includes('therapist') || lower.includes('help')) {
      return { id: 'therapists', title: 'Find Verified Therapist', type: 'therapist' as const };
    }
    return undefined;
  }
}

export const aiService = new AIService();
