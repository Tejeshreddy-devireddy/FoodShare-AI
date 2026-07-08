'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function TiltCard({ children, className = '' }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  // Mouse positions relative to the card dimensions
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Smooth springs for rotation angles
  const rotateX = useSpring(useTransform(y, [0, 1], [10, -10]), { damping: 25, stiffness: 200 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-10, 10]), { damping: 25, stiffness: 200 });

  // Shine glow coordinate values
  const shineX = useSpring(useTransform(x, [0, 1], ['0%', '100%']), { damping: 25, stiffness: 200 });
  const shineY = useSpring(useTransform(y, [0, 1], ['0%', '100%']), { damping: 25, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || shouldReduceMotion) return;
    const rect = cardRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width;
    const relativeY = (e.clientY - rect.top) / rect.height;

    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`perspective-1000 select-none ${className}`}
    >
      <motion.div
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full h-full relative"
      >
        {children}

        {/* Dynamic Interactive Shimmer Glass Light Reflection */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[inherit] mix-blend-overlay z-30"
          style={{
            background: `radial-gradient(220px circle at ${shineX} ${shineY}, rgba(255, 255, 255, 0.15), transparent 75%)`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      </motion.div>
    </div>
  );
}
