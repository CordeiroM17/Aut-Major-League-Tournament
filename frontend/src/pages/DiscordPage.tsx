import React from 'react';
import { useNavigate } from 'react-router-dom';

export const DiscordPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen text-[#f3f3f3] relative overflow-hidden">
      {/* Overlay to match header color */}
      <div className="fixed top-0 left-0 w-full h-full bg-[#101a28] opacity-90 -z-9 pointer-events-none"></div>
      <video
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
        src="/src/resources/Loop_1.webm"
        autoPlay
        loop
        muted
        style={{ opacity: 0.9 }}
      />
      <header className="bg-[#18283a] border-b border-[#152A42] sticky top-0 z-30 shadow-sm" style={{ height: '100px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center h-full w-full justify-between">
            <div className="flex items-center h-full">
              <img src="/src/resources/Logo 3.png" alt="Logo AUT" className="h-14 w-auto" />
            </div>
            <div className="flex items-center h-full justify-center flex-1">
              {[
                { label: 'Overview', href: '/', active: false },
                { label: 'Equipos', href: '#equipos', active: false },
                { label: 'Reglamento', href: '/reglamento', active: false },
                { label: 'Inscribirse', href: 'https://forms.gle/cEAKt88AKbkG64FU9', active: false },
                { label: 'Discord', href: '/discord', active: true },
                { label: 'Swiss', href: '/swiss', active: false },
                { label: 'Playoffs', href: '/playoffs', active: false }
              ].map((link, idx, arr) => (
                <React.Fragment key={link.label}>
                  <button
                    className={`px-6 text-[18px] font-bold transition-colors duration-200 ${link.active ? 'text-[#d7b84a]' : 'text-white hover:text-[#d7b84a]'} bg-transparent`}
                    style={{ outline: 'none', border: 'none', background: 'none', cursor: 'pointer' }}
                    onClick={() => {
                      if (link.label === 'Equipos') {
                          navigate('/');
                          setTimeout(() => {
                            const equiposSection = document.getElementById('equipos');
                            if (equiposSection) {
                              equiposSection.scrollIntoView({ behavior: 'smooth' });
                            }
                          }, 300);
                          return;
                        }
                      if (link.label === 'Overview') {
                          navigate('/');
                          return;
                        }
                      if (link.href.startsWith('http')) {
                        window.open(link.href, '_blank');
                      } else {
                        navigate(link.href);
                      }
                    }}
                  >
                    {link.label}
                  </button>
                  {idx < arr.length - 1 && (
                    <span className="h-8 border-l border-[#f3f3f3] mx-2"></span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl mx-auto bg-[#18283a] bg-opacity-90 rounded-xl shadow-lg p-12 gap-8 mt-16">
        <div className="flex flex-col justify-center items-start flex-1">
          <div className="flex items-center mb-4">
            <img
              src="/public/discord-icon.png"
              alt="Discord"
              className="w-12 h-12 mr-2 object-contain"
              style={{ aspectRatio: '1 / 1', maxWidth: '3rem', maxHeight: '3rem' }}
              onError={(e) => { e.currentTarget.src = '/src/resources/discord-icon.png'; }}
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Únete a nuestro canal de <span className="text-[#d7b84a]">Discord</span>
          </h1>
          <p className="mb-8 text-[#f3f3f3]">
            Reunimos equipos apasionados, enfrentamientos de alto nivel y una comunidad que vive el juego con seriedad y compromiso. AUT Major League es una competencia amateur de League of Legends creada para impulsar el talento emergente y brindar una experiencia competitiva organizada y transparente.
          </p>
          <a
            href="https://discord.gg/zgZ8a8EYbm"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[#d7b84a] text-[#d7b84a] px-8 py-3 rounded-md font-bold text-lg hover:bg-[#d7b84a] hover:text-[#18283a] transition-colors duration-200"
          >
            Unirme ›
          </a>
        </div>
        <div className="flex flex-col items-center justify-center flex-1">
          <img src="/src/resources/logo.png" alt="AUT Major League" className="w-64 drop-shadow-lg" />
        </div>
      </div>
    </div>
  );
};
