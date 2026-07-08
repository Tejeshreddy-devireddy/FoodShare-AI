'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, ShieldCheck, UserCog, Monitor, Map,
  Brain, FileText, Sliders, ScrollText, LogOut
} from 'lucide-react';

const navLinks = [
  { href: '/dashboard/admin', label: 'Global Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/admin/users', label: 'User Management', icon: Users },
  { href: '/dashboard/admin/verify', label: 'Verifications', icon: ShieldCheck },
  { href: '/dashboard/admin/roles', label: 'Role Management', icon: UserCog },
  { href: '/dashboard/admin/monitoring', label: 'Donation Monitoring', icon: Monitor },
  { href: '/dashboard/admin/map', label: 'Live Map', icon: Map },
  { href: '/dashboard/admin/ai', label: 'AI Insights', icon: Brain },
  { href: '/dashboard/admin/reports', label: 'Reports', icon: FileText },
  { href: '/dashboard/admin/settings', label: 'Platform Settings', icon: Sliders },
  { href: '/dashboard/admin/logs', label: 'System Logs', icon: ScrollText },
];

const ACCENT = { color: '#7c3aed', bg: 'rgba(124,58,237,0.10)', border: 'rgba(124,58,237,0.20)', glow: 'rgba(124,58,237,0.04)' };

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
        <div className="mt-3">
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ backgroundColor: ACCENT.bg, color: ACCENT.color, border: `1px solid ${ACCENT.border}` }}
          >
            Admin
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
              style={{
                backgroundColor: isActive ? ACCENT.bg : 'transparent',
                color: isActive ? ACCENT.color : '#475569',
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FFF5EE', color: '#0f172a' }}>
      {/* Volumetric background lights */}
      <div className="fixed top-[-15%] left-[10%] rounded-full pointer-events-none z-0" style={{ width: '600px', height: '600px', backgroundColor: ACCENT.glow, filter: 'blur(160px)' }} />
      <div className="fixed top-[25%] right-[-10%] rounded-full pointer-events-none z-0" style={{ width: '500px', height: '500px', backgroundColor: 'rgba(16,185,129,0.04)', filter: 'blur(140px)' }} />
      <Sidebar />
      <main className="flex-1 p-6 z-10 relative">{children}</main>
    </div>
  );
}
