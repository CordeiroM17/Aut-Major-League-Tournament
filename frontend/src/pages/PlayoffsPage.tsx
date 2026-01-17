import React from 'react';
import { Trophy } from 'lucide-react';
import { PlayoffBracket } from '../components/PlayoffBracket';

// Ejemplo de datos (puedes reemplazar por fetch a la API luego)
const matches = [
  // Cuartos de final
  { id: 'QF1', round: 'QF', team1: { name: "Anyone's Legend", logo: '', score: 2 }, team2: { name: 'T1', logo: '', score: 3 }, winner: 'team2' },
  { id: 'QF2', round: 'QF', team1: { name: 'G2 Esports', logo: '', score: 1 }, team2: { name: 'TOPESPORTS', logo: '', score: 3 }, winner: 'team2' },
  { id: 'QF3', round: 'QF', team1: { name: 'Gen.G Esports', logo: '', score: 3 }, team2: { name: 'Hanwha Life Esports', logo: '', score: 1 }, winner: 'team1' },
  { id: 'QF4', round: 'QF', team1: { name: 'kt Rolster', logo: '', score: 3 }, team2: { name: 'CTBC Flying Oyster', logo: '', score: 0 }, winner: 'team1' },
  // Semifinales
  { id: 'SF1', round: 'SF', team1: { name: 'T1', logo: '', score: 3 }, team2: { name: 'TOPESPORTS', logo: '', score: 0 }, winner: 'team1' },
  { id: 'SF2', round: 'SF', team1: { name: 'Gen.G Esports', logo: '', score: 1 }, team2: { name: 'kt Rolster', logo: '', score: 3 }, winner: 'team2' },
  // Final
  { id: 'F1', round: 'F', team1: { name: 'T1', logo: '', score: 3 }, team2: { name: 'kt Rolster', logo: '', score: 2 }, winner: 'team1' },
  // Tercer puesto
  { id: 'T1', round: 'T', team1: { name: 'TOPESPORTS', logo: '', score: 1 }, team2: { name: 'Gen.G Esports', logo: '', score: 3 }, winner: 'team2' }
];

export const PlayoffsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">Playoffs</h1>
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
