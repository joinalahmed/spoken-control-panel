
-- Remove existing RLS policies for all tables
DROP POLICY IF EXISTS "All authenticated users can view contacts" ON public.contacts;
DROP POLICY IF EXISTS "All authenticated users can create contacts" ON public.contacts;
DROP POLICY IF EXISTS "All authenticated users can update contacts" ON public.contacts;
DROP POLICY IF EXISTS "All authenticated users can delete contacts" ON public.contacts;

DROP POLICY IF EXISTS "All authenticated users can view agents" ON public.agents;
DROP POLICY IF EXISTS "All authenticated users can create agents" ON public.agents;
DROP POLICY IF EXISTS "All authenticated users can update agents" ON public.agents;
DROP POLICY IF EXISTS "All authenticated users can delete agents" ON public.agents;

DROP POLICY IF EXISTS "All authenticated users can view knowledge_base" ON public.knowledge_base;
DROP POLICY IF EXISTS "All authenticated users can create knowledge_base" ON public.knowledge_base;
DROP POLICY IF EXISTS "All authenticated users can update knowledge_base" ON public.knowledge_base;
DROP POLICY IF EXISTS "All authenticated users can delete knowledge_base" ON public.knowledge_base;

DROP POLICY IF EXISTS "All authenticated users can view scripts" ON public.scripts;
DROP POLICY IF EXISTS "All authenticated users can create scripts" ON public.scripts;
DROP POLICY IF EXISTS "All authenticated users can update scripts" ON public.scripts;
DROP POLICY IF EXISTS "All authenticated users can delete scripts" ON public.scripts;

DROP POLICY IF EXISTS "All authenticated users can view campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "All authenticated users can create campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "All authenticated users can update campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "All authenticated users can delete campaigns" ON public.campaigns;

DROP POLICY IF EXISTS "All authenticated users can view custom_voices" ON public.custom_voices;
DROP POLICY IF EXISTS "All authenticated users can create custom_voices" ON public.custom_voices;
DROP POLICY IF EXISTS "All authenticated users can update custom_voices" ON public.custom_voices;
DROP POLICY IF EXISTS "All authenticated users can delete custom_voices" ON public.custom_voices;

-- Enable RLS on all tables
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_voices ENABLE ROW LEVEL SECURITY;

-- Create new policies that allow all authenticated users to access all data

-- Contacts policies - allow all authenticated users to access all data
CREATE POLICY "All authenticated users can view all contacts" ON public.contacts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "All authenticated users can create any contact" ON public.contacts
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "All authenticated users can update any contact" ON public.contacts
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "All authenticated users can delete any contact" ON public.contacts
  FOR DELETE TO authenticated USING (true);

-- Agents policies - allow all authenticated users to access all data
CREATE POLICY "All authenticated users can view all agents" ON public.agents
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "All authenticated users can create any agent" ON public.agents
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "All authenticated users can update any agent" ON public.agents
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "All authenticated users can delete any agent" ON public.agents
  FOR DELETE TO authenticated USING (true);

-- Knowledge base policies - allow all authenticated users to access all data
CREATE POLICY "All authenticated users can view all knowledge_base" ON public.knowledge_base
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "All authenticated users can create any knowledge_base" ON public.knowledge_base
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "All authenticated users can update any knowledge_base" ON public.knowledge_base
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "All authenticated users can delete any knowledge_base" ON public.knowledge_base
  FOR DELETE TO authenticated USING (true);

-- Scripts policies - allow all authenticated users to access all data
CREATE POLICY "All authenticated users can view all scripts" ON public.scripts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "All authenticated users can create any script" ON public.scripts
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "All authenticated users can update any script" ON public.scripts
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "All authenticated users can delete any script" ON public.scripts
  FOR DELETE TO authenticated USING (true);

-- Campaigns policies - allow all authenticated users to access all data
CREATE POLICY "All authenticated users can view all campaigns" ON public.campaigns
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "All authenticated users can create any campaign" ON public.campaigns
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "All authenticated users can update any campaign" ON public.campaigns
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "All authenticated users can delete any campaign" ON public.campaigns
  FOR DELETE TO authenticated USING (true);

-- Custom voices policies - allow all authenticated users to access all data
CREATE POLICY "All authenticated users can view all custom_voices" ON public.custom_voices
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "All authenticated users can create any custom_voice" ON public.custom_voices
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "All authenticated users can update any custom_voice" ON public.custom_voices
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "All authenticated users can delete any custom_voice" ON public.custom_voices
  FOR DELETE TO authenticated USING (true);
