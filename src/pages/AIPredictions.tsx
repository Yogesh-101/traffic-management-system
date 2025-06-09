import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Brain, BarChart2, Download, LineChart, AlertTriangle } from 'lucide-react';
import AITrafficPrediction from '@/components/dashboard/AITrafficPrediction';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAIPredictions, generateTrafficPrediction, formatExportData } from '@/services/trafficService';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

const AIPredictions = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [location, setLocation] = useState('all');
  const queryClient = useQueryClient();

  const locations = [
    "all",
    "Main & Broadway",
    "Central Avenue",
    "Tech Corridor",
    "Downtown",
    "Park Road"
  ];

  const { data: predictions = [], isLoading } = useQuery({
    queryKey: ['ai-predictions-history', location, timeRange],
    queryFn: () => getAIPredictions(location === 'all' ? undefined : location, timeRange as 'hour' | 'day' | 'week'),
  });

  const generatePredictionMutation = useMutation({
    mutationFn: (location: string) => generateTrafficPrediction(location),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-predictions-history'] });
    }
  });

  // Transform predictions data for charts
  const chartData = React.useMemo(() => {
    if (!predictions || predictions.length === 0) return [];
    
    // Group by location if showing all locations
    if (location === 'all') {
      const locations = [...new Set(predictions.map(p => p.locality))];
      return locations.map(loc => {
        const locPredictions = predictions
          .filter(p => p.locality === loc)
          .sort((a, b) => new Date(a.predictionTime).getTime() - new Date(b.predictionTime).getTime());
        
        return {
          name: loc,
          data: locPredictions.map(p => ({
            time: new Date(p.predictionTime).toLocaleTimeString(),
            volume: p.predictedVolume,
            congestion: Math.round(p.predictedCongestion * 100),
            confidence: Math.round(p.confidenceLevel * 100)
          })).slice(0, 10)
        };
      });
    }
    
    // For a single location, just show the data points
    return [{
      name: location,
      data: predictions
        .map(p => ({
          time: new Date(p.predictionTime).toLocaleTimeString(),
          volume: p.predictedVolume,
          congestion: Math.round(p.predictedCongestion * 100),
          confidence: Math.round(p.confidenceLevel * 100)
        }))
        .slice(0, 10)
        .reverse()
    }];
  }, [predictions, location]);

  const accuracyData = [
    { date: 'Mon', predicted: 1450, actual: 1380, accuracy: 95 },
    { date: 'Tue', predicted: 1320, actual: 1290, accuracy: 98 },
    { date: 'Wed', predicted: 1690, actual: 1580, accuracy: 93 },
    { date: 'Thu', predicted: 1820, actual: 1750, accuracy: 96 },
    { date: 'Fri', predicted: 2100, actual: 2200, accuracy: 95 },
    { date: 'Sat', predicted: 1650, actual: 1720, accuracy: 96 },
    { date: 'Sun', predicted: 1250, actual: 1200, accuracy: 96 },
  ];

  const handleExport = async () => {
    try {
      if (!predictions?.length) {
        toast.error('No prediction data available to export');
        return;
      }

      const csvContent = formatExportData(predictions, 'predictions');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `traffic_predictions_${new Date().toISOString().split('T')[0]}.csv`);
      
      toast.success('Predictions exported successfully');
    } catch (error) {
      toast.error('Failed to export predictions');
      console.error('Export error:', error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">AI Traffic Predictions</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Calendar size={16} />
            <span>Last 7 Days</span>
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{predictions.length}</div>
            <div className="flex items-center mt-1">
              <div className="text-xs text-traffic-success font-medium">↑ 15% increase</div>
              <p className="text-xs text-muted-foreground ml-2">since last week</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.7%</div>
            <div className="flex items-center mt-1">
              <div className="text-xs text-traffic-success font-medium">↑ 2.3% improvement</div>
              <p className="text-xs text-muted-foreground ml-2">since last week</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Model Version
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">v1.2.4</div>
            <div className="flex items-center mt-1">
              <div className="text-xs text-traffic-success font-medium">Updated 2 days ago</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Prediction History</CardTitle>
                <div className="flex space-x-2">
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Time Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">Last 24 hours</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(loc => (
                        <SelectItem key={loc} value={loc}>
                          {loc === "all" ? "All Locations" : loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="volume">
                <TabsList>
                  <TabsTrigger value="volume">Traffic Volume</TabsTrigger>
                  <TabsTrigger value="congestion">Congestion Level</TabsTrigger>
                  <TabsTrigger value="accuracy">Prediction Accuracy</TabsTrigger>
                </TabsList>
                
                <TabsContent value="volume" className="pt-4">
                  <div className="h-[350px]">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="volume" 
                            name="Predicted Volume" 
                            stroke="#0ea5e9" 
                            activeDot={{ r: 8 }} 
                            strokeWidth={2}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <BarChart2 size={48} className="mb-2 opacity-20" />
                        <p>No prediction data available for the selected criteria</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="congestion" className="pt-4">
                  <div className="h-[350px]">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="congestion" 
                            name="Congestion %" 
                            stroke="#ef4444" 
                            activeDot={{ r: 8 }} 
                            strokeWidth={2}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <LineChart size={48} className="mb-2 opacity-20" />
                        <p>No congestion data available for the selected criteria</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="accuracy" className="pt-4">
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={accuracyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="predicted" 
                          name="Predicted" 
                          stroke="#0ea5e9" 
                          strokeWidth={2}
                        />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="actual" 
                          name="Actual" 
                          stroke="#10b981" 
                          strokeWidth={2}
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="accuracy" 
                          name="Accuracy %" 
                          stroke="#8884d8" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Prediction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Select Location</label>
                  <Select defaultValue="Main & Broadway">
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.filter(l => l !== 'all').map(loc => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Time Horizon</label>
                  <Select defaultValue="1h">
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="4h">4 hours</SelectItem>
                      <SelectItem value="12h">12 hours</SelectItem>
                      <SelectItem value="24h">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  className="w-full flex items-center justify-center gap-2" 
                  onClick={() => generatePredictionMutation.mutate('Main & Broadway')}
                  disabled={generatePredictionMutation.isPending}
                >
                  <Brain size={16} />
                  <span>Generate New Prediction</span>
                </Button>
              </div>
              
              <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex">
                  <AlertTriangle size={18} className="text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">Demo Mode Active</p>
                    <p className="text-xs">Predictions are simulated using random data. In a production environment, this would use real-time ML models.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Model Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Traffic Volume RMSE</span>
                    <span className="font-medium">127.3</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Congestion Accuracy</span>
                    <span className="font-medium">92.7%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '92.7%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Travel Time Error</span>
                    <span className="font-medium">±1.2 min</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <AITrafficPrediction />
    </div>
  );
};

export default AIPredictions;
