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
        <div className="p-4 bg-zinc-950/40 border border-zinc-900 rounded-xl flex justify-between items-center">
          <div>
            <p className="text-sm font-bold text-white">United Food Bank Bangalore</p>
            <p className="text-xs text-zinc-500 font-mono">Reg: IN-BGL-830219</p>
          </div>
          <Button size="sm" onClick={() => handleVerifyNgo('ngo_id_here')}>
            Verify & Activate
          </Button>
        </div>
        <p className="text-[10px] text-zinc-500">All registered NGO details undergo structural licensing audits.</p>
      </CardContent>
    </Card>
  );
}
export default UserApprovals;
