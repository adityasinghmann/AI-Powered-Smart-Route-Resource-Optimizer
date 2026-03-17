import { haversineDistanceKm } from '../../utils/geo.js';

export function buildAdjacencyList(locations, trafficFactor = 1, weatherFactor = 1) {
  const adjacency = new Map();

  for (const location of locations) {
    adjacency.set(location.id, []);
  }

  for (let i = 0; i < locations.length; i += 1) {
    for (let j = i + 1; j < locations.length; j += 1) {
      const from = locations[i];
      const to = locations[j];
      const distance = haversineDistanceKm(from.lat, from.lng, to.lat, to.lng);
      const weight = distance * trafficFactor * weatherFactor;

      adjacency.get(from.id).push({ node: to.id, distance, weight });
      adjacency.get(to.id).push({ node: from.id, distance, weight });
    }
  }

  return adjacency;
}
