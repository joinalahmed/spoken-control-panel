
-- Add new columns to the calls table (skip constraint since it already exists)
ALTER TABLE public.calls 
ADD COLUMN IF NOT EXISTS extracted_data jsonb,
ADD COLUMN IF NOT EXISTS call_status text DEFAULT 'completed',
ADD COLUMN IF NOT EXISTS rescheduled_for timestamp with time zone,
ADD COLUMN IF NOT EXISTS objective_met boolean;
