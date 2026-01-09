import { TeamModel, ITeam } from '../models/Team';

export const createTeam = async (data: Partial<ITeam>): Promise<ITeam> => {
  const team = await TeamModel.create(data);
  return team;
};

export const getAllTeams = async (): Promise<ITeam[]> => {
  return await TeamModel.find({});
};
