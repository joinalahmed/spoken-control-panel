
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CampaignAnalytics {
  totalCalls: number;
  successRate: number;
  averageDuration: number;
  callsCompleted: number;
  callsFailed: number;
  totalDuration: number;
  objectivesMet: number;
  totalObjectives: number;
}

export const useCampaignAnalytics = (campaignId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['campaign-analytics', campaignId],
    queryFn: async (): Promise<CampaignAnalytics> => {
      if (!campaignId) {
        return {
          totalCalls: 0,
          successRate: 0,
          averageDuration: 0,
          callsCompleted: 0,
          callsFailed: 0,
          totalDuration: 0,
          objectivesMet: 0,
          totalObjectives: 0
        };
      }

      const { data: calls, error } = await supabase
        .from('calls')
        .select('*')
        .eq('campaign_id', campaignId);

      if (error) {
        console.error('Error fetching campaign analytics:', error);
        throw error;
      }

      const totalCalls = calls?.length || 0;
      const callsCompleted = calls?.filter(call => call.status === 'completed').length || 0;
      const callsFailed = calls?.filter(call => call.status === 'failed').length || 0;
      const totalDuration = calls?.reduce((sum, call) => sum + (call.duration || 0), 0) || 0;
      const averageDuration = totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0;
      
      // Calculate objectives
      const callsWithObjectives = calls?.filter(call => call.objective_met !== null) || [];
      const objectivesMet = calls?.filter(call => call.objective_met === true).length || 0;
      const totalObjectives = callsWithObjectives.length;
      
      // Calculate success rate based on completed calls with positive outcomes or met objectives
      const successfulCalls = calls?.filter(call => 
        call.status === 'completed' && 
        (call.outcome === 'positive' || call.objective_met === true)
      ).length || 0;
      
      const successRate = callsCompleted > 0 ? Math.round((successfulCalls / callsCompleted) * 100) : 0;

      return {
        totalCalls,
        successRate,
        averageDuration,
        callsCompleted,
        callsFailed,
        totalDuration,
        objectivesMet,
        totalObjectives
      };
    },
    enabled: !!user?.id && !!campaignId,
    staleTime: 30000, // Cache for 30 seconds
  });
};
