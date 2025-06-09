-- Create incidents table
CREATE TABLE IF NOT EXISTS public.incidents (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high')) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'investigating', 'resolved')) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_incidents_location ON public.incidents(location);
CREATE INDEX idx_incidents_status ON public.incidents(status);
CREATE INDEX idx_incidents_severity ON public.incidents(severity);
CREATE INDEX idx_incidents_timestamp ON public.incidents(timestamp);

-- Add RLS policies
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to incidents"
    ON public.incidents FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create incidents"
    ON public.incidents FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update their own incidents"
    ON public.incidents FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_incidents_updated_at
    BEFORE UPDATE ON public.incidents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
