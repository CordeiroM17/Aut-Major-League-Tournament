import React from 'react';
import { PlayerStats } from '../types';

const CHAMP_ICON_URL = (name: string) => `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${name}.png`;

export const PlayerRow: React.FC<{ player: PlayerStats; align: 'left' | 'right' }> = ({ player, align }) => {
  const content = (
    <>
      <div className={`flex flex-col ${align === 'right' ? 'items-end' : 'items-start'}`}>
        <span className="text-[10px] font-bold text-slate-400">{player.role}</span>
        <span className="text-xs font-black text-slate-900">{player.name}</span>
        <span className="text-[10px] text-indigo-600 font-bold">{player.k}/{player.d}/{player.a}</span>
      </div>
      <img 
        src={CHAMP_ICON_URL(player.champion)} 
        className="w-10 h-10 rounded-lg border border-slate-200 shadow-sm"
        alt={player.champion}
      />
    </>
  );

  return (
    <div className={`flex items-center space-x-3 ${align === 'right' ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {content}
    </div>
  );
};
