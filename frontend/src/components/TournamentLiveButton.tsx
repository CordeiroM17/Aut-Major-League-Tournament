import React, { useEffect, useState } from 'react';

export const TournamentLiveButton: React.FC = () => {
  const [isLive, setIsLive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchLiveStatus = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tournament/live`);
      const json = await res.json();
      setIsLive(json.isLive);
    } catch {
      setIsLive(false);
    }
  };

  useEffect(() => {
    fetchLiveStatus();
  }, []);

  const toggleLiveStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tournament/live`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isLive: !isLive })
      });
      const json = await res.json();
      setIsLive(json.isLive);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center">
      <a
        href="https://www.twitch.tv/autmajorleague"
        className={`flex items-center justify-between space-x-2 bg-blue-primary px-4 py-4 transition-colors duration-200 mb-6 rounded-lg w-full border-text-dark border xs:border-2 ${isLive ? 'ring-2 ring-emerald-400 cursor-pointer' : ''}`}
        disabled={loading}
        title={isLive ? 'En directo' : 'Canal de twitch'}
      >
        <div className="flex items-center space-x-2">
          <a href="https://www.twitch.tv/autmajorleague" target="_blank" rel="noopener noreferrer" className="group p-2 bg-gold/20 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
                <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"/>
            </svg>
          </a>
          <div className="flex flex-col">
            <h2 className="text-xs xs:text-sm bold text-gold uppercase">Transmision</h2>
            <p className="text-xs xs:text-sm text-text-main uppercase">Canal de twitch</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
          <span className={`text-[10px] xs:text-xs font-semibold uppercase tracking-wider ${isLive ? 'text-emerald-700' : 'text-text-dark'}`}>
            {isLive ? 'Live' : 'Desconectado'}
          </span>
        </div>
      </a>    
    </div>
    
  );
};
