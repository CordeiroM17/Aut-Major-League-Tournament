import React, { useState, useEffect } from 'react';
import { TopPlayers } from '../components/TopPlayers';
import { Match, Team } from '../types';

export const MainPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);

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
    <div>
      <div className="flex flex-col items-center gap-4 bg-[#152a42] p-32">
        <img className="w-64" src="Aut-Logo.png" alt="Aut Logo" />
        <h1 className="text-4xl font-bold text-white">Demostrá tu nivel, competí por la gloria</h1>
        <p className="text-white text-center">AUT Major League es una competencia amateur de League of Legends creada para impulsar el talento emergente y brindar una experiencia competitiva única. </p>
        <p className="text-[#d7b84a] text-center">Torneo exclusivo para el servidor LAS (Latin America South).</p>
        <a 
        href="https://docs.google.com/forms/d/e/1FAIpQLSfTaMRakzHxVy_r_QK6d5PShJ0f4SWcJzAdQ95gpLfWxZ2mEA/viewform?usp=header"
        className="border-2 border-[#d7b84a] px-8 py-4 bold text-[#d7b84a]" 
        target="_blank"
        >
          ¡Inscribete Aqui!
        </a>
      </div>
      <div className="flex flex-col items-center gap-8 px-32 py-16 bg-[#152a42]">
        <div className="flex gap-4">
          <a href="/swiss" className="px-8 py-4 w-32 text-center bold bg-[#e5e7eb] text-[#4b5563] rounded-md text-[18px] shadow-md">
            Swiss
          </a>
          <a href="/playoffs" className="px-8 py-4 w-32 text-center bold bg-[#e5e7eb] text-[#4b5563] rounded-md text-[18px] shadow-md">
            Playoffs
          </a>
        </div>
        <div className="flex flex-col items-center gap-8">
          <h2 className="text-4xl font-bold text-white">Formato del torneo</h2>
          <p className="text-white text-center">
            La estructura de la competencia de la AUT Major League emplea un sistema diseñado para garantizar la equidad y maximizar el tiempo de juego de los participantes:
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-16 max-w-6xl mx-auto my-16 px-4">
        <div className="grid grid-cols-[1fr] sm:grid-cols-[1fr_1fr] items-center justify-items-center gap-16">
            <div className="w-full h-full flex flex-col items-center text-center w-full bg-[#152a42] p-8 gap-6 rounded-xl shadow-lg border border-slate-700">
                <div className="flex items-center justify-center w-16 h-16 text-3xl font-bold text-[#d7b84a] rounded-full border-2 border-[#d7b84a]">1</div>
                <div>
                    <span className="block text-2xl text-white font-bold mb-1">Fase Regular</span>
                    <span className="text-xl text-[#d7b84a] font-bold">(Sistema Suizo)</span>
                </div>
                <p className="text-md text-slate-300 leading-relaxed">Se compite en formato suizo, asegurando enfrentamientos contra oponentes con un historial de victorias similar. Este sistema permite una clasificación justa basada en el desempeño real durante el torneo.</p>
            </div>
            <div className="w-full h-full flex flex-col items-center text-center w-full bg-[#152a42] p-8 gap-6 rounded-xl shadow-lg border border-slate-700">
                <div className="flex items-center justify-center w-16 h-16 text-3xl font-bold text-[#d7b84a] rounded-full border-2 border-[#d7b84a]">2</div>
                <div>
                    <span className="block text-2xl text-white font-bold mb-1">Fase Final</span>
                    <span className="text-xl text-[#d7b84a] font-bold">(Playoffs)</span>
                </div>
                <p className="text-md text-slate-300 leading-relaxed">Los equipos con mejor rendimiento en la fase suiza avanzan a un cuadro de eliminación directa. En esta instancia, la precisión y la estrategia definen al campeón de la liga. Demostrá tu nivel y competí por la gloria.</p>
            </div>
        </div>
        <div className="flex flex-col justify-start items-center w-full">
            <div className="w-full bg-[#152a42] p-6 rounded-xl shadow-lg border border-slate-700">
                <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
                     <h3 className="text-xl font-bold text-white uppercase tracking-wider">Equipos inscriptos</h3>
                     <span className="text-xs font-bold text-[#d7b84a] bg-[#d7b84a]/10 px-2 py-1 rounded border border-[#d7b84a]/20">16 EQUIPOS</span>
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
                             <p className="text-slate-500 italic">Cargando equipos...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
      <footer className="flex flex-col items-center gap-6 bg-[#152a42] p-16 border-t border-slate-800">
        <img className="w-32 opacity-90" src="Aut-Logo.png" alt="Aut Logo" />
        
        <div className="flex items-center gap-6">
           {/* Instagram */}
           <a href="https://www.instagram.com/aut_major_league/" target="_blank" rel="noopener noreferrer" className="group p-3 bg-white/5 rounded-full hover:bg-[#d7b84a] transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:text-[#152a42]">
                 <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
           </a>

           {/* Twitch */}
           <a href="https://www.twitch.tv/autmajorleague" target="_blank" rel="noopener noreferrer" className="group p-3 bg-white/5 rounded-full hover:bg-[#9146FF] transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                 <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"/>
              </svg>
           </a>

            {/* Discord */}
           <a href="https://discord.gg/zgZ8a8EYbm" target="_blank" rel="noopener noreferrer" className="group p-3 bg-white/5 rounded-full hover:bg-[#5865F2] transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                 <circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M7.5 7.5c3.5-1 5.5-1 9 0"/><path d="M7 16.5c3.5 1 6.5 1 10 0"/><path d="M2 12c0 5 2 9 7 11 0-4-2-6-3-7 4-1 8-1 12 0-1 1-3 3-3 7 5-2 7-6 7-11S17 2 12 2 7 2 2 12z"/>
              </svg>
           </a>
        </div>

        <p className="text-slate-400 text-sm">© 2026 AUT Major League. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};
