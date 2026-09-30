import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Navigation, MapPin, Compass, Crosshair, Layers, ZoomIn, ZoomOut } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom compass component
const CompassControl = ({ bearing }) => {
  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <div className="bg-white rounded-full p-3 shadow-lg border-2 border-blue-200">
        <div 
          className="relative w-12 h-12 flex items-center justify-center"
          style={{ transform: `rotate(${bearing}deg)` }}
        >
          <Compass className="w-8 h-8 text-blue-600" />
          <div className="absolute top-0 w-1 h-3 bg-red-500 rounded-full transform -translate-x-1/2"></div>
        </div>
      </div>
    </div>
  );
};

// Map controls component
const MapControls = ({ onLocationClick, onLayerToggle }) => {
  const map = useMap();

  return (
    <div className="absolute top-4 left-4 z-[1000] space-y-2">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <button
          onClick={() => map.zoomIn()}
          className="w-10 h-10 flex items-center justify-center hover:bg-blue-50 border-b border-gray-200 transition-colors"
        >
          <ZoomIn className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={() => map.zoomOut()}
          className="w-10 h-10 flex items-center justify-center hover:bg-blue-50 transition-colors"
        >
          <ZoomOut className="w-5 h-5 text-gray-700" />
        </button>
      </div>
      
      <button
        onClick={onLocationClick}
        className="w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-200 flex items-center justify-center hover:bg-blue-50 transition-colors"
        title="My Location"
      >
        <Crosshair className="w-5 h-5 text-blue-600" />
      </button>
      
      <button
        onClick={onLayerToggle}
        className="w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-200 flex items-center justify-center hover:bg-blue-50 transition-colors"
        title="Toggle Layers"
      >
        <Layers className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
};

const InteractiveMap = ({ selectedRoute, onLocationSelect, selecting = 'pickup', pickupLocation = '', destination = '' }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [bearing, setBearing] = useState(0);
  const [mapLayer, setMapLayer] = useState('streets');
  const mapRef = useRef(null);

  // Aswan coordinates
  const aswanCenter = [24.0889, 32.8998];

  // Famous locations in Aswan
  const locations = [
    {
      name: "Philae Temple",
      position: [24.0267, 32.8842],
      description: "Ancient temple complex dedicated to Isis",
      type: "temple"
    },
    {
      name: "Elephantine Island",
      position: [24.0844, 32.8886],
      description: "Historic island with ancient ruins",
      type: "island"
    },
    {
      name: "Old Cataract Hotel",
      position: [24.0878, 32.8845],
      description: "Historic luxury hotel overlooking the Nile",
      type: "hotel"
    },
    {
      name: "Aswan High Dam",
      position: [23.9707, 32.8769],
      description: "Modern engineering marvel",
      type: "landmark"
    },
    {
      name: "Nubian Village",
      position: [24.0756, 32.8734],
      description: "Traditional Nubian community",
      type: "village"
    },
    {
      name: "Kitchener Island",
      position: [24.0911, 32.8923],
      description: "Botanical garden island",
      type: "island"
    }
  ];

  // Route paths
  const routes = {
    'Sunset Cruise': [
      [24.0889, 32.8998],
      [24.0844, 32.8886],
      [24.0911, 32.8923],
      [24.0878, 32.8845]
    ],
    'Temple Explorer': [
      [24.0889, 32.8998],
      [24.0267, 32.8842],
      [24.0756, 32.8734],
      [24.0844, 32.8886],
      [24.0911, 32.8923]
    ],
    'Full Day Adventure': [
      [24.0889, 32.8998],
      [23.9707, 32.8769],
      [24.0267, 32.8842],
      [24.0756, 32.8734],
      [24.0844, 32.8886],
      [24.0911, 32.8923],
      [24.0878, 32.8845]
    ]
  };

  // Get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = [
            position.coords.latitude,
            position.coords.longitude
          ];
          setUserLocation(location);
          if (mapRef.current) {
            mapRef.current.setView(location, 15);
          }
          if (onLocationSelect) {
            onLocationSelect(location);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to Aswan center
          setUserLocation(aswanCenter);
        }
      );
    }
  };

  // Watch user heading for compass
  useEffect(() => {
    if (window.DeviceOrientationEvent) {
      const handleOrientation = (event) => {
        if (event.alpha !== null) {
          setBearing(360 - event.alpha);
        }
      };

      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, []);

  // Custom marker icons
  const createCustomIcon = (type) => {
    const colors = {
      temple: '#F59E0B',
      island: '#10B981',
      hotel: '#EF4444',
      landmark: '#8B5CF6',
      village: '#F97316'
    };

    return L.divIcon({
      html: `<div style="background-color: ${colors[type] || '#3B82F6'}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      className: 'custom-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  const toggleMapLayer = () => {
    setMapLayer(prev => prev === 'streets' ? 'satellite' : 'streets');
  };

  const getTileLayerUrl = () => {
    return mapLayer === 'satellite' 
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  };

  // تحديد اسم المكان المختار بناءً على نوع الاختيار
  const isSelected = (loc) => {
    if (selecting === 'pickup') {
      return pickupLocation === loc.name;
    } else {
      return destination === loc.name;
    }
  };

  // عند الضغط على Marker
  const handleMarkerClick = (loc) => {
    if (onLocationSelect) {
      onLocationSelect(loc.position, loc.name);
    }
  };

  // عند الضغط على الخريطة مباشرة (اختيار يدوي)
  const handleMapClick = (e) => {
    if (onLocationSelect) {
      onLocationSelect([e.latlng.lat, e.latlng.lng]);
    }
  };

  return (
    <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-2xl border-4 border-blue-100">
      <MapContainer
        center={aswanCenter}
        zoom={13}
        className="w-full h-full"
        ref={mapRef}
        whenCreated={mapInstance => mapRef.current = mapInstance}
        onClick={handleMapClick}
      >
        <TileLayer
          url={getTileLayerUrl()}
          attribution={mapLayer === 'satellite' 
            ? '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            : '&copy; OpenStreetMap contributors'
          }
        />

        {/* Location markers */}
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={location.position}
            icon={createCustomIcon(location.type)}
            eventHandlers={{ click: () => handleMarkerClick(location) }}
          >
            <Popup className="custom-popup">
              <div className="p-2">
                <h3 className={`font-bold mb-1 ${isSelected(location) ? 'text-blue-700' : 'text-blue-900'}`}>{location.name}</h3>
                <p className="text-sm text-gray-600">{location.description}</p>
                {isSelected(location) && <div className="mt-2 text-xs text-blue-600 font-bold">(المختار)</div>}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* User location marker */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-blue-900">Your Location</h3>
                <p className="text-sm text-gray-600">You are here</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marker يدوي عند اختيار نقطة من الخريطة */}
        {(() => {
          let manualPos = null;
          if (selecting === 'pickup' && pickupLocation && !locations.some(l => l.name === pickupLocation)) {
            const parts = pickupLocation.split(',').map(s => parseFloat(s.trim()));
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) manualPos = parts;
          }
          if (selecting === 'destination' && destination && !locations.some(l => l.name === destination)) {
            const parts = destination.split(',').map(s => parseFloat(s.trim()));
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) manualPos = parts;
          }
          return manualPos ? (
            <Marker position={manualPos}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-blue-700">الموقع المختار</h3>
                  <p className="text-sm text-gray-600">تم اختياره من الخريطة</p>
                </div>
              </Popup>
            </Marker>
          ) : null;
        })()}

        {/* Route polyline */}
        {selectedRoute && routes[selectedRoute] && (
          <Polyline
            positions={routes[selectedRoute]}
            color="#3B82F6"
            weight={4}
            opacity={0.8}
            dashArray="10, 10"
          />
        )}

        <MapControls 
          onLocationClick={getUserLocation}
          onLayerToggle={toggleMapLayer}
        />
      </MapContainer>

      <CompassControl bearing={bearing} />

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000] max-w-xs">
        <h4 className="font-semibold text-gray-900 mb-2 text-sm">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span>Temples</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Islands</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span>Hotels</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            <span>Villages</span>
          </div>
        </div>
      </div>

      {/* Current layer indicator */}
      <div className="absolute top-4 right-20 bg-white rounded-lg shadow-lg px-3 py-1 z-[1000]">
        <span className="text-xs font-medium text-gray-700 capitalize">{mapLayer}</span>
      </div>
    </div>
  );
};

export default InteractiveMap;