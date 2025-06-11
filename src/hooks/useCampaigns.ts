
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  agent_id: string | null;
  contact_ids: string[];
  status: 'draft' | 'active' | 'paused' | 'completed';
  created_at: string;
  updated_at: string;
  knowledge_base_id?: string | null;
}

export const useCampaigns = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: campaigns = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['campaigns', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching campaigns:', error);
        throw error;
      }

      return data as Campaign[];
    },
    enabled: !!user?.id,
  });

  const createCampaign = useMutation({
    mutationFn: async (campaignData: {
      name: string;
      description?: string;
      agentId?: string;
      contactIds: string[];
      status?: string;
      knowledgeBaseId?: string;
    }) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      console.log('Creating campaign with data:', campaignData);

      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          user_id: user.id,
          name: campaignData.name,
          description: campaignData.description || null,
          agent_id: campaignData.agentId || null,
          contact_ids: campaignData.contactIds,
          status: campaignData.status || 'draft',
          knowledge_base_id: campaignData.knowledgeBaseId || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating campaign:', error);
        throw error;
      }

      // Create campaign_contacts entries
      if (campaignData.contactIds.length > 0) {
        const campaignContacts = campaignData.contactIds.map(contactId => ({
          campaign_id: data.id,
          contact_id: contactId
        }));

        const { error: contactsError } = await supabase
          .from('campaign_contacts')
          .insert(campaignContacts);

        if (contactsError) {
          console.error('Error creating campaign contacts:', contactsError);
          // Don't throw here as the campaign was created successfully
        }
      }

      console.log('Campaign created successfully:', data);
      return data as Campaign;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: "Campaign Created",
        description: `Campaign "${data.name}" has been created successfully.`,
      });
    },
    onError: (error) => {
      console.error('Campaign creation failed:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateCampaign = useMutation({
    mutationFn: async (campaignData: Partial<Campaign> & { id: string }) => {
      const { data, error } = await supabase
        .from('campaigns')
        .update({
          name: campaignData.name,
          description: campaignData.description,
          agent_id: campaignData.agent_id,
          contact_ids: campaignData.contact_ids,
          status: campaignData.status,
          knowledge_base_id: campaignData.knowledge_base_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', campaignData.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating campaign:', error);
        throw error;
      }

      return data as Campaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: "Campaign Updated",
        description: "Campaign has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Campaign update failed:', error);
      toast({
        title: "Error",
        description: "Failed to update campaign. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteCampaign = useMutation({
    mutationFn: async (campaignId: string) => {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId);

      if (error) {
        console.error('Error deleting campaign:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: "Campaign Deleted",
        description: "Campaign has been deleted successfully.",
      });
    },
    onError: (error) => {
      console.error('Campaign deletion failed:', error);
      toast({
        title: "Error",
        description: "Failed to delete campaign. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    campaigns,
    isLoading,
    error,
    createCampaign,
    updateCampaign,
    deleteCampaign,
  };
};
