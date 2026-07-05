'use client';

import React, { useState, useEffect } from 'react';

interface ChartData {
  label: string;
  value: number;
}

interface DashboardChartProps {
  data: ChartData[];
  title: string;
  unit: string;
  colorClass?: string;
}

export default function DashboardChart({ data, title, unit, colorClass = 'stroke-emerald-500' }: DashboardChartProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(1), 100);
    return () => clearTimeout(timer);
  }, []);

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const chartHeight = 120;
  const chartWidth = 500;
  const padding = 30;

  // Convert points to SVG polyline coordinate format
  const points = data.map((d, index) => {
    const x = padding + (index / (data.length - 1)) * (chartWidth - padding * 2);
    const y = chartHeight - padding - (d.value / maxValue) * (chartHeight - padding * 2) * animatedProgress;
    return `${x},${y}`;
  }).join(' ');

  // Create area coordinates ending at bottom axis
  const areaPoints = data.length > 0 
    ? `${padding},${chartHeight - padding} ${points} ${chartWidth - padding},${chartHeight - padding}`
    : '';

  return (
    <div className="glass-card p-6 rounded-2xl glow-green" id="dashboard-chart-container">
      <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">{title}</h3>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-2xl font-bold tracking-tight text-white">
          {data[data.length - 1]?.value.toLocaleString()}
        </span>
        <span className="text-sm text-emerald-400 font-medium">{unit}</span>
      </div>

      <div className="relative h-32 w-full mt-2">
        <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
          <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
          <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

          {/* Area under the line */}
          {areaPoints && (
            <polygon
              points={areaPoints}
              fill="url(#chart-gradient)"
              className="transition-all duration-1000 ease-out"
              opacity={0.15}
            />
          )}

          {/* Sparkline path */}
          {points && (
            <polyline
              fill="none"
              className={`${colorClass} transition-all duration-1000 ease-out`}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          )}

          {/* Data Points */}
          {data.map((d, index) => {
            const x = padding + (index / (data.length - 1)) * (chartWidth - padding * 2);
            const y = chartHeight - padding - (d.value / maxValue) * (chartHeight - padding * 2) * animatedProgress;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r={4}
                className="fill-emerald-400 stroke-[#09090b] cursor-pointer hover:r-6 transition-all duration-200"
                strokeWidth={2}
              />
            );
          })}

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* X Axis Labels */}
      <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-2 px-6">
        {data.map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}
