'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { apiRequest } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Donor');
  
  // Conditional details
  const [orgType, setOrgType] = useState('Restaurant');
  const [license, setLicense] = useState('');
  const [regNum, setRegNum] = useState('');
  const [capacity, setCapacity] = useState('100');

  // OTP Validation Modal state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [mockOtp, setMockOtp] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const payload: any = {
      name,
      email,
      password,
      role,
      location: {
        type: 'Point',
        coordinates: [77.5946, 12.9716] // Default geo coordinates (e.g. Bangalore center)
      }
    };

    if (role === 'Donor') {
      payload.donorDetails = { organizationType: orgType, businessLicense: license };
    } else if (role === 'NGO') {
      payload.ngoDetails = { registrationNumber: regNum, capacity: Number(capacity), preferredFoodTypes: ['veg', 'cooked'] };
    }

    try {
      const res = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.verificationRequired) {
        setOtpSent(true);
        setMockOtp(res.otpMock);
      } else {
        router.push('/login');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await apiRequest('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, code: otpCode })
      });
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[100px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl tracking-tight text-white mb-6">
          <img src="/logo.png" className="w-14 h-14 rounded-xl border border-zinc-800 object-cover" alt="FoodShare AI Logo" />
          <span>FoodShare <span className="text-emerald-400">AI</span></span>
        </Link>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Create your account</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Already registered?{' '}
          <Link href="/login" className="font-medium text-emerald-400 hover:text-emerald-300">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="glass-card py-8 px-10 rounded-2xl shadow-xl border border-zinc-800/80">
          
          {error && (
            <div className="mb-4 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!otpSent ? (
            <form className="space-y-4" onSubmit={handleRegisterSubmit} id="register-form">
              <Input
                label="Full Name / Organization"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                id="register-name"
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                id="register-email"
              />

              <Input
                label="Password"
                type="password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                id="register-password"
              />

              <Select
                label="Account Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                options={[
                  { value: 'Donor', label: 'Food Donor (Restaurant, Hotel, Individual)' },
                  { value: 'NGO', label: 'NGO / Food Bank' },
                  { value: 'Volunteer', label: 'Volunteer Courier' },
                  { value: 'CSR Team', label: 'Corporate CSR Representative' },
                  { value: 'Government', label: 'Government Health Inspector' }
                ]}
                id="register-role"
              />

              {/* Conditional Donor Profile */}
              {role === 'Donor' && (
                <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-3">
                  <Select
                    label="Business Category"
                    value={orgType}
                    onChange={(e) => setOrgType(e.target.value)}
                    options={[
                      { value: 'Restaurant', label: 'Restaurant' },
                      { value: 'Hotel', label: 'Hotel & Lodging' },
                      { value: 'Bakery', label: 'Bakery & Cafe' },
                      { value: 'Catering', label: 'Catering Service' },
                      { value: 'Marriage Hall', label: 'Marriage/Event Hall' },
                      { value: 'Supermarket', label: 'Supermarket' },
                      { value: 'Individual', label: 'Individual' }
                    ]}
                    id="register-donor-type"
                  />
                  <Input
                    label="Business License Number"
                    placeholder="LIC-924021"
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    required
                    id="register-donor-license"
                  />
                </div>
              )}

              {/* Conditional NGO Profile */}
              {role === 'NGO' && (
                <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-3">
                  <Input
                    label="Govt Registration Number"
                    placeholder="NGO-8240-2023"
                    value={regNum}
                    onChange={(e) => setRegNum(e.target.value)}
                    required
                    id="register-ngo-reg"
                  />
                  <Input
                    label="Storage Capacity (kg)"
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    required
                    id="register-ngo-capacity"
                  />
                </div>
              )}

              <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
                Create Account
              </Button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleOtpVerify} id="otp-form">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 flex items-start gap-3">
                <Sparkles className="w-5 h-5 shrink-0 animate-bounce" />
                <div>
                  <p className="font-semibold mb-1">Verify Email OTP</p>
                  <p>A verification code was dispatched. Enter it below to activate your account.</p>
                  <p className="mt-2 font-mono text-[10px] bg-zinc-950 px-2 py-1 rounded inline-block text-zinc-400">
                    Dev Mock OTP: <span className="text-white font-bold">{mockOtp}</span>
                  </p>
                </div>
              </div>

              <Input
                label="Enter 6-Digit OTP Code"
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required
                id="otp-code-input"
              />

              <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
                Verify & Activate
              </Button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
