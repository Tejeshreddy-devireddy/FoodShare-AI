'use client';

import React from 'react';
import Link from 'next/link';

function Sidebar() {
  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-900 p-4 min-h-screen">
      <div className="mb-6 font-bold text-white">NGO</div>
      <nav className="flex flex-col gap-2 text-sm text-zinc-300">
        <Link href="/dashboard/ngo">Overview</Link>
        <Link href="/dashboard/ngo/nearby">Nearby Donations</Link>
        <Link href="/dashboard/ngo/search">Search Donations</Link>
        <Link href="/dashboard/ngo/assigned">Assigned Donations</Link>
        <Link href="/dashboard/ngo/inventory">Inventory</Link>
        <Link href="/dashboard/ngo/beneficiaries">Beneficiaries</Link>
        <Link href="/dashboard/ngo/volunteers">Request Volunteers</Link>
        <Link href="/dashboard/ngo/tracking">Delivery Tracking</Link>
        <Link href="/dashboard/ngo/reports">Reports</Link>
        <Link href="/dashboard/ngo/analytics">Analytics</Link>
        <Link href="/dashboard/ngo/settings">Profile & Settings</Link>
      </nav>
    </aside>
  );
}

export default function NgoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#030303] text-white flex">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
