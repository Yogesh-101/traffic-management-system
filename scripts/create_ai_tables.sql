-- Create AI Predictions table
CREATE TABLE IF NOT EXISTS public.ai_predictions (
    id BIGSERIAL PRIMARY KEY,
    location TEXT NOT NULL,
    prediction_time TIMESTAMPTZ NOT NULL,
    predicted_volume INTEGER NOT NULL,
    predicted_congestion NUMERIC(3,2) NOT NULL,
    confidence_level NUMERIC(3,2) NOT NULL,
    model_version TEXT NOT NULL,
    prediction_type TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_ai_predictions_location ON public.ai_predictions(location);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_time ON public.ai_predictions(prediction_time);

-- Enable Row Level Security
ALTER TABLE public.ai_predictions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users"
    ON public.ai_predictions
    FOR SELECT
    TO public
    USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_ai_predictions_updated_at
BEFORE UPDATE ON public.ai_predictions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO public.ai_predictions (
    location, 
    prediction_time, 
    predicted_volume, 
    predicted_congestion, 
    confidence_level, 
    model_version, 
    prediction_type
) VALUES 
    ('hitech-city', NOW() + INTERVAL '1 hour', 1500, 0.65, 0.82, '1.0.0', 'traffic_volume'),
    ('hitech-city', NOW() + INTERVAL '2 hours', 1800, 0.75, 0.78, '1.0.0', 'traffic_volume'),
    ('hitech-city', NOW() + INTERVAL '3 hours', 2000, 0.85, 0.81, '1.0.0', 'traffic_volume'),
    ('jubilee-hills', NOW() + INTERVAL '1 hour', 1200, 0.55, 0.85, '1.0.0', 'traffic_volume'),
    ('jubilee-hills', NOW() + INTERVAL '2 hours', 1400, 0.65, 0.82, '1.0.0', 'traffic_volume');
