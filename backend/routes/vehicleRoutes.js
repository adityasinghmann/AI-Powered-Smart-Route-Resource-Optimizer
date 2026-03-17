import { Router } from 'express';
import { getVehiclesHandler } from '../controllers/vehicleController.js';

const router = Router();
router.get('/vehicles', getVehiclesHandler);

export default router;
