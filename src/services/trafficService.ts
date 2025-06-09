import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Types
export interface TrafficData {
  id?: number;
  date: string;
  volume: number;
  avgSpeed: number;
  congestionLevel: number;
  location: string;
  mode?: string; // Added to support mode share analytics
}

export interface SignalSchedule {
  id?: number;
  junction: string;
  duration: number;
  mode: 'auto' | 'manual';
  status: 'active' | 'scheduled' | 'override';
}

export interface Incident {
  id?: number;
  type: string;
  location: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  status: 'pending' | 'investigating' | 'resolved';
  description?: string;
}

export interface AIPrediction {
  id: number;
  locality: string;
  predictionTime: string;
  predictedVolume: number;
  predictedCongestion: number;
  confidenceLevel: number;
  modelVersion: string;
  predictionTimeFormatted?: string;
  congestionLabel?: string;
  confidenceBadge?: string;
  travelTime?: number;
}

export interface TrafficAlert {
  id: number;
  location: string;
  type: string;
  severity: string;
  status: string;
  description: string;
  timestamp: string;
  coordinates: [number, number]; // [latitude, longitude]
  city: string;
}

export interface SystemAlert {
  id?: string;
  alertType: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  location?: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

// Historical traffic data functions
type HistoricalTrafficRow = {
  id: string;
  date?: string;
  volume?: number;
  avg_speed?: number;
  congestion_level?: number;
  location?: string;
};
export const getHistoricalTrafficData = async (): Promise<TrafficData[]> => {
  try {
    const { data, error } = await supabase
      .from('traffic_data')
      .select('*')
      .order('date', { ascending: false });
    if (error) throw error;
    return data?.map(item => ({
      id: item.id,
      date: item.date || new Date().toISOString(),
      volume: item.volume || 0,
      avgSpeed: item.avg_speed || 0,
      congestionLevel: item.congestion_level || 0,
      location: item.location || ''
    })) || [];
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error fetching historical traffic data",
      description: error.message,
    });
    return [];
  }
};

// Traffic volume data functions
export const getTrafficData = async (): Promise<TrafficData[]> => {
  try {
    const { data, error } = await supabase
      .from('traffic_data')
      .select('*')
      .order('date', { ascending: false });
      
    if (error) throw error;
    return data?.map(item => ({
      id: item.id,
      date: item.date || new Date().toISOString(),
      volume: item.volume || 0,
      avgSpeed: item.avg_speed || 0,
      congestionLevel: item.congestion_level || 0,
      location: item.location || ''
    })) || [];
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error fetching traffic data",
      description: error.message,
    });
    return [];
  }
};

export const saveTrafficData = async (data: Omit<TrafficData, 'id'>): Promise<TrafficData | null> => {
  try {
    const mappedData = {
      date: data.date,
      volume: data.volume,
      avg_speed: data.avgSpeed,
      congestion_level: data.congestionLevel,
      location: data.location
    };

    const { data: saved, error } = await supabase
      .from('traffic_data')
      .insert(mappedData)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Traffic data saved",
      description: "The traffic data has been recorded successfully.",
    });
    
    return saved ? {
      id: saved.id,
      date: saved.date || new Date().toISOString(),
      volume: saved.volume || 0,
      avgSpeed: saved.avg_speed || 0,
      congestionLevel: saved.congestion_level || 0,
      location: saved.location || ''
    } : null;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error saving traffic data",
      description: error.message,
    });
    return null;
  }
};

// Signal control functions
export const getSignalSchedules = async (): Promise<SignalSchedule[]> => {
  try {
    const { data, error } = await supabase
      .from('signal_schedules')
      .select('*');
      
    if (error) throw error;
    return data?.map(item => ({
      id: item.id,
      junction: item.junction || '',
      duration: item.duration || 30,
      mode: (item.mode as 'auto' | 'manual') || 'auto',
      status: (item.status as 'active' | 'scheduled' | 'override') || 'active'
    })) || [];
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error fetching signal schedules",
      description: error.message,
    });
    return [];
  }
};

export const updateSignalSchedule = async (id: number, updates: Partial<SignalSchedule>): Promise<boolean> => {
  try {
    const mappedUpdates: any = {};
    if (updates.junction !== undefined) mappedUpdates.junction = updates.junction;
    if (updates.duration !== undefined) mappedUpdates.duration = updates.duration;
    if (updates.mode !== undefined) mappedUpdates.mode = updates.mode;
    if (updates.status !== undefined) mappedUpdates.status = updates.status;

    const { error } = await supabase
      .from('signal_schedules')
      .update(mappedUpdates)
      .eq('id', id);
      
    if (error) throw error;
    
    toast({
      title: "Signal updated",
      description: "The signal schedule has been updated successfully.",
    });
    
    return true;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error updating signal",
      description: error.message,
    });
    return false;
  }
};

