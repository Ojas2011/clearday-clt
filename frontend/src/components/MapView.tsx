import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView({ overviewData, selectedLocationId, onSelectLocation }) {
  // Center roughly on Charlotte
  const defaultCenter = [35.2271, -80.8431];

  const getColor = (label) => {
    switch (label) {
      case "Great": return "#22c55e"; // green-500
      case "OK": return "#eab308";    // yellow-500
      case "Poor": return "#f97316";  // orange-500
      case "Avoid": return "#ef4444"; // red-500
      default: return "#3b82f6";
    }
  };

  return (
    <div className="w-full h-80 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
      <MapContainer center={defaultCenter} zoom={11} scrollWheelZoom={false} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {overviewData.map((item) => {
          const { id, name, lat, lon } = item.location;
          const isSelected = id === selectedLocationId;
          const color = getColor(item.label);

          return (
            <CircleMarker
              key={id}
              center={[lat, lon]}
              radius={isSelected ? 12 : 8}
              pathOptions={{
                color: isSelected ? "#1d4ed8" : color,
                fillColor: color,
                fillOpacity: 0.8,
                weight: isSelected ? 3 : 2,
              }}
              eventHandlers={{
                click: () => onSelectLocation(id),
              }}
            >
              <Popup>
                <div className="text-center font-sans">
                  <h4 className="font-bold text-gray-900">{name}</h4>
                  <p className="text-sm font-semibold mt-1">Score: {item.score} ({item.label})</p>
                  <button
                    onClick={() => onSelectLocation(id)}
                    className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg shadow hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}