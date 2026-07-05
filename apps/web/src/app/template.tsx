'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTransitionContext } from '@/components/TransitionContext';

export default function Template({ children }: { children: React.ReactNode }) {
  const { stage } = useTransitionContext();
  const shouldReduceMotion = useReducedMotion();

  const isExiting = stage === 'exiting';

  // Configured with visual specifications:
  // Exit: Fade Out, scale down to 0.98, blur to 12px, opacity 0, duration 0.45s, easeInOut
  // Entry: Fade In, scale from 0.98 to 1.0, blur from 12px to 0px, opacity 1, duration 0.55s, easeInOut
  const initial = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.98, filter: 'blur(12px)' };

  const animate = isExiting
    ? (shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, filter: 'blur(12px)' })
    : { opacity: 1, scale: 1, filter: 'blur(0px)' };

  const transition = {
    duration: isExiting ? 0.45 : 0.55,
    ease: 'easeInOut' as const,
  };

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      style={{ willChange: 'opacity, transform, filter' }}
      className="flex-grow flex flex-col w-full"
    >
      {children}
    </motion.div>
  );
}
