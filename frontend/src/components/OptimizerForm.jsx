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
    <form onSubmit={submit} className="panel form-panel">
      <h2>Optimization Inputs</h2>
      <label>Locations (JSON)</label>
      <textarea
        rows={10}
        className="json-input"
        value={locationsText}
        onChange={(e) => setLocationsText(e.target.value)}
      />
      <div className="number-grid">
        <input type="number" step="0.1" value={deadlineHours} onChange={(e) => setDeadlineHours(e.target.value)} placeholder="Deadline hours" />
        <input type="number" step="0.1" value={trafficFactor} onChange={(e) => setTrafficFactor(e.target.value)} placeholder="Traffic factor" />
        <input type="number" step="0.1" value={weatherFactor} onChange={(e) => setWeatherFactor(e.target.value)} placeholder="Weather factor" />
      </div>
      <div className="button-row">
        <button type="submit" className="primary-button">Optimize Route</button>
        <button
          type="button"
          className="secondary-button"
          onClick={() => onSimulateTraffic({ trafficFactor: Number(trafficFactor) + 0.2, weatherFactor: Number(weatherFactor) + 0.1 })}
        >
          Simulate Traffic
        </button>
      </div>
    </form>
  );
}
