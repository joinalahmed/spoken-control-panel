
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

export const findCampaignForContact = async (
  supabase: SupabaseClient, 
  userId: string,
  campaignType?: string | null
) => {
  const { data: campaigns, error: campaignsError } = await supabase
    .from('campaigns')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active');

  if (campaignsError) {
    console.log('Error fetching campaigns:', campaignsError);
    throw new Error('Error fetching campaigns');
  }

  // Filter for active inbound campaigns only
  const inboundCampaigns = campaigns?.filter(c => {
    // Check both possible field names for campaign type
    const cType = c.settings?.campaign_type || c.settings?.campaignType || 'outbound';
    return cType === 'inbound';
  }) || [];

  if (inboundCampaigns.length === 0) {
    console.log('No active inbound campaigns found for contact user');
    console.log('Available campaigns:', campaigns?.map(c => ({ 
      name: c.name, 
      id: c.id, 
      settings: c.settings 
    })));
    throw new Error('No active inbound campaigns found for this contact');
  }

  const selectedCampaign = inboundCampaigns[0];
  console.log(`Found active inbound campaign: ${selectedCampaign.name}`);
  return selectedCampaign;
};
