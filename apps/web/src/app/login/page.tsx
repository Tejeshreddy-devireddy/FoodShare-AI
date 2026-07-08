'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { apiRequest, setAuthToken, setCurrentUser } from '@/lib/api';

// Light-themed input component matching landing page aesthetics
function LightInput({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
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
          e.currentTarget.style.border = '1px solid rgba(16,185,129,0.50)';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.10)';
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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

      const role = res.user.role;
      if (role === 'Donor') {
        router.push('/dashboard/donor');
      } else if (role === 'NGO') {
        router.push('/dashboard/ngo');
      } else if (role === 'Volunteer') {
        router.push('/dashboard/volunteer');
      } else if (role === 'Admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/admin');
      }
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
        style={{ width: '600px', height: '600px', backgroundColor: 'rgba(16,185,129,0.07)', filter: 'blur(160px)' }}
      />
      <div
        className="absolute top-[25%] right-[-10%] rounded-full pointer-events-none z-0"
        style={{ width: '500px', height: '500px', backgroundColor: 'rgba(251,191,36,0.06)', filter: 'blur(140px)' }}
      />
      <div
        className="absolute bottom-[20%] left-[-15%] rounded-full pointer-events-none z-0"
        style={{ width: '700px', height: '700px', backgroundColor: 'rgba(249,115,22,0.04)', filter: 'blur(180px)' }}
      />

      {/* Logo & Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl tracking-tight mb-6" style={{ color: '#0f172a' }}>
          <img src="/logo.png" className="w-14 h-14 rounded-xl object-cover" style={{ border: '1px solid rgba(15,23,42,0.10)' }} alt="FoodShare AI Logo" />
          <span>
            FoodShare{' '}
            <span
              className="font-black bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #10b981, #0ea5e9)' }}
            >
              AI
            </span>
          </span>
        </Link>
        <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: '#0f172a' }}>Sign in to your account</h2>
        <p className="mt-2 text-sm" style={{ color: '#64748b' }}>
          Or{' '}
          <Link href="/register" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
            create a new account
          </Link>
        </p>
      </div>

      {/* Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div
          className="py-8 px-10 rounded-2xl"
          style={{
            backgroundColor: 'rgba(255, 252, 249, 0.85)',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            boxShadow: '0 8px 32px rgba(15,23,42,0.07), 0 1px 4px rgba(0,0,0,0.04)',
            backdropFilter: 'blur(16px)',
          }}
        >
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
                />
                <LightInput
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  id="login-password"
                />
              </>
            ) : (
              <div className="space-y-4">
                <div
                  className="p-3 rounded-xl text-xs"
                  style={{ backgroundColor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)', color: '#059669' }}
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
                />
              </div>
            )}

            <div className="space-y-4">
              {/* Main Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                id="login-submit"
                className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#fff',
                  boxShadow: '0 4px 16px rgba(16,185,129,0.30)',
                }}
              >
                {isLoading && (
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                Sign In
              </button>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t" style={{ borderColor: 'rgba(15,23,42,0.10)' }} />
                <span className="flex-shrink mx-4 text-[10px] uppercase tracking-wider font-bold" style={{ color: '#94a3b8' }}>Or Quick Demo</span>
                <div className="flex-grow border-t" style={{ borderColor: 'rgba(15,23,42,0.10)' }} />
              </div>

              {/* Demo Buttons */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Donor Demo', color: '#059669', hoverBg: 'rgba(16,185,129,0.12)', bg: 'rgba(16,185,129,0.07)', role: 'Donor', path: '/dashboard/donor' },
                  { label: 'NGO Demo', color: '#0284c7', hoverBg: 'rgba(14,165,233,0.12)', bg: 'rgba(14,165,233,0.07)', role: 'NGO', path: '/dashboard/ngo' },
                  { label: 'Volunteer Demo', color: '#d97706', hoverBg: 'rgba(245,158,11,0.12)', bg: 'rgba(245,158,11,0.07)', role: 'Volunteer', path: '/dashboard/volunteer' },
                  { label: 'Admin Demo', color: '#7c3aed', hoverBg: 'rgba(124,58,237,0.12)', bg: 'rgba(124,58,237,0.07)', role: 'Admin', path: '/dashboard/admin' },
                ].map((demo) => (
                  <button
                    key={demo.label}
                    type="button"
                    id={`demo-${demo.role.toLowerCase()}`}
                    onClick={() => {
                      localStorage.setItem('gs_token', 'demo-token-12345');
                      localStorage.setItem('gs_user', JSON.stringify({ name: `Demo ${demo.role}`, email: `demo-${demo.role.toLowerCase()}@foodshare.org`, role: demo.role }));
                      document.cookie = `gs_role=${demo.role}; path=/`;
                      router.push(demo.path);
                    }}
                    className="w-full text-[11px] h-9 font-bold transition-all duration-200 rounded-xl cursor-pointer"
                    style={{ backgroundColor: demo.bg, border: `1px solid ${demo.color}28`, color: demo.color }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = demo.hoverBg; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = demo.bg; }}
                  >
                    {demo.label}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
