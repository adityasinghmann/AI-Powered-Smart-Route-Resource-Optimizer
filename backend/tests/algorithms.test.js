import test from 'node:test';
import assert from 'node:assert/strict';
import { MinHeapPriorityQueue } from '../services/algorithms/priorityQueue.js';
import { buildAdjacencyList } from '../services/algorithms/graph.js';
import { dijkstra } from '../services/algorithms/dijkstra.js';
import { aStar } from '../services/algorithms/astar.js';
import { antColonyTsp } from '../services/algorithms/tsp.js';

test('priority queue pops smallest priority first', () => {
  const pq = new MinHeapPriorityQueue();
  pq.push('A', 10);
  pq.push('B', 2);
  pq.push('C', 5);

  assert.equal(pq.pop().item, 'B');
  assert.equal(pq.pop().item, 'C');
  assert.equal(pq.pop().item, 'A');
});

test('dijkstra and aStar produce finite paths', () => {
  const locations = [
    { id: 'A', lat: 0, lng: 0 },
    { id: 'B', lat: 0, lng: 1 },
    { id: 'C', lat: 1, lng: 1 }
  ];

  const adjacency = buildAdjacencyList(locations, 1, 1);
  const nodesById = new Map(locations.map((l) => [l.id, l]));

  const dj = dijkstra(adjacency, 'A');
  const astar = aStar(adjacency, nodesById, 'A', 'C');

  assert.ok(dj.distances.get('C') < Infinity);
  assert.ok(astar.cost < Infinity);
  assert.equal(astar.path[0], 'A');
  assert.equal(astar.path[astar.path.length - 1], 'C');
});

test('ant colony tsp returns a complete tour', () => {
  const matrix = [
    [0, 2, 9, 10],
    [2, 0, 6, 4],
    [9, 6, 0, 8],
    [10, 4, 8, 0]
  ];

  const result = antColonyTsp(matrix, { iterations: 30, antCount: 12, seed: 7 });
  assert.equal(result.bestTour.length, 4);
  assert.ok(result.bestLength > 0);
});
