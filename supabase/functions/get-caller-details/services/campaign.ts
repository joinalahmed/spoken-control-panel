
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

export const findCampaignForContact = async (
  supabase: SupabaseClient, 
  userId: string,
  campaignType?: string | null
) => {
  console.log(`Looking for campaigns for user: ${userId}`);
  
  const { data: campaigns, error: campaignsError } = await supabase
    .from('campaigns')
    .select('*')
    .eq('user_id', userId);

  if (campaignsError) {
    console.log('Error fetching campaigns:', campaignsError);
    throw new Error('Error fetching campaigns');
  }

  console.log(`Found ${campaigns?.length || 0} total campaigns for user`);

  // Filter for active inbound campaigns only
  const activeInboundCampaigns = campaigns?.filter(c => {
    const cType = c.settings?.campaign_type || c.settings?.campaignType || 'outbound';
    const isInbound = cType === 'inbound';
    const isActive = c.status === 'active';
    
    console.log(`Campaign ${c.name}: type=${cType}, status=${c.status}, isInbound=${isInbound}, isActive=${isActive}`);
    
    return isInbound && isActive;
  }) || [];

  console.log(`Found ${activeInboundCampaigns.length} active inbound campaigns`);

  if (activeInboundCampaigns.length === 0) {
    console.log('No active inbound campaigns found for contact user');
    console.log('Available campaigns:', campaigns?.map(c => ({ 
      name: c.name, 
      id: c.id, 
      type: c.settings?.campaign_type || c.settings?.campaignType || 'outbound',
      status: c.status
    })));
    throw new Error('No active inbound campaigns found for this contact');
  }

  const selectedCampaign = activeInboundCampaigns[0];
  console.log(`Selected active inbound campaign: ${selectedCampaign.name} (status: ${selectedCampaign.status})`);
  return selectedCampaign;
};
