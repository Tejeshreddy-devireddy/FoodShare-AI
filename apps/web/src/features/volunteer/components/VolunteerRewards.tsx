'use client';

import React from 'react';
import { Award, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function VolunteerRewards() {
  return (
    <div className="space-y-6" id="rewards">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <Award className="w-5 h-5 text-emerald-400" />
        Volunteer Rewards
      </h3>

      <Card>
        <CardContent className="pt-6 space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-2xl mx-auto">
            <Star className="w-8 h-8 fill-emerald-400/20" />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">Carbon Saver Level 3</h4>
            <p className="text-xs text-zinc-400 mt-1">You are in the top 5% of volunteer couriers this month.</p>
          </div>

          <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl flex justify-between items-center text-left">
            <div>
              <span className="text-[9px] text-zinc-500 uppercase block font-mono">Current points</span>
              <span className="text-xl font-bold text-white font-mono">350 pts</span>
            </div>
            <span className="text-xs text-emerald-400 font-semibold">+100 pts next delivery</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default VolunteerRewards;
