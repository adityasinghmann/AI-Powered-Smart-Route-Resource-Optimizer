import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

export async function fetchVehicles() {
  const { data } = await api.get('/vehicles');
  return data;
}

export async function optimizeRoute(payload) {
  const { data } = await api.post('/optimize-route', payload);
  return data;
}

export async function simulateTraffic(payload) {
  const { data } = await api.post('/simulate-traffic', payload);
  return data;
}
