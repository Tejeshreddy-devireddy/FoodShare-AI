'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, Sparkles, ArrowLeft } from 'lucide-react';
import { apiRequest } from '@/lib/api';

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

// Light-themed select component
function LightSelect({
  label,
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>
          {label}
        </label>
      )}
      <select
        className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none appearance-none"
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
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ backgroundColor: '#fff', color: '#0f172a' }}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

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
        coordinates: [77.5946, 12.9716]
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
        <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: '#0f172a' }}>Create your account</h2>
        <p className="mt-2 text-sm" style={{ color: '#64748b' }}>
          Already registered?{' '}
          <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
            Sign in here
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
          {error && (
            <div
              className="mb-4 p-3.5 rounded-xl text-xs flex items-center gap-2"
              style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', color: '#dc2626' }}
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!otpSent ? (
            <form className="space-y-4" onSubmit={handleRegisterSubmit} id="register-form">
              <LightInput
                label="Full Name / Organization"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                id="register-name"
              />

              <LightInput
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                id="register-email"
              />

              <LightInput
                label="Password"
                type="password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                id="register-password"
              />

              <LightSelect
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
                <div
                  className="p-4 rounded-xl space-y-3"
                  style={{ backgroundColor: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}
                >
                  <LightSelect
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
                  <LightInput
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
                <div
                  className="p-4 rounded-xl space-y-3"
                  style={{ backgroundColor: 'rgba(14,165,233,0.05)', border: '1px solid rgba(14,165,233,0.15)' }}
                >
                  <LightInput
                    label="Govt Registration Number"
                    placeholder="NGO-8240-2023"
                    value={regNum}
                    onChange={(e) => setRegNum(e.target.value)}
                    required
                    id="register-ngo-reg"
                  />
                  <LightInput
                    label="Storage Capacity (kg)"
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    required
                    id="register-ngo-capacity"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                id="register-submit"
                className="w-full mt-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
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
                Create Account
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleOtpVerify} id="otp-form">
              <div
                className="p-4 rounded-xl text-xs flex items-start gap-3"
                style={{ backgroundColor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)', color: '#059669' }}
              >
                <Sparkles className="w-5 h-5 shrink-0 animate-bounce" />
                <div>
                  <p className="font-semibold mb-1">Verify Email OTP</p>
                  <p>A verification code was dispatched. Enter it below to activate your account.</p>
                  <p
                    className="mt-2 font-mono text-[10px] px-2 py-1 rounded inline-block"
                    style={{ backgroundColor: 'rgba(15,23,42,0.06)', color: '#475569' }}
                  >
                    Dev Mock OTP: <span className="font-bold" style={{ color: '#0f172a' }}>{mockOtp}</span>
                  </p>
                </div>
              </div>

              <LightInput
                label="Enter 6-Digit OTP Code"
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required
                id="otp-code-input"
              />

              <button
                type="submit"
                disabled={isLoading}
                id="otp-submit"
                className="w-full mt-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
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
                Verify & Activate
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
