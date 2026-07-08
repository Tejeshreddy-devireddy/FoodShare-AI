'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getCurrentUser } from '@/lib/api';
import {
  LayoutDashboard, PlusCircle, List, Activity, History, Sparkles,
  Upload, QrCode, Truck, Award, BarChart3, Settings, LogOut
} from 'lucide-react';

const navLinks = [
  { href: '/dashboard/donor', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/donor/create', label: 'Create Donation', icon: PlusCircle },
  { href: '/dashboard/donor/my-donations', label: 'My Donations', icon: List },
  { href: '/dashboard/donor/active', label: 'Active Donations', icon: Activity },
  { href: '/dashboard/donor/history', label: 'Donation History', icon: History },
  { href: '/dashboard/donor/ai', label: 'AI Food Analysis', icon: Sparkles },
  { href: '/dashboard/donor/upload', label: 'Upload Media', icon: Upload },
  { href: '/dashboard/donor/qr', label: 'QR Codes', icon: QrCode },
  { href: '/dashboard/donor/pickups', label: 'Pickup Requests', icon: Truck },
  { href: '/dashboard/donor/certificates', label: 'Certificates', icon: Award },
  { href: '/dashboard/donor/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/donor/settings', label: 'Profile & Settings', icon: Settings },
];

function Sidebar() {
  const pathname = usePathname();
  return (
    <aside
      className="w-64 min-h-screen flex flex-col"
      style={{
        backgroundColor: 'rgba(255, 252, 249, 0.90)',
        borderRight: '1px solid rgba(15,23,42,0.08)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(15,23,42,0.07)' }}>
        <Link href="/" className="flex items-center gap-2 font-extrabold text-base" style={{ color: '#0f172a' }}>
          <img src="/logo.png" className="w-8 h-8 rounded-lg object-cover" style={{ border: '1px solid rgba(15,23,42,0.10)' }} alt="Logo" />
          <span>
            FoodShare{' '}
            <span className="bg-clip-text text-transparent font-black" style={{ backgroundImage: 'linear-gradient(135deg, #10b981, #0ea5e9)' }}>AI</span>
          </span>
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgba(16,185,129,0.10)', color: '#059669', border: '1px solid rgba(16,185,129,0.20)' }}
          >
            Donor
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: isActive ? 'rgba(16,185,129,0.10)' : 'transparent',
                color: isActive ? '#059669' : '#475569',
                fontWeight: isActive ? '600' : '500',
              }}
              onMouseEnter={(e) => { if (!isActive) { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(15,23,42,0.04)'; (e.currentTarget as HTMLAnchorElement).style.color = '#0f172a'; } }}
              onMouseLeave={(e) => { if (!isActive) { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = '#475569'; } }}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t" style={{ borderColor: 'rgba(15,23,42,0.07)' }}>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ color: '#94a3b8' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#0f172a'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8'; }}
        >
          <LogOut className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </aside>
  );
}

export default function DonorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FFF5EE', color: '#0f172a' }}>
      {/* Volumetric background lights */}
      <div className="fixed top-[-15%] left-[10%] rounded-full pointer-events-none z-0" style={{ width: '600px', height: '600px', backgroundColor: 'rgba(16,185,129,0.05)', filter: 'blur(160px)' }} />
      <div className="fixed top-[25%] right-[-10%] rounded-full pointer-events-none z-0" style={{ width: '500px', height: '500px', backgroundColor: 'rgba(251,191,36,0.04)', filter: 'blur(140px)' }} />
      <Sidebar />
      <main className="flex-1 p-6 z-10 relative">{children}</main>
    </div>
  );
}
