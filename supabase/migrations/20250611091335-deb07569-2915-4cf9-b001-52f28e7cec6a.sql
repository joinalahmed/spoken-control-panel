
-- Add script_id column to campaigns table
ALTER TABLE public.campaigns 
ADD COLUMN script_id uuid REFERENCES public.scripts(id);

-- Remove the contact_ids array column since we'll use the campaign_contacts junction table
ALTER TABLE public.campaigns 
DROP COLUMN contact_ids;

-- Ensure we have proper foreign key constraints
ALTER TABLE public.campaigns 
ADD CONSTRAINT fk_campaigns_agent 
FOREIGN KEY (agent_id) REFERENCES public.agents(id);

-- Add index for better performance
CREATE INDEX idx_campaigns_agent_id ON public.campaigns(agent_id);
CREATE INDEX idx_campaigns_script_id ON public.campaigns(script_id);
CREATE INDEX idx_campaigns_knowledge_base_id ON public.campaigns(knowledge_base_id);
