import React, { useState, useEffect } from 'react';
import { Team, Match, MatchDetails, PlayerStats } from '../types';
import { Save, Plus, Trash2, Edit2, Check, RefreshCw } from 'lucide-react';

export const AdminPage: React.FC = () => {
    const [token, setToken] = useState<string>(localStorage.getItem('adminToken') || '');
    const [activeTab, setActiveTab] = useState<'teams' | 'matches' | 'playoffs'>('teams');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Initial Data Fetching
    const [teams, setTeams] = useState<Team[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);
    // Playoff matches fetching would go here

    useEffect(() => {
        localStorage.setItem('adminToken', token);
    }, [token]);

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    const fetchTeams = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/teams`);
            const json = await res.json();
            if (json.status === 'success') setTeams(json.data);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchMatches = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/matches`);
            const json = await res.json();
            if (json.status === 'success') setMatches(json.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchTeams();
        fetchMatches();
    }, []);

    // --- FORMS STATES ---
    
    // TEAM FORM
    const [newTeam, setNewTeam] = useState<Partial<Team>>({
        id: '',
        name: '',
        seed: 0,
        logo: '',
    });
    const [newTeamPlayers, setNewTeamPlayers] = useState<{name: string, role: string, opgg: string}[]>([
        { name: '', role: 'TOP', opgg: '' },
        { name: '', role: 'JG', opgg: '' },
        { name: '', role: 'MID', opgg: '' },
        { name: '', role: 'ADC', opgg: '' },
        { name: '', role: 'SUP', opgg: '' },
        { name: '', role: 'SUB', opgg: '' }, // Substitute 1
        { name: '', role: 'SUB', opgg: '' }, // Substitute 2
    ]);

    const handleCreateTeam = async () => {
        if (!token) return showMessage('error', 'Token requerido');
        
        // Filter out substitutes with empty names
        const validPlayers = newTeamPlayers.filter(p => p.name.trim() !== '');
        
        if (validPlayers.length === 0) return showMessage('error', 'Debe haber al menos un jugador');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/teams`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ ...newTeam, players: validPlayers })
            });
            const json = await res.json();
            if (res.ok) {
                showMessage('success', 'Equipo creado');
                fetchTeams();
                // Reset form could be better but keeping it simple
            } else {
                showMessage('error', json.message || 'Error creando equipo');
            }
        } catch (e) {
            showMessage('error', 'Error de red');
        }
    };

    // MATCH FORM (Create)
    const [newMatch, setNewMatch] = useState({
        id: '',
        round: 1,
        team1Id: '',
        team2Id: ''
    });

    const handleCreateMatch = async () => {
         if (!token) return showMessage('error', 'Token requerido');
         try {
             const res = await fetch(`${import.meta.env.VITE_API_URL}/api/matches`, {
                 method: 'POST',
                 headers: { 
                     'Content-Type': 'application/json',
                     'Authorization': `Bearer ${token}` 
                 },
                 body: JSON.stringify(newMatch)
             });
             const json = await res.json();
             if (res.ok) {
                 showMessage('success', 'Partido creado');
                 fetchMatches();
             } else {
                 showMessage('error', json.message || 'Error creando partido');
             }
         } catch (e) {
             showMessage('error', 'Error de red');
         }
    };
    
    // MATCH UPDATE FORM
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const [matchUpdateData, setMatchUpdateData] = useState<{
        score1: number,
        score2: number,
        winnerId: string,
        status: 'pending' | 'completed',
        details: MatchDetails
    }>({
        score1: 0,
        score2: 0,
        winnerId: '',
        status: 'pending',
        details: { team1Players: [], team2Players: [], team1Bans: [], team2Bans: [] }
    });

    // Populate update form when selecting a match
    useEffect(() => {
        if (selectedMatch) {
            setMatchUpdateData({
                score1: selectedMatch.score1,
                score2: selectedMatch.score2,
                winnerId: selectedMatch.winnerId || '',
                status: selectedMatch.status,
                details: selectedMatch.details || { 
                    team1Players: Array(5).fill({ name: '', role: 'TOP', champion: '', k: 0, d: 0, a: 0, opgg: '' }), 
                    team2Players: Array(5).fill({ name: '', role: 'TOP', champion: '', k: 0, d: 0, a: 0, opgg: '' }),
                    team1Bans: [],
                    team2Bans: []
                }
            });
             if (!selectedMatch.details || !selectedMatch.details.team1Players || selectedMatch.details.team1Players.length === 0) {
                 setMatchUpdateData(prev => ({
                     ...prev,
                     details: {
                         ...prev.details,
                         team1Players: Array(5).fill({ name: '', role: 'TOP', champion: '', k: 0, d: 0, a: 0, opgg: '' }),
                         team2Players: Array(5).fill({ name: '', role: 'TOP', champion: '', k: 0, d: 0, a: 0, opgg: '' }),
                     }
                 }))
             }
        }
    }, [selectedMatch]);

    const handleUpdateMatch = async () => {
         if (!token) return showMessage('error', 'Token requerido');
         if (!selectedMatch) return;

         try {
             const res = await fetch(`${import.meta.env.VITE_API_URL}/api/matches/${selectedMatch.id}`, {
                 method: 'PUT',
                 headers: { 
                     'Content-Type': 'application/json',
                     'Authorization': `Bearer ${token}` 
                 },
                 body: JSON.stringify(matchUpdateData)
             });
             const json = await res.json();
             if (res.ok) {
                 showMessage('success', 'Partido actualizado');
                 fetchMatches();
                 setSelectedMatch(null);
             } else {
                 showMessage('error', json.message || 'Error actualizando partido');
             }
         } catch (e) {
             showMessage('error', 'Error de red');
         }
    };


    const updatePlayerStat = (team: 1 | 2, index: number, field: keyof PlayerStats, value: any) => {
        const key = team === 1 ? 'team1Players' : 'team2Players';
        const newPlayers = [...matchUpdateData.details[key]];
        // Ensure object exists
        if (!newPlayers[index]) newPlayers[index] = { name: '', role: 'TOP', champion: '', k: 0, d: 0, a: 0, opgg: '' } as PlayerStats;
        
        newPlayers[index] = { ...newPlayers[index], [field]: value };
        
        setMatchUpdateData({
            ...matchUpdateData,
            details: {
                ...matchUpdateData.details,
                [key]: newPlayers
            }
        });
    };

    // --- PLAYOFFS LOGIC ---
    const [playoffMatches, setPlayoffMatches] = useState<any[]>([]);
    const [newPlayoffMatch, setNewPlayoffMatch] = useState({ id: '', stage: 'QF', team1Id: '', team2Id: '' });
    const [selectedPlayoffMatch, setSelectedPlayoffMatch] = useState<any | null>(null);
    const [playoffWinnerId, setPlayoffWinnerId] = useState('');
    const [playoffGames, setPlayoffGames] = useState<any[]>([]);

    const fetchPlayoffMatches = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/playoffs`);
            const json = await res.json();
            if (json.status === 'success') setPlayoffMatches(json.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchPlayoffMatches();
    }, []);

    const handleCreatePlayoffMatch = async () => {
        if (!token) return showMessage('error', 'Token requerido');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/playoffs`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(newPlayoffMatch)
            });
            if (res.ok) {
                showMessage('success', 'Partido Playoff creado');
                fetchPlayoffMatches();
            } else {
                showMessage('error', 'Error creando partido');
            }
        } catch (e) {
            showMessage('error', 'Error de red');
        }
    };

    const createEmptyGame = (num: number) => ({
        gameNumber: num,
        score1: 0,
        score2: 0,
        team1Players: Array(5).fill({ name: '', role: 'TOP', champion: '', k: 0, d:  0, a: 0 }),
        team2Players: Array(5).fill({ name: '', role: 'TOP', champion: '', k: 0, d:  0, a: 0 }),
        team1Bans: [],
        team2Bans: []
    });

    useEffect(() => {
        if (selectedPlayoffMatch) {
            setPlayoffWinnerId(selectedPlayoffMatch.winnerId || '');
            if (selectedPlayoffMatch.games && selectedPlayoffMatch.games.length > 0) {
                setPlayoffGames(selectedPlayoffMatch.games);
            } else {
                setPlayoffGames([createEmptyGame(1)]);
            }
        }
    }, [selectedPlayoffMatch]);

    const updateGameStat = (gameIdx: number, field: string, value: any) => {
        const newGames = [...playoffGames];
        newGames[gameIdx] = { ...newGames[gameIdx], [field]: value };
        setPlayoffGames(newGames);
    };

    const updateGamePlayer = (gameIdx: number, team: 1 | 2, pIdx: number, field: string, value: any) => {
        const newGames = [...playoffGames];
        const key = team === 1 ? 'team1Players' : 'team2Players';
        const players = [...newGames[gameIdx][key]];
        players[pIdx] = { ...players[pIdx], [field]: value };
        newGames[gameIdx][key] = players;
        setPlayoffGames(newGames);
    };

    const handleUpdatePlayoffMatch = async () => {
        if (!token) return showMessage('error', 'Token requerido');
        if (!selectedPlayoffMatch) return;
        
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/playoffs/${selectedPlayoffMatch.id}/winner`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ winnerId: playoffWinnerId, games: playoffGames })
            });

            if (res.ok) {
                showMessage('success', 'Serie actualizada con éxito');
                fetchPlayoffMatches();
                setSelectedPlayoffMatch(null);
            } else {
                const json = await res.json();
                showMessage('error', json.message || 'Error actualizando serie');
            }
        } catch (e) {
            showMessage('error', 'Error de red');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* HEAD & AUTH */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <input 
                            type="password" 
                            placeholder="Admin Token" 
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 text-sm w-64"
                        />
                        {token && <div className="text-green-500 font-bold text-xs">Token Saved</div>}
                    </div>
                </div>

                {/* TABS */}
                <div className="flex space-x-2 border-b border-slate-200">
                    {(['teams', 'matches', 'playoffs'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-bold text-sm uppercase tracking-wide transition-colors ${
                                activeTab === tab 
                                ? 'text-gold border-b-2 border-gold bg-gold/10' 
                                : 'text-text-dark hover:text-slate-800'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {message && (
                    <div className={`p-4 rounded-lg font-bold text-center ${message.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {message.text}
                    </div>
                )}

                {/* TEAMS CONTENT */}
                {activeTab === 'teams' && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h2 className="text-lg font-bold text-slate-800 mb-6">Crear Nuevo Equipo</h2>
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="label-std">ID Equipo</label>
                                    <input placeholder="ej: aut-crows" className="input-std w-full" value={newTeam.id} onChange={e => setNewTeam({...newTeam, id: e.target.value})} />
                                </div>
                                <div>
                                    <label className="label-std">Nombre</label>
                                    <input placeholder="ej: AUT Crows" className="input-std w-full" value={newTeam.name} onChange={e => setNewTeam({...newTeam, name: e.target.value})} />
                                </div>
                                <div>
                                    <label className="label-std">Seed</label>
                                    <input placeholder="Num" type="number" className="input-std w-full" value={newTeam.seed} onChange={e => setNewTeam({...newTeam, seed: parseInt(e.target.value)})} />
                                </div>
                                <div>
                                    <label className="label-std">Logo URL</label>
                                    <input placeholder="https://..." className="input-std w-full" value={newTeam.logo} onChange={e => setNewTeam({...newTeam, logo: e.target.value})} />
                                </div>
                                <div className="col-span-2">
                                    <label className="label-std">Descripción (máx 100 caracteres)</label>
                                    {/* Abajo se cambia el limite de caracteres */}
                                    <textarea
                                        className="input-std w-full"
                                        maxLength={100} // <-- Acaaaaaaa se cambia el limite de caracteressss
                                        rows={2}
                                        placeholder="Descripción del equipo..."
                                        value={newTeam.description || ''}
                                        onChange={e => setNewTeam({...newTeam, description: e.target.value})}
                                    />
                                    <div className="text-xs text-slate-400 text-right">{(newTeam.description?.length || 0)}/100</div>
                                </div>
                            </div>
                            
                            <h3 className="text-sm font-bold text-text-dark uppercase mb-4">Jugadores (Titulares y Suplentes)</h3>
                            <div className="space-y-3">
                                {newTeamPlayers.map((player, i) => (
                                    <div key={i} className="flex gap-4 items-center">
                                       <div className="w-8 text-xs font-bold text-slate-400 text-right">{i < 5 ? 'Tit' : 'Sup'}</div>
                                        <select 
                                            value={player.role} 
                                            onChange={e => {
                                                const newPlayers = [...newTeamPlayers];
                                                newPlayers[i].role = e.target.value;
                                                setNewTeamPlayers(newPlayers);
                                            }}
                                            className="w-24 bg-slate-50 border border-slate-200 rounded p-2 text-sm"
                                        >
                                            {['TOP', 'JG', 'MID', 'ADC', 'SUP', 'SUB'].map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                        <input 
                                            placeholder={`Nombre Player ${i+1}`} 
                                            className="flex-1 bg-slate-50 border border-slate-200 rounded p-2 text-sm"
                                            value={player.name}
                                            onChange={e => {
                                                const newPlayers = [...newTeamPlayers];
                                                newPlayers[i].name = e.target.value;
                                                setNewTeamPlayers(newPlayers);
                                            }}
                                        />
                                        <input 
                                            placeholder="OP.GG URL" 
                                            className="flex-1 bg-slate-50 border border-slate-200 rounded p-2 text-sm"
                                            value={player.opgg}
                                            onChange={e => {
                                                const newPlayers = [...newTeamPlayers];
                                                newPlayers[i].opgg = e.target.value;
                                                setNewTeamPlayers(newPlayers);
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>

                            <button onClick={handleCreateTeam} className="mt-8 bg-gold text-blue-primary px-6 py-2 rounded-lg font-bold hover:bg-gold/90 transition-colors w-full">
                                Crear Equipo
                            </button>
                        </div>
                        
                        {/* LIST TEAMS */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h2 className="text-lg font-bold text-slate-800 mb-6">Equipos Existentes ({teams.length})</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {teams.map(t => (
                                    <div key={t.id} className="p-4 border border-slate-200 rounded-lg flex items-center space-x-4">
                                        <img src={t.logo} className="w-10 h-10 rounded-full bg-slate-50" alt="" />
                                        <div>
                                            <p className="font-bold text-slate-900">{t.name}</p>
                                            <p className="text-xs text-text-dark">Seed: {t.seed} • ID: {t.id}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* MATCHES CONTENT */}
                {activeTab === 'matches' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* LEFT: LIST & CREATE */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* CREATE MATCH */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h2 className="text-lg font-bold text-slate-800 mb-4">Crear Partido</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="label-std">Match ID</label>
                                        <input placeholder="ej: swiss-1-1" className="input-std w-full" value={newMatch.id} onChange={e => setNewMatch({...newMatch, id: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="label-std">Ronda</label>
                                        <input placeholder="Num" type="number" className="input-std w-full" value={newMatch.round} onChange={e => setNewMatch({...newMatch, round: parseInt(e.target.value)})} />
                                    </div>
                                    <div>
                                        <label className="label-std">Equipo 1</label>
                                        <select className="input-std w-full" value={newMatch.team1Id} onChange={e => setNewMatch({...newMatch, team1Id: e.target.value})}>
                                            <option value="">Seleccionar Equipo 1</option>
                                            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label-std">Equipo 2</label>
                                        <select className="input-std w-full" value={newMatch.team2Id} onChange={e => setNewMatch({...newMatch, team2Id: e.target.value})}>
                                            <option value="">Seleccionar Equipo 2</option>
                                            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                        </select>
                                    </div>
                                    <button onClick={handleCreateMatch} className="btn-primary w-full">Crear</button>
                                </div>
                            </div>
                            
                            {/* MATCH LIST */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-[600px] overflow-y-auto">
                                <div className="flex justify-between items-center mb-4">
                                     <h2 className="text-lg font-bold text-slate-800">Partidos</h2>
                                     <button onClick={fetchMatches}><RefreshCw className="w-4 h-4 text-text-dark" /></button>
                                </div>
                                <div className="space-y-2">
                                    {matches.sort((a,b) => b.round - a.round).map(m => (
                                        <div 
                                            key={m.id} 
                                            onClick={() => setSelectedMatch(m)}
                                            className={`p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors ${selectedMatch?.id === m.id ? 'border-gold bg-gold/10' : 'border-slate-200'}`}
                                        >
                                            <div className="flex justify-between text-xs font-bold text-text-dark mb-1">
                                                <span>Ronda {m.round}</span>
                                                <span className={`${m.status === 'completed' ? 'text-emerald-600' : 'text-amber-600'}`}>{m.status}</span>
                                            </div>
                                            <div className="font-bold text-sm text-slate-800 flex justify-between">
                                                <span>{teams.find(t => t.id === m.team1Id)?.name || m.team1Id}</span>
                                                <span>vs</span>
                                                <span>{teams.find(t => t.id === m.team2Id)?.name || m.team2Id}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: EDIT FORM */}
                        <div className="lg:col-span-8">
                            {selectedMatch ? (
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-slate-800">
                                            Editar Partido: {selectedMatch.id}
                                        </h2>
                                        <button onClick={() => setSelectedMatch(null)} className="text-slate-400 hover:text-slate-600"><Trash2 className="w-5 h-5"/></button>
                                    </div>

                                    <div className="grid grid-cols-4 gap-4 mb-8">
                                        <div className="col-span-1">
                                            <label className="label-std">Score Team 1</label>
                                            <input type="number" className="input-std w-full" value={matchUpdateData.score1} onChange={e => setMatchUpdateData({...matchUpdateData, score1: parseInt(e.target.value)})} />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="label-std">Score Team 2</label>
                                            <input type="number" className="input-std w-full" value={matchUpdateData.score2} onChange={e => setMatchUpdateData({...matchUpdateData, score2: parseInt(e.target.value)})} />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="label-std">Winner ID</label>
                                            <select className="input-std w-full" value={matchUpdateData.winnerId} onChange={e => setMatchUpdateData({...matchUpdateData, winnerId: e.target.value})}>
                                                <option value="">Select Winner</option>
                                                <option value={selectedMatch.team1Id}>{teams.find(t => t.id === selectedMatch.team1Id)?.name}</option>
                                                <option value={selectedMatch.team2Id}>{teams.find(t => t.id === selectedMatch.team2Id)?.name}</option>
                                            </select>
                                        </div>
                                        <div className="col-span-1">
                                            <label className="label-std">Estado</label>
                                            <select className="input-std w-full" value={matchUpdateData.status} onChange={e => setMatchUpdateData({...matchUpdateData, status: e.target.value as any})}>
                                                <option value="pending">Pending</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        {/* TEAM 1 PLAYERS */}
                                        <div>
                                            <h3 className="font-bold text-slate-700 mb-2 border-b pb-2">Team 1 Stats ({teams.find(t => t.id === selectedMatch.team1Id)?.name})</h3>
                                            <div className="space-y-2">
                                                {matchUpdateData.details.team1Players.map((p, i) => (
                                                    <div key={i} className="flex gap-2">
                                                        <input placeholder="Name" className="input-sm flex-1" value={p.name} onChange={e => updatePlayerStat(1, i, 'name', e.target.value)} />
                                                        <input placeholder="Champ" className="input-sm w-24" value={p.champion} onChange={e => updatePlayerStat(1, i, 'champion', e.target.value)} />
                                                        <input placeholder="K" type="number" className="input-sm w-16" value={p.k} onChange={e => updatePlayerStat(1, i, 'k', parseInt(e.target.value))} />
                                                        <input placeholder="D" type="number" className="input-sm w-16" value={p.d} onChange={e => updatePlayerStat(1, i, 'd', parseInt(e.target.value))} />
                                                        <input placeholder="A" type="number" className="input-sm w-16" value={p.a} onChange={e => updatePlayerStat(1, i, 'a', parseInt(e.target.value))} />
                                                        <input placeholder="Role (opcional)" className="input-sm w-20" value={p.role} onChange={e => updatePlayerStat(1, i, 'role', e.target.value)} />
                                                    </div>
                                                ))}
                                            </div>
                                            {/* TEAM 1 BANS */}
                                            <div className="mt-4">
                                                <label className="label-std">Bans Team 1</label>
                                                <div className="flex gap-2">
                                                    {Array(5).fill(0).map((_, i) => (
                                                        <input
                                                            key={i}
                                                            placeholder={`Ban ${i+1}`}
                                                            className="input-sm w-24"
                                                            value={matchUpdateData.details.team1Bans[i] || ''}
                                                            onChange={e => {
                                                                const newBans = [...matchUpdateData.details.team1Bans];
                                                                newBans[i] = e.target.value;
                                                                setMatchUpdateData({
                                                                    ...matchUpdateData,
                                                                    details: {
                                                                        ...matchUpdateData.details,
                                                                        team1Bans: newBans
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        {/* TEAM 2 PLAYERS */}
                                        <div>
                                            <h3 className="font-bold text-slate-700 mb-2 border-b pb-2">Team 2 Stats ({teams.find(t => t.id === selectedMatch.team2Id)?.name})</h3>
                                            <div className="space-y-2">
                                                {matchUpdateData.details.team2Players.map((p, i) => (
                                                    <div key={i} className="flex gap-2">
                                                        <input placeholder="Name" className="input-sm flex-1" value={p.name} onChange={e => updatePlayerStat(2, i, 'name', e.target.value)} />
                                                        <input placeholder="Champ" className="input-sm w-24" value={p.champion} onChange={e => updatePlayerStat(2, i, 'champion', e.target.value)} />
                                                        <input placeholder="K" type="number" className="input-sm w-16" value={p.k} onChange={e => updatePlayerStat(2, i, 'k', parseInt(e.target.value))} />
                                                        <input placeholder="D" type="number" className="input-sm w-16" value={p.d} onChange={e => updatePlayerStat(2, i, 'd', parseInt(e.target.value))} />
                                                        <input placeholder="A" type="number" className="input-sm w-16" value={p.a} onChange={e => updatePlayerStat(2, i, 'a', parseInt(e.target.value))} />
                                                        <input placeholder="Role (opcional)" className="input-sm w-20" value={p.role} onChange={e => updatePlayerStat(2, i, 'role', e.target.value)} />
                                                    </div>
                                                ))}
                                            </div>
                                            {/* TEAM 2 BANS */}
                                            <div className="mt-4">
                                                <label className="label-std">Bans Team 2</label>
                                                <div className="flex gap-2">
                                                    {Array(5).fill(0).map((_, i) => (
                                                        <input
                                                            key={i}
                                                            placeholder={`Ban ${i+1}`}
                                                            className="input-sm w-24"
                                                            value={matchUpdateData.details.team2Bans[i] || ''}
                                                            onChange={e => {
                                                                const newBans = [...matchUpdateData.details.team2Bans];
                                                                newBans[i] = e.target.value;
                                                                setMatchUpdateData({
                                                                    ...matchUpdateData,
                                                                    details: {
                                                                        ...matchUpdateData.details,
                                                                        team2Bans: newBans
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 flex justify-end">
                                        <button onClick={handleUpdateMatch} className="btn-primary flex items-center gap-2">
                                            <Save className="w-5 h-5" />
                                            Guardar Cambios
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                                    <Edit2 className="w-12 h-12 mb-4" />
                                    <p>Selecciona un partido para editar</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                {/* PLAYOFFS CONTENT */}
                {activeTab === 'playoffs' && (
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* LEFT: LIST & CREATE */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* CREATE MATCH */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h2 className="text-lg font-bold text-slate-800 mb-4">Crear Partido Playoff</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="label-std">Match ID</label>
                                        <input placeholder="Match ID (ej: QF-1)" className="input-std w-full" value={newPlayoffMatch.id} onChange={e => setNewPlayoffMatch({...newPlayoffMatch, id: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="label-std">Etapa</label>
                                        <select className="input-std w-full" value={newPlayoffMatch.stage} onChange={e => setNewPlayoffMatch({...newPlayoffMatch, stage: e.target.value})}>
                                            <option value="QF">Quarter Finals</option>
                                            <option value="SF">Semi Finals</option>
                                            <option value="F">Final</option>
                                            <option value="T">Third Place</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label-std">Equipo 1</label>
                                        <select className="input-std w-full" value={newPlayoffMatch.team1Id} onChange={e => setNewPlayoffMatch({...newPlayoffMatch, team1Id: e.target.value})}>
                                            <option value="">Seleccionar Equipo 1</option>
                                            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label-std">Equipo 2</label>
                                        <select className="input-std w-full" value={newPlayoffMatch.team2Id} onChange={e => setNewPlayoffMatch({...newPlayoffMatch, team2Id: e.target.value})}>
                                            <option value="">Seleccionar Equipo 2</option>
                                            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                        </select>
                                    </div>
                                    <button onClick={handleCreatePlayoffMatch} className="btn-primary w-full">Crear Playoff Match</button>
                                </div>
                            </div>

                             {/* PLAYOFF LIST */}
                             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-[600px] overflow-y-auto">
                                <div className="flex justify-between items-center mb-4">
                                     <h2 className="text-lg font-bold text-slate-800">Partidos Playoffs</h2>
                                     <button onClick={fetchPlayoffMatches}><RefreshCw className="w-4 h-4 text-text-dark" /></button>
                                </div>
                                <div className="space-y-2">
                                    {playoffMatches.map(m => (
                                        <div 
                                            key={m.id} 
                                            onClick={() => setSelectedPlayoffMatch(m)}
                                            className={`p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors ${selectedPlayoffMatch?.id === m.id ? 'border-gold bg-gold/10' : 'border-slate-200'}`}
                                        >
                                            <div className="flex justify-between text-xs font-bold text-text-dark mb-1">
                                                <span>{m.stage}</span>
                                                <span className={`${m.status === 'completed' ? 'text-emerald-600' : 'text-amber-600'}`}>{m.status}</span>
                                            </div>
                                            <div className="font-bold text-sm text-slate-800 flex justify-between">
                                                <span>{teams.find(t => t.id === m.team1Id)?.name || m.team1Id}</span>
                                                <span>vs</span>
                                                <span>{teams.find(t => t.id === m.team2Id)?.name || m.team2Id}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: EDIT FORM (SET WINNER & GAMES) */}
                        <div className="lg:col-span-8">
                            {selectedPlayoffMatch ? (
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-6 max-h-screen overflow-y-auto">
                                     <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-slate-800">
                                            Editar Playoff Match: {selectedPlayoffMatch.id}
                                        </h2>
                                        <button onClick={() => setSelectedPlayoffMatch(null)} className="text-slate-400 hover:text-slate-600"><Trash2 className="w-5 h-5"/></button>
                                    </div>

                                    <div className="mb-6">
                                        <label className="label-std">Winner ID (Series Winner)</label>
                                        <select className="input-std w-full" value={playoffWinnerId} onChange={e => setPlayoffWinnerId(e.target.value)}>
                                            <option value="">Select Series Winner</option>
                                            <option value={selectedPlayoffMatch.team1Id}>{teams.find(t => t.id === selectedPlayoffMatch.team1Id)?.name}</option>
                                            <option value={selectedPlayoffMatch.team2Id}>{teams.find(t => t.id === selectedPlayoffMatch.team2Id)?.name}</option>
                                        </select>
                                    </div>

                                    <div className="space-y-6">
                                        {playoffGames.map((game, gameIdx) => (
                                            <div key={gameIdx} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="font-bold text-indigo-700">Game {gameIdx + 1}</h3>
                                                    <div className="flex gap-4">
                                                        <input placeholder="Score 1" type="number" className="input-sm w-16" value={game.score1} onChange={e => updateGameStat(gameIdx, 'score1', parseInt(e.target.value))} />
                                                        <input placeholder="Score 2" type="number" className="input-sm w-16" value={game.score2} onChange={e => updateGameStat(gameIdx, 'score2', parseInt(e.target.value))} />
                                                    </div>
                                                </div>
                                                {/* TEAM 1 BANS */}
                                                <div className="mb-2">
                                                    <label className="label-std">Bans Team 1</label>
                                                    <div className="flex gap-2">
                                                        {Array(5).fill(0).map((_, i) => (
                                                            <input
                                                                key={i}
                                                                placeholder={`Ban ${i+1}`}
                                                                className="input-sm w-20"
                                                                value={game.team1Bans?.[i] || ''}
                                                                onChange={e => {
                                                                    const newBans = [...(game.team1Bans || [])];
                                                                    newBans[i] = e.target.value;
                                                                    updateGameStat(gameIdx, 'team1Bans', newBans);
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* TEAM 1 PLAYERS */}
                                                <div className="mb-2">
                                                    <p className="text-xs font-bold text-text-dark mb-1">Team 1 Players</p>
                                                    {game.team1Players.map((p, pIdx) => (
                                                        <div key={pIdx} className="flex gap-1 mb-1">
                                                            <input placeholder="Name" className="input-sm flex-1" value={p.name} onChange={e => updateGamePlayer(gameIdx, 1, pIdx, 'name', e.target.value)} />
                                                            <input placeholder="Champ" className="input-sm w-20" value={p.champion} onChange={e => updateGamePlayer(gameIdx, 1, pIdx, 'champion', e.target.value)} />
                                                            <input placeholder="K" className="input-sm w-10" value={p.k} onChange={e => updateGamePlayer(gameIdx, 1, pIdx, 'k', parseInt(e.target.value))} />
                                                            <input placeholder="D" className="input-sm w-10" value={p.d} onChange={e => updateGamePlayer(gameIdx, 1, pIdx, 'd', parseInt(e.target.value))} />
                                                            <input placeholder="A" className="input-sm w-10" value={p.a} onChange={e => updateGamePlayer(gameIdx, 1, pIdx, 'a', parseInt(e.target.value))} />
                                                            <input placeholder="Role" className="input-sm w-12" value={p.role} onChange={e => updateGamePlayer(gameIdx, 1, pIdx, 'role', e.target.value)} />
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* TEAM 2 PLAYERS */}
                                                <div>
                                                    <p className="text-xs font-bold text-text-dark mb-1">Team 2 Players</p>
                                                    {game.team2Players.map((p, pIdx) => (
                                                        <div key={pIdx} className="flex gap-1 mb-1">
                                                            <input placeholder="Name" className="input-sm flex-1" value={p.name} onChange={e => updateGamePlayer(gameIdx, 2, pIdx, 'name', e.target.value)} />
                                                            <input placeholder="Champ" className="input-sm w-20" value={p.champion} onChange={e => updateGamePlayer(gameIdx, 2, pIdx, 'champion', e.target.value)} />
                                                            <input placeholder="K" className="input-sm w-10" value={p.k} onChange={e => updateGamePlayer(gameIdx, 2, pIdx, 'k', parseInt(e.target.value))} />
                                                            <input placeholder="D" className="input-sm w-10" value={p.d} onChange={e => updateGamePlayer(gameIdx, 2, pIdx, 'd', parseInt(e.target.value))} />
                                                            <input placeholder="A" className="input-sm w-10" value={p.a} onChange={e => updateGamePlayer(gameIdx, 2, pIdx, 'a', parseInt(e.target.value))} />
                                                            <input placeholder="Role" className="input-sm w-12" value={p.role} onChange={e => updateGamePlayer(gameIdx, 2, pIdx, 'role', e.target.value)} />
                                                        </div>
                                                    ))}
                                                    {/* TEAM 2 BANS */}
                                                    <div className="mt-2">
                                                        <label className="label-std">Bans Team 2</label>
                                                        <div className="flex gap-2">
                                                            {Array(5).fill(0).map((_, i) => (
                                                                <input
                                                                    key={i}
                                                                    placeholder={`Ban ${i+1}`}
                                                                    className="input-sm w-20"
                                                                    value={game.team2Bans?.[i] || ''}
                                                                    onChange={e => {
                                                                        const newBans = [...(game.team2Bans || [])];
                                                                        newBans[i] = e.target.value;
                                                                        updateGameStat(gameIdx, 'team2Bans', newBans);
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4">
                                        <button 
                                            onClick={() => setPlayoffGames([...playoffGames, createEmptyGame(playoffGames.length + 1)])}
                                            className="w-full border-2 border-dashed border-gold/30 text-gold font-bold py-2 rounded-lg hover:bg-gold/5"
                                        >
                                            + Add Game
                                        </button>
                                    </div>

                                    <div className="mt-8 flex justify-end">
                                        <button onClick={handleUpdatePlayoffMatch} className="btn-primary flex items-center gap-2">
                                            <Save className="w-5 h-5" />
                                            Guardar Serie
                                        </button>
                                    </div>

                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                                    <Edit2 className="w-12 h-12 mb-4" />
                                    <p>Selecciona un partido de playoffs para editar</p>
                                </div>
                            )}
                        </div>
                     </div>
                )}

            </div>
            
            {/* STYLES */}
            <style>{`
                .input-std {
                    @apply bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-gold transition-all;
                }
                .input-sm {
                    @apply bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-gold;
                }
                .label-std {
                    @apply block text-xs font-bold text-text-dark uppercase mb-1 tracking-wider;
                }
                .btn-primary {
                    @apply bg-gold text-blue-primary font-bold py-2 px-4 rounded-lg hover:bg-gold/90 transition-colors shadow-sm;
                }
            `}</style>
        </div>
    );
};
