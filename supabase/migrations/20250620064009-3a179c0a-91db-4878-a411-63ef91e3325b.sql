
-- Enable RLS on campaign_contacts table (if not already enabled)
ALTER TABLE public.campaign_contacts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view campaign contacts for campaigns they have access to
CREATE POLICY "Users can view campaign contacts" 
  ON public.campaign_contacts 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns 
      WHERE campaigns.id = campaign_contacts.campaign_id
    )
  );

-- Create policy to allow users to insert campaign contacts for campaigns they have access to
CREATE POLICY "Users can create campaign contacts" 
  ON public.campaign_contacts 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.campaigns 
      WHERE campaigns.id = campaign_contacts.campaign_id
    )
  );

-- Create policy to allow users to update campaign contacts for campaigns they have access to
CREATE POLICY "Users can update campaign contacts" 
  ON public.campaign_contacts 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns 
      WHERE campaigns.id = campaign_contacts.campaign_id
    )
  );

-- Create policy to allow users to delete campaign contacts for campaigns they have access to
CREATE POLICY "Users can delete campaign contacts" 
  ON public.campaign_contacts 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns 
      WHERE campaigns.id = campaign_contacts.campaign_id
    )
  );
