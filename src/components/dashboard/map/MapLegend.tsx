
import React from 'react';

const MapLegend: React.FC = () => {
  return (
    <div className="absolute bottom-4 left-4 bg-white p-2 rounded-md shadow z-10">
      <h4 className="text-xs font-bold mb-1">Traffic Congestion</h4>
      <div className="flex flex-col gap-1">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-traffic-success mr-2"></div>
          <span className="text-xs">Low</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-traffic-warning mr-2"></div>
          <span className="text-xs">Medium</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-traffic-alert mr-2"></div>
          <span className="text-xs">High</span>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
