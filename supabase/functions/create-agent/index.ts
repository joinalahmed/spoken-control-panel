
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

    // Try to get user from session first (for web app usage)
    let user = null;
    try {
      const { data: { user: sessionUser } } = await supabaseClient.auth.getUser()
      user = sessionUser;
    } catch (error) {
      console.log('No valid session found, checking for API key authentication');
    }

    // If no session user, check for API key authentication
    if (!user) {
      const authHeader = req.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const apiKey = authHeader.replace('Bearer ', '');
        
        // Check if this is an API key (starts with 'dhwani_')
        if (apiKey.startsWith('dhwani_')) {
          console.log('API key authentication detected:', apiKey.substring(0, 15) + '...');
          
          // Find user by API key in user_settings
          const { data: userSettings, error: settingsError } = await supabaseClient
            .from('user_settings')
            .select('user_id')
            .eq('setting_key', 'api_key')
            .eq('setting_value', apiKey)
            .single();

          if (settingsError || !userSettings) {
            console.error('Invalid API key:', settingsError);
            return new Response(
              JSON.stringify({ error: 'Invalid API key' }),
              { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Set user ID from the API key lookup
          user = { id: userSettings.user_id };
          console.log('API key authentication successful for user:', user.id);
        }
      }
    }

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Please provide a valid session token or API key' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const agentData = await req.json()

    console.log('Creating agent for user', user.id, ':', agentData)

    const { data, error } = await supabaseClient
      .from('agents')
      .insert({
        user_id: user.id,
        name: agentData.name,
        voice: agentData.voice || 'nova',
        status: agentData.status || 'inactive',
        description: agentData.description || null,
        system_prompt: agentData.system_prompt || null,
        first_message: agentData.first_message || null,
        knowledge_base_id: agentData.knowledge_base_id || null,
        company: agentData.company || null,
        agent_type: agentData.agent_type || 'outbound',
        conversations: 0
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating agent:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Agent created successfully:', data)

    return new Response(
      JSON.stringify({ success: true, agent: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in create-agent function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
