'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { ActiveDelivery } from '@/features/volunteer/components/ActiveDelivery';
import { VolunteerBoard } from '@/features/volunteer/components/VolunteerBoard';
import { VolunteerRewards } from '@/features/volunteer/components/VolunteerRewards';
import { apiRequest } from '@/lib/api';

export default function VolunteerDashboard() {
  const [pickups, setPickups] = useState<any[]>([]);
  const [activeTask, setActiveTask] = useState<any>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await apiRequest('/pickups');
      setPickups(res);
      const active = res.find((p: any) => p.status === 'assigned' || p.status === 'in_transit' || p.status === 'picked_up');
      if (active) setActiveTask(active);
    } catch (e: any) {
      setError(e.message || 'Error loading volunteer tasks');
      setPickups([
        {
          _id: 'pk_1',
          status: 'pending',
          verificationOtp: '839201',
          donation: {
            address: 'Mariott Hotel Grand Kitchen, Bangalore',
            foodItems: [{ name: 'Rice and Chicken Curry', quantity: 45, unit: 'servings', foodType: 'non-veg' }]
          },
          ngo: { name: 'Feeding Hands NGO' }
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAcceptTask = async (task: any) => {
    try {
      await apiRequest(`/pickups/${task._id}/assign`, { method: 'POST' });
      fetchTasks();
    } catch (e: any) {
      alert(e.message || 'Could not assign task');
    }
  };

  return (
    <div className="space-y-8" id="volunteer-dashboard-root">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Courier Hub</h1>
        <p className="text-zinc-400 text-sm mt-1">Accept live delivery tasks, view routes, and complete drop-offs.</p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Extracted Active Delivery Routing & OTP check Feature */}
          <ActiveDelivery activeTask={activeTask} fetchTasks={fetchTasks} setActiveTask={setActiveTask} />
          
          {/* Extracted Tasks Board Feature */}
          <VolunteerBoard pickups={pickups} handleAcceptTask={handleAcceptTask} />
        </div>
        <div>
          {/* Extracted Star Badge Point Metrics Feature */}
          <VolunteerRewards />
        </div>
      </div>
    </div>
  );
}
