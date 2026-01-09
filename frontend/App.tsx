
import React, { useState, useMemo } from 'react';
import { SWISS_TOURNAMENT_DATA } from './constants';
import { Team, Match, Round, TeamStats, PlayerStats } from './types';
import { 
  Trophy, 
  Calendar,
  CheckCircle2,
  LayoutGrid,
  X,
  Swords,
  Info
} from 'lucide-react';

const CHAMP_ICON_URL = (name: string) => `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${name}.png`;

const RecordSquares: React.FC<{ wins: number; losses: number; total: number }> = ({ wins, losses, total }) => {
  const squares = [];
  for (let i = 0; i < wins; i++) squares.push(<div key={`w-${i}`} className="w-4 h-4 bg-emerald-500 rounded-sm" />);
  for (let i = 0; i < losses; i++) squares.push(<div key={`l-${i}`} className="w-4 h-4 bg-red-500 rounded-sm" />);
  while (squares.length < total) squares.push(<div key={`g-${squares.length}`} className="w-4 h-4 bg-slate-300 rounded-sm" />);
  
  return <div className="flex space-x-1">{squares}</div>;
};

const PlayerRow: React.FC<{ player: PlayerStats; align: 'left' | 'right' }> = ({ player, align }) => {
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

const App: React.FC = () => {
  const [activeRound, setActiveRound] = useState<number>(1);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const data = SWISS_TOURNAMENT_DATA;

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
          statsMap[match.winnerId].wins += 1;
          statsMap[loserId].losses += 1;
          opponents[match.team1Id].push(match.team2Id);
          opponents[match.team2Id].push(match.team1Id);
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
      {/* Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setSelectedMatch(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-8">
              <div className="flex items-center justify-center space-x-8 mb-10">
                <div className="text-center">
                  <img src={getTeamById(selectedMatch.team1Id)?.logo} className="w-16 h-16 rounded-full mx-auto mb-2 border border-slate-200" alt="" />
                  <p className="text-sm font-black uppercase text-slate-900">{getTeamById(selectedMatch.team1Id)?.name}</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-black text-indigo-600">{selectedMatch.score1} : {selectedMatch.score2}</div>
                  <Swords className="w-6 h-6 text-slate-300 mt-2" />
                </div>
                <div className="text-center">
                  <img src={getTeamById(selectedMatch.team2Id)?.logo} className="w-16 h-16 rounded-full mx-auto mb-2 border border-slate-200" alt="" />
                  <p className="text-sm font-black uppercase text-slate-900">{getTeamById(selectedMatch.team2Id)?.name}</p>
                </div>
              </div>

              {selectedMatch.details ? (
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    {selectedMatch.details.team1Players.map((p, i) => <PlayerRow key={i} player={p} align="left" />)}
                  </div>
                  <div className="space-y-4">
                    {selectedMatch.details.team2Players.map((p, i) => <PlayerRow key={i} player={p} align="right" />)}
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
      )}

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
              {groupedMatches.map(([recordKey, matches]) => {
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
                        return (
                          <button 
                            key={match.id} 
                            onClick={() => setSelectedMatch(match)}
                            className="w-full text-left bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm group hover:border-indigo-300 hover:shadow-md transition-all duration-300"
                          >
                            <div className="p-4 flex items-center justify-between">
                              <div className={`flex items-center space-x-4 flex-1 ${match.winnerId === team1?.id ? 'opacity-100' : 'opacity-50'}`}>
                                <div className="relative">
                                  <img src={team1?.logo} alt="" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100" />
                                  {match.winnerId === team1?.id && (
                                    <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5 border-2 border-white">
                                      <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className={`text-sm font-bold ${match.winnerId === team1?.id ? 'text-indigo-600' : 'text-slate-900'}`}>
                                    {team1?.name}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col items-center px-6">
                                <div className="flex items-center space-x-3 bg-slate-50 rounded-lg px-4 py-1.5 border border-slate-100">
                                  <span className={`text-lg font-black ${match.winnerId === team1?.id ? 'text-indigo-600' : 'text-slate-400'}`}>{match.score1}</span>
                                  <span className="text-slate-300 font-light">-</span>
                                  <span className={`text-lg font-black ${match.winnerId === team2?.id ? 'text-indigo-600' : 'text-slate-400'}`}>{match.score2}</span>
                                </div>
                                <span className="text-[8px] font-black text-indigo-400 uppercase mt-1 opacity-0 group-hover:opacity-100 transition-opacity tracking-widest">Estadísticas</span>
                              </div>

                              <div className={`flex items-center space-x-4 flex-1 justify-end ${match.winnerId === team2?.id ? 'opacity-100' : 'opacity-50'}`}>
                                <div className="text-right">
                                  <p className={`text-sm font-bold ${match.winnerId === team2?.id ? 'text-indigo-600' : 'text-slate-900'}`}>
                                    {team2?.name}
                                  </p>
                                </div>
                                <div className="relative">
                                  <img src={team2?.logo} alt="" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100" />
                                  {match.winnerId === team2?.id && (
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
              })}
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
                              <span className="text-xs font-bold text-slate-700 truncate max-w-[100px]">
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

export default App;
