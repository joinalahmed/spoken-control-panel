
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { handleCorsPrelight, createErrorResponse, createSuccessResponse } from './utils/cors.ts';
import { findContactByPhone } from './services/contact.ts';
import { findCampaignForContact } from './services/campaign.ts';
import { getAgentDetails } from './services/agent.ts';
import { getScriptDetails } from './services/script.ts';
import { getUserProfile, getCampaignKnowledgeBase } from './services/user.ts';
import { buildCallerResponse } from './utils/response.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPrelight();
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    let phoneNumber: string | null = null;
    let campaignType: string | null = null;
    
    if (req.method === 'GET') {
      const url = new URL(req.url);
      phoneNumber = url.searchParams.get('phone');
      campaignType = url.searchParams.get('campaign_type');
    } else if (req.method === 'POST') {
      const body = await req.json();
      phoneNumber = body.phone;
      campaignType = body.campaign_type;
    }

    if (!phoneNumber) {
      return createErrorResponse('Phone number is required');
    }

    console.log(`Processing request for phone: ${phoneNumber}`);

    let contact;
    try {
      contact = await findContactByPhone(supabase, phoneNumber);
      console.log(`Found contact: ${contact.name} (user_id: ${contact.user_id})`);
    } catch (error) {
      console.log(`Contact lookup failed: ${error.message}`);
      return createErrorResponse(error.message, error.message.includes('not found') ? 404 : 500);
    }

    let campaign;
    try {
      // Check if contact is associated with an active inbound campaign
      campaign = await findCampaignForContact(supabase, contact.user_id, campaignType);
      console.log(`Found active inbound campaign: ${campaign.name} (id: ${campaign.id})`);
      
      // Verify campaign is truly active and inbound
      if (campaign.status !== 'active') {
        throw new Error(`Campaign ${campaign.name} is not active (status: ${campaign.status})`);
      }
      
      const campaignType = campaign.settings?.campaign_type || campaign.settings?.campaignType || 'outbound';
      if (campaignType !== 'inbound') {
        throw new Error(`Campaign ${campaign.name} is not an inbound campaign (type: ${campaignType})`);
      }
      
      console.log(`Campaign validation passed: ${campaign.name} is active inbound campaign`);
    } catch (error) {
      console.log(`Campaign lookup failed: ${error.message}`);
      return createErrorResponse(error.message, 404);
    }

    const agent = campaign.agent_id ? await getAgentDetails(supabase, campaign.agent_id) : null;
    const script = campaign.script_id ? await getScriptDetails(supabase, campaign.script_id) : null;
    const user = await getUserProfile(supabase, contact.user_id);
    
    // Get only the knowledge base linked to this campaign
    const knowledgeBases = await getCampaignKnowledgeBase(supabase, campaign.knowledge_base_id);

    console.log(`Response includes: agent=${agent?.name || 'none'}, script=${script?.name || 'none'}, user=${user?.full_name || user?.email || 'none'}, knowledge_bases=${knowledgeBases.length}`);

    const response = buildCallerResponse(campaign, contact, agent, script, user, knowledgeBases);

    return createSuccessResponse(response);

  } catch (error) {
    console.error('Unexpected error:', error);
    return createErrorResponse('Internal server error', 500);
  }
});
