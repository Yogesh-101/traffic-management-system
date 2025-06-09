import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Layers, ZoomIn, ZoomOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MapControlsProps {
  handleZoomIn: () => void;
  handleZoomOut: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({ handleZoomIn, handleZoomOut }) => {
  const [isTrafficLayerVisible, setTrafficLayerVisible] = useState(false);
  const [isSatelliteLayerVisible, setSatelliteLayerVisible] = useState(false);

  const toggleTrafficLayer = () => {
    setTrafficLayerVisible(!isTrafficLayerVisible);
    // Here you would typically update the map instance to show/hide the traffic layer
    console.log('Traffic layer visibility:', !isTrafficLayerVisible);
  };

  const toggleSatelliteLayer = () => {
    setSatelliteLayerVisible(!isSatelliteLayerVisible);
    console.log('Satellite layer visibility:', !isSatelliteLayerVisible);
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Layers size={16} /> Layers
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={toggleTrafficLayer}>
            {isTrafficLayerVisible ? 'Hide Traffic Layer' : 'Show Traffic Layer'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleSatelliteLayer}>
            {isSatelliteLayerVisible ? 'Hide Satellite Layer' : 'Show Satellite Layer'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
        <ZoomIn size={16} />
      </Button>
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
        <ZoomOut size={16} />
      </Button>
    </div>
  );
};

export default MapControls;
