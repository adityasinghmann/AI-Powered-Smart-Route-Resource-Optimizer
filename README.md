# AI-Powered Smart Route & Resource Optimizer

A lean full-stack logistics optimizer that calculates route order, assigns stops to vehicles, estimates ETA/fuel cost, shows the route on a map, and streams real-time traffic updates.

## Lean Tech Stack

### Frontend

- **React**: builds the user interface.
- **Vite**: runs the frontend dev server and creates production builds.
- **Leaflet**: renders the map, route line, and stop markers.
- **Plain CSS**: styles the app without a CSS framework.
- **Browser `fetch()`**: calls backend APIs.
- **Browser `EventSource`**: receives real-time updates from the backend.

### Backend

- **Node.js**: runs the backend JavaScript runtime.
- **Express**: exposes REST APIs and the event stream.
- **In-memory store**: keeps the latest generated route plans for `/routes/:id`.
- **Optimization algorithms**: Dijkstra, A*, Ant Colony TSP approximation, and greedy vehicle allocation.

## What Was Removed

These were removed to make the project easier to explain while keeping the same features:

- MongoDB and Mongoose
- Socket.IO and socket.io-client
- Axios
- Tailwind CSS, PostCSS, and Autoprefixer
- React Leaflet
- Nodemon
- dotenv
- cors package

The app still has route optimization, vehicle allocation, map visualization, route lookup by ID, and real-time traffic updates.

## Architecture

```text
React + Vite + Leaflet
        |
        | fetch() for API calls
        | EventSource for real-time updates
        v
Node.js + Express
        |
        +-- /optimize-route
        +-- /routes/:id
        +-- /vehicles
        +-- /simulate-traffic
        +-- /events
        |
        v
Route algorithms + in-memory route store
```

## Project Structure

```text
backend/
  controllers/       Request handlers
  routes/            Express route definitions
  services/          Optimizer and allocation logic
  services/algorithms/
                    Dijkstra, A*, priority queue, graph, TSP
  utils/             Cache, event stream, geo helpers

frontend/
  src/components/    Form and map UI
  src/services/      API helper using fetch()
  src/utils/         Default sample locations
```

## Run Locally

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Backend default URL:

```text
http://localhost:5000
```

To use a different port in PowerShell:

```powershell
$env:PORT=5001
npm start
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend default URL:

```text
http://localhost:5173
```

Optional frontend API URL:

```powershell
$env:VITE_API_BASE_URL="http://localhost:5000"
npm run dev
```

### 3. Tests

```bash
cd backend
npm test
```

## API Endpoints

### `GET /health`

Checks whether the backend is running.

### `GET /vehicles`

Returns the default vehicle list.

### `POST /optimize-route`

Optimizes stop order, assigns vehicles, estimates metrics, stores the result in memory, and emits a real-time update.

### `GET /routes/:id`

Returns a generated route from memory. Stored routes reset when the backend restarts.

### `POST /simulate-traffic`

Creates a traffic/weather update and streams it to the frontend.

### `GET /events`

Server-Sent Events stream used by the frontend for real-time updates.

## Sample Request

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

## Easy Explanation

The frontend collects delivery locations and vehicle details, then sends them to the backend. The backend builds a weighted graph from the locations, uses route algorithms to find a good delivery order, assigns stops to vehicles based on capacity, calculates ETA and fuel cost, and sends the result back. The map draws the optimized route, and the event stream keeps the real-time update panel current.
