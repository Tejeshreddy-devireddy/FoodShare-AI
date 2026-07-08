'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldAlert, Heart, Users, Truck, Utensils, ArrowLeft, ShieldCheck 
} from 'lucide-react';
import { apiRequest, setAuthToken, setCurrentUser } from '@/lib/api';

type RoleConfig = {
  title: string;
  subtitle: string;
  accentColor: string;
  accentBg: string;
  btnGradient: string;
  btnShadow: string;
  icon: React.ReactNode;
  dbRole: string;
  dashboardPath: string;
  glowColor: string;
};

const ROLE_CONFIGS: Record<string, RoleConfig> = {
  donor: {
    title: 'Donor Portal',
    subtitle: 'Restaurants, Hotels, Bakeries, Catering & Individuals',
    accentColor: '#059669',
    accentBg: 'rgba(16,185,129,0.08)',
    btnGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    btnShadow: '0 4px 16px rgba(16,185,129,0.30)',
    icon: <Utensils className="w-6 h-6" style={{ color: '#059669' }} />,
    dbRole: 'Donor',
    dashboardPath: '/dashboard/donor',
    glowColor: 'rgba(16,185,129,0.07)',
  },
  ngo: {
    title: 'NGO Portal',
    subtitle: 'Food Banks, Shelters, Soup Kitchens & Community Centers',
    accentColor: '#0284c7',
    accentBg: 'rgba(14,165,233,0.08)',
    btnGradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    btnShadow: '0 4px 16px rgba(14,165,233,0.30)',
    icon: <Heart className="w-6 h-6" style={{ color: '#0284c7' }} />,
    dbRole: 'NGO',
    dashboardPath: '/dashboard/ngo',
    glowColor: 'rgba(14,165,233,0.07)',
  },
  volunteer: {
    title: 'Volunteer Portal',
    subtitle: 'Rescue Riders, Drivers, Delivery Partners & Co-ordinators',
    accentColor: '#d97706',
    accentBg: 'rgba(245,158,11,0.08)',
    btnGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    btnShadow: '0 4px 16px rgba(245,158,11,0.30)',
    icon: <Truck className="w-6 h-6" style={{ color: '#d97706' }} />,
    dbRole: 'Volunteer',
    dashboardPath: '/dashboard/volunteer',
    glowColor: 'rgba(245,158,11,0.07)',
  },
  admin: {
    title: 'Admin Console',
    subtitle: 'System Administrators, Analysts & Operations Managers',
    accentColor: '#7c3aed',
    accentBg: 'rgba(124,58,237,0.08)',
    btnGradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    btnShadow: '0 4px 16px rgba(124,58,237,0.30)',
    icon: <ShieldCheck className="w-6 h-6" style={{ color: '#7c3aed' }} />,
    dbRole: 'Admin',
    dashboardPath: '/dashboard/admin',
    glowColor: 'rgba(124,58,237,0.07)',
  },
};

