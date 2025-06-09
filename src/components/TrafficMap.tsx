import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, TrafficLayer, DrawingManager } from '@react-google-maps/api';
import { Spinner } from 'react-bootstrap';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 20.5937, // Latitude for India
  lng: 78.9629  // Longitude for India
};

const onLoad = drawingManager => {
  console.log('DrawingManager onLoad', drawingManager);
};

const onPolygonComplete = polygon => {
  if (typeof window.google === 'undefined') {
    console.error('Google Maps API is not loaded yet.');
    return;
  }
  console.log('Polygon complete', polygon);
  // Here you can handle the selected area
};

const TrafficMap = () => {
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  useEffect(() => {
    if (typeof window.google !== 'undefined' && window.google.maps) {
      setIsApiLoaded(true);
    }
  }, []);

  if (!isApiLoaded) {
    return (
      <div style={{ 
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1
      }}>
        <Spinner animation="border" variant="primary" style={{ width: '2rem', height: '2rem' }} />
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey="AIzaSyCpbWDmdk64XpmbWUCKQI0KQkDdF3d0xf4">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={5}
      >
        <TrafficLayer />
        <DrawingManager
          onLoad={onLoad}
          onPolygonComplete={onPolygonComplete}
          options={{
            drawingControl: true,
            drawingControlOptions: {
              position: window.google.maps.ControlPosition.TOP_CENTER,
              drawingModes: [window.google.maps.drawing.OverlayType.POLYGON]
            },
            polygonOptions: {
              fillColor: '#2196F3',
              fillOpacity: 0.5,
              strokeWeight: 2,
              clickable: false,
              editable: true,
              zIndex: 1
            }
          }}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default TrafficMap; 