
import React from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';
import { junctions, congestionColors } from '@/data/trafficData';

interface TrafficJunctionsProps {
  selectedJunction: number | null;
  setSelectedJunction: (id: number | null) => void;
}

const TrafficJunctions: React.FC<TrafficJunctionsProps> = ({ 
  selectedJunction, 
  setSelectedJunction 
}) => {
  return (
    <>
      {/* Traffic junctions as markers */}
      {junctions.map(junction => (
        <Marker
          key={junction.id}
          position={{ lat: junction.lat, lng: junction.lng }}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: congestionColors[junction.congestion],
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#FFFFFF'
          }}
          onClick={() => setSelectedJunction(junction.id === selectedJunction ? null : junction.id)}
        />
      ))}

      {/* Info window for selected junction */}
      {selectedJunction && (
        <InfoWindow
          position={{
            lat: junctions.find(j => j.id === selectedJunction)?.lat || 0,
            lng: junctions.find(j => j.id === selectedJunction)?.lng || 0
          }}
          onCloseClick={() => setSelectedJunction(null)}
        >
          <div className="p-2">
            <h3 className="font-bold text-sm">{junctions.find(j => j.id === selectedJunction)?.name}</h3>
            <div className="flex items-center mt-1">
              <div className="px-2 py-1 text-xs font-semibold rounded" style={{
                backgroundColor: congestionColors[junctions.find(j => j.id === selectedJunction)?.congestion || 'low'],
                color: 'white'
              }}>
                {junctions.find(j => j.id === selectedJunction)?.congestion.toUpperCase()}
              </div>
              <span className="text-xs ml-2 text-gray-500">Congestion</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
              <div>Wait time:</div>
              <div className="font-medium">
                {junctions.find(j => j.id === selectedJunction)?.congestion === 'high' ? '8-12 min' : 
                 junctions.find(j => j.id === selectedJunction)?.congestion === 'medium' ? '3-6 min' : '< 2 min'}
              </div>
              <div>Signal status:</div>
              <div className="font-medium">Adaptive</div>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default TrafficJunctions;