// Incident management functions
export interface IncidentFilters {
  startDate?: string;
  endDate?: string;
  location?: string;
  type?: string;
  severity?: 'low' | 'medium' | 'high' | '';
  status?: 'pending' | 'investigating' | 'resolved' | '';
}

export const getIncidents = async (filters: IncidentFilters = {}): Promise<Incident[]> => {
  try {
    let query = supabase
      .from('incidents')
      .select('*');

    // Apply filters
    if (filters.startDate) {
      query = query.gte('timestamp', filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte('timestamp', `${filters.endDate}T23:59:59`);
    }
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    if (filters.severity) {
      query = query.eq('severity', filters.severity);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query.order('timestamp', { ascending: false });
      
    if (error) throw error;
    
    // If no data, generate sample data for demonstration
    if (!data || data.length === 0) {
      return generateSampleIncidents(30);
    }
    
    return data.map(item => ({
      id: item.id,
      type: item.type || 'Unknown',
      location: item.location || 'Unknown Location',
      timestamp: item.timestamp || new Date().toISOString(),
      severity: (item.severity as 'low' | 'medium' | 'high') || 'medium',
      status: (item.status as 'pending' | 'investigating' | 'resolved') || 'pending',
      description: item.description || 'No description available'
    }));
  } catch (error: any) {
    console.error('Error fetching incidents:', error);
    toast({
      variant: "destructive",
      title: "Error fetching incidents",
      description: error.message,
    });
    // Return sample data in case of error
    return generateSampleIncidents(30);
  }
};

// Helper function to generate sample incident data for demonstration
function generateSampleIncidents(count: number): Incident[] {
  const incidentTypes = ['Accident', 'Road Work', 'Hazard', 'Congestion', 'Road Block'];
  const locations = [
    'Hitech City', 'Gachibowli', 'Jubilee Hills', 'Banjara Hills', 'Kukatpally',
    'Ameerpet', 'Secunderabad', 'Abids', 'Dilsukhnagar', 'Himayatnagar'
  ];
  const severities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
  const statuses: ('pending' | 'investigating' | 'resolved')[] = ['pending', 'investigating', 'resolved'];
  
  const incidents: Incident[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);
    
    const incidentDate = new Date(now);
    incidentDate.setDate(now.getDate() - daysAgo);
    incidentDate.setHours(now.getHours() - hoursAgo);
    incidentDate.setMinutes(now.getMinutes() - minutesAgo);
    
    incidents.push({
      id: i + 1,
      type: incidentTypes[Math.floor(Math.random() * incidentTypes.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      timestamp: incidentDate.toISOString(),
      severity: severities[Math.floor(Math.random() * severities.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      description: `Sample incident description ${i + 1}`
    });
  }
  
  return incidents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const createIncident = async (incident: Omit<Incident, 'id'>): Promise<Incident | null> => {
  try {
    const mappedIncident = {
      type: incident.type,
      location: incident.location,
      timestamp: incident.timestamp,
      severity: incident.severity,
      status: incident.status,
      description: incident.description
    };

    const { data, error } = await supabase
      .from('incidents')
      .insert(mappedIncident)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "Incident reported",
      description: "The incident has been recorded successfully.",
    });
    
    return data ? {
      id: data.id,
      type: data.type || '',
      location: data.location || '',
      timestamp: data.timestamp || new Date().toISOString(),
      severity: (data.severity as 'low' | 'medium' | 'high') || 'medium',
      status: (data.status as 'pending' | 'investigating' | 'resolved') || 'pending',
      description: data.description
    } : null;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error reporting incident",
      description: error.message,
    });
    return null;
  }
};

export const updateIncidentStatus = async (id: number, status: Incident['status']): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('incidents')
      .update({ status })
      .eq('id', id);
      
    if (error) throw error;
    
    toast({
      title: "Incident updated",
      description: `The incident status has been updated to ${status}.`,
    });
    
    return true;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error updating incident",
      description: error.message,
    });
    return false;
  }
};

// AI prediction functions
import { trafficPredictor } from './ml/trafficPredictor';

