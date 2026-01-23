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
      

      <Header active="swiss" />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <TournamentLiveButton />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-center xs:justify-start space-x-2">
              <Calendar className="w-5 h-5 text-gold" />
              <h2 className="text-lg font-bold text-text-main">PARTIDOS POR RONDA</h2>
              <span className="flex-1 h-px bg-text-dark ml-3" />
            </div>

            <div className="flex space-x-1 xs:space-x-2 rounded-xl">
              {data.rounds.map((round) => (
                <button
                  key={round.number}
                  onClick={() => setActiveRound(round.number)}
                  className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-lg bg-blue-primary transition-all duration-200 uppercase tracking-tighter cursor-pointer border xs:border-2 ${
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
                 <div className="h-full text-center py-20 px-10 xs:px-20 bg-blue-primary rounded-xl">
                   <Calendar className="w-12 h-12 text-text-main mx-auto mb-4" />
                   <h3 className="text-lg font-bold text-text-main">Ronda no iniciada</h3>
                   <p className="text-text-main text-sm">Los emparejamientos para esta ronda aún no están disponibles.</p>
                 </div>
              ) : (
                groupedMatches.map(([recordKey, matches]) => {
                  const [w, l] = recordKey.split('-').map(Number);
                  return (
                    <div key={recordKey} className="space-y-6">
                      <div className="flex items-center justify-between bg-slate-200/60 px-4 py-2 rounded-lg border border-slate-300/50">
                        <span className="text-xs font-black text-slate-700 uppercase tracking-widest">
                          RONDA {activeRound} ({recordKey})
                        </span>
                        <RecordSquares wins={w} losses={l} total={4} />
                      </div>

                      <div className="grid grid-cols-1 gap-8">
                        {matches.map((match) => {
                          const team1 = getTeamById(match.team1Id);
                          const team2 = getTeamById(match.team2Id);
                          const isPending = match.status === 'pending';
                          
                          return (
                            <button 
                              key={match.id} 
                              onClick={() => !isPending && setSelectedMatch(match)}
                              disabled={isPending}
                              className={`w-full text-left bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm group transition-all duration-300 h-[100px] ${isPending ? 'opacity-80 cursor-default' : 'hover:border-gold hover:shadow-md cursor-pointer'}`}
                            >
                              <div className="p-4 grid grid-cols-3 items-center justify-between">
                                <div className={`flex items-center justify-start space-x-4 flex-1 ${!isPending && match.winnerId === team1?.id ? 'opacity-100' : isPending ? 'opacity-100' : 'opacity-50'}`}>
                                  <div className="block relative">
                                    <img src={team1?.logo} alt="" className="hidden sm:block w-10 h-10 bg-slate-50 border border-slate-100" />
                                  </div>
                                  <div className="text-left m-0 relative">
                                    <p className={`text-[10px] xs:text-xs sm:text-sm font-bold ${!isPending && match.winnerId === team1?.id ? 'text-gold' : 'text-slate-900'}`}>
                                      {team1?.name}
                                    </p>
                                    {!isPending && match.winnerId === team1?.id && (
                                      <div className="absolute -top-6 -left-1 bg-emerald-500 rounded-full p-0.5 border-2 border-white">
                                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex flex-col items-center px-6">
                                  {isPending ? (
                                    <div className="bg-slate-100 rounded-lg px-3 py-1 border border-slate-200">
                                      <span className="text-[10px] sm:text-xs font-black text-text-dark tracking-wider">VS</span>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="flex items-center space-x-3 bg-slate-50 rounded-lg px-4 py-1.5 border border-slate-100">
                                        <span className={`text-sm sm:text-lg font-black ${match.winnerId === team1?.id ? 'text-gold' : 'text-slate-400'}`}>{match.score1}</span>
                                        <span className="text-slate-300 font-light">-</span>
                                        <span className={`text-sm sm:text-lg font-black ${match.winnerId === team2?.id ? 'text-gold' : 'text-slate-400'}`}>{match.score2}</span>
                                      </div>
                                      <span className="text-[8px] xs:text-[10px] sm:text-xs text-center font-black text-gold uppercase mt-1 transition-opacity tracking-widest">Ver Estadísticas</span>
                                    </>
                                  )}
                                </div>

                                <div className={`flex items-center justify-end space-x-4 flex-1 ${!isPending && match.winnerId === team2?.id ? 'opacity-100' : isPending ? 'opacity-100' : 'opacity-50'}`}>
                                  <div className="text-right m-0 relative">
                                    <p className={`text-[10px] xs:text-xs sm:text-sm font-bold ${!isPending && match.winnerId === team2?.id ? 'text-gold' : 'text-slate-900'}`}>
                                      {team2?.name}
                                    </p>
                                    {!isPending && match.winnerId === team2?.id && (
                                      <div className="absolute -top-6 -right-1 bg-emerald-500 rounded-full p-0.5 border-2 border-white">
                                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="block relative">
                                    <img src={team2?.logo} alt="" className="hidden sm:block w-10 h-10 bg-slate-50 border border-slate-100 ml-4" />
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

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-center">
               <div className="flex flex-col xs:flex-row lg:flex-col 2xl:flex-row gap-4  justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs sm:text-sm lg:text-xs font-black text-text-dark uppercase">{statsCounts.qualified} CLASIFICADOS</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                    <span className="text-xs sm:text-sm lg:text-xs font-black text-text-dark uppercase">{statsCounts.active} ACTIVOS</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-xs sm:text-sm lg:text-xs font-black text-text-dark uppercase">{statsCounts.eliminated} ELIMINADOS</span>
                  </div>
               </div>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-xs sm:text-sm font-black text-slate-400 uppercase text-center">Pos</th>
                      <th className="px-4 py-3 text-xs sm:text-sm font-black text-slate-400 uppercase">Equipo</th>
                      <th className="px-4 py-3 text-xs sm:text-sm font-black text-slate-400 uppercase text-center">W-L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {standings.map((stat, index) => {
                      const team = getTeamById(stat.teamId);
                      return (
                        <tr key={stat.teamId} className={`${stat.status === 'qualified' ? 'bg-emerald-50/20' : stat.status === 'eliminated' ? 'bg-rose-50/20' : ''}`}>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-xs sm:text-sm font-bold ${index < 8 ? 'text-gold' : 'text-slate-400'}`}>
                              {String(index + 1).padStart(2, '0')}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-3">
                              <img src={team?.logo} className="w-5 h-5 rounded-full border border-slate-100" alt="" />
                              <span className="text-xs sm:text-sm font-bold text-slate-700 ">
                                {team?.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-xs sm:text-sm font-black px-2 py-0.5 rounded border ${
                              stat.status === 'qualified' ? 'text-emerald-700 bg-emerald-100 border-emerald-200' : 
                              stat.status === 'eliminated' ? 'text-rose-700 bg-rose-100 border-rose-200' : 
                              'text-text-dark bg-slate-100 border-slate-200'
                            }`}>
                              {stat.wins}-{stat.losses}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
            </div>

            <div className="bg-blue-secondary rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="font-bold text-sm mb-4 flex items-center justify-center xs:text-left xs:justify-start space-x-2 text-gold">
                <Info className="w-4 h-4" />
                <h3 className="uppercase tracking-widest">Formato Suizo</h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm font-medium text-text-main leading-relaxed">
                <p>
                  Todos los equipos comienzan con un marcador <strong>0-0</strong>.
                </p>

                <p>
                  Los equipos se enfrentan siempre contra rivales con el mismo número de
                  victorias y derrotas.
                </p>

                <p>
                  <strong>3 Victorias</strong> = Clasificación directa a la siguiente fase.
                </p>

                <p>
                  <strong>3 Derrotas</strong> = Eliminación automática del torneo.
                </p>

                <p>
                  No hay empates: cada partida suma una victoria o una derrota.
                </p>

                <p>
                  El formato continúa hasta que todos los equipos estén clasificados o
                  eliminados.
                </p>
              </div>
              <div className="font-bold text-sm mt-4 flex items-center justify-center xs:text-left xs:justify-start space-x-2 text-gold">
                  <Info className="w-4 h-4" />
                  <h3 className="uppercase tracking-widest">Click en partido para ver KDA</h3>
                </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};
