import React from 'react';
import { useNavigate } from 'react-router-dom';

const rules = [
  {
    title: 'Importante.',
    description:
      'Esta es tu página de Servicios. Es una gran oportunidad para proveer información. Haz doble clic en la caja de texto para editar tu contenido y asegurarte de agregar todos los detalles relevantes que quieras compartir con tus visitantes.',
    highlight: true,
  },
  {
    title: 'Nombre de la regla',
    description:
      'Esta es tu página de Servicios. Es una gran oportunidad para proveer información. Haz doble clic en la caja de texto para editar tu contenido y asegurarte de agregar todos los detalles relevantes que quieras compartir con tus visitantes.',
    highlight: false,
    number: 1,
  },
  // Puedes agregar más reglas aquí
];

export const ReglamentoPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#152a42] min-h-screen text-[#f3f3f3]">
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
                { label: 'Reglamento', href: '/reglamento', active: true },
                { label: 'Inscribirse', href: 'https://forms.gle/cEAKt88AKbkG64FU9', active: false },
                { label: 'Discord', href: '/discord', active: false },
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

      <div className="relative w-full h-[320px] flex flex-col items-center justify-center overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src="/src/resources/Loop_1.webm"
          autoPlay
          loop
          muted
          style={{ opacity: 0.3 }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <img
            src="/src/resources/logo.png"
            alt="AUT Major League"
            className="w-32 mb-4 drop-shadow-lg"
          />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mt-2 mb-2">Reglamento y Normas de la Comunidad</h1>
        </div>
      </div>
      {/* Rules content section */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Importante - left, header color, fills left side */}
        <div className="bg-[#152A42] p-12 flex flex-col justify-start min-h-[320px] w-full">
          <span className="text-2xl font-bold text-[#d7b84a] mb-4">Importante.</span>
          <p className="text-base text-[#f3f3f3] leading-relaxed mb-6">Esta es tu página de Servicios. Es una gran oportunidad para proveer información. Haz doble clic en la caja de texto para editar tu contenido y asegurarte de agregar todos los detalles relevantes que quieras compartir con tus visitantes.</p>
          <img src="/src/resources/poro.png" alt="Poro" className="w-32 mx-auto mt-2" />
        </div>
        {/* Nombre de la regla - right, darker color, fills right side */}
        <div className="bg-[#101a28] p-12 flex flex-col justify-start min-h-[320px] w-full">
          <div className="flex items-center mb-4">
            <span className="text-[#d7b84a] text-2xl font-bold mr-2">1</span>
            <span className="text-xl font-bold text-[#d7b84a]">Nombre de la regla</span>
          </div>
          <p className="text-base text-[#f3f3f3] leading-relaxed">Esta es tu página de Servicios. Es una gran oportunidad para proveer información. Haz doble clic en la caja de texto para editar tu contenido y asegurarte de agregar todos los detalles relevantes que quieras compartir con tus visitantes.</p>
        </div>
      </div>
      </div>
  );
};
