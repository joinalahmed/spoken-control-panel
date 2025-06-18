
-- Create a table for system-level settings
CREATE TABLE public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the default outbound call API URL setting
INSERT INTO public.system_settings (setting_key, setting_value, description)
VALUES (
  'outbound_call_api_url',
  'https://7263-49-207-61-173.ngrok-free.app/outbound_call',
  'API endpoint for triggering outbound calls'
);

-- Add Row Level Security (RLS) - make it readable by everyone but only updatable by authenticated users
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read system settings
CREATE POLICY "Anyone can view system settings" 
  ON public.system_settings 
  FOR SELECT 
  USING (true);

-- Only authenticated users can update system settings
CREATE POLICY "Authenticated users can update system settings" 
  ON public.system_settings 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

-- Only authenticated users can insert system settings
CREATE POLICY "Authenticated users can insert system settings" 
  ON public.system_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);
