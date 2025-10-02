'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GeocodingService } from '../services/geocoding';

// Fix for default markers in Leaflet with Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapComponent({ selectedLocation, onLocationSelect }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    // Small delay to ensure the container is properly rendered
    const timer = setTimeout(() => {
      try {
        // Initialize map centered on India
        const map = L.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          keyboard: true,
          dragging: true,
          touchZoom: true
        }).setView([20.5937, 78.9629], 5);
        
        mapInstanceRef.current = map;

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        // Add click handler for map
        map.on('click', async (e) => {
          const { lat, lng } = e.latlng;
          
          try {
            // Get accurate location name using reverse geocoding
            const locationData = await GeocodingService.reverseGeocode(lat, lng);
            
            if (locationData) {
              onLocationSelect({
                ...locationData,
                name: locationData.name || `${locationData.city}, ${locationData.state}` || `Custom Location`,
                lat,
                lng
              });
            } else {
              // Fallback if reverse geocoding fails
              onLocationSelect({
                name: `Custom Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
                lat,
                lng
              });
            }
          } catch (error) {
            console.error('Reverse geocoding error:', error);
            // Fallback to coordinates
            onLocationSelect({
              name: `Custom Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
              lat,
              lng
            });
          }
        });

        // Force map to resize after a short delay
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 200);
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(true);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onLocationSelect]);

  useEffect(() => {
    if (!mapInstanceRef.current || !selectedLocation) return;

    const { lat, lng } = selectedLocation;

    // Remove existing marker
    if (markerRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
    }

    // Add new marker with custom popup
    const marker = L.marker([lat, lng]).addTo(mapInstanceRef.current);
    markerRef.current = marker;

    // Determine appropriate zoom level based on location type
    let zoomLevel = 13; // Default zoom for cities
    if (selectedLocation.type === 'city' || selectedLocation.type === 'town') {
      zoomLevel = 12;
    } else if (selectedLocation.type === 'village') {
      zoomLevel = 14;
    } else if (selectedLocation.isCurrentLocation) {
      zoomLevel = 16; // Higher zoom for current location
    }

    // Smoothly animate to the selected location
    mapInstanceRef.current.setView([lat, lng], zoomLevel, {
      animate: true,
      duration: 1.0
    });

    // Create detailed popup content
    const popupContent = `
      <div class="p-2">
        <h3 class="font-semibold text-sm text-gray-900">${selectedLocation.name}</h3>
        ${selectedLocation.address ? `<p class="text-xs text-gray-600 mt-1">${selectedLocation.address}</p>` : ''}
        ${selectedLocation.isCurrentLocation ? '<p class="text-xs text-blue-600 mt-1">📍 Current Location</p>' : ''}
        <p class="text-xs text-gray-500 mt-1">${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
      </div>
    `;

    // Add popup with location details
    marker.bindPopup(popupContent, {
      maxWidth: 300,
      className: 'custom-popup'
    }).openPopup();
  }, [selectedLocation]);

  if (mapError) {
    return (
      <div className="relative h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-8">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-gray-600 mb-2">Map could not be loaded</p>
          <p className="text-sm text-gray-500">Please select a location from the list on the left</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div 
        ref={mapRef} 
        className="w-full h-full min-h-[400px] rounded-lg"
        style={{ height: '400px' }}
      />
      
      {/* Map Instructions */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-sm z-10">
        <p className="text-sm text-gray-600">
          Click on the map to select a location
        </p>
      </div>
    </div>
  );
}
