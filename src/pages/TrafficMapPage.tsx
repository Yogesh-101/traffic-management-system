import React, { useState } from 'react';
import TrafficMap from '@/components/dashboard/TrafficMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Filter, Layers, Navigation2, MapPin, Sliders, Clock, Map } from 'lucide-react';
import { getZoneTrafficData, formatExportData } from '@/services/trafficService';
import { useQuery } from '@tanstack/react-query';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

const TrafficMapPage = () => {
  const [viewMode, setViewMode] = useState('traffic');
  const [timePeriod, setTimePeriod] = useState('live');

  const { data: zoneData } = useQuery({
    queryKey: ['zone-traffic-data'],
    queryFn: getZoneTrafficData
  });

  const handleExport = async () => {
    try {
      if (!zoneData?.length) {
        toast.error('No traffic zone data available to export');
        return;
      }

      const csvContent = formatExportData(zoneData, 'zones');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `traffic_zones_${new Date().toISOString().split('T')[0]}.csv`);
      
      toast.success('Traffic zone data exported successfully');
    } catch (error) {
      toast.error('Failed to export traffic zone data');
      console.error('Export error:', error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-traffic-primary p-2 rounded-md text-white">
            <Map size={20} />
          </div>
          <h2 className="text-2xl font-bold">Traffic Map</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Clock size={16} />
            <span>Live View</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter size={16} />
            <span>Filters</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleExport}
          >
            <Download size={16} />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <TrafficMap />
        </div>
        
        <div>
          <Card className="mb-6 border-t-4 border-t-traffic-primary">
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Layers size={16} className="mr-2 text-traffic-primary" />
                Map Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">View Mode</label>
                  <div className="grid grid-cols-3 gap-1">
                    <Button 
                      size="sm" 
                      variant={viewMode === 'traffic' ? "default" : "outline"} 
                      className="w-full"
                      onClick={() => setViewMode('traffic')}
                    >
                      Traffic
                    </Button>
                    <Button 
                      size="sm" 
                      variant={viewMode === 'congestion' ? "default" : "outline"} 
                      className="w-full"
                      onClick={() => setViewMode('congestion')}
                    >
                      Congestion
                    </Button>
                    <Button 
                      size="sm" 
                      variant={viewMode === 'incidents' ? "default" : "outline"} 
                      className="w-full"
                      onClick={() => setViewMode('incidents')}
                    >
                      Incidents
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Time Period</label>
                  <div className="grid grid-cols-3 gap-1">
                    <Button 
                      size="sm" 
                      variant={timePeriod === 'live' ? "default" : "outline"} 
                      className="w-full"
                      onClick={() => setTimePeriod('live')}
                    >
                      Live
                    </Button>
                    <Button 
                      size="sm" 
                      variant={timePeriod === '1h' ? "default" : "outline"} 
                      className="w-full"
                      onClick={() => setTimePeriod('1h')}
                    >
                      1h
                    </Button>
                    <Button 
                      size="sm" 
                      variant={timePeriod === 'today' ? "default" : "outline"} 
                      className="w-full"
                      onClick={() => setTimePeriod('today')}
                    >
                      Today
                    </Button>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-100">
                  <label className="text-xs text-gray-500 block mb-1">Map Features</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" className="w-full flex justify-start">
                      <MapPin size={14} className="mr-1" /> Points
                    </Button>
                    <Button size="sm" variant="outline" className="w-full flex justify-start">
                      <Navigation2 size={14} className="mr-1" /> Routes
                    </Button>
                  </div>
                </div>
                
                <div>
                  <button className="w-full flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-md text-sm">
                    <Sliders size={14} />
                    <span>Advanced Filters</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-traffic-warning">
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Navigation2 size={16} className="mr-2 text-traffic-warning" />
                Traffic Hotspots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-2 border border-red-100 bg-red-50 rounded-md">
                  <div className="font-medium text-red-700">Hitech City Junction</div>
                  <div className="text-xs text-red-600">Severe congestion - 90%</div>
                </div>
                <div className="p-2 border border-orange-100 bg-orange-50 rounded-md">
                  <div className="font-medium text-orange-700">Jubilee Hills Check Post</div>
                  <div className="text-xs text-orange-600">High congestion - 75%</div>
                </div>
                <div className="p-2 border border-yellow-100 bg-yellow-50 rounded-md">
                  <div className="font-medium text-yellow-700">Kukatpally Y Junction</div>
                  <div className="text-xs text-yellow-600">Moderate congestion - 60%</div>
                </div>
                <div className="p-2 border border-green-100 bg-green-50 rounded-md">
                  <div className="font-medium text-green-700">Gachibowli ORR</div>
                  <div className="text-xs text-green-600">Low congestion - 30%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrafficMapPage;
