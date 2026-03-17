import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import OptimizerForm from './components/OptimizerForm';
import RouteMap from './components/RouteMap';
import { fetchVehicles, optimizeRoute, simulateTraffic } from './services/api';

const socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');

export default function App() {
  const [vehicles, setVehicles] = useState([]);
  const [result, setResult] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVehicles().then(setVehicles).catch((err) => setError(err.message));

    socket.on('route-updated', (payload) => {
      setUpdates((prev) => [payload, ...prev].slice(0, 5));
    });

    return () => {
      socket.off('route-updated');
    };
  }, []);

  const handleOptimize = async (payload) => {
    try {
      setError('');
      const data = await optimizeRoute(payload);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleSimulate = async (payload) => {
    try {
      await simulateTraffic(payload);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-4">
      <h1 className="mb-4 text-2xl font-bold">AI-Powered Smart Route & Resource Optimizer</h1>
      {error && <div className="mb-3 rounded bg-red-100 p-2 text-red-700">{error}</div>}
      <div className="grid gap-4 lg:grid-cols-2">
        <OptimizerForm vehicles={vehicles} onOptimize={handleOptimize} onSimulateTraffic={handleSimulate} />
        <div className="space-y-4">
          <RouteMap routeOrder={result?.routeOrder} />
          <div className="rounded-xl bg-white p-4 shadow">
            <h2 className="text-lg font-semibold">Optimization Metrics</h2>
            <p>Total Stops: {result?.routeOrder?.length || 0}</p>
            <p>Best Tour Length: {result?.tsp?.bestLength?.toFixed?.(2) || '-'}</p>
            {result?.estimated?.map((item) => (
              <div key={item.vehicle.name} className="mt-2 rounded border p-2">
                <p className="font-medium">{item.vehicle.name}</p>
                <p>ETA (h): {item.etaHours.toFixed(2)}</p>
                <p>Fuel Cost: ${item.fuelCost.toFixed(2)}</p>
                <p>Stops: {item.stops.map((s) => s.id).join(' → ') || 'None'}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-white p-4 shadow">
            <h2 className="text-lg font-semibold">Real-Time Updates</h2>
            {updates.length === 0 ? <p>No updates yet.</p> : updates.map((u, index) => <p key={index}>{u.type} @ {u.timestamp || u.generatedAt}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
}
