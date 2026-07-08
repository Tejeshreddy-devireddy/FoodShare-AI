'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

export default function CursorFollower() {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredType, setHoveredType] = useState<string | null>(null);

  // Mouse coordinates using MotionValues
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring settings for organic Apple/Stripe trailing physics
  const springConfig = { damping: 30, stiffness: 220, mass: 0.6 };
  const followerX = useSpring(mouseX, springConfig);
  const followerY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Detect interactive hovers
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive = 
        target.closest('button') || 
        target.closest('a') || 
        target.closest('.premium-card') || 
        target.style.cursor === 'pointer';

      if (target.closest('button') || target.closest('a')) {
        setHoveredType('button');
      } else if (target.closest('.premium-card')) {
        setHoveredType('card');
      } else if (isInteractive) {
        setHoveredType('pointer');
      } else {
        setHoveredType(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver);

    // Disable follower on touch-capable screens
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!mounted || shouldReduceMotion) return null;

  // Follower styles based on hovered element type
  let size = 32;
  let bg = 'rgba(16, 185, 129, 0.15)'; // Default emerald glow
  let border = '1px solid rgba(16, 185, 129, 0.35)';
  let blur = '0px';

  if (hoveredType === 'button') {
    size = 56;
    bg = 'rgba(14, 165, 233, 0.12)'; // Blue sky glow for buttons
    border = '1px solid rgba(14, 165, 233, 0.45)';
    blur = '2px';
  } else if (hoveredType === 'card') {
    size = 80;
    bg = 'rgba(165, 180, 252, 0.08)'; // Violet glow for cards
    border = '1px solid rgba(165, 180, 252, 0.25)';
    blur = '4px';
  } else if (hoveredType === 'pointer') {
    size = 48;
    bg = 'rgba(16, 185, 129, 0.2)';
    border = '1px solid rgba(16, 185, 129, 0.5)';
  }

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-50 mix-blend-darken"
      style={{
        x: followerX,
        y: followerY,
        width: size,
        height: size,
        backgroundColor: bg,
        border: border,
        filter: blur !== '0px' ? `blur(${blur})` : 'none',
        display: isVisible ? 'block' : 'none',
        transition: 'width 0.25s ease-out, height 0.25s ease-out, background-color 0.25s, border-color 0.25s, filter 0.25s',
      }}
    />
  );
}
