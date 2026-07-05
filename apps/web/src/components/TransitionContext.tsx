'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

type TransitionStage = 'idle' | 'exiting' | 'entering';

interface TransitionContextProps {
  stage: TransitionStage;
  isPending: boolean;
  transitionTo: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextProps | undefined>(undefined);

export const useTransitionContext = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransitionContext must be used within a TransitionProvider');
  }
  return context;
};

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [stage, setStage] = useState<TransitionStage>('idle');
  const [isPending, setIsPending] = useState(false);

  // Reset state when path changes (page enters)
  useEffect(() => {
    setStage('entering');
    setIsPending(false);
    
    const t = setTimeout(() => {
      setStage('idle');
    }, 550); // duration of entry transition

    // Smooth scroll to top on page load
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    return () => clearTimeout(t);
  }, [pathname]);

  const transitionTo = (href: string) => {
    if (stage === 'exiting') return;
    
    setStage('exiting');
    setIsPending(true);

    // Wait for exit animation (450ms)
    setTimeout(() => {
      router.push(href);
    }, 450);
  };

  // Intercept all internal anchor clicks globally
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore external links, hash links, mailto, tel, target="_blank", modifier clicks
      if (
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        anchor.target === '_blank' ||
        e.metaKey ||
        e.ctrlKey
      ) {
        return;
      }

      e.preventDefault();
      transitionTo(href);
    };

    // Button click compression and ripple effect handler
    const handleButtonClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest('button, a, [role="button"]') as HTMLElement;
      if (!clickable) return;

      const isInteractive = 
        clickable.tagName === 'BUTTON' || 
        clickable.classList.contains('bg-emerald-500') ||
        clickable.classList.contains('bg-sky-500') ||
        clickable.classList.contains('bg-amber-500') ||
        clickable.classList.contains('border-white/10') ||
        clickable.classList.contains('hover:text-white') ||
        clickable.classList.contains('cursor-pointer');

      if (isInteractive) {
        // Apply compression class
        clickable.classList.add('button-click-compress');
        
        // Create ripple
        const originalPosition = window.getComputedStyle(clickable).position;
        if (originalPosition === 'static') {
          clickable.style.position = 'relative';
        }
        
        const circle = document.createElement('span');
        const diameter = Math.max(clickable.clientWidth, clickable.clientHeight);
        const radius = diameter / 2;
        const rect = clickable.getBoundingClientRect();
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - rect.left - radius}px`;
        circle.style.top = `${e.clientY - rect.top - radius}px`;
        circle.classList.add('ripple-element');
        
        // Clean up old ripples
        const oldRipples = clickable.getElementsByClassName('ripple-element');
        for (let r of Array.from(oldRipples)) {
          r.remove();
        }
        
        clickable.appendChild(circle);

        setTimeout(() => {
          clickable.classList.remove('button-click-compress');
        }, 250);
      }
    };

    document.addEventListener('click', handleAnchorClick);
    document.addEventListener('click', handleButtonClick);
    return () => {
      document.removeEventListener('click', handleAnchorClick);
      document.removeEventListener('click', handleButtonClick);
    };
  }, [stage, router]);

  return (
    <TransitionContext.Provider value={{ stage, isPending, transitionTo }}>
      {/* 1. Loading line animation at the top of the viewport */}
      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 0.8, opacity: 1 }}
            exit={{ scaleX: 1, opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeInOut' }}
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 z-[9999] origin-left loading-bar-gradient"
            style={{ willChange: 'transform, opacity' }}
          />
        )}
      </AnimatePresence>
      
      {children}
    </TransitionContext.Provider>
  );
}