// Helper function to generate multiple future predictions
const generateFuturePredictions = async (location: string, hoursAhead: number) => {
  const predictions = [];
  const now = new Date();
  
  for (let i = 1; i <= hoursAhead; i++) {
    const predictionTime = new Date(now.getTime() + (i * 60 * 60 * 1000));
    const hour = predictionTime.getHours();
    
    // Get base traffic pattern for this time of day
    const basePattern = getBaseTrafficPattern(hour);
    
    // Apply location modifier
    const locationModifier = locationModifiers[location.toLowerCase()] || locationModifiers['default'];
    
    // Add some randomness (up to ±15% for future predictions)
    const randomFactor = 0.85 + Math.random() * 0.3; // 0.85 to 1.15
    
    // Calculate final values
    const predictedVolume = Math.round(2000 * basePattern.volume * locationModifier.volume * randomFactor);
    const predictedCongestion = Math.min(0.95, Math.max(0.05, 
      basePattern.congestion * locationModifier.congestion * randomFactor
    ));
    
    // Confidence decreases for further predictions
    const timeVariance = Math.abs(hour % 12 - 6) / 6; // 0-1, lower is more predictable
    const baseConfidence = 0.9 - (timeVariance * 0.3);
    const confidenceLevel = baseConfidence * (1 - (i * 0.1)); // 10% less confidence per hour
    
    predictions.push({
      location: location,
      prediction_time: predictionTime.toISOString(),
      predicted_volume: predictedVolume,
      predicted_congestion: parseFloat(predictedCongestion.toFixed(2)),
      confidence_level: parseFloat(Math.max(0.5, confidenceLevel).toFixed(2)), // Minimum 50% confidence
      model_version: '1.1.0',
      prediction_type: 'traffic_volume',
      metadata: JSON.stringify({
        base_pattern: basePattern,
        location_modifier: locationModifier,
        random_factor: randomFactor.toFixed(2),
        is_future_prediction: true,
        hours_ahead: i
      })
    });
  }
  
  // Insert all future predictions
  if (predictions.length > 0) {
    await supabase
      .from('ai_predictions')
      .insert(predictions);
  }
};

