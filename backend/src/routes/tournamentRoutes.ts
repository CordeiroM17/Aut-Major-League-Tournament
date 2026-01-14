import { Router } from 'express';
import { getLiveStatus, setLiveStatus } from '../controllers/tournamentController';

const router = Router();

router.get('/live', getLiveStatus);
router.put('/live', setLiveStatus);

export default router;
