import React, { useState, useEffect } from 'react';
import { TopPlayers } from '../components/TopPlayers';
import { Match, Team } from '../types';
import { TeamModal, TeamPlayer } from '../components/TeamModal';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
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
      <main>
        <div className="bg-blue-primary min-h-[calc(100vh-4rem)] flex flex-col justify-center relative overflow-hidden">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
            src="/images/Loop_1.webm"
            autoPlay
            loop
            muted
            style={{ opacity: 0.20 }} // Opacity matching Discord
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
        {/* FORMATO DEL TORNEO - NUEVO DISEÑO */}
        <section className="bg-blue-primary border-b border-blue-secondary py-8 px-4">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center text-gold tracking-wide mb-2 uppercase" style={{letterSpacing: '0.04em'}}>FORMATO DEL TORNEO</h2>
            <p className="text-text-main text-center text-base sm:text-lg max-w-2xl mb-6">La estructura de la competencia de la AUT Major League emplea un sistema diseñado para garantizar la equidad y maximizar el tiempo de juego de los participantes.</p>
            <img src="/images/lux.png" alt="Lux" className="w-20 sm:w-28 mx-auto mb-6" />
            <div className="flex flex-col xs:flex-row justify-between items-center gap-4 mb-10">
              <button
                onClick={() => navigate('/swiss')}
                className="flex items-center justify-center py-2 w-[140px] font-bold border border-gold rounded-sm text-base shadow-md cursor-pointer transition-all duration-300 bg-blue-primary/70 text-gold hover:bg-gold/95 hover:text-blue-primary tracking-widest"
              >
                SWISS
              </button>
              <button
                onClick={() => navigate('/playoffs')}
                className="flex items-center justify-center py-2 w-[140px] font-bold border border-gold rounded-sm text-base shadow-md cursor-pointer transition-all duration-300 bg-blue-primary/70 text-gold hover:bg-gold/95 hover:text-blue-primary tracking-widest"
              >
                PLAYOFFS
              </button>
            </div>
            <div className="flex flex-col md:flex-row gap-8 w-full mt-4 px-2">
              {/* Fase Regular */}
              <div className="flex-1 bg-blue-secondary rounded-xl shadow-lg border border-gold/30 flex flex-col items-center p-8 lg:max-w-[500px] mx-auto">
                <div className="flex items-center justify-center w-14 h-14 text-2xl font-bold text-gold rounded-full border-2 border-gold mb-4">1</div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-text-main mb-1 uppercase">Fase Regular</h3>
                <h4 className="text-gold font-bold text-base mb-2">(Sistema Suizo)</h4>
                <p className="text-slate-300 text-center text-sm sm:text-base">Se compite en formato suizo, asegurando enfrentamientos contra oponentes con un historial de victorias similar. Este sistema permite una clasificación justa basada en el desempeño real durante el torneo.</p>
              </div>
              {/* Fase Final */}
              <div className="flex-1 bg-blue-secondary rounded-xl shadow-lg border border-gold/30 flex flex-col items-center p-8 lg:max-w-[500px] mx-auto">
                <div className="flex items-center justify-center w-14 h-14 text-2xl font-bold text-gold rounded-full border-2 border-gold mb-4">2</div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-text-main mb-1 uppercase">Fase Final</h3>
                <h4 className="text-gold font-bold text-base mb-2">(Playoffs)</h4>
                <p className="text-slate-300 text-center text-sm sm:text-base">Los equipos con mejor rendimiento en la fase suiza avanzan a un cuadro de eliminación directa. En esta instancia, la precisión y la estrategia definen al campeón de la liga. Demostrá tu nivel y competí por la gloria.</p>
              </div>
            </div>
          </div>
        </section>
        <div id="equipos" className="bg-gold border-t border-blue-primary relative overflow-hidden">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
            src="/images/Loop_1.webm"
            autoPlay
            loop
            muted
            style={{ opacity: 0.35 }} // Opacity matching other pages
          />
          <div className="grid grid-cols-1 gap-8 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
            {/* Eliminados cuadros antiguos de Fase Regular y Fase Final en la sección de equipos */}
          <div className="flex flex-col justify-start items-center w-full">
            <div className="w-full bg-blue-primary p-6 rounded-xl shadow-lg border border-slate-700">
                <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-text-main uppercase tracking-wider">Equipos</h2>
                  <p className="text-xs font-bold text-gold bg-gold/10 px-2 py-1 rounded border border-gold/20">{teams.length} Equipos</p>
                </div>
                
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    {Array.from({ length: 16 }).map((_, index) => {
                      const team = teams[index];
                      return team ? (
                        <div
                          key={team.id}
                          className="flex items-center justify-between p-2 pl-3 bg-blue-secondary rounded-lg border border-slate-800 hover:border-slate-600 transition-colors cursor-pointer"
                          onClick={() => { setSelectedTeam(team); setModalOpen(true); }}
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <span className="text-text-dark font-mono text-xs w-5 flex-shrink-0">{(index + 1).toString().padStart(2, '0')}</span>
                            <img src={team.logo} className="w-6 h-6 rounded-full border border-slate-700 bg-slate-800 object-cover flex-shrink-0" alt="" />
                            <span className="text-xs sm:text-sm font-bold text-slate-200 truncate">
                              {team.name}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={`slot-${index+1}`}
                          className="flex items-center justify-between p-2 pl-3 bg-blue-secondary/60 rounded-lg border border-slate-800 text-slate-400 italic"
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <span className="text-text-dark font-mono text-xs w-5 flex-shrink-0">{(index + 1).toString().padStart(2, '0')}</span>
                            <div className="w-6 h-6 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center text-xs flex-shrink-0">-</div>
                            <span className="text-xs sm:text-sm font-semibold truncate">Cupo disponible</span>
                          </div>
                        </div>
                      );
                    })}
                    <TeamModal
                      open={modalOpen && !!selectedTeam}
                      onClose={() => setModalOpen(false)}
                      logo={selectedTeam?.logo || ''}
                      name={selectedTeam?.name || ''}
                      description={selectedTeam ? getTeamDescription(selectedTeam) : ''}
                      players={selectedTeam ? getTeamPlayers(selectedTeam) : []}
                    />
                  </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};
