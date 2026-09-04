import React, { useState } from 'react';

import {
  Brain,
  Sparkles,
  Loader2,
  Heart,
  RefreshCw,
  AlertTriangle,
  PhoneCall,
  Users,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';

import { aiService } from '../services/aiService';
import type { MoodResult } from '../services/aiService';

/* =========================================================
   HIGH-RISK SAFETY DETECTION
========================================================= */

const HIGH_RISK_PHRASES = [
  'suicide',
  'suicidal',
  'kill myself',
  'killing myself',
  'i will kill myself',
  'i am going to kill myself',
  'want to die',
  'wanna die',
  'i want to die',
  'i wish i was dead',
  'i wish i were dead',
  'wish i was dead',
  'wish i were dead',
  'end my life',
  'ending my life',
  'i will end my life',
  'going to end my life',
  'take my life',
  'taking my life',
  'hurt myself',
  'hurting myself',
  'harm myself',
  'harming myself',
  'self harm',
  'self-harm',
  'selfharm',
  'cut myself',
  'cutting myself',
  'no reason to live',
  'dont want to live',
  "don't want to live",
  'do not want to live',
  'life is not worth living',
  'better off dead',
  'i should die',
  'i need to die',
  'i am going to die',
];

/* =========================================================
   SAFETY CHECK
========================================================= */

const isHighRiskMessage = (message: string): boolean => {
  const normalizedText = message
    .toLowerCase()
    .replace(/[^\w\s'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return HIGH_RISK_PHRASES.some((phrase) =>
    normalizedText.includes(phrase)
  );
};

/* =========================================================
   EMERGENCY SUPPORT SCREEN
========================================================= */

interface EmergencySupportProps {
  onBack: () => void;
}

const EmergencySupport: React.FC<EmergencySupportProps> = ({
  onBack,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-purple-50 p-6">
      <div className="mx-auto max-w-4xl">

        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Mood Detection
        </button>

        {/* Emergency Card */}
        <div className="overflow-hidden rounded-3xl border border-red-100 bg-white shadow-2xl">

          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-rose-600 p-8 text-white">

            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
              <AlertTriangle className="h-9 w-9" />
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">
                You're Not Alone
              </h1>

              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                Safety Support
              </span>
            </div>

            <p className="mt-3 max-w-2xl leading-7 text-red-50">
              It sounds like you may be going through an extremely
              difficult moment. Your safety is more important than
              anything else right now.
            </p>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">

            {/* Safety Notice */}
            <div className="mb-7 rounded-2xl border border-red-100 bg-red-50 p-5">
              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100">
                  <ShieldCheck className="h-6 w-6 text-red-600" />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    Please stay safe right now
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    If you think you may hurt yourself or you are in
                    immediate danger, please move somewhere safe and
                    stay with another person you trust.
                  </p>
                </div>

              </div>
            </div>

            {/* Emergency Call */}
            <a
              href="tel:112"
              className="mb-4 flex items-center justify-between rounded-2xl bg-red-600 p-5 text-white shadow-lg transition hover:bg-red-700 hover:shadow-xl"
            >
              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                  <PhoneCall className="h-6 w-6" />
                </div>

                <div>
                  <p className="font-bold">
                    Emergency Services
                  </p>

                  <p className="mt-1 text-sm text-red-100">
                    Call immediately if you are in danger
                  </p>
                </div>

              </div>

              <span className="text-2xl font-bold">
                112
              </span>
            </a>

            {/* Mental Health Support */}
            <a
              href="tel:14416"
              className="mb-4 flex items-center justify-between rounded-2xl border border-purple-200 bg-purple-50 p-5 transition hover:bg-purple-100"
            >
              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>

                <div>
                  <p className="font-bold text-gray-900">
                    Talk to a Mental Health Professional
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Tele-MANAS • 24×7 mental health support
                  </p>
                </div>

              </div>

              <span className="text-xl font-bold text-purple-700">
                14416
              </span>
            </a>

            {/* Trusted Person */}
            <div className="mb-7 rounded-2xl border border-green-200 bg-green-50 p-5">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100">
                  <Users className="h-6 w-6 text-green-600" />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Reach someone you trust
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Call or message a friend, family member, teacher,
                    counsellor, or another person who can stay with you.
                    You don't have to face this moment alone.
                  </p>
                </div>

              </div>

            </div>

            {/* Grounding Message */}
            <div className="rounded-2xl bg-gray-50 p-6 text-center">

              <p className="text-lg font-semibold text-gray-800">
                Take one moment at a time.
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Put some distance between yourself and anything you
                could use to hurt yourself, and try to stay around
                people who can support you.
              </p>

            </div>

            {/* Back */}
            <button
              onClick={onBack}
              className="mx-auto mt-7 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-medium text-gray-600 transition hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Mood Detection
            </button>

            <p className="mt-5 text-center text-xs text-gray-400">
              Mello provides supportive guidance but is not a
              replacement for emergency or professional care.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   MAIN MOOD PAGE
========================================================= */

export const MoodPage1: React.FC = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<MoodResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEmergency, setShowEmergency] = useState(false);

  /* =======================================================
     DETECT MOOD
  ======================================================= */

  const handleDetectMood = async () => {
    if (!text.trim()) {
      setError('Tell me a little about how you are feeling.');
      return;
    }

    /*
     * SAFETY CHECK FIRST
     *
     * High-risk messages never go to the normal
     * mood detection system.
     */

    if (isHighRiskMessage(text)) {
      setLoading(false);
      setResult(null);
      setError('');
      setShowEmergency(true);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResult(null);

      const mood = await aiService.detectMood(text);

      setResult(mood);
    } catch (err) {
      console.error('Mood detection error:', err);

      setError(
        'Unable to analyze your mood right now. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     RESET
  ======================================================= */

  const reset = () => {
    setText('');
    setResult(null);
    setError('');
    setLoading(false);
    setShowEmergency(false);
  };

  /* =======================================================
     EXAMPLE
  ======================================================= */

  const useExample = (example: string) => {
    setText(example);
    setResult(null);
    setError('');
    setShowEmergency(false);
  };

  /* =======================================================
     EMERGENCY SCREEN
  ======================================================= */

  if (showEmergency) {
    return (
      <EmergencySupport
        onBack={() => {
          setShowEmergency(false);
          setText('');
        }}
      />
    );
  }

  /* =======================================================
     NORMAL MOOD PAGE
  ======================================================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100">
            <Brain className="h-8 w-8 text-indigo-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            AI Mood Detection
          </h1>

          <p className="mt-2 text-gray-600">
            Tell Mello how you're feeling and let AI understand your mood.
          </p>

        </div>

        {/* Input */}
        <div className="rounded-3xl bg-white p-6 shadow-xl">

          <label className="mb-3 block text-lg font-semibold text-gray-800">
            How are you feeling?
          </label>

          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError('');
            }}
            placeholder="Example: I've had a really stressful day. I have so much work to finish and I feel overwhelmed..."
            rows={7}
            maxLength={500}
            className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 text-gray-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

            <p className="text-sm text-gray-400">
              {text.length}/500 characters
            </p>

            <button
              onClick={handleDetectMood}
              disabled={loading || !text.trim()}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Detect My Mood
                </>
              )}
            </button>

          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-6 rounded-3xl bg-white p-8 text-center shadow-lg">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
              <Brain className="h-7 w-7 animate-pulse text-indigo-600" />
            </div>

            <h2 className="font-semibold text-gray-800">
              AI is analyzing your words...
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              The first analysis may take a little longer while the AI
              model loads.
            </p>

          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="mt-6 space-y-5">

            {/* Main Result */}
            <div className="rounded-3xl bg-white p-8 text-center shadow-xl">

              <p className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-400">
                Your detected mood
              </p>

              <div className="mb-3 text-7xl">
                {result.emoji}
              </div>

              <h2 className="text-4xl font-bold capitalize text-gray-900">
                {result.mood}
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-gray-600">
                {result.message}
              </p>

              {/* Emotion */}
              <div className="mt-4 text-sm text-gray-400">
                Detected emotion:{' '}
                <span className="font-semibold text-gray-600">
                  {result.emotion}
                </span>
              </div>

              {/* Confidence */}
              <div className="mx-auto mt-6 max-w-md">

                <div className="mb-2 flex justify-between text-sm">

                  <span className="text-gray-500">
                    AI confidence
                  </span>

                  <span className="font-semibold text-indigo-600">
                    {result.confidence}%
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-100">

                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, result.confidence)
                      )}%`,
                    }}
                  />

                </div>

              </div>

            </div>

            {/* Suggestions */}
            <div className="rounded-3xl bg-white p-6 shadow-lg">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100">
                  <Heart className="h-5 w-5 text-pink-500" />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Suggestions for you
                  </h3>

                  <p className="text-sm text-gray-500">
                    Based on your detected mood
                  </p>
                </div>

              </div>

              <div className="space-y-3">

                {result.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4"
                  >

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                      {index + 1}
                    </div>

                    <p className="text-gray-700">
                      {suggestion}
                    </p>

                  </div>
                ))}

              </div>

            </div>

            {/* Reset */}
            <button
              onClick={reset}
              className="mx-auto flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-medium text-gray-600 transition hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" />
              Analyze Another Mood
            </button>

          </div>
        )}

        {/* Examples */}
        {!result && !loading && (
          <div className="mt-6 rounded-3xl bg-white p-6 shadow-lg">

            <h3 className="mb-4 font-semibold text-gray-800">
              Try something like:
            </h3>

            <div className="grid gap-3 md:grid-cols-3">

              {[
                "I'm feeling really happy today!",
                'Everything feels overwhelming and stressful.',
                "I'm nervous about tomorrow.",
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => useExample(example)}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-left text-sm text-gray-600 transition hover:border-indigo-200 hover:bg-indigo-50"
                >
                  "{example}"
                </button>
              ))}

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default MoodPage1;