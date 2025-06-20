
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

    let contact;
    try {
      contact = await findContactByPhone(supabase, phoneNumber);
    } catch (error) {
      return createErrorResponse(error.message, error.message.includes('not found') ? 404 : 500);
    }

    let campaign;
    try {
      campaign = await findCampaignForContact(supabase, contact.user_id, campaignType);
    } catch (error) {
      return createErrorResponse(error.message, 404);
    }

    const agent = campaign.agent_id ? await getAgentDetails(supabase, campaign.agent_id) : null;
    const script = campaign.script_id ? await getScriptDetails(supabase, campaign.script_id) : null;
    const user = await getUserProfile(supabase, contact.user_id);
    
    // Get only the knowledge base linked to this campaign and owned by the same user
    const knowledgeBases = await getCampaignKnowledgeBase(supabase, campaign.knowledge_base_id, contact.user_id);

    const response = buildCallerResponse(campaign, contact, agent, script, user, knowledgeBases);

    return createSuccessResponse(response);

  } catch (error) {
    console.error('Unexpected error:', error);
    return createErrorResponse('Internal server error', 500);
  }
});
