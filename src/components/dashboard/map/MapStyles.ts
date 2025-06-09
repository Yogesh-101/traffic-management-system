// Map style for a traffic management theme
export const mapContainerStyle = {
  width: '100%',
  height: '520px', // Increased height for better viewing
};

export const mapOptions = {
  styles: [
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        { "color": "#ffffff" }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        { "color": "#f8f8f8" },
        { "weight": 1.5 }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        { "color": "#dadada" },
        { "weight": 2 }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        { "color": "#f5f5f5" }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        { "color": "#e0f0e0" }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        { "color": "#b3d1ff" }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "labels.icon",
      "stylers": [
        { "visibility": "on" },
        { "saturation": 50 }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text",
      "stylers": [
        { "visibility": "on" },
        { "weight": 1.2 }
      ]
    }
  ],
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  mapTypeControlOptions: {
    style: 2, // DROPDOWN_MENU
    position: 7 // RIGHT_BOTTOM
  },
  streetViewControl: true,
  fullscreenControl: true,
  gestureHandling: 'cooperative',
  // Default zoom for Hyderabad city view
  zoom: 12,
  // Restrict map to Hyderabad region approximately
  restriction: {
    latLngBounds: {
      north: 17.60,
      south: 17.20,
      east: 78.70,
      west: 78.20
    },
    strictBounds: false
  }
};
