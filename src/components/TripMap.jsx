import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Navigation, Loader } from 'lucide-react';
import { t } from '../i18n';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Load Google Maps Script
const loadGoogleMapsScript = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }

    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google.maps));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geocoding`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// API Base URL
const API_URL = 'http://localhost:3001/api';

// Extract coordinates from Google Maps URL
const extractCoordsFromGoogleMapsUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  
  // Check if it's a Google Maps URL
  if (!url.includes('google.com/maps') && !url.includes('maps.google.com') && !url.includes('goo.gl/maps')) {
    return null;
  }

  try {
    // Pattern 1: @lat,lng,zoom format (most common)
    // Example: https://www.google.com/maps/@35.6585805,139.7454329,17z
    const atPattern = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const atMatch = url.match(atPattern);
    if (atMatch) {
      return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
    }

    // Pattern 2: place/Name/@lat,lng format
    // Example: https://www.google.com/maps/place/Tokyo+Tower/@35.6585805,139.7454329
    const placePattern = /place\/[^/]+\/@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const placeMatch = url.match(placePattern);
    if (placeMatch) {
      return { lat: parseFloat(placeMatch[1]), lng: parseFloat(placeMatch[2]) };
    }

    // Pattern 3: ?q=lat,lng or &q=lat,lng format
    // Example: https://www.google.com/maps?q=35.6585805,139.7454329
    const qPattern = /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const qMatch = url.match(qPattern);
    if (qMatch) {
      return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
    }

    // Pattern 4: /dir/ or data= with coordinates
    // Example: https://www.google.com/maps/dir//35.6585805,139.7454329
    const dirPattern = /\/dir\/[^/]*\/(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const dirMatch = url.match(dirPattern);
    if (dirMatch) {
      return { lat: parseFloat(dirMatch[1]), lng: parseFloat(dirMatch[2]) };
    }

    // Pattern 5: ll= parameter
    // Example: https://maps.google.com/?ll=35.6585805,139.7454329
    const llPattern = /[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const llMatch = url.match(llPattern);
    if (llMatch) {
      return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
    }

  } catch (e) {
    console.warn('Failed to parse Google Maps URL:', e);
  }

  return null;
};

// Resolve short URL via backend
const resolveShortUrl = async (url) => {
  try {
    const response = await fetch(`${API_URL}/maps/resolve-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.success && data.coords) {
      return data.coords;
    }
    return null;
  } catch (error) {
    console.warn('Failed to resolve short URL:', error);
    return null;
  }
};

// Geocode a location string to coordinates
const geocodeLocation = async (location, destination) => {
  if (!location || !window.google) return null;
  
  // 1. Check if it's a short URL
  if (location.includes('goo.gl') || location.includes('maps.app.goo.gl')) {
    const resolvedCoords = await resolveShortUrl(location);
    if (resolvedCoords) {
      console.log('Resolved short URL to coords:', resolvedCoords);
      return resolvedCoords;
    }
  }

  // 2. Try to extract coordinates from long Google Maps URL
  const urlCoords = extractCoordsFromGoogleMapsUrl(location);
  if (urlCoords) {
    console.log('Extracted coordinates from URL:', urlCoords);
    return urlCoords;
  }
  
  // 3. Use standard Geocoding API for regular addresses
  const geocoder = new window.google.maps.Geocoder();
  const searchQuery = destination ? `${location}, ${destination}` : location;
  
  return new Promise((resolve) => {
    geocoder.geocode({ address: searchQuery }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const { lat, lng } = results[0].geometry.location;
        resolve({ lat: lat(), lng: lng() });
      } else {
        console.warn(`Geocoding failed for: ${searchQuery}`);
        resolve(null);
      }
    });
  });
};

// Marker colors by activity type
const getMarkerColor = (type) => {
  const colors = {
    sightseeing: '#3B82F6', // blue
    food: '#F97316',        // orange
    transport: '#64748B',   // slate
    shopping: '#EC4899',    // pink
    other: '#10B981',       // emerald
  };
  return colors[type] || '#14B8A6'; // teal default
};