export const getAIPredictions = async (location?: string, timeRange: 'hour' | 'day' | 'week' = 'day'): Promise<AIPrediction[]> => {
  try {
    // If no location is provided, get predictions for all locations
    if (!location) {
      console.log('No location provided, fetching predictions for all locations');
      // Get all unique locations from the database
      const { data: locations, error: locationsError } = await supabase
        .from('ai_predictions')
        .select('location')
        .not('location', 'is', null);
      
      if (locationsError) throw locationsError;
      
      const uniqueLocations = [...new Set(locations.map(loc => loc.location))];
      
      // Get predictions for each location
      const allPredictions = await Promise.all(
        uniqueLocations.map(loc => getAIPredictions(loc, timeRange))
      );
      
      // Flatten the array of arrays and sort by prediction time
      return allPredictions.flat().sort((a, b) => 
        new Date(a.predictionTime).getTime() - new Date(b.predictionTime).getTime()
      );
    }

    // Calculate time range for the query
    const now = new Date();
    let startTime = new Date(now);
    let endTime = new Date(now);
    
    switch (timeRange) {
      case 'hour':
        endTime.setHours(now.getHours() + 1);
        break;
      case 'day':
        endTime.setDate(now.getDate() + 1);
        break;
      case 'week':
        endTime.setDate(now.getDate() + 7);
        break;
    }

    // Try to get existing predictions from the database
    const { data: existingPredictions, error: fetchError } = await supabase
      .from('ai_predictions')
      .select('*')
      .eq('location', location)
      .gte('prediction_time', startTime.toISOString())
      .lte('prediction_time', endTime.toISOString())
      .order('prediction_time', { ascending: true });

    if (fetchError) throw fetchError;

    // If we have predictions, return them
    if (existingPredictions && existingPredictions.length > 0) {
      return existingPredictions.map(pred => {
        const prediction: AIPrediction = {
          id: typeof pred.id === 'string' ? parseInt(pred.id, 10) : pred.id,
          locality: pred.location,
          predictionTime: pred.prediction_time,
          predictedVolume: pred.predicted_volume,
          predictedCongestion: pred.predicted_congestion,
          confidenceLevel: pred.confidence_level,
          modelVersion: pred.model_version || '1.1.0'
        };
        
        // Add formatted fields for display
        const predTime = new Date(pred.prediction_time);
        prediction.predictionTimeFormatted = predTime.toLocaleString();
        prediction.travelTime = Math.round((pred.predicted_congestion * 30) + 5); // Simple travel time in minutes
        
        // Add congestion label
        if (pred.predicted_congestion < 0.3) prediction.congestionLabel = 'Light';
        else if (pred.predicted_congestion < 0.7) prediction.congestionLabel = 'Moderate';
        else prediction.congestionLabel = 'Heavy';
        
        // Add confidence badge
        if (pred.confidence_level > 0.8) prediction.confidenceBadge = 'High';
        else if (pred.confidence_level > 0.6) prediction.confidenceBadge = 'Medium';
        else prediction.confidenceBadge = 'Low';
        
        return prediction;
      });
    }

    // If no predictions exist, generate new ones
    console.log(`No predictions found for ${location}, generating new predictions...`);
    await generateTrafficPrediction(location);
    
    // Try fetching again after generation
    const { data: newPredictions, error: refetchError } = await supabase
      .from('ai_predictions')
      .select('*')
      .eq('location', location)
      .gte('prediction_time', startTime.toISOString())
      .lte('prediction_time', endTime.toISOString())
      .order('prediction_time', { ascending: true });

    if (refetchError) throw refetchError;

    return (newPredictions || []).map(pred => {
      const prediction: AIPrediction = {
        id: typeof pred.id === 'string' ? parseInt(pred.id, 10) : pred.id,
        locality: pred.location,
        predictionTime: pred.prediction_time,
        predictedVolume: pred.predicted_volume,
        predictedCongestion: pred.predicted_congestion,
        confidenceLevel: pred.confidence_level,
        modelVersion: pred.model_version || '1.1.0'
      };
      
      // Add formatted fields for display
      const predTime = new Date(pred.prediction_time);
      prediction.predictionTimeFormatted = predTime.toLocaleString();
      prediction.travelTime = Math.round((pred.predicted_congestion * 30) + 5); // Simple travel time in minutes
      
      // Add congestion label
      if (pred.predicted_congestion < 0.3) prediction.congestionLabel = 'Light';
      else if (pred.predicted_congestion < 0.7) prediction.congestionLabel = 'Moderate';
      else prediction.congestionLabel = 'Heavy';
      
      // Add confidence badge
      if (pred.confidence_level > 0.8) prediction.confidenceBadge = 'High';
      else if (pred.confidence_level > 0.6) prediction.confidenceBadge = 'Medium';
      else prediction.confidenceBadge = 'Low';
      
      return prediction;
    });
  } catch (error: any) {
    console.error("Error in getAIPredictions:", error.message);
    // Fall back to the ML predictor if database fails
    try {
      console.log("Falling back to ML predictor...");
      const predictions = await trafficPredictor.getPredictions({
        locality: location,
        timeRange,
        includeHistorical: true
      });
      
      // Convert ML predictor format to AIPrediction format
      return predictions.map((pred: any, index: number) => ({
        id: index,
        locality: pred.locality || location || 'Unknown',
        predictionTime: pred.timestamp || new Date().toISOString(),
        predictedVolume: pred.volume || 0,
        predictedCongestion: pred.congestion || 0,
        confidenceLevel: pred.confidence || 0.7,
        modelVersion: '1.0.0',
        predictionTimeFormatted: pred.timestamp ? new Date(pred.timestamp).toLocaleString() : 'Now',
        congestionLabel: pred.congestion < 0.3 ? 'Light' : pred.congestion < 0.7 ? 'Moderate' : 'Heavy',
        confidenceBadge: pred.confidence > 0.8 ? 'High' : pred.confidence > 0.6 ? 'Medium' : 'Low',
        travelTime: Math.round((pred.congestion || 0) * 30) + 5
      }));
    } catch (mlError) {
      console.error("ML predictor also failed:", mlError);
      // Return mock data as a last resort
      console.log("Returning mock data as fallback");
      const now = new Date();
      return [
        {
          id: 1,
          locality: location || 'Unknown Location',
          predictionTime: now.toISOString(),
          predictedVolume: 1000,
          predictedCongestion: 0.5,
          confidenceLevel: 0.8,
          modelVersion: '1.0.0',
          predictionTimeFormatted: now.toLocaleString(),
          congestionLabel: 'Moderate',
          confidenceBadge: 'High',
          travelTime: 20
        }
      ];
    }
  }
};
export const getPeakHours = async (location: string): Promise<string[]> => {
  try {
    // Get predictions for the next 24 hours
    const predictions = await getAIPredictions(location, 'day');
    
    if (predictions.length === 0) {
      // Fallback to default peak hours if no predictions
      return ['08:00-10:00', '17:00-20:00'];
    }
    
    // Group predictions by hour
    const hourlyAverages: {[hour: number]: {congestion: number, count: number}} = {};
    
    predictions.forEach(pred => {
      const hour = new Date(pred.predictionTime).getHours();
      if (!hourlyAverages[hour]) {
        hourlyAverages[hour] = { congestion: 0, count: 0 };
      }
      hourlyAverages[hour].congestion += pred.predictedCongestion;
      hourlyAverages[hour].count++;
    });
    
    // Calculate average congestion per hour
    const hourlyCongestion = Object.entries(hourlyAverages).map(([hour, data]) => ({
      hour: parseInt(hour),
      avgCongestion: data.congestion / data.count
    }));
    
    // Sort by congestion (descending)
    hourlyCongestion.sort((a, b) => b.avgCongestion - a.avgCongestion);
    
    // Get top 3 peak hours
    const peakHours = hourlyCongestion.slice(0, 3).map(item => {
      const nextHour = (item.hour + 1) % 24;
      return `${String(item.hour).padStart(2, '0')}:00-${String(nextHour).padStart(2, '0')}:00`;
    });
    
    return peakHours.length > 0 ? peakHours : ['08:00-10:00', '17:00-20:00'];
  } catch (error: any) {
    console.error("Error fetching peak hours:", error.message);
    // Return default peak hours in case of error
    return ['08:00-10:00', '17:00-20:00'];
  }
};

