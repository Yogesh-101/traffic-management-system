
import React from 'react';
import { Marker } from '@react-google-maps/api';
import { connections, junctions, flowStyles } from '@/data/trafficData';

const TrafficConnections: React.FC = () => {
  // Render connection lines using markers
  return (
    <>
      {connections.map((conn, i) => {
        const fromJunction = junctions.find(j => j.id === conn.from);
        const toJunction = junctions.find(j => j.id === conn.to);
        
        if (!fromJunction || !toJunction) return null;
        
        // Calculate the midpoint for arrow
        const midLat = (fromJunction.lat + toJunction.lat) / 2;
        const midLng = (fromJunction.lng + toJunction.lng) / 2;
        
        // Calculate angle for arrow rotation
        const angle = Math.atan2(
          toJunction.lat - fromJunction.lat,
          toJunction.lng - fromJunction.lng
        ) * 180 / Math.PI;
        
        return (
          <div key={`line-${i}`}>
            {/* Line start marker */}
            <Marker
              position={{ lat: fromJunction.lat, lng: fromJunction.lng }}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 0,
                strokeWeight: 0,
                fillOpacity: 0
              }}
            />
            
            {/* Line end marker */}
            <Marker
              position={{ lat: toJunction.lat, lng: toJunction.lng }}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 0,
                strokeWeight: 0,
                fillOpacity: 0
              }}
            />
            
            {/* Direction arrow in the middle */}
            <Marker
              position={{ lat: midLat, lng: midLng }}
              icon={{
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 4,
                fillColor: flowStyles[conn.flow],
                fillOpacity: 0.8,
                strokeColor: flowStyles[conn.flow],
                strokeWeight: 2,
                rotation: angle
              }}
            />
          </div>
        );
      })}
    </>
  );
};

export default TrafficConnections;
