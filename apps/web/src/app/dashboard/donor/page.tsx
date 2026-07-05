'use client';

import React, { useState, useEffect } from 'react';
import { DonorStats } from '@/features/donor/components/DonorStats';
import { DonationForm } from '@/features/donor/components/DonationForm';
import { getCurrentUser } from '@/lib/api';

export default function DonorDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  return (
    <div className="space-y-8" id="donor-dashboard-root">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Donor Command Center</h1>
        <p className="text-zinc-400 text-sm mt-1">Publish surplus food, review AI quality scores, and inspect sustainability badges.</p>
      </div>

      {/* Extracted Stats Feature */}
      <DonorStats currentUser={currentUser} />

      {/* Extracted Donation Listing & AI Scanner Form Feature */}
      <DonationForm />
    </div>
  );
}
