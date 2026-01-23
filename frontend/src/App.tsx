
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TournamentPage } from './pages/TournamentPage';
import { PlayoffsPage } from './pages/PlayoffsPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MainPage } from './pages/MainPage';
import { ReglamentoPage } from './pages/ReglamentoPage';
import { DiscordPage } from './pages/DiscordPage';
import { AdminPage } from './pages/AdminPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/aut-gang-tournament/*" element={<AdminPage />} />
        <Route path="/swiss/*" element={<TournamentPage />} />
        <Route path="/playoffs/*" element={<PlayoffsPage />} />
        <Route path="/reglamento" element={<ReglamentoPage />} />
        <Route path="/discord" element={<DiscordPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
