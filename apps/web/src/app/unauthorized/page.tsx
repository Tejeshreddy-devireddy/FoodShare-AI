'use client';

import React from 'react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-white">
      <div className="p-8 bg-zinc-950 rounded-2xl border border-zinc-800 text-center">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p className="mt-2 text-zinc-400">You do not have access to this section.</p>
        <div className="mt-4">
          <Link href="/dashboard" className="text-emerald-400">Go to your dashboard</Link>
        </div>
      </div>
    </div>
  );
}
