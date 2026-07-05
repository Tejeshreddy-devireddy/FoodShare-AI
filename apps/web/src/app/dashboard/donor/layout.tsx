'use client';

import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/api';

function Sidebar() {
  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-900 p-4 min-h-screen">
      <div className="mb-6 font-bold text-white">Donor</div>
      <nav className="flex flex-col gap-2 text-sm text-zinc-300">
        <Link href="/dashboard/donor">Overview</Link>
        <Link href="/dashboard/donor/create">Create Donation</Link>
        <Link href="/dashboard/donor/my-donations">My Donations</Link>
        <Link href="/dashboard/donor/active">Active Donations</Link>
        <Link href="/dashboard/donor/history">Donation History</Link>
        <Link href="/dashboard/donor/ai">AI Food Analysis</Link>
        <Link href="/dashboard/donor/upload">Upload Media</Link>
        <Link href="/dashboard/donor/qr">QR Codes</Link>
        <Link href="/dashboard/donor/pickups">Pickup Requests</Link>
        <Link href="/dashboard/donor/certificates">Certificates</Link>
        <Link href="/dashboard/donor/analytics">Analytics</Link>
        <Link href="/dashboard/donor/settings">Profile & Settings</Link>
      </nav>
    </aside>
  );
}

export default function DonorLayout({ children }: { children: React.ReactNode }) {
  const user = typeof window !== 'undefined' ? getCurrentUser() : null;
  return (
    <div className="min-h-screen bg-[#030303] text-white flex">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
