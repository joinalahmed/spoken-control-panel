
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

  // Filter campaigns by type if specified
  let filteredCampaigns = campaigns || [];
  if (campaignType) {
    filteredCampaigns = campaigns?.filter(c => {
      const cType = c.settings?.campaign_type || 'outbound';
      return cType === campaignType;
    }) || [];
  }

  // For inbound calls, prioritize inbound campaigns, otherwise use any active campaign
  let selectedCampaign = null;
  if (!campaignType || campaignType === 'inbound') {
    // Look for active inbound campaigns first
    const inboundCampaigns = filteredCampaigns.filter(c => 
      (c.settings?.campaign_type === 'inbound')
    );
    selectedCampaign = inboundCampaigns[0] || filteredCampaigns[0];
  } else {
    selectedCampaign = filteredCampaigns[0];
  }

  if (!selectedCampaign) {
    console.log('No active campaigns found for contact user');
    throw new Error('No active campaigns found for this contact');
  }

  console.log(`Found campaign: ${selectedCampaign.name}`);
  return selectedCampaign;
};
