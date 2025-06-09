import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Filter, Clock, Map, Calendar, Download, ChevronsUpDown, Search, TrendingUp, ClockIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { junctions } from '@/data/trafficData';
import { getHyderabadTrafficData, getLocalityHistoricalComparison, getLocalityTrafficIncidents, getHighDensityZones, getAIPredictions, getPeakHours, TrafficFilter, HyderabadTrafficData, AIPrediction } from '@/services/trafficService';

// Mock data for traffic analytics
const hourlyData = [
  { time: '00:00', volume: 720, congestion: 15, incidents: 0 },
  { time: '04:00', volume: 850, congestion: 18, incidents: 1 },
  { time: '08:00', volume: 2100, congestion: 68, incidents: 3 },
  { time: '12:00', volume: 1800, congestion: 55, incidents: 2 },
  { time: '16:00', volume: 2400, congestion: 75, incidents: 4 },
  { time: '20:00', volume: 1500, congestion: 45, incidents: 1 },
];

const dailyData = [
  { day: 'Mon', volume: 15200, congestion: 42, incidents: 8 },
  { day: 'Tue', volume: 14800, congestion: 38, incidents: 7 },
  { day: 'Wed', volume: 15600, congestion: 45, incidents: 9 },
  { day: 'Thu', volume: 16200, congestion: 50, incidents: 11 },
  { day: 'Fri', volume: 18400, congestion: 62, incidents: 14 },
  { day: 'Sat', volume: 12800, congestion: 30, incidents: 5 },
  { day: 'Sun', volume: 9800, congestion: 22, incidents: 3 },
];

const junctionData = [
  { name: 'Main & Broadway', volume: 8500, congestion: 65 },
  { name: 'Central Ave', volume: 7200, congestion: 48 },
  { name: 'Park Road', volume: 4500, congestion: 30 },
  { name: 'Market St', volume: 6800, congestion: 42 },
  { name: 'Tech Corridor', volume: 9200, congestion: 70 },
];

// --- Reports Section helpers ---
const mockReports = [
  { 
    id: 1, 
    type: 'Speeding', 
    location: 'Hitech City Road', 
    timestamp: '2025-05-02T19:30:00+05:30', 
    severity: 'high', 
    status: 'pending', 
    description: 'Detected by camera near Cyber Towers' 
  },
  { 
    id: 2, 
    type: 'Signal Violation', 
    location: 'Jubilee Hills Check Post', 
    timestamp: '2025-05-02T18:00:00+05:30', 
    severity: 'medium', 
    status: 'investigating', 
    description: 'Manual report from traffic police' 
  },
  { 
    id: 3, 
    type: 'Illegal Parking', 
    location: 'Banjara Hills Road No. 1', 
    timestamp: '2025-05-01T22:00:00+05:30', 
    severity: 'low', 
    status: 'resolved', 
    description: 'Detected by patrol near GVK One' 
  },
  { 
    id: 4, 
    type: 'Reckless Driving', 
    location: 'Gachibowli ORR', 
    timestamp: '2025-05-02T20:00:00+05:30', 
    severity: 'high', 
    status: 'pending', 
    description: 'Detected by speed camera' 
  },
  { 
    id: 5, 
    type: 'Speeding', 
    location: 'Kukatpally Y Junction', 
    timestamp: '2025-05-02T15:30:00+05:30', 
    severity: 'medium', 
    status: 'resolved', 
    description: 'Detected by automated system' 
  },
];

const statusClass = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-500 text-white px-2 py-1 rounded text-xs';
    case 'investigating': return 'bg-blue-500 text-white px-2 py-1 rounded text-xs';
    case 'resolved': return 'bg-green-500 text-white px-2 py-1 rounded text-xs';
    default: return 'bg-gray-500 text-white px-2 py-1 rounded text-xs';
  }
};

