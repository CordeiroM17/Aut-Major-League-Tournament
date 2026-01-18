import React, { useEffect, useState } from 'react';
import { Match, Team } from '../types';
import { Trophy, Crosshair } from 'lucide-react';

interface AggregatedPlayer {
  name: string;
  teamId: string; // Store one team ID (players shouldn't switch teams ideally)
  role: string;
  k: number;
  d: number;
  a: number;
  games: number;
  kda: number;
}

export const TopPlayers: React.FC = () => {
  const [topPlayers, setTopPlayers] = useState<AggregatedPlayer[]>([]);
  const [teams, setTeams] = useState<Map<string, Team>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchesRes, teamsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/matches`),
          fetch(`${import.meta.env.VITE_API_URL}/api/teams`)
        ]);

        const matchesJson = await matchesRes.json();
        const teamsJson = await teamsRes.json();

        const teamsMap = new Map<string, Team>();
        if (teamsJson.status === 'success') {
          teamsJson.data.forEach((t: Team) => teamsMap.set(t.id, t));
        }
        setTeams(teamsMap);

        if (matchesJson.status === 'success') {
          processMatches(matchesJson.data);
        }
      } catch (error) {
        console.error('Error fetching data for TopPlayers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processMatches = (matches: Match[]) => {
    const playerMap = new Map<string, AggregatedPlayer>();

    matches.forEach(match => {
      if (match.status !== 'completed' || !match.details) return;

      const processPlayer = (p: any, teamId: string) => {
        if (!playerMap.has(p.name)) {
          playerMap.set(p.name, {
            name: p.name,
            teamId: teamId,
            role: p.role,
            k: 0, d: 0, a: 0,
            games: 0,
            kda: 0
          });
        }
        const stats = playerMap.get(p.name)!;
        stats.k += p.k;
        stats.d += p.d;
        stats.a += p.a;
        stats.games += 1;
      };

      match.details.team1Players.forEach(p => processPlayer(p, match.team1Id));
      match.details.team2Players.forEach(p => processPlayer(p, match.team2Id));
    });

    const aggregated = Array.from(playerMap.values()).map(p => {
      // Avoid division by zero. If deaths is 0, treat as 1 for division or perfect KDA
      // Commonly, perfect KDA is treated as (K+A)
      const denominator = p.d === 0 ? 1 : p.d;
      return {
        ...p,
        kda: (p.k + p.a) / denominator
      };
    });

    // Sort by KDA desc
    aggregated.sort((a, b) => b.kda - a.kda);

    setTopPlayers(aggregated.slice(0, 5));
  };

  if (loading) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full">
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <div className="bg-indigo-500/20 p-2 rounded-lg">
                <Crosshair className="w-5 h-5 text-indigo-100" />
            </div>
            <h3 className="font-bold text-white uppercase tracking-wider text-sm">Top Players (KDA)</h3>
        </div>
        <Trophy className="w-5 h-5 text-amber-400" />
      </div>

      <div className="divide-y divide-slate-100">
        {topPlayers.map((player, index) => {
          const team = teams.get(player.teamId);
          return (
            <div key={player.name} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center space-x-4">
                 <div className="w-6 text-center font-bold text-slate-300 text-lg">
                    #{index + 1}
                 </div>
                 <div className="flex items-center space-x-3">
                    {team && (
                        <div className="relative">
                            <img src={team.logo} alt={team.name} className="w-10 h-10 rounded-full border border-slate-200 bg-white object-cover" />
                             <div className="absolute -bottom-1 -right-1 bg-slate-100 text-[8px] font-bold px-1 rounded border border-slate-200 uppercase">
                                {player.role}
                             </div>
                        </div>
                    )}
                    <div>
                        <p className="font-bold text-slate-800 text-sm">{player.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{team?.name}</p>
                    </div>
                 </div>
              </div>
              
              <div className="text-right">
                <p className="text-xl font-black text-indigo-600">{player.kda.toFixed(2)}</p>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">KDA RATIO</p>
              </div>
            </div>
          );
        })}
        {topPlayers.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-sm italic">
                No hay suficientes datos.
            </div>
        )}
      </div>
    </div>
  );
};
