import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function RouteMap({ routeOrder }) {
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const routeLayerRef = useRef(null);

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) return undefined;

    const map = L.map(mapElementRef.current).setView([37.7749, -122.4194], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    routeLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 0);

    return () => {
      map.remove();
      mapRef.current = null;
      routeLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const routeLayer = routeLayerRef.current;
    if (!map || !routeLayer) return;

    routeLayer.clearLayers();
    const stops = routeOrder || [];

    if (stops.length === 0) {
      map.setView([37.7749, -122.4194], 12);
      return;
    }

    const points = stops.map((loc) => [loc.lat, loc.lng]);

    stops.forEach((loc, index) => {
      const popup = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = loc.name;
      popup.append(title, document.createElement('br'), `Demand: ${loc.demand}`);

      L.circleMarker([loc.lat, loc.lng], {
        radius: 7,
        color: index === 0 ? '#047857' : '#2563eb',
        fillColor: index === 0 ? '#10b981' : '#3b82f6',
        fillOpacity: 0.9,
        weight: 2
      })
        .bindPopup(popup)
        .addTo(routeLayer);
    });

    if (points.length > 1) {
      L.polyline(points, { color: '#2563eb', weight: 4 }).addTo(routeLayer);
      map.fitBounds(L.latLngBounds(points), { padding: [24, 24], maxZoom: 14 });
    } else {
      map.setView(points[0], 13);
    }
  }, [routeOrder]);

  return <div ref={mapElementRef} className="route-map" aria-label="Route map" />;
}
