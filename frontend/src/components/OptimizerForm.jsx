import { useState } from 'react';
import { defaultLocations } from '../utils/defaults';

export default function OptimizerForm({ vehicles, onOptimize, onSimulateTraffic }) {
  const [locationsText, setLocationsText] = useState(JSON.stringify(defaultLocations, null, 2));
  const [deadlineHours, setDeadlineHours] = useState(4);
  const [trafficFactor, setTrafficFactor] = useState(1);
  const [weatherFactor, setWeatherFactor] = useState(1);

  const submit = (event) => {
    event.preventDefault();
    const payload = {
      locations: JSON.parse(locationsText),
      vehicles,
      constraints: { deadlineHours: Number(deadlineHours) },
      trafficFactor: Number(trafficFactor),
      weatherFactor: Number(weatherFactor)
    };
    onOptimize(payload);
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">Optimization Inputs</h2>
      <label className="block text-sm font-medium">Locations (JSON)</label>
      <textarea
        rows={10}
        className="w-full rounded border p-2 font-mono text-xs"
        value={locationsText}
        onChange={(e) => setLocationsText(e.target.value)}
      />
      <div className="grid grid-cols-3 gap-2">
        <input className="rounded border p-2" type="number" step="0.1" value={deadlineHours} onChange={(e) => setDeadlineHours(e.target.value)} placeholder="Deadline hours" />
        <input className="rounded border p-2" type="number" step="0.1" value={trafficFactor} onChange={(e) => setTrafficFactor(e.target.value)} placeholder="Traffic factor" />
        <input className="rounded border p-2" type="number" step="0.1" value={weatherFactor} onChange={(e) => setWeatherFactor(e.target.value)} placeholder="Weather factor" />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="rounded bg-blue-600 px-3 py-2 text-white">Optimize Route</button>
        <button
          type="button"
          className="rounded bg-amber-500 px-3 py-2 text-white"
          onClick={() => onSimulateTraffic({ trafficFactor: Number(trafficFactor) + 0.2, weatherFactor: Number(weatherFactor) + 0.1 })}
        >
          Simulate Traffic
        </button>
      </div>
    </form>
  );
}
