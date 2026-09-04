import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Sparkles,
  CheckSquare,
  Play,
  Clock,
  CheckCircle2,
  X,
  Sun,
  Wind,
  Heart,
  Brain,
  Moon,
  ShieldCheck,
  Zap,
  Target,
  Leaf,
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import { INITIAL_ACTIVITIES } from '../services/storageService';
import { ActivityCard } from '../types';

export const ActivitiesPage: React.FC = () => {
  const { earnXP, navigate } = useApp();

  const [selectedActivity, setSelectedActivity] =
    useState<ActivityCard | null>(null);

  const [inProgress, setInProgress] = useState(false);
  const [completed, setCompleted] = useState(false);

  const startCard = (act: ActivityCard) => {
    if (act.id === 'act-4') {
      navigate('games');
      return;
    }

    if (act.type === 'breathing') {
      navigate('games', { gameId: 'breathing-bloom' });
      return;
    }

    setSelectedActivity(act);
    setInProgress(true);
    setCompleted(false);
  };

  const finishCard = () => {
    if (!selectedActivity) return;

    setCompleted(true);
    earnXP(
      selectedActivity.xpReward,
      selectedActivity.title
    );
  };

  /*
   * Activity-specific visual configuration
   */
  const getActivityConfig = (title: string) => {
    const name = title.toLowerCase();

    if (name.includes('morning')) {
      return {
        icon: Sun,
        iconBg: 'bg-gradient-to-br from-amber-300 to-orange-500',
        iconColor: 'text-white',
        accent: 'text-orange-600',
        border: 'border-orange-200',
        background:
          'from-orange-50 via-amber-50 to-white',
        xpBg: 'border-orange-200 text-orange-700',
        button:
          'text-orange-600 border-orange-200 hover:bg-orange-50',
        benefitIcon: Zap,
        benefit: 'Builds Awareness',
      };
    }

    if (name.includes('breathing')) {
      return {
        icon: Wind,
        iconBg: 'bg-gradient-to-br from-violet-400 to-purple-600',
        iconColor: 'text-white',
        accent: 'text-purple-600',
        border: 'border-purple-200',
        background:
          'from-purple-50 via-violet-50 to-white',
        xpBg: 'border-purple-200 text-purple-700',
        button:
          'text-purple-600 border-purple-200 hover:bg-purple-50',
        benefitIcon: Heart,
        benefit: 'Reduces Stress',
      };
    }

    if (name.includes('mello') || name.includes('talk')) {
      return {
        icon: Heart,
        iconBg: 'bg-gradient-to-br from-pink-400 to-rose-500',
        iconColor: 'text-white',
        accent: 'text-rose-600',
        border: 'border-rose-200',
        background:
          'from-rose-50 via-pink-50 to-white',
        xpBg: 'border-rose-200 text-rose-700',
        button:
          'text-rose-600 border-rose-200 hover:bg-rose-50',
        benefitIcon: ShieldCheck,
        benefit: 'Emotional Support',
      };
    }

    if (name.includes('memory')) {
      return {
        icon: Brain,
        iconBg: 'bg-gradient-to-br from-emerald-300 to-green-600',
        iconColor: 'text-white',
        accent: 'text-green-600',
        border: 'border-green-200',
        background:
          'from-green-50 via-emerald-50 to-white',
        xpBg: 'border-green-200 text-green-700',
        button:
          'text-green-600 border-green-200 hover:bg-green-50',
        benefitIcon: Target,
        benefit: 'Improves Focus',
      };
    }

    return {
      icon: Moon,
      iconBg: 'bg-gradient-to-br from-blue-400 to-blue-600',
      iconColor: 'text-white',
      accent: 'text-blue-600',
      border: 'border-blue-200',
      background:
        'from-blue-50 via-indigo-50 to-white',
      xpBg: 'border-blue-200 text-blue-700',
      button:
        'text-blue-600 border-blue-200 hover:bg-blue-50',
      benefitIcon: Leaf,
      benefit: 'Better Sleep',
    };
  };

  return (
    <div className="min-h-screen pb-12 bg-[#f8fafc]">

      {/* =====================================================
          HERO HEADER
      ====================================================== */}

      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="
          relative
          overflow-hidden
          rounded-[30px]
          border border-purple-100
          bg-white
          shadow-[0_12px_40px_rgba(109,40,217,0.08)]
          mb-8
        "
      >

        {/* Decorative background glow */}
        <div className="
          absolute
          -right-20
          -top-20
          w-80
          h-80
          rounded-full
          bg-purple-100/60
          blur-3xl
        " />

        <div className="
          absolute
          right-20
          bottom-0
          w-72
          h-32
          bg-gradient-to-t
          from-purple-100
          to-transparent
          opacity-70
        " />

        <div className="
          relative
          flex
          items-center
          justify-between
          px-7
          sm:px-10
          py-7
          min-h-[175px]
        ">

          {/* Left content */}

          <div className="flex items-center gap-5 z-10">

            <div className="
              w-20
              h-20
              rounded-[24px]
              bg-gradient-to-br
              from-purple-100
              to-violet-50
              border border-purple-100
              shadow-[0_10px_25px_rgba(124,58,237,0.12)]
              flex
              items-center
              justify-center
              shrink-0
            ">
              <div className="
                w-12
                h-12
                rounded-xl
                bg-gradient-to-br
                from-purple-600
                to-violet-500
                text-white
                flex
                items-center
                justify-center
                shadow-lg
              ">
                <CheckSquare className="w-7 h-7" />
              </div>
            </div>

            <div>

              <div className="flex items-center gap-3">

                <h1 className="
                  text-4xl
                  sm:text-5xl
                  font-extrabold
                  tracking-tight
                  text-slate-950
                ">
                  Small Steps
                </h1>

                <div className="
                  flex
                  flex-col
                  items-start
                  text-purple-700
                  -space-y-1
                ">
                  <span className="text-lg">🐾</span>
                  <span className="text-lg ml-3">🐾</span>
                </div>

              </div>

              <p className="
                mt-2
                text-sm
                sm:text-base
                text-slate-500
                max-w-xl
              ">
                Bite-sized daily wellness actions designed to
                take <span className="font-bold text-purple-600">2–5 minutes.</span>
              </p>

              <div className="flex items-center gap-3 mt-4">

                <span className="
                  px-3
                  py-1.5
                  rounded-full
                  bg-purple-50
                  border border-purple-100
                  text-xs
                  font-bold
                  text-purple-700
                ">
                  ✨ Daily Wellness
                </span>

                <span className="
                  text-xs
                  text-slate-400
                  font-medium
                ">
                  Small actions → meaningful progress
                </span>

              </div>

            </div>
          </div>

          {/* Right illustration */}

          <div className="
            hidden
            lg:block
            relative
            w-[350px]
            h-[150px]
            overflow-hidden
          ">

            {/* Sun */}

            <div className="
              absolute
              right-14
              top-4
              w-14
              h-14
              rounded-full
              bg-gradient-to-br
              from-yellow-300
              to-orange-300
              shadow-[0_0_35px_rgba(251,191,36,0.45)]
            " />

            {/* Hills */}

            <div className="
              absolute
              right-[-50px]
              bottom-[-50px]
              w-[380px]
              h-[150px]
              rounded-[50%]
              bg-gradient-to-br
              from-violet-100
              to-purple-200
            " />

            <div className="
              absolute
              right-[-20px]
              bottom-[-35px]
              w-[330px]
              h-[120px]
              rounded-[50%]
              bg-gradient-to-br
              from-purple-100
              to-indigo-200
            " />

            {/* Stepping stones */}

            <div className="
              absolute
              right-28
              bottom-10
              w-20
              h-7
              rounded-full
              bg-white
              shadow-[0_6px_15px_rgba(99,102,241,0.2)]
              rotate-[-4deg]
            " />

            <div className="
              absolute
              right-40
              bottom-16
              w-16
              h-6
              rounded-full
              bg-white/90
              shadow-md
              rotate-[5deg]
            " />

            <div className="
              absolute
              right-52
              bottom-24
              w-12
              h-5
              rounded-full
              bg-white/90
              shadow-md
              rotate-[-5deg]
            " />

            <div className="
              absolute
              right-60
              bottom-31
              w-10
              h-4
              rounded-full
              bg-white/80
              shadow-md
            " />

          </div>

        </div>
      </motion.div>


      {/* =====================================================
          ACTIVITY GRID
      ====================================================== */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
      ">

        {INITIAL_ACTIVITIES.map((act, index) => {

          const config = getActivityConfig(act.title);

          const Icon = config.icon;
          const BenefitIcon = config.benefitIcon;

          return (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
              }}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 },
              }}
              className={`
                group
                relative
                overflow-hidden
                rounded-[28px]
                border
                ${config.border}
                bg-gradient-to-br
                ${config.background}
                p-7
                min-h-[310px]
                flex
                flex-col
                justify-between
                shadow-[0_8px_25px_rgba(15,23,42,0.04)]
                hover:shadow-[0_18px_40px_rgba(15,23,42,0.09)]
                transition-all
              `}
            >

              {/* Decorative glow */}

              <div className="
                absolute
                -right-16
                -bottom-16
                w-40
                h-40
                rounded-full
                bg-white/70
                blur-2xl
                pointer-events-none
              " />

              {/* Top section */}

              <div className="relative">

                <div className="
                  flex
                  items-start
                  justify-between
                  gap-3
                ">

                  {/* Activity icon */}

                  <div className={`
                    w-20
                    h-20
                    rounded-[22px]
                    ${config.iconBg}
                    ${config.iconColor}
                    flex
                    items-center
                    justify-center
                    shadow-[0_10px_22px_rgba(99,102,241,0.18)]
                    group-hover:scale-105
                    transition-transform
                  `}>
                    <Icon className="w-10 h-10" />
                  </div>

                  {/* XP */}

                  <div className={`
                    px-3
                    py-1.5
                    rounded-full
                    bg-white/80
                    border
                    ${config.xpBg}
                    backdrop-blur-sm
                    flex
                    items-center
                    gap-1.5
                    text-xs
                    font-bold
                    whitespace-nowrap
                  `}>
                    <Sparkles className="w-3.5 h-3.5" />
                    +{act.xpReward} XP
                  </div>

                </div>


                {/* Title */}

                <h2 className="
                  mt-5
                  text-xl
                  font-extrabold
                  tracking-tight
                  text-slate-900
                ">
                  {act.title}
                </h2>


                {/* Description */}

                <p className="
                  mt-2
                  text-sm
                  leading-6
                  text-slate-600
                  max-w-[360px]
                ">
                  {act.description}
                </p>

              </div>


              {/* Bottom */}

              <div className="relative mt-6">

                {/* Meta information */}

                <div className="
                  flex
                  items-center
                  gap-3
                  mb-5
                ">

                  {/* Duration */}

                  <div className="
                    flex
                    items-center
                    gap-2
                    px-3
                    py-1.5
                    rounded-full
                    bg-white/65
                    text-xs
                    font-semibold
                    text-slate-700
                  ">
                    <Clock className={`
                      w-4
                      h-4
                      ${config.accent}
                    `} />

                    <span>
                      {act.duration}
                    </span>
                  </div>

                  <div className="
                    w-px
                    h-5
                    bg-slate-200
                  " />

                  {/* Benefit */}

                  <div className="
                    flex
                    items-center
                    gap-1.5
                    text-xs
                    font-medium
                    text-slate-600
                  ">
                    <BenefitIcon className={`
                      w-4
                      h-4
                      ${config.accent}
                    `} />

                    <span>
                      {config.benefit}
                    </span>
                  </div>

                </div>


                {/* Start button */}

                <button
                  onClick={() => startCard(act)}
                  className={`
                    w-full
                    py-3.5
                    px-5
                    rounded-2xl
                    bg-white/90
                    border
                    ${config.border}
                    ${config.button}
                    font-bold
                    text-sm
                    flex
                    items-center
                    justify-center
                    gap-2
                    shadow-[0_5px_15px_rgba(15,23,42,0.05)]
                    hover:shadow-[0_8px_20px_rgba(15,23,42,0.09)]
                    hover:-translate-y-0.5
                    transition-all
                  `}
                >
                  <Play
                    className="w-4 h-4 fill-current"
                  />

                  Start {act.title}
                </button>

              </div>

            </motion.div>
          );
        })}

      </div>


      {/* =====================================================
          DEMO CONTROLS
      ====================================================== */}

      <motion.button
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.04 }}
        className="
          fixed
          bottom-6
          right-6
          z-40
          px-6
          py-3.5
          rounded-full
          bg-gradient-to-r
          from-purple-600
          to-violet-500
          text-white
          font-bold
          text-sm
          shadow-[0_12px_30px_rgba(124,58,237,0.35)]
          flex
          items-center
          gap-3
        "
      >
        <Sparkles className="w-5 h-5" />

        Demo Controls

        <span className="text-lg">
          ›
        </span>
      </motion.button>


      {/* =====================================================
          ACTIVITY MODAL
      ====================================================== */}

      <AnimatePresence>

        {selectedActivity && inProgress && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              p-4
              bg-slate-950/60
              backdrop-blur-md
            "
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              className="
                relative
                w-full
                max-w-md
                rounded-[30px]
                bg-white
                p-7
                shadow-2xl
                border
                border-purple-100
              "
            >

              {/* Close */}

              <button
                onClick={() => {
                  setSelectedActivity(null);
                  setInProgress(false);
                }}
                className="
                  absolute
                  top-4
                  right-4
                  w-9
                  h-9
                  rounded-full
                  bg-slate-100
                  hover:bg-slate-200
                  flex
                  items-center
                  justify-center
                  text-slate-500
                  transition
                "
              >
                <X className="w-5 h-5" />
              </button>


              {!completed ? (

                <div className="text-center space-y-6 py-4">

                  <div className="
                    w-20
                    h-20
                    mx-auto
                    rounded-full
                    bg-purple-100
                    text-purple-600
                    flex
                    items-center
                    justify-center
                  ">
                    <Sparkles className="w-9 h-9 animate-pulse" />
                  </div>

                  <div>

                    <h3 className="
                      text-2xl
                      font-extrabold
                      text-slate-900
                    ">
                      {selectedActivity.title}
                    </h3>

                    <p className="
                      mt-2
                      text-sm
                      text-slate-500
                      leading-6
                    ">
                      {selectedActivity.description}
                    </p>

                  </div>

                  <div className="
                    rounded-2xl
                    bg-gradient-to-br
                    from-purple-50
                    to-violet-50
                    border
                    border-purple-100
                    p-5
                    text-sm
                    text-purple-900
                    leading-6
                  ">
                    Take a slow breath. Relax your jaw,
                    shoulders, and hands. Allow yourself
                    to be present for these{' '}
                    <strong>
                      {selectedActivity.duration}
                    </strong>.
                  </div>

                  <button
                    onClick={finishCard}
                    className="
                      w-full
                      py-3.5
                      rounded-2xl
                      bg-gradient-to-r
                      from-purple-600
                      to-violet-500
                      hover:from-purple-700
                      hover:to-violet-600
                      text-white
                      font-bold
                      shadow-lg
                      shadow-purple-200
                      transition
                    "
                  >
                    Complete Activity
                    {' '}
                    (+{selectedActivity.xpReward} XP)
                  </button>

                </div>

              ) : (

                <div className="
                  text-center
                  space-y-5
                  py-8
                ">

                  <div className="
                    w-20
                    h-20
                    mx-auto
                    rounded-full
                    bg-emerald-50
                    flex
                    items-center
                    justify-center
                  ">
                    <CheckCircle2
                      className="
                        w-12
                        h-12
                        text-emerald-500
                      "
                    />
                  </div>

                  <h3 className="
                    text-2xl
                    font-extrabold
                    text-slate-900
                  ">
                    Step Completed! 🌱
                  </h3>

                  <p className="
                    text-sm
                    text-slate-500
                  ">
                    You earned{' '}
                    <strong className="text-purple-600">
                      +{selectedActivity.xpReward} XP
                    </strong>{' '}
                    for completing{' '}
                    {selectedActivity.title}.
                  </p>

                  <button
                    onClick={() => {
                      setSelectedActivity(null);
                      setInProgress(false);
                    }}
                    className="
                      w-full
                      py-3.5
                      rounded-2xl
                      bg-purple-600
                      hover:bg-purple-700
                      text-white
                      font-bold
                      transition
                    "
                  >
                    Back to Activities
                  </button>

                </div>

              )}

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
};