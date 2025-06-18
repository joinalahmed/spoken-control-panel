
-- Remove RLS policies for contacts table
DROP POLICY IF EXISTS "Users can view their own contacts" ON public.contacts;
DROP POLICY IF EXISTS "Users can create their own contacts" ON public.contacts;
DROP POLICY IF EXISTS "Users can update their own contacts" ON public.contacts;
DROP POLICY IF EXISTS "Users can delete their own contacts" ON public.contacts;

-- Remove RLS policies for agents table
DROP POLICY IF EXISTS "Users can view their own agents" ON public.agents;
DROP POLICY IF EXISTS "Users can create their own agents" ON public.agents;
DROP POLICY IF EXISTS "Users can update their own agents" ON public.agents;
DROP POLICY IF EXISTS "Users can delete their own agents" ON public.agents;

-- Remove RLS policies for knowledge_base table
DROP POLICY IF EXISTS "Users can view their own knowledge_base" ON public.knowledge_base;
DROP POLICY IF EXISTS "Users can create their own knowledge_base" ON public.knowledge_base;
DROP POLICY IF EXISTS "Users can update their own knowledge_base" ON public.knowledge_base;
DROP POLICY IF EXISTS "Users can delete their own knowledge_base" ON public.knowledge_base;

-- Remove RLS policies for scripts table
DROP POLICY IF EXISTS "Users can view their own scripts" ON public.scripts;
DROP POLICY IF EXISTS "Users can create their own scripts" ON public.scripts;
DROP POLICY IF EXISTS "Users can update their own scripts" ON public.scripts;
DROP POLICY IF EXISTS "Users can delete their own scripts" ON public.scripts;

-- Remove RLS policies for campaigns table
DROP POLICY IF EXISTS "Users can view their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can create their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can update their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can delete their own campaigns" ON public.campaigns;

-- Disable RLS on all tables
ALTER TABLE public.contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns DISABLE ROW LEVEL SECURITY;

-- Create new policies that allow all authenticated users to access all data
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Contacts policies - allow all authenticated users
CREATE POLICY "All authenticated users can view contacts" ON public.contacts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "All authenticated users can create contacts" ON public.contacts
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "All authenticated users can update contacts" ON public.contacts
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "All authenticated users can delete contacts" ON public.contacts
  FOR DELETE TO authenticated USING (true);

-- Agents policies - allow all authenticated users
CREATE POLICY "All authenticated users can view agents" ON public.agents
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "All authenticated users can create agents" ON public.agents
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "All authenticated users can update agents" ON public.agents
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "All authenticated users can delete agents" ON public.agents
  FOR DELETE TO authenticated USING (true);

-- Knowledge base policies - allow all authenticated users
CREATE POLICY "All authenticated users can view knowledge_base" ON public.knowledge_base
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "All authenticated users can create knowledge_base" ON public.knowledge_base
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "All authenticated users can update knowledge_base" ON public.knowledge_base
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "All authenticated users can delete knowledge_base" ON public.knowledge_base
  FOR DELETE TO authenticated USING (true);

-- Scripts policies - allow all authenticated users
CREATE POLICY "All authenticated users can view scripts" ON public.scripts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "All authenticated users can create scripts" ON public.scripts
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "All authenticated users can update scripts" ON public.scripts
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "All authenticated users can delete scripts" ON public.scripts
  FOR DELETE TO authenticated USING (true);

-- Campaigns policies - allow all authenticated users
CREATE POLICY "All authenticated users can view campaigns" ON public.campaigns
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "All authenticated users can create campaigns" ON public.campaigns
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "All authenticated users can update campaigns" ON public.campaigns
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "All authenticated users can delete campaigns" ON public.campaigns
  FOR DELETE TO authenticated USING (true);