// Base traffic patterns for different times of day (0-23 hours)
const getBaseTrafficPattern = (hour: number) => {
  // Morning rush: 7-10 AM
  if (hour >= 7 && hour < 10) return { volume: 0.8, congestion: 0.7 };
  // Evening rush: 5-8 PM
  if (hour >= 17 && hour < 20) return { volume: 0.9, congestion: 0.85 };
  // Midday: 10 AM - 4 PM
  if (hour >= 10 && hour < 17) return { volume: 0.7, congestion: 0.6 };
  // Night: 11 PM - 4 AM
  if (hour >= 23 || hour < 4) return { volume: 0.2, congestion: 0.1 };
  // Early morning / late evening
  return { volume: 0.4, congestion: 0.3 };
};

// Location modifiers (relative to base traffic)
const locationModifiers: Record<string, { volume: number; congestion: number }> = {
  'hitech-city': { volume: 1.2, congestion: 1.3 },  // High traffic, high congestion
  'jubilee-hills': { volume: 1.1, congestion: 1.1 },
  'gachibowli': { volume: 1.3, congestion: 1.4 },   // Very high traffic
  'kukatpally': { volume: 1.0, congestion: 0.9 },
  'banjara-hills': { volume: 0.8, congestion: 0.9 },
  'secunderabad': { volume: 1.1, congestion: 1.2 },
  'ameerpet': { volume: 1.4, congestion: 1.5 },     // Very high congestion
  'madhapur': { volume: 1.2, congestion: 1.3 },
  'kphb-colony': { volume: 0.9, congestion: 0.8 },
  'miyapur': { volume: 0.8, congestion: 0.7 },
  // Default for unknown locations
  'default': { volume: 1.0, congestion: 1.0 }
};

export const generateTrafficPrediction = async (location: string): Promise<AIPrediction | null> => {
  try {
    const now = new Date();
    const predictionTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    const hour = predictionTime.getHours();
    
    // Get base traffic pattern for this time of day
    const basePattern = getBaseTrafficPattern(hour);
    
    // Apply location modifier
    const locationModifier = locationModifiers[location.toLowerCase()] || locationModifiers['default'];
    
    // Add some randomness (up to ±20%)
    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    
    // Calculate final values
    const predictedVolume = Math.round(2000 * basePattern.volume * locationModifier.volume * randomFactor);
    const predictedCongestion = Math.min(0.95, Math.max(0.05, 
      basePattern.congestion * locationModifier.congestion * randomFactor
    ));
    
    // Confidence is higher during typical patterns
    const timeVariance = Math.abs(hour % 12 - 6) / 6; // 0-1, lower is more predictable
    const confidenceLevel = 0.9 - (timeVariance * 0.3); // 90% - 60% based on time
    
    const prediction = {
      location: location,
      prediction_time: predictionTime.toISOString(),
      predicted_volume: predictedVolume,
      predicted_congestion: parseFloat(predictedCongestion.toFixed(2)),
      confidence_level: parseFloat(confidenceLevel.toFixed(2)),
      model_version: '1.1.0',
      prediction_type: 'traffic_volume',
      metadata: JSON.stringify({
        base_pattern: basePattern,
        location_modifier: locationModifier,
        random_factor: randomFactor.toFixed(2)
      })
    };
    
    const { data, error } = await supabase
      .from('ai_predictions')
      .insert(prediction)
      .select()
      .single();
      
    if (error) throw error;
    
    // Also generate predictions for the next few hours
    await generateFuturePredictions(location, 3);
    
    return data ? {
      id: parseInt(data.id),
      locality: data.location || '',
      predictionTime: data.prediction_time || new Date().toISOString(),
      predictedVolume: data.predicted_volume || 0,
      predictedCongestion: data.predicted_congestion || 0,
      confidenceLevel: data.confidence_level || 0,
      modelVersion: data.model_version || '1.1.0'
    } : null;
  } catch (error: any) {
    console.error("Error generating prediction:", error.message);
    return null;
  }
};

// System alerts functions
export const getSystemAlerts = async (resolved?: boolean): Promise<SystemAlert[]> => {
  try {
    let query = supabase
      .from('system_alerts')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (resolved !== undefined) {
      query = query.eq('resolved', resolved);
    }
    
    const { data, error } = await query;
      
    if (error) throw error;
    
    return data?.map(item => ({
      id: item.id,
      alertType: item.alert_type,
      message: item.message,
      severity: (item.severity as 'info' | 'warning' | 'critical') || 'info',
      location: item.location,
      resolved: item.resolved || false,
      resolvedAt: item.resolved_at,
      resolvedBy: item.resolved_by
    })) || [];
  } catch (error: any) {
    console.error("Error fetching system alerts:", error.message);
    return [];
  }
};

