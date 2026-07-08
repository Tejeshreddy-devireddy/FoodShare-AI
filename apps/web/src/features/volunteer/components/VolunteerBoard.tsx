'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface VolunteerBoardProps {
  pickups: any[];
  handleAcceptTask: (task: any) => Promise<void>;
}

export function VolunteerBoard({ pickups, handleAcceptTask }: VolunteerBoardProps) {
  const openTasks = pickups.filter((p) => !p.volunteer);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold" style={{ color: '#0f172a' }}>Live Courier Board</h3>
      {openTasks.length === 0 ? (
        <p className="text-xs" style={{ color: '#94a3b8' }}>No open pickup requests available. Check back soon!</p>
      ) : (
        <div className="space-y-3">
          {openTasks.map((task) => (
            <div key={task._id} className="p-5 rounded-2xl flex justify-between items-center transition-all" style={{ backgroundColor: 'rgba(255,252,249,0.85)', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 4px 16px rgba(15,23,42,0.05)' }}>
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase">Available Task</span>
                <h4 className="font-bold text-base mt-0.5" style={{ color: '#0f172a' }}>Pickup: {task.donation?.donor?.name || 'Partner Kitchen'}</h4>
                <p className="text-xs" style={{ color: '#64748b' }}>Deliver to: {task.ngo?.name}</p>
              </div>
              <Button size="sm" onClick={() => handleAcceptTask(task)}>
                Accept Task
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default VolunteerBoard;
