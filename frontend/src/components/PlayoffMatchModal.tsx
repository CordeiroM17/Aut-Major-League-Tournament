import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CHAMP_ICON_URL, PlayerRow } from './PlayerRow';

interface PlayoffGame {
  team1Players: any[];
  team2Players: any[];
  team1Bans: string[];
  team2Bans: string[];
  score1: number;
  score2: number;
  winnerId: string;
}

interface Team {
  id: string;
  name: string;
  logo: string;
}

interface PlayoffMatchModalProps {
  open: boolean;
  onClose: () => void;
  team1: Team;
  team2: Team;
  games: PlayoffGame[];
}

export const PlayoffMatchModal: React.FC<PlayoffMatchModalProps> = ({ open, onClose, team1, team2, games }) => {
  const [gameIndex, setGameIndex] = useState(0);
  if (!open || !games || games.length === 0) return null;
  const game = games[gameIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-secondary/90 backdrop-blur-sm">
      <div className="bg-blue-surface w-full max-w-2xl rounded-2xl border-2 border-gold shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 sm:right-4 sm:top-4 p-2 text-gold hover:text-text-main hover:cursor-pointer transition-colors z-10 text-3xl font-bold"
        >
          <X className="w-7 h-7" />
        </button>
        <div className="p-6">
          {/* Game Selector */}
          <div className="flex items-center justify-center mb-4 gap-4">
            <button
              className="text-gold px-2 py-1 rounded-full border border-gold bg-blue-header disabled:opacity-40"
              onClick={() => setGameIndex(i => Math.max(0, i - 1))}
              disabled={gameIndex === 0}
            >
              &#8592;
            </button>
            <span className="text-gold font-bold text-lg">Game {gameIndex + 1}</span>
            <button
              className="text-gold px-2 py-1 rounded-full border border-gold bg-blue-header disabled:opacity-40"
              onClick={() => setGameIndex(i => Math.min(games.length - 1, i + 1))}
              disabled={gameIndex === games.length - 1}
            >
              &#8594;
            </button>
          </div>
          {/* Teams and Score */}
          <div className="grid grid-cols-3 items-center mb-6 gap-4">
            <div className="flex flex-col items-center text-center">
              <img src={team1.logo} className="w-14 h-14 sm:w-20 sm:h-20 rounded-full mb-2 border-2 border-gold object-cover bg-blue-header" alt="" />
              <p className="text-[10px] sm:text-xs font-black uppercase text-text-main w-full truncate px-1">{team1.name}</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="text-2xl sm:text-4xl font-black text-gold whitespace-nowrap">
                {game.score1} <span className="mx-2 text-gold">:</span> {game.score2}
              </div>
            </div>
            <div className="flex flex-col items-center text-center">
              <img src={team2.logo} className="w-14 h-14 sm:w-20 sm:h-20 rounded-full mb-2 border-2 border-gold object-cover bg-blue-header" alt="" />
              <p className="text-[10px] sm:text-xs font-black uppercase text-text-main w-full truncate px-1">{team2.name}</p>
            </div>
          </div>
          {/* Bans */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 items-center mb-6">
            <div className="flex flex-wrap gap-2 justify-end content-start">
              {game.team1Bans?.map((ban, i) => (
                <img key={i} alt={ban} className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 border-gold shadow-md bg-blue-header" src={CHAMP_ICON_URL(ban)} />
              ))}
              {(!game.team1Bans || game.team1Bans.length === 0) && <span className="text-xs text-text-main italic">Sin bans</span>}
            </div>
            <div className="flex justify-center">
              <span className="text-[10px] w-8 text-center sm:text-xs font-bold text-gold uppercase tracking-wider bg-blue-header px-1 py-0.5 rounded border border-gold">
                BAN
              </span>
            </div>
            <div className="flex flex-wrap gap-2 justify-start content-start">
              {game.team2Bans?.map((ban, i) => (
                <img key={i} alt={ban} className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 border-gold shadow-md bg-blue-header" src={CHAMP_ICON_URL(ban)} />
              ))}
              {(!game.team2Bans || game.team2Bans.length === 0) && <span className="text-xs text-text-main italic">Sin bans</span>}
            </div>
          </div>
          {/* Players */}
          <div className="space-y-3">
            {game.team1Players.map((p1, i) => {
              const p2 = game.team2Players[i];
              return (
                <div key={i} className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 items-center">
                  <div className="scrollbar-hide overflow-visible">
                    <PlayerRow player={p1} align="right" />
                  </div>
                  <div className="flex justify-center items-center">
                    {/* Aquí puedes poner el icono del rol si lo tienes en p1.role */}
                  </div>
                  <div className="scrollbar-hide overflow-visible">
                    {p2 && <PlayerRow player={p2} align="left" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
