import { PlayoffMatchModel, IPlayoffMatch } from './playoffMatchModel';


export const createPlayoffMatch = async (data: Partial<IPlayoffMatch>): Promise<IPlayoffMatch> => {
  const match = await PlayoffMatchModel.create(data);
  return match;
};

// setPlayoffMatchWinner ya no se usa, la lógica está en el controller

export const setPlayoffMatchWinner = async (id: string, winnerId: string): Promise<IPlayoffMatch | null> => {
  return await PlayoffMatchModel.findOneAndUpdate({ id }, { winnerId }, { new: true });
};

export const getPlayoffMatch = async (id: string): Promise<IPlayoffMatch | null> => {
  return await PlayoffMatchModel.findOne({ id });
};

export const getAllPlayoffMatches = async (): Promise<IPlayoffMatch[]> => {
  return await PlayoffMatchModel.find({});
};
