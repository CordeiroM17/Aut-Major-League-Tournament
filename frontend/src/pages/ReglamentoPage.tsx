import React from 'react';
import { Header } from '../components/Header';

export const ReglamentoPage: React.FC = () => {
  return (
    <div className="bg-[#152a42] min-h-screen text-[#f3f3f3]">
      <Header active="reglamento" />
      <div className="relative w-full h-[220px] sm:h-[320px] flex flex-col items-center justify-center overflow-hidden px-2 sm:px-0 pb-8">
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
        <div className="bg-[#152A42] p-6 sm:p-12 flex flex-col justify-start min-h-[220px] sm:min-h-[320px] w-full">
          <span className="text-2xl font-bold text-[#d7b84a] mb-4">Importante.</span>
          <p className="text-base text-[#f3f3f3] leading-relaxed mb-6">Esta es tu página de Servicios. Es una gran oportunidad para proveer información. Haz doble clic en la caja de texto para editar tu contenido y asegurarte de agregar todos los detalles relevantes que quieras compartir con tus visitantes.</p>
          <img src="/src/resources/poro.png" alt="Poro" className="w-24 sm:w-32 mx-auto mt-2" />
        </div>
        {/* Nombre de la regla - right, darker color, fills right side */}
        <div className="bg-[#101a28] p-6 sm:p-12 flex flex-col justify-start min-h-[220px] sm:min-h-[320px] w-full">
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
