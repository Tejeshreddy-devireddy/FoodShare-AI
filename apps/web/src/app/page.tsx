'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useInView, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import {
  Leaf, Users, Heart, Sparkles, Globe, ChevronDown, Utensils, Truck, ShieldCheck, Mail, ArrowRight, Star, BarChart3, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- Animated Counter Component (Redesigned) ---
function Counter({
  value,
  duration = 2,
  suffix = '',
  unit = '',
}: {
  value: number;
  duration?: number;
  suffix?: string;
  unit?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!isInView) return;
    const totalDuration = duration * 1000;
    const startTime = performance.now();
    // Cubic ease-out: smooth deceleration, no jitter
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);
      setCount(Math.floor(easeOutCubic(progress) * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setCount(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, value, duration]);

  // Split suffix: plain symbols (+ %) stay inline; unit words (kg, t) render smaller
  const isWordUnit = unit.trim().length > 0;

  return (
    <span ref={ref} className="inline-flex items-baseline gap-[2px]">
      <span>{count.toLocaleString()}</span>
      {suffix && !isWordUnit && <span className="text-[0.55em] font-bold opacity-70 ml-[1px]">{suffix}</span>}
      {isWordUnit && (
        <span className="text-[0.45em] font-semibold tracking-wider opacity-60 ml-1 uppercase">{unit}</span>
      )}
    </span>
  );
}

