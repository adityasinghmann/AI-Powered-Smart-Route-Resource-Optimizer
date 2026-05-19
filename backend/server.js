import express from 'express';
import routeRoutes from './routes/routeRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import simulationRoutes from './routes/simulationRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { openEventStream } from './utils/events.js';

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  return next();
});
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_, res) => {
  res.json({ status: 'ok', service: 'smart-route-optimizer-backend' });
});

app.get('/events', openEventStream);
app.use('/', routeRoutes);
app.use('/', simulationRoutes);
app.use('/', vehicleRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
