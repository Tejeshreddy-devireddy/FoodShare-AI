'use client';

import React from 'react';
import { Inbox, CheckCircle } from 'lucide-react';

interface NgoInventoryProps {
  myClaims: any[];
}

export function NgoInventory({ myClaims }: NgoInventoryProps) {
  return (
    <div className="space-y-6" id="inventory">
      <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: '#0f172a' }}>
        <CheckCircle className="w-5 h-5 text-emerald-500" />
        Claimed Inventory
      </h3>

      {myClaims.length === 0 ? (
        <div
          className="text-center py-10 rounded-2xl"
          style={{
            backgroundColor: 'rgba(255, 252, 249, 0.85)',
            border: '1px solid rgba(15,23,42,0.08)',
            boxShadow: '0 4px 20px rgba(15,23,42,0.06)',
          }}
        >
          <Inbox className="w-10 h-10 mx-auto mb-2" style={{ color: '#cbd5e1' }} />
          <p className="text-xs" style={{ color: '#94a3b8' }}>You have no active claims or pickups.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myClaims.map((claim) => (
            <div
              key={claim._id}
              className="p-4 rounded-xl space-y-3"
              style={{
                backgroundColor: 'rgba(255,255,255,0.80)',
                border: '1px solid rgba(15,23,42,0.08)',
                boxShadow: '0 2px 10px rgba(15,23,42,0.05)',
              }}
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono uppercase" style={{ color: '#94a3b8' }}>Task ID: ...{claim._id.slice(-6)}</span>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase"
                  style={{ backgroundColor: 'rgba(16,185,129,0.10)', color: '#059669', border: '1px solid rgba(16,185,129,0.20)' }}
                >
                  {claim.status}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: '#94a3b8' }}>NGO Destination Delivery</p>
                <p className="text-sm font-bold mt-0.5" style={{ color: '#0f172a' }}>{claim.donation?.donor?.name || 'Local Kitchen Partner'}</p>
              </div>
              <div
                className="flex justify-between text-xs font-mono pt-2 border-t"
                style={{ color: '#94a3b8', borderColor: 'rgba(15,23,42,0.08)' }}
              >
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
