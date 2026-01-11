import { MatchModel, IMatch } from '../models/Match';

export const createMatch = async (data: Partial<IMatch>): Promise<IMatch> => {
    return await MatchModel.create(data);
};

export const getAllMatches = async (): Promise<IMatch[]> => {
    return await MatchModel.find({});
};

export const updateMatch = async (id: string, data: Partial<IMatch>): Promise<IMatch | null> => {
    return await MatchModel.findOneAndUpdate({ id }, data, { new: true });
};
