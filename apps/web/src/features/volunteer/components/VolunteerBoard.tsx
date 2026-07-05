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
      <h3 className="text-lg font-bold text-white">Live Courier Board</h3>
      {openTasks.length === 0 ? (
        <p className="text-xs text-zinc-500">No open pickup requests available. Check back soon!</p>
      ) : (
        <div className="space-y-3">
          {openTasks.map((task) => (
            <div key={task._id} className="glass-card p-5 rounded-2xl flex justify-between items-center border border-zinc-800">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase">Available Task</span>
                <h4 className="font-bold text-white text-base mt-0.5">Pickup: {task.donation?.donor?.name || 'Partner Kitchen'}</h4>
                <p className="text-xs text-zinc-400">Deliver to: {task.ngo?.name}</p>
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
