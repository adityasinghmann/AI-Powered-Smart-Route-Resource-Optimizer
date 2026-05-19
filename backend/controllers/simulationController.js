import { emitRouteUpdate } from '../utils/events.js';

export function simulateTrafficHandler(req, res) {
  const { trafficFactor = 1.2, weatherFactor = 1.1, message = 'Traffic conditions updated' } = req.body;
  const payload = { trafficFactor, weatherFactor, message, timestamp: new Date().toISOString() };
  emitRouteUpdate({ type: 'traffic-update', ...payload });
  res.json(payload);
}
