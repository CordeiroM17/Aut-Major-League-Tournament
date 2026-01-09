import { Schema, model, Document } from 'mongoose';

export interface ITeam extends Document {
  id: string;
  name: string;
  seed: number;
  logo: string;
}

const teamSchema = new Schema<ITeam>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  seed: { type: Number, required: true },
  logo: { type: String, required: true },
}, {
  timestamps: true
});

export const TeamModel = model<ITeam>('Team', teamSchema);
