import { Router } from 'express';
import { simulateTrafficHandler } from '../controllers/simulationController.js';

const router = Router();
router.post('/simulate-traffic', simulateTrafficHandler);

export default router;
