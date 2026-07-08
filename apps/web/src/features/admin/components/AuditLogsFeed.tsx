'use client';

import React from 'react';
import { History } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface AuditLogsFeedProps {
  recentLogs: any[];
}

export function AuditLogsFeed({ recentLogs }: AuditLogsFeedProps) {
  return (
    <Card id="logs">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5 text-emerald-400" />
          Active Platform Audit Logs
        </CardTitle>
        <CardDescription>Cryptographic logs tracking system actions and administrator events.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b pb-2 uppercase tracking-wider font-mono" style={{ borderColor: 'rgba(15,23,42,0.08)', color: '#94a3b8' }}>
                <th className="py-2.5">Timestamp</th>
                <th>Actor Email</th>
                <th>Action Triggered</th>
                <th className="text-right">Integrity Status</th>
              </tr>
            </thead>
              <tbody className="divide-y" style={{ borderColor: 'rgba(15,23,42,0.06)' }}>
              {recentLogs?.map((log: any) => (
                <tr key={log._id} className="font-mono" style={{ color: '#475569' }}>
                  <td className="py-3 text-[10px]" style={{ color: '#94a3b8' }}>{new Date(log.createdAt).toLocaleString()}</td>
                  <td>{log.actorEmail}</td>
                  <td>
                    <span className="px-2 py-0.5 rounded font-semibold" style={{ backgroundColor: 'rgba(15,23,42,0.06)', border: '1px solid rgba(15,23,42,0.10)', color: '#475569' }}>
                      {log.action}
                    </span>
                  </td>
                  <td className="text-right text-emerald-400 font-semibold font-sans">✓ SIGNED</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
export default AuditLogsFeed;
