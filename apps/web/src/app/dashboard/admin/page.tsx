'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UserApprovals } from '@/features/admin/components/UserApprovals';
import { FraudScanner } from '@/features/admin/components/FraudScanner';
import { AuditLogsFeed } from '@/features/admin/components/AuditLogsFeed';
import { apiRequest } from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAdminStats = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await apiRequest('/admin/dashboard-stats');
      setStats(data);
    } catch (e: any) {
      setError(e.message || 'Error fetching admin stats');
      // Dev mocks fallback
      setStats({
        metrics: {
          users: { total: 42, donors: 18, ngos: 12, volunteers: 12 },
          donations: { total: 105, active: 8, completed: 87 },
          sustainability: { carbonSavedKg: 2450, mealsSaved: 850, waterSavedLiters: 127500 }
        },
        recentLogs: [
          { _id: '1', action: 'USER_REGISTERED', actorEmail: 'restaurant@foodshare.com', createdAt: new Date().toISOString() },
          { _id: '2', action: 'NGO_VERIFIED', actorEmail: 'admin@foodshare.org', createdAt: new Date().toISOString() },
          { _id: '3', action: 'USER_LOGIN', actorEmail: 'volunteer@delivery.com', createdAt: new Date().toISOString() }
        ],
        fraudFlags: [
          { id: 1, type: 'Donation Spoofing', description: 'User created multiple empty food posts', user: 'donor@scam.org', severity: 'high' },
          { id: 2, type: 'Route Deviation', description: 'Volunteer path deviated from optimized route by 5.4km', user: 'vol@express.com', severity: 'medium' }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const handleVerifyNgo = async (ngoId: string) => {
    try {
      await apiRequest(`/admin/verify-ngo/${ngoId}`, { method: 'POST' });
      alert('NGO verified and activated successfully');
      fetchAdminStats();
    } catch (e: any) {
      alert(e.message || 'Verification failed');
    }
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8" id="admin-dashboard-root">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: '#0f172a' }}>Platform Command Center</h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>Audit platform logs, manage NGO approvals, and investigate fraud flags.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAdminStats} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Reload Panel
        </Button>
      </div>

      {error && (
        <div className="p-3 rounded-xl text-xs flex items-center gap-2" style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', color: '#dc2626' }}>
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metric Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>Total Users</span>
          <p className="text-2xl font-extrabold mt-1 font-mono" style={{ color: '#0f172a' }}>{stats.metrics.users.total}</p>
        </Card>
        <Card className="p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>Active Donors</span>
          <p className="text-2xl font-extrabold mt-1 font-mono" style={{ color: '#0f172a' }}>{stats.metrics.users.donors}</p>
        </Card>
        <Card className="p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>Completed Donations</span>
          <p className="text-2xl font-extrabold mt-1 font-mono" style={{ color: '#0f172a' }}>{stats.metrics.donations.completed}</p>
        </Card>
        <Card className="p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>CO₂ Offsets (kg)</span>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono">{stats.metrics.sustainability.carbonSavedKg}</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Extracted NGO approvals Feature */}
        <UserApprovals handleVerifyNgo={handleVerifyNgo} />

        {/* Extracted AI Fraud Scanner Anomaly Tracker Feature */}
        <FraudScanner fraudFlags={stats.fraudFlags} />
      </div>

      {/* Extracted Cryptographic Logs Tracker Feature */}
      <AuditLogsFeed recentLogs={stats.recentLogs} />
    </div>
  );
}
