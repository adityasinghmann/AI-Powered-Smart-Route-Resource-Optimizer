import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function RouteMap({ routeOrder }) {
  const center = routeOrder?.[0] ? [routeOrder[0].lat, routeOrder[0].lng] : [37.7749, -122.4194];
  const polyline = routeOrder?.map((loc) => [loc.lat, loc.lng]) || [];

  return (
    <MapContainer center={center} zoom={12} className="h-96 w-full rounded-xl shadow">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {routeOrder?.map((loc) => (
        <Marker key={loc.id} position={[loc.lat, loc.lng]}>
          <Popup>
            <strong>{loc.name}</strong>
            <br />
            Demand: {loc.demand}
          </Popup>
        </Marker>
      ))}
      {polyline.length > 1 && <Polyline positions={polyline} color="#2563eb" />}
    </MapContainer>
  );
}
