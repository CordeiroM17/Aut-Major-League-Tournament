import { Router } from 'express';
import { createMatchController, getMatchesController, updateMatchController } from '../controllers/matchController';

const router = Router();

router.get('/', getMatchesController);
router.post('/', createMatchController);
router.put('/:id', updateMatchController);

export default router;
