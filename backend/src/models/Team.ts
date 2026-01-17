import { Schema, model, Document } from 'mongoose';

export interface IPlayer {
  name: string;
  role: string;
  opgg: string;
}

export interface ITeam extends Document {
  id: string;
  name: string;
  seed: number;
  logo: string;
  players: IPlayer[];
}

const playerSchema = new Schema<IPlayer>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  opgg: { type: String, required: true }
});

const teamSchema = new Schema<ITeam>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  seed: { type: Number, required: true },
  logo: { type: String, required: true },
  players: [playerSchema]
}, {
  timestamps: true
});

export const TeamModel = model<ITeam>('Team', teamSchema);
