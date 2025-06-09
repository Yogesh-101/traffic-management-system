
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BellRing, CheckCircle, Clock, AlertTriangle, InfoIcon, XCircle, RefreshCw } from 'lucide-react';
import { getSystemAlerts, resolveSystemAlert, SystemAlert } from '@/services/trafficService';
import { useAuth } from '@/contexts/AuthContext';

const SystemAlerts = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('active');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: alerts = [], isLoading, refetch } = useQuery({
    queryKey: ['system-alerts', filter],
    queryFn: () => {
      if (filter === 'all') return getSystemAlerts();
      return getSystemAlerts(filter !== 'resolved');
    },
  });

  const resolveAlertMutation = useMutation({
    mutationFn: (alertId: string) => 
      resolveSystemAlert(alertId, user?.email || 'unknown'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-alerts'] });
    }
  });

  const getSeverityIcon = (severity: SystemAlert['severity']) => {
    switch (severity) {
      case 'critical': return <XCircle size={16} className="text-red-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'info': return <InfoIcon size={16} className="text-blue-500" />;
      default: return <InfoIcon size={16} />;
    }
  };

  const getSeverityBadgeClass = (severity: SystemAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'warning': return 'bg-yellow-500 text-white';
      case 'info': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Monitoring notifications and warnings</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            <span className="text-xs">Refresh</span>
          </Button>
        </div>
        <div className="flex space-x-2 mt-2">
          <Button 
            size="sm" 
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className="text-xs"
          >
            All
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'active' ? 'default' : 'outline'}
            onClick={() => setFilter('active')}
            className="text-xs"
          >
            Active
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'resolved' ? 'default' : 'outline'}
            onClick={() => setFilter('resolved')}
            className="text-xs"
          >
            Resolved
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <RefreshCw size={24} className="animate-spin text-traffic-primary" />
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-2 text-muted-foreground">
            <BellRing size={36} className="text-traffic-muted opacity-40" />
            <p>No alerts found</p>
            <p className="text-sm">System is running smoothly</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="p-3 border rounded-md hover:bg-slate-50 transition-colors">
                <div className="flex justify-between">
                  <div className="flex items-start">
                    <div className="mt-1 mr-2">
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div>
                      <div className="font-medium">{alert.alertType}</div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      {alert.location && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Location: {alert.location}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge className={getSeverityBadgeClass(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </div>
                
                <div className="flex justify-between mt-3 items-center">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock size={12} className="mr-1" />
                    {formatDateTime(alert.resolvedAt || '')}
                  </div>
                  
                  {alert.resolved ? (
                    <div className="flex items-center text-xs text-green-600 font-medium">
                      <CheckCircle size={12} className="mr-1" />
                      Resolved by {alert.resolvedBy}
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs"
                      onClick={() => resolveAlertMutation.mutate(alert.id!)}
                      disabled={resolveAlertMutation.isPending}
                    >
                      <CheckCircle size={12} className="mr-1" />
                      Mark Resolved
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {alerts.length > 5 && (
              <Button variant="outline" size="sm" className="w-full mt-2">
                View All Alerts
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemAlerts;
