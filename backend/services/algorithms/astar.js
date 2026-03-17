import { MinHeapPriorityQueue } from './priorityQueue.js';
import { haversineDistanceKm } from '../../utils/geo.js';

export function aStar(adjacency, nodesById, startNode, goalNode) {
  const openSet = new MinHeapPriorityQueue();
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();

  for (const node of adjacency.keys()) {
    gScore.set(node, Infinity);
    fScore.set(node, Infinity);
  }

  gScore.set(startNode, 0);
  fScore.set(startNode, heuristic(nodesById, startNode, goalNode));
  openSet.push(startNode, fScore.get(startNode));

  while (openSet.size() > 0) {
    const current = openSet.pop()?.item;
    if (!current) break;

    if (current === goalNode) {
      return {
        path: reconstructPath(cameFrom, current),
        cost: gScore.get(current)
      };
    }

    for (const neighbor of adjacency.get(current) || []) {
      const tentativeG = gScore.get(current) + neighbor.weight;
      if (tentativeG < gScore.get(neighbor.node)) {
        cameFrom.set(neighbor.node, current);
        gScore.set(neighbor.node, tentativeG);
        const estimate = tentativeG + heuristic(nodesById, neighbor.node, goalNode);
        fScore.set(neighbor.node, estimate);
        openSet.push(neighbor.node, estimate);
      }
    }
  }

  return { path: [], cost: Infinity };
}

function heuristic(nodesById, from, to) {
  const a = nodesById.get(from);
  const b = nodesById.get(to);
  if (!a || !b) return Infinity;
  return haversineDistanceKm(a.lat, a.lng, b.lat, b.lng);
}

function reconstructPath(cameFrom, current) {
  const path = [current];
  while (cameFrom.has(current)) {
    current = cameFrom.get(current);
    path.unshift(current);
  }
  return path;
}
