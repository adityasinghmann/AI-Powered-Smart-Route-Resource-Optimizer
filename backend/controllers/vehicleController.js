import { getVehicles } from '../services/optimizerService.js';

export async function getVehiclesHandler(_, res, next) {
  try {
    const vehicles = await getVehicles();
    res.json(vehicles);
  } catch (error) {
    next(error);
  }
}
