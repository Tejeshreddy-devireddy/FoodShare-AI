'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function LivingBackground() {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0" style={{ backgroundColor: '#fffcf9' }}>
      {/* Dynamic Evolving Mesh Gradients */}
      <div className="absolute inset-0 opacity-[0.35] blur-[130px] mix-blend-multiply">
        {/* Blob 1 - Green Emerald */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  x: ['-20%', '30%', '-10%', '-20%'],
                  y: ['-10%', '20%', '40%', '-10%'],
                  scale: [1, 1.2, 0.9, 1],
                }
          }
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-[500px] h-[500px] rounded-full bg-emerald-300/60 top-[-10%] left-[-10%]"
        />

        {/* Blob 2 - Teal/Sky */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  x: ['30%', '-20%', '10%', '30%'],
                  y: ['10%', '-30%', '20%', '10%'],
                  scale: [1.1, 0.8, 1.2, 1.1],
                }
          }
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-[600px] h-[600px] rounded-full bg-sky-300/40 bottom-[-10%] right-[-10%]"
        />

        {/* Blob 3 - Amber Warm */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  x: ['-10%', '20%', '-30%', '-10%'],
                  y: ['40%', '-10%', '10%', '40%'],
                  scale: [0.9, 1.15, 0.85, 0.9],
                }
          }
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-[450px] h-[450px] rounded-full bg-amber-200/50 top-[30%] left-[20%]"
        />

        {/* Blob 4 - Violet/Pink */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  x: ['10%', '-10%', '30%', '10%'],
                  y: ['-20%', '20%', '-10%', '-20%'],
                  scale: [1, 0.9, 1.1, 1],
                }
          }
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-[550px] h-[550px] rounded-full bg-violet-200/40 top-[-20%] right-[30%]"
        />
      </div>

      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Grid pattern mapping for additional structure */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(rgba(15, 23, 42, 0.15) 1px, transparent 1px)', 
             backgroundSize: '24px 24px' 
           }} 
      />
    </div>
  );
}
