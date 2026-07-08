'use client';

import React from 'react';
import { MapPin, Inbox, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DonationFeedProps {
  donations: any[];
  handleClaim: (id: string) => Promise<void>;
}

export function DonationFeed({ donations, handleClaim }: DonationFeedProps) {
  return (
    <div className="space-y-6" id="feed">
      <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: '#0f172a' }}>
        <ShoppingBag className="w-5 h-5 text-emerald-500" />
        Nearby Surplus Food Feed
      </h3>

      {donations.length === 0 ? (
        <div
          className="text-center py-12 rounded-2xl"
          style={{
            backgroundColor: 'rgba(255, 252, 249, 0.85)',
            border: '1px solid rgba(15,23,42,0.08)',
            boxShadow: '0 4px 20px rgba(15,23,42,0.06)',
          }}
        >
          <Inbox className="w-12 h-12 mx-auto mb-3" style={{ color: '#cbd5e1' }} />
          <p className="font-semibold text-sm" style={{ color: '#475569' }}>No food posts in your area right now</p>
          <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>New donations will display here automatically.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {donations.map((don) => (
            <div
              key={don._id}
              className="p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-200"
              style={{
                backgroundColor: 'rgba(255, 252, 249, 0.85)',
                border: '1px solid rgba(15,23,42,0.08)',
                boxShadow: '0 4px 20px rgba(15,23,42,0.06)',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(16,185,129,0.25)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(16,185,129,0.08)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(15,23,42,0.08)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(15,23,42,0.06)'; }}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: 'rgba(15,23,42,0.06)', color: '#475569' }}
                  >
                    {don.donor?.donorDetails?.organizationType || 'Donor'}
                  </span>
                  <span className="text-xs font-bold font-mono" style={{ color: '#059669' }}>
                    AI Freshness: {don.freshnessScore}%
                  </span>
                </div>

                <h4 className="font-bold text-lg" style={{ color: '#0f172a' }}>{don.donor?.name}</h4>

                <div className="text-sm" style={{ color: '#475569' }}>
                  {don.foodItems?.map((item: any, i: number) => (
                    <span key={i}>
                      {item.quantity} {item.unit} of {item.name} ({item.foodType})
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-xs" style={{ color: '#94a3b8' }}>
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{don.address || 'Address coordinates logged'}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full md:w-auto text-right">
                <span className="text-[10px] block font-mono" style={{ color: '#94a3b8' }}>Expires in: {don.shelfLifeHours} hrs</span>
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
