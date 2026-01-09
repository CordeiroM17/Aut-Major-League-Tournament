import React, { useState, useMemo } from 'react';
import { SWISS_TOURNAMENT_DATA } from '../constants';
import { Team, Match, TeamStats, TournamentData } from '../types';
import { Trophy, Calendar, CheckCircle2, LayoutGrid, Info } from 'lucide-react';
import { RecordSquares } from '../components/RecordSquares';
import { MatchModal } from '../components/MatchModal';
import { useEffect } from 'react';

export const TournamentPage: React.FC = () => {
  const [activeRound, setActiveRound] = useState<number>(1);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [teams, setTeams] = useState<Team[]>(SWISS_TOURNAMENT_DATA.teams);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/teams');
        const json = await response.json();
        if (json.status === 'success') {
          setTeams(json.data);
          console.log("god")
        }
      } catch (error) {
        console.error('Failed to fetch teams:', error);
      }
    };
    fetchTeams();
  }, []);

  const data: TournamentData = useMemo(() => ({
    ...SWISS_TOURNAMENT_DATA,
    teams: teams
  }), [teams]);

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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <MatchModal 
        match={selectedMatch} 
        teams={data.teams} 
        onClose={() => setSelectedMatch(null)} 
      />

      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">Swiss Tracker</h1>
            </div>
            <div className="flex items-center space-x-2 bg-slate-100 rounded-full px-4 py-1 border border-slate-200">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Tournament Live</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center space-x-2 text-slate-700">
                <Calendar className="w-5 h-5 text-indigo-500" />
                <span>PARTIDOS POR RONDA</span>
              </h2>
            </div>

            <div className="flex p-1 space-x-1 bg-slate-200/50 rounded-xl">
              {data.rounds.map((round) => (
                <button
                  key={round.number}
                  onClick={() => setActiveRound(round.number)}
                  className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all duration-200 uppercase tracking-tighter ${
                    activeRound === round.number
                      ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  Ronda {round.number}
                </button>
              ))}
            </div>

            <div className="space-y-10">
              {groupedMatches.length === 0 ? (
                 <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
                   <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                   <h3 className="text-lg font-bold text-slate-900">Ronda no iniciada</h3>
                   <p className="text-slate-500 text-sm">Los emparejamientos para esta ronda aún no están disponibles.</p>
                 </div>
              ) : (
                groupedMatches.map(([recordKey, matches]) => {
                  const [w, l] = recordKey.split('-').map(Number);
                  return (
                    <div key={recordKey} className="space-y-4">
                      <div className="flex items-center justify-between bg-slate-200/60 px-4 py-2 rounded-lg border border-slate-300/50">
                        <span className="text-xs font-black text-slate-700 uppercase tracking-widest">
                          RONDA {activeRound} ({recordKey})
                        </span>
                        <RecordSquares wins={w} losses={l} total={4} />
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {matches.map((match) => {
                          const team1 = getTeamById(match.team1Id);
                          const team2 = getTeamById(match.team2Id);
                          const isPending = match.status === 'pending';
                          
                          return (
                            <button 
                              key={match.id} 
                              onClick={() => !isPending && setSelectedMatch(match)}
                              disabled={isPending}
                              className={`w-full text-left bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm group transition-all duration-300 ${isPending ? 'opacity-80 cursor-default' : 'hover:border-indigo-300 hover:shadow-md'}`}
                            >
                              <div className="p-4 flex items-center justify-between">
                                <div className={`flex items-center space-x-4 flex-1 ${!isPending && match.winnerId === team1?.id ? 'opacity-100' : isPending ? 'opacity-100' : 'opacity-50'}`}>
                                  <div className="relative">
                                    <img src={team1?.logo} alt="" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100" />
                                    {!isPending && match.winnerId === team1?.id && (
                                      <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5 border-2 border-white">
                                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <p className={`text-sm font-bold ${!isPending && match.winnerId === team1?.id ? 'text-indigo-600' : 'text-slate-900'}`}>
                                      {team1?.name}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex flex-col items-center px-6">
                                  {isPending ? (
                                    <div className="bg-slate-100 rounded-lg px-3 py-1 border border-slate-200">
                                      <span className="text-xs font-black text-slate-500 tracking-wider">VS</span>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="flex items-center space-x-3 bg-slate-50 rounded-lg px-4 py-1.5 border border-slate-100">
                                        <span className={`text-lg font-black ${match.winnerId === team1?.id ? 'text-indigo-600' : 'text-slate-400'}`}>{match.score1}</span>
                                        <span className="text-slate-300 font-light">-</span>
                                        <span className={`text-lg font-black ${match.winnerId === team2?.id ? 'text-indigo-600' : 'text-slate-400'}`}>{match.score2}</span>
                                      </div>
                                      <span className="text-[8px] font-black text-indigo-400 uppercase mt-1 opacity-0 group-hover:opacity-100 transition-opacity tracking-widest">Estadísticas</span>
                                    </>
                                  )}
                                </div>

                                <div className={`flex items-center space-x-4 flex-1 justify-end ${!isPending && match.winnerId === team2?.id ? 'opacity-100' : isPending ? 'opacity-100' : 'opacity-50'}`}>
                                  <div className="text-right">
                                    <p className={`text-sm font-bold ${!isPending && match.winnerId === team2?.id ? 'text-indigo-600' : 'text-slate-900'}`}>
                                      {team2?.name}
                                    </p>
                                  </div>
                                  <div className="relative">
                                    <img src={team2?.logo} alt="" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100" />
                                    {!isPending && match.winnerId === team2?.id && (
                                      <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5 border-2 border-white">
                                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                                      </div>
                                    )}
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
            <h2 className="text-lg font-bold flex items-center space-x-2 text-slate-700">
              <LayoutGrid className="w-5 h-5 text-indigo-500" />
              <span>CLASIFICACIÓN</span>
            </h2>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
               <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase">{statsCounts.qualified} CLASIFICADOS</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase">{statsCounts.active} ACTIVOS</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase">{statsCounts.eliminated} ELIMINADOS</span>
                  </div>
               </div>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase text-center">Pos</th>
                      <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase">Equipo</th>
                      <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase text-center">W-L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {standings.map((stat, index) => {
                      const team = getTeamById(stat.teamId);
                      return (
                        <tr key={stat.teamId} className={`${stat.status === 'qualified' ? 'bg-emerald-50/20' : stat.status === 'eliminated' ? 'bg-rose-50/20' : ''}`}>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-xs font-bold ${index < 8 ? 'text-indigo-600' : 'text-slate-400'}`}>
                              {String(index + 1).padStart(2, '0')}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-3">
                              <img src={team?.logo} className="w-5 h-5 rounded-full border border-slate-100" alt="" />
                              <span className="text-xs font-bold text-slate-700 ">
                                {team?.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                              stat.status === 'qualified' ? 'text-emerald-700 bg-emerald-100 border-emerald-200' : 
                              stat.status === 'eliminated' ? 'text-rose-700 bg-rose-100 border-rose-200' : 
                              'text-slate-500 bg-slate-100 border-slate-200'
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

            <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <h3 className="font-bold text-sm mb-4 flex items-center space-x-2 text-indigo-300">
                <Info className="w-4 h-4" />
                <span className="uppercase tracking-widest">Formato</span>
              </h3>
              <div className="space-y-4 text-xs font-medium text-indigo-100 leading-relaxed">
                <p>3 Victorias = Clasificación directa.</p>
                <p>3 Derrotas = Eliminación del torneo.</p>
                <div className="pt-2 text-indigo-300 uppercase tracking-tighter font-black">
                  Click en partido para ver KDA
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
