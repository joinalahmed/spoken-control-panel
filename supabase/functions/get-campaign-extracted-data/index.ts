
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { corsHeaders } from '../shared/utils/cors.ts';

interface ExtractedDataField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date';
  description?: string;
  required?: boolean;
}

interface CallExtractedData {
  call_id: string;
  contact_name: string;
  phone: string;
  started_at: string;
  duration: number;
  status: string;
  extracted_data: Record<string, any>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

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
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Getting extracted data for campaign: ${campaignId}`);

    // Get the campaign and its data extraction configuration
    const { data: campaign, error: campaignError } = await supabaseClient
      .from('campaigns')
      .select('id, name, extracted_data_config')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      console.error('Error fetching campaign:', campaignError);
      return new Response(
        JSON.stringify({ error: 'Campaign not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get all calls for this campaign with extracted data
    const { data: calls, error: callsError } = await supabaseClient
      .from('calls')
      .select(`
        id,
        phone,
        started_at,
        duration,
        status,
        extracted_data,
        contacts!inner(name)
      `)
      .eq('campaign_id', campaignId)
      .not('extracted_data', 'is', null);

    if (callsError) {
      console.error('Error fetching calls:', callsError);
      return new Response(
        JSON.stringify({ error: 'Error fetching call data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format the response data
    const extractedDataConfig = campaign.extracted_data_config as ExtractedDataField[] || [];
    const callData: CallExtractedData[] = calls?.map(call => ({
      call_id: call.id,
      contact_name: call.contacts?.name || 'Unknown',
      phone: call.phone,
      started_at: call.started_at,
      duration: call.duration || 0,
      status: call.status,
      extracted_data: call.extracted_data || {}
    })) || [];

    const response = {
      campaign: {
        id: campaign.id,
        name: campaign.name,
        extracted_data_config: extractedDataConfig
      },
      calls: callData,
      total_calls: callData.length,
      fields_configured: extractedDataConfig.length
    };

    console.log(`Returning ${callData.length} calls with extracted data`);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
