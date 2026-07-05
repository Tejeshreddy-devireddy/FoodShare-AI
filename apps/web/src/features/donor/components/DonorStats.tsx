'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Award, Leaf } from 'lucide-react';
import DashboardChart from '@/components/charts/DashboardChart';

interface DonorStatsProps {
  currentUser: any;
}

export function DonorStats({ currentUser }: DonorStatsProps) {
  const carbonImpactData = [
    { label: 'Mon', value: 12 },
    { label: 'Tue', value: 25 },
    { label: 'Wed', value: 18 },
    { label: 'Thu', value: 45 },
    { label: 'Fri', value: 30 },
    { label: 'Sat', value: 55 },
    { label: 'Sun', value: 68 }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6" id="impact">
      <DashboardChart data={carbonImpactData} title="Carbon Footprint Offset History" unit="kg CO₂" />
      
      <Card className="flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Meals Delivered</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-end">
          <p className="text-4xl font-extrabold text-white font-mono">{currentUser?.stats?.mealsSaved || 140}</p>
          <p className="text-xs text-emerald-400 font-semibold mt-1">Saved from rotting in landfills</p>
        </CardContent>
      </Card>

      <Card className="flex flex-col justify-between" id="certificates">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Green Badges & Certificates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <Award className="w-8 h-8 text-emerald-400" />
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Zero Waste Champion</p>
              <p className="text-[10px] text-zinc-400">Awarded for saving &gt; 100 meals this month</p>
            </div>
          </div>
          <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold rounded-lg text-zinc-200 border border-zinc-700 cursor-pointer">
            Download Compliance Report
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
export default DonorStats;
