
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

    // Get the phone number from query parameters or request body
    let phoneNumber: string | null = null;
    
    if (req.method === 'GET') {
      const url = new URL(req.url);
      phoneNumber = url.searchParams.get('phone');
    } else if (req.method === 'POST') {
      const body = await req.json();
      phoneNumber = body.phone;
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

    console.log(`Looking up caller with phone: ${phoneNumber}`);
    
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
      console.log('Available contacts:', contacts?.map(c => ({ id: c.id, phone: c.phone, normalized: c.phone ? normalizePhoneNumber(c.phone) : null })));
      return new Response(
        JSON.stringify({ error: 'Contact not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Found contact: ${contact.name}`);

    // Find campaigns where this contact is assigned
    const { data: campaigns, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .contains('contact_ids', [contact.id])
      .eq('status', 'active')
      .limit(1);

    if (campaignError || !campaigns || campaigns.length === 0) {
      console.log('No active campaigns found for contact:', campaignError);
      return new Response(
        JSON.stringify({ error: 'No active campaigns found for this contact' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const campaign = campaigns[0];
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
          company: agentData.company
        };
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

    // Return comprehensive caller details
    return new Response(
      JSON.stringify({
        success: true,
        campaign_id: campaign.id,
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
            id: campaign.id,
            name: campaign.name,
            description: campaign.description,
            status: campaign.status
          },
          agent: agent,
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
