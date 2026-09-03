import React from 'react';
import { motion } from 'framer-motion';

interface MelloAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  mood?: 'happy' | 'listening' | 'calm' | 'excited' | 'caring';
  animate?: boolean;
  className?: string;
}

export const MelloAvatar: React.FC<MelloAvatarProps> = ({ 
  size = 'md', 
  mood = 'happy',
  animate = true,
  className = '' 
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36'
  };

  return (
    <motion.div 
      className={`relative inline-block ${sizeMap[size]} ${className}`}
      animate={animate ? { y: [0, -4, 0] } : {}}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id="melloBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="melloBelly" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FAF5FF" />
            <stop offset="100%" stopColor="#EDE9FE" />
          </linearGradient>
          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Soft Aura/Glow */}
        <circle cx="60" cy="65" r="50" fill="#DDD6FE" opacity="0.4" />

        {/* Main Body - Squishy Rounded Pill */}
        <path 
          d="M 30,65 C 30,35 45,25 60,25 C 75,25 90,35 90,65 C 90,92 78,102 60,102 C 42,102 30,92 30,65 Z" 
          fill="url(#melloBody)" 
        />

        {/* Soft Tummy Patch */}
        <ellipse cx="60" cy="74" rx="20" ry="18" fill="url(#melloBelly)" opacity="0.95" />

        {/* Cute Little Sprout on Top */}
        <path d="M 60,25 Q 60,15 54,10 Q 64,12 60,25 Z" fill="url(#leafGrad)" />
        <path d="M 60,25 Q 60,15 66,10 Q 56,12 60,25 Z" fill="url(#leafGrad)" opacity="0.8" />

        {/* Eyes based on mood */}
        {mood === 'happy' && (
          <g fill="#312E81">
            <circle cx="48" cy="52" r="4.5" />
            <circle cx="72" cy="52" r="4.5" />
            {/* Eye highlights */}
            <circle cx="50" cy="50" r="1.5" fill="#FFFFFF" />
            <circle cx="74" cy="50" r="1.5" fill="#FFFFFF" />
          </g>
        )}

        {mood === 'calm' && (
          <g stroke="#312E81" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 44,53 Q 48,57 52,53" />
            <path d="M 68,53 Q 72,57 76,53" />
          </g>
        )}

        {mood === 'listening' && (
          <g fill="#312E81">
            <circle cx="48" cy="52" r="4.5" />
            <circle cx="72" cy="52" r="4.5" />
            <circle cx="49.5" cy="50.5" r="1.5" fill="#FFFFFF" />
            <circle cx="73.5" cy="50.5" r="1.5" fill="#FFFFFF" />
          </g>
        )}

        {mood === 'caring' && (
          <g stroke="#312E81" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 44,51 Q 48,47 52,51" />
            <path d="M 68,51 Q 72,47 76,51" />
          </g>
        )}

        {/* Rosy Cheeks */}
        <circle cx="41" cy="58" r="4" fill="#F472B6" opacity="0.55" />
        <circle cx="79" cy="58" r="4" fill="#F472B6" opacity="0.55" />

        {/* Mouth */}
        {mood === 'caring' ? (
          <path d="M 54,61 Q 60,65 66,61" stroke="#312E81" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M 53,60 Q 60,66 67,60" stroke="#312E81" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}

        {/* Cute Little Arms */}
        <path d="M 28,66 Q 20,72 26,78" stroke="#8B5CF6" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M 92,66 Q 100,72 94,78" stroke="#8B5CF6" strokeWidth="6" strokeLinecap="round" fill="none" />
      </svg>
    </motion.div>
  );
};
