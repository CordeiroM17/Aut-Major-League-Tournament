import { Request, Response } from 'express';
import { createPlayoffMatch, setPlayoffMatchWinner, getPlayoffMatch, getAllPlayoffMatches } from './playoffMatchService';
import { enrichPlayers } from '../utils/playerUtils';

export const createPlayoffMatchController = async (req: Request, res: Response) => {
  try {
    const { id, stage, team1Id, team2Id, status } = req.body;
    if (!id || !stage || !team1Id || !team2Id) {
      return res.status(400).json({ message: 'Missing required fields: id, stage, team1Id, team2Id' });
    }
    const match = await createPlayoffMatch({ id, stage, team1Id, team2Id, status: status || 'pending' });
    res.status(201).json({ status: 'created', data: match });
  } catch (error) {
    res.status(500).json({ message: 'Error creating playoff match', error });
  }
};

export const setPlayoffMatchWinnerController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { winnerId, games } = req.body;
    console.log('--- setPlayoffMatchWinnerController ---');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    if (!id || !winnerId || !games || !Array.isArray(games) || games.length === 0) {
      return res.status(400).json({ message: 'Missing required fields: id, winnerId, games' });
    }
    // Validar cantidad de games según stage
    const match = await getPlayoffMatch(id);
    if (!match) {
      return res.status(404).json({ message: 'Playoff match not found' });
    }
    const maxGames = match.stage === 'F' ? 5 : 3;
    if (games.length > maxGames) {
      return res.status(400).json({ message: `Games array too long for stage (${maxGames} max)` });
    }

    // Enrich players in games
    const gamesPromises = games.map(async (game: any) => {
        if (game.team1Players) {
            game.team1Players = await enrichPlayers(game.team1Players, match.team1Id);
        }
        if (game.team2Players) {
            game.team2Players = await enrichPlayers(game.team2Players, match.team2Id);
        }
        return game;
    });

    const enrichedGames = await Promise.all(gamesPromises);

    // Actualizar match con resultados y ganador
    match.games = enrichedGames;
    match.winnerId = winnerId;
    match.status = 'completed';
    console.log('Match before save:', JSON.stringify(match, null, 2));
    await match.save();
    console.log('Match after save:', JSON.stringify(match, null, 2));
    res.status(200).json({ status: 'success', data: match });
  } catch (error) {
    console.error('Error in setPlayoffMatchWinnerController:', error);
    res.status(500).json({ message: 'Error setting playoff match winner', error });
  }
};

export const getPlayoffMatchController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const match = await getPlayoffMatch(id);
    if (!match) {
      return res.status(404).json({ message: 'Playoff match not found' });
    }
    res.status(200).json({ status: 'success', data: match });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching playoff match', error });
  }
};

export const getAllPlayoffMatchesController = async (_req: Request, res: Response) => {
  try {
    const matches = await getAllPlayoffMatches();
    res.status(200).json({ status: 'success', data: matches });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching playoff matches', error });
  }
};
