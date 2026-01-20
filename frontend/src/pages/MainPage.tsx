import React, { useState, useEffect } from 'react';
import { TopPlayers } from '../components/TopPlayers';
import { Match, Team } from '../types';
import { useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';

export const MainPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/teams`),
        ]);
        
        const teamsJson = await teamsRes.json();

        if (teamsJson.status === 'success') {
          setTeams(teamsJson.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-[#152a42]">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={() => navigate('/')} className="flex items-center space-x-3 bg-transparent border-none cursor-pointer">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Trophy className="w-4 h-4 xs:w-6 xs:h-6 text-white"/>
            </div>
            <h1 className="hidden xs:block text-sm xs:text-xl font-bold text-slate-900">AUT League</h1>
          </button>
            <div className="flex gap-4">
              <button
              className="text-[10px] xs:text-xs text-center cursor-pointer font-semibold uppercase flex items-center bg-slate-100 rounded-full px-4 py-1 border border-slate-200 text-slate-600 transition-colors duration-200 hover:bg-slate-200"
              onClick={() => navigate('/swiss')}
              >
                Swiss
              </button>
              <button
              className="text-[10px] xs:text-xs text-center cursor-pointer font-semibold uppercase flex items-center bg-slate-100 rounded-full px-4 py-1 border border-slate-200 text-slate-600 transition-colors duration-200 hover:bg-slate-200"
              onClick={() => navigate('/playoffs')}
              >
                Playoffs
              </button>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="bg-[#152a42] min-h-[calc(100vh-4rem)] flex flex-col justify-center">
          <div className="w-full flex flex-col items-center gap-4 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <img className="w-auto max-w-48 sm:max-w-64" src="Aut-Logo.png" alt="Aut Logo" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center">Demostrá tu nivel, competí por la gloria</h1>
            <p className="text-white text-center text-sm lg:text-lg">AUT Major League es una competencia amateur de League of Legends creada para impulsar el talento emergente y brindar una experiencia competitiva única. </p>
            <p className="text-[#d7b84a] text-center text-sm lg:text-lg">Torneo exclusivo para el servidor LAS (Latin America South).</p>
            <a 
            href="https://forms.gle/cEAKt88AKbkG64FU9"
            className="border-2 border-[#d7b84a] px-8 py-4 bold text-[#d7b84a]" 
            target="_blank"
            >
              ¡Inscribete Aqui!
            </a>
          </div>
        </div>
        <div className="bg-white">
          <div className="flex flex-col items-center gap-4 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-[#152a42]">Formato del torneo</h2>
              <p className="text-[#152a42] text-center text-sm lg:text-lg">
                La estructura de la competencia de la AUT Major League emplea un sistema diseñado para garantizar la equidad y maximizar el tiempo de juego de los participantes.
              </p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => navigate('/swiss')} className="px-8 py-4 w-32 text-center bold bg-[#e5e7eb] text-[#4b5563] rounded-md text-[18px] shadow-md cursor-pointer hover:bg-slate-300 transition-colors">
                Swiss
              </button>
              <button onClick={() => navigate('/playoffs')} className="px-8 py-4 w-32 text-center bold bg-[#e5e7eb] text-[#4b5563] rounded-md text-[18px] shadow-md cursor-pointer hover:bg-slate-300 transition-colors">
                Playoffs
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white border-t border-[#152a42]">
          <div className="grid grid-cols-1 gap-8 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-[1fr] sm:grid-cols-[1fr_1fr] items-center justify-items-center gap-8">
              <div className="w-full h-full flex flex-col items-center text-center w-full bg-[#152a42] p-8 gap-4 rounded-xl shadow-lg border border-slate-700">
                <div className="flex items-center justify-center w-16 h-16 text-3xl font-bold text-[#d7b84a] rounded-full border-2 border-[#d7b84a]">1</div>
                <div>
                  <span className="block text-xl sm:text-2xl lg:text-3xl text-white font-bold mb-1">Fase Regular</span>
                  <span className="text-lg sm:text-xl lg:text-2xl text-[#d7b84a] font-bold">(Sistema Suizo)</span>
                </div>
                <p className="text-sm lg:text-lg text-slate-300 leading-relaxed">Se compite en formato suizo, asegurando enfrentamientos contra oponentes con un historial de victorias similar. Este sistema permite una clasificación justa basada en el desempeño real durante el torneo.</p>
              </div>
              <div className="w-full h-full flex flex-col items-center text-center w-full bg-[#152a42] p-8 gap-4 rounded-xl shadow-lg border border-slate-700">
                <div className="flex items-center justify-center w-16 h-16 text-3xl font-bold text-[#d7b84a] rounded-full border-2 border-[#d7b84a]">2</div>
                <div>
                  <span className="block text-xl sm:text-2xl lg:text-3xl text-white font-bold mb-1">Fase Final</span>
                  <span className="text-lg sm:text-xl lg:text-2xl text-[#d7b84a] font-bold">(Playoffs)</span>
                </div>
                <p className="text-sm lg:text-lg text-slate-300 leading-relaxed">Los equipos con mejor rendimiento en la fase suiza avanzan a un cuadro de eliminación directa. En esta instancia, la precisión y la estrategia definen al campeón de la liga. Demostrá tu nivel y competí por la gloria.</p>
              </div>
          </div>
          <div className="flex flex-col justify-start items-center w-full">
              <div className="w-full bg-[#152a42] p-6 rounded-xl shadow-lg border border-slate-700">
                  <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white uppercase tracking-wider">Equipos</h3>
                      <span className="text-xs font-bold text-[#d7b84a] bg-[#d7b84a]/10 px-2 py-1 rounded border border-[#d7b84a]/20">{teams.length} Equipos</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                      {teams.map((team, index) => (
                      <div key={team.id} className="flex items-center justify-between p-2 pl-3 bg-[#0f1e31] rounded-lg border border-slate-800 hover:border-slate-600 transition-colors">
                          <div className="flex items-center space-x-3">
                              <span className="text-slate-500 font-mono text-xs w-5">{(index + 1).toString().padStart(2, '0')}</span>
                              <img src={team.logo} className="w-6 h-6 rounded-full border border-slate-700 bg-slate-800 object-cover" alt="" />
                              <span className="text-xs sm:text-sm font-bold text-slate-200 truncate">
                                  {team.name}
                              </span>
                          </div>
                      </div>
                      ))}
                      {teams.length === 0 && (
                          <div className="col-span-2 text-center py-4">
                            <p className="text-slate-500 italic">Equipos no disponibles</p>
                          </div>
                      )}
                  </div>
              </div>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
};
