import { Request, Response } from 'express';
import { createMatch, getAllMatches, updateMatch } from '../services/matchService';

export const updateMatchController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { score1, score2, winnerId, status, details } = req.body;

        const updateData: any = {};
        if (score1 !== undefined) updateData.score1 = score1;
        if (score2 !== undefined) updateData.score2 = score2;
        if (winnerId) updateData.winnerId = winnerId;
        if (status) updateData.status = status;
        if (details) updateData.details = details;

        // Validation for completion
        if (status === 'completed') {
            if (
                (score1 === undefined && score2 === undefined) || // At least scores should be present or verified (simplified for now)
                !winnerId ||
                !details ||
                !details.team1Players ||
                !details.team2Players
            ) {
                 res.status(400).json({ message: 'To complete a match, you must provide scores, winnerId, and full player details (KDA).' });
                 return;
            }
        }

        const updatedMatch = await updateMatch(id, updateData);

        if (!updatedMatch) {
            res.status(404).json({ message: 'Match not found' });
            return;
        }

        res.status(200).json({
            status: 'success',
            message: 'Match updated successfully',
            data: updatedMatch
        });
    } catch (error) {
        console.error('Error updating match:', error);
        res.status(500).json({ message: 'Error updating match', error });
    }
};

export const getMatchesController = async (req: Request, res: Response) => {
    try {
        const matches = await getAllMatches();
        res.status(200).json({
            status: 'success',
            data: matches
        });
    } catch (error) {
        console.error('Error fetching matches:', error);
        res.status(500).json({ message: 'Error fetching matches', error });
    }
};



export const createMatchController = async (req: Request, res: Response) => {
    try {
        const { id, round, team1Id, team2Id, score1, score2, winnerId, status, details } = req.body;

        // Basic validation
        if (!id || !round || !team1Id || !team2Id) {
            res.status(400).json({ message: 'Missing required fields: id, round, team1Id, team2Id' });
            return;
        }

        // Prepare data object (sanitization)
        // We explicitly pick fields to avoid pollution
        const matchData: any = {
            id,
            round,
            team1Id,
            team2Id,
            status: status || 'pending'
        };
        
        if (score1 !== undefined) matchData.score1 = score1;
        if (score2 !== undefined) matchData.score2 = score2;
        if (winnerId) matchData.winnerId = winnerId;
        if (details) matchData.details = details; 

        // Additional validation for details if status is completed could be added here

        const newMatch = await createMatch(matchData);

        res.status(201).json({
            status: 'created',
            message: 'Match created successfully',
            data: newMatch
        });
    } catch (error) {
        console.error('Error creating match:', error);
        res.status(500).json({ message: 'Error creating match', error });
    }
};
