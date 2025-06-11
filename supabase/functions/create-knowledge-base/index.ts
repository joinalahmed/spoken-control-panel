
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

    const kbData = await req.json()

    console.log('Creating knowledge base for user', user.id, ':', kbData)

    const { data, error } = await supabaseClient
      .from('knowledge_base')
      .insert({
        user_id: user.id,
        title: kbData.title,
        type: kbData.type || 'document',
        description: kbData.description || null,
        content: kbData.content || null,
        tags: kbData.tags || null,
        status: kbData.status || 'draft',
        date_added: new Date().toISOString(),
        last_modified: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating knowledge base:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Knowledge base created successfully:', data)

    return new Response(
      JSON.stringify({ success: true, knowledge_base: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in create-knowledge-base function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
