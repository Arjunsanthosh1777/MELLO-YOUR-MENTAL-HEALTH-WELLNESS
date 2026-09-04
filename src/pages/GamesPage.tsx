import React, { useState } from 'react';

import {
  Gamepad2,
  Play,
  Clock,
  Sparkles,
  Target,
  Brain,
  Leaf,
  Puzzle,
  FlaskConical,
  Flower2,
  Star,
  SlidersHorizontal,
  ArrowRight,
} from 'lucide-react';

import { useApp } from '../context/AppContext';

import { MindMaze } from '../components/games/MindMaze';
import { LiquidSort } from '../components/games/LiquidSort';
import { WordBloom } from '../components/games/WordBloom';
import { MemoryGlow } from '../components/games/MemoryGlow';

export const GamesPage: React.FC = () => {
  const { selectedGameId } = useApp();

  const validGameIds = [
    'mind-maze',
    'liquid-sort',
    'word-bloom',
    'memory-glow',
  ];

  const initialGameId =
    typeof selectedGameId === 'string' &&
    validGameIds.includes(selectedGameId)
      ? selectedGameId
      : null;

  const [activeGameId, setActiveGameId] =
    useState<string | null>(initialGameId);

  /* =========================================================
     GAME SCREENS
     ========================================================= */

  if (activeGameId === 'mind-maze') {
    return (
      <div className="py-4">
        <MindMaze
          onBack={() => setActiveGameId(null)}
        />
      </div>
    );
  }

  if (activeGameId === 'liquid-sort') {
    return (
      <div className="py-4">
        <LiquidSort
          onBack={() => setActiveGameId(null)}
        />
      </div>
    );
  }

  if (activeGameId === 'word-bloom') {
    return (
      <div className="py-4">
        <WordBloom
          onBack={() => setActiveGameId(null)}
        />
      </div>
    );
  }

  if (activeGameId === 'memory-glow') {
    return (
      <div className="py-4">
        <MemoryGlow
          onBack={() => setActiveGameId(null)}
        />
      </div>
    );
  }

  /* =========================================================
     GAME DATA
     ========================================================= */

  const games = [
    {
      id: 'mind-maze',
      title: 'Mind Maze',
      emoji: '🧩',
      description:
        'Solve puzzles and test your memory, focus and problem-solving skills. Difficulty increases as you progress.',
      duration: '3–5 min',
      category: 'Puzzle & Focus',
      xp: 20,
      icon: Puzzle,
      card: 'from-violet-50 via-purple-50 to-white',
      border: 'border-purple-200',
      iconBg: 'from-violet-400 to-purple-600',
      accent: 'text-purple-600',
      button:
        'hover:bg-purple-50 border-purple-200 text-purple-700',
      decoration: 'bg-purple-200',
    },

    {
      id: 'liquid-sort',
      title: 'Liquid Sort',
      emoji: '🧪',
      description:
        'Sort colorful liquids into matching tubes. Plan your moves, organize the colors and complete each level at your own pace.',
      duration: '3–6 min',
      category: 'Sorting & Focus',
      xp: 25,
      icon: FlaskConical,
      card: 'from-cyan-50 via-sky-50 to-white',
      border: 'border-cyan-200',
      iconBg: 'from-cyan-400 to-blue-600',
      accent: 'text-cyan-600',
      button:
        'hover:bg-cyan-50 border-cyan-200 text-cyan-700',
      decoration: 'bg-cyan-200',
    },

    {
      id: 'word-bloom',
      title: 'WordBloom',
      emoji: '🌸',
      description:
        'Discover hidden words, connect letters and grow your vocabulary while keeping your mind calm and focused.',
      duration: '3–5 min',
      category: 'Words & Focus',
      xp: 30,
      icon: Flower2,
      card: 'from-pink-50 via-rose-50 to-white',
      border: 'border-pink-200',
      iconBg: 'from-pink-400 to-rose-600',
      accent: 'text-pink-600',
      button:
        'hover:bg-pink-50 border-pink-200 text-pink-700',
      decoration: 'bg-pink-200',
    },

    {
      id: 'memory-glow',
      title: 'MemoryGlow',
      emoji: '✨',
      description:
        'Remember glowing patterns, repeat the sequence and strengthen your memory, concentration and attention.',
      duration: '3–6 min',
      category: 'Memory & Focus',
      xp: 30,
      icon: Star,
      card: 'from-amber-50 via-yellow-50 to-white',
      border: 'border-amber-200',
      iconBg: 'from-amber-400 to-orange-500',
      accent: 'text-amber-600',
      button:
        'hover:bg-amber-50 border-amber-200 text-amber-700',
      decoration: 'bg-amber-200',
    },
  ];

  /* =========================================================
     MAIN PAGE
     ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50 pb-12">

      {/* =====================================================
         HERO
         ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          rounded-[32px]
          border
          border-purple-100
          bg-white
          shadow-[0_15px_50px_rgba(109,40,217,0.08)]
          mb-8
        "
      >

        {/* Background glow */}

        <div
          className="
            absolute
            -right-32
            -top-32
            w-96
            h-96
            rounded-full
            bg-purple-200/50
            blur-3xl
          "
        />

        <div
          className="
            absolute
            right-10
            bottom-[-100px]
            w-72
            h-72
            rounded-full
            bg-pink-200/40
            blur-3xl
          "
        />

        <div
          className="
            relative
            min-h-[235px]
            flex
            items-center
            justify-between
            px-7
            sm:px-10
            py-8
          "
        >

          {/* LEFT CONTENT */}

          <div className="relative z-10 max-w-2xl">

            <div className="flex items-start gap-5">

              {/* Main Icon */}

              <div
                className="
                  hidden
                  sm:flex
                  w-20
                  h-20
                  shrink-0
                  rounded-[24px]
                  bg-gradient-to-br
                  from-purple-100
                  to-pink-100
                  border
                  border-purple-100
                  shadow-lg
                  items-center
                  justify-center
                "
              >
                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-gradient-to-br
                    from-purple-600
                    to-violet-500
                    flex
                    items-center
                    justify-center
                    text-white
                    shadow-lg
                  "
                >
                  <Gamepad2 className="w-8 h-8" />
                </div>
              </div>

              <div>

                {/* Title */}

                <div className="flex items-center gap-3">

                  <h1
                    className="
                      text-4xl
                      sm:text-5xl
                      font-extrabold
                      tracking-tight
                      text-slate-950
                    "
                  >
                    Mello Games
                  </h1>

                  <span className="text-3xl">
                    🎮
                  </span>

                </div>

                {/* Subtitle */}

                <p
                  className="
                    mt-2
                    text-base
                    sm:text-lg
                    text-slate-500
                  "
                >
                  <span className="font-bold text-purple-600">
                    Relax
                  </span>
                  , focus and{' '}
                  <span className="font-bold text-purple-600">
                    challenge
                  </span>{' '}
                  your mind with calming games.
                </p>

                {/* Benefits */}

                <div
                  className="
                    flex
                    flex-wrap
                    gap-2
                    mt-5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      px-3.5
                      py-2
                      rounded-full
                      bg-purple-50
                      border
                      border-purple-100
                      text-xs
                      font-bold
                      text-purple-700
                    "
                  >
                    <Target className="w-4 h-4" />
                    Boost Focus
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      px-3.5
                      py-2
                      rounded-full
                      bg-pink-50
                      border
                      border-pink-100
                      text-xs
                      font-bold
                      text-pink-700
                    "
                  >
                    <Brain className="w-4 h-4" />
                    Train Memory
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      px-3.5
                      py-2
                      rounded-full
                      bg-emerald-50
                      border
                      border-emerald-100
                      text-xs
                      font-bold
                      text-emerald-700
                    "
                  >
                    <Leaf className="w-4 h-4" />
                    Reduce Stress
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
             DECORATIVE CONTROLLER
             ================================================= */}

          <div
            className="
              hidden
              lg:flex
              relative
              w-[350px]
              h-[190px]
              items-center
              justify-center
            "
          >

            <div
              className="
                absolute
                w-52
                h-52
                rounded-full
                bg-purple-300/30
                blur-3xl
              "
            />

            <span
              className="
                absolute
                top-5
                right-14
                text-purple-400
                text-2xl
              "
            >
              ✦
            </span>

            <span
              className="
                absolute
                top-16
                right-2
                text-purple-300
                text-xl
              "
            >
              ✦
            </span>

            <span
              className="
                absolute
                bottom-8
                left-8
                text-pink-300
                text-2xl
              "
            >
              +
            </span>

            {/* Controller */}

            <div
              className="
                relative
                w-52
                h-32
                rounded-[45%]
                bg-gradient-to-br
                from-violet-300
                via-purple-500
                to-purple-700
                shadow-[0_25px_45px_rgba(124,58,237,0.30)]
                rotate-[-2deg]
              "
            >

              {/* D-Pad */}

              <div
                className="
                  absolute
                  left-9
                  top-10
                  w-10
                  h-10
                "
              >
                <div
                  className="
                    absolute
                    left-3
                    top-0
                    w-4
                    h-10
                    bg-purple-800
                    rounded
                  "
                />

                <div
                  className="
                    absolute
                    left-0
                    top-3
                    w-10
                    h-4
                    bg-purple-800
                    rounded
                  "
                />
              </div>

              {/* Buttons */}

              <div
                className="
                  absolute
                  right-8
                  top-8
                "
              >
                <div
                  className="
                    w-5
                    h-5
                    rounded-full
                    bg-purple-900
                  "
                />

                <div
                  className="
                    absolute
                    left-7
                    top-5
                    w-5
                    h-5
                    rounded-full
                    bg-purple-900
                  "
                />

                <div
                  className="
                    absolute
                    left-3
                    top-7
                    w-5
                    h-5
                    rounded-full
                    bg-purple-900
                  "
                />
              </div>

              {/* Center buttons */}

              <div
                className="
                  absolute
                  left-1/2
                  bottom-7
                  -translate-x-1/2
                  flex
                  gap-2
                "
              >
                <div
                  className="
                    w-7
                    h-2
                    rounded-full
                    bg-purple-200/70
                  "
                />

                <div
                  className="
                    w-7
                    h-2
                    rounded-full
                    bg-purple-200/70
                  "
                />
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
         GAME CARDS
         ===================================================== */}

      <section
        className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-6
        "
      >

        {games.map((game) => {

          const Icon = game.icon;

          return (
            <article
              key={game.id}
              className={`
                group
                relative
                overflow-hidden
                min-h-[325px]
                p-7
                rounded-[30px]
                border
                ${game.border}
                bg-gradient-to-br
                ${game.card}
                shadow-[0_8px_25px_rgba(15,23,42,0.04)]
                hover:shadow-[0_20px_45px_rgba(15,23,42,0.10)]
                hover:-translate-y-1
                transition-all
                duration-300
              `}
            >

              {/* Decorative glow */}

              <div
                className={`
                  absolute
                  -right-16
                  -bottom-16
                  w-52
                  h-52
                  rounded-full
                  ${game.decoration}
                  opacity-40
                  blur-3xl
                  pointer-events-none
                `}
              />

              {/* Decorative emoji */}

              <div
                className="
                  absolute
                  right-8
                  bottom-8
                  text-7xl
                  opacity-[0.06]
                  select-none
                  pointer-events-none
                "
              >
                {game.emoji}
              </div>


              {/* TOP AREA */}

              <div
                className="
                  relative
                  flex
                  items-start
                  justify-between
                  gap-4
                "
              >

                {/* Icon + title */}

                <div
                  className="
                    flex
                    items-center
                    gap-5
                  "
                >

                  <div
                    className={`
                      w-24
                      h-24
                      shrink-0
                      rounded-[26px]
                      bg-gradient-to-br
                      ${game.iconBg}
                      flex
                      items-center
                      justify-center
                      shadow-lg
                      group-hover:scale-105
                      group-hover:rotate-2
                      transition-all
                      duration-300
                    `}
                  >
                    <Icon
                      className="
                        w-11
                        h-11
                        text-white
                      "
                    />
                  </div>

                  <div>

                    <h2
                      className="
                        text-2xl
                        sm:text-3xl
                        font-extrabold
                        text-slate-950
                        tracking-tight
                      "
                    >
                      {game.title}{' '}
                      <span className="text-2xl">
                        {game.emoji}
                      </span>
                    </h2>

                    <p
                      className="
                        mt-2
                        text-xs
                        font-semibold
                        text-slate-400
                      "
                    >
                      Mello Wellness Game
                    </p>

                  </div>

                </div>


                {/* XP */}

                <div
                  className={`
                    shrink-0
                    px-3.5
                    py-2
                    rounded-full
                    bg-white/90
                    border
                    ${game.border}
                    ${game.accent}
                    text-xs
                    font-extrabold
                    flex
                    items-center
                    gap-1.5
                    shadow-sm
                  `}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  +{game.xp} XP
                </div>

              </div>


              {/* DESCRIPTION */}

              <div
                className="
                  relative
                  mt-6
                  lg:ml-[116px]
                "
              >

                <p
                  className="
                    text-sm
                    sm:text-base
                    leading-6
                    text-slate-600
                    font-medium
                    max-w-xl
                  "
                >
                  {game.description}
                </p>

              </div>


              {/* GAME META */}

              <div
                className="
                  relative
                  mt-6
                  lg:ml-[116px]
                  flex
                  flex-wrap
                  items-center
                  gap-4
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    font-semibold
                    text-slate-500
                  "
                >
                  <Clock
                    className={`
                      w-4
                      h-4
                      ${game.accent}
                    `}
                  />

                  {game.duration}
                </div>

                <span
                  className="
                    w-1
                    h-1
                    rounded-full
                    bg-slate-300
                  "
                />

                <span
                  className="
                    text-xs
                    font-semibold
                    text-slate-500
                  "
                >
                  {game.category}
                </span>

              </div>


              {/* START BUTTON */}

              <button
                type="button"
                onClick={() => setActiveGameId(game.id)}
                className={`
                  relative
                  mt-6
                  w-full
                  py-3.5
                  rounded-2xl
                  bg-white/95
                  border
                  ${game.border}
                  ${game.button}
                  font-extrabold
                  text-sm
                  flex
                  items-center
                  justify-center
                  gap-3
                  shadow-sm
                  hover:shadow-lg
                  transition-all
                  duration-200
                `}
              >

                <span
                  className={`
                    w-8
                    h-8
                    rounded-full
                    bg-white
                    border
                    ${game.border}
                    flex
                    items-center
                    justify-center
                  `}
                >
                  <Play
                    className="
                      w-4
                      h-4
                      fill-current
                    "
                  />
                </span>

                Start {game.title}

                <ArrowRight
                  className="
                    absolute
                    right-5
                    w-4
                    h-4
                    opacity-0
                    group-hover:opacity-100
                    group-hover:translate-x-1
                    transition-all
                  "
                />

              </button>

            </article>
          );
        })}

      </section>


      {/* =====================================================
         WELLNESS MESSAGE
         ===================================================== */}

      <div
        className="
          mt-7
          rounded-[24px]
          border
          border-purple-100
          bg-gradient-to-r
          from-purple-50
          via-white
          to-pink-50
          p-5
          flex
          items-center
          justify-center
          text-center
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
            text-sm
            font-semibold
            text-purple-800
          "
        >
          <Sparkles
            className="
              w-5
              h-5
              text-purple-500
            "
          />

          <span>
            A few minutes of mindful play can make
            a meaningful difference.
          </span>

          <span>🌱</span>
        </div>

      </div>


      {/* =====================================================
         DEMO CONTROLS
         ===================================================== */}

      <button
        type="button"
        className="
          fixed
          right-6
          bottom-6
          z-40
          px-5
          py-3.5
          rounded-full
          bg-gradient-to-r
          from-purple-600
          to-violet-500
          text-white
          font-extrabold
          text-sm
          flex
          items-center
          gap-3
          shadow-[0_12px_30px_rgba(124,58,237,0.35)]
          hover:scale-105
          transition-transform
        "
      >
        <SlidersHorizontal className="w-5 h-5" />

        Demo Controls

        <span className="text-lg">
          ‹
        </span>
      </button>

    </div>
  );
};

export default GamesPage;