import React from 'react';
import { X, Swords } from 'lucide-react';
import { Match, Team } from '../types';
import { CHAMP_ICON_URL, PlayerRow } from './PlayerRow';

interface MatchModalProps {
  match: Match | null;
  teams: Team[];
  onClose: () => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({ match, teams, onClose }) => {
  if (!match) return null;

  const getTeamById = (id: string) => teams.find(t => t.id === id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-secondary/90 backdrop-blur-sm">
      <div className="bg-blue-surface w-full max-w-2xl rounded-sm border-2 border-gold shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute right-2 top-2 sm:right-4 sm:top-4 p-2 text-gold hover:text-text-main hover:cursor-pointer transition-colors z-10 text-3xl font-bold"
        >
          <X className="w-7 h-7" />
        </button>
        <div className="p-4">
          <div className="grid grid-cols-3 items-center mb-6 gap-4">
            <div className="flex flex-col items-center text-center">
              <img src={getTeamById(match.team1Id)?.logo} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mb-2 border border-slate-200 object-cover bg-white" alt="" />
              <p className="text-[10px] sm:text-xs font-black uppercase text-text-main w-full truncate px-1">{getTeamById(match.team1Id)?.name}</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="text-2xl sm:text-4xl font-black text-gold whitespace-nowrap">
                {match.score1} <span className="mx-2 text-gold">:</span> {match.score2}
              </div>
              <Swords className="w-6 h-6 sm:w-8 sm:h-8 text-slate-300 mt-1 sm:mt-2" />
            </div>
            <div className="flex flex-col items-center text-center">
              <img src={getTeamById(match.team2Id)?.logo} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mb-2 border border-slate-200 object-cover bg-white" alt="" />
              <p className="text-[10px] sm:text-xs font-black uppercase text-text-main w-full truncate px-1">{getTeamById(match.team2Id)?.name}</p>
            </div>
          </div>

          {match.details ? (
            <div className="space-y-8">
              {/* Bans Section */}
              <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 items-center">
                 {/* Team 1 Bans */}
                 <div className="flex flex-wrap gap-2 justify-end content-start">
                    {match.details.team1Bans?.map((ban, i) => (
                      <img key={i} alt={ban} className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-slate-200 shadow-sm" src={CHAMP_ICON_URL(ban)} />
                    ))}
                    {(!match.details.team1Bans || match.details.team1Bans.length === 0) && <span className="text-xs text-text-main italic">Sin bans</span>}
                 </div>
                 <div className="flex justify-center">
                  <span className="text-[10px] w-8 text-center sm:text-xs font-bold text-text-main uppercase tracking-wider bg-blue-header px-1 py-0.5 rounded border border-gold">
                    BAN
                  </span>
                </div>
                 {/* Team 2 Bans */}
                 <div className="flex flex-wrap gap-2 justify-start content-start">
                    {match.details.team2Bans?.map((ban, i) => (
                      <img key={i} alt={ban} className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-slate-200 shadow-sm" src={CHAMP_ICON_URL(ban)} />
                    ))}
                    {(!match.details.team2Bans || match.details.team2Bans.length === 0) && <span className="text-xs text-text-main italic">Sin bans</span>}
                 </div>
              </div>

              {/* Players Section with Centered Roles */}
              <div className="space-y-3">
                {match.details.team1Players.map((p1, i) => {
                  const p2 = match.details?.team2Players[i];
                  return (
                    <div key={i} className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 items-center">
                      
                      {/* Team 1 Player */}
                      <div className="scrollbar-hide overflow-visible">
                         <PlayerRow player={p1} align="right" />
                      </div>

                      {/* Role Icon */}
                      <div className="flex justify-center items-center">
                        {(() => {
                          const roleIcons: Record<string, string> = {
                            TOP: '/images/top.png',
                            JG: '/images/jg.png',
                            MID: '/images/mid.png',
                            ADC: '/images/adc.png',
                            SUP: '/images/supp.png',
                          };
                          const iconSrc = roleIcons[p1.role.toUpperCase()];
                          return iconSrc ? (
                            <img src={iconSrc} alt={p1.role} className="w-7 h-7 sm:w-8 sm:h-8 object-contain" title={p1.role} />
                          ) : (
                            <span className="text-[10px] w-8 text-center sm:text-xs font-bold text-text-main uppercase tracking-wider bg-blue-header px-1 py-0.5 rounded border border-gold">{p1.role}</span>
                          );
                        })()}
                      </div>

                      {/* Team 2 Player */}
                      <div className="scrollbar-hide overflow-visible">
                         {p2 && <PlayerRow player={p2} align="left" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-gold/40 rounded-xl">
              <p className="text-text-main font-bold uppercase tracking-widest italic">Estadísticas detalladas no disponibles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
