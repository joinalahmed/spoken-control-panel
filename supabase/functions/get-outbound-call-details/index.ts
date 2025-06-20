
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { handleCorsPrelight, createErrorResponse, createSuccessResponse } from './utils/cors.ts';
import { findContactByPhone } from './services/contact.ts';
import { getCampaignById } from './services/campaign.ts';
import { getAgentDetails } from './services/agent.ts';
import { getScriptDetails } from './services/script.ts';
import { getUserProfile, getKnowledgeBases } from './services/user.ts';
import { buildOutboundCallResponse } from './utils/response.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPrelight();
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    let campaignId: string | null = null;
    let phoneNumber: string | null = null;
    
    if (req.method === 'GET') {
      const url = new URL(req.url);
      campaignId = url.searchParams.get('campaign_id');
      phoneNumber = url.searchParams.get('phone');
    } else if (req.method === 'POST') {
      const body = await req.json();
      campaignId = body.campaign_id;
      phoneNumber = body.phone;
    }

    // Both campaign_id and phone are required
    if (!campaignId || !phoneNumber) {
      return createErrorResponse('Both campaign_id and phone number are required');
    }

    let campaign = null;
    let contact = null;

    try {
      // Get the campaign by ID
      campaign = await getCampaignById(supabase, campaignId);
      console.log(`Found outbound campaign by ID: ${campaign.name}`);
      
      // Find the contact by phone number
      contact = await findContactByPhone(supabase, phoneNumber);
      
      // Verify the contact is associated with this specific campaign
      const { data: campaignContact, error: campaignContactError } = await supabase
        .from('campaign_contacts')
        .select('*')
        .eq('campaign_id', campaignId)
        .eq('contact_id', contact.id)
        .single();

      if (campaignContactError || !campaignContact) {
        console.log('Contact not found in the specified campaign');
        return createErrorResponse('Contact not found in the specified campaign', 404);
      }
      
      console.log(`Verified contact ${contact.name} is in campaign ${campaign.name}`);
    } catch (error) {
      return createErrorResponse(error.message, error.message.includes('not found') ? 404 : 500);
    }

    const agent = campaign.agent_id ? await getAgentDetails(supabase, campaign.agent_id) : null;

    if (!agent) {
      console.log('No agent found for campaign');
      return createErrorResponse('No agent assigned to this outbound campaign', 404);
    }

    const script = campaign.script_id ? await getScriptDetails(supabase, campaign.script_id) : null;
    
    // Get user details from the contact's user_id
    const user = await getUserProfile(supabase, contact.user_id);
    const knowledgeBases = await getKnowledgeBases(supabase, contact.user_id);

    console.log(`Found user details for contact: ${user ? user.full_name || user.email : 'No user found'}`);

    const response = buildOutboundCallResponse(campaign, agent, script, user, knowledgeBases, contact);

    return createSuccessResponse(response);

  } catch (error) {
    console.error('Unexpected error:', error);
    return createErrorResponse('Internal server error', 500);
  }
});
