
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

export const findOutboundCampaignForContact = async (
  supabase: SupabaseClient, 
  contactId: string
) => {
  const { data: campaignContacts, error: campaignContactsError } = await supabase
    .from('campaign_contacts')
    .select(`
      campaign_id,
      campaigns!inner(*)
    `)
    .eq('contact_id', contactId);

  if (campaignContactsError) {
    console.log('Error fetching campaign contacts:', campaignContactsError);
    throw new Error('Error fetching campaign contacts');
  }

  const activeOutboundCampaigns = campaignContacts?.filter(cc => 
    cc.campaigns.status === 'active' && 
    (cc.campaigns.settings?.campaign_type === 'outbound' || 
     (!cc.campaigns.settings?.campaign_type && true))
  ) || [];

  if (activeOutboundCampaigns.length === 0) {
    console.log('No active outbound campaigns found for contact');
    throw new Error('No active outbound campaigns found for this contact');
  }

  return activeOutboundCampaigns[0].campaigns;
};

export const getCampaignById = async (
  supabase: SupabaseClient, 
  campaignId: string
) => {
  console.log(`Looking up outbound call details for campaign: ${campaignId}`);

  const { data: campaignData, error: campaignError } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', campaignId)
    .single();

  if (campaignError) {
    console.log('Error fetching campaign:', campaignError);
    throw new Error('Error fetching campaign');
  }

  if (!campaignData) {
    console.log('Campaign not found for ID:', campaignId);
    throw new Error('Campaign not found');
  }

  // Only verify campaign type if it's explicitly set to inbound
  const campaignType = campaignData.settings?.campaign_type;
  if (campaignType === 'inbound') {
    console.log('Campaign is inbound, not outbound:', campaignId);
    throw new Error('Campaign is not an outbound campaign');
  }

  return campaignData;
};
