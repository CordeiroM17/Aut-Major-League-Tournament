import { Schema, model, Document } from 'mongoose';

export type PlayoffStage = 'QF' | 'SF' | 'F' | 'T';


export interface IPlayerStats {
  name: string;
  role: string;
  champion: string;
  k: number;
  d: number;
  a: number;
}

export interface IGame {
  gameNumber: number;
  winnerId?: string;
  score1: number;
  score2: number;
  team1Players: IPlayerStats[];
  team2Players: IPlayerStats[];
  team1Bans: string[]; // 5 bans
  team2Bans: string[]; // 5 bans
}

export interface IPlayoffMatch extends Document {
  id: string;
  stage: PlayoffStage;
  team1Id: string;
  team2Id: string;
  status: 'pending' | 'completed';
  games?: IGame[];
  winnerId?: string;
}

const playerStatsSchema = new Schema<IPlayerStats>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  champion: { type: String, required: true },
  k: { type: Number, required: true },
  d: { type: Number, required: true },
  a: { type: Number, required: true }
});

const gameSchema = new Schema<IGame>({
  gameNumber: { type: Number, required: true },
  winnerId: { type: String },
  score1: { type: Number, required: true },
  score2: { type: Number, required: true },
  team1Players: [playerStatsSchema],
  team2Players: [playerStatsSchema],
  team1Bans: [{ type: String }],
  team2Bans: [{ type: String }]
});

const playoffMatchSchema = new Schema<IPlayoffMatch>({
  id: { type: String, required: true, unique: true },
  stage: { type: String, enum: ['QF', 'SF', 'F', 'T'], required: true },
  team1Id: { type: String, required: true },
  team2Id: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  games: [gameSchema],
  winnerId: { type: String }
}, {
  timestamps: true
});

export const PlayoffMatchModel = model<IPlayoffMatch>('PlayoffMatch', playoffMatchSchema);
