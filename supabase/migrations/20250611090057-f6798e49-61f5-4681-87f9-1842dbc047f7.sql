
-- First, create the scripts table
CREATE TABLE IF NOT EXISTS public.scripts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  company TEXT,
  agent_type TEXT NOT NULL DEFAULT 'outbound',
  voice TEXT NOT NULL DEFAULT 'Sarah',
  first_message TEXT,
  sections JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add script_id column to agents table
ALTER TABLE public.agents 
ADD COLUMN IF NOT EXISTS script_id UUID REFERENCES public.scripts(id) ON DELETE SET NULL;

-- Enable RLS on scripts table
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for scripts table
CREATE POLICY "Users can view their own scripts" 
  ON public.scripts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scripts" 
  ON public.scripts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scripts" 
  ON public.scripts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scripts" 
  ON public.scripts 
  FOR DELETE 
  USING (auth.uid() = user_id);
