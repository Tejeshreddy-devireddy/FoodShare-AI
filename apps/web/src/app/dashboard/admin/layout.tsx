'use client';

import React from 'react';
import Link from 'next/link';

function Sidebar() {
  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-900 p-4 min-h-screen">
      <div className="mb-6 font-bold text-white">Admin</div>
      <nav className="flex flex-col gap-2 text-sm text-zinc-300">
        <Link href="/dashboard/admin">Global Dashboard</Link>
        <Link href="/dashboard/admin/users">User Management</Link>
        <Link href="/dashboard/admin/verify">Verifications</Link>
        <Link href="/dashboard/admin/roles">Role Management</Link>
        <Link href="/dashboard/admin/monitoring">Donation Monitoring</Link>
        <Link href="/dashboard/admin/map">Live Map</Link>
        <Link href="/dashboard/admin/ai">AI Insights</Link>
        <Link href="/dashboard/admin/reports">Reports</Link>
        <Link href="/dashboard/admin/settings">Platform Settings</Link>
        <Link href="/dashboard/admin/logs">System Logs</Link>
      </nav>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#030303] text-white flex">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
