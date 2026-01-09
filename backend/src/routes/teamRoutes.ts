import { Router } from 'express';
import { createTeamController } from '../controllers/teamController';

const router = Router();

router.post('/', createTeamController);

export default router;
