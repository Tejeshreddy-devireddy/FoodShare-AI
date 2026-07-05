'use client';

import React from 'react';
import { Inbox, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface NgoInventoryProps {
  myClaims: any[];
}

export function NgoInventory({ myClaims }: NgoInventoryProps) {
  return (
    <div className="space-y-6" id="inventory">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-emerald-400" />
        Claimed Inventory
      </h3>

      {myClaims.length === 0 ? (
        <Card className="text-center py-10">
          <CardContent className="space-y-2">
            <Inbox className="w-10 h-10 text-zinc-700 mx-auto" />
            <p className="text-xs text-zinc-500">You have no active claims or pickups.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {myClaims.map((claim) => (
            <div key={claim._id} className="p-4 bg-zinc-950/40 border border-zinc-900 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Task ID: ...{claim._id.slice(-6)}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full uppercase">
                  {claim.status}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-400">NGO Destination Delivery</p>
                <p className="text-sm font-bold text-white mt-0.5">{claim.donation?.donor?.name || 'Local Kitchen Partner'}</p>
              </div>
              <div className="flex justify-between text-xs text-zinc-500 border-t border-zinc-900/60 pt-2 font-mono">
                <span>OTP: {claim.verificationOtp}</span>
                <span>QR: Hash Verified</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default NgoInventory;
