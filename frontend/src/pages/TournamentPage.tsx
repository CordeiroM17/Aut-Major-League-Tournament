import React, { useState, useMemo } from 'react';
import { SWISS_TOURNAMENT_DATA } from '../constants';
import { Team, Match, TeamStats, TournamentData } from '../types';
import { Trophy, Calendar, CheckCircle2, LayoutGrid, Info } from 'lucide-react';
import { RecordSquares } from '../components/RecordSquares';
import { MatchModal } from '../components/MatchModal';
import { useEffect } from 'react';
import { TournamentLiveButton } from '../components/TournamentLiveButton';
import { TopPlayers } from '../components/TopPlayers';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const TournamentPage: React.FC = () => {
  const [activeRound, setActiveRound] = useState<number>(1);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [teams, setTeams] = useState<Team[]>(SWISS_TOURNAMENT_DATA.teams);
  const [matches, setMatches] = useState<Match[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsRes, matchesRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/teams`),
          fetch(`${import.meta.env.VITE_API_URL}/api/matches`)
        ]);
        
        const teamsJson = await teamsRes.json();
        const matchesJson = await matchesRes.json();

        if (teamsJson.status === 'success') {
          setTeams(teamsJson.data);
        }
        if (matchesJson.status === 'success') {
          setMatches(matchesJson.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  const data: TournamentData = useMemo(() => {
    const rounds = SWISS_TOURNAMENT_DATA.rounds.map(round => ({
      ...round,
      matches: matches.filter(m => m.round === round.number)
    }));

    return {
      ...SWISS_TOURNAMENT_DATA,
      teams: teams,
      rounds: rounds
    };
  }, [teams, matches]);

  const getRecordBeforeRound = (teamId: string, roundNum: number) => {
    let wins = 0;
    let losses = 0;
    for (let i = 0; i < roundNum - 1; i++) {
        const round = data.rounds[i];
        const match = round.matches.find(m => m.team1Id === teamId || m.team2Id === teamId);
        if (match && match.winnerId) {
            if (match.winnerId === teamId) wins++;
            else losses++;
        }
    }
    return { wins, losses };
  };

  const groupedMatches = useMemo(() => {
    const round = data.rounds[activeRound - 1];
    const groups: Record<string, Match[]> = {};
    
    round.matches.forEach(match => {
      const record = getRecordBeforeRound(match.team1Id, activeRound);
      const key = `${record.wins}-${record.losses}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(match);
    });

    return Object.entries(groups).sort((a, b) => {
      const [aw, al] = a[0].split('-').map(Number);
      const [bw, bl] = b[0].split('-').map(Number);
      if (bw !== aw) return bw - aw;
      return al - bl;
    });
  }, [activeRound, data]);

  const standings = useMemo(() => {
    const statsMap: Record<string, TeamStats> = {};
    data.teams.forEach(team => {
      statsMap[team.id] = { teamId: team.id, wins: 0, losses: 0, buchholz: 0, status: 'active' };
    });

    const opponents: Record<string, string[]> = {};
    data.teams.forEach(team => opponents[team.id] = []);

    data.rounds.forEach(round => {
      round.matches.forEach(match => {
        if (match.status === 'completed' && match.winnerId) {
          const loserId = match.winnerId === match.team1Id ? match.team2Id : match.team1Id;
          
          if (statsMap[match.winnerId] && statsMap[loserId]) {
            statsMap[match.winnerId].wins += 1;
            statsMap[loserId].losses += 1;
            opponents[match.team1Id]?.push(match.team2Id);
            opponents[match.team2Id]?.push(match.team1Id);
          }
        }
      });
    });

    Object.keys(statsMap).forEach(teamId => {
      statsMap[teamId].buchholz = opponents[teamId].reduce((acc, oppId) => acc + (statsMap[oppId]?.wins || 0), 0);
    });

    Object.values(statsMap).forEach(stat => {
      if (stat.wins >= 3) stat.status = 'qualified';
      else if (stat.losses >= 3) stat.status = 'eliminated';
      else stat.status = 'active';
    });

    return Object.values(statsMap).sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (a.losses !== b.losses) return a.losses - b.losses;
      return b.buchholz - a.buchholz;
    });
  }, [data]);

  const getTeamById = (id: string) => data.teams.find(t => t.id === id);

  const statsCounts = useMemo(() => ({
    qualified: standings.filter(s => s.status === 'qualified').length,
    active: standings.filter(s => s.status === 'active').length,
    eliminated: standings.filter(s => s.status === 'eliminated').length,
  }), [standings]);

  return (
    <div className="min-h-screen bg-blue-surface text-slate-900 relative overflow-hidden">
      <MatchModal 
        match={selectedMatch} 
        teams={data.teams} 
        onClose={() => setSelectedMatch(null)} 
      />
      
      <img
        src="/images/fondodemacia.webp"
        alt="Fondo Demacia"
        className="pointer-events-none select-none fixed inset-0 w-full h-full object-cover opacity-5 z-0"
        aria-hidden="true"
      />


      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 relative z-10">
        <TournamentLiveButton />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-center xs:justify-start space-x-2">
              <Calendar className="w-5 h-5 text-gold" />
              <h2 className="text-lg font-bold text-text-main">PARTIDOS POR RONDA</h2>
              <span className="flex-1 h-px bg-text-dark ml-3" />
            </div>

            <div className="flex space-x-1 xs:space-x-2">
              {data.rounds.map((round) => (
                <button
                  key={round.number}
                  onClick={() => setActiveRound(round.number)}
                  className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-sm bg-blue-header transition-all duration-200 uppercase tracking-tighter cursor-pointer border xs:border-2 border-text-dark ${
                    activeRound === round.number
                      ? 'bg-gold text-blue-primary'
                      : 'text-text-dark hover:text-slate-900 hover:bg-gold/70 hover:text-blue-primary'
                  }`}
                >
                  Ronda {round.number}
                </button>
              ))}
            </div>

            <div className="space-y-10">
              {groupedMatches.length === 0 ? (
                 <div className="h-full text-center py-20 px-10 xs:px-20 bg-blue-header rounded-sm border border-gold shadow-lg">
                   <Calendar className="w-12 h-12 text-gold mx-auto mb-4" />
                   <h3 className="text-lg font-bold text-gold">Ronda no iniciada</h3>
                   <p className="text-text-main/70 text-sm">Los emparejamientos para esta ronda aún no están disponibles.</p>
                 </div>
              ) : (
                groupedMatches.map(([recordKey, matches]) => {
                  const [w, l] = recordKey.split('-').map(Number);
                  return (
                    <div key={recordKey} className="space-y-4">
                      <div className="flex items-center justify-between bg-blue-header px-4 py-2 rounded-sm">
                        <span className="text-xs font-black text-text-main uppercase tracking-widest">
                          RONDA {activeRound} ({recordKey})
                        </span>
                        <RecordSquares wins={w} losses={l} total={4} />
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {matches.map((match) => {
                          const team1 = getTeamById(match.team1Id);
                          const team2 = getTeamById(match.team2Id);
                          const isPending = match.status === 'pending';
                          
                          return (
                            <button 
                              key={match.id} 
                              onClick={() => !isPending && setSelectedMatch(match)}
                              disabled={isPending}
                              className={`w-full text-left bg-blue-header rounded-sm overflow-hidden group transition-all duration-300 h-[100px] ${isPending ? 'opacity-80 cursor-default' : 'hover:border-gold hover:shadow-md cursor-pointer'}`}
                            >
                              <div className="p-4 grid grid-cols-3 items-center justify-between">
                                <div className={`flex items-center justify-start space-x-4 flex-1 ${!isPending && match.winnerId === team1?.id ? 'opacity-100' : isPending ? 'opacity-100' : 'opacity-50'}`}>
                                  <div className="hidden sm:block rounded-full border-2 border-black relative overflow-hidden w-10 h-10">
                                    <img src={team1?.logo} alt="" className="w-full h-full bg-slate-50 object-cover" />
                                  </div>
                                  <div className="text-left m-0 relative">
                                    <p className={`text-[10px] text-text-main uppercase xs:text-xs sm:text-sm font-bold ${!isPending && match.winnerId === team1?.id ? 'text-gold' : 'text-slate-900'}`}>
                                      {team1?.name}
                                    </p>
                                    {!isPending && match.winnerId === team1?.id && (
                                      <div className="absolute -top-6 -left-1 sm:-left-7 bg-gold rounded-full w-6 h-6 flex items-center justify-center">
                                        <span className="text-[10px] text-blue-surface font-bold font-sans">W</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex flex-col items-center px-6">
                                  {isPending ? (
                                    <div className="px-3 py-1">
                                      <span className="text-[10px] sm:text-xs font-black text-text-main tracking-wider">VS</span>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="flex items-center space-x-3 px-4 py-1.5">
                                        <span className={`text-lg sm:text-lg font-black ${match.winnerId === team1?.id ? 'text-gold' : 'text-slate-400'}`}>{match.score1}</span>
                                        <span className="text-slate-400 font-light">-</span>
                                        <span className={`text-lg sm:text-lg font-black ${match.winnerId === team2?.id ? 'text-gold' : 'text-slate-400'}`}>{match.score2}</span>
                                      </div>
                                      <span className="text-[8px] xs:text-[10px] sm:text-xs text-center font-black text-gold uppercase mt-1 transition-opacity tracking-widest">Ver Estadísticas</span>
                                    </>
                                  )}
                                </div>

                                <div className={`flex items-center justify-end space-x-4 flex-1 ${!isPending && match.winnerId === team2?.id ? 'opacity-100' : isPending ? 'opacity-100' : 'opacity-50'}`}>
                                  <div className="text-right m-0 relative">
                                    <p className={`text-[10px] text-text-main uppercase xs:text-xs sm:text-sm font-bold ${!isPending && match.winnerId === team2?.id ? 'text-gold' : 'text-slate-900'}`}>
                                      {team2?.name}
                                    </p>
                                    {!isPending && match.winnerId === team2?.id && (
                                      <div className="absolute -top-6 -right-1 sm:-right-7 bg-gold rounded-full w-6 h-6 flex items-center justify-center z-10">
                                        <span className="text-[10px] font-bold text-blue-surface font-sans">W</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="hidden sm:block rounded-full border-2 border-black relative overflow-hidden w-10 h-10 ml-4">
                                    <img src={team2?.logo} alt="" className="w-full h-full bg-slate-50 object-cover" />
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-center xs:justify-start space-x-2">
              <LayoutGrid className="w-5 h-5 text-gold" />
              <h2 className="text-lg font-bold text-text-main">CLASIFICACIÓN</h2>
              <span className="flex-1 h-px bg-text-dark ml-3" />
            </div>

            <div className="bg-blue-header rounded-sm py-3 flex items-center justify-center mb-0">
               <div className="flex flex-col xs:flex-row lg:flex-col 2xl:flex-row gap-4 justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs sm:text-sm lg:text-xs font-bold text-text-main/70 uppercase">{statsCounts.qualified} CLASIFICADOS</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                    <span className="text-xs sm:text-sm lg:text-xs font-bold text-text-main/70 uppercase">{statsCounts.active} ACTIVOS</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-xs sm:text-sm lg:text-xs font-bold text-text-main/70 uppercase">{statsCounts.eliminated} ELIMINADOS</span>
                  </div>
               </div>
            </div>
            
            <div className="rounded-sm overflow-hidden">
                <table className="w-full text-left border-separate border-spacing-y-4">
                  <thead className="bg-blue-header">
                    <tr>
                      <th className="px-4 py-2 text-xs sm:text-sm font-bold text-text-main/70 uppercase text-center">Pos</th>
                      <th className="px-4 py-2 text-xs sm:text-sm font-bold text-text-main/70 uppercase">Equipo</th>
                      <th className="px-4 py-2 text-xs sm:text-sm font-bold text-text-main/70 uppercase text-center">W-L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {standings.map((stat, index) => {
                      const team = getTeamById(stat.teamId);
                      const statusColor = stat.status === 'qualified' ? 'text-emerald-500' : stat.status === 'eliminated' ? 'text-rose-500' : 'text-gold';

                      return (
                        <tr key={stat.teamId} className="bg-blue-header">
                          <td className="px-4 py-3 text-center">
                            <span className={`text-xs sm:text-sm font-bold ${statusColor}`}>
                              {String(index + 1).padStart(2, '0')}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-3">
                              <img src={team?.logo} className="w-5 h-5 rounded-full border border-slate-100" alt="" />
                              <span className="text-xs sm:text-sm font-bold text-text-main">
                                {team?.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-xs sm:text-sm font-black ${statusColor}`}>
                              {stat.wins}-{stat.losses}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
            </div>

            <div className="bg-blue-header rounded-sm p-6 text-white shadow-xl relative overflow-hidden">
              <div className="font-bold text-sm mb-4 flex items-center justify-start space-x-2">
                <Info className="w-8 h-8 text-gold" />
                <h3 className="uppercase tracking-widest text-lg">Información</h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm font-medium text-text-main/70 leading-relaxed mb-4">
                <p>
                  La fase suiza garantiza que los equipos con rendimientos similares se enfrenten entre si.
                </p>

                <p>
                  <strong>3 Victorias:</strong> Clasificación a Playoffs.
                </p>

                <p>
                  <strong>3 Derrotas:</strong> Eliminación del torneo.
                </p>

              </div>

              <button
                onClick={() => navigate('/reglamento')}
                className="flex items-center justify-center py-2 w-full font-bold border border-gold rounded-sm text-base shadow-md cursor-pointer transition-all duration-300 bg-blue-primary/70 text-gold hover:bg-gold/95 hover:text-blue-primary tracking-widest"
              >
                Ver Reglamento
              </button>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
