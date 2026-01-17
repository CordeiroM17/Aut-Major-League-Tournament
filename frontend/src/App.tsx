
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TournamentPage } from './pages/TournamentPage';
import { PlayoffsPage } from './pages/PlayoffsPage';

import { MainPage } from './pages/MainPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/swiss" element={<TournamentPage />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/playoffs" element={<PlayoffsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
