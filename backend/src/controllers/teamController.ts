import { Request, Response } from 'express';
import { createTeam, getAllTeams } from '../services/teamService';

export const getTeamsController = async (req: Request, res: Response) => {
  try {
    const teams = await getAllTeams();
    res.status(200).json({
      status: 'success',
      data: teams
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching teams', error });
  }
};

export const createTeamController = async (req: Request, res: Response) => {
  try {
    const { id, name, seed, logo, players, description } = req.body;

    if (!id || !name || !seed || !logo || !players) {
       res.status(400).json({ message: 'Missing required fields: id, name, seed, logo, players' });
       return;
    }

    if (!Array.isArray(players) || players.length === 0) {
      res.status(400).json({ message: 'Players must be a non-empty array' });
      return;
    }

    // Sanitize players data
    const sanitizedPlayers = players.map((p: any) => ({
      name: p.name,
      role: p.role,
      opgg: p.opgg
    }));

    // Start-check: Ensure every player has name and role
    for (const p of sanitizedPlayers) {
      if (!p.name || !p.role) {
        res.status(400).json({ message: 'Each player must have a name and role' });
        return;
      }
    }

    const teamData = {
      id,
      name,
      seed,
      logo,
      players: sanitizedPlayers,
      description: description || '',
    };

    const newTeam = await createTeam(teamData);

    res.status(201).json({
      status: 'created',
      message: 'Success',
      data: newTeam
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating team', error });
  }
};
