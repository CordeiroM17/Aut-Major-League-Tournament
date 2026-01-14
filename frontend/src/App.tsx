
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TournamentPage } from './pages/TournamentPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/swiss" element={<TournamentPage />} />
        <Route path="/" element={
          <div style={{textAlign:'center',marginTop:40}}>
            <h1>Bienvenido al Lobby</h1>
            <p>Página principal reservada para el hub.</p>
            <div style={{marginTop:32, display:'flex', flexDirection:'column', gap:16, alignItems:'center'}}>
              <a href="/swiss" style={{
                padding:'12px 32px',
                background:'#6366f1',
                color:'#fff',
                borderRadius:8,
                fontWeight:'bold',
                textDecoration:'none',
                fontSize:18,
                boxShadow:'0 2px 8px #0001',
                transition:'background 0.2s'
              }}>Ir a Swiss Format</a>
              <button disabled style={{
                padding:'12px 32px',
                background:'#e5e7eb',
                color:'#6b7280',
                borderRadius:8,
                fontWeight:'bold',
                fontSize:18,
                border:'none',
                opacity:0.7,
                cursor:'not-allowed',
                marginTop:8
              }}>Ir a Playoffs (próximamente)</button>
            </div>
          </div>
        } />
        <Route path="*" element={<Navigate to="/swiss" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
