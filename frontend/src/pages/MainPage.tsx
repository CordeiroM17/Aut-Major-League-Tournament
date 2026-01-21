import React, { useState, useEffect } from 'react';
import { TopPlayers } from '../components/TopPlayers';
import { Match, Team } from '../types';
import { TeamModal, TeamPlayer } from '../components/TeamModal';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Trophy } from 'lucide-react';

export const MainPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const navigate = useNavigate();
  // Helper to get description (if exists)
  const getTeamDescription = (team: any) => team.description || `Descripción de ${team.name}`;

  // Helper to get players (with isSub if present)
  const getTeamPlayers = (team: any): TeamPlayer[] => {
    if (!team.players) return [];
    return team.players.map((p: any) => ({
      name: p.name,
      role: p.role,
      opgg: p.opgg,
      isSub: p.isSub || false,
    }));
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/teams`);
        const data = await res.json();
        if (data.status === 'success') {
          setTeams(data.data);
        } else {
          setTeams([]);
        }
      } catch (err) {
        setTeams([]);
        console.error('Error fetching teams:', err);
      }
    };
    fetchTeams();
  }, []);

  return (
    <div className="bg-blue-primary">
      <Header active="overview" />
      <main>
        <div className="bg-blue-primary min-h-[calc(100vh-4rem)] flex flex-col justify-center relative overflow-hidden">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
            src="/src/resources/Loop_1.webm"
            autoPlay
            loop
            muted
            style={{ opacity: 0.5 }} // Cambia el valor de opacity aquí para ajustar la opacidad del video
          />
          <div className="w-full flex flex-col items-center gap-4 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
            <img className="w-auto max-w-48 sm:max-w-64" src="Aut-Logo.png" alt="Aut Logo" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-main text-center">Demostrá tu nivel, competí por la gloria</h1>
            <p className="text-text-main text-center text-sm lg:text-lg">AUT Major League es una competencia amateur de League of Legends creada para impulsar el talento emergente y brindar una experiencia competitiva única. </p>
            <p className="text-gold text-center text-sm lg:text-lg pb-6">Torneo exclusivo para el servidor LAS (Latin America South).</p>
            <button 
            onClick={() => window.open("https://forms.gle/cEAKt88AKbkG64FU9", "_blank")}
            className="border-2 border-gold px-8 py-4 bold rounded-md text-[18px] shadow-md cursor-pointer transition-all duration-300 bg-blue-primary/70 text-gold hover:bg-gold/95 hover:text-blue-primary"
            >
              ¡Inscribete Aqui!
            </button>
          </div>
        </div>
        <div className="bg-blue-primary">
          <div className="flex flex-col items-center gap-4 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-text-main">
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-text-main">Formato del torneo</h2>
              <p className="text-text-main text-center text-sm lg:text-lg pb-4">
                La estructura de la competencia de la AUT Major League emplea un sistema diseñado para garantizar la equidad y maximizar el tiempo de juego de los participantes.
              </p>
              <img src="/src/resources/lux.png" alt="Lux" className="w-24 sm:w-32 mx-auto" />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/swiss')}
                className="px-8 py-4 w-32 text-center bold border-2 border-gold rounded-md text-[18px] shadow-md cursor-pointer transition-all duration-300 bg-blue-primary/70 text-gold hover:bg-gold/95 hover:text-blue-primary"
              >
                Swiss
              </button>
              <button
                onClick={() => navigate('/playoffs')}
                className="px-8 py-4 w-32 text-center bold border-2 border-gold rounded-md text-[18px] shadow-md cursor-pointer transition-all duration-300 bg-blue-primary/70 text-gold hover:bg-gold/95 hover:text-blue-primary"
              >
                Playoffs
              </button>
            </div>
          </div>
        </div>
        <div id="equipos" className="bg-gold border-t border-blue-primary relative overflow-hidden">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
            src="/src/resources/Loop_1.webm"
            autoPlay
            loop
            muted
            style={{ opacity: 0.3 }} // Cambia el valor de opacity aquí para ajustar la opacidad del video
          />
          <div className="grid grid-cols-1 gap-8 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-[1fr] sm:grid-cols-[1fr_1fr] items-center justify-items-center gap-8">
              <div className="w-full h-full flex flex-col items-center text-center w-full bg-blue-primary p-8 gap-4 rounded-xl shadow-lg border border-slate-700">
                <div className="flex items-center justify-center w-16 h-16 text-3xl font-bold text-gold rounded-full border-2 border-gold">1</div>
                <div>
                  <h2 className="block text-xl sm:text-2xl lg:text-3xl text-text-main font-bold mb-1">
                    Fase Regular
                  </h2>
                  <h2 className="text-lg sm:text-xl lg:text-2xl text-gold font-bold">
                    (Sistema Suizo)
                  </h2>
                </div>
                <p className="text-sm lg:text-lg text-slate-300 leading-relaxed">Se compite en formato suizo, asegurando enfrentamientos contra oponentes con un historial de victorias similar. Este sistema permite una clasificación justa basada en el desempeño real durante el torneo.</p>
              </div>
              <div className="w-full h-full flex flex-col items-center text-center w-full bg-blue-primary p-8 gap-4 rounded-xl shadow-lg border border-slate-700">
                <div className="flex items-center justify-center w-16 h-16 text-3xl font-bold text-gold rounded-full border-2 border-gold">2</div>
                <div>
                  <h2 className="block text-xl sm:text-2xl lg:text-3xl text-text-main font-bold mb-1">Fase Final</h2>
                  <h2 className="text-lg sm:text-xl lg:text-2xl text-gold font-bold">(Playoffs)</h2>
                </div>
                <p className="text-sm lg:text-lg text-slate-300 leading-relaxed">Los equipos con mejor rendimiento en la fase suiza avanzan a un cuadro de eliminación directa. En esta instancia, la precisión y la estrategia definen al campeón de la liga. Demostrá tu nivel y competí por la gloria.</p>
              </div>
          </div>
          <div className="flex flex-col justify-start items-center w-full">
            <div className="w-full bg-blue-primary p-6 rounded-xl shadow-lg border border-slate-700">
                <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-text-main uppercase tracking-wider">Equipos</h2>
                    <p className="text-xs font-bold text-gold bg-gold/10 px-2 py-1 rounded border border-gold/20">{teams.length} Equipos</p>
                </div>
                
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    {teams.map((team, index) => (
                    <div
                    key={team.id}
                    className="flex items-center justify-between p-2 pl-3 bg-blue-secondary rounded-lg border border-slate-800 hover:border-slate-600 transition-colors cursor-pointer"
                    onClick={() => { setSelectedTeam(team); setModalOpen(true); }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-slate-500 font-mono text-xs w-5">{(index + 1).toString().padStart(2, '0')}</span>
                        <img src={team.logo} className="w-6 h-6 rounded-full border border-slate-700 bg-slate-800 object-cover" alt="" />
                        <span className="text-xs sm:text-sm font-bold text-slate-200 truncate">
                          {team.name}
                        </span>
                      </div>
                    </div>
                    ))}
                          <TeamModal
                            open={modalOpen && !!selectedTeam}
                            onClose={() => setModalOpen(false)}
                            logo={selectedTeam?.logo || ''}
                            name={selectedTeam?.name || ''}
                            description={selectedTeam ? getTeamDescription(selectedTeam) : ''}
                            players={selectedTeam ? getTeamPlayers(selectedTeam) : []}
                          />
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
