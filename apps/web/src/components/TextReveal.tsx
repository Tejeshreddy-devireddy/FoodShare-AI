'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}

export default function TextReveal({
  text,
  className = '',
  delay = 0,
  stagger = 0.04,
  once = true,
}: TextRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(' ');

  // Outer container stagger parameters
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  // Word-level animations
  const wordVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 18,
      filter: shouldReduceMotion ? 'none' : 'blur(8px)',
      rotate: shouldReduceMotion ? 0 : 2,
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      rotate: 0,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // premium custom bezier ease
      },
    },
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-60px' }}
      className={`inline-flex flex-wrap ${className}`}
    >
      {words.map((word, idx) => (
        <span key={idx} className="inline-block overflow-hidden mr-[0.25em] pb-[0.1em]">
          <motion.span
            variants={wordVariants}
            className="inline-block origin-left"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
