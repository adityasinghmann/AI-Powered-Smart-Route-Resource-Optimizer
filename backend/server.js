import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import routeRoutes from './routes/routeRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import simulationRoutes from './routes/simulationRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { initSocket } from './utils/socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
initSocket(io);

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_, res) => {
  res.json({ status: 'ok', service: 'smart-route-optimizer-backend' });
});

app.use('/', routeRoutes);
app.use('/', simulationRoutes);
app.use('/', vehicleRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

async function start() {
  try {
    if (MONGO_URI) {
      await mongoose.connect(MONGO_URI);
      console.log('Connected to MongoDB');
    } else {
      console.warn('MONGO_URI not set, running without persistence');
    }

    server.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

start();
