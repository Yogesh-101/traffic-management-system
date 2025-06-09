import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleMap, useJsApiLoader, TrafficLayer, Marker, InfoWindow } from '@react-google-maps/api';
import { defaultCenter, junctions } from '@/data/trafficData';
import { mapContainerStyle, mapOptions } from '@/components/dashboard/map/MapStyles';
import googleMapsConfig from '@/config/googleMaps';
import TrafficJunctions from '@/components/dashboard/map/TrafficJunctions';
import TrafficConnections from '@/components/dashboard/map/TrafficConnections';
import ConnectionsOverlay from '@/components/dashboard/map/ConnectionsOverlay';
import MapLegend from '@/components/dashboard/map/MapLegend';
import SearchBar from '@/components/dashboard/map/SearchBar';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, MapPin } from 'lucide-react';

import { AlertTriangle, FileText } from 'lucide-react';

// Import traffic service for real-time data
import { getTrafficData, getHyderabadTrafficData, searchHyderabadTrafficData } from '@/services/trafficService';
import { toast } from '@/hooks/use-toast';



const TrafficMap = () => {
  // --- Search State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number, name: string} | null>(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [realTimeTrafficData, setRealTimeTrafficData] = useState<any[]>([]);
  
  // --- Export Handler ---
  function handleExport() {
    try {
      const mapData = filteredJunctions.length ? filteredJunctions : [{ time: '20:35', location: 'Main St', volume: 120, congestionLevel: 'High', incidents: 2 }];
      const alertData = filteredAlerts;
      
      let summary = '';
      summary += 'Traffic Map Data Export\n';
      summary += '========================\n';
      summary += `Exported at: ${new Date().toLocaleString()}\n\n`;
      
      // Traffic Data Summary
      summary += 'Traffic Data Summary\n';
      summary += '--------------------\n';
      summary += `Total records: ${mapData.length}\n`;
      const totalVolume = mapData.reduce((sum, row) => sum + (row.volume || 0), 0);
      summary += `Total Traffic Volume: ${totalVolume}\n`;
      const avgVolume = mapData.length > 0 ? (totalVolume / mapData.length).toFixed(2) : '0';
      summary += `Average Volume per Record: ${avgVolume}\n\n`;
      
      // Traffic Alerts Summary
      summary += 'Traffic Alerts Summary\n';
      summary += '--------------------\n';
      summary += `Total alerts: ${alertData.length}\n`;
      const alertTypes = alertData.reduce((acc, alert) => {
        acc[alert.type] = (acc[alert.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      Object.entries(alertTypes).forEach(([type, count]) => {
        summary += `${type}: ${count}\n`;
      });
      
      // Detailed Data
      summary += '\nDetailed Data\n';
      summary += '-------------\n';
      
      // Traffic Data
      summary += '\nTraffic Data\n';
      summary += '------------\n';
      summary += 'Time\tLocation\tVolume\tCongestion\tIncidents\n';
      summary += '----------------------------------------------------------\n';
      mapData.forEach(row => {
        summary += `${row.time || '-'}\t${row.location || '-'}\t${row.volume ?? '-'}\t${row.congestionLevel ?? '-'}\t${row.incidents ?? '-'}\n`;
      });
      
      // Traffic Alerts
      summary += '\nTraffic Alerts\n';
      summary += '-------------\n';
      summary += 'ID\tType\tLocation\tSeverity\tStatus\tTime\n';
      summary += '----------------------------------------------------------\n';
      alertData.forEach(alert => {
        summary += `${alert.id}\t${alert.type}\t${alert.location}\t${alert.severity}\t${alert.status}\t${new Date(alert.timestamp).toLocaleString()}\n`;
      });
      
      const blob = new Blob([summary], { type: 'text/plain;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `traffic_map_export_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      alert('Failed to export map data');
    }
  }

  const [selectedJunction, setSelectedJunction] = useState<number | null>(null);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [zoom, setZoom] = useState(15);
  const [isTrafficLayerVisible, setTrafficLayerVisible] = useState(false);
  const [isLiveView, setLiveView] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [filter, setFilter] = useState({ location: '', congestionLevel: '' });
  const [filteredJunctions, setFilteredJunctions] = useState<any[]>([]); // Replace any with your junction type

  // --- Map Controls State ---
  const [showCongestion, setShowCongestion] = useState(false);
  const [showIncidents, setShowIncidents] = useState(false);
  const [showPoints, setShowPoints] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [timePeriod, setTimePeriod] = useState<'live' | '1h' | 'today'>('live');

  // --- Incident State ---
  const [trafficAlerts, setTrafficAlerts] = useState<any[]>([]);
  const [incidentFilter, setIncidentFilter] = useState({ type: '', location: '', severity: '' });
  const [incidentStatus, setIncidentStatus] = useState('all');
  const [incidentLast24, setIncidentLast24] = useState(false);
  const [isIncidentFilterOpen, setIsIncidentFilterOpen] = useState(false);
  const [isIncidentReportOpen, setIsIncidentReportOpen] = useState(false);

  // --- Traffic Alerts Filtering Logic ---
  let filteredAlerts = trafficAlerts;
  if (incidentStatus !== 'all') {
    filteredAlerts = filteredAlerts.filter(alert => alert.status === incidentStatus);
  }
  if (incidentLast24) {
    const now = new Date();
    filteredAlerts = filteredAlerts.filter(alert => {
      const t = new Date(alert.timestamp);
      return now.getTime() - t.getTime() <= 24 * 60 * 60 * 1000;
    });
  }
  if (incidentFilter.type) {
    filteredAlerts = filteredAlerts.filter(alert => alert.type === incidentFilter.type);
  }
  if (incidentFilter.location) {
    filteredAlerts = filteredAlerts.filter(alert => alert.location?.toLowerCase().includes(incidentFilter.location.toLowerCase()));
  }
  if (incidentFilter.severity) {
    filteredAlerts = filteredAlerts.filter(alert => alert.severity === incidentFilter.severity);
  }
  filteredAlerts = filteredAlerts.slice(0, 4);

  // Dummy data for export (replace with real filtered data)
  const mapData = filteredJunctions.length ? filteredJunctions : [{ time: '20:35', location: 'Main St', volume: 120, congestionLevel: 'High', incidents: 2 }];

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapsConfig.apiKey,
    // @ts-ignore - The type definition seems to be incorrect in the library
    libraries: googleMapsConfig.libraries as any[],
    version: googleMapsConfig.version
  });

  if (!googleMapsConfig.apiKey) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>Error: Google Maps API key is missing. Please check your .env file.</p>
      </div>
    );
  }

  // Handle search query
  const handleSearch = useCallback(async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchHyderabadTrafficData(query);
      setSearchResults(results);
      
      // If we have results, center the map on the first result
      if (results.length > 0) {
        const firstResult = results[0];
        // Find coordinates for this location (using junctions data)
        const junction = junctions.find(j => j.name.includes(firstResult.location));
        if (junction) {
          setSelectedLocation({
            lat: junction.lat,
            lng: junction.lng,
            name: firstResult.location
          });
          setShowInfoWindow(true);
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Search error",
        description: "Failed to search traffic data",
      });
    }
  }, []);

  // Handle location selection
  const handleLocationSelect = (lat: number, lng: number, name: string) => {
    setSelectedLocation({ lat, lng, name });
    if (mapRef) {
      mapRef.panTo({ lat, lng });
      mapRef.setZoom(16);
      setShowInfoWindow(true);
    }
  };

  // Load real-time traffic data and alerts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const trafficData = await getTrafficData();
        setRealTimeTrafficData(trafficData);

        const alerts = await getHyderabadTrafficData();
        setTrafficAlerts(alerts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    // Set up interval to refresh data every 30 seconds
    const intervalId = setInterval(fetchData, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map);
  }, []);

  const handleZoomIn = () => {
    if (mapRef) {
      setZoom(prev => Math.min(prev + 1, 20));
      mapRef.setZoom(Math.min(mapRef.getZoom() + 1, 20));
    }
  };
  
  const handleZoomOut = () => {
    if (mapRef) {
      setZoom(prev => Math.max(prev - 1, 1));
      mapRef.setZoom(Math.max(mapRef.getZoom() - 1, 1));
    }
  };

  const handleFilter = () => {
    setFilteredJunctions(junctions.filter(junction => {
      const matchesLocation = filter.location ? junction.name.toLowerCase().includes(filter.location.toLowerCase()) : true;
      const matchesCongestion = filter.congestionLevel ? junction.congestion === filter.congestionLevel : true;
      return matchesLocation && matchesCongestion;
    }));
    setIsFilterDialogOpen(false);
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-col gap-2 pb-2">
        <div className="flex flex-row items-center justify-between w-full">
          <div>
            <CardTitle>Traffic Map</CardTitle>
            <p className="text-sm text-muted-foreground">Real-time traffic conditions</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
              <ZoomIn size={16} />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
              <ZoomOut size={16} />
            </Button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="w-full mt-4">
          <SearchBar 
            onSearch={handleSearch} 
            onLocationSelect={handleLocationSelect} 
          />
        </div>
        {/* Map Controls Panel */}
        <div className="w-full bg-slate-50 border rounded p-3 flex flex-wrap gap-4 items-center mt-4">
          {/* View Mode */}
          <div className="flex flex-col">
            <span className="font-semibold text-xs mb-1">View Mode</span>
            <div className="flex gap-2">
              <Button variant={isTrafficLayerVisible ? 'default' : 'outline'} size="sm" onClick={() => setTrafficLayerVisible(v => !v)}>Traffic</Button>
              <Button variant={showCongestion ? 'default' : 'outline'} size="sm" onClick={() => setShowCongestion(v => !v)}>Congestion</Button>
              <Button variant={showIncidents ? 'default' : 'outline'} size="sm" onClick={() => setShowIncidents(v => !v)}>Incidents</Button>
            </div>
          </div>
          {/* Time Period */}
          <div className="flex flex-col">
            <span className="font-semibold text-xs mb-1">Time Period</span>
            <div className="flex gap-2">
              <Button variant={timePeriod === 'live' ? 'default' : 'outline'} size="sm" onClick={() => setTimePeriod('live')}>Live</Button>
              <Button variant={timePeriod === '1h' ? 'default' : 'outline'} size="sm" onClick={() => setTimePeriod('1h')}>1h</Button>
              <Button variant={timePeriod === 'today' ? 'default' : 'outline'} size="sm" onClick={() => setTimePeriod('today')}>Today</Button>
            </div>
          </div>
          {/* Map Features */}
          <div className="flex flex-col">
            <span className="font-semibold text-xs mb-1">Map Features</span>
            <div className="flex gap-2">
              <Button variant={showPoints ? 'default' : 'outline'} size="sm" onClick={() => setShowPoints(v => !v)}>Points</Button>
              <Button variant={showRoutes ? 'default' : 'outline'} size="sm" onClick={() => setShowRoutes(v => !v)}>Routes</Button>
            </div>
          </div>
          {/* Advanced Filters */}
          <div className="flex flex-col">
            <span className="font-semibold text-xs mb-1">Advanced</span>
            <Button variant="outline" size="sm" onClick={() => setIsAdvancedFilterOpen(true)}>Advanced Filters</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 relative">
        <div className="h-[500px] relative overflow-hidden">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={defaultCenter}
              zoom={zoom}
              onLoad={onMapLoad}
              options={mapOptions as google.maps.MapOptions}
            >
              {/* Traffic junctions and info windows */}
              <TrafficJunctions 
                selectedJunction={selectedJunction} 
                setSelectedJunction={setSelectedJunction} 
              />
              
              {/* Traffic connections as markers */}
              <TrafficConnections />
              
              {/* SVG overlay for drawing lines */}
              <ConnectionsOverlay mapRef={mapRef} isLoaded={isLoaded} />

              {/* Real-time traffic layer */}
              {isTrafficLayerVisible && <TrafficLayer />}
              
              {/* Traffic Alerts */}
              {trafficAlerts.map((alert) => (
                <Marker
                  key={alert.id}
                  position={alert.coordinates}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: '#dc2626',
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#ffffff',
                    scale: 8,
                  }}
                >
                  <InfoWindow
                    position={alert.coordinates}
                  >
                    <div className="p-2">
                      <h3 className="font-semibold">{alert.type}</h3>
                      <div className="mt-2">
                        <p className="text-sm">Location: {alert.location}</p>
                        <p className="text-sm">Severity: {alert.severity}</p>
                        <p className="text-sm">Status: {alert.status}</p>
                        <p className="text-sm">Time: {new Date(alert.timestamp).toLocaleString()}</p>
                        <p className="text-sm">Description: {alert.description}</p>
                      </div>
                    </div>
                  </InfoWindow>
                </Marker>
              ))}
              
              {/* Selected location marker */}
              {selectedLocation && (
                <Marker
                  position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: '#0ea5e9',
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#ffffff',
                    scale: 8,
                  }}
                  onClick={() => setShowInfoWindow(true)}
                >
                  {showInfoWindow && (
                    <InfoWindow
                      position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                      onCloseClick={() => setShowInfoWindow(false)}
                    >
                      <div className="p-2">
                        <h3 className="font-bold">{selectedLocation.name}</h3>
                        <div className="mt-1 text-sm">
                          <p>Volume: 120 vehicles</p>
                          <p>Avg Speed: 40 km/h</p>
                          <p>Congestion: 50%</p>
                          <p>Incidents: 2</p>
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
              )}

            </GoogleMap>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100">
              <div className="animate-pulse text-traffic-primary">Loading map...</div>
            </div>
          )}
          
          {/* Map legend */}
          <MapLegend />
        </div>
      </CardContent>
      {/* --- Traffic Incidents Section --- */}
      <div className="mt-6 mb-6">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap gap-2 mb-2">
              <Button variant="outline" size="sm" onClick={() => setIsIncidentFilterOpen(true)}>Filter</Button>
              <Button variant={incidentLast24 ? 'default' : 'outline'} size="sm" onClick={() => setIncidentLast24(v => !v)}>Last 24h</Button>
              <Button variant="outline" size="sm" onClick={() => setIsIncidentReportOpen(true)}>Report Incident</Button>
            </div>
            <div className="flex space-x-2 mt-2">
              <Button size="sm" variant={incidentStatus === 'all' ? 'default' : 'outline'} onClick={() => setIncidentStatus('all')}>All</Button>
              <Button size="sm" variant={incidentStatus === 'pending' ? 'default' : 'outline'} onClick={() => setIncidentStatus('pending')}>Pending</Button>
              <Button size="sm" variant={incidentStatus === 'investigating' ? 'default' : 'outline'} onClick={() => setIncidentStatus('investigating')}>Investigating</Button>
              <Button size="sm" variant={incidentStatus === 'resolved' ? 'default' : 'outline'} onClick={() => setIncidentStatus('resolved')}>Resolved</Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No traffic alerts found matching the selected filter.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAlerts.map((alert) => (
                  <div key={alert.id} className="p-3 border rounded-md hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium flex items-center">
                          {alert.type === 'Speeding' ? <span className="mr-1">🚗</span> :
                           alert.type === 'Signal Violation' ? <span className="mr-1">🚦</span> :
                           <AlertTriangle size={16} className="mr-1" />}
                          {alert.type}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center mt-1">
                          <span className="mr-1">📍</span>
                          {alert.location}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center mt-1">
                          <span className="mr-1">⏰</span>
                          {new Date(alert.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'medium' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {alert.description}
                    </div>
                  </div>
                ))}
                <div className="flex justify-center mt-4">
                  <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => {
                    const textContent = [
                      'ID | Type | Location | Timestamp | Severity | Status | Description',
                      ...filteredAlerts.map(incident => [
                        incident.id,
                        incident.type,
                        incident.location,
                        new Date(incident.timestamp).toLocaleString(),
                        incident.severity,
                        incident.status,
                        incident.description
                      ].join(' | '))
                    ].join('\n');
                    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'traffic_incidents.txt';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}>
                    <FileText size={14} />
                    <span>Export Incidents</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>

          {/* Incident Filter Dialog */}
          {isIncidentFilterOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
              <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
                <div className="mb-4 font-bold text-lg">Filter Incidents</div>
                <div className="mb-4 grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs mb-1">Type</label>
                    <input className="border px-2 py-1 rounded w-full" type="text" placeholder="e.g. Speeding" value={incidentFilter.type} onChange={e => setIncidentFilter(v => ({ ...v, type: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Location</label>
                    <input className="border px-2 py-1 rounded w-full" type="text" placeholder="e.g. Main St" value={incidentFilter.location} onChange={e => setIncidentFilter(v => ({ ...v, location: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Severity</label>
                    <select className="border px-2 py-1 rounded w-full" value={incidentFilter.severity} onChange={e => setIncidentFilter(v => ({ ...v, severity: e.target.value }))}>
                      <option value="">Any</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => setIsIncidentFilterOpen(false)}>Cancel</Button>
                  <Button size="sm" onClick={() => setIsIncidentFilterOpen(false)}>Apply</Button>
                </div>
              </div>
            </div>
          )}

          {/* Incident Report Dialog */}
          {isIncidentReportOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
              <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
                <div className="mb-4 font-bold text-lg">Report Incident</div>
                <div className="mb-4 grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs mb-1">Type</label>
                    <input className="border px-2 py-1 rounded w-full" type="text" placeholder="e.g. Speeding" id="incident-report-type" />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Location</label>
                    <input className="border px-2 py-1 rounded w-full" type="text" placeholder="e.g. Main St" id="incident-report-location" />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Severity</label>
                    <select className="border px-2 py-1 rounded w-full" id="incident-report-severity">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Description</label>
                    <input className="border px-2 py-1 rounded w-full" type="text" placeholder="Description" id="incident-report-desc" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => setIsIncidentReportOpen(false)}>Cancel</Button>
                  <Button size="sm" onClick={() => {
                    const type = (document.getElementById('incident-report-type') as HTMLInputElement)?.value || '';
                    const location = (document.getElementById('incident-report-location') as HTMLInputElement)?.value || '';
                    const severity = (document.getElementById('incident-report-severity') as HTMLSelectElement)?.value || 'low';
                    const description = (document.getElementById('incident-report-desc') as HTMLInputElement)?.value || '';
                    if (type && location) {
                      setTrafficAlerts(prev => [
                        {
                          id: prev.length ? Math.max(...prev.map(i => i.id)) + 1 : 1,
                          type,
                          location,
                          severity,
                          description,
                          timestamp: new Date('2025-05-02T21:04:39+05:30').toISOString(),
                          status: 'pending'
                        },
                        ...prev
                      ]);
                      setIsIncidentReportOpen(false);
                    }
                  }}>Report</Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
      {/* Filters Dialog */}
      {isFilterDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
            <div className="mb-4 font-bold text-lg">Filter Map Data</div>
            <div className="mb-2">
              <label className="block text-xs mb-1">Location</label>
              <input
                className="border px-2 py-1 rounded w-full"
                type="text"
                value={filter.location}
                onChange={e => setFilter(f => ({ ...f, location: e.target.value }))}
                placeholder="Enter location"
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs mb-1">Congestion Level</label>
              <select
                className="border px-2 py-1 rounded w-full"
                value={filter.congestionLevel}
                onChange={e => setFilter(f => ({ ...f, congestionLevel: e.target.value }))}
              >
                <option value="">Any</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsFilterDialogOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={handleFilter}>Apply</Button>
            </div>
          </div>
        </div>
      )}
      {/* Advanced Filters Modal */}
      {isAdvancedFilterOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
            <div className="mb-4 font-bold text-lg">Advanced Filters</div>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1">Location</label>
                <input className="border px-2 py-1 rounded w-full" type="text" placeholder="Enter location" />
              </div>
              <div>
                <label className="block text-xs mb-1">Congestion Level</label>
                <select className="border px-2 py-1 rounded w-full">
                  <option value="">Any</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1">Incidents</label>
                <input className="border px-2 py-1 rounded w-full" type="text" placeholder="Incident type or ID" />
              </div>
              <div>
                <label className="block text-xs mb-1">Time Range</label>
                <input className="border px-2 py-1 rounded w-full" type="text" placeholder="e.g. 08:00-10:00" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={() => setIsAdvancedFilterOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={() => setIsAdvancedFilterOpen(false)}>Apply</Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TrafficMap;
