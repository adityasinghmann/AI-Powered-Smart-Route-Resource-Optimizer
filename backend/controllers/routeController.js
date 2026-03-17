import { optimizeRoute, getStoredRoute } from '../services/optimizerService.js';
import { emitRouteUpdate } from '../utils/socket.js';

export async function optimizeRouteHandler(req, res, next) {
  try {
    const result = await optimizeRoute(req.body);
    emitRouteUpdate({ type: 'optimized', routeId: result.id || null, generatedAt: result.generatedAt });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getRouteByIdHandler(req, res, next) {
  try {
    const route = await getStoredRoute(req.params.id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found or persistence disabled' });
    }
    return res.json(route);
  } catch (error) {
    next(error);
  }
}
