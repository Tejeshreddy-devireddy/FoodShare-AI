'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCcw, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DonationFeed } from '@/features/ngo/components/DonationFeed';
import { NgoInventory } from '@/features/ngo/components/NgoInventory';
import { apiRequest } from '@/lib/api';

export default function NgoDashboard() {
  const [donations, setDonations] = useState<any[]>([]);
  const [myClaims, setMyClaims] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const allDons = await apiRequest('/donations?status=available');
      setDonations(allDons);

      const pickups = await apiRequest('/pickups');
      setMyClaims(pickups);
    } catch (e: any) {
      setError(e.message || 'Error fetching dashboard data');
      // Dev Mocks fallback
      setDonations([
        {
          _id: 'don_1',
          donor: { name: 'Mariott Hotel Grand Kitchen', donorDetails: { organizationType: 'Hotel' } },
          foodItems: [{ name: 'Rice and Chicken Curry', quantity: 45, unit: 'servings', foodType: 'non-veg' }],
          freshnessScore: 94,
          shelfLifeHours: 16,
          address: 'Outer Ring Road, Bellandur, Bangalore',
          status: 'available',
          createdAt: new Date().toISOString()
        },
        {
          _id: 'don_2',
          donor: { name: 'Daily Crust Bakery', donorDetails: { organizationType: 'Bakery' } },
          foodItems: [{ name: 'Assorted Bread rolls and Croissants', quantity: 15, unit: 'kg', foodType: 'veg' }],
          freshnessScore: 88,
          shelfLifeHours: 12,
          address: 'Koramangala 4th Block, Bangalore',
          status: 'available',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleClaim = async (donationId: string) => {
    try {
      await apiRequest(`/donations/${donationId}/claim`, { method: 'POST' });
      await apiRequest('/pickups', {
        method: 'POST',
        body: JSON.stringify({ donationId })
      });
      fetchDashboardData();
    } catch (e: any) {
      alert(e.message || 'Failed to claim donation');
    }
  };

  return (
    <div className="space-y-8" id="ngo-dashboard-root">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">NGO Command Center</h1>
          <p className="text-zinc-400 text-sm mt-1">Review active surplus listings, accept donations, and dispatch volunteer couriers.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchDashboardData} disabled={isLoading}>
          <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Reload Feed
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Extracted Donation Feed Feature */}
          <DonationFeed donations={donations} handleClaim={handleClaim} />
        </div>
        <div>
          {/* Extracted NGO Claim Inventory Feature */}
          <NgoInventory myClaims={myClaims} />
        </div>
      </div>
    </div>
  );
}
