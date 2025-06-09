
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Filter, Clock, Check, ChevronRight } from 'lucide-react';

// Mock incident data
const incidents = [
  {
    id: 1,
    location: 'Hitech City Junction',
    type: 'Accident',
    severity: 'high',
    time: '10:24 AM',
    status: 'active',
    description: 'Multi-vehicle collision blocking two lanes',
    respondingUnits: ['Police', 'Ambulance']
  },
  {
    id: 2,
    location: 'Jubilee Hills Road No. 36',
    type: 'Road Work',
    severity: 'medium',
    time: '9:15 AM',
    status: 'active',
    description: 'Road maintenance reducing traffic to one lane',
    respondingUnits: ['Maintenance']
  },
  {
    id: 3,
    location: 'Banjara Hills Road No. 1',
    type: 'Traffic Signal',
    severity: 'medium',
    time: '11:35 AM',
    status: 'active',
    description: 'Traffic signal malfunction causing delays',
    respondingUnits: ['Maintenance']
  },
  {
    id: 4,
    location: 'Gachibowli ORR',
    type: 'Accident',
    severity: 'low',
    time: '8:50 AM',
    status: 'resolved',
    description: 'Minor fender bender, vehicles moved to shoulder',
    respondingUnits: ['Police']
  },
  {
    id: 5,
    location: 'Tank Bund Road',
    type: 'Congestion',
    severity: 'medium',
    time: '7:30 AM',
    status: 'resolved',
    description: 'Heavy rush hour congestion',
    respondingUnits: []
  },
];

// Helper function to check if a date is within the last X hours/days
const isWithinTimeRange = (dateString: string, range: '24h' | 'week' | 'month'): boolean => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now.getTime() - date.getTime();
  
  switch (range) {
    case '24h':
      return diffInMs <= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    case 'week':
      return diffInMs <= 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    case 'month':
      return diffInMs <= 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    default:
      return true;
  }
};

