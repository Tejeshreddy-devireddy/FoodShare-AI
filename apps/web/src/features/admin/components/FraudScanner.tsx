'use client';

import React from 'react';
import { ShieldAlert, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface FraudScannerProps {
  fraudFlags: any[];
}

export function FraudScanner({ fraudFlags }: FraudScannerProps) {
  return (
    <Card id="fraud">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
          AI Fraud Scanner
        </CardTitle>
        <CardDescription>Visual patterns flagged by platform verification triggers.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {fraudFlags?.map((flag: any) => (
          <div key={flag.id} className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="flex gap-2 items-center">
                <span className="text-xs font-bold text-white">{flag.type}</span>
                <span className="text-[9px] font-bold uppercase font-mono px-2 py-0.5 bg-red-500/10 text-red-400 rounded">
                  {flag.severity}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">{flag.description}</p>
              <p className="text-[10px] text-zinc-500 font-mono mt-1">User: {flag.user}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
export default FraudScanner;
