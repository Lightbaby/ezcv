import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Profile, Language } from '../types';
import { UI_LABELS } from '../constants';

interface StatsRadarProps {
  profile: Profile;
  lang: Language;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-2 rounded border border-hud-accent text-xs">
        <p className="text-hud-accent font-bold uppercase">{label}</p>
        <p className="text-white">Level: {payload[0].value} / 100</p>
      </div>
    );
  }
  return null;
};

export const StatsRadar: React.FC<StatsRadarProps> = ({ profile, lang }) => {
  const [mounted, setMounted] = useState(false);

  // Transform stats object into array for Recharts
  // We need to re-calc this when profile changes
  const data = Object.entries(profile.stats).map(([subject, A]) => ({
    subject: subject.charAt(0).toUpperCase() + subject.slice(1),
    A,
    fullMark: 100,
  }));

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center relative">
       {/* Background Decoration */}
       <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
          <div className="w-64 h-64 border border-hud-accent rounded-full animate-pulse-slow"></div>
          <div className="absolute w-48 h-48 border border-white/20 rounded-full"></div>
       </div>

      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid gridType="polygon" stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#a3e635', fontSize: 12, fontFamily: 'Rajdhani', fontWeight: 600 }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name={profile.name}
            dataKey="A"
            stroke="#a3e635"
            strokeWidth={2}
            fill="#a3e635"
            fillOpacity={0.3}
            isAnimationActive={true}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#a3e635', strokeWidth: 1 }} />
        </RadarChart>
      </ResponsiveContainer>
      
      <div className="absolute bottom-0 text-center w-full">
        <p className="text-xs text-hud-muted uppercase tracking-widest font-display">{UI_LABELS[lang].attributes}</p>
      </div>
    </div>
  );
};
