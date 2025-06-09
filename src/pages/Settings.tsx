import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Settings2, AlertTriangle, TrafficCone, Timer, Bell, MapPin } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    // Traffic Monitoring Settings
    realTimeMonitoring: true,
    congestionThreshold: 70,
    updateInterval: 5,
    
    // Alert Settings
    enableAlerts: true,
    alertThreshold: 3,
    alertTypes: ['congestion', 'accidents', 'roadwork'],
    
    // Traffic Control Settings
    adaptiveSignalControl: true,
    signalTiming: 'dynamic',
    emergencyOverride: true,
    
    // Data Collection Settings
    collectTrafficData: true,
    dataRetentionPeriod: 30,
    anonymizeData: true,
  });

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings2 className="h-6 w-6 text-traffic-primary" />
        <h1 className="text-2xl font-bold">Traffic Management Settings</h1>
      </div>

      <Tabs defaultValue="monitoring" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <TrafficCone className="h-4 w-4" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="control" className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            Control
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Data
          </TabsTrigger>
        </TabsList>

        {/* Traffic Monitoring Settings */}
        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Monitoring Settings</CardTitle>
              <CardDescription>Configure real-time traffic monitoring parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Real-time Monitoring</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable continuous traffic monitoring
                  </p>
                </div>
                <Switch
                  checked={settings.realTimeMonitoring}
                  onCheckedChange={(checked) => handleChange('realTimeMonitoring', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Congestion Threshold (%)</Label>
                <Slider
                  value={[settings.congestionThreshold]}
                  onValueChange={(value) => handleChange('congestionThreshold', value[0])}
                  min={0}
                  max={100}
                  step={5}
                />
                <p className="text-sm text-muted-foreground">
                  Set the traffic density threshold for congestion alerts
                </p>
              </div>

              <div className="space-y-2">
                <Label>Update Interval (minutes)</Label>
                <Select
                  value={settings.updateInterval.toString()}
                  onValueChange={(value) => handleChange('updateInterval', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 minute</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alert Settings */}
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Alert Settings</CardTitle>
              <CardDescription>Configure traffic alert parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for traffic events
                  </p>
                </div>
                <Switch
                  checked={settings.enableAlerts}
                  onCheckedChange={(checked) => handleChange('enableAlerts', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Alert Types</Label>
                <div className="space-y-2">
                  {['congestion', 'accidents', 'roadwork'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Switch
                        checked={settings.alertTypes.includes(type)}
                        onCheckedChange={(checked) => {
                          const newTypes = checked
                            ? [...settings.alertTypes, type]
                            : settings.alertTypes.filter(t => t !== type);
                          handleChange('alertTypes', newTypes);
                        }}
                      />
                      <Label className="capitalize">{type}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Alert Threshold (minutes)</Label>
                <Input
                  type="number"
                  value={settings.alertThreshold}
                  onChange={(e) => handleChange('alertThreshold', parseInt(e.target.value))}
                  min={1}
                  max={60}
                />
                <p className="text-sm text-muted-foreground">
                  Minimum duration for traffic events to trigger alerts
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Traffic Control Settings */}
        <TabsContent value="control">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Control Settings</CardTitle>
              <CardDescription>Configure traffic signal and control parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Adaptive Signal Control</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable dynamic traffic signal timing
                  </p>
                </div>
                <Switch
                  checked={settings.adaptiveSignalControl}
                  onCheckedChange={(checked) => handleChange('adaptiveSignalControl', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Signal Timing Mode</Label>
                <Select
                  value={settings.signalTiming}
                  onValueChange={(value) => handleChange('signalTiming', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dynamic">Dynamic</SelectItem>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Emergency Override</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow emergency vehicles to override signals
                  </p>
                </div>
                <Switch
                  checked={settings.emergencyOverride}
                  onCheckedChange={(checked) => handleChange('emergencyOverride', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Collection Settings */}
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data Collection Settings</CardTitle>
              <CardDescription>Configure traffic data collection parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Collect Traffic Data</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable collection of traffic statistics
                  </p>
                </div>
                <Switch
                  checked={settings.collectTrafficData}
                  onCheckedChange={(checked) => handleChange('collectTrafficData', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Data Retention Period (days)</Label>
                <Input
                  type="number"
                  value={settings.dataRetentionPeriod}
                  onChange={(e) => handleChange('dataRetentionPeriod', parseInt(e.target.value))}
                  min={1}
                  max={365}
                />
                <p className="text-sm text-muted-foreground">
                  How long to keep historical traffic data
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Anonymize Data</Label>
                  <p className="text-sm text-muted-foreground">
                    Remove personally identifiable information
                  </p>
                </div>
                <Switch
                  checked={settings.anonymizeData}
                  onCheckedChange={(checked) => handleChange('anonymizeData', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

export default Settings; 