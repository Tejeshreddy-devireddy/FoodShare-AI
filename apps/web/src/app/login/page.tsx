'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiRequest, setAuthToken, setCurrentUser } from '@/lib/api';

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

      // Save credentials
      setAuthToken(res.accessToken);
      setCurrentUser(res.user);

      // Redirect based on role
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
        router.push('/dashboard/admin'); // Fallback for government/CSR
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[100px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl tracking-tight text-white mb-6">
          <img src="/logo.png" className="w-14 h-14 rounded-xl border border-zinc-800 object-cover" alt="FoodShare AI Logo" />
          <span>FoodShare <span className="text-emerald-400">AI</span></span>
        </Link>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Sign in to your account</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Or{' '}
          <Link href="/register" className="font-medium text-emerald-400 hover:text-emerald-300">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="glass-card py-8 px-10 rounded-2xl shadow-xl border border-zinc-800/80">
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
                />

                <Input
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
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400">
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
                />
              </div>
            )}

            <div className="space-y-4">
              <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
                Sign In
              </Button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-zinc-900"></div>
                <span className="flex-shrink mx-4 text-zinc-500 text-[10px] uppercase tracking-wider font-bold">Or Quick Demo</span>
                <div className="flex-grow border-t border-zinc-900"></div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('gs_token', 'demo-token-12345');
                    localStorage.setItem('gs_user', JSON.stringify({ name: 'Demo Donor', email: 'demo-donor@foodshare.org', role: 'Donor' }));
                    document.cookie = 'gs_role=Donor; path=/';
                    router.push('/dashboard/donor');
                  }}
                  variant="outline"
                  className="w-full text-[11px] h-9 border-zinc-800/80 hover:bg-emerald-500/10 hover:text-emerald-400 font-bold transition-all rounded-xl"
                >
                  Donor Demo
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('gs_token', 'demo-token-12345');
                    localStorage.setItem('gs_user', JSON.stringify({ name: 'Demo NGO', email: 'demo-ngo@foodshare.org', role: 'NGO' }));
                    document.cookie = 'gs_role=NGO; path=/';
                    router.push('/dashboard/ngo');
                  }}
                  variant="outline"
                  className="w-full text-[11px] h-9 border-zinc-800/80 hover:bg-sky-500/10 hover:text-sky-400 font-bold transition-all rounded-xl"
                >
                  NGO Demo
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('gs_token', 'demo-token-12345');
                    localStorage.setItem('gs_user', JSON.stringify({ name: 'Demo Volunteer', email: 'demo-volunteer@foodshare.org', role: 'Volunteer' }));
                    document.cookie = 'gs_role=Volunteer; path=/';
                    router.push('/dashboard/volunteer');
                  }}
                  variant="outline"
                  className="w-full text-[11px] h-9 border-zinc-800/80 hover:bg-amber-500/10 hover:text-amber-400 font-bold transition-all rounded-xl"
                >
                  Volunteer Demo
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('gs_token', 'demo-token-12345');
                    localStorage.setItem('gs_user', JSON.stringify({ name: 'Demo Admin', email: 'demo-admin@foodshare.org', role: 'Admin' }));
                    document.cookie = 'gs_role=Admin; path=/';
                    router.push('/dashboard/admin');
                  }}
                  variant="outline"
                  className="w-full text-[11px] h-9 border-zinc-800/80 hover:bg-violet-500/10 hover:text-violet-400 font-bold transition-all rounded-xl"
                >
                  Admin Demo
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
