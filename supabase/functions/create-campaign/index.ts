
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const campaignData = await req.json()

    console.log('Creating campaign for user', user.id, ':', campaignData)

    // Create the campaign
    const { data, error } = await supabaseClient
      .from('campaigns')
      .insert({
        user_id: user.id,
        name: campaignData.name,
        description: campaignData.description || null,
        agent_id: campaignData.agent_id || null,
        contact_ids: campaignData.contact_ids || [],
        status: campaignData.status || 'draft',
        knowledge_base_id: campaignData.knowledge_base_id || null
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating campaign:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create campaign_contacts entries if contact_ids provided
    if (campaignData.contact_ids && campaignData.contact_ids.length > 0) {
      const campaignContacts = campaignData.contact_ids.map((contactId: string) => ({
        campaign_id: data.id,
        contact_id: contactId
      }))

      const { error: contactsError } = await supabaseClient
        .from('campaign_contacts')
        .insert(campaignContacts)

      if (contactsError) {
        console.error('Error creating campaign contacts:', contactsError)
      }
    }

    console.log('Campaign created successfully:', data)

    return new Response(
      JSON.stringify({ success: true, campaign: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in create-campaign function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
