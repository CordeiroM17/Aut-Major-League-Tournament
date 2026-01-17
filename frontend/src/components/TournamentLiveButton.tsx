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
        className={`flex items-center space-x-2 bg-slate-100 rounded-full px-4 py-1 transition-colors duration-200 mb-6 bg-slate-100 rounded-full border border-slate-200 w-full justify-center ${isLive ? 'ring-2 ring-emerald-400 cursor-pointer' : ''}`}
        disabled={loading}
        title={isLive ? 'En directo' : 'Canal de twitch'}
      >
        <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${isLive ? 'text-emerald-700' : 'text-slate-600'}`}>
          {isLive ? 'En directo' : 'Canal de twitch'}
        </span>
      </a>    
    </div>
    
  );
};
