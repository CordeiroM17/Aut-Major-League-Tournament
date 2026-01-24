import React from 'react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

export const DiscordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-surface text-text-main relative overflow-hidden">
      <video
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
        src="/images/Loop_1.webm"
        autoPlay
        loop
        muted
        playsInline
        style={{ opacity: 0.15 }}
      />
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl mx-auto bg-blue-header opacity-90 rounded-xl shadow-lg p-12 gap-8 my-16">
        <div className="flex flex-col justify-center items-start flex-1">
          <div className="flex items-center mb-4">
            <img
              src="/discord-icon.png"
              alt="Discord"
              className="w-12 h-12 mr-2 object-contain"
              style={{ aspectRatio: '1 / 1', maxWidth: '3rem', maxHeight: '3rem' }}
              onError={(e) => { e.currentTarget.src = '/images/discord-icon.png'; }}
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Únete a nuestro canal de <span className="text-gold">Discord</span>
          </h1>
          <p className="mb-8 text-text-main">
            Reunimos equipos apasionados, enfrentamientos de alto nivel y una comunidad que vive el juego con seriedad y compromiso. AUT Major League es una competencia amateur de League of Legends creada para impulsar el talento emergente y brindar una experiencia competitiva organizada y transparente.
          </p>
          <button
            onClick={() => window.open('https://discord.gg/zgZ8a8EYbm', '_blank')}
            className="cursor-pointer border border-gold text-gold px-8 py-3 rounded-md font-bold text-lg hover:bg-gold hover:text-blue-header transition-colors duration-200"
          >
            Unirme ›
          </button>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 pt-4">
          <img src="/images/logo.png" alt="AUT Major League" className="w-64 drop-shadow-lg" />
        </div>
      </div>
      <Footer />
    </div>
  );
};
