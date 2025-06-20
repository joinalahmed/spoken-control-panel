
-- Remove agent_type and voice columns from scripts table
ALTER TABLE public.scripts 
DROP COLUMN IF EXISTS agent_type,
DROP COLUMN IF EXISTS voice;
