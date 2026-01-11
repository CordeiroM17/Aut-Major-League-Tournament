import React from 'react';
import { X, Swords } from 'lucide-react';
import { Match, Team } from '../types';
import { PlayerRow } from './PlayerRow';

interface MatchModalProps {
  match: Match | null;
  teams: Team[];
  onClose: () => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({ match, teams, onClose }) => {
  if (!match) return null;

  const getTeamById = (id: string) => teams.find(t => t.id === id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:cursor-pointer transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="p-8">
          <div className="flex items-center justify-center space-x-8 mb-10">
            <div className="text-center">
              <img src={getTeamById(match.team1Id)?.logo} className="w-16 h-16 rounded-full mx-auto mb-2 border border-slate-200" alt="" />
              <p className="text-sm font-black uppercase text-slate-900">{getTeamById(match.team1Id)?.name}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-black text-indigo-600">{match.score1} : {match.score2}</div>
              <Swords className="w-6 h-6 text-slate-300 mt-2" />
            </div>
            <div className="text-center">
              <img src={getTeamById(match.team2Id)?.logo} className="w-16 h-16 rounded-full mx-auto mb-2 border border-slate-200" alt="" />
              <p className="text-sm font-black uppercase text-slate-900">{getTeamById(match.team2Id)?.name}</p>
            </div>
          </div>

          {match.details ? (
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                {match.details.team1Players.map((p, i) => <PlayerRow key={i} player={p} align="right" />)}
              </div>
              <div className="space-y-4">
                {match.details.team2Players.map((p, i) => <PlayerRow key={i} player={p} align="left" />)}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-xl">
              <p className="text-slate-400 font-bold uppercase tracking-widest italic">Estadísticas detalladas no disponibles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
