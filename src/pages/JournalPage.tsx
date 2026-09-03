import React, { useState } from 'react';
import { BookOpen, Plus, Search, Trash2, Sparkles, Tag, Lock, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const JournalPage: React.FC = () => {
  const { journals, addJournal, deleteJournal } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string | undefined>(undefined);

  const prompts = [
    "What was one good thing today?",
    "What felt difficult today?",
    "What do you need right now?",
    "What is one thing you appreciate about yourself?"
  ];

  const handleSelectPrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
    setTitle(prompt);
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addJournal(title.trim(), content.trim(), 'good', ['Reflection'], selectedPrompt);
    setTitle('');
    setContent('');
    setSelectedPrompt(undefined);
    setIsCreating(false);
  };

  const filteredJournals = journals.filter(j => 
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    j.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-mello border border-purple-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              My Journal 📖
            </h1>
            <p className="text-slate-500 text-sm">
              Your private sanctuary for thoughts, gratitude, and daily reflection.
            </p>
          </div>
        </div>

        <button
          onClick={() => { setIsCreating(!isCreating); setSelectedPrompt(undefined); }}
          className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-mello text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Journal Entry
        </button>
      </div>

      {/* Prompts Bar */}
      <div className="bg-purple-50/70 p-5 rounded-3xl border border-purple-100 space-y-3">
        <h3 className="text-xs font-extrabold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-600" /> Daily Prompts for Inspiration
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {prompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPrompt(prompt)}
              className="p-3 bg-white hover:bg-purple-100/60 rounded-xl text-left border border-purple-200 text-xs font-semibold text-purple-900 transition-colors flex items-center justify-between"
            >
              <span>"{prompt}"</span>
              <ArrowRight className="w-3.5 h-3.5 text-purple-500 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* New Entry Composer Form */}
      {isCreating && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl shadow-mello border border-purple-200 space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Write Journal Reflection</h3>
          
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title of entry..."
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            required
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Express your thoughts freely here..."
            rows={5}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            required
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 bg-slate-100 text-slate-600 font-semibold rounded-xl text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md"
            >
              Save Entry (+20 XP)
            </button>
          </div>
        </form>
      )}

      {/* Search & Entry List */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search journal entries..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 shadow-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />
        </div>

        {filteredJournals.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 text-slate-400 space-y-2">
            <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-semibold">No journal entries found.</p>
            <p className="text-xs">Start writing your first reflection above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJournals.map(j => (
              <div key={j.id} className="p-6 bg-white rounded-3xl shadow-mello border border-purple-100 space-y-3 relative group">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{j.title}</h3>
                    <span className="text-[10px] font-semibold text-slate-400">{j.date}</span>
                  </div>
                  <button
                    onClick={() => deleteJournal(j.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Delete entry permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-wrap">{j.content}</p>

                <div className="flex items-center space-x-2 pt-2 border-t border-slate-50">
                  <Lock className="w-3 h-3 text-emerald-500" />
                  <span className="text-[10px] text-emerald-700 font-medium">100% Private Entry</span>
                  {j.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[9px] font-extrabold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