export default function TripMap({ activities, destination, language }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [geocodedLocations, setGeocodedLocations] = useState([]);

  const getTypeLabel = useCallback((type) => {
    const keyMap = { 
      sightseeing: 'categorySightseeing', 
      food: 'categoryFood', 
      transport: 'categoryTransport', 
      shopping: 'categoryShopping', 
      other: 'categoryOther' 
    };
    return t(keyMap[type] || 'categoryOther', language);
  }, [language]);

  // Initialize map
  const initializeMap = useCallback(async () => {
    if (!mapRef.current) return;

    try {
      setIsLoading(true);
      setError(null);
      
      await loadGoogleMapsScript();

      // Get destination coordinates for initial center
      let center = { lat: 35.6762, lng: 139.6503 }; // Default: Tokyo
      if (destination) {
        const destCoords = await geocodeLocation(destination);
        if (destCoords) center = destCoords;
      }

      // Create map
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 12,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });

      infoWindowRef.current = new window.google.maps.InfoWindow();

      // Geocode all activity locations
      const locationsWithCoords = await Promise.all(
        activities
          .filter(act => act.location && act.location.trim())
          .map(async (act) => {
            const coords = await geocodeLocation(act.location, destination);
            return coords ? { ...act, coords } : null;
          })
      );

      const validLocations = locationsWithCoords.filter(Boolean);
      setGeocodedLocations(validLocations);

      // Add markers
      addMarkers(validLocations);

      setIsLoading(false);
    } catch (err) {
      console.error('Map initialization error:', err);
      setError(t('mapError', language));
      setIsLoading(false);
    }
  }, [activities, destination, language, getTypeLabel]);

  // Add markers to map
  const addMarkers = useCallback((locations) => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    if (locations.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();

    locations.forEach((location, index) => {
      const marker = new window.google.maps.Marker({
        position: location.coords,
        map: mapInstanceRef.current,
        title: location.title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: getMarkerColor(location.type),
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        },
        label: {
          text: String(index + 1),
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: 'bold',
        },
      });

      // Info window content
      const infoContent = `
        <div style="padding: 8px; min-width: 150px;">
          <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600;">${location.title}</h3>
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">
            <span style="display: inline-block; padding: 2px 6px; background: #f1f5f9; border-radius: 4px; font-size: 11px;">
              ${getTypeLabel(location.type)}
            </span>
            ${location.time ? ` • ${location.time}` : ''}
          </p>
          <p style="margin: 0; font-size: 12px; color: #888;">📍 ${location.location}</p>
          ${location.cost ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: #14b8a6; font-weight: 500;">💰 $${location.cost.toLocaleString()}</p>` : ''}
          <a href="https://www.google.com/maps/search/?api=1&query=${location.coords.lat},${location.coords.lng}" target="_blank" rel="noopener noreferrer" style="display: block; margin-top: 8px; font-size: 12px; color: #3b82f6; text-decoration: none;">
            ${t('openInGoogleMaps', language)}
          </a>
        </div>
      `;

      marker.addListener('click', () => {
        infoWindowRef.current.setContent(infoContent);
        infoWindowRef.current.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
      bounds.extend(location.coords);
    });

    // Fit map to show all markers
    if (locations.length > 1) {
      mapInstanceRef.current.fitBounds(bounds, { padding: 50 });
    } else if (locations.length === 1) {
      mapInstanceRef.current.setCenter(locations[0].coords);
      mapInstanceRef.current.setZoom(15);
    }
  }, [language, getTypeLabel]);

  // Initialize on mount and when activities change
  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  // Location list item click handler
  const handleLocationClick = (location) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setCenter(location.coords);
    mapInstanceRef.current.setZoom(16);
    
    // Find and trigger marker click
    const markerIndex = geocodedLocations.findIndex(l => l.id === location.id);
    if (markerIndex >= 0 && markersRef.current[markerIndex]) {
      window.google.maps.event.trigger(markersRef.current[markerIndex], 'click');
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50 rounded-xl">
        <div className="text-center text-slate-500">
          <MapPin size={48} className="mx-auto mb-2 text-slate-300" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4">
      {/* Map Container */}
      <div className="flex-1 relative rounded-xl overflow-hidden shadow-sm border border-slate-200">
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="flex items-center gap-2 text-slate-600">
              <Loader className="animate-spin" size={20} />
              <span>{t('mapLoading', language)}</span>
            </div>
          </div>
        )}
        <div ref={mapRef} className="w-full h-full min-h-[400px]" />
      </div>

      {/* Locations Sidebar */}
      <div className="lg:w-72 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2">
            <Navigation size={16} className="text-teal-500" />
            {t('locationList', language)}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {t('totalLocations', language).replace('{count}', geocodedLocations.length)}
          </p>
        </div>
        
        <div className="max-h-[400px] lg:max-h-[calc(100%-60px)] overflow-y-auto">
          {geocodedLocations.length === 0 ? (
            <div className="p-6 text-center text-slate-400">
              <MapPin size={32} className="mx-auto mb-2" />
              <p className="text-sm">{t('noLocations', language)}</p>
              <p className="text-xs mt-1">{t('noLocationsHint', language)}</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {geocodedLocations.map((location, index) => (
                <button
                  key={location.id}
                  onClick={() => handleLocationClick(location)}
                  className="w-full p-3 text-left hover:bg-slate-50 transition-colors flex items-start gap-3"
                >
                  <div 
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: getMarkerColor(location.type) }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-700 text-sm truncate">
                      {location.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                      <MapPin size={10} />
                      {location.location}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
