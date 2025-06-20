
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

export const getAgentDetails = async (
  supabase: SupabaseClient, 
  agentId: string
) => {
  const { data: agentData, error: agentError } = await supabase
    .from('agents')
    .select('*')
    .eq('id', agentId)
    .single();

  if (!agentError && agentData) {
    const agent = {
      id: agentData.id,
      name: agentData.name,
      voice: agentData.voice,
      voice_id: agentData.voice,
      status: agentData.status,
      description: agentData.description,
      system_prompt: agentData.system_prompt,
      first_message: agentData.first_message,
      company: agentData.company,
      agent_type: agentData.agent_type
    };
    console.log(`Found agent: ${agent.name}`);
    return agent;
  }

  return null;
};