const severityClass = (sev: string) => {
  switch (sev) {
    case 'high': return 'text-red-500 font-bold';
    case 'medium': return 'text-orange-500 font-bold';
    case 'low': return 'text-yellow-500 font-bold';
    default: return 'text-gray-500';
  }
};

const TrafficAnalytics = () => {
  // State for traffic data and filters
  const [trafficData, setTrafficData] = useState<HyderabadTrafficData[]>([]);
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLocality, setSelectedLocality] = useState<string>('');
  const [localityInput, setLocalityInput] = useState<string>('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [comparisonData, setComparisonData] = useState<{ current: HyderabadTrafficData[]; previous: HyderabadTrafficData[] }>({ current: [], previous: [] });
  const [comparisonPeriod, setComparisonPeriod] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [incidents, setIncidents] = useState<any[]>([]);
  const [highDensityZones, setHighDensityZones] = useState<{ locality: string; density: number; congestion: number }[]>([]);
  const [peakHours, setPeakHours] = useState<string[]>([]);
  
  // Filter state
  const [filters, setFilters] = useState<TrafficFilter>({
    locality: '',
    congestionLevel: 'all',
    timeOfDay: 'all'
  });
  const [showFilterPanel, setShowFilterPanel] = useState<boolean>(false);
  const [predictionRange, setPredictionRange] = useState<'hour' | 'day' | 'week'>('day');

  // Fetch initial traffic data
  useEffect(() => {
    fetchTrafficData();
    fetchHighDensityZones();
  }, []);

  // Fetch data when filters change
  useEffect(() => {
    if (selectedLocality) {
      fetchLocalityData(selectedLocality);
    }
  }, [selectedLocality, comparisonPeriod]);

  // Search functionality for localities
  useEffect(() => {
    if (localityInput) {
      const results = junctions
        .filter(j => j.name.toLowerCase().includes(localityInput.toLowerCase()))
        .map(j => j.name)
        .slice(0, 5);
      setSearchResults(results);
      setShowResults(results.length > 0);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [localityInput]);

  // Fetch all traffic data with filters
  const fetchTrafficData = async () => {
    setIsLoading(true);
    try {
      // If no filters are set, use default mock data
      if (!filters.locality && filters.congestionLevel === 'all' && filters.timeOfDay === 'all') {
        // Use the mock hourly data if no filters are applied
        const mockData = hourlyData.map((item, index) => ({
          id: index,
          date: new Date(`2025-06-09T${item.time}:00`).toISOString(),
          location: 'Hyderabad',
          volume: item.volume,
          avgSpeed: 30 + Math.random() * 20, // Random speed between 30-50 km/h
          congestionLevel: item.congestion / 100, // Convert to decimal for the data model
          mode: 'car',
          incidentCount: Math.floor(Math.random() * 5),
          travelTime: 15 + Math.random() * 30, // Random travel time between 15-45 minutes
          timeOfDay: getTimeOfDay(item.time),
          congestionCategory: getCongestionCategory(item.congestion / 100),
          densityCategory: getDensityCategory(item.volume),
          localityCategory: 'commercial' as const
        }));
        setTrafficData(mockData);
      } else {
        // Otherwise, try to fetch from the API
        const data = await getHyderabadTrafficData(filters);
        setTrafficData(data);
      }
    } catch (error) {
      console.error('Error fetching traffic data:', error);
      // Fallback to mock data if API fails
      const mockData = hourlyData.map((item, index) => ({
        id: index,
        date: new Date(`2025-06-09T${item.time}:00`).toISOString(),
        location: 'Hyderabad',
        volume: item.volume,
        avgSpeed: 30 + Math.random() * 20, // Random speed between 30-50 km/h
        congestionLevel: item.congestion / 100,
        mode: 'car',
        incidentCount: Math.floor(Math.random() * 5),
        travelTime: 15 + Math.random() * 30, // Random travel time between 15-45 minutes
        timeOfDay: getTimeOfDay(item.time),
        congestionCategory: getCongestionCategory(item.congestion / 100),
        densityCategory: getDensityCategory(item.volume),
        localityCategory: 'commercial' as const
      }));
      setTrafficData(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get time of day
  const getTimeOfDay = (time: string): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };

  // Helper function to get congestion category
  const getCongestionCategory = (level: number): 'low' | 'moderate' | 'high' | 'severe' => {
    if (level < 0.3) return 'low';
    if (level < 0.6) return 'moderate';
    if (level < 0.8) return 'high';
    return 'severe';
  };

  // Helper function to get density category
  const getDensityCategory = (volume: number): 'low' | 'medium' | 'high' => {
    if (volume < 1000) return 'low';
    if (volume < 2000) return 'medium';
    return 'high';
  };

  // Fetch high density zones
  const fetchHighDensityZones = async () => {
    try {
      const zones = await getHighDensityZones();
      setHighDensityZones(zones);
    } catch (error) {
      console.error('Error fetching high density zones:', error);
    }
  };

  // Fetch data for a specific locality with historical comparison
  const fetchLocalityData = async (locality: string) => {
    setIsLoading(true);
    try {
      // Fetch historical comparison data
      const comparison = await getLocalityHistoricalComparison(locality, comparisonPeriod);
      setComparisonData(comparison);
      
      // Fetch incidents for this locality
      const localityIncidents = await getLocalityTrafficIncidents(locality);
      setIncidents(localityIncidents);
    } catch (error) {
      console.error('Error fetching locality data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters
  const applyFilters = () => {
    fetchTrafficData();
    setShowFilterPanel(false);
  };

  // Handle locality selection
  const handleLocalitySelect = (locality: string) => {
    setSelectedLocality(locality);
    setLocalityInput(locality);
    setShowResults(false);
    setFilters(prev => ({ ...prev, locality }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      locality: '',
      congestionLevel: 'all',
      timeOfDay: 'all'
    });
    setSelectedLocality('');
    setLocalityInput('');
  };

  // Format data for hourly chart
  const formattedHourlyData = useMemo(() => {
    if (trafficData.length === 0) {
      // If no traffic data, use the mock hourly data
      return hourlyData.map(item => ({
        time: item.time,
        volume: item.volume,
        congestion: item.congestion,
        incidents: item.incidents
      }));
    }

    // Group by hour if we have actual traffic data
    const hourGroups: Record<string, { time: string; volume: number; congestion: number; incidents: number; count: number }> = {};
    
    trafficData.forEach(item => {
      try {
        const date = new Date(item.date);
        const hour = date.getHours();
        const timeKey = `${hour.toString().padStart(2, '0')}:00`;
        
        if (!hourGroups[timeKey]) {
          hourGroups[timeKey] = { 
            time: timeKey, 
            volume: 0, 
            congestion: 0, 
            incidents: item.incidentCount || 0,
            count: 0 
          };
        }
        
        hourGroups[timeKey].volume += item.volume;
        hourGroups[timeKey].congestion += item.congestionLevel * 100;
        hourGroups[timeKey].count += 1;
      } catch (error) {
        console.error('Error processing traffic data item:', item, error);
      }
    });
    
    // Process the grouped data
    const result = Object.values(hourGroups).map(group => ({
      time: group.time,
      volume: Math.round(group.volume / (group.count || 1)),
      congestion: Math.round(group.congestion / (group.count || 1)),
      incidents: group.incidents
    }));
    
    // Sort by time and ensure we have all hours
    const sortedResult = result.sort((a, b) => a.time.localeCompare(b.time));
    
    // If we have less than 6 data points, fill in with mock data
    if (sortedResult.length < 6) {
      const timeSlots = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
      const filledData = timeSlots.map(time => {
        const existing = sortedResult.find(item => item.time === time);
        if (existing) return existing;
        
        const mockItem = hourlyData.find(item => item.time === time) || {
          time,
          volume: 1000 + Math.random() * 2000,
          congestion: 20 + Math.random() * 60,
          incidents: Math.floor(Math.random() * 5)
        };
        return {
          time,
          volume: mockItem.volume,
          congestion: mockItem.congestion,
          incidents: mockItem.incidents
        };
      });
      return filledData;
    }
    
    return sortedResult;
  }, [trafficData]);

  // Format data for daily chart
  const formattedDailyData = useMemo(() => {
    if (trafficData.length === 0) {
      // If no traffic data, use the mock daily data
      return dailyData;
    }

    // Group by day of week
    const dayGroups: Record<string, { 
      day: string; 
      volume: number; 
      congestion: number; 
      incidents: number; 
      count: number 
    }> = {};
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    trafficData.forEach(item => {
      try {
        const date = new Date(item.date);
        const dayName = days[date.getDay()];
        
        if (!dayGroups[dayName]) {
          dayGroups[dayName] = { 
            day: dayName, 
            volume: 0, 
            congestion: 0, 
            incidents: item.incidentCount || 0,
            count: 0 
          };
        }
        
        dayGroups[dayName].volume += item.volume;
        dayGroups[dayName].congestion += item.congestionLevel * 100;
        dayGroups[dayName].count += 1;
      } catch (error) {
        console.error('Error processing daily traffic data item:', item, error);
      }
    });
    
    // Process the grouped data
    const result = Object.values(dayGroups).map(group => ({
      day: group.day,
      volume: Math.round(group.volume / (group.count || 1)),
      congestion: Math.round(group.congestion / (group.count || 1)),
      incidents: group.incidents
    }));
    
    // Sort by day of week (Sun-Sat)
    const daysInOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const sortedResult = result.sort((a, b) => 
      daysInOrder.indexOf(a.day) - daysInOrder.indexOf(b.day)
    );
    
    // If we don't have all days, fill in with mock data
    if (sortedResult.length < 7) {
      return days.map(day => {
        const existing = sortedResult.find(item => item.day === day);
        if (existing) return existing;
        
        const mockItem = dailyData.find(item => item.day === day) || {
          day,
          volume: 10000 + Math.random() * 10000,
          congestion: 30 + Math.random() * 50,
          incidents: Math.floor(Math.random() * 10)
        };
        return {
          day,
          volume: mockItem.volume,
          congestion: mockItem.congestion,
          incidents: mockItem.incidents
        };
      });
    }
    
    return sortedResult;
  }, [trafficData]);

  return (
    <>
      {/* Search and Filters Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-auto sm:min-w-[350px]">
          <div className="flex items-center w-full">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search for a locality in Hyderabad..." 
                className="pl-9 pr-10"
                value={localityInput}
                onChange={(e) => setLocalityInput(e.target.value)}
                onFocus={() => setShowResults(searchResults.length > 0)}
              />
              {localityInput && (
                <button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    setLocalityInput('');
                    setSearchResults([]);
                  }}
                >
                  ×
                </button>
              )}
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="ml-2" 
              onClick={() => setShowFilterPanel(!showFilterPanel)}
            >
              <Filter className="h-4 w-4" />
            </Button>
            {selectedLocality && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2" 
                onClick={clearFilters}
              >
                Clear
              </Button>
            )}
          </div>
          
          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((locality, index) => (
                <div 
                  key={index} 
                  className="px-4 py-2 hover:bg-slate-100 cursor-pointer"
                  onClick={() => handleLocalitySelect(locality)}
                >
                  <div className="flex items-center">
                    <Map className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{locality}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Filter Panel */}
      {showFilterPanel && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="congestionLevel">Congestion Level</Label>
                <Select 
                  value={filters.congestionLevel || 'all'} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, congestionLevel: value as any }))}
                >
                  <SelectTrigger id="congestionLevel">
                    <SelectValue placeholder="Select congestion level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="timeOfDay">Time of Day</Label>
                <Select 
                  value={filters.timeOfDay || 'all'} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, timeOfDay: value as any }))}
                >
                  <SelectTrigger id="timeOfDay">
                    <SelectValue placeholder="Select time of day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Times</SelectItem>
                    <SelectItem value="morning">Morning (6AM-12PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12PM-4PM)</SelectItem>
                    <SelectItem value="evening">Evening (4PM-8PM)</SelectItem>
                    <SelectItem value="night">Night (8PM-6AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end space-x-2">
                <Button onClick={applyFilters} className="flex-1">Apply Filters</Button>
                <Button variant="outline" onClick={clearFilters}>Clear</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Traffic Analytics Card */}
      <Card className="col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Traffic Analytics {selectedLocality ? `- ${selectedLocality}` : '(Hyderabad)'}</CardTitle>
            <CardDescription>
              {isLoading ? 'Loading data...' : `Showing ${trafficData.length} traffic records`}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="hourly">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="hourly">Hourly</TabsTrigger>
              <TabsTrigger value="daily">Daily</TabsTrigger>
            </TabsList>
            <TabsContent value="hourly">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={formattedHourlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis 
                      yAxisId="left" 
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={{ stroke: '#e2e8f0' }}
                      width={40}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                      width={40}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.375rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                      labelStyle={{ fontWeight: 500, color: '#1e293b' }}
                      formatter={(value: any, name: string) => {
                        if (name === 'Hourly Traffic') return [value, 'Volume'];
                        if (name === 'Incidents') return [value, 'Incidents'];
                        return [value, name];
                      }}
                    />
                    <Legend 
                      verticalAlign="top"
                      height={36}
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{
                        paddingBottom: '10px'
                      }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="volume"
                      name="Hourly Traffic"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="incidents"
                      name="Incidents"
                      stroke="#f97316"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="daily">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={formattedHourlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    barSize={24}
                    barGap={4}
                    barCategoryGap={8}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis 
                      yAxisId="left" 
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={{ stroke: '#e2e8f0' }}
                      width={40}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                      width={40}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.375rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                      labelStyle={{ fontWeight: 500, color: '#1e293b' }}
                      formatter={(value: any, name: string) => {
                        if (name === 'Daily Traffic') return [value, 'Volume'];
                        if (name === 'Incidents') return [value, 'Incidents'];
                        return [value, name];
                      }}
                    />
                    <Legend 
                      verticalAlign="top"
                      height={36}
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{
                        paddingBottom: '10px'
                      }}
                    />
                    <Bar 
                      yAxisId="left" 
                      dataKey="volume" 
                      name="Daily Traffic" 
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      yAxisId="right" 
                      dataKey="incidents" 
                      name="Incidents" 
                      fill="#f97316"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      {/* Reports Section */}
      <Card className="col-span-2 mt-6">
        <CardHeader>
          <CardTitle>Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {mockReports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No reports found.
            </div>
          ) : (
            <div className="space-y-3">
              {mockReports.slice(0, 5).map((report) => (
                <div key={report.id} className="p-3 border rounded-md hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium flex items-center">
                        {report.type === 'Speeding' ? <span className="mr-1">🚗</span> :
                          report.type === 'Signal Violation' ? <span className="mr-1">🚦</span> :
                          <AlertTriangle size={16} className="mr-1" />}
                        {report.type}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center mt-1">
                        <span className="mr-1">📍</span>
                        {report.location}
                      </div>
                    </div>
                    <span className={statusClass(report.status)}>
                      {report.status}
                    </span>
                  </div>
                  <div className="flex justify-between mt-3 items-center">
                    <div className="flex items-center">
                      <span className="mr-1">🕒</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(report.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className={`text-xs font-medium ${severityClass(report.severity)}`}>
                      {report.severity.toUpperCase()} severity
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {report.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default TrafficAnalytics;
