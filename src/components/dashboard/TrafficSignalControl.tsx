
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Check, Clock, AlertCircle, MousePointerClick, RefreshCw } from 'lucide-react';
import { getSignalSchedules, updateSignalSchedule, SignalSchedule } from '@/services/trafficService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const TrafficSignalControl = () => {
  const [selectedMode, setSelectedMode] = useState('auto');
  const [selectedSignal, setSelectedSignal] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Fetch signal data
  const { data: signals = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['signalSchedules'],
    queryFn: getSignalSchedules
  });

  // Mutation for updating signal
  const updateSignalMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number, updates: Partial<SignalSchedule> }) => 
      updateSignalSchedule(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['signalSchedules'] });
    }
  });

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-traffic-success text-white';
      case 'scheduled':
        return 'bg-traffic-secondary text-white';
      case 'override':
        return 'bg-traffic-alert text-white';
      default:
        return '';
    }
  };

  const handleDurationChange = (value: number[]) => {
    if (selectedSignal !== null) {
      updateSignalMutation.mutate({
        id: selectedSignal,
        updates: { duration: value[0] }
      });
    }
  };

  const toggleMode = (signalId: number, currentMode: 'auto' | 'manual') => {
    const newMode = currentMode === 'auto' ? 'manual' : 'auto';
    updateSignalMutation.mutate({
      id: signalId,
      updates: { mode: newMode }
    });
  };

  const changeGlobalMode = (value: string) => {
    if (value) {
      setSelectedMode(value);
      // Update all signals to this mode if needed
      if (value === 'emergency') {
        signals.forEach(signal => {
          updateSignalMutation.mutate({
            id: signal.id!,
            updates: { 
              mode: 'manual', 
              status: 'override',
              duration: 15 // Short cycles for emergency mode
            }
          });
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Signal Control</CardTitle>
            <CardDescription>Manage traffic signals across the network</CardDescription>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            <span className="text-xs">Sync</span>
          </Button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <ToggleGroup 
            type="single" 
            value={selectedMode} 
            onValueChange={changeGlobalMode}
          >
            <ToggleGroupItem value="auto" aria-label="Auto mode">
              Auto
            </ToggleGroupItem>
            <ToggleGroupItem value="manual" aria-label="Manual mode">
              Manual
            </ToggleGroupItem>
            <ToggleGroupItem value="emergency" aria-label="Emergency mode">
              Emergency
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <RefreshCw size={24} className="animate-spin text-traffic-primary" />
          </div>
        ) : isError ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-md">
            Error loading signal data. Please try again.
          </div>
        ) : (
          <div className="space-y-3">
            {signals.map((signal) => (
              <div 
                key={signal.id} 
                className={`p-3 rounded-md border transition-all ${
                  selectedSignal === signal.id 
                    ? 'border-traffic-secondary bg-slate-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedSignal(signal.id!)}
              >
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <div 
                      className={`w-3 h-3 rounded-full mr-2 ${signal.status === 'active' ? 'animate-signal-pulse' : ''}`}
                      style={{ 
                        backgroundColor: 
                          signal.status === 'active' ? '#10b981' : 
                          signal.status === 'scheduled' ? '#0ea5e9' : '#ef4444' 
                      }}
                    ></div>
                    <span className="font-medium">{signal.junction}</span>
                  </div>
                  <Badge className={statusBadgeVariant(signal.status)}>
                    {signal.status}
                  </Badge>
                </div>
                
                <div className="flex justify-between mt-2 items-center">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1 text-traffic-muted" />
                    <span className="text-sm">{signal.duration}s cycle</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant={signal.mode === 'auto' ? 'default' : 'outline'}
                    className={`text-xs ${signal.mode === 'auto' ? 'bg-traffic-secondary' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMode(signal.id!, signal.mode);
                    }}
                    disabled={updateSignalMutation.isPending}
                  >
                    {signal.mode === 'auto' ? (
                      <Check size={14} className="mr-1" />
                    ) : (
                      <MousePointerClick size={14} className="mr-1" />
                    )}
                    {signal.mode}
                  </Button>
                </div>
                
                {selectedSignal === signal.id && (
                  <div className="mt-3 border-t pt-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-traffic-muted">Signal Duration</span>
                      <span className="text-xs font-medium">{signal.duration}s</span>
                    </div>
                    <Slider
                      value={[signal.duration]}
                      min={10}
                      max={120}
                      step={5}
                      onValueChange={handleDurationChange}
                      className="my-4"
                      disabled={updateSignalMutation.isPending}
                    />
                    <div className="flex justify-between text-xs text-traffic-muted">
                      <span>10s</span>
                      <span>120s</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrafficSignalControl;