// --- Premium Statistics Card Component ---
// Each card: glassmorphism style, staggered entrance, hover lift + scale + glow, icon float + rotate
function StatCard({
  icon,
  value,
  suffix = '',
  title,
  description,
  accentColor,
  iconBgClass,
  hoverShadow,
  index,
}: {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  title: string;
  description: string;
  accentColor: string;
  iconBgClass: string;
  hoverShadow: string;
  index: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      // Entrance: fade + slide-up + scale — triggers once on viewport entry
      initial={prefersReducedMotion ? false : { opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      // Hover: lift + scale + deep shadow + border glow
      whileHover={
        prefersReducedMotion
          ? undefined
          : {
              y: -10,
              scale: 1.04,
              boxShadow: hoverShadow,
              transition: {
                duration: 0.35,
                ease: [0.33, 1, 0.68, 1] as [number, number, number, number],
              },
            }
      }
      className="relative group rounded-[20px] overflow-hidden flex flex-col items-center text-center px-6 pt-8 pb-7 cursor-default"
      style={{ willChange: 'transform, opacity', backgroundColor: 'rgba(255,255,255,0.85)', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 8px 32px rgba(15,23,42,0.07)' }}
    >
      {/* Radial accent glow bleeding from top — always visible, subtle */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 55% at 50% -10%, ${accentColor}18, transparent 70%)`,
        }}
      />
      {/* Top shimmer line — appears on hover */}
      <div className="absolute inset-x-0 top-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}80, transparent)` }} />
      {/* Hover fill gradient — subtle background shift */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `linear-gradient(145deg, ${accentColor}0e 0%, transparent 55%)` }}
      />
      {/* Inset border glow — accent-colored ring on hover */}
      <div
        className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1px ${accentColor}48` }}
      />

      {/* Floating Icon with float animation + rotate/scale on hover */}
      <motion.div
        animate={prefersReducedMotion ? undefined : { y: [0, -4, 0] }}
        transition={{
          duration: 3.2 + index * 0.4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.6,
        }}
        className="relative z-10 mb-5"
        style={{ willChange: 'transform' }}
      >
        <motion.div
          whileHover={
            prefersReducedMotion
              ? undefined
              : {
                  rotate: 15,
                  scale: 1.14,
                  transition: { type: 'spring', stiffness: 420, damping: 10 },
                }
          }
          className={`p-3.5 rounded-2xl border ${iconBgClass} group-hover:[filter:drop-shadow(0_0_10px_rgba(52,211,153,0.55))] transition-[filter] duration-300`}
          style={{ color: accentColor }}
        >
          {icon}
        </motion.div>
      </motion.div>

      {/* Animated Counter */}
      <div
        className="relative z-10 text-[46px] sm:text-[52px] font-black font-mono tracking-tight leading-none mb-3 group-hover:scale-[1.05] transition-transform duration-300 origin-center"
        style={{ willChange: 'transform', color: '#0f172a' }}
      >
        <Counter value={value} suffix={suffix} duration={1.7} />
      </div>

      {/* Card Title */}
      <h3 className="relative z-10 text-sm font-bold mb-2 tracking-wide transition-colors duration-300" style={{ color: '#0f172a' }}>
        {title}
      </h3>

      {/* Short Description */}
      <p className="relative z-10 text-[11px] leading-relaxed font-medium transition-colors duration-300 max-w-[185px]" style={{ color: '#64748b' }}>
        {description}
      </p>
    </motion.div>
  );
}

// --- Framer Motion Variants for Staggered Hero Content ---
const heroContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
    }
  }
};



// --- Premium Scroll Indicator Component ---
function ScrollIndicator({ hasScrolled }: { hasScrolled: boolean }) {
  return (
    <motion.div
      className="absolute bottom-[50px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-30 pointer-events-auto cursor-pointer group"
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: hasScrolled ? 0 : 1,
        y: hasScrolled ? 16 : 0,
        scale: hasScrolled ? 0.88 : 1,
        pointerEvents: hasScrolled ? 'none' : 'auto',
      }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: hasScrolled ? 0 : 1.8 }}
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Background radial green glow */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80px 60px at 50% 60%, rgba(16,185,129,0.10), transparent 70%)',
          filter: 'blur(8px)',
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Mouse Icon with float animation */}
      <motion.div
        className="relative"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ willChange: 'transform' }}
      >
        {/* Outer glow (breathing) */}
        <motion.div
          className="absolute inset-[-6px] rounded-[18px] pointer-events-none"
          animate={{
            boxShadow: [
              '0 0 0px 0px rgba(16,185,129,0)',
              '0 0 18px 4px rgba(16,185,129,0.22)',
              '0 0 0px 0px rgba(16,185,129,0)',
            ],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ willChange: 'box-shadow' }}
        />

        {/* Mouse body */}
        <motion.div
          className="
            relative w-[26px] sm:w-[28px] h-[40px] sm:h-[44px]
            rounded-[13px] sm:rounded-[14px]
            border border-white/30
            bg-white/[0.04]
            backdrop-blur-md
            flex items-start justify-center pt-[7px]
            overflow-hidden
            shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_4px_20px_rgba(0,0,0,0.4)]
          "
          style={{
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 4px_20px rgba(0,0,0,0.4)',
          }}
          whileHover={{
            scale: 1.12,
            borderColor: 'rgba(52,211,153,0.55)',
            backgroundColor: 'rgba(255,255,255,0.07)',
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Scroll Wheel */}
          <motion.div
            className="w-[3px] h-[7px] rounded-full bg-emerald-400"
            style={{
              boxShadow: '0 0 6px 1px rgba(52,211,153,0.7)',
              willChange: 'transform, opacity',
            }}
            animate={{
              y: [0, 10, 10],
              opacity: [1, 0.2, 0],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.65, 1],
            }}
          />
        </motion.div>
      </motion.div>

      {/* Scroll Down Label */}
      <motion.span
        className="text-[9px] sm:text-[10px] uppercase tracking-[3px] text-zinc-500 font-semibold select-none"
        style={{ letterSpacing: '3px' }}
        whileHover={{ color: 'rgba(255,255,255,0.9)' }}
        transition={{ duration: 0.25 }}
      >
        Scroll Down
      </motion.span>
    </motion.div>
  );
}

export default function LandingPage() {
  // --- States ---
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredPortal, setHoveredPortal] = useState<string | null>(null);
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [hasScrolled, setHasScrolled] = useState(false);

  const router = useRouter();
  const navigate = (path: string) => router.push(path);

  const handleDemoLogin = (role: 'Donor' | 'NGO' | 'Volunteer' | 'Admin', path: string) => {
    localStorage.setItem('gs_token', 'demo-token-12345');
    localStorage.setItem('gs_user', JSON.stringify({
      name: `Demo ${role}`,
      email: `demo-${role.toLowerCase()}@greenshare.org`,
      role: role
    }));
    document.cookie = `gs_role=${role}; path=/`;
    router.push(path);
  };

  // Mouse Parallax & Radial Glow state for CTA Card
  const ctaCardRef = useRef<HTMLDivElement>(null);
  const [ctaRotateX, setCtaRotateX] = useState(0);
  const [ctaRotateY, setCtaRotateY] = useState(0);
  const [ctaMousePos, setCtaMousePos] = useState({ x: 0, y: 0 });
  const [ctaIsHovered, setCtaIsHovered] = useState(false);

  const handleCtaMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ctaCardRef.current) return;
    const rect = ctaCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCtaMousePos({ x, y });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = -(y - centerY) / (centerY / 12); // Subtle tilt
    const rotY = (x - centerX) / (centerX / 12);
    
    setCtaRotateX(rotX);
    setCtaRotateY(rotY);
  };

  const handleCtaMouseLeave = () => {
    setCtaRotateX(0);
    setCtaRotateY(0);
    setCtaIsHovered(false);
  };

  // Mouse Parallax state for Hero Image
  const [heroParallax, setHeroParallax] = useState({ x: 0, y: 0 });

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 60; // Parallax motion
    const y = (e.clientY - rect.top - rect.height / 2) / 60;
    setHeroParallax({ x, y });
  };

  const handleHeroMouseLeave = () => {
    setHeroParallax({ x: 0, y: 0 });
  };

  // --- Scroll State for Navbar ---
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  // --- Scroll Indicator visibility ---
  useEffect(() => {
    const handleScrollIndicator = () => {
      setHasScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScrollIndicator, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollIndicator);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 15);
      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  // Active section tracking for navbar slide animation
  const [activeSection, setActiveSection] = useState('home');
  useEffect(() => {
    const handleScrollActive = () => {
      const scrollPos = window.scrollY + 180;
      const sections = ['about', 'features', 'contact'];
      let current = 'home';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && scrollPos >= el.offsetTop) {
          current = section;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScrollActive);
    return () => window.removeEventListener('scroll', handleScrollActive);
  }, []);

  // --- Global Mouse Glow State ---
  const [globalMouse, setGlobalMouse] = useState({ x: -200, y: -200 });
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      setGlobalMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  // --- How It Works Steps ---
  const steps = [
    {
      title: "1. Listing & AI Verification",
      desc: "Businesses upload photos of surplus food. The AI instantly verifies quality, category, shelf-life, and freshness.",
      icon: <Sparkles className="w-6 h-6" />,
    },
    {
      title: "2. Intelligent Matchmaking",
      desc: "Our matching algorithm matches listings with nearby verified NGOs based on urgency, capacity, and dietary focus.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "3. Volunteer Pickup & Route Optimization",
      desc: "Volunteers accept the task and receive AI-optimized routes to transport the food safely before it spoils.",
      icon: <Truck className="w-6 h-6" />,
    },
    {
      title: "4. NGO Distribution & Impact Logging",
      desc: "NGOs receive the food via secure QR code. The system logs meals served, water saved, and CO₂ prevented on the live dashboard.",
      icon: <Heart className="w-6 h-6" />,
    }
  ];

  // Auto-advance How It Works steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setEmailSubscribed(true);
      setEmailInput('');
      setTimeout(() => setEmailSubscribed(false), 5000);
    }
  };

  return (
    <div className="min-h-screen text-[#0f172a] relative overflow-hidden font-sans selection:bg-emerald-200 selection:text-emerald-800 antialiased" style={{ backgroundColor: '#FFF5EE' }}>
      
      {/* Interactive Cursor Glow Orb */}
      <div 
        className="fixed inset-0 pointer-events-none z-30 opacity-60 transition-opacity duration-300 hidden md:block"
        style={{
          background: `radial-gradient(500px circle at ${globalMouse.x}px ${globalMouse.y}px, rgba(16, 185, 129, 0.06), transparent 80%)`
        }}
      />

      {/* Volumetric background lights — warm pastel tints */}
      <div className="absolute top-[-15%] left-[10%] w-[800px] h-[800px] rounded-full blur-[160px] pointer-events-none z-0" style={{ backgroundColor: 'rgba(16,185,129,0.07)' }} />
      <div className="absolute top-[25%] right-[-10%] w-[700px] h-[700px] rounded-full blur-[140px] pointer-events-none z-0" style={{ backgroundColor: 'rgba(251,191,36,0.06)' }} />
      <div className="absolute bottom-[20%] left-[-15%] w-[900px] h-[900px] rounded-full blur-[180px] pointer-events-none z-0" style={{ backgroundColor: 'rgba(249,115,22,0.04)' }} />

      {/* --- 1. Floating Navigation Bar --- */}
      <div className="fixed top-5 left-0 right-0 z-50 px-4 sm:px-6 w-full flex justify-center pointer-events-none">
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: visible ? 0 : -120, opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl pointer-events-auto backdrop-blur-2xl rounded-2xl px-6 h-14 flex items-center justify-between"
          style={{
            backgroundColor: 'rgba(255, 252, 249, 0.82)',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            boxShadow: '0 4px 24px rgba(180, 140, 100, 0.10), 0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <Link href="/" className="flex items-center gap-2.5 font-bold text-base tracking-tight group" style={{ color: '#0f172a' }}>
            <motion.div 
              whileHover={{ scale: 1.08, rotate: 6 }}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
              className="relative"
            >
              <img src="/logo.png" className="w-8 h-8 rounded-lg object-cover" style={{ border: '1px solid rgba(15,23,42,0.10)' }} alt="FoodShare AI Logo" />
            </motion.div>
            <span className="font-extrabold tracking-tight transition-colors duration-300 group-hover:text-emerald-600">
              FoodShare<span className="font-black bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #10b981, #0ea5e9)' }}>AI</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest relative">
            {['home', 'about', 'features', 'contact'].map((item) => {
              const isActive = activeSection === item;
              const href = item === 'home' ? '#' : `#${item}`;
              return (
                <a
                  key={item}
                  href={href}
                  className="relative py-1.5 transition-colors duration-300 select-none"
                  style={{ color: isActive ? '#0f172a' : '#64748b' }}
                  onMouseEnter={e => { if (!isActive) (e.target as HTMLElement).style.color = '#0f172a'; }}
                  onMouseLeave={e => { if (!isActive) (e.target as HTMLElement).style.color = '#64748b'; }}
                >
                  {item}
                  {isActive && (
                    <motion.div
                      layoutId="navActiveUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                      style={{ background: 'linear-gradient(90deg, #10b981, #0ea5e9)' }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-5 sm:gap-6">
            <div className="hidden lg:block h-4 w-[1px] mr-1" style={{ backgroundColor: 'rgba(15,23,42,0.12)' }} />
            <a
              href="#portals"
              className="text-xs font-bold transition-colors duration-300"
              style={{ color: '#64748b' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = '#0f172a')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = '#64748b')}
            >
              Login
            </a>
            <a href="#portals">
              <motion.button
                whileHover={{ y: -1.5 }}
                whileTap={{ scale: 0.98 }}
                className="font-extrabold rounded-xl px-4 py-1.5 h-8 text-xs cursor-pointer transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#fff',
                  boxShadow: '0 4px 16px rgba(16,185,129,0.30)',
                }}
              >
                Get Started
              </motion.button>
            </a>
          </div>
        </motion.header>
      </div>

      {/* --- 2. Hero Section — Donate 3D Character --- */}
      <section
        id="hero"
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative w-full h-screen flex items-center overflow-hidden z-10"
        style={{ backgroundColor: '#FFF5EE' }}
      >
        {/* ── Full-bleed 3D background image: anchored bottom-right ── */}
        <motion.div
          className="absolute inset-0 select-none pointer-events-none"
          style={{ zIndex: 0 }}
          animate={{
            scale: [1, 1.012, 1],
          }}
          transition={{
            scale: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <img
            src="/hero_donate_3d.png"
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center right',
            }}
          />
        </motion.div>

        {/* ── Semi-transparent warm overlay — ensures text legibility ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: 'rgba(255, 245, 238, 0.60)',
            zIndex: 1,
          }}
        />

        {/* ── Soft left-side gradient: makes left text zone extra clean ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, rgba(255,245,238,0.72) 0%, rgba(255,245,238,0.55) 48%, rgba(255,245,238,0.05) 75%, transparent 100%)',
            zIndex: 2,
          }}
        />

        {/* ── Bottom fade to page background ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #FFF5EE 0%, transparent 22%)',
            zIndex: 2,
          }}
        />

        {/* ── Top fade to navbar area ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,245,238,0.35) 0%, transparent 14%)',
            zIndex: 2,
          }}
        />

        {/* ── Floating sparkle particles (pastel theme) ── */}
        {[...Array(14)].map((_, i) => {
          const sparkleColors = [
            'rgba(239,154,154,0.55)',
            'rgba(129,212,250,0.55)',
            'rgba(165,214,167,0.55)',
            'rgba(255,204,128,0.55)',
            'rgba(206,147,216,0.55)',
          ];
          const col = sparkleColors[i % sparkleColors.length];
          return (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: `${5 + (i % 5) * 2}px`,
                height: `${5 + (i % 5) * 2}px`,
                top: `${10 + (i * 6.2) % 75}%`,
                left: `${5 + (i * 4.7) % 55}%`,
                backgroundColor: col,
                zIndex: 3,
                willChange: 'transform, opacity',
              }}
              animate={{
                y: [0, -18 - (i % 3) * 8, 0],
                x: [0, ((i % 2 === 0) ? 10 : -10) + (i % 3), 0],
                opacity: [0.3, 0.85, 0.3],
                scale: [0.85, 1.3, 0.85],
              }}
              transition={{
                duration: 4.5 + (i % 4) * 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: (i * 0.38) % 3,
              }}
            />
          );
        })}

        {/* ── Heart / star floating icons (charity theme) ── */}
        {['❤️', '🌟', '💛', '🤝', '✨'].map((emoji, i) => (
          <motion.div
            key={`emoji-${i}`}
            className="absolute text-lg select-none pointer-events-none"
            style={{
              top: `${15 + i * 14}%`,
              left: `${3 + i * 9}%`,
              zIndex: 3,
              opacity: 0.55,
              willChange: 'transform, opacity',
            }}
            animate={{
              y: [0, -22, 0],
              rotate: [0, (i % 2 === 0) ? 12 : -12, 0],
              opacity: [0.45, 0.75, 0.45],
            }}
            transition={{
              duration: 5 + i * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.7,
            }}
          >
            {emoji}
          </motion.div>
        ))}

        {/* ── LEFT-SIDE FOREGROUND TEXT: max 50% width — collision-free zone ── */}
        <div
          className="relative w-full h-full flex items-center"
          style={{ zIndex: 10 }}
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={heroContainerVariants}
              style={{
                maxWidth: '52%',
                x: -heroParallax.x * 0.15,
                y: -heroParallax.y * 0.15,
              }}
              className="flex flex-col items-start justify-center"
            >
              {/* Live status pill */}
              <motion.div
                variants={heroItemVariants}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-7 select-none"
                style={{
                  backgroundColor: 'rgba(16,185,129,0.10)',
                  border: '1px solid rgba(16,185,129,0.22)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                  Live Donations Active
                </span>
              </motion.div>

              {/* Main heading */}
              <motion.h1
                variants={heroItemVariants}
                className="font-extrabold tracking-tight leading-[1.0] select-none"
                style={{
                  fontSize: 'clamp(2.6rem, 5.5vw, 4.5rem)',
                  color: '#0f172a',
                }}
              >
                Every Box{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)' }}
                >
                  Donated
                </span>
                <br />
                Feeds a{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }}
                >
                  Family
                </span>
              </motion.h1>

              {/* Sub-description */}
              <motion.p
                variants={heroItemVariants}
                className="mt-6 leading-relaxed font-medium"
                style={{
                  fontSize: 'clamp(0.9rem, 1.5vw, 1.125rem)',
                  color: '#334155',
                  maxWidth: '440px',
                }}
              >
                FoodShare AI connects surplus food and essential goods with verified NGOs and volunteers — putting every donation exactly where it matters most.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={heroItemVariants}
                className="flex flex-col sm:flex-row gap-3 mt-9"
              >
                <Link href="/login/donor">
                  <motion.button
                    whileHover={{ y: -3, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 font-black text-xs uppercase tracking-wider rounded-2xl px-8 cursor-pointer transition-all duration-300"
                    style={{
                      height: '48px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#fff',
                      boxShadow: '0 8px 28px rgba(16,185,129,0.35)',
                    }}
                  >
                    Donate Now
                    <Heart className="w-4 h-4" />
                  </motion.button>
                </Link>
                <a href="#portals">
                  <motion.button
                    whileHover={{ y: -3, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider rounded-2xl px-8 cursor-pointer transition-all duration-300"
                    style={{
                      height: '48px',
                      backgroundColor: 'rgba(15,23,42,0.07)',
                      color: '#0f172a',
                      border: '1.5px solid rgba(15,23,42,0.15)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    Join Network
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </a>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                variants={heroItemVariants}
                className="flex items-center gap-5 mt-8"
              >
                {[
                  { icon: <Users className="w-3.5 h-3.5" />, label: '12K+ Volunteers' },
                  { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: '500+ NGOs' },
                  { icon: <Leaf className="w-3.5 h-3.5" />, label: '98 Tons Saved' },
                ].map(({ icon, label }, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span style={{ color: '#10b981' }}>{icon}</span>
                    <span className="text-[11px] font-semibold" style={{ color: '#475569' }}>
                      {label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* --- Premium Scroll Indicator --- */}
        <ScrollIndicator hasScrolled={hasScrolled} />
      </section>

      {/* --- 3. Statistics Section — Premium Impact Cards --- */}
      <motion.section
        id="statistics"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 py-24"
        style={{ borderBottom: '1px solid rgba(15,23,42,0.07)' }}
      >
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-3">
            Our Impact
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase leading-[0.95] mb-4" style={{ color: '#0f172a' }}>
            Real Numbers, Real Impact
          </p>
          <p className="leading-relaxed font-medium text-sm max-w-lg mx-auto" style={{ color: '#64748b' }}>
            Every figure represents a meal rescued, a volunteer mobilized, and a community strengthened across our growing network.
          </p>
        </div>

        {/* 4 Premium Cards — light theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          <StatCard
            index={0}
            icon={<Utensils className="w-5 h-5" />}
            value={85}
            suffix="+"
            title="Food Donations"
            description="Surplus meals successfully collected and redistributed to those in need"
            accentColor="#10b981"
            iconBgClass="bg-emerald-500/10 border-emerald-500/20"
            hoverShadow="0 20px 60px rgba(16,185,129,0.15), 0 0 0 1px rgba(52,211,153,0.20)"
          />
          <StatCard
            index={1}
            icon={<Users className="w-5 h-5" />}
            value={42}
            suffix="+"
            title="Active Volunteers"
            description="Dedicated community members coordinating pickups and deliveries daily"
            accentColor="#14b8a6"
            iconBgClass="bg-teal-500/10 border-teal-500/20"
            hoverShadow="0 20px 60px rgba(20,184,166,0.15), 0 0 0 1px rgba(45,212,191,0.20)"
          />
          <StatCard
            index={2}
            icon={<Globe className="w-5 h-5" />}
            value={68}
            suffix="+"
            title="Partner NGOs"
            description="Verified charitable organizations receiving and distributing rescued food"
            accentColor="#0ea5e9"
            iconBgClass="bg-sky-500/10 border-sky-500/20"
            hoverShadow="0 20px 60px rgba(14,165,233,0.15), 0 0 0 1px rgba(56,189,248,0.20)"
          />
          <StatCard
            index={3}
            icon={<ShieldCheck className="w-5 h-5" />}
            value={97}
            suffix="%"
            title="Successful Deliveries"
            description="Of all pickups completed safely and on time with full QR verification"
            accentColor="#818cf8"
            iconBgClass="bg-indigo-500/10 border-indigo-500/20"
            hoverShadow="0 20px 60px rgba(99,102,241,0.15), 0 0 0 1px rgba(129,140,248,0.20)"
          />
        </div>
      </motion.section>


      {/* --- 4. About FoodShare AI Section --- */}
      <motion.section
        id="about"
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="py-32 max-w-7xl mx-auto px-6 relative z-10 scroll-mt-28"
        style={{ borderTop: '1px solid rgba(15,23,42,0.07)' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4">About FoodShare AI</h2>
            <p className="text-4xl sm:text-5xl font-extrabold tracking-tight uppercase leading-[0.95]" style={{ color: '#0f172a' }}>
              Targeting the Global Food Waste Crisis
            </p>
          </div>
          <div className="lg:col-span-7 flex items-end">
            <p className="leading-relaxed font-medium text-base" style={{ color: '#64748b' }}>
              One-third of all food produced globally goes to waste, generating 8-10% of global greenhouse gas emissions. FoodShare AI was built to solve this logistical bottleneck.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: What is FoodShare AI */}
          <motion.div
            whileHover={{ y: -8 }}
            className="p-10 rounded-[32px] relative overflow-hidden group"
            style={{ backgroundColor: 'rgba(255,255,255,0.75)', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 8px 32px rgba(15,23,42,0.07)' }}
          >
            <div className="absolute inset-0 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, transparent 60%)' }} />
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl w-fit mb-8 text-emerald-600">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#0f172a' }}>What is FoodShare AI?</h3>
            <p className="text-sm leading-relaxed font-medium" style={{ color: '#64748b' }}>
              An intelligent, automated surplus food redistribution ecosystem. We eliminate manual coordination by automatically routing surplus food to community kitchens.
            </p>
          </motion.div>

          {/* Card 2: Environmental Impact */}
          <motion.div
            whileHover={{ y: -8 }}
            className="p-10 rounded-[32px] relative overflow-hidden group"
            style={{ backgroundColor: 'rgba(255,255,255,0.75)', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 8px 32px rgba(15,23,42,0.07)' }}
          >
            <div className="absolute inset-0 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.05) 0%, transparent 60%)' }} />
            <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-2xl w-fit mb-8 text-sky-600">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#0f172a' }}>Environmental Impact</h3>
            <p className="text-sm leading-relaxed font-medium" style={{ color: '#64748b' }}>
              Every donation prevents organic waste from entering landfills, stopping methane emissions at the source and conserving the water and energy used in food production.
            </p>
          </motion.div>

          {/* Card 3: Community Impact */}
          <motion.div
            whileHover={{ y: -8 }}
            className="p-10 rounded-[32px] relative overflow-hidden group"
            style={{ backgroundColor: 'rgba(255,255,255,0.75)', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 8px 32px rgba(15,23,42,0.07)' }}
          >
            <div className="absolute inset-0 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, transparent 60%)' }} />
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl w-fit mb-8 text-indigo-600">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#0f172a' }}>Community Impact</h3>
            <p className="text-sm leading-relaxed font-medium" style={{ color: '#64748b' }}>
              We strengthen local safety nets. By making donations cost-effective and effortless, we ensure NGOs have a steady, reliable supply of fresh meals.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* --- 5. How It Works Section --- */}
      <motion.section
        id="how-it-works"
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="py-32 relative z-10 scroll-mt-28"
        style={{ backgroundColor: 'rgba(255,255,255,0.45)', borderTop: '1px solid rgba(15,23,42,0.07)', borderBottom: '1px solid rgba(15,23,42,0.07)' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            {/* Left Description Column */}
            <div className="lg:col-span-5 space-y-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600">Logistics Workflow</h2>
              <h3 className="text-5xl font-extrabold tracking-tight uppercase leading-[0.95]" style={{ color: '#0f172a' }}>How the Platform Connects the Network</h3>
              <p className="leading-relaxed font-medium text-base" style={{ color: '#64748b' }}>
                By combining computer vision, smart allocation, and route optimization, we make food rescue fast, verified, and transparent.
              </p>

              {/* Progress Indicator Dots */}
              <div className="flex gap-3 pt-4">
                {steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className="h-1.5 rounded-full transition-all duration-500 cursor-pointer"
                    style={{
                      width: activeStep === idx ? '48px' : '8px',
                      backgroundColor: activeStep === idx ? '#10b981' : 'rgba(15,23,42,0.15)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Right Interactive Timeline */}
            <div className="lg:col-span-7 space-y-4">
              {steps.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <motion.div
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className="p-7 rounded-[24px] transition-all duration-500 cursor-pointer flex gap-6"
                    style={{
                      backgroundColor: isActive ? 'rgba(255,255,255,0.9)' : 'transparent',
                      border: isActive ? '1px solid rgba(16,185,129,0.20)' : '1px solid transparent',
                      boxShadow: isActive ? '0 8px 32px rgba(16,185,129,0.10)' : 'none',
                      transform: isActive ? 'scale(1.01)' : 'scale(1)',
                    }}
                  >
                    <div
                      className="p-3 rounded-xl border shrink-0 h-fit transition-colors duration-500"
                      style={{
                        backgroundColor: isActive ? 'rgba(16,185,129,0.10)' : 'rgba(15,23,42,0.05)',
                        borderColor: isActive ? 'rgba(16,185,129,0.25)' : 'rgba(15,23,42,0.10)',
                        color: isActive ? '#10b981' : '#94a3b8',
                      }}
                    >
                      {step.icon}
                    </div>
                    <div className="space-y-2">
                      <h4
                        className="font-bold transition-colors duration-500"
                        style={{ color: isActive ? '#0f172a' : '#94a3b8', fontSize: isActive ? '1.125rem' : '1rem' }}
                      >
                        {step.title}
                      </h4>
                      <p className="text-sm leading-relaxed font-medium" style={{ color: '#64748b' }}>
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>

      {/* --- 6. User Portals Section --- */}
      <motion.section
        id="portals"
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="py-32 max-w-7xl mx-auto px-6 relative z-10 scroll-mt-28"
      >
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4">User Portals</h2>
          <p className="text-4xl sm:text-5xl font-extrabold tracking-tight uppercase leading-[0.95]" style={{ color: '#0f172a' }}>
            Tailored Gateways for Every Collaborator
          </p>
          <p className="mt-5 leading-relaxed font-medium text-base" style={{ color: '#64748b' }}>
            Choose your role to log in or register. Each portal operates as an independent subsystem with custom dashboards, tools, and workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1: Donor */}
          <div
            onMouseEnter={() => setHoveredPortal('donor')}
            onMouseLeave={() => setHoveredPortal(null)}
            className="rounded-[32px] p-8 flex flex-col justify-between h-[380px] relative overflow-hidden group"
            style={{ backgroundColor: 'rgba(255,255,255,0.80)', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 8px 32px rgba(15,23,42,0.07)' }}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl transition-opacity duration-500 ${hoveredPortal === 'donor' ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundColor: 'rgba(16,185,129,0.12)' }} />
            <div>
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl w-fit mb-6 text-emerald-600">
                <Utensils className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#0f172a' }}>Donor</h3>
              <p className="text-xs leading-relaxed font-medium" style={{ color: '#64748b' }}>
                Restaurants, Hotels, Bakeries, Catering Services, and Individuals can list surplus food in seconds. Track tax credits and sustainability reports.
              </p>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login/donor" className="w-full">
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold py-2 rounded-xl text-[10px] h-9 tracking-wider uppercase">Login</Button>
                </Link>
                <Button onClick={() => handleDemoLogin('Donor', '/dashboard/donor')} variant="outline" className="w-full border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-600 font-bold py-2 rounded-xl text-[10px] h-9">Demo</Button>
              </div>
              <Link href="/register?role=Donor" className="text-center text-[10px] font-bold uppercase tracking-wider py-1 transition-colors" style={{ color: '#94a3b8' }}>Register as Donor</Link>
            </div>
          </div>

          {/* Card 2: NGO */}
          <div
            onMouseEnter={() => setHoveredPortal('ngo')}
            onMouseLeave={() => setHoveredPortal(null)}
            className="rounded-[32px] p-8 flex flex-col justify-between h-[380px] relative overflow-hidden group"
            style={{ backgroundColor: 'rgba(255,255,255,0.80)', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 8px 32px rgba(15,23,42,0.07)' }}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl transition-opacity duration-500 ${hoveredPortal === 'ngo' ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundColor: 'rgba(14,165,233,0.12)' }} />
            <div>
              <div className="p-3.5 bg-sky-500/10 border border-sky-500/20 rounded-2xl w-fit mb-6 text-sky-600">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#0f172a' }}>NGO</h3>
              <p className="text-xs leading-relaxed font-medium" style={{ color: '#64748b' }}>
                Browse nearby donations, accept requests, and coordinate pickups. Efficiently manage inventory and log distributions.
              </p>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login/ngo" className="w-full">
                  <Button className="w-full bg-sky-500 hover:bg-sky-400 text-white font-extrabold py-2 rounded-xl text-[10px] h-9 tracking-wider uppercase">Login</Button>
                </Link>
                <Button onClick={() => handleDemoLogin('NGO', '/dashboard/ngo')} variant="outline" className="w-full border-sky-500/30 hover:bg-sky-500/10 text-sky-600 font-bold py-2 rounded-xl text-[10px] h-9">Demo</Button>
              </div>
              <Link href="/register?role=NGO" className="text-center text-[10px] font-bold uppercase tracking-wider py-1 transition-colors" style={{ color: '#94a3b8' }}>Register an NGO</Link>
            </div>
          </div>

          {/* Card 3: Volunteer */}
          <div
            onMouseEnter={() => setHoveredPortal('volunteer')}
            onMouseLeave={() => setHoveredPortal(null)}
            className="rounded-[32px] p-8 flex flex-col justify-between h-[380px] relative overflow-hidden group"
            style={{ backgroundColor: 'rgba(255,255,255,0.80)', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 8px 32px rgba(15,23,42,0.07)' }}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl transition-opacity duration-500 ${hoveredPortal === 'volunteer' ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundColor: 'rgba(245,158,11,0.12)' }} />
            <div>
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl w-fit mb-6 text-amber-600">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#0f172a' }}>Volunteer</h3>
              <p className="text-xs leading-relaxed font-medium" style={{ color: '#64748b' }}>
                Receive route-optimized pick-up requests. Navigate efficiently between donors and NGOs, earn community rewards, and log carbon-offset miles.
              </p>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login/volunteer" className="w-full">
                  <Button className="w-full bg-amber-500 hover:bg-amber-400 text-white font-extrabold py-2 rounded-xl text-[10px] h-9 tracking-wider uppercase">Login</Button>
                </Link>
                <Button onClick={() => handleDemoLogin('Volunteer', '/dashboard/volunteer')} variant="outline" className="w-full border-amber-500/30 hover:bg-amber-500/10 text-amber-600 font-bold py-2 rounded-xl text-[10px] h-9">Demo</Button>
              </div>
              <Link href="/register?role=Volunteer" className="text-center text-[10px] font-bold uppercase tracking-wider py-1 transition-colors" style={{ color: '#94a3b8' }}>Join as Volunteer</Link>
            </div>
          </div>

          {/* Card 4: Admin */}
          <div
            onMouseEnter={() => setHoveredPortal('admin')}
            onMouseLeave={() => setHoveredPortal(null)}
            className="rounded-[32px] p-8 flex flex-col justify-between h-[380px] relative overflow-hidden group"
            style={{ backgroundColor: 'rgba(255,255,255,0.80)', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 8px 32px rgba(15,23,42,0.07)' }}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl transition-opacity duration-500 ${hoveredPortal === 'admin' ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundColor: 'rgba(139,92,246,0.12)' }} />
            <div>
              <div className="p-3.5 bg-violet-500/10 border border-violet-500/20 rounded-2xl w-fit mb-6 text-violet-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#0f172a' }}>Admin</h3>
              <p className="text-xs leading-relaxed font-medium" style={{ color: '#64748b' }}>
                Internal dashboard for system monitoring, organization verification, global analytics, system performance tuning, and conflict resolution.
              </p>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login/admin" className="w-full">
                  <Button variant="outline" className="w-full border-slate-300 hover:bg-slate-100 text-slate-600 font-extrabold py-2 rounded-xl text-[10px] h-9 tracking-wider uppercase">Login</Button>
                </Link>
                <Button onClick={() => handleDemoLogin('Admin', '/dashboard/admin')} variant="outline" className="w-full border-violet-500/30 hover:bg-violet-500/10 text-violet-600 font-bold py-2 rounded-xl text-[10px] h-9">Demo</Button>
              </div>
              <div className="text-center text-transparent text-[10px] py-1 select-none">Placeholder</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* --- 7. Features Section --- */}
      <motion.section
        id="features"
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="py-32 relative z-10 scroll-mt-28"
        style={{ backgroundColor: 'rgba(255,255,255,0.45)', borderTop: '1px solid rgba(15,23,42,0.07)' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4">Platform Capabilities</h2>
            <p className="text-4xl sm:text-5xl font-extrabold tracking-tight uppercase leading-[0.95]" style={{ color: '#0f172a' }}>
              State-of-the-Art Operations Infrastructure
            </p>
            <p className="mt-5 leading-relaxed font-medium text-base" style={{ color: '#64748b' }}>
              Advanced technologies driving efficiency and transparency across our food rescue network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Sparkles className="w-5 h-5" />, color: '#10b981', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.20)', title: 'AI Food Recognition', desc: 'Computer vision quality checks estimate volume, assess freshness, and predict shelf life from food photos.' },
              { icon: <Users className="w-5 h-5" />, color: '#0ea5e9', bg: 'rgba(14,165,233,0.10)', border: 'rgba(14,165,233,0.20)', title: 'Smart NGO Matching', desc: 'Algorithmically matches listings based on location, storage capacity, dietary focus, and urgency.' },
              { icon: <Truck className="w-5 h-5" />, color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.20)', title: 'AI Route Optimization', desc: 'Calculates the fastest multi-stop pickup paths for volunteers, reducing delivery times and emissions.' },
              { icon: <ShieldCheck className="w-5 h-5" />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)', border: 'rgba(139,92,246,0.20)', title: 'Secure QR Verification', desc: 'Ensures safe handoffs and prevents food diversion using secure cryptographic QR verification.' },
              { icon: <Activity className="w-5 h-5" />, color: '#ec4899', bg: 'rgba(236,72,153,0.10)', border: 'rgba(236,72,153,0.20)', title: 'Live Tracking', desc: 'Real-time tracking of active shipments on our live map keeps donors, volunteers, and NGOs aligned.' },
              { icon: <BarChart3 className="w-5 h-5" />, color: '#14b8a6', bg: 'rgba(20,184,166,0.10)', border: 'rgba(20,184,166,0.20)', title: 'Sustainability Reports', desc: 'Export auditable ESG metrics showing CO₂ prevention and landfill diversion numbers for tax benefits.' },
            ].map((feat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className="p-8 rounded-3xl relative overflow-hidden group"
                style={{ backgroundColor: 'rgba(255,255,255,0.80)', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 8px 28px rgba(15,23,42,0.07)' }}
              >
                <div className="p-3 rounded-xl w-fit mb-6" style={{ backgroundColor: feat.bg, border: `1px solid ${feat.border}`, color: feat.color }}>
                  {feat.icon}
                </div>
                <h4 className="text-xl font-bold mb-3" style={{ color: '#0f172a' }}>{feat.title}</h4>
                <p className="text-xs leading-relaxed font-medium" style={{ color: '#64748b' }}>{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* --- 8. Testimonials Section --- */}
      <motion.section
        id="testimonials"
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="py-32 relative z-10 scroll-mt-28"
        style={{ borderTop: '1px solid rgba(15,23,42,0.07)', borderBottom: '1px solid rgba(15,23,42,0.07)' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4">Testimonials</h2>
            <p className="text-4xl sm:text-5xl font-extrabold tracking-tight uppercase leading-[0.95]" style={{ color: '#0f172a' }}>
              Trusted by the Network
            </p>
            <p className="mt-5 leading-relaxed font-medium text-base" style={{ color: '#64748b' }}>
              Read how FoodShare AI has transformed operations for businesses, charities, and volunteers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Testimonial 1 */}
            <div className="p-7 rounded-[24px] flex flex-col justify-between relative overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.80)', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 8px 28px rgba(15,23,42,0.07)' }}>
              <div className="space-y-5">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                  ))}
                </div>
                <p className="text-xs leading-relaxed italic font-medium" style={{ color: '#475569' }}>
                  "Before FoodShare AI, donating surplus food required hours of phone calls. Now, our kitchen staff lists items in seconds, and they are picked up within the hour."
                </p>
              </div>
              <div className="flex items-center gap-3 mt-8 pt-5" style={{ borderTop: '1px solid rgba(15,23,42,0.07)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#e2e8f0', color: '#0f172a' }}>MA</div>
                <div>
                  <h5 className="text-xs font-bold" style={{ color: '#0f172a' }}>Marcus Aurelius</h5>
                  <p className="text-[10px] font-semibold" style={{ color: '#94a3b8' }}>Owner, The Hearth Bakery</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-7 rounded-[24px] flex flex-col justify-between relative overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.80)', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 8px 28px rgba(15,23,42,0.07)' }}>
              <div className="space-y-5">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                  ))}
                </div>
                <p className="text-xs leading-relaxed italic font-medium" style={{ color: '#475569' }}>
                  "The matching algorithm is incredible. It filters donations based on our cold storage capacity and dietary guidelines, ensuring zero food goes to waste at our shelter."
                </p>
              </div>
              <div className="flex items-center gap-3 mt-8 pt-5" style={{ borderTop: '1px solid rgba(15,23,42,0.07)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#e2e8f0', color: '#0f172a' }}>SC</div>
                <div>
                  <h5 className="text-xs font-bold" style={{ color: '#0f172a' }}>Sarah Connor</h5>
                  <p className="text-[10px] font-semibold" style={{ color: '#94a3b8' }}>Director, Hope Food Bank</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-7 rounded-[24px] flex flex-col justify-between relative overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.80)', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 8px 28px rgba(15,23,42,0.07)' }}>
              <div className="space-y-5">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                  ))}
                </div>
                <p className="text-xs leading-relaxed italic font-medium" style={{ color: '#475569' }}>
                  "I love the optimized routing. I can complete three deliveries in my neighborhood on my bike during my lunch break, knowing exactly where to go and who to contact."
                </p>
              </div>
              <div className="flex items-center gap-3 mt-8 pt-5" style={{ borderTop: '1px solid rgba(15,23,42,0.07)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#e2e8f0', color: '#0f172a' }}>DK</div>
                <div>
                  <h5 className="text-xs font-bold" style={{ color: '#0f172a' }}>David Kim</h5>
                  <p className="text-[10px] font-semibold" style={{ color: '#94a3b8' }}>Rescue Volunteer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 4 */}
            <div className="p-7 rounded-[24px] flex flex-col justify-between relative overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.80)', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 8px 28px rgba(15,23,42,0.07)' }}>
              <div className="space-y-5">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                  ))}
                </div>
                <p className="text-xs leading-relaxed italic font-medium" style={{ color: '#475569' }}>
                  "Exporting verified ESG reports directly from FoodShare AI has simplified our corporate sustainability reporting. We have clear, auditable carbon offset numbers."
                </p>
              </div>
              <div className="flex items-center gap-3 mt-8 pt-5" style={{ borderTop: '1px solid rgba(15,23,42,0.07)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#e2e8f0', color: '#0f172a' }}>EL</div>
                <div>
                  <h5 className="text-xs font-bold" style={{ color: '#0f172a' }}>Emma Lindqvist</h5>
                  <p className="text-[10px] font-semibold" style={{ color: '#94a3b8' }}>CSR Director, Atlas Corp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* --- 9. FAQ Section --- */}
      <motion.section
        id="faq"
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="py-32 max-w-3xl mx-auto px-6 relative z-10 scroll-mt-28"
      >
        <div className="text-center mb-20">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4">FAQ</h2>
          <p className="text-4xl font-extrabold tracking-tight uppercase leading-[0.95]" style={{ color: '#0f172a' }}>
            Frequently Asked Questions
          </p>
        </div>

        <div className="space-y-4">
          {[
            { q: "How do food donations work?", a: "Donors list surplus food on their portal, detailing item types, weight, and expiry. The system verifies these details using AI, matches it with nearby eligible NGOs, and alerts local volunteers to coordinate the pick-up and delivery." },
            { q: "Is food safety guaranteed?", a: "Yes. All donors must comply with local food safety regulations. During upload, our AI analyzes photos to check freshness, and volunteers verify storage conditions (e.g., thermal bags) at pickup. NGOs verify quality upon receipt." },
            { q: "How are NGOs verified?", a: "NGOs must submit regulatory tax-exempt certificates, food handling licenses, and verification credentials during registration. FoodShare administrators manually audit and approve every organization before they can receive donations." },
            { q: "What is the volunteer process?", a: "Volunteers register on the portal and undergo a short digital training on food handling. Once verified, they receive route-optimized pickup alerts on their dashboard based on their location and vehicle type." },
            { q: "Is user data kept private?", a: "Yes. FoodShare AI is fully compliant with GDPR and CCPA. Personal data and exact location details are only shared with matched parties during active deliveries to ensure safety and coordinate handovers." },
            { q: "Are tax and donation certificates provided?", a: "Absolutely. When an NGO receives a donation, the system automatically logs the transaction and generates an official tax-deductible donation certificate for the donor, exportable directly from the dashboard." },
          ].map((item, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-[20px] overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.80)',
                  border: isOpen ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(15,23,42,0.08)',
                  boxShadow: '0 4px 16px rgba(15,23,42,0.06)',
                }}
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full py-5 px-6 flex justify-between items-center text-left font-bold transition-all text-sm cursor-pointer"
                  style={{ color: '#0f172a' }}
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className="w-4 h-4 transition-transform duration-300"
                    style={{ color: isOpen ? '#10b981' : '#94a3b8', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 text-xs leading-relaxed pt-3" style={{ color: '#64748b', borderTop: '1px solid rgba(15,23,42,0.07)', backgroundColor: 'rgba(241,245,249,0.50)' }}>
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* --- 10. Final CTA Section --- */}
      <motion.section
        id="contact"
        className="py-32 max-w-7xl mx-auto px-6 relative z-10 scroll-mt-28"
        style={{ borderTop: '1px solid rgba(15,23,42,0.07)' }}
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          ref={ctaCardRef}
          onMouseMove={handleCtaMouseMove}
          onMouseEnter={() => setCtaIsHovered(true)}
          onMouseLeave={handleCtaMouseLeave}
          style={{
            transform: `perspective(1000px) rotateX(${ctaRotateX}deg) rotateY(${ctaRotateY}deg)`,
            transition: ctaIsHovered ? 'none' : 'transform 0.5s ease-out',
            backgroundColor: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(15,23,42,0.08)',
            boxShadow: '0 20px 60px rgba(15,23,42,0.10)',
            borderRadius: '40px',
            padding: '3rem',
            textAlign: 'center',
            overflow: 'hidden',
            position: 'relative',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Cursor-following glow */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${ctaIsHovered ? 'opacity-100' : 'opacity-0'}`}
            style={{ background: `radial-gradient(500px circle at ${ctaMousePos.x}px ${ctaMousePos.y}px, rgba(16,185,129,0.06), transparent 70%)` }}
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: 'rgba(16,185,129,0.06)' }} />

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">JOIN THE MISSION</span>
            <h3 className="text-4xl sm:text-6xl font-extrabold tracking-tight uppercase leading-[0.95]" style={{ color: '#0f172a' }}>Ready to Reduce Waste?</h3>
            <p className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-medium" style={{ color: '#64748b' }}>
              Choose your path today. Whether you list surplus food, coordinate logistics, or distribute meals, your contribution accelerates global sustainability.
            </p>

            {/* Desktop */}
            <div className="hidden lg:flex flex-row justify-center items-center gap-4 pt-8">
              <motion.div whileHover={{ y: -3 }}><Link href="/register?role=donor" className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold px-7 py-4 rounded-2xl text-xs tracking-wider uppercase shadow-lg transition-all duration-300 cursor-pointer select-none">Become a Donor</Link></motion.div>
              <motion.div whileHover={{ y: -3 }}><Link href="/register?role=ngo" className="inline-flex items-center justify-center bg-sky-500 hover:bg-sky-400 text-white font-extrabold px-7 py-4 rounded-2xl text-xs tracking-wider uppercase shadow-lg transition-all duration-300 cursor-pointer select-none">Register an NGO</Link></motion.div>
              <motion.div whileHover={{ y: -3 }}><Link href="/register?role=volunteer" className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-400 text-white font-extrabold px-7 py-4 rounded-2xl text-xs tracking-wider uppercase shadow-lg transition-all duration-300 cursor-pointer select-none">Join as Volunteer</Link></motion.div>
              <motion.div whileHover={{ y: -3 }}><Link href="/contact" className="inline-flex items-center justify-center font-extrabold px-7 py-4 rounded-2xl text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer select-none" style={{ border: '1.5px solid rgba(15,23,42,0.15)', color: '#0f172a', backgroundColor: 'rgba(15,23,42,0.04)' }}>Contact Team</Link></motion.div>
            </div>

            {/* Tablet */}
            <div className="hidden md:flex lg:hidden flex-col items-center gap-4 max-w-xs mx-auto pt-8">
              <Link href="/register?role=donor" className="w-full text-center inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold py-4 rounded-2xl text-xs tracking-wider uppercase shadow-lg transition-all duration-300 cursor-pointer select-none">Become a Donor</Link>
              <Link href="/register?role=ngo" className="w-full text-center inline-flex items-center justify-center bg-sky-500 hover:bg-sky-400 text-white font-extrabold py-4 rounded-2xl text-xs tracking-wider uppercase shadow-lg transition-all duration-300 cursor-pointer select-none">Register an NGO</Link>
              <Link href="/register?role=volunteer" className="w-full text-center inline-flex items-center justify-center bg-amber-500 hover:bg-amber-400 text-white font-extrabold py-4 rounded-2xl text-xs tracking-wider uppercase shadow-lg transition-all duration-300 cursor-pointer select-none">Join as Volunteer</Link>
              <Link href="/contact" className="w-full text-center inline-flex items-center justify-center font-extrabold py-4 rounded-2xl text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer select-none" style={{ border: '1.5px solid rgba(15,23,42,0.15)', color: '#0f172a' }}>Contact Team</Link>
            </div>

            {/* Mobile */}
            <div className="flex md:hidden flex-col w-full mt-8 text-left" style={{ borderTop: '1px solid rgba(15,23,42,0.08)' }}>
              {[
                { href: '/register?role=donor', label: 'Become Donor', dot: '#10b981', arrow: '#10b981' },
                { href: '/register?role=ngo', label: 'Register NGO', dot: '#0ea5e9', arrow: '#0ea5e9' },
                { href: '/register?role=volunteer', label: 'Volunteer', dot: '#f59e0b', arrow: '#f59e0b' },
                { href: '/contact', label: 'Contact Team', dot: '#94a3b8', arrow: '#94a3b8' },
              ].map(({ href, label, dot, arrow }) => (
                <Link key={href} href={href} className="w-full py-5 text-left font-bold flex items-center justify-between px-2 cursor-pointer transition-colors" style={{ color: '#0f172a', borderBottom: '1px solid rgba(15,23,42,0.07)' }}>
                  <span className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dot }} />
                    {label}
                  </span>
                  <ArrowRight className="w-4 h-4" style={{ color: arrow }} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* --- 11. Footer Section --- */}
      <motion.footer
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="py-20 relative z-10"
        style={{ backgroundColor: 'rgba(255,248,242,0.95)', borderTop: '1px solid rgba(15,23,42,0.08)' }}
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-6 gap-12">

          <div className="md:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-lg" style={{ color: '#0f172a' }}>
              <img src="/logo.png" className="w-10 h-10 rounded-lg object-cover" style={{ border: '1px solid rgba(15,23,42,0.10)' }} alt="FoodShare AI Logo" />
              <span>FoodShare <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #10b981, #0ea5e9)' }}>AI</span></span>
            </Link>
            <p className="text-xs leading-relaxed font-medium" style={{ color: '#64748b' }}>
              FoodShare AI is an automated food redistribution SaaS platform. We coordinate logistics to connect surplus food with local communities.
            </p>
            <p className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: '#94a3b8' }}>
              &copy; {new Date().getFullYear()} FoodShare AI. All rights reserved.
            </p>
          </div>

          {[{
            title: 'Company',
            links: [['#about','About Us'],['#portals','Portals'],['#','Press Kit'],['#','Careers']]
          },{
            title: 'Product',
            links: [['#features','Features'],['#portals','Portals'],['#','API Docs'],['#','Security']]
          },{
            title: 'Resources',
            links: [['#','Blog'],['#faq','Help Center'],['#','Privacy Policy'],['#','Terms of Service']]
          }].map(col => (
            <div key={col.title} className="space-y-4">
              <h5 className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#0f172a' }}>{col.title}</h5>
              <ul className="space-y-2.5 text-xs font-medium">
                {col.links.map(([href, label]) => (
                  <li key={label}><a href={href} className="transition-colors" style={{ color: '#64748b' }} onMouseEnter={e => ((e.target as HTMLElement).style.color = '#0f172a')} onMouseLeave={e => ((e.target as HTMLElement).style.color = '#64748b')}>{label}</a></li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-5">
            <h5 className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#0f172a' }}>Newsletter</h5>
            <p className="text-xs leading-relaxed font-medium" style={{ color: '#64748b' }}>
              Receive updates on food rescue logistics and sustainability metrics.
            </p>
            {emailSubscribed ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] text-emerald-600 font-bold tracking-wider uppercase text-center">
                Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="rounded-xl px-4 py-2.5 text-xs focus:outline-none w-full"
                  style={{ backgroundColor: 'rgba(255,255,255,0.90)', border: '1px solid rgba(15,23,42,0.12)', color: '#0f172a' }}
                />
                <Button type="submit" size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 rounded-xl cursor-pointer">
                  <Mail className="w-3.5 h-3.5" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
