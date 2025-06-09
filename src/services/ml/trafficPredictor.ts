import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Types for ML predictions
export interface TrafficPrediction {
  id?: number;
  locality: string;
  predictionTime: string;
  predictedVolume: number;
  predictedCongestion: number;
  predictedTravelTime: number;
  confidenceScore: number;
  modelVersion: string;
  peakHours: string[];
  updatedAt: string;
}

export interface PredictionRequest {
  locality: string;
  timeRange: 'hour' | 'day' | 'week';
  includeHistorical: boolean;
}

export class TrafficPredictor {
  private static instance: TrafficPredictor;
  private modelVersion: string;
  private lastUpdate: Date;

  private constructor() {
    this.modelVersion = '1.0.0';
    this.lastUpdate = new Date();
  }

  public static getInstance(): TrafficPredictor {
    if (!TrafficPredictor.instance) {
      TrafficPredictor.instance = new TrafficPredictor();
    }
    return TrafficPredictor.instance;
  }

  private async getHistoricalData(locality: string, days: number): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('traffic_data')
        .select('*')
        .eq('location', locality)
        .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching historical data",
        description: error.message,
      });
      return [];
    }
  }

  private async getWeatherData(locality: string, days: number): Promise<any[]> {
    // Implementation for fetching weather data
    // This would typically integrate with a weather API
    return [];
  }

  private async getEventData(locality: string, days: number): Promise<any[]> {
    // Implementation for fetching event data (holidays, special events)
    return [];
  }

  private async generatePredictions(request: PredictionRequest): Promise<TrafficPrediction[]> {
    try {
      const historicalData = await this.getHistoricalData(request.locality, 30);
      const weatherData = await this.getWeatherData(request.locality, 7);
      const eventData = await this.getEventData(request.locality, 7);

      // Implement ML model prediction logic here
      // This is a simplified version - in production, this would use a trained ML model
      const predictions: TrafficPrediction[] = [];

      // Generate predictions based on time range
      const now = new Date();
      const end = new Date(now.getTime() + (request.timeRange === 'hour' ? 3600000 : 
                                           request.timeRange === 'day' ? 86400000 : 
                                           604800000)); // 7 days

      let current = now;
      while (current <= end) {
        const prediction: TrafficPrediction = {
          locality: request.locality,
          predictionTime: current.toISOString(),
          predictedVolume: this.calculatePredictedVolume(historicalData, current),
          predictedCongestion: this.calculatePredictedCongestion(historicalData, current),
          predictedTravelTime: this.calculatePredictedTravelTime(historicalData, current),
          confidenceScore: this.calculateConfidenceScore(historicalData, current),
          modelVersion: this.modelVersion,
          peakHours: this.calculatePeakHours(historicalData),
          updatedAt: new Date().toISOString()
        };
        predictions.push(prediction);
        current = new Date(current.getTime() + 3600000); // Move to next hour
      }

      return predictions;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error generating predictions",
        description: error.message,
      });
      return [];
    }
  }

  private calculatePredictedVolume(historicalData: any[], time: Date): number {
    try {
      // Filter data for the same hour and day of week for better accuracy
      const dayOfWeek = time.getDay();
      const hour = time.getHours();
      
      const sameTimeData = historicalData.filter(data => {
        const dataTime = new Date(data.date);
        return dataTime.getHours() === hour && 
               dataTime.getDay() === dayOfWeek;
      });

      // If no exact match, fall back to same hour any day
      const relevantData = sameTimeData.length > 0 ? sameTimeData : 
        historicalData.filter(data => new Date(data.date).getHours() === hour);
      
      if (relevantData.length === 0) {
        // Return a reasonable default if no data
        return 500; 
      }
      
      // Calculate weighted average giving more weight to recent data
      const now = Date.now();
      const weightedSum = relevantData.reduce((sum, data) => {
        const dataTime = new Date(data.date).getTime();
        const daysAgo = (now - dataTime) / (1000 * 60 * 60 * 24);
        const weight = Math.max(0.1, 1 - (daysAgo / 30)); // More recent = higher weight
        return sum + (data.volume * weight);
      }, 0);
      
      const totalWeight = relevantData.reduce((sum, _, index) => {
        const dataTime = new Date(relevantData[index].date).getTime();
        const daysAgo = (now - dataTime) / (1000 * 60 * 60 * 24);
        return sum + Math.max(0.1, 1 - (daysAgo / 30));
      }, 0);
      
      return Math.round(weightedSum / totalWeight);
    } catch (error) {
      console.error('Error in calculatePredictedVolume:', error);
      return 500; // Fallback value
    }
  }

  private calculatePredictedCongestion(historicalData: any[], time: Date): number {
    try {
      // Consider time of day, day of week, and recent patterns
      const hour = time.getHours();
      const dayOfWeek = time.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Filter data for similar conditions
      const similarData = historicalData.filter(data => {
        const dataTime = new Date(data.date);
        const dataHour = dataTime.getHours();
        const dataDay = dataTime.getDay();
        const isDataWeekend = dataDay === 0 || dataDay === 6;
        
        // Match hour and weekend status
        return dataHour === hour && isDataWeekend === isWeekend;
      });
      
      // If no similar data, use all data for this hour
      const relevantData = similarData.length > 0 ? similarData : 
        historicalData.filter(data => new Date(data.date).getHours() === hour);
      
      if (relevantData.length === 0) {
        // Return a reasonable default if no data
        return 30; // 30% congestion as default
      }
      
      // Calculate weighted average with recency bias
      const now = Date.now();
      const weightedSum = relevantData.reduce((sum, data) => {
        const dataTime = new Date(data.date).getTime();
        const daysAgo = (now - dataTime) / (1000 * 60 * 60 * 24);
        const weight = Math.max(0.1, 1 - (daysAgo / 30));
        return sum + (data.congestionLevel * weight);
      }, 0);
      
      const totalWeight = relevantData.reduce((sum, _, index) => {
        const dataTime = new Date(relevantData[index].date).getTime();
        const daysAgo = (now - dataTime) / (1000 * 60 * 60 * 24);
        return sum + Math.max(0.1, 1 - (daysAgo / 30));
      }, 0);
      
      // Cap congestion between 0 and 100
      return Math.min(100, Math.max(0, Math.round(weightedSum / totalWeight)));
    } catch (error) {
      console.error('Error in calculatePredictedCongestion:', error);
      return 30; // Fallback value
    }
  }

  private calculatePredictedTravelTime(historicalData: any[], time: Date): number {
    try {
      const volume = this.calculatePredictedVolume(historicalData, time);
      const congestion = this.calculatePredictedCongestion(historicalData, time);
      
      // Base travel time (in minutes) with more sophisticated calculation
      const baseTravelTime = 15; // Base time in minutes
      
      // Adjust based on congestion (exponential increase)
      const congestionFactor = 1 + Math.pow(congestion / 50, 2);
      
      // Adjust based on volume (logarithmic scale)
      const volumeFactor = 1 + Math.log10(volume / 500 + 1);
      
      // Consider time of day
      const hour = time.getHours();
      let timeOfDayFactor = 1.0;
      
      // Peak hours have higher impact
      if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19)) {
        timeOfDayFactor = 1.5; // Rush hour
      } else if (hour >= 22 || hour <= 5) {
        timeOfDayFactor = 0.8; // Late night/early morning
      }
      
      // Calculate final travel time with all factors
      let travelTime = baseTravelTime * congestionFactor * volumeFactor * timeOfDayFactor;
      
      // Round to nearest minute and ensure minimum travel time
      return Math.max(5, Math.round(travelTime));
    } catch (error) {
      console.error('Error in calculatePredictedTravelTime:', error);
      return 15; // Fallback value
    }
  }

  private calculateConfidenceScore(historicalData: any[], time: Date): number {
    // Confidence score based on data availability and patterns
    const sameTimeData = historicalData.filter(data => {
      const dataTime = new Date(data.date);
      return dataTime.getHours() === time.getHours();
    });

    const dataPoints = sameTimeData.length;
    const stdDev = this.calculateStandardDeviation(sameTimeData.map(d => d.volume));
    
    // Higher score for more data points and lower standard deviation
    return Math.min(100, Math.max(0, 50 + (dataPoints * 2) - (stdDev * 0.5)));
  }

  private calculateStandardDeviation(values: number[]): number {
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private calculatePeakHours(historicalData: any[]): string[] {
    try {
      // Separate weekdays and weekends
      const weekdayData = Array(24).fill(0).map(() => ({ volume: 0, congestion: 0, count: 0 }));
      const weekendData = Array(24).fill(0).map(() => ({ volume: 0, congestion: 0, count: 0 }));

      // Process historical data
      historicalData.forEach(data => {
        const date = new Date(data.date);
        const hour = date.getHours();
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const targetData = isWeekend ? weekendData[hour] : weekdayData[hour];
        
        targetData.volume += data.volume;
        targetData.congestion += data.congestionLevel;
        targetData.count++;
      });

      // Calculate average metrics
      const calculateAverages = (data: any[]) => {
        return data.map((item, hour) => ({
          hour,
          avgVolume: item.count > 0 ? item.volume / item.count : 0,
          avgCongestion: item.count > 0 ? item.congestion / item.count : 0,
          score: item.count > 0 ? 
            (item.volume / item.count / 1000) * 0.4 + 
            (item.congestion / item.count) * 0.6 : 0
        }));
      };

      const weekdayAverages = calculateAverages(weekdayData);
      const weekendAverages = calculateAverages(weekendData);

      // Find top peak hours (morning and evening)
      const findPeakHours = (averages: any[]) => {
        // Sort by score and take top 4 hours
        return averages
          .sort((a, b) => b.score - a.score)
          .slice(0, 4)
          .sort((a, b) => a.hour - b.hour)
          .map(item => ({
            hour: item.hour,
            period: item.hour < 12 ? 'AM' : 'PM',
            displayHour: item.hour % 12 || 12,
            score: item.score
          }));
      };

      const weekdayPeaks = findPeakHours(weekdayAverages);
      const weekendPeaks = findPeakHours(weekendAverages);

      // Format peak hours as strings (e.g., "8 AM", "5 PM")
      const formatPeakHours = (peaks: any[]) => {
        return peaks.map(peak => `${peak.displayHour} ${peak.period}`);
      };

      // Return both weekday and weekend peaks, removing duplicates
      const allPeaks = [...new Set([
        ...formatPeakHours(weekdayPeaks),
        ...formatPeakHours(weekendPeaks)
      ])];

      return allPeaks.length > 0 ? allPeaks : ['8 AM', '5 PM']; // Default fallback
    } catch (error) {
      console.error('Error in calculatePeakHours:', error);
      return ['8 AM', '5 PM']; // Default peak hours if calculation fails
    }
  }

  public async getPredictions(request: PredictionRequest): Promise<TrafficPrediction[]> {
    return this.generatePredictions(request);
  }
}

export const trafficPredictor = TrafficPredictor.getInstance();
