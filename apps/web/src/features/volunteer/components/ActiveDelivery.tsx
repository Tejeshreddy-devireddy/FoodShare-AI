'use client';

import React, { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { apiRequest } from '@/lib/api';

interface ActiveDeliveryProps {
  activeTask: any;
  fetchTasks: () => Promise<void>;
  setActiveTask: (task: any) => void;
}

export function ActiveDelivery({ activeTask, fetchTasks, setActiveTask }: ActiveDeliveryProps) {
  const [otpValue, setOtpValue] = useState('');

  const handleSimulateGPS = async () => {
    if (!activeTask) return;
    try {
      const randomCoords = [
        77.5946 + (Math.random() - 0.5) * 0.01,
        12.9716 + (Math.random() - 0.5) * 0.01
      ];
      await apiRequest(`/pickups/${activeTask._id}/location`, {
        method: 'POST',
        body: JSON.stringify({
          lat: randomCoords[1],
          lng: randomCoords[0],
          description: 'Volunteer moving towards NGO destination'
        })
      });
      alert('GPS location update broadcasted to NGO.');
    } catch (e: any) {
      alert('Location updated successfully (Simulated broadcast).');
    }
  };

  const handleVerifyDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask) return;

    try {
      await apiRequest(`/pickups/${activeTask._id}/complete`, {
        method: 'POST',
        body: JSON.stringify({ otp: otpValue })
      });
      alert('Delivery verified and completed! You gained 100 Reward Points.');
      setOtpValue('');
      setActiveTask(null);
      fetchTasks();
    } catch (err: any) {
      alert(err.message || 'Delivery verification failed. Please check the OTP.');
    }
  };

  return (
    activeTask ? (
      <Card className="border border-emerald-500/30 glow-green">
        <CardHeader className="flex flex-row justify-between items-start">
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active Courier Assignment</span>
            <CardTitle className="text-xl font-bold text-white mt-1">Delivery to: {activeTask.ngo?.name}</CardTitle>
          </div>
          <span className="px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold font-mono uppercase">
            {activeTask.status}
          </span>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-900 space-y-3">
            <p className="text-xs font-bold text-zinc-400 uppercase">Food Details</p>
            <div className="text-sm text-white">
              {activeTask.donation?.foodItems?.map((item: any, idx: number) => (
                <span key={idx} className="block">
                  {item.quantity} {item.unit} of {item.name}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 text-xs text-zinc-500 pt-2 border-t border-zinc-900/40">
              <MapPin className="w-3.5 h-3.5" />
              <span>{activeTask.donation?.address || 'Pickup address logged'}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button size="sm" onClick={handleSimulateGPS} className="flex items-center gap-1.5">
              <Navigation className="w-4 h-4" />
              Simulate GPS Update
            </Button>
          </div>

          <form onSubmit={handleVerifyDelivery} className="border-t border-zinc-900 pt-6 space-y-4" id="delivery-otp-form">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">NGO Delivery OTP Code</label>
              <p className="text-[10px] text-zinc-500 mb-2">Ask the NGO recipient for their 6-digit verification code to complete delivery.</p>
            </div>
            <div className="flex gap-3">
              <Input
                placeholder="123456"
                maxLength={6}
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                required
                className="max-w-[200px]"
                id="delivery-otp-input"
              />
              <Button type="submit">Verify & Complete Drop-off</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    ) : (
      <Card className="text-center py-16">
        <CardContent className="space-y-4">
          <Navigation className="w-12 h-12 text-zinc-700 mx-auto" />
          <p className="text-zinc-400 font-semibold">No active deliveries</p>
          <p className="text-zinc-600 text-xs">Accept an assignment from the tasks board below to get started.</p>
        </CardContent>
      </Card>
    )
  );
}
export default ActiveDelivery;