const Incidents = () => {
  const [activeFilter, setActiveFilter] = useState<'24h' | 'week' | 'month'>('24h');
  const [showFilters, setShowFilters] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [incidents, setIncidents] = useState([
    {
      id: 1,
      location: 'Hitech City Junction',
      type: 'Accident',
      severity: 'high',
      time: new Date().toISOString(),
      status: 'active',
      description: 'Multi-vehicle collision near Cyber Towers',
      respondingUnits: ['Traffic Police', 'Ambulance']
    },
    {
      id: 2,
      location: 'Jubilee Hills Road No. 36',
      type: 'Traffic Jam',
      severity: 'medium',
      time: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      status: 'active',
      description: 'Heavy traffic due to road work',
      respondingUnits: ['Traffic Police']
    },
    {
      id: 3,
      location: 'Gachibowli ORR Exit',
      type: 'Breakdown',
      severity: 'low',
      time: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      status: 'cleared',
      description: 'Truck breakdown cleared',
      respondingUnits: ['RTA']
    },
    {
      id: 4,
      location: 'Kukatpally Y Junction',
      type: 'Water Logging',
      severity: 'high',
      time: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
      status: 'active',
      description: 'Heavy water logging after rain',
      respondingUnits: ['GHMC', 'Traffic Police']
    },
    {
      id: 5,
      location: 'Mehdipatnam Circle',
      type: 'Traffic Jam',
      severity: 'medium',
      time: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
      status: 'active',
      description: 'Rush hour traffic congestion',
      respondingUnits: ['Traffic Police']
    }
  ]);
  
  // Filter incidents based on the active time filter
  const filteredIncidents = React.useMemo(() => {
    return incidents.filter(incident => 
      isWithinTimeRange(incident.time, activeFilter)
    );
  }, [incidents, activeFilter]);
  
  const handleFilterClick = (filter: '24h' | 'week' | 'month') => {
    setActiveFilter(filter);
    setShowFilters(false);
  };
  
  const handleReportIncident = () => {
    setShowReportModal(true);
    // You can add more logic here for the report incident flow
    console.log('Opening incident report form');
  };
  
  const handleCloseModal = () => {
    setShowReportModal(false);
  };
  
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Submitting incident report');
    setShowReportModal(false);
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Traffic Incidents</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              <span>Filter</span>
            </Button>
            {showFilters && (
              <div className="absolute z-10 mt-1 w-40 rounded-md bg-white shadow-lg">
                <div className="p-1">
                  <button
                    className={`w-full text-left px-4 py-2 text-sm rounded ${activeFilter === '24h' ? 'bg-gray-100' : ''}`}
                    onClick={() => {
                      handleFilterClick('24h');
                      setShowFilters(false);
                    }}
                  >
                    Last 24 hours
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm rounded ${activeFilter === 'week' ? 'bg-gray-100' : ''}`}
                    onClick={() => {
                      handleFilterClick('week');
                      setShowFilters(false);
                    }}
                  >
                    This Week
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm rounded ${activeFilter === 'month' ? 'bg-gray-100' : ''}`}
                    onClick={() => {
                      handleFilterClick('month');
                      setShowFilters(false);
                    }}
                  >
                    This Month
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 min-w-[120px] justify-between"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Clock size={16} className="shrink-0" />
              <span className="truncate">
                {activeFilter === '24h' ? 'Last 24h' : 
                 activeFilter === 'week' ? 'This Week' : 'This Month'}
              </span>
              <svg 
                className={`w-4 h-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
            
            {showFilters && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
                {(['24h', 'week', 'month'] as const).map((filter) => (
                  <button
                    key={filter}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                      activeFilter === filter ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                    }`}
                    onClick={() => handleFilterClick(filter)}
                  >
                    {filter === '24h' ? 'Last 24 hours' : 
                     filter === 'week' ? 'This Week' : 'This Month'}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button 
            variant="default" 
            size="sm" 
            className="bg-traffic-primary"
            onClick={handleReportIncident}
          >
            Report Incident
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-traffic-alert">3</div>
            <p className="text-sm text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.3 min</div>
            <p className="text-sm text-muted-foreground">First responder arrival</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-traffic-success">11</div>
            <p className="text-sm text-muted-foreground">Since midnight</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Incident Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active">
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active Incidents</TabsTrigger>
              <TabsTrigger value="resolved">Resolved Incidents</TabsTrigger>
              <TabsTrigger value="all">All Incidents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              <div className="space-y-4">
                {filteredIncidents
                  .filter(incident => incident.status === 'active')
                  .map(incident => (
                    <div key={incident.id} className="border rounded-lg p-4 hover:border-traffic-secondary transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle 
                              size={16} 
                              className={
                                incident.severity === 'high' ? "text-red-500" :
                                incident.severity === 'medium' ? "text-orange-500" : "text-yellow-500"
                              } 
                            />
                            <h3 className="font-medium">{incident.location}</h3>
                            <Badge 
                              className={
                                incident.severity === 'high' ? "bg-red-500" :
                                incident.severity === 'medium' ? "bg-orange-500" : "bg-yellow-500"
                              }
                            >
                              {incident.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{incident.description}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">{incident.time}</div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{incident.type}</Badge>
                          {incident.respondingUnits.map((unit, i) => (
                            <Badge key={i} variant="secondary">{unit}</Badge>
                          ))}
                        </div>
                        <Button variant="ghost" size="sm" className="text-traffic-secondary">
                          Manage <ChevronRight size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="resolved">
              <div className="space-y-4">
                {filteredIncidents
                  .filter(incident => incident.status === 'resolved')
                  .map(incident => (
                    <div key={incident.id} className="border rounded-lg p-4 bg-slate-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Check size={16} className="text-green-500" />
                            <h3 className="font-medium">{incident.location}</h3>
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              RESOLVED
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{incident.description}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">{incident.time}</div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{incident.type}</Badge>
                        </div>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          View Details <ChevronRight size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="all">
              <div className="space-y-4">
                {incidents.map(incident => (
                  <div 
                    key={incident.id} 
                    className={`border rounded-lg p-4 ${
                      incident.status === 'resolved' ? 'bg-slate-50' : 'hover:border-traffic-secondary'
                    } transition-colors`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          {incident.status === 'active' ? (
                            <AlertTriangle 
                              size={16} 
                              className={
                                incident.severity === 'high' ? "text-red-500" :
                                incident.severity === 'medium' ? "text-orange-500" : "text-yellow-500"
                              } 
                            />
                          ) : (
                            <Check size={16} className="text-green-500" />
                          )}
                          <h3 className="font-medium">{incident.location}</h3>
                          {incident.status === 'active' ? (
                            <Badge 
                              className={
                                incident.severity === 'high' ? "bg-red-500" :
                                incident.severity === 'medium' ? "bg-orange-500" : "bg-yellow-500"
                              }
                            >
                              {incident.severity.toUpperCase()}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              RESOLVED
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{incident.description}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">{incident.time}</div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{incident.type}</Badge>
                        {incident.status === 'active' && incident.respondingUnits.map((unit, i) => (
                          <Badge key={i} variant="secondary">{unit}</Badge>
                        ))}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={incident.status === 'active' ? "text-traffic-secondary" : "text-muted-foreground"}
                      >
                        {incident.status === 'active' ? 'Manage' : 'View Details'} <ChevronRight size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="all">
              <div className="space-y-4">
                {incidents.map(incident => (
                  <div 
                    key={incident.id} 
                    className={`border rounded-lg p-4 ${
                      incident.status === 'resolved' ? 'bg-slate-50' : 'hover:border-traffic-secondary'
                    } transition-colors`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          {incident.status === 'active' ? (
                            <AlertTriangle 
                              size={16} 
                              className={
                                incident.severity === 'high' ? "text-red-500" :
                                incident.severity === 'medium' ? "text-orange-500" : "text-yellow-500"
                              } 
                            />
                          ) : (
                            <Check size={16} className="text-green-500" />
                          )}
                          <h3 className="font-medium">{incident.location}</h3>
                          {incident.status === 'active' ? (
                            <Badge 
                              className={
                                incident.severity === 'high' ? "bg-red-500" :
                                incident.severity === 'medium' ? "bg-orange-500" : "bg-yellow-500"
                              }
                            >
                              {incident.severity.toUpperCase()}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              RESOLVED
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{incident.description}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">{incident.time}</div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{incident.type}</Badge>
                        {incident.status === 'active' && incident.respondingUnits.map((unit, i) => (
                          <Badge key={i} variant="secondary">{unit}</Badge>
                        ))}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={incident.status === 'active' ? "text-traffic-secondary" : "text-muted-foreground"}
                      >
                        {incident.status === 'active' ? 'Manage' : 'View Details'} <ChevronRight size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Report Incident Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Report New Incident</h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitReport}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded"
                    placeholder="Enter incident location"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select className="w-full p-2 border rounded" required>
                    <option value="">Select incident type</option>
                    <option value="accident">Accident</option>
                    <option value="road_work">Road Work</option>
                    <option value="congestion">Congestion</option>
                    <option value="hazard">Hazard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Severity</label>
                  <select className="w-full p-2 border rounded" required>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea 
                    className="w-full p-2 border rounded"
                    rows={3}
                    placeholder="Provide details about the incident"
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-traffic-primary rounded-md hover:bg-traffic-primary/90"
                  >
                    Submit Report
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Incidents;
