-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create ai_predictions table
CREATE TABLE IF NOT EXISTS public.ai_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location TEXT NOT NULL,
    prediction_time TIMESTAMPTZ NOT NULL,
    predicted_volume INTEGER NOT NULL,
    predicted_congestion NUMERIC(3, 2) NOT NULL,
    confidence_level NUMERIC(3, 2) NOT NULL,
    model_version TEXT NOT NULL,
    prediction_type TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_congestion CHECK (predicted_congestion >= 0 AND predicted_congestion <= 1),
    CONSTRAINT valid_confidence CHECK (confidence_level >= 0 AND confidence_level <= 1)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ai_predictions_location ON public.ai_predictions(location);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_time ON public.ai_predictions(prediction_time);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_location_time ON public.ai_predictions(location, prediction_time);

-- Enable Row Level Security
ALTER TABLE public.ai_predictions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (adjust as needed for your security requirements)
CREATE POLICY "Enable read access for all users" ON public.ai_predictions
    FOR SELECT USING (true);

-- Create policy to allow insert/update/delete for authenticated users (adjust as needed)
CREATE POLICY "Enable all for authenticated users" ON public.ai_predictions
    FOR ALL TO authenticated USING (true);

-- Create system_alerts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.system_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type TEXT NOT NULL,
    message TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
    location TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMPTZ,
    resolved_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for system_alerts
CREATE INDEX IF NOT EXISTS idx_system_alerts_resolved ON public.system_alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_system_alerts_severity ON public.system_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_system_alerts_created_at ON public.system_alerts(created_at);

-- Enable Row Level Security for system_alerts
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to non-resolved alerts
CREATE POLICY "Enable read access for non-resolved alerts" ON public.system_alerts
    FOR SELECT USING (resolved = false);

-- Create policy to allow all access for authenticated users
CREATE POLICY "Enable all for authenticated users on system_alerts" ON public.system_alerts
    FOR ALL TO authenticated USING (true);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at columns
DROP TRIGGER IF EXISTS update_ai_predictions_updated_at ON public.ai_predictions;
CREATE TRIGGER update_ai_predictions_updated_at
    BEFORE UPDATE ON public.ai_predictions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_system_alerts_updated_at ON public.system_alerts;
CREATE TRIGGER update_system_alerts_updated_at
    BEFORE UPDATE ON public.system_alerts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO public.ai_predictions (
    location, 
    prediction_time, 
    predicted_volume, 
    predicted_congestion, 
    confidence_level, 
    model_version,
    prediction_type
) VALUES 
('hitech-city', NOW() + INTERVAL '1 hour', 1200, 0.75, 0.85, '1.0.0', 'traffic_volume'),
('hitech-city', NOW() + INTERVAL '2 hours', 1500, 0.85, 0.82, '1.0.0', 'traffic_volume'),
('jubilee-hills', NOW() + INTERVAL '1 hour', 900, 0.65, 0.88, '1.0.0', 'traffic_volume'),
('jubilee-hills', NOW() + INTERVAL '2 hours', 1100, 0.75, 0.80, '1.0.0', 'traffic_volume');
