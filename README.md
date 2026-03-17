# AI-Powered Smart Route & Resource Optimizer

A production-style full-stack logistics optimization system that computes route plans, assigns deliveries to multiple vehicles, and adapts to dynamic traffic/weather signals.

## Architecture Diagram

```text
┌──────────────────────────────── Frontend (React + Tailwind + Leaflet) ───────────────────────────────┐
│  Optimizer Form → POST /optimize-route                                                                │
│  Real-time status panel ← WebSocket route-updated events                                               │
│  Map polyline + markers from optimized route                                                           │
└───────────────────────────────────────────────┬─────────────────────────────────────────────────────────┘
                                                │ HTTP + Socket.IO
┌──────────────────────────────── Backend (Express + Services + Algorithms) ─────────────────────────────┐
│ Routes: /optimize-route /routes/:id /simulate-traffic /vehicles                                        │
│ Controllers: validation & orchestration                                                                 │
│ Services: route optimization + resource allocation + ETA/fuel estimation                                │
│ Algorithms: Min-Heap PQ, Dijkstra, A*, Ant Colony Optimization (TSP approximation)                     │
│ Utils: graph builder, geo distance (Haversine), in-memory TTL cache                                    │
└───────────────────────────────────────────────┬─────────────────────────────────────────────────────────┘
                                                │ Mongoose (optional)
                                      ┌─────────▼─────────┐
                                      │ MongoDB RoutePlan │
                                      │ MongoDB Vehicle   │
                                      └───────────────────┘
```

## Project Structure

- `frontend/` React application with map visualization and optimization UI.
- `backend/` Express API, algorithms, and persistence layer.

## Algorithms Used

1. **Dijkstra (O(E log V))**
   - Uses adjacency list + custom min-heap priority queue.
   - Computes shortest weighted path costs.
2. **A\***
   - Uses Haversine-distance heuristic to accelerate shortest-path search.
3. **Ant Colony Optimization (ACO)**
   - Approximates TSP order by probabilistic path construction and pheromone updates.
4. **Greedy Resource Allocation + Heuristics**
   - Assigns deliveries to vehicles while respecting capacity and minimizing imbalance.

## API Documentation

### `POST /optimize-route`
Optimize route order + vehicle allocation.

**Request Body (example):**
```json
{
  "locations": [
    { "id": "WH", "name": "Warehouse", "lat": 37.7749, "lng": -122.4194, "demand": 0 },
    { "id": "C1", "name": "Client 1", "lat": 37.7849, "lng": -122.4094, "demand": 3 }
  ],
  "vehicles": [
    { "name": "Van-A", "capacity": 10, "speedKph": 45, "fuelCostPerKm": 0.18 }
  ],
  "constraints": { "deadlineHours": 4 },
  "trafficFactor": 1.1,
  "weatherFactor": 1.05
}
```

### `GET /routes/:id`
Fetch stored route from MongoDB (if persistence enabled).

### `POST /simulate-traffic`
Broadcast dynamic condition update through WebSocket.

### `GET /vehicles`
Get available vehicles (DB-backed with fallback defaults).

## Setup

## 1) Backend
```bash
cd backend
npm install
npm run dev
```

Environment variables (`backend/.env`):
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-route-optimizer
```

## 2) Frontend
```bash
cd frontend
npm install
npm run dev
```

Optional env (`frontend/.env`):
```bash
VITE_API_BASE_URL=http://localhost:5000
```

## 3) Run tests
```bash
cd backend
npm test
```

## Sample Dataset

Use `backend/data/sample-data.json` directly in the UI JSON input or via API client.

## Production Notes

- Service-level cache avoids repeated optimization recomputation.
- WebSocket updates support real-time rerouting workflows.
- MongoDB persistence is optional and gracefully disabled when URI is missing.
- Code is separated by controllers/routes/services/algorithms for maintainability.
