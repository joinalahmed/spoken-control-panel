
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Campaign } from '@/hooks/useCampaigns';

export const useCampaignContactCounts = (campaigns: Campaign[]) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['campaign-contact-counts', campaigns.map(c => c.id)],
    queryFn: async () => {
      if (campaigns.length === 0) return {};
      
      const campaignIds = campaigns.map(c => c.id);
      
      const { data, error } = await supabase
        .from('campaign_contacts')
        .select('campaign_id, contact_id')
        .in('campaign_id', campaignIds);

      if (error) {
        console.error('Error fetching contact counts:', error);
        return {};
      }

      console.log('Campaign contacts data:', data);

      const counts: Record<string, number> = {};
      
      campaignIds.forEach(id => {
        counts[id] = 0;
      });
      
      data.forEach(item => {
        counts[item.campaign_id] = (counts[item.campaign_id] || 0) + 1;
      });

      console.log('Contact counts:', counts);
      return counts;
    },
    enabled: !!user?.id && campaigns.length > 0,
    staleTime: 0, // Always refetch to ensure fresh data
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });
};
