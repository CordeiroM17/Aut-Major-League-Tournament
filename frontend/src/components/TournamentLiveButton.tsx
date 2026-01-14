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
    <button
      className={`flex items-center space-x-2 bg-slate-100 rounded-full px-4 py-1 border border-slate-200 transition-colors duration-200 ${isLive ? 'ring-2 ring-emerald-400' : ''}`}
      disabled={loading}
      title={isLive ? 'En directo' : 'En directo'}
    >
      <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
      <span className={`text-xs font-semibold uppercase tracking-wider ${isLive ? 'text-emerald-700' : 'text-slate-600'}`}>
        {isLive ? 'En directo' : 'En directo'}
      </span>
    </button>
  );
};
