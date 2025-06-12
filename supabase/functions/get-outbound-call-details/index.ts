
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get the campaign_id from query parameters or request body
    let campaignId: string | null = null;
    
    if (req.method === 'GET') {
      const url = new URL(req.url);
      campaignId = url.searchParams.get('campaign_id');
    } else if (req.method === 'POST') {
      const body = await req.json();
      campaignId = body.campaign_id;
    }

    if (!campaignId) {
      return new Response(
        JSON.stringify({ error: 'Campaign ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Looking up outbound call details for campaign: ${campaignId}`);

    // Get campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campaignError) {
      console.log('Error fetching campaign:', campaignError);
      return new Response(
        JSON.stringify({ error: 'Error fetching campaign' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!campaign) {
      console.log('Campaign not found for ID:', campaignId);
      return new Response(
        JSON.stringify({ error: 'Campaign not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Found campaign: ${campaign.name}`);

    // Get agent details if campaign has an agent
    let agent = null;
    if (campaign.agent_id) {
      const { data: agentData, error: agentError } = await supabase
        .from('agents')
        .select('*')
        .eq('id', campaign.agent_id)
        .single();

      if (!agentError && agentData) {
        agent = {
          id: agentData.id,
          name: agentData.name,
          voice: agentData.voice,
          status: agentData.status,
          description: agentData.description,
          system_prompt: agentData.system_prompt,
          first_message: agentData.first_message,
          company: agentData.company,
          agent_type: agentData.agent_type
        };
        console.log(`Found agent: ${agent.name}`);
      }
    }

    // If no agent found, return error
    if (!agent) {
      console.log('No agent found for campaign');
      return new Response(
        JSON.stringify({ error: 'No agent assigned to this campaign' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get script details if campaign has a script
    let script = null;
    if (campaign.script_id) {
      const { data: scriptData, error: scriptError } = await supabase
        .from('scripts')
        .select('*')
        .eq('id', campaign.script_id)
        .single();

      if (!scriptError && scriptData) {
        script = {
          id: scriptData.id,
          name: scriptData.name,
          description: scriptData.description,
          company: scriptData.company,
          agent_type: scriptData.agent_type,
          voice: scriptData.voice,
          first_message: scriptData.first_message,
          sections: scriptData.sections
        };
        console.log(`Found script: ${script.name}`);
      }
    }

    // Get user details (campaign owner)
    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', campaign.user_id)
      .single();

    if (userError) {
      console.log('User profile not found:', userError);
    }

    // Get knowledge bases for the user
    const { data: knowledgeBases, error: kbError } = await supabase
      .from('knowledge_base')
      .select('*')
      .eq('user_id', campaign.user_id)
      .eq('status', 'published');

    if (kbError) {
      console.log('Error fetching knowledge bases:', kbError);
    }

    // Return comprehensive outbound call details
    return new Response(
      JSON.stringify({
        success: true,
        campaign_id: campaign.id,
        outbound_call: {
          campaign: {
            id: campaign.id,
            name: campaign.name,
            description: campaign.description,
            status: campaign.status
          },
          agent: agent,
          script: script,
          user: userProfile ? {
            id: userProfile.id,
            full_name: userProfile.full_name,
            email: userProfile.email
          } : null,
          knowledge_bases: knowledgeBases || []
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
