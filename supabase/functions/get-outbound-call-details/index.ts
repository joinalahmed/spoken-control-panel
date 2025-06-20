
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { handleCorsPrelight, createErrorResponse, createSuccessResponse } from './utils/cors.ts';
import { findContactByPhone } from './services/contact.ts';
import { findOutboundCampaignForContact, getCampaignById } from './services/campaign.ts';
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

    if (!campaignId && !phoneNumber) {
      return createErrorResponse('Either campaign_id or phone number is required');
    }

    let campaign = null;
    let contact = null;

    if (phoneNumber) {
      try {
        contact = await findContactByPhone(supabase, phoneNumber);
        campaign = await findOutboundCampaignForContact(supabase, contact.id);
        campaignId = campaign.id;
      } catch (error) {
        return createErrorResponse(error.message, error.message.includes('not found') ? 404 : 500);
      }
    } else {
      try {
        campaign = await getCampaignById(supabase, campaignId!);
      } catch (error) {
        return createErrorResponse(error.message, error.message.includes('not found') ? 404 : 500);
      }
    }

    console.log(`Found outbound campaign: ${campaign.name}`);

    const agent = campaign.agent_id ? await getAgentDetails(supabase, campaign.agent_id) : null;

    if (!agent) {
      console.log('No agent found for campaign');
      return createErrorResponse('No agent assigned to this outbound campaign', 404);
    }

    const script = campaign.script_id ? await getScriptDetails(supabase, campaign.script_id) : null;
    const user = await getUserProfile(supabase, campaign.user_id);
    const knowledgeBases = await getKnowledgeBases(supabase, campaign.user_id);

    const response = buildOutboundCallResponse(campaign, agent, script, user, knowledgeBases, contact);

    return createSuccessResponse(response);

  } catch (error) {
    console.error('Unexpected error:', error);
    return createErrorResponse('Internal server error', 500);
  }
});
