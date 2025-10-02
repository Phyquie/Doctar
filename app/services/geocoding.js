// Geocoding service for accurate location search
export class GeocodingService {
  static async searchLocations(query) {
    try {
      // Using Nominatim (OpenStreetMap) geocoding service - free and accurate
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=5&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding service error');
      }
      
      const data = await response.json();
      
      return data.map(item => ({
        name: this.formatDisplayName(item),
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type: item.type,
        address: item.display_name,
        city: item.address?.city || item.address?.town || item.address?.village,
        state: item.address?.state,
        country: item.address?.country,
        postcode: item.address?.postcode
      }));
    } catch (error) {
      console.error('Geocoding error:', error);
      return [];
    }
  }

  static async reverseGeocode(lat, lng) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Reverse geocoding error');
      }
      
      const data = await response.json();
      
      return {
        name: this.formatDisplayName(data),
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lon),
        address: data.display_name,
        city: data.address?.city || data.address?.town || data.address?.village,
        state: data.address?.state,
        country: data.address?.country,
        postcode: data.address?.postcode
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }

  static formatDisplayName(item) {
    const address = item.address || {};
    const parts = [];
    
    // Add locality/area name
    if (address.neighbourhood || address.suburb) {
      parts.push(address.neighbourhood || address.suburb);
    }
    
    // Add city/town
    if (address.city || address.town || address.village) {
      parts.push(address.city || address.town || address.village);
    }
    
    // Add state if different from city
    if (address.state && !parts.includes(address.state)) {
      parts.push(address.state);
    }
    
    return parts.length > 0 ? parts.join(', ') : item.display_name;
  }

  static getCurrentPosition(options = {}) {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      const defaultOptions = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        { ...defaultOptions, ...options }
      );
    });
  }
}
