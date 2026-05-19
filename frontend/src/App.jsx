import { useEffect, useState } from 'react';
import OptimizerForm from './components/OptimizerForm';
import RouteMap from './components/RouteMap';
import { API_BASE_URL, fetchVehicles, optimizeRoute, simulateTraffic } from './services/api';

export default function App() {
  const [vehicles, setVehicles] = useState([]);
  const [result, setResult] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVehicles().then(setVehicles).catch((err) => setError(err.message));

    const events = new EventSource(`${API_BASE_URL}/events`);
    events.addEventListener('route-updated', (event) => {
      const payload = JSON.parse(event.data);
      setUpdates((prev) => [payload, ...prev].slice(0, 5));
    });

    return () => {
      events.close();
    };
  }, []);

  const handleOptimize = async (payload) => {
    try {
      setError('');
      const data = await optimizeRoute(payload);
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSimulate = async (payload) => {
    try {
      setError('');
      await simulateTraffic(payload);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app-shell">
      <h1>AI-Powered Smart Route & Resource Optimizer</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="app-grid">
        <OptimizerForm vehicles={vehicles} onOptimize={handleOptimize} onSimulateTraffic={handleSimulate} />
        <div className="result-column">
          <RouteMap routeOrder={result?.routeOrder} />
          <section className="panel">
            <h2>Optimization Metrics</h2>
            <p>Total Stops: {result?.routeOrder?.length || 0}</p>
            <p>Best Tour Length: {result?.tsp?.bestLength?.toFixed?.(2) || '-'}</p>
            {result?.estimated?.map((item) => (
              <div key={item.vehicle.name} className="metric-card">
                <p className="metric-title">{item.vehicle.name}</p>
                <p>ETA (h): {item.etaHours.toFixed(2)}</p>
                <p>Fuel Cost: ${item.fuelCost.toFixed(2)}</p>
                <p>Stops: {item.stops.map((s) => s.id).join(' -> ') || 'None'}</p>
              </div>
            ))}
          </section>
          <section className="panel">
            <h2>Real-Time Updates</h2>
            {updates.length === 0 ? (
              <p>No updates yet.</p>
            ) : (
              updates.map((u, index) => <p key={index}>{u.type} @ {u.timestamp || u.generatedAt}</p>)
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
