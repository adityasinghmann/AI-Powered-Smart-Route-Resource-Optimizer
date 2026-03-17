import { Router } from 'express';
import { getRouteByIdHandler, optimizeRouteHandler } from '../controllers/routeController.js';

const router = Router();

router.post('/optimize-route', optimizeRouteHandler);
router.get('/routes/:id', getRouteByIdHandler);

export default router;
