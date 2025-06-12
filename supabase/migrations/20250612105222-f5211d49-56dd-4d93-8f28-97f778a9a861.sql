
-- Remove the agent_type column from agents table since campaigns will handle this instead
ALTER TABLE public.agents DROP COLUMN IF EXISTS agent_type;
