
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  agent_id: string;
  script_id: string;
  knowledge_base_id: string;
  status: 'active' | 'inactive' | 'paused';
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useCampaign = (campaignId: string) => {
  const { user } = useAuth();

  const { data: campaign, isLoading, error } = useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: async () => {
      if (!user || !campaignId) return null;
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data as Campaign;
    },
    enabled: !!user && !!campaignId,
  });

  return {
    campaign,
    isLoading,
    error: error?.message || null,
  };
};
