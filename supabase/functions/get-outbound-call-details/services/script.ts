
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

export const getScriptDetails = async (
  supabase: SupabaseClient, 
  scriptId: string
) => {
  const { data: scriptData, error: scriptError } = await supabase
    .from('scripts')
    .select('*')
    .eq('id', scriptId)
    .single();

  if (scriptError || !scriptData) {
    return null;
  }

  const script = {
    id: scriptData.id,
    name: scriptData.name,
    description: scriptData.description,
    company: scriptData.company,
    first_message: scriptData.first_message,
    sections: scriptData.sections
  };

  console.log(`Found script: ${script.name}`);
  return script;
};
