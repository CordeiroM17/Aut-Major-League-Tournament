import { TeamModel } from '../models/Team';

export const enrichPlayers = async (players: any[], teamId: string) => {
    if (!players || players.length === 0) return players;

    try {
        const team = await TeamModel.findOne({ id: teamId });
        if (!team) return players;

        return players.map((p) => {
            const rosterPlayer = team.players.find(rp => rp.name.toLowerCase() === p.name.toLowerCase());
            
            if (rosterPlayer) {
                return {
                    ...p,
                    role: p.role || rosterPlayer.role,
                    opgg: p.opgg || rosterPlayer.opgg
                };
            }
            return p;
        });
    } catch (error) {
        console.error(`Error enriching players for team ${teamId}:`, error);
        return players;
    }
};
