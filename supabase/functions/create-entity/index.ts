
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { entityType, data } = await req.json()

    console.log(`Creating ${entityType} for user ${user.id}:`, data)

    let result
    let error

    switch (entityType) {
      case 'agent':
        ({ data: result, error } = await supabaseClient
          .from('agents')
          .insert({
            user_id: user.id,
            name: data.name,
            voice: data.voice || 'nova',
            status: data.status || 'inactive',
            description: data.description || null,
            system_prompt: data.system_prompt || null,
            first_message: data.first_message || null,
            knowledge_base_id: data.knowledge_base_id || null,
            company: data.company || null,
            agent_type: data.agent_type || 'outbound',
            conversations: 0
          })
          .select()
          .single())
        break

      case 'contact':
        ({ data: result, error } = await supabaseClient
          .from('contacts')
          .insert({
            user_id: user.id,
            name: data.name,
            email: data.email || null,
            phone: data.phone || null,
            address: data.address || null,
            city: data.city || null,
            state: data.state || null,
            zip_code: data.zip_code || null,
            status: data.status || 'active'
          })
          .select()
          .single())
        break

      case 'knowledge_base':
        ({ data: result, error } = await supabaseClient
          .from('knowledge_base')
          .insert({
            user_id: user.id,
            title: data.title,
            type: data.type || 'document',
            description: data.description || null,
            content: data.content || null,
            tags: data.tags || null,
            status: data.status || 'draft',
            date_added: new Date().toISOString(),
            last_modified: new Date().toISOString()
          })
          .select()
          .single())
        break

      case 'campaign':
        // First create the campaign
        ({ data: result, error } = await supabaseClient
          .from('campaigns')
          .insert({
            user_id: user.id,
            name: data.name,
            description: data.description || null,
            agent_id: data.agent_id || null,
            contact_ids: data.contact_ids || [],
            status: data.status || 'draft',
            knowledge_base_id: data.knowledge_base_id || null
          })
          .select()
          .single())

        // If campaign created successfully and contact_ids provided, create campaign_contacts entries
        if (result && !error && data.contact_ids && data.contact_ids.length > 0) {
          const campaignContacts = data.contact_ids.map((contactId: string) => ({
            campaign_id: result.id,
            contact_id: contactId
          }))

          const { error: contactsError } = await supabaseClient
            .from('campaign_contacts')
            .insert(campaignContacts)

          if (contactsError) {
            console.error('Error creating campaign contacts:', contactsError)
          }
        }
        break

      default:
        return new Response(
          JSON.stringify({ error: `Unsupported entity type: ${entityType}` }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }

    if (error) {
      console.error(`Error creating ${entityType}:`, error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Successfully created ${entityType}:`, result)

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: result,
        entityType 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in create-entity function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
