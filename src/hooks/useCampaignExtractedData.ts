
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ExtractedDataField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date';
  description?: string;
  required?: boolean;
}

export interface CallExtractedData {
  call_id: string;
  contact_name: string;
  phone: string;
  started_at: string;
  duration: number;
  status: string;
  extracted_data: Record<string, any>;
}

export interface CampaignExtractedDataResponse {
  campaign: {
    id: string;
    name: string;
    extracted_data_config: ExtractedDataField[];
  };
  calls: CallExtractedData[];
  total_calls: number;
  fields_configured: number;
}

export const useCampaignExtractedData = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaign-extracted-data', campaignId],
    queryFn: async (): Promise<CampaignExtractedDataResponse> => {
      if (!campaignId) {
        throw new Error('Campaign ID is required');
      }

      const { data, error } = await supabase.functions.invoke('get-campaign-extracted-data', {
        body: { campaign_id: campaignId }
      });

      if (error) {
        console.error('Error fetching campaign extracted data:', error);
        throw error;
      }

      return data;
    },
    enabled: !!campaignId,
    staleTime: 30000, // Cache for 30 seconds
  });
};
