'use client';

import React from 'react';
import { MapPin, Inbox, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface DonationFeedProps {
  donations: any[];
  handleClaim: (id: string) => Promise<void>;
}

export function DonationFeed({ donations, handleClaim }: DonationFeedProps) {
  return (
    <div className="space-y-6" id="feed">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-emerald-400" />
        Nearby Surplus Food Feed
      </h3>

      {donations.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="space-y-3">
            <Inbox className="w-12 h-12 text-zinc-600 mx-auto" />
            <p className="text-zinc-400 font-semibold">No food posts in your area right now</p>
            <p className="text-zinc-600 text-xs">New donations will display here automatically.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {donations.map((don) => (
            <div key={don._id} className="glass-card p-6 rounded-2xl border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-emerald-500/30 transition-colors">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-md">
                    {don.donor?.donorDetails?.organizationType || 'Donor'}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    AI Freshness: {don.freshnessScore}%
                  </span>
                </div>

                <h4 className="font-bold text-white text-lg">{don.donor?.name}</h4>
                
                <div className="text-sm text-zinc-300">
                  {don.foodItems?.map((item: any, i: number) => (
                    <span key={i}>
                      {item.quantity} {item.unit} of {item.name} ({item.foodType})
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{don.address || 'Address coordinates logged'}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full md:w-auto text-right">
                <span className="text-[10px] text-zinc-500 block font-mono">Expires in: {don.shelfLifeHours} hrs</span>
                <Button size="sm" onClick={() => handleClaim(don._id)} className="w-full md:w-auto">
                  Claim & Arrange Pickup
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default DonationFeed;
