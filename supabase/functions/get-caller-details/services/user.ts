
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

export const getKnowledgeBases = async (
  supabase: SupabaseClient, 
  userId: string
) => {
  const { data: knowledgeBases, error: kbError } = await supabase
    .from('knowledge_base')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'published');

  if (kbError) {
    console.log('Error fetching knowledge bases:', kbError);
    return [];
  }

  return knowledgeBases || [];
};
