import { MinHeapPriorityQueue } from './priorityQueue.js';

// Dijkstra with adjacency list + min-heap: O(E log V).
export function dijkstra(adjacency, startNode) {
  const distances = new Map();
  const previous = new Map();
  const pq = new MinHeapPriorityQueue();

  for (const node of adjacency.keys()) {
    distances.set(node, node === startNode ? 0 : Infinity);
    previous.set(node, null);
  }

  pq.push(startNode, 0);

  while (pq.size() > 0) {
    const current = pq.pop();
    if (!current) break;

    const currentNode = current.item;
    const currentDistance = current.priority;

    if (currentDistance > distances.get(currentNode)) continue;

    for (const neighbor of adjacency.get(currentNode) || []) {
      const newDistance = currentDistance + neighbor.weight;
      if (newDistance < distances.get(neighbor.node)) {
        distances.set(neighbor.node, newDistance);
        previous.set(neighbor.node, currentNode);
        pq.push(neighbor.node, newDistance);
      }
    }
  }

  return { distances, previous };
}
