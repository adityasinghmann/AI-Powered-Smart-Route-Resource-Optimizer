export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

export async function fetchVehicles() {
  return request('/vehicles');
}

export async function optimizeRoute(payload) {
  return request('/optimize-route', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function simulateTraffic(payload) {
  return request('/simulate-traffic', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}
