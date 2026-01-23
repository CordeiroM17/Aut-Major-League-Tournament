import React from 'react';
import { PlayerStats } from '../types';

export const CHAMP_ICON_URL = (name: string) => `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${name}.png`;

export const PlayerRow: React.FC<{ player: PlayerStats; align: 'left' | 'right' }> = ({ player, align }) => {
  const isLeft = align === 'left';

  const content = (
    <>
      <img
        src={CHAMP_ICON_URL(player.champion)}
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-slate-200 shadow-sm"
        alt={player.champion}
      />
      <a href={player.opgg} target="_blank" className={`flex flex-col sm:items-center cursor-pointer ${isLeft ? 'items-start sm:flex-row' : 'items-end sm:flex-row-reverse sm:text-right'} sm:space-x-3 sm:space-x-reverse:0`}>
        {/* Mobile: Name then KDA. Desktop: KDA then Name (depending on visual order) */}
        
        {/* Name */}
        <span className={`text-xs font-black text-text-main sm:text-sm ${isLeft ? 'order-1 sm:order-2 sm:ml-3' : 'order-1 sm:order-2 sm:mr-3'}`}>
          {player.name}
        </span>

        {/* KDA */}
        <span className={`text-[10px] text-gold font-bold sm:text-sm ${isLeft ? 'order-2 sm:order-1' : 'order-2 sm:order-1'}`}>
          {player.k}/{player.d}/{player.a}
        </span>
      </a>
    </>
  );

  return (
    <div className={`flex items-center space-x-3 ${!isLeft ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {content}
    </div>
  );
};
