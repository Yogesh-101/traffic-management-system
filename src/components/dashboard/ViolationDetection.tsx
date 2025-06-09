import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Navigation, Camera, Car, RefreshCw, FileText, AlertTriangle } from 'lucide-react';
import { createIncident, getIncidents, updateIncidentStatus } from '@/services/trafficService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { saveAs } from 'file-saver';

const ViolationDetection = () => {
  const [filter, setFilter] = useState('all');
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({ type: '', location: '', severity: '' });
  const [last24h, setLast24h] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: incidents = [], isLoading, refetch } = useQuery({
    queryKey: ['incidents'],
    queryFn: getIncidents,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      updateIncidentStatus(id, status as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    }
  });

  const createIncidentMutation = useMutation({
    mutationFn: (incident: any) => createIncident(incident),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    }
  });

  // Compose filteredIncidents based on filter, last24h, and filterValues
  let filteredIncidents = incidents;
  if (filter !== 'all') {
    filteredIncidents = filteredIncidents.filter(incident => incident.status === filter);
  }
  if (last24h) {
    const now = new Date();
    filteredIncidents = filteredIncidents.filter(incident => {
      const t = new Date(incident.timestamp);
      return now.getTime() - t.getTime() <= 24 * 60 * 60 * 1000;
    });
  }
  if (filterValues.type) {
    filteredIncidents = filteredIncidents.filter(incident => incident.type === filterValues.type);
  }
  if (filterValues.location) {
    filteredIncidents = filteredIncidents.filter(incident => incident.location.toLowerCase().includes(filterValues.location.toLowerCase()));
  }
  if (filterValues.severity) {
    filteredIncidents = filteredIncidents.filter(incident => incident.severity === filterValues.severity);
  }
  filteredIncidents = filteredIncidents.slice(0, 4);

  const reportTestIncident = () => {
    const types = ['Speeding', 'Signal Violation', 'Illegal Parking', 'Reckless Driving'];
    const locations = ['Main & Broadway', 'Central Avenue', 'Tech Corridor', 'Downtown'];
    const severities = ['low', 'medium', 'high'];
    
    createIncidentMutation.mutate({
      type: types[Math.floor(Math.random() * types.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      timestamp: new Date().toISOString(),
      severity: severities[Math.floor(Math.random() * severities.length)],
      status: 'pending',
      description: 'Detected by automated system'
    });
  };

  const handleUpdateStatus = (id: number, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 text-white';
      case 'investigating': return 'bg-blue-500 text-white';
      case 'resolved': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-orange-500';
      case 'low': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const downloadViolations = () => {
    const textContent = [
      'ID | Type | Location | Timestamp | Severity | Status | Description',
      ...incidents.map(incident => [
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
    saveAs(blob, 'violations.txt');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap gap-2 mb-2">
          <Button variant="outline" size="sm" onClick={() => setIsFilterDialogOpen(true)}>Filter</Button>
          <Button variant={last24h ? 'default' : 'outline'} size="sm" onClick={() => setLast24h(v => !v)}>Last 24h</Button>
          <Button variant="outline" size="sm" onClick={() => setIsReportDialogOpen(true)}>Report Incident</Button>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Violation Detection</CardTitle>
            <CardDescription>Recently detected traffic violations</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => reportTestIncident()}
              disabled={createIncidentMutation.isPending}
            >
              <AlertTriangle size={14} className="mr-1" />
              <span className="text-xs">Test Alert</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
              <span className="text-xs">Refresh</span>
            </Button>
          </div>
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
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
            className="text-xs"
          >
            Pending
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'investigating' ? 'default' : 'outline'}
            onClick={() => setFilter('investigating')}
            className="text-xs"
          >
            Investigating
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
        ) : filteredIncidents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No violations found matching the selected filter.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredIncidents.map((incident) => (
              <div key={incident.id} className="p-3 border rounded-md hover:bg-slate-50 transition-colors">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium flex items-center">
                      {incident.type === 'Speeding' ? <Car size={16} className="mr-1" /> :
                       incident.type === 'Signal Violation' ? <Camera size={16} className="mr-1" /> :
                       <AlertTriangle size={16} className="mr-1" />}
                      {incident.type}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center mt-1">
                      <Navigation size={12} className="mr-1" />
                      {incident.location}
                    </div>
                  </div>
                  <Badge className={getStatusColor(incident.status)}>
                    {incident.status}
                  </Badge>
                </div>
                
                <div className="flex justify-between mt-3 items-center">
                  <div className="flex items-center">
                    <Clock size={12} className="mr-1 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(incident.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className={`text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                    {incident.severity.toUpperCase()} severity
                  </div>
                </div>
                
                {incident.status !== 'resolved' && (
                  <div className="mt-3 pt-2 border-t flex justify-end space-x-2">
                    {incident.status === 'pending' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => handleUpdateStatus(incident.id!, 'investigating')}
                        disabled={updateStatusMutation.isPending}
                      >
                        Investigate
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      className="text-xs bg-traffic-success"
                      onClick={() => handleUpdateStatus(incident.id!, 'resolved')}
                      disabled={updateStatusMutation.isPending}
                    >
                      Resolve
                    </Button>
                  </div>
                )}
              </div>
            ))}
            
            <div className="flex justify-center mt-4">
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={downloadViolations}>
                <FileText size={14} />
                <span>View All Violations</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Filter Dialog */}
      {isFilterDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
            <div className="mb-4 font-bold text-lg">Filter Incidents</div>
            <div className="mb-4 grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs mb-1">Type</label>
                <input className="border px-2 py-1 rounded w-full" type="text" placeholder="e.g. Speeding" value={filterValues.type} onChange={e => setFilterValues(v => ({ ...v, type: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs mb-1">Location</label>
                <input className="border px-2 py-1 rounded w-full" type="text" placeholder="e.g. Main St" value={filterValues.location} onChange={e => setFilterValues(v => ({ ...v, location: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs mb-1">Severity</label>
                <select className="border px-2 py-1 rounded w-full" value={filterValues.severity} onChange={e => setFilterValues(v => ({ ...v, severity: e.target.value }))}>
                  <option value="">Any</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={() => setIsFilterDialogOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={() => setIsFilterDialogOpen(false)}>Apply</Button>
            </div>
          </div>
        </div>
      )}

      {/* Report Incident Dialog */}
      {isReportDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
            <div className="mb-4 font-bold text-lg">Report Incident</div>
            <div className="mb-4 grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs mb-1">Type</label>
                <input className="border px-2 py-1 rounded w-full" type="text" placeholder="e.g. Speeding" id="report-type" />
              </div>
              <div>
                <label className="block text-xs mb-1">Location</label>
                <input className="border px-2 py-1 rounded w-full" type="text" placeholder="e.g. Main St" id="report-location" />
              </div>
              <div>
                <label className="block text-xs mb-1">Severity</label>
                <select className="border px-2 py-1 rounded w-full" id="report-severity">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1">Description</label>
                <input className="border px-2 py-1 rounded w-full" type="text" placeholder="Description" id="report-desc" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={() => setIsReportDialogOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={() => {
                const type = (document.getElementById('report-type') as HTMLInputElement)?.value || '';
                const location = (document.getElementById('report-location') as HTMLInputElement)?.value || '';
                const severity = (document.getElementById('report-severity') as HTMLSelectElement)?.value || 'low';
                const description = (document.getElementById('report-desc') as HTMLInputElement)?.value || '';
                if (type && location) {
                  createIncidentMutation.mutate({
                    type,
                    location,
                    severity,
                    description,
                    timestamp: new Date().toISOString(),
                    status: 'pending'
                  });
                  setIsReportDialogOpen(false);
                }
              }}>Report</Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ViolationDetection;
