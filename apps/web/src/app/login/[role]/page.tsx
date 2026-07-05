'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Lock, Mail, ShieldAlert, Heart, Users, Truck, Utensils, ArrowLeft, ShieldCheck 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiRequest, setAuthToken, setCurrentUser } from '@/lib/api';

type RoleConfig = {
  title: string;
  subtitle: string;
  accentClass: string;
  btnClass: string;
  icon: React.ReactNode;
  dbRole: string;
  dashboardPath: string;
  bgGlow: string;
};

const ROLE_CONFIGS: Record<string, RoleConfig> = {
  donor: {
    title: 'Donor Portal',
    subtitle: 'Restaurants, Hotels, Bakeries, Catering & Individuals',
    accentClass: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
    btnClass: 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20',
    icon: <Utensils className="w-6 h-6 text-emerald-400" />,
    dbRole: 'Donor',
    dashboardPath: '/dashboard/donor',
    bgGlow: 'bg-emerald-500/5',
  },
  ngo: {
    title: 'NGO Portal',
    subtitle: 'Food Banks, Shelters, Soup Kitchens & Community Centers',
    accentClass: 'text-sky-400 border-sky-500/20 bg-sky-500/10',
    btnClass: 'bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/20',
    icon: <Heart className="w-6 h-6 text-sky-400" />,
    dbRole: 'NGO',
    dashboardPath: '/dashboard/ngo',
    bgGlow: 'bg-sky-500/5',
  },
  volunteer: {
    title: 'Volunteer Portal',
    subtitle: 'Rescue Riders, Drivers, Delivery Partners & Co-ordinators',
    accentClass: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
    btnClass: 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20',
    icon: <Truck className="w-6 h-6 text-amber-400" />,
    dbRole: 'Volunteer',
    dashboardPath: '/dashboard/volunteer',
    bgGlow: 'bg-amber-500/5',
  },
  admin: {
    title: 'Admin Console',
    subtitle: 'System Administrators, Analysts & Operations Managers',
    accentClass: 'text-violet-400 border-violet-500/20 bg-violet-500/10',
    btnClass: 'bg-violet-500 hover:bg-violet-400 text-white shadow-violet-500/20',
    icon: <ShieldCheck className="w-6 h-6 text-violet-400" />,
    dbRole: 'Admin',
    dashboardPath: '/dashboard/admin',
    bgGlow: 'bg-violet-500/5',
  },
};

export default function RoleLoginPage() {
  const router = useRouter();
  const params = useParams();
  const roleKey = (params.role as string)?.toLowerCase() || '';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Validate route parameter
  const config = ROLE_CONFIGS[roleKey];
  if (!config) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col justify-center items-center p-6 text-center">
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl max-w-md">
          <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Invalid Portal Route</h2>
          <p className="text-sm text-zinc-400 mb-6">The portal role you are trying to access does not exist.</p>
          <Link href="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const payload: any = { email, password };
      if (twoFactorRequired) {
        payload.otp = otp;
      }

      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.twoFactorRequired) {
        setTwoFactorRequired(true);
        setIsLoading(false);
        return;
      }

      // Save credentials
      setAuthToken(res.accessToken);
      setCurrentUser(res.user);

      // Validate role matching
      const userRole = res.user.role;
      if (userRole.toLowerCase() !== roleKey) {
        const targetConfig = ROLE_CONFIGS[userRole.toLowerCase()];
        if (targetConfig) {
          router.push(targetConfig.dashboardPath);
        } else {
          router.push('/unauthorized');
        }
        return;
      }

      router.push(config.dashboardPath);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] ${config.bgGlow} rounded-full blur-[120px] pointer-events-none`} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-zinc-900/50 rounded-full blur-[100px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-xs mb-8 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to marketing site
        </Link>

        {/* Logo */}
        <div className="inline-flex items-center gap-2.5 font-bold text-2xl tracking-tight text-white mb-6">
          <span className={`p-2 rounded-xl border ${config.accentClass} shadow-[0_0_15px_rgba(16,185,129,0.05)]`}>
            {config.icon}
          </span>
          <span>FoodShare <span className="text-emerald-400 font-extrabold">AI</span></span>
        </div>

        <h2 className="text-3xl font-black text-white tracking-tight">{config.title}</h2>
        <p className="mt-2 text-sm text-zinc-400 max-w-sm mx-auto">{config.subtitle}</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="glass-card py-8 px-10 rounded-2xl shadow-2xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
          
          <form className="space-y-6" onSubmit={handleSubmit} id="login-form">
            {error && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!twoFactorRequired ? (
              <>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  id="login-email"
                  className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 focus:ring-emerald-500/20 text-white rounded-xl"
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  id="login-password"
                  className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 focus:ring-emerald-500/20 text-white rounded-xl"
                />
              </>
            ) : (
              <div className="space-y-4">
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 leading-relaxed">
                  Two-Factor Authentication is enabled. Please enter the OTP sent to your profile. (For demo use code <span className="font-bold">123456</span>)
                </div>
                <Input
                  label="Enter 6-Digit Code"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  id="login-otp"
                  className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 focus:ring-emerald-500/20 text-white rounded-xl font-mono text-center text-lg tracking-widest"
                />
              </div>
            )}

            <div className="space-y-3 pt-2">
              <Button type="submit" className={`w-full py-2.5 rounded-xl font-semibold transition-all duration-300 ${config.btnClass}`} isLoading={isLoading}>
                Sign In to Dashboard
              </Button>
              
              <Button
                type="button"
                onClick={() => {
                  const role = config.dbRole;
                  localStorage.setItem('gs_token', 'demo-token-12345');
                  localStorage.setItem('gs_user', JSON.stringify({
                    name: `Demo ${role}`,
                    email: `demo-${role.toLowerCase()}@foodshare.org`,
                    role: role
                  }));
                  document.cookie = `gs_role=${role}; path=/`;
                  router.push(config.dashboardPath);
                }}
                variant="outline"
                className="w-full py-2.5 rounded-xl border-zinc-800 hover:bg-zinc-900/40 text-zinc-300 hover:text-white font-semibold transition-all"
              >
                Instant Demo Login
              </Button>
            </div>
          </form>
        </div>

        {/* Alternate Portals Link */}
        <div className="mt-8 text-center text-xs text-zinc-500 space-y-3">
          <p>
            Need a different portal?{' '}
            <span className="inline-flex gap-2 font-medium">
              {Object.entries(ROLE_CONFIGS)
                .filter(([k]) => k !== roleKey && k !== 'admin')
                .map(([k, cfg]) => (
                  <Link key={k} href={`/login/${k}`} className="text-emerald-400 hover:underline capitalize">
                    {k}
                  </Link>
                ))}
            </span>
          </p>
          <p>
            New to FoodShare AI?{' '}
            <Link href="/register" className="text-zinc-300 hover:text-white underline font-medium">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
