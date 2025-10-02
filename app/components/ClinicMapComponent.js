'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function ClinicMapComponent({ clinicLocation, height = '192px' }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (!mapRef.current || !clinicLocation) return;

    // Clean up existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Small delay to ensure container is rendered
    const timer = setTimeout(() => {
      try {
        const { lat, lng, name, address } = clinicLocation;
        
        // Initialize map centered on clinic location
        const map = L.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          keyboard: true,
          dragging: true,
          touchZoom: true
        }).setView([lat, lng], 15);
        
        mapInstanceRef.current = map;

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        // Create and add marker
        const marker = L.marker([lat, lng]).addTo(map);
        markerRef.current = marker;

        // Create popup content
        const popupContent = `
          <div style="padding: 8px; min-width: 200px;">
            <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px; color: #1f2937;">${name}</h3>
            ${address ? `<p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280; line-height: 1.4;">${address}</p>` : ''}
            <p style="margin: 0; font-size: 11px; color: #9ca3af;">${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
          </div>
        `;

        // Bind popup to marker
        marker.bindPopup(popupContent, {
          maxWidth: 300,
          closeButton: true,
          autoClose: false,
          closeOnEscapeKey: true
        });

        // Force map to resize after a short delay
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 100);

      } catch (error) {
        console.error('Error initializing clinic map:', error);
        setMapError(true);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [clinicLocation]);

  if (mapError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-4">
          <div className="text-4xl text-gray-400 mb-2">📍</div>
          <p className="text-gray-600 text-sm">Map could not be loaded</p>
        </div>
      </div>
    );
  }

  if (!clinicLocation) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-4">
          <div className="text-4xl text-gray-400 mb-2">📍</div>
          <p className="text-gray-500 text-sm">Location not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ height, minHeight: height }}
      />
    </div>
  );
}