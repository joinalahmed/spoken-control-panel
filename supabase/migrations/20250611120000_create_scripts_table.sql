
-- Create scripts table
CREATE TABLE IF NOT EXISTS public.scripts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  company text,
  agent_type text CHECK (agent_type IN ('inbound', 'outbound')) DEFAULT 'outbound',
  voice text DEFAULT 'Sarah',
  first_message text,
  sections jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies for scripts
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own scripts" ON public.scripts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scripts" ON public.scripts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scripts" ON public.scripts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scripts" ON public.scripts
  FOR DELETE USING (auth.uid() = user_id);

-- Add script_id to agents table
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS script_id uuid REFERENCES public.scripts(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_scripts_user_id ON public.scripts(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_script_id ON public.agents(script_id);
