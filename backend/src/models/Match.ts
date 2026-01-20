import { Schema, model, Document } from 'mongoose';

export interface IMatchPlayerStats {
    name: string;
    role: string;
    champion: string;
    k: number;
    d: number;
    a: number;
    opgg?: string;
}

export interface IMatchDetails {
    team1Players: IMatchPlayerStats[];
    team2Players: IMatchPlayerStats[];
    team1Bans: string[];
    team2Bans: string[];
}

export interface IMatch extends Document {
    id: string;
    round: number;
    team1Id: string;
    team2Id: string;
    score1: number;
    score2: number;
    winnerId?: string;
    status: 'pending' | 'completed';
    details?: IMatchDetails;
}

const matchPlayerStatsSchema = new Schema<IMatchPlayerStats>({
    name: { type: String, required: true },
    role: { type: String, required: true },
    champion: { type: String, required: true },
    k: { type: Number, required: true },
    d: { type: Number, required: true },
    a: { type: Number, required: true },
    opgg: { type: String }
});

const matchDetailsSchema = new Schema<IMatchDetails>({
    team1Players: [matchPlayerStatsSchema],
    team2Players: [matchPlayerStatsSchema],
    team1Bans: [{ type: String }],
    team2Bans: [{ type: String }]
});

const matchSchema = new Schema<IMatch>({
    id: { type: String, required: true, unique: true },
    round: { type: Number, required: true },
    team1Id: { type: String, required: true },
    team2Id: { type: String, required: true },
    score1: { type: Number, default: 0 },
    score2: { type: Number, default: 0 },
    winnerId: { type: String },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    details: { type: matchDetailsSchema }
}, {
    timestamps: true
});

export const MatchModel = model<IMatch>('Match', matchSchema);
