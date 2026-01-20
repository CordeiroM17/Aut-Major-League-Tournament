
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TournamentPage } from './pages/TournamentPage';
import { PlayoffsPage } from './pages/PlayoffsPage';
import { Footer } from './components/Footer';
import { MainPage } from './pages/MainPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/swiss/*" element={<TournamentPage />} />
        <Route path="/playoffs/*" element={<PlayoffsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
