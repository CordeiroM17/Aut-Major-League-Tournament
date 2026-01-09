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
    const teamData = req.body;
    // Simple validation could be added here
    if (!teamData.id || !teamData.name) {
       res.status(400).json({ message: 'Missing required fields' });
       return;
    }

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
