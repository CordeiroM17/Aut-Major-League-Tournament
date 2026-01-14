import { Request, Response } from 'express';
import { Tournament } from '../models/Tournament';

// En memoria para ejemplo simple
let tournament: Tournament = { isLive: false };

export const getLiveStatus = (req: Request, res: Response) => {
  res.json({ isLive: tournament.isLive });
};

export const setLiveStatus = (req: Request, res: Response) => {
  const { isLive } = req.body;
  if (typeof isLive !== 'boolean') {
    return res.status(400).json({ error: 'isLive debe ser booleano' });
  }
  tournament.isLive = isLive;
  res.json({ isLive: tournament.isLive });
};
