
import React from 'react';
import MetricCard from '@/components/dashboard/MetricCard';
import TrafficMap from '@/components/dashboard/TrafficMap';
import TrafficSignalControl from '@/components/dashboard/TrafficSignalControl';
import ViolationDetection from '@/components/dashboard/ViolationDetection';
import TrafficAnalytics from '@/components/dashboard/TrafficAnalytics';
import AITrafficPrediction from '@/components/dashboard/AITrafficPrediction';
import SystemAlerts from '@/components/dashboard/SystemAlerts';
import { Activity, Car, AlertTriangle, Clock } from 'lucide-react';

const Index = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Traffic Management Dashboard</h2>
      
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard 
          title="Total Traffic Volume" 
          value="24,856"
          description="vehicles today"
          icon={<Car size={18} />}
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard 
          title="Average Wait Time" 
          value="4.2 min"
          description="at monitored junctions"
          icon={<Clock size={18} />}
          trend={{ value: 8, isPositive: false }}
        />
        <MetricCard 
          title="Traffic Violations" 
          value="32"
          description="detected in last 24h"
          icon={<AlertTriangle size={18} />}
          trend={{ value: 5, isPositive: false }}
        />
        <MetricCard 
          title="System Performance" 
          value="98.3%"
          description="uptime this week"
          icon={<Activity size={18} />}
        />
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Traffic Map (takes 2 columns) */}
        <div className="lg:col-span-2">
          <TrafficMap />
        </div>
        
        {/* Signal Control */}
        <TrafficSignalControl />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Traffic Analytics (takes 2 columns) */}
        <div className="lg:col-span-2">
          <TrafficAnalytics />
        </div>
        
        {/* Violation Detection */}
        <ViolationDetection />
      </div>
      
      {/* AI Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Traffic Prediction */}
        <div className="lg:col-span-2">
          <AITrafficPrediction />
        </div>
        
        {/* System Alerts */}
        <SystemAlerts />
      </div>
    </div>
  );
};

export default Index;
