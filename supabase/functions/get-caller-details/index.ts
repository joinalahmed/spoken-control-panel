
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

    // First, find the contact by phone number
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .select('*')
      .eq('phone', phoneNumber)
      .single();

    if (contactError || !contact) {
      console.log('Contact not found:', contactError);
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
      .select(`
        *,
        agents (
          id,
          name,
          voice,
          status,
          description,
          system_prompt,
          first_message,
          company
        )
      `)
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

    // Get user details (campaign owner)
    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', campaign.user_id)
      .single();

    if (userError) {
      console.log('User profile not found:', userError);
    }

    // Return comprehensive caller details
    return new Response(
      JSON.stringify({
        success: true,
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
          agent: campaign.agents ? {
            id: campaign.agents.id,
            name: campaign.agents.name,
            voice: campaign.agents.voice,
            status: campaign.agents.status,
            description: campaign.agents.description,
            system_prompt: campaign.agents.system_prompt,
            first_message: campaign.agents.first_message,
            company: campaign.agents.company
          } : null,
          user: userProfile ? {
            id: userProfile.id,
            full_name: userProfile.full_name,
            email: userProfile.email
          } : null
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
