import { randomUUID } from 'node:crypto';
import { buildAdjacencyList } from './algorithms/graph.js';
import { dijkstra } from './algorithms/dijkstra.js';
import { aStar } from './algorithms/astar.js';
import { antColonyTsp } from './algorithms/tsp.js';
import { getCache, setCache } from '../utils/cache.js';

const DEFAULT_VEHICLES = [
  { name: 'Van-A', capacity: 12, speedKph: 45, fuelCostPerKm: 0.18 },
  { name: 'Van-B', capacity: 8, speedKph: 40, fuelCostPerKm: 0.16 }
];

const storedRoutes = new Map();
const MAX_STORED_ROUTES = 100;

export async function optimizeRoute(payload) {
  const { locations, constraints = {} } = payload;
  const vehicles = payload.vehicles?.length ? payload.vehicles : DEFAULT_VEHICLES;
  const trafficFactor = payload.trafficFactor || 1;
  const weatherFactor = payload.weatherFactor || 1;

  const cacheKey = JSON.stringify({ locations, vehicles, constraints, trafficFactor, weatherFactor });
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const adjacency = buildAdjacencyList(locations, trafficFactor, weatherFactor);
  const nodesById = new Map(locations.map((l) => [l.id, l]));

  const distanceMatrix = locations.map((from) =>
    locations.map((to) => {
      if (from.id === to.id) return 0;
      const edge = adjacency.get(from.id).find((n) => n.node === to.id);
      return edge?.weight ?? Infinity;
    })
  );

  const tsp = antColonyTsp(distanceMatrix, { iterations: 80, antCount: Math.max(10, locations.length * 2) });
  const orderedStops = tsp.bestTour.map((index) => locations[index]);

  const allocation = allocateVehicles(orderedStops, vehicles);
  const estimated = estimateTimings(allocation, adjacency, nodesById, constraints);

  const result = {
    id: `route-${randomUUID()}`,
    generatedAt: new Date().toISOString(),
    routeOrder: orderedStops,
    adjacencyStats: {
      nodeCount: adjacency.size,
      edgeCount: [...adjacency.values()].reduce((acc, list) => acc + list.length, 0)
    },
    tsp,
    allocation,
    estimated
  };

  rememberRoute(result.id, { id: result.id, input: payload, output: result, createdAt: result.generatedAt });

  setCache(cacheKey, result, 60000);
  return result;
}

function allocateVehicles(stops, vehicles) {
  const sortedVehicles = [...vehicles].sort((a, b) => b.capacity - a.capacity);
  const plans = sortedVehicles.map((vehicle) => ({
    vehicle,
    assignedStops: [],
    load: 0
  }));

  for (const stop of stops) {
    const demand = stop.demand || 1;
    let bestPlan = null;

    for (const plan of plans) {
      if (plan.load + demand > plan.vehicle.capacity) continue;
      if (!bestPlan || plan.load < bestPlan.load) bestPlan = plan;
    }

    if (bestPlan) {
      bestPlan.assignedStops.push(stop);
      bestPlan.load += demand;
    }
  }

  return plans;
}

function estimateTimings(allocation, adjacency, nodesById, constraints) {
  return allocation.map((plan) => {
    const segments = [];
    let totalDistance = 0;

    for (let i = 0; i < plan.assignedStops.length - 1; i += 1) {
      const from = plan.assignedStops[i];
      const to = plan.assignedStops[i + 1];
      const aStarResult = aStar(adjacency, nodesById, from.id, to.id);
      const shortest = dijkstra(adjacency, from.id);

      segments.push({
        from: from.id,
        to: to.id,
        path: aStarResult.path,
        cost: aStarResult.cost,
        dijkstraCost: shortest.distances.get(to.id)
      });

      totalDistance += aStarResult.cost;
    }

    const speed = plan.vehicle.speedKph || 40;
    const etaHours = totalDistance / speed;
    const deadlinePenalty = constraints.deadlineHours && etaHours > constraints.deadlineHours ? 1.2 : 1;
    const fuelCost = totalDistance * plan.vehicle.fuelCostPerKm * deadlinePenalty;

    return {
      vehicle: plan.vehicle,
      stops: plan.assignedStops,
      segments,
      totalDistance,
      etaHours,
      fuelCost,
      efficiencyScore: Number((1 / Math.max(totalDistance, 1)).toFixed(4))
    };
  });
}

export async function getStoredRoute(id) {
  return storedRoutes.get(id) || null;
}

export async function getVehicles() {
  return DEFAULT_VEHICLES;
}

function rememberRoute(id, route) {
  storedRoutes.set(id, route);

  if (storedRoutes.size > MAX_STORED_ROUTES) {
    const oldestId = storedRoutes.keys().next().value;
    storedRoutes.delete(oldestId);
  }
}
