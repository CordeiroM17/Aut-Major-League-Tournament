import { Router } from 'express';
import {
  createPlayoffMatchController,
  setPlayoffMatchWinnerController,
  getPlayoffMatchController,
  getAllPlayoffMatchesController
} from './playoffMatchController';

const router = Router();

// Todas requieren JWT (middleware se aplica en server.ts)
router.post('/', createPlayoffMatchController);
router.put('/:id/winner', setPlayoffMatchWinnerController);
router.get('/:id', getPlayoffMatchController);
router.get('/', getAllPlayoffMatchesController);

export default router;
