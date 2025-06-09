import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Activity, Clock, MapPin, FileText, BarChart3, RefreshCw, AlertCircle } from 'lucide-react';
import { getAIPredictions, generateTrafficPrediction, formatExportData, type AIPrediction } from '@/services/trafficService';
import { Progress } from '@/components/ui/progress';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

// Extend the AIPrediction type to include additional fields we need
interface ExtendedAIPrediction extends AIPrediction {
  location?: string;
  predictedTravelTime?: number;
  peakHours?: string[];
  updatedAt?: string;
}

const AITrafficPrediction = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('hitech-city');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const [showAllPredictions, setShowAllPredictions] = useState(false);
  
  const locations = [
    { id: 'hitech-city', name: 'Hitech City' },
    { id: 'jubilee-hills', name: 'Jubilee Hills' },
    { id: 'gachibowli', name: 'Gachibowli' },
    { id: 'kukatpally', name: 'Kukatpally' },
    { id: 'banjara-hills', name: 'Banjara Hills' },
    { id: 'secunderabad', name: 'Secunderabad' },
    { id: 'ameerpet', name: 'Ameerpet' },
    { id: 'madhapur', name: 'Madhapur' },
    { id: 'kphb-colony', name: 'KPHB Colony' },
    { id: 'miyapur', name: 'Miyapur' }
  ];

  const { data: predictions = [], isLoading, refetch, error } = useQuery<ExtendedAIPrediction[]>({
    queryKey: ['ai-predictions', selectedLocation],
    queryFn: async () => {
      try {
        const data = await getAIPredictions(selectedLocation, 'hour');
        // Map the data to include the location field
        return data.map(prediction => ({
          ...prediction,
          location: prediction.locality // Map locality to location for compatibility
        }));
      } catch (err) {
        console.error('Error fetching predictions:', err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const generatePredictionMutation = useMutation({
    mutationFn: (location: string) => generateTrafficPrediction(location),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-predictions'] });
      toast.success('Prediction generated successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to generate prediction', {
        description: error.message || 'Please try again later',
      });
    }
  });

  const handleGeneratePrediction = () => {
    generatePredictionMutation.mutate(selectedLocation);
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refetch();
      toast.success('Predictions refreshed successfully');
    } catch (err) {
      console.error('Error refreshing predictions:', err);
      toast.error('Failed to refresh predictions');
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Combined loading state for both initial load and refreshing
  const isDataLoading = isLoading || isRefreshing;

  const getConfidenceBadgeColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500 text-white';
    if (confidence >= 0.6) return 'bg-blue-500 text-white';
    if (confidence >= 0.4) return 'bg-yellow-500 text-white';
    return 'bg-red-500 text-white';
  };

  const getCongestionColor = (level: number) => {
    if (level >= 0.7) return 'text-red-500';
    if (level >= 0.4) return 'text-orange-500';
    if (level >= 0.2) return 'text-yellow-500';
    return 'text-green-500';
  };
  
  const getCongestionLabel = (level: number) => {
    if (level >= 0.8) return 'Severe';
    if (level >= 0.6) return 'Heavy';
    if (level >= 0.4) return 'Moderate';
    if (level >= 0.2) return 'Light';
    return 'Clear';
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const downloadPredictions = () => {
    try {
      if (!predictions?.length) {
        toast.error('No prediction data available to download');
        return;
      }

      const csvContent = formatExportData(predictions, 'predictions');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `traffic_predictions_${new Date().toISOString().split('T')[0]}.csv`);
      
      toast.success('Predictions downloaded successfully');
    } catch (error) {
      toast.error('Failed to download predictions');
      console.error('Download error:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>AI Traffic Prediction</CardTitle>
            <CardDescription>Traffic volume and congestion forecasts</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleRefresh}
            disabled={isDataLoading}
            aria-label="Refresh predictions"
          >
            <RefreshCw 
              size={14} 
              className={isDataLoading ? 'animate-spin' : ''}
            />
            <span className="text-xs">
              {isDataLoading ? 'Refreshing...' : 'Refresh'}
            </span>
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex-1 mr-4">
            <Select 
              value={selectedLocation} 
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(location => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            className="flex items-center gap-1 bg-traffic-primary"
            onClick={handleGeneratePrediction}
            disabled={generatePredictionMutation.isPending}
          >
            <Brain size={16} />
            <span>Generate Prediction</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <RefreshCw size={32} className="animate-spin text-traffic-primary" />
            <p className="text-muted-foreground">Analyzing traffic patterns for {selectedLocation}...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4 text-muted-foreground">
            <AlertCircle size={48} className="text-red-500 opacity-70" />
            <p>Failed to load predictions</p>
            <p className="text-sm">{error.message || 'Please try again later'}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        ) : predictions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4 text-muted-foreground">
            <Brain size={48} className="text-traffic-muted opacity-40" />
            <p>No predictions available for {selectedLocation}.</p>
            <p className="text-sm">Generate a new prediction using the button above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {predictions.slice(0, 3).map((prediction, index) => (
              <div key={`prediction-${prediction.id || index}`} className="p-4 border rounded-md hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <BarChart3 size={18} className="text-traffic-primary mr-2" />
                    <div>
                      <h4 className="font-medium">Traffic Prediction</h4>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <MapPin size={12} className="mr-1" />
                        {prediction.locality || selectedLocation}
                      </div>
                    </div>
                  </div>
                  <Badge className={getConfidenceBadgeColor(prediction.confidenceLevel)}>
                    {Math.round(prediction.confidenceLevel * 100)}% confidence
                  </Badge>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Predicted Volume:</span>
                      <span className="font-medium">{prediction.predictedVolume} vehicles</span>
                    </div>
                    <Progress value={Math.min(100, (prediction.predictedVolume / 3000) * 100)} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Congestion Level:</span>
                      <span className={`font-medium ${getCongestionColor(prediction.predictedCongestion)}`}>
                        {getCongestionLabel(prediction.predictedCongestion)} ({Math.round(prediction.predictedCongestion * 100)}%)
                      </span>
                    </div>
                    <div className="relative">
                      <Progress value={prediction.predictedCongestion * 100} className="h-2" />
                      <div className="absolute inset-0 flex items-center px-2 text-[10px] text-muted-foreground">
                        <span>Clear</span>
                        <span className="ml-auto">Severe</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Clock size={12} className="mr-1" />
                    Prediction for: {formatDateTime(prediction.predictionTime)}
                  </div>
                  {prediction.modelVersion && (
                    <div className="flex items-center">
                      <Activity size={12} className="mr-1" />
                      Model v{prediction.modelVersion}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {predictions.length > 3 && (
              <div className="flex justify-center mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => {
                    setShowAllPredictions(!showAllPredictions);
                    if (!showAllPredictions) downloadPredictions();
                  }}
                >
                  <FileText size={14} />
                  <span>{showAllPredictions ? "Show Less" : "View All Predictions"}</span>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AITrafficPrediction;
