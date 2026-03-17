import { seededRandom } from '../../utils/random.js';

export function antColonyTsp(distanceMatrix, options = {}) {
  const iterations = options.iterations || 50;
  const antCount = options.antCount || 20;
  const alpha = options.alpha || 1;
  const beta = options.beta || 2;
  const evaporation = options.evaporation || 0.4;
  const pheromoneDeposit = options.pheromoneDeposit || 80;
  const rng = seededRandom(options.seed || 42);

  const n = distanceMatrix.length;
  const pheromones = Array.from({ length: n }, () => Array(n).fill(1));
  let bestTour = null;
  let bestLength = Infinity;

  for (let iter = 0; iter < iterations; iter += 1) {
    const tours = [];

    for (let ant = 0; ant < antCount; ant += 1) {
      const start = ant % n;
      const tour = [start];
      const visited = new Set(tour);

      while (tour.length < n) {
        const current = tour[tour.length - 1];
        const next = pickNextNode(current, visited, pheromones, distanceMatrix, alpha, beta, rng);
        tour.push(next);
        visited.add(next);
      }

      const length = tourLength(tour, distanceMatrix);
      tours.push({ tour, length });

      if (length < bestLength) {
        bestLength = length;
        bestTour = [...tour];
      }
    }

    evaporatePheromones(pheromones, evaporation);
    depositPheromones(pheromones, tours, pheromoneDeposit);
  }

  return { bestTour, bestLength };
}

function pickNextNode(current, visited, pheromones, distanceMatrix, alpha, beta, rng) {
  const probabilities = [];
  let sum = 0;

  for (let next = 0; next < distanceMatrix.length; next += 1) {
    if (visited.has(next) || next === current) continue;
    const trail = pheromones[current][next] ** alpha;
    const visibility = (1 / Math.max(distanceMatrix[current][next], 0.0001)) ** beta;
    const score = trail * visibility;
    probabilities.push({ next, score });
    sum += score;
  }

  if (probabilities.length === 0) return current;

  let threshold = rng() * sum;
  for (const option of probabilities) {
    threshold -= option.score;
    if (threshold <= 0) return option.next;
  }

  return probabilities[probabilities.length - 1].next;
}

function evaporatePheromones(pheromones, evaporation) {
  for (let i = 0; i < pheromones.length; i += 1) {
    for (let j = 0; j < pheromones.length; j += 1) {
      pheromones[i][j] *= 1 - evaporation;
      pheromones[i][j] = Math.max(pheromones[i][j], 0.001);
    }
  }
}

function depositPheromones(pheromones, tours, pheromoneDeposit) {
  for (const { tour, length } of tours) {
    const deposit = pheromoneDeposit / Math.max(length, 0.0001);
    for (let i = 0; i < tour.length; i += 1) {
      const from = tour[i];
      const to = tour[(i + 1) % tour.length];
      pheromones[from][to] += deposit;
      pheromones[to][from] += deposit;
    }
  }
}

function tourLength(tour, distanceMatrix) {
  let length = 0;
  for (let i = 0; i < tour.length; i += 1) {
    const from = tour[i];
    const to = tour[(i + 1) % tour.length];
    length += distanceMatrix[from][to];
  }
  return length;
}
