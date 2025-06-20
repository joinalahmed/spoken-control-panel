
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Function to normalize phone numbers for comparison
const normalizePhoneNumber = (phone: string): string => {
  // Remove all spaces, dashes, parentheses, and other non-digit characters except +
  return phone.replace(/[\s\-\(\)\.]/g, '');
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

    // Get parameters from query or request body
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
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Looking up caller details for phone: ${phoneNumber}`);
    
    // Normalize the input phone number
    const normalizedInputPhone = normalizePhoneNumber(phoneNumber);
    console.log(`Normalized input phone: ${normalizedInputPhone}`);

    // Get all contacts and find by normalized phone number
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('*');

    if (contactsError) {
      console.log('Error fetching contacts:', contactsError);
      return new Response(
        JSON.stringify({ error: 'Error fetching contacts' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Find contact by normalized phone number
    const contact = contacts?.find(c => 
      c.phone && normalizePhoneNumber(c.phone) === normalizedInputPhone
    );

    if (!contact) {
      console.log('Contact not found for normalized phone:', normalizedInputPhone);
      return new Response(
        JSON.stringify({ error: 'Contact not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Found contact: ${contact.name}`);

    // Get campaigns for this user (contact's user)
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', contact.user_id)
      .eq('status', 'active');

    if (campaignsError) {
      console.log('Error fetching campaigns:', campaignsError);
      return new Response(
        JSON.stringify({ error: 'Error fetching campaigns' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
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
      return new Response(
        JSON.stringify({ error: 'No active campaigns found for this contact' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Found campaign: ${selectedCampaign.name}`);

    // Get agent details if campaign has an agent
    let agent = null;
    if (selectedCampaign.agent_id) {
      const { data: agentData, error: agentError } = await supabase
        .from('agents')
        .select('*')
        .eq('id', selectedCampaign.agent_id)
        .single();

      if (!agentError && agentData) {
        agent = {
          id: agentData.id,
          name: agentData.name,
          voice: agentData.voice,
          voice_id: agentData.voice, // Add voice_id parameter
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

    // Get script details if campaign has a script
    let script = null;
    if (selectedCampaign.script_id) {
      const { data: scriptData, error: scriptError } = await supabase
        .from('scripts')
        .select('*')
        .eq('id', selectedCampaign.script_id)
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

    // Get user details (contact's user)
    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', contact.user_id)
      .single();

    if (userError) {
      console.log('User profile not found:', userError);
    }

    // Get knowledge bases for the user
    const { data: knowledgeBases, error: kbError } = await supabase
      .from('knowledge_base')
      .select('*')
      .eq('user_id', contact.user_id)
      .eq('status', 'published');

    if (kbError) {
      console.log('Error fetching knowledge bases:', kbError);
    }

    // Return caller details
    const response = {
      success: true,
      campaign_id: selectedCampaign.id,
      voice_id: agent?.voice_id || null, // Add voice_id to top level response
      caller: {
        contact: {
          id: contact.id,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          address: contact.address,
          city: contact.city,
          state: contact.state,
          zip_code: contact.zip_code,
          status: contact.status
        },
        campaign: {
          id: selectedCampaign.id,
          name: selectedCampaign.name,
          description: selectedCampaign.description,
          status: selectedCampaign.status,
          campaign_type: selectedCampaign.settings?.campaign_type || 'outbound'
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
    };

    return new Response(
      JSON.stringify(response),
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
