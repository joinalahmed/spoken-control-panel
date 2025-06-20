
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

export const getUserProfile = async (
  supabase: SupabaseClient, 
  userId: string
) => {
  const { data: userProfile, error: userError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (userError) {
    console.log('User profile not found:', userError);
    return null;
  }

  return userProfile ? {
    id: userProfile.id,
    full_name: userProfile.full_name,
    email: userProfile.email
  } : null;
};

export const getCampaignKnowledgeBase = async (
  supabase: SupabaseClient, 
  knowledgeBaseId: string | null
) => {
  if (!knowledgeBaseId) {
    console.log('No knowledge base ID provided');
    return [];
  }

  const { data: knowledgeBase, error: kbError } = await supabase
    .from('knowledge_base')
    .select('*')
    .eq('id', knowledgeBaseId)
    .eq('status', 'published')
    .single();

  if (kbError) {
    console.log('Error fetching campaign knowledge base:', kbError);
    return [];
  }

  return knowledgeBase ? [knowledgeBase] : [];
};
