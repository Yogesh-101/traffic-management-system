import React, { useEffect } from 'react';
import { connections, junctions, flowStyles } from '@/data/trafficData';

interface ConnectionsOverlayProps {
  mapRef: google.maps.Map | null;
  isLoaded: boolean;
}

const ConnectionsOverlay: React.FC<ConnectionsOverlayProps> = ({ mapRef, isLoaded }) => {
  useEffect(() => {
    if (!mapRef || !isLoaded) return;
    
    // Create SVG overlay for lines
    const overlay = new google.maps.OverlayView();
    
    overlay.onAdd = function() {
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.left = '0';
      div.style.top = '0';
      div.style.width = '100%';
      div.style.height = '100%';
      div.style.pointerEvents = 'none';
      
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.style.position = 'absolute';
      svg.style.left = '0';
      svg.style.top = '0';
      svg.style.width = '100%';
      svg.style.height = '100%';
      svg.setAttribute('viewBox', '0 0 100 100');
      
      div.appendChild(svg);
      this.getPanes().overlayMouseTarget.appendChild(div);
      
      this.div_ = div;
      this.svg_ = svg;
    };
    
    overlay.draw = function() {
      const projection = this.getProjection();
      if (!projection) return;
      
      const svg = this.svg_;
      svg.innerHTML = '';
      
      connections.forEach((conn) => {
        const fromJunction = junctions.find(j => j.id === conn.from);
        const toJunction = junctions.find(j => j.id === conn.to);
        
        if (!fromJunction || !toJunction) return;
        
        const fromPoint = projection.fromLatLngToDivPixel(
          new google.maps.LatLng(fromJunction.lat, fromJunction.lng)
        );
        
        const toPoint = projection.fromLatLngToDivPixel(
          new google.maps.LatLng(toJunction.lat, toJunction.lng)
        );
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const strokeColor = flowStyles[conn.flow] || '#aaa';
        
        path.setAttribute('d', `M ${fromPoint.x} ${fromPoint.y} L ${toPoint.x} ${toPoint.y}`);
        path.setAttribute('stroke', strokeColor);
        path.setAttribute('stroke-width', '4');
        path.setAttribute('stroke-opacity', '0.8');
        path.setAttribute('fill', 'none');
        
        svg.appendChild(path);
      });
    };
    
    overlay.setMap(mapRef);
    
    return () => {
      overlay.setMap(null);
    };
  }, [mapRef, isLoaded]);

  return null; // This component doesn't render anything
};

export default ConnectionsOverlay;
