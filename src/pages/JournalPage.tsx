import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Trash2,
  Sparkles,
  Lock,
  ArrowRight,
} from 'lucide-react';

import { useApp } from '../context/AppContext';

export const JournalPage: React.FC = () => {
  const { journals, addJournal, deleteJournal } = useApp();

  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string | undefined>(
    undefined
  );

  const prompts = [
    'What was one good thing today?',
    'What felt difficult today?',
    'What do you need right now?',
    'What is one thing you appreciate about yourself?',
  ];

  const handleSelectPrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
    setTitle(prompt);
    setIsCreating(true);
  };

  const handleNewEntry = () => {
    setSelectedPrompt(undefined);
    setTitle('');
    setContent('');
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      return;
    }

    addJournal(
      title.trim(),
      content.trim(),
      'good',
      ['Reflection'],
      selectedPrompt
    );

    setTitle('');
    setContent('');
    setSelectedPrompt(undefined);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setSelectedPrompt(undefined);
    setIsCreating(false);
  };

  const filteredJournals = journals.filter((journal) => {
    const query = searchQuery.toLowerCase();

    return (
      journal.title.toLowerCase().includes(query) ||
      journal.content.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[32px] border border-purple-100 bg-white shadow-[0_12px_40px_rgba(124,58,237,0.07)]">
          
          {/* Decorative background */}
          <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full bg-purple-100/60 blur-3xl" />
          <div className="absolute right-40 -bottom-32 w-64 h-64 rounded-full bg-pink-100/50 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-7 sm:px-10 py-8">

            {/* Left side */}
            <div className="flex items-center gap-5">

              <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-[24px] bg-gradient-to-br from-purple-100 to-violet-100 border border-purple-100 flex items-center justify-center shadow-[0_10px_25px_rgba(124,58,237,0.10)]">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-500 flex items-center justify-center text-white shadow-lg">
                  <BookOpen className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
                    My Journal
                  </h1>

                  <span className="text-2xl sm:text-3xl">
                    📖
                  </span>
                </div>

                <p className="mt-1 text-sm sm:text-base text-slate-500">
                  Your private sanctuary for thoughts, gratitude,
                  and daily reflection.
                </p>
              </div>
            </div>

            {/* New entry button */}
            <button
              type="button"
              onClick={handleNewEntry}
              className="shrink-0 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 text-white font-extrabold text-sm flex items-center gap-2 shadow-[0_10px_25px_rgba(124,58,237,0.25)] hover:scale-[1.02] transition-all"
            >
              <Plus className="w-5 h-5" />
              New Journal Entry
            </button>
          </div>
        </section>

        {/* =====================================================
            DAILY PROMPTS
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[30px] border border-purple-100 bg-gradient-to-br from-purple-50/70 via-white to-violet-50/50 p-6 sm:p-7">

          <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-purple-100/40 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>

              <h2 className="text-sm font-extrabold text-purple-900 uppercase tracking-wide">
                Daily Prompts for Inspiration
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {prompts.map((prompt, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectPrompt(prompt)}
                  className="group bg-white hover:bg-purple-50 border border-purple-200 hover:border-purple-300 rounded-2xl px-4 py-3.5 text-left flex items-center justify-between transition-all hover:shadow-sm"
                >
                  <span className="text-sm font-semibold text-purple-900">
                    "{prompt}"
                  </span>

                  <ArrowRight className="w-4 h-4 shrink-0 text-purple-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            JOURNAL COMPOSER
        ====================================================== */}
        {isCreating && (
          <form
            onSubmit={handleSave}
            className="relative overflow-hidden rounded-[30px] border border-purple-200 bg-white p-6 sm:p-7 shadow-[0_12px_35px_rgba(124,58,237,0.08)]"
          >
            <div className="absolute -right-16 -top-16 w-40 h-40 rounded-full bg-purple-100/60 blur-3xl" />

            <div className="relative space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Write Your Reflection ✨
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Take a moment to slow down and express your thoughts.
                </p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">
                  Entry Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your reflection a title..."
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">
                  Your Thoughts
                </label>

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Express your thoughts freely here..."
                  rows={6}
                  className="w-full px-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 text-white font-extrabold text-sm shadow-md transition-all"
                >
                  Save Entry +20 XP
                </button>
              </div>
            </div>
          </form>
        )}

        {/* =====================================================
            SEARCH
        ====================================================== */}
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search journal entries..."
            className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white border border-slate-200 shadow-[0_5px_20px_rgba(15,23,42,0.04)] text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
        </div>

        {/* =====================================================
            JOURNAL ENTRIES
        ====================================================== */}
        <section className="space-y-4">
          {filteredJournals.length === 0 ? (
            <div className="rounded-[30px] bg-white border border-slate-200 p-14 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-50 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-purple-300" />
              </div>

              <h3 className="mt-4 text-lg font-extrabold text-slate-800">
                No journal entries found
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Start writing your first reflection above.
              </p>
            </div>
          ) : (
            filteredJournals.map((journal) => (
              <article
                key={journal.id}
                className="group relative overflow-hidden rounded-[30px] bg-white border border-purple-100 p-6 sm:p-7 shadow-[0_8px_25px_rgba(15,23,42,0.04)] hover:shadow-[0_15px_35px_rgba(124,58,237,0.08)] transition-all"
              >
                {/* Decorative glow */}
                <div className="absolute -right-16 -bottom-16 w-40 h-40 rounded-full bg-purple-50 blur-3xl pointer-events-none" />

                <div className="relative">

                  {/* Entry header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                        {journal.title}
                      </h3>

                      <p className="mt-1 text-xs font-semibold text-slate-400">
                        {journal.date}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteJournal(journal.id)}
                      className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete journal entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <p className="mt-6 text-sm sm:text-base leading-7 text-slate-600 whitespace-pre-wrap">
                    {journal.content}
                  </p>

                  {/* Divider */}
                  <div className="mt-6 border-t border-slate-100" />

                  {/* Tags / privacy */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">

                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                      <Lock className="w-4 h-4" />
                      100% Private Entry
                    </div>

                    {journal.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-[10px] font-extrabold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))
          )}
        </section>

        {/* =====================================================
            WELLNESS MESSAGE
        ====================================================== */}
        <div className="rounded-[26px] border border-purple-100 bg-gradient-to-r from-purple-50 via-white to-pink-50 p-5">
          <div className="flex items-center justify-center gap-3 text-center">
            <Sparkles className="w-5 h-5 text-purple-500 shrink-0" />

            <p className="text-sm font-semibold text-purple-800">
              A few minutes of reflection can make a meaningful difference.
            </p>

            <span className="text-lg">🌱</span>
          </div>
        </div>

      </div>

      {/* =====================================================
          FLOATING DEMO CONTROL
      ====================================================== */}
      <button
        type="button"
        className="fixed right-5 bottom-5 z-40 px-5 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-violet-500 text-white font-extrabold text-sm flex items-center gap-3 shadow-[0_12px_30px_rgba(124,58,237,0.35)] hover:scale-105 transition-transform"
      >
        <Sparkles className="w-4 h-4" />
        Demo Controls
        <span className="text-xl leading-none">‹</span>
      </button>
    </div>
  );
};

export default JournalPage;