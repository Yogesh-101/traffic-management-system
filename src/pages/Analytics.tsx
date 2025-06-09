import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Calendar as CalendarIcon, Download, FileText, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { 
  getTrafficData, 
  getZoneTrafficData, 
  getAIPredictions, 
  getHistoricalTrafficData, 
  formatExportData,
  getIncidents,
  type Incident
} from '@/services/trafficService';
import { saveAs } from 'file-saver';
import { 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  Bar, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Cell, 
  PieChart, 
  Pie, 
  Sector, 
  ReferenceLine,
  ComposedChart
} from 'recharts';
import { format, parseISO, subDays } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

type DateRange = {
  from: Date;
  to: Date;
};

const Analytics = () => {
  // Date range state
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string }>({
    startDate: subDays(new Date(), 30).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Incident data for analytics with date range
  const { 
    data: incidents = [], 
    isLoading: isIncidentsLoading, 
    refetch: refetchIncidents 
  } = useQuery<Incident[]>({
    queryKey: ['incidents', dateRange],
    queryFn: () => getIncidents({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    }),
    refetchOnWindowFocus: false
  });

  // Process incident data for the chart
  const processIncidentData = useMemo(() => {
    if (!Array.isArray(incidents) || incidents.length === 0) return [];
    
    // Group incidents by date
    const incidentsByDate: Record<string, {
      date: string;
      count: number;
      severity: { low: number; medium: number; high: number };
    }> = {};

    incidents.forEach(incident => {
      const date = new Date(incident.timestamp).toISOString().split('T')[0];
      if (!incidentsByDate[date]) {
        incidentsByDate[date] = {
          date,
          count: 0,
          severity: { low: 0, medium: 0, high: 0 }
        };
      }
      
      const dayData = incidentsByDate[date];
      dayData.count++;
      
      // Count severity
      if (incident.severity === 'low') dayData.severity.low++;
      else if (incident.severity === 'medium') dayData.severity.medium++;
      else if (incident.severity === 'high') dayData.severity.high++;
    });
    
    // Convert to array and sort by date
    return Object.values(incidentsByDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(day => ({
        ...day,
        date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }));
  }, [incidents]);

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setDateRange({
        startDate: new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0]
      });
      setCalendarOpen(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    refetchIncidents();
  };

  // Rest of your component code...
  // [Previous component code remains the same, just update the date picker part]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                {selectedDate ? format(selectedDate, 'MMM yyyy') : 'Select month'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className={`h-4 w-4 ${isIncidentsLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Incident Trend Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Incident Trend
            </CardTitle>
            <div className="text-xs text-muted-foreground">
              {processIncidentData.length} days
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0" style={{ height: 350 }}>
          {isIncidentsLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : processIncidentData.length > 0 ? (
            <div className="h-full w-full">
              <div className="h-[calc(100%-28px)]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={processIncidentData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="incidentGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      tickMargin={8}
                    />
                    <YAxis 
                      yAxisId="left"
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      tickMargin={8}
                      width={24}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          const total = data.count;
                          const high = data.severity.high;
                          const medium = data.severity.medium;
                          const low = data.severity.low;
                          
                          return (
                            <div className="bg-white dark:bg-gray-900 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
                              <p className="font-medium">{label}</p>
                              <p className="text-sm mt-1">
                                <span className="font-medium">Total Incidents:</span> {total}
                              </p>
                              <div className="mt-2 space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="text-red-500">High:</span>
                                  <span>{high}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-amber-500">Medium:</span>
                                  <span>{medium}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-green-500">Low:</span>
                                  <span>{low}</span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                      cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '3 3' }}
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="count"
                      name="Total Incidents"
                      fill="#818cf8"
                      radius={[4, 4, 0, 0]}
                    >
                      {processIncidentData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={
                            entry.severity.high > 3 ? '#ef4444' : 
                            entry.severity.high > 1 ? '#f97316' : '#818cf8'
                          } 
                        />
                      ))}
                    </Bar>
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="severity.high"
                      name="High Severity"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 1 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="text-muted-foreground text-sm mb-2">No incident data available</div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs" 
                onClick={handleRefresh}
                disabled={isIncidentsLoading}
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isIncidentsLoading ? 'animate-spin' : ''}`} />
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
