'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface UserApprovalsProps {
  handleVerifyNgo: (id: string) => Promise<void>;
}

export function UserApprovals({ handleVerifyNgo }: UserApprovalsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          NGO Verifications
        </CardTitle>
        <CardDescription>Review registration numbers and activate pending NGO storage capabilities.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-xl flex justify-between items-center" style={{ backgroundColor: 'rgba(255,255,255,0.70)', border: '1px solid rgba(15,23,42,0.08)' }}>
          <div>
            <p className="text-sm font-bold" style={{ color: '#0f172a' }}>United Food Bank Bangalore</p>
            <p className="text-xs font-mono" style={{ color: '#94a3b8' }}>Reg: IN-BGL-830219</p>
          </div>
          <Button size="sm" onClick={() => handleVerifyNgo('ngo_id_here')}>
            Verify & Activate
          </Button>
        </div>
        <p className="text-[10px]" style={{ color: '#94a3b8' }}>All registered NGO details undergo structural licensing audits.</p>
      </CardContent>
    </Card>
  );
}
export default UserApprovals;
