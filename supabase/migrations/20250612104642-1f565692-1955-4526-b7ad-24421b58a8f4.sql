
-- Add settings column to campaigns table to store campaign configuration
ALTER TABLE public.campaigns 
ADD COLUMN settings jsonb DEFAULT '{}'::jsonb;

-- Add a comment to describe the settings structure
COMMENT ON COLUMN public.campaigns.settings IS 'Campaign settings including call scheduling, retry logic, and other configuration options';
