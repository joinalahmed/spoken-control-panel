
-- Add gender column to agents table
ALTER TABLE public.agents 
ADD COLUMN gender text;

-- Add language as an array to support multiple languages
ALTER TABLE public.agents 
ADD COLUMN languages text[] DEFAULT ARRAY['en'];

-- Update existing agents to have the default language array
UPDATE public.agents 
SET languages = ARRAY['en'] 
WHERE languages IS NULL;

-- Remove the old language column if it exists
ALTER TABLE public.agents 
DROP COLUMN IF EXISTS language;
