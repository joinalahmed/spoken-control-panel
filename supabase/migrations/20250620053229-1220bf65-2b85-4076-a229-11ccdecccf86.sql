
-- Create a table for custom voices
CREATE TABLE public.custom_voices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  voice_name TEXT NOT NULL,
  voice_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, voice_id),
  UNIQUE(user_id, voice_name)
);

-- Add Row Level Security (RLS) to ensure users can only see their own voices
ALTER TABLE public.custom_voices ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own voices
CREATE POLICY "Users can view their own voices" 
  ON public.custom_voices 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own voices
CREATE POLICY "Users can create their own voices" 
  ON public.custom_voices 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own voices
CREATE POLICY "Users can update their own voices" 
  ON public.custom_voices 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own voices
CREATE POLICY "Users can delete their own voices" 
  ON public.custom_voices 
  FOR DELETE 
  USING (auth.uid() = user_id);