// Light-themed input component matching landing page aesthetics
function LightInput({ label, accentColor, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; accentColor?: string }) {
  const accent = accentColor || '#10b981';
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>
          {label}
        </label>
      )}
      <input
        className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none"
        style={{
          backgroundColor: 'rgba(255,255,255,0.80)',
          border: '1px solid rgba(15,23,42,0.12)',
          color: '#0f172a',
        }}
        onFocus={(e) => {
          e.currentTarget.style.border = `1px solid ${accent}80`;
          e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}18`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.border = '1px solid rgba(15,23,42,0.12)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        {...props}
      />
    </div>
  );
}

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

  const config = ROLE_CONFIGS[roleKey];
  if (!config) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6 text-center" style={{ backgroundColor: '#FFF5EE' }}>
        <div
          className="p-4 rounded-2xl max-w-md"
          style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}
        >
          <ShieldAlert className="w-12 h-12 mx-auto mb-4" style={{ color: '#dc2626' }} />
          <h2 className="text-xl font-bold mb-2" style={{ color: '#0f172a' }}>Invalid Portal Route</h2>
          <p className="text-sm mb-6" style={{ color: '#64748b' }}>The portal role you are trying to access does not exist.</p>
          <Link href="/" className="inline-flex items-center gap-2 font-medium transition-colors" style={{ color: '#059669' }}>
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

      setAuthToken(res.accessToken);
      setCurrentUser(res.user);

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
    <div
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ backgroundColor: '#FFF5EE' }}
    >
      {/* Volumetric background lights matching landing page */}
      <div
        className="absolute top-[-15%] left-[10%] rounded-full pointer-events-none z-0"
        style={{ width: '700px', height: '700px', backgroundColor: config.glowColor, filter: 'blur(160px)' }}
      />
      <div
        className="absolute top-[25%] right-[-10%] rounded-full pointer-events-none z-0"
        style={{ width: '500px', height: '500px', backgroundColor: 'rgba(251,191,36,0.06)', filter: 'blur(140px)' }}
      />
      <div
        className="absolute bottom-[20%] left-[-15%] rounded-full pointer-events-none z-0"
        style={{ width: '700px', height: '700px', backgroundColor: 'rgba(249,115,22,0.04)', filter: 'blur(180px)' }}
      />

      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs mb-8 transition-colors font-medium"
          style={{ color: '#94a3b8' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#0f172a')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8')}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to marketing site
        </Link>

        {/* Logo */}
        <div className="inline-flex items-center gap-2.5 font-bold text-2xl tracking-tight mb-6" style={{ color: '#0f172a' }}>
          <span
            className="p-2 rounded-xl"
            style={{
              backgroundColor: config.accentBg,
              border: `1px solid ${config.accentColor}28`,
              boxShadow: `0 0 12px ${config.accentColor}18`,
            }}
          >
            {config.icon}
          </span>
          <span>
            FoodShare{' '}
            <span
              className="font-extrabold bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #10b981, #0ea5e9)' }}
            >
              AI
            </span>
          </span>
        </div>

        <h2 className="text-3xl font-black tracking-tight" style={{ color: '#0f172a' }}>{config.title}</h2>
        <p className="mt-2 text-sm max-w-sm mx-auto" style={{ color: '#64748b' }}>{config.subtitle}</p>
      </div>

      {/* Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div
          className="py-8 px-10 rounded-2xl relative overflow-hidden"
          style={{
            backgroundColor: 'rgba(255, 252, 249, 0.85)',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            boxShadow: '0 8px 32px rgba(15,23,42,0.07), 0 1px 4px rgba(0,0,0,0.04)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: `linear-gradient(90deg, transparent, ${config.accentColor}50, transparent)` }}
          />

          <form className="space-y-6" onSubmit={handleSubmit} id="login-form">
            {error && (
              <div
                className="p-3.5 rounded-xl text-xs flex items-center gap-2"
                style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', color: '#dc2626' }}
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!twoFactorRequired ? (
              <>
                <LightInput
                  label="Email Address"
                  type="email"
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  id="login-email"
                  accentColor={config.accentColor}
                />
                <LightInput
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  id="login-password"
                  accentColor={config.accentColor}
                />
              </>
            ) : (
              <div className="space-y-4">
                <div
                  className="p-3.5 rounded-xl text-xs leading-relaxed"
                  style={{ backgroundColor: `${config.accentColor}14`, border: `1px solid ${config.accentColor}28`, color: config.accentColor }}
                >
                  Two-Factor Authentication is enabled. Please enter the OTP sent to your profile. (For demo use code <span className="font-bold">123456</span>)
                </div>
                <LightInput
                  label="Enter 6-Digit Code"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  id="login-otp"
                  accentColor={config.accentColor}
                />
              </div>
            )}

            <div className="space-y-3 pt-2">
              {/* Main Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                id="login-submit"
                className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                style={{
                  background: config.btnGradient,
                  color: '#fff',
                  boxShadow: config.btnShadow,
                }}
              >
                {isLoading && (
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                Sign In to Dashboard
              </button>

              {/* Instant Demo Login */}
              <button
                type="button"
                id="demo-login"
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
                className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: 'rgba(15,23,42,0.04)',
                  border: '1px solid rgba(15,23,42,0.10)',
                  color: '#475569',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(15,23,42,0.08)';
                  (e.currentTarget as HTMLButtonElement).style.color = '#0f172a';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(15,23,42,0.04)';
                  (e.currentTarget as HTMLButtonElement).style.color = '#475569';
                }}
              >
                Instant Demo Login
              </button>
            </div>
          </form>
        </div>

        {/* Alternate Portals Link */}
        <div className="mt-8 text-center text-xs space-y-3" style={{ color: '#94a3b8' }}>
          <p>
            Need a different portal?{' '}
            <span className="inline-flex gap-2 font-medium">
              {Object.entries(ROLE_CONFIGS)
                .filter(([k]) => k !== roleKey && k !== 'admin')
                .map(([k, cfg]) => (
                  <Link
                    key={k}
                    href={`/login/${k}`}
                    className="capitalize transition-colors"
                    style={{ color: cfg.accentColor }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none')}
                  >
                    {k.charAt(0).toUpperCase() + k.slice(1)}
                  </Link>
                ))}
            </span>
          </p>
          <p>
            New to FoodShare AI?{' '}
            <Link
              href="/register"
              className="font-medium underline transition-colors"
              style={{ color: '#475569' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#0f172a')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#475569')}
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