export const createSystemAlert = async (alert: Omit<SystemAlert, 'id' | 'resolved' | 'resolvedAt' | 'resolvedBy'>): Promise<SystemAlert | null> => {
  try {
    const mappedAlert = {
      alert_type: alert.alertType,
      message: alert.message,
      severity: alert.severity,
      location: alert.location,
      resolved: false
    };
    
    const { data, error } = await supabase
      .from('system_alerts')
      .insert(mappedAlert)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: "System Alert Created",
      description: "A new system alert has been recorded.",
    });
    
    return data ? {
      id: data.id,
      alertType: data.alert_type,
      message: data.message,
      severity: (data.severity as 'info' | 'warning' | 'critical') || 'info',
      location: data.location,
      resolved: data.resolved || false,
      resolvedAt: data.resolved_at,
      resolvedBy: data.resolved_by
    } : null;
  } catch (error: any) {
    console.error("Error creating system alert:", error.message);
    return null;
  }
};

export const resolveSystemAlert = async (id: string, resolvedBy: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('system_alerts')
      .update({
        resolved: true,
        resolved_at: new Date().toISOString(),
        resolved_by: resolvedBy
      })
      .eq('id', id);
      
    if (error) throw error;
    
    toast({
      title: "Alert Resolved",
      description: "The system alert has been marked as resolved.",
    });
    
    return true;
  } catch (error: any) {
    console.error("Error resolving alert:", error.message);
    return false;
  }
};

export const getZoneTrafficData = async (): Promise<{ zone: string; volume: number; congestion: number; }[]> => {
  try {
    const { data, error } = await (supabase
      .from('zone_traffic_data' as any)
      .select('*')) as { data: { zone: string; volume: number; congestion: number }[], error: any };

    
    if (error) throw error;
    return data?.map(item => ({
      zone: 'zone' in item && typeof item.zone === 'string' ? item.zone : 'Unknown',
      volume: 'volume' in item && typeof item.volume === 'number' ? item.volume : 0,
      congestion: 'congestion' in item && typeof item.congestion === 'number' ? item.congestion : 0
    })) || [];

  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error fetching zone traffic data",
      description: error.message,
    });
    return [];
  }
};

// Hyderabad Traffic Analytics Functions
export interface HyderabadTrafficData {
  id: number;
  date: string;
  location: string;
  volume: number;
  avgSpeed: number;
  congestionLevel: number;
  mode?: string; // Transportation mode
  incidentCount?: number;
  travelTime?: number; // calculated travel time in minutes
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night' | 'all';
  congestionCategory?: 'low' | 'moderate' | 'high' | 'severe'; // categorized based on level
  densityCategory?: 'low' | 'medium' | 'high'; // categorized based on volume/capacity
  localityCategory?: 'residential' | 'commercial' | 'industrial' | 'mixed'; // based on location analysis
}

export interface TrafficFilter {
  locality?: string;
  startDate?: string;
  endDate?: string;
  congestionLevel?: 'low' | 'medium' | 'high' | 'all';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night' | 'all';
}

// Get Hyderabad traffic data with filtering
export const getHyderabadTrafficData = async (filters?: TrafficFilter): Promise<HyderabadTrafficData[]> => {
  try {
    // Start with base query
    let query = supabase
      .from('traffic_data')
      .select('*')
      .order('date', { ascending: false });
    
    // Apply locality filter
    if (filters?.locality) {
      query = query.ilike('location', `%${filters.locality}%`);
    }
    
    // Apply date range filters
    if (filters?.startDate) {
      query = query.gte('date', filters.startDate);
    }
    
    if (filters?.endDate) {
      query = query.lte('date', filters.endDate);
    }
    
    // Execute query
    const { data, error } = await query;
      
    if (error) throw error;
    
    // Process and transform the data
    const processedData = data.map(item => {
      // Determine time of day from the date
      const hour = new Date(item.date).getHours();
      const timeOfDayValue = 
        (hour >= 6 && hour < 12) ? 'morning' as const : 
        (hour >= 12 && hour < 16) ? 'afternoon' as const : 
        (hour >= 16 && hour < 20) ? 'evening' as const : 'night' as const;

      // Determine congestion category
      const congestionLevel = item.congestion_level || 0;
      const congestionCategory = 
        congestionLevel >= 0.7 ? 'severe' as const : 
        congestionLevel >= 0.5 ? 'high' as const : 
        congestionLevel >= 0.3 ? 'moderate' as const : 'low' as const;
        
      // Calculate travel time based on speed and estimated distance
      const baseSpeed = 45; // km/h
      const actualSpeed = baseSpeed * (1 - congestionLevel);
      const baseTime = 30; // minutes for average trip
      const travelTime = actualSpeed > 0 ? baseTime * (baseSpeed / actualSpeed) : baseTime * 3;
      
      // Determine density category based on volume
      const volume = item.volume || 0;
      const densityCategory = 
        volume > 2000 ? 'high' as const : 
        volume > 1000 ? 'medium' as const : 'low' as const;
        
      // Determine locality category based on location
      const locality = item.location || '';
      const localityCategory = 
        /commercial|market|mall|business/i.test(locality) ? 'commercial' as const : 
        /industrial|factory|manufacturing/i.test(locality) ? 'industrial' as const : 
        /residential|colony|apartments|homes/i.test(locality) ? 'residential' as const : 'mixed' as const;
          
      return {
        id: item.id,
        date: item.date,
        volume: volume,
        avgSpeed: item.avg_speed,
        congestionLevel: congestionLevel,
        location: locality,
        // Add custom properties with proper typing
        timeOfDay: timeOfDayValue,
        congestionCategory: congestionCategory,
        travelTime: Math.round(travelTime),
        densityCategory: densityCategory,
        localityCategory: localityCategory
      };
    }) || [];
    
    // Apply time of day filter if specified
    let filteredData = processedData;
    if (filters?.timeOfDay && filters.timeOfDay !== 'all') {
      filteredData = filteredData.filter(item => item.timeOfDay === filters.timeOfDay);
    }
    
    // Apply congestion level filter if specified
    if (filters?.congestionLevel && filters.congestionLevel !== 'all') {
      filteredData = filteredData.filter(item => item.congestionCategory === filters.congestionLevel);
    }
    
    return filteredData;
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error fetching Hyderabad traffic data",
      description: error.message,
    });
    return [];
  }
};

