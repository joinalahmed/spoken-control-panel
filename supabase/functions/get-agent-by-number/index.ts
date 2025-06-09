
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
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get the number from query parameters or request body
    let agentNumber: string | null = null;
    
    if (req.method === 'GET') {
      const url = new URL(req.url);
      agentNumber = url.searchParams.get('number');
    } else if (req.method === 'POST') {
      const body = await req.json();
      agentNumber = body.number;
    }

    if (!agentNumber) {
      return new Response(
        JSON.stringify({ error: 'Agent number is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Looking up agent with number: ${agentNumber}`);

    // Query the agents table for the agent with the given number
    // Since there's no "number" field in the agents table, we'll use the agent name or ID
    // For now, let's assume the number corresponds to a position in the list or part of the name
    const { data: agents, error } = await supabase
      .from('agents')
      .select('*')
      .or(`name.ilike.%${agentNumber}%,id.eq.${agentNumber}`)
      .limit(1);

    if (error) {
      console.error('Error fetching agent:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch agent details' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!agents || agents.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Agent not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const agent = agents[0];
    console.log(`Found agent: ${agent.name}`);

    // Return agent details
    return new Response(
      JSON.stringify({
        success: true,
        agent: {
          id: agent.id,
          name: agent.name,
          voice: agent.voice,
          status: agent.status,
          description: agent.description,
          conversations: agent.conversations,
          last_active: agent.last_active,
          system_prompt: agent.system_prompt,
          first_message: agent.first_message,
          knowledge_base_id: agent.knowledge_base_id,
          created_at: agent.created_at,
          updated_at: agent.updated_at
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
