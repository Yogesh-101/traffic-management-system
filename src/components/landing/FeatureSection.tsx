
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Activity, AlertTriangle, Clock, Car, Gauge, Layers } from 'lucide-react';

const features = [
  {
    icon: <Car className="h-10 w-10 text-traffic-primary p-2 bg-traffic-primary/10 rounded-lg" />,
    title: "Real-Time Traffic Monitoring",
    description: "Monitor traffic conditions across your entire network with real-time data visualization and alerts."
  },
  {
    icon: <Layers className="h-10 w-10 text-traffic-secondary p-2 bg-traffic-secondary/10 rounded-lg" />,
    title: "AI Traffic Prediction",
    description: "Leverage machine learning to predict traffic patterns and proactively manage congestion before it occurs."
  },
  {
    icon: <MapPin className="h-10 w-10 text-traffic-warning p-2 bg-traffic-warning/10 rounded-lg" />,
    title: "Interactive Traffic Map",
    description: "Visualize traffic flow, incidents, and bottlenecks on an intuitive, interactive map interface."
  },
  {
    icon: <Activity className="h-10 w-10 text-traffic-success p-2 bg-traffic-success/10 rounded-lg" />,
    title: "Automated Signal Control",
    description: "Optimize traffic signal timing automatically based on current conditions and historical patterns."
  },
  {
    icon: <AlertTriangle className="h-10 w-10 text-traffic-alert p-2 bg-traffic-alert/10 rounded-lg" />,
    title: "Incident Detection",
    description: "Automatically detect accidents, violations, and other incidents with computer vision technology."
  },
  {
    icon: <Clock className="h-10 w-10 text-traffic-muted p-2 bg-traffic-muted/10 rounded-lg" />,
    title: "Historical Analysis",
    description: "Analyze historical traffic data to identify patterns and optimize long-term traffic management strategies."
  }
];

const FeatureSection = () => {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Comprehensive Traffic Management Features</h2>
          <p className="text-muted-foreground text-lg">
            SmartFlow offers a complete suite of tools to monitor, analyze, and optimize traffic flow in urban environments.
          </p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border border-border/40 bg-background/95 transition-all hover:shadow-md hover:-translate-y-1">
              <CardHeader className="pb-2">
                {feature.icon}
                <CardTitle className="mt-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-sm">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
