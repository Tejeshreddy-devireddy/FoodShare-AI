'use client';

import React from 'react';
import Link from 'next/link';

function Sidebar() {
  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-900 p-4 min-h-screen">
      <div className="mb-6 font-bold text-white">Volunteer</div>
      <nav className="flex flex-col gap-2 text-sm text-zinc-300">
        <Link href="/dashboard/volunteer">Overview</Link>
        <Link href="/dashboard/volunteer/assigned">Assigned Pickups</Link>
        <Link href="/dashboard/volunteer/navigation">Live Navigation</Link>
        <Link href="/dashboard/volunteer/verify">Pickup Verification</Link>
        <Link href="/dashboard/volunteer/deliveries">Delivery Confirmation</Link>
        <Link href="/dashboard/volunteer/proof">Upload Proof</Link>
        <Link href="/dashboard/volunteer/route">Route Optimization</Link>
        <Link href="/dashboard/volunteer/rewards">Rewards & Badges</Link>
        <Link href="/dashboard/volunteer/history">Activity History</Link>
        <Link href="/dashboard/volunteer/settings">Profile & Settings</Link>
      </nav>
    </aside>
  );
}

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#030303] text-white flex">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
