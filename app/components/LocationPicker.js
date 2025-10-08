'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { GeocodingService } from '../services/geocoding';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectCurrentLocation,
  selectIsLocationPickerOpen,
  setLocationPickerOpen,
  setLocation,
} from '../store/slices/locationSlice';

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), { 
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>
});

// Popular cities for quick selection
const popularCities = [
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Delhi', lat: 28.7041, lng: 77.1025 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567 },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { name: 'Surat', lat: 21.1702, lng: 72.8311 },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
  { name: 'Kanpur', lat: 26.4499, lng: 80.3319 }
];

export default function LocationPicker({ onLocationSelect, currentLocation: propCurrentLocation, isModal = false }) {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [localSelectedLocation, setLocalSelectedLocation] = useState(propCurrentLocation || null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const searchTimeoutRef = useRef(null);
  
  // Get state from Redux
  const reduxCurrentLocation = useAppSelector(selectCurrentLocation);
  const isOpen = useAppSelector(selectIsLocationPickerOpen);

  // Use local state if in modal mode, otherwise use Redux state
  const currentLocation = isModal ? propCurrentLocation : reduxCurrentLocation;
  const selectedLocation = localSelectedLocation;

  // Search for locations using geocoding API
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);
      
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await GeocodingService.searchLocations(searchQuery);
          setSearchResults(results);
          
          // Also filter popular cities
          const filtered = popularCities.filter(city =>
            city.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setSuggestions(filtered);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
          
          // Fallback to local search
          const filtered = popularCities.filter(city =>
            city.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setSuggestions(filtered);
        } finally {
          setIsSearching(false);
        }
      }, 500); // Debounce search by 500ms
    } else {
      setSuggestions(popularCities);
      setSearchResults([]);
      setIsSearching(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleLocationClick = (location) => {
    setLocalSelectedLocation(location);
  };

  const handleQuickSelect = (location) => {
    console.log('Quick selecting location:', location); // Added debug
    setLocalSelectedLocation(location);
    // Update global location immediately
    dispatch(setLocation(location));
    // Close the picker after selection
    dispatch(setLocationPickerOpen(false));
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      console.log('Confirming location:', selectedLocation); // Added debug
      // Update global location
      dispatch(setLocation(selectedLocation));
      
      if (isModal && onLocationSelect) {
        // Format the location data for the parent component
        const locationData = {
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
          city: selectedLocation.city || selectedLocation.name,
          address: selectedLocation.address || selectedLocation.name,
          name: selectedLocation.name
        };
        onLocationSelect(locationData);
      } else {
        // Close the picker
        dispatch(setLocationPickerOpen(false));
      }
    }
  };

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    
    try {
      const position = await GeocodingService.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      // Get accurate address information using reverse geocoding
      const locationData = await GeocodingService.reverseGeocode(latitude, longitude);
      
      const locationObject = locationData ? {
        ...locationData,
        name: locationData.name || `${locationData.city}, ${locationData.state}` || `Current Location`,
        lat: latitude,
        lng: longitude,
        isCurrentLocation: true
      } : {
        name: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
        lat: latitude,
        lng: longitude,
        isCurrentLocation: true
      };

      setLocalSelectedLocation(locationObject);
      // Also update global location immediately for auto-detection
      dispatch(setLocation(locationObject));
      // Close the picker after getting current location
      dispatch(setLocationPickerOpen(false));
    } catch (error) {
      console.error('Error getting location:', error);
      let errorMessage = 'Unable to get your current location.';
      
      if (error.code === 1) {
        errorMessage = 'Location access denied. Please enable location permissions.';
      } else if (error.code === 2) {
        errorMessage = 'Location unavailable. Please try again.';
      } else if (error.code === 3) {
        errorMessage = 'Location request timed out. Please try again.';
      }
      
      alert(errorMessage);
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        dispatch(setLocationPickerOpen(false));
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          dispatch(setLocationPickerOpen(false));
        }
      }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Select Your Location</h2>
          <button
            onClick={() => dispatch(setLocationPickerOpen(false))}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row" style={{ height: '500px' }}>
          {/* Left Side - Search and Suggestions */}
          <div className="w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-gray-200 p-3 sm:p-4 overflow-y-auto max-h-60 sm:max-h-none">
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for your city, area, or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="w-full flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span className="text-sm font-medium">
                  {isGettingLocation ? 'Getting location...' : 'Use Current Location'}
                </span>
              </button>

              {/* Quick Update Button */}
              {selectedLocation && (
                <button
                  onClick={() => handleQuickSelect(selectedLocation)}
                  className="w-full flex items-center justify-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">
                    Update to: {selectedLocation.name.length > 20 ? selectedLocation.name.substring(0, 17) + '...' : selectedLocation.name}
                  </span>
                </button>
              )}
              
              {/* Search Results */}
              {searchResults.length > 0 && (
                <>
                  <h3 className="text-sm font-medium text-gray-700 mb-2 mt-4">Search Results</h3>
                  {searchResults.map((result, index) => (
                    <button
                      key={`search-${index}`}
                      onClick={() => handleLocationClick(result)}
                      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
                        selectedLocation?.lat === result.lat && selectedLocation?.lng === result.lng ? 'bg-purple-100 text-purple-800' : 'text-gray-700'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{result.name}</p>
                          {result.address && (
                            <p className="text-xs text-gray-500 truncate">{result.address}</p>
                          )}
                        </div>
                        {selectedLocation?.lat === result.lat && selectedLocation?.lng === result.lng && (
                          <svg className="w-4 h-4 text-purple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </>
              )}

              {/* Popular Cities */}
              <h3 className="text-sm font-medium text-gray-700 mb-2 mt-4">
                {searchResults.length > 0 ? 'Popular Cities' : 'Popular Cities'}
              </h3>
              {suggestions.map((city) => (
                <button
                  key={city.name}
                  onClick={() => handleLocationClick(city)}
                  className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
                    selectedLocation?.name === city.name ? 'bg-purple-100 text-purple-800' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span className="text-sm">{city.name}</span>
                    {selectedLocation?.name === city.name && (
                      <svg className="w-4 h-4 text-purple-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}


            </div>
          </div>

          {/* Right Side - Map */}
          <div className="w-full sm:w-2/3 h-full min-h-64 sm:min-h-0">
            <MapComponent
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationClick}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col space-y-3 p-3 sm:p-4 border-t border-gray-200 bg-gray-50">
          {/* Selected Location Info */}
          <div className="text-sm">
            {selectedLocation ? (
              <div className="space-y-1">
                <div className="font-medium text-gray-900">Selected: {selectedLocation.name}</div>
                {selectedLocation.address && (
                  <div className="text-gray-600 text-xs">{selectedLocation.address}</div>
                )}
                {selectedLocation.isCurrentLocation && (
                  <div className="text-blue-600 text-xs">This is your current location</div>
                )}
              </div>
            ) : (
              <div className="text-gray-600">Please select a location from the list or click on the map</div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
            <button
              onClick={() => dispatch(setLocationPickerOpen(false))}
              className="w-full sm:w-auto px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmLocation}
              disabled={!selectedLocation}
              className="w-full sm:w-auto px-6 sm:px-8 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {selectedLocation ? 'Confirm & Close' : 'Select Location'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