// Get historical comparison data for a specific locality
export const getLocalityHistoricalComparison = async (
  locality: string,
  dateRange: 'day' | 'week' | 'month' | 'year'
): Promise<{ current: HyderabadTrafficData[]; previous: HyderabadTrafficData[] }> => {
  try {
    const now = new Date();
    let startDate = new Date();
    let comparisonStartDate = new Date();
    let comparisonEndDate = new Date();
    
    // Calculate date ranges based on selection
    switch (dateRange) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        comparisonEndDate = new Date(startDate);
        comparisonStartDate = new Date(startDate);
        comparisonStartDate.setDate(comparisonStartDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
        startDate.setHours(0, 0, 0, 0);
        comparisonEndDate = new Date(startDate);
        comparisonStartDate = new Date(startDate);
        comparisonStartDate.setDate(comparisonStartDate.getDate() - 7);
        break;
      case 'month':
        startDate.setDate(1); // Start of current month
        startDate.setHours(0, 0, 0, 0);
        comparisonEndDate = new Date(startDate);
        comparisonStartDate = new Date(startDate);
        comparisonStartDate.setMonth(comparisonStartDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setMonth(0, 1); // Start of current year
        startDate.setHours(0, 0, 0, 0);
        comparisonEndDate = new Date(startDate);
        comparisonStartDate = new Date(startDate);
        comparisonStartDate.setFullYear(comparisonStartDate.getFullYear() - 1);
        break;
    }
    
    // Get current period data
    const currentFilter: TrafficFilter = {
      locality,
      startDate: startDate.toISOString(),
      endDate: now.toISOString()
    };
    const currentData = await getHyderabadTrafficData(currentFilter);
    
    // Get comparison period data
    const comparisonFilter: TrafficFilter = {
      locality,
      startDate: comparisonStartDate.toISOString(),
      endDate: comparisonEndDate.toISOString()
    };
    const previousData = await getHyderabadTrafficData(comparisonFilter);
    
    return { current: currentData, previous: previousData };
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error fetching historical comparison",
      description: error.message,
    });
    return { current: [], previous: [] };
  }
};

// Get traffic incidents for a specific locality
export const getLocalityTrafficIncidents = async (locality: string): Promise<Incident[]> => {
  try {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .ilike('location', `%${locality}%`)
      .order('timestamp', { ascending: false });
      
    if (error) throw error;
    
    return data?.map(item => ({
      id: item.id,
      type: item.type || 'Unknown',
      location: item.location || '',
      timestamp: item.timestamp || new Date().toISOString(),
      severity: (item.severity as 'low' | 'medium' | 'high') || 'medium',
      status: (item.status as 'pending' | 'investigating' | 'resolved') || 'pending',
      description: item.description
    })) || [];
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error fetching locality incidents",
      description: error.message,
    });
    return [];
  }
};

// Get high-density zones in Hyderabad
export const getHighDensityZones = async (): Promise<{ locality: string; density: number; congestion: number }[]> => {
  try {
    const trafficData = await getHyderabadTrafficData();
    
    // Group by location and calculate average density and congestion
    const locationMap = new Map<string, { totalVolume: number; totalCongestion: number; count: number }>();
    
    trafficData.forEach(item => {
      if (!locationMap.has(item.location)) {
        locationMap.set(item.location, { totalVolume: 0, totalCongestion: 0, count: 0 });
      }
      
      const locationData = locationMap.get(item.location)!;
      locationData.totalVolume += item.volume;
      locationData.totalCongestion += item.congestionLevel;
      locationData.count += 1;
    });
    
    // Convert to array and sort by density
    const result = Array.from(locationMap.entries()).map(([locality, data]) => ({
      locality,
      density: data.count > 0 ? data.totalVolume / data.count : 0,
      congestion: data.count > 0 ? data.totalCongestion / data.count : 0
    }));
    
    return result.sort((a, b) => b.density - a.density);
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error analyzing high-density zones",
      description: error.message,
    });
    return [];
  }
};

