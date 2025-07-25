
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

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse the request body
    const callData = await req.json();

    // Validate required fields
    if (!callData.phone) {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Received call data:', callData);

    // Extract call information
    const {
      phone,
      duration,
      status, // e.g., 'completed', 'missed', 'busy', 'failed'
      direction, // 'inbound' or 'outbound'
      recording_url,
      transcript,
      call_id,
      started_at,
      ended_at,
      notes,
      campaign_id,
      outcome,
      sentiment,
      user_id,
      extracted_data, // New field for JSON object
      call_status, // New field for 'completed' or 'rescheduled'
      rescheduled_for, // New field for reschedule datetime
      objective_met // New field for boolean objective status
    } = callData;

    // Find the contact by phone number
    const normalizePhoneNumber = (phone: string): string => {
      return phone.replace(/[\s\-\(\)\.]/g, '');
    };

    const normalizedInputPhone = normalizePhoneNumber(phone);
    console.log(`Looking for contact with phone: ${normalizedInputPhone}`);

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
      console.log('Contact not found for phone:', normalizedInputPhone);
      return new Response(
        JSON.stringify({ error: 'Contact not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Found contact: ${contact.name}`);

    // Update the contact's last_called timestamp
    const { error: updateError } = await supabase
      .from('contacts')
      .update({ 
        last_called: ended_at || started_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', contact.id);

    if (updateError) {
      console.log('Error updating contact:', updateError);
    }

    // Store the call record in the calls table with new fields
    const callRecord = {
      contact_id: contact.id,
      campaign_id: campaign_id || null,
      phone: phone,
      duration: duration || null,
      status: status || 'unknown',
      direction: direction || 'outbound',
      recording_url: recording_url || null,
      transcript: transcript || null,
      external_call_id: call_id || null,
      started_at: started_at || new Date().toISOString(),
      ended_at: ended_at || null,
      notes: notes || null,
      outcome: outcome || null,
      sentiment: sentiment || null,
      user_id: user_id || contact.user_id,
      extracted_data: extracted_data || null, // Store the JSON object
      call_status: call_status || 'completed', // Default to 'completed'
      rescheduled_for: rescheduled_for || null, // Reschedule datetime
      objective_met: objective_met !== undefined ? objective_met : null, // Boolean objective status
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Storing call record:', callRecord);

    const { data: callResult, error: callError } = await supabase
      .from('calls')
      .insert([callRecord])
      .select()
      .single();

    if (callError) {
      console.log('Error storing call record:', callError);
      return new Response(
        JSON.stringify({ error: 'Error storing call record', details: callError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Call data received and stored successfully',
        campaign_id: campaign_id || null,
        contact: {
          id: contact.id,
          name: contact.name,
          phone: contact.phone
        },
        call_id: callResult?.id
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
