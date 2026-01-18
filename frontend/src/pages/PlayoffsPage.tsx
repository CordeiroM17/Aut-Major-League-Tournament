import React, { useEffect, useState } from 'react';
import { Trophy, Loader } from 'lucide-react';
import { PlayoffBracket } from '../components/PlayoffsBracket.tsx';
import { TournamentLiveButton } from '../components/TournamentLiveButton.tsx';

// Tipos locales para el estado (similares a los de PlayoffsBracket)
interface Team {
  id?: string;
  name: string;
  logo: string;
  score: number;
}

interface Match {
  id: string;
  round: string;
  team1: Team;
  team2: Team;
  winner: string;
}

export const PlayoffsPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Teams
        const teamsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/teams`);
        if (!teamsRes.ok) throw new Error('Error fetching teams');
        const teamsResponse = await teamsRes.json();
        const teamsMap = new Map(teamsResponse.data.map((t: any) => [t.id, t]));

        // 2. Fetch Matches
        const matchesRes = await fetch(`${import.meta.env.VITE_API_URL}/api/playoffs`);
        if (!matchesRes.ok) throw new Error('Error fetching matches');
        const matchesResponse = await matchesRes.json();
        const matchesData = matchesResponse.data;

        // 3. Map Data
        const mappedMatches: Match[] = matchesData.map((m: any) => {
          const t1 = teamsMap.get(m.team1Id) as any;
          const t2 = teamsMap.get(m.team2Id) as any;

          // Calcular score basado en games ganados si existe games, sino 0
          let s1 = 0;
          let s2 = 0;
          if (m.games && Array.isArray(m.games)) {
             s1 = m.games.filter((g: any) => g.winnerId === m.team1Id).length;
             s2 = m.games.filter((g: any) => g.winnerId === m.team2Id).length;
          }

          return {
            id: m.id,
            round: m.stage,
            team1: { 
              id: m.team1Id,
              name: t1 ? t1.name : 'TBD', 
              logo: t1 ? t1.logo : '', 
              score: s1
            },
            team2: { 
              id: m.team2Id,
              name: t2 ? t2.name : 'TBD', 
              logo: t2 ? t2.logo : '', 
              score: s2
            },
            winner: m.winnerId ? (m.winnerId === m.team1Id ? 'team1' : 'team2') : 'none'
          };
        });

        setMatches(mappedMatches);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error loading playoffs');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">Playoffs</h1>
            </a>
            <div>
              <a
              className="text-xs cursor-pointer font-semibold uppercase flex items-center space-x-2 bg-slate-100 rounded-full px-4 py-1 border border-slate-200 text-slate-600 transition-colors duration-200"
              href="/swiss"
              >
                Formato Suizo
              </a>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center">
          <PlayoffBracket matches={matches} />
        </div>
      </main>
    </div>
  );
};
