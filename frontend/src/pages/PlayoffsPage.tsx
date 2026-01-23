import React, { useEffect, useState } from 'react';
import { Trophy, Loader, Calendar } from 'lucide-react';
import { PlayoffBracket } from '../components/PlayoffsBracket.tsx';
import { TournamentLiveButton } from '../components/TournamentLiveButton.tsx';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header.tsx';

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
  const navigate = useNavigate();

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
      <Header active="playoffs" />
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <TournamentLiveButton  />
        <div className="flex flex-col items-center ">
          {matches.length === 0 ? (
            <div className="w-full text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900">Ronda no iniciada</h3>
              <p className="text-text-dark text-sm">Los emparejamientos para esta ronda aún no están disponibles.</p>
              <div className="mt-4 flex justify-center">
                <button
                onClick={() => navigate('/swiss')}
                className="text-xs cursor-pointer font-semibold uppercase flex items-center space-x-2 bg-slate-100 rounded-full px-4 py-1 border border-slate-200 text-slate-600 transition-colors duration-200 hover:bg-slate-200"
                >
                  Regresar alFormato Suizo
                </button>
              </div>
            </div>
          ) : (
            <PlayoffBracket matches={matches} />
          )}
        </div>
      </main>
    </div>
  );
};
