-- Connect to your Supabase database and run this SQL

-- Create system_alerts table
CREATE TABLE IF NOT EXISTS public.system_alerts (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'error', 'success')),
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add index for active alerts
CREATE INDEX IF NOT EXISTS idx_system_alerts_active 
    ON public.system_alerts (is_active) 
    WHERE is_active = TRUE;

-- Add index for time range queries
CREATE INDEX IF NOT EXISTS idx_system_alerts_time_range 
    ON public.system_alerts (start_time, end_time);

-- Add function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_system_alerts_updated_at
BEFORE UPDATE ON public.system_alerts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add row level security
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to active alerts
CREATE POLICY "Enable read access for all users on active alerts"
ON public.system_alerts
FOR SELECT
TO public
USING (is_active = TRUE AND (end_time IS NULL OR end_time > NOW()));

-- Create policy to allow admins full access
CREATE POLICY "Enable all for admin users"
ON public.system_alerts
FOR ALL
TO authenticated
USING (true) WITH CHECK (true);

-- Insert some sample data
INSERT INTO public.system_alerts (title, message, severity, start_time, end_time, is_active)
VALUES 
    ('Scheduled Maintenance', 'System maintenance scheduled for tonight at 2 AM', 'info', NOW(), NOW() + INTERVAL '24 hours', true),
    ('New Feature Released', 'Check out our new traffic prediction feature!', 'success', NOW(), NOW() + INTERVAL '7 days', true),
    ('API Rate Limit', 'API rate limits have been temporarily reduced', 'warning', NOW(), NOW() + INTERVAL '6 hours', true);

-- Verify the data was inserted
SELECT * FROM public.system_alerts;