// Helper function to determine locality category
function getLocalityCategory(location: string): 'commercial' | 'residential' | 'industrial' | 'mixed' {
  const commercialAreas = ['Hitech City', 'Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Madhapur', 'Begumpet', 'Ameerpet', 'Panjagutta', 'Abids', 'Nampally', 'Somajiguda', 'Lakdikapul', 'Khairatabad'];
  const residentialAreas = ['Kondapur', 'Manikonda', 'Kukatpally', 'Miyapur', 'Chandanagar', 'Lingampally', 'KPHB Colony', 'Tarnaka', 'Uppal', 'Dilsukhnagar', 'LB Nagar', 'Sainikpuri', 'Malkajgiri'];
  const industrialAreas = ['Balanagar', 'Jeedimetla', 'Nacharam', 'Patancheru', 'Katedan', 'Medchal', 'Shamshabad'];
  
  location = location.toLowerCase();
  
  if (commercialAreas.some(area => location.includes(area.toLowerCase()))) {
    return 'commercial';
  } else if (residentialAreas.some(area => location.includes(area.toLowerCase()))) {
    return 'residential';
  } else if (industrialAreas.some(area => location.includes(area.toLowerCase()))) {
    return 'industrial';
  } else {
    return 'mixed';
  }
}

// Export utilities
export const formatExportData = (data: any[], type: 'traffic' | 'predictions' | 'incidents' | 'zones'): string => {
  const headers = {
    traffic: ['Date', 'Location', 'Volume', 'Average Speed', 'Congestion Level'],
    predictions: ['Location', 'Prediction Time', 'Predicted Volume', 'Predicted Congestion', 'Confidence Level', 'Model Version'],
    incidents: ['Date', 'Location', 'Type', 'Severity', 'Status', 'Description'],
    zones: ['Zone', 'Volume', 'Congestion Level']
  };

  const formatRow = (item: any) => {
    switch (type) {
      case 'traffic':
        return [
          new Date(item.date).toLocaleString(),
          item.location,
          item.volume,
          item.avgSpeed,
          `${(item.congestionLevel * 100).toFixed(1)}%`
        ].join(',');
      case 'predictions':
        return [
          item.location,
          new Date(item.predictionTime).toLocaleString(),
          item.predictedVolume,
          `${(item.predictedCongestion * 100).toFixed(1)}%`,
          `${(item.confidenceLevel * 100).toFixed(1)}%`,
          item.modelVersion || 'N/A'
        ].join(',');
      case 'incidents':
        return [
          new Date(item.timestamp).toLocaleString(),
          item.location,
          item.type,
          item.severity,
          item.status,
          item.description || 'N/A'
        ].join(',');
      case 'zones':
        return [
          'zone' in item ? item.zone : 'Unknown',
          'volume' in item ? item.volume : 0,
          'congestion' in item ? `${(item.congestion * 100).toFixed(1)}%` : '0.0%'
        ].join(',');
      default:
        return '';
    }
  };

  return [
    headers[type].join(','),
    ...data.map(formatRow)
  ].join('\n');
};

// Mock search functionality for Hyderabad traffic data
export const searchHyderabadTrafficData = async (query: string): Promise<HyderabadTrafficData[]> => {
  // Mock data for Hyderabad localities
  const mockLocations = [
    'Hitech City', 'Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Madhapur',
    'Kondapur', 'Manikonda', 'Kukatpally', 'Miyapur', 'Chandanagar',
    'Lingampally', 'KPHB Colony', 'Tarnaka', 'Uppal', 'Dilsukhnagar'
  ];

  // Filter locations that match the search query
  const matchedLocations = mockLocations.filter(loc => 
    loc.toLowerCase().includes(query.toLowerCase())
  );

  // Generate mock traffic data for matched locations
  return matchedLocations.map(location => ({
    id: Math.floor(Math.random() * 1000),
    date: new Date().toISOString(),
    location,
    volume: Math.floor(Math.random() * 500) + 100,
    avgSpeed: Math.floor(Math.random() * 40) + 20,
    congestionLevel: Math.random(),
    mode: 'vehicle',
    incidentCount: Math.floor(Math.random() * 5),
    travelTime: Math.floor(Math.random() * 60) + 10,
    timeOfDay: ['morning', 'afternoon', 'evening', 'night'][Math.floor(Math.random() * 4)] as any,
    congestionCategory: ['low', 'moderate', 'high', 'severe'][Math.floor(Math.random() * 4)] as any,
    densityCategory: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
    localityCategory: getLocalityCategory(location)
  }));
};
