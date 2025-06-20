import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CampaignSettingsData } from '@/components/CampaignSettings';
import { Json } from '@/integrations/supabase/types';

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  agent_id: string | null;
  script_id: string | null;
  status: 'draft' | 'active' | 'paused' | 'completed';
  created_at: string;
  updated_at: string;
  knowledge_base_id?: string | null;
  settings?: CampaignSettingsData | null;
}

// Helper function to convert Json to CampaignSettingsData
const parseSettings = (settings: Json | null): CampaignSettingsData | null => {
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) return null;
  
  try {
    // Type assertion with runtime validation
    const parsed = settings as Record<string, any>;
    
    // Validate the structure exists before casting
    if (parsed.callScheduling && parsed.retryLogic && parsed.callBehavior) {
      return {
        campaignType: parsed.campaignType || 'outbound',
        ...parsed
      } as CampaignSettingsData;
    }
    return null;
  } catch {
    return null;
  }
};

// Helper function to convert CampaignSettingsData to Json
const stringifySettings = (settings: CampaignSettingsData | null): Json => {
  if (!settings) return null;
  
  // Convert to a plain object that matches the Json type structure
  return {
    campaignType: settings.campaignType,
    callScheduling: {
      startTime: settings.callScheduling.startTime,
      endTime: settings.callScheduling.endTime,
      timezone: settings.callScheduling.timezone,
      daysOfWeek: settings.callScheduling.daysOfWeek
    },
    retryLogic: {
      maxRetries: settings.retryLogic.maxRetries,
      retryInterval: settings.retryLogic.retryInterval,
      enableRetry: settings.retryLogic.enableRetry
    },
    callBehavior: {
      maxCallDuration: settings.callBehavior.maxCallDuration,
      recordCalls: settings.callBehavior.recordCalls,
      enableVoicemail: settings.callBehavior.enableVoicemail
    }
  } as Json;
};

export const useCampaigns = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: campaigns = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      // Remove user filtering to show all campaigns
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching campaigns:', error);
        throw error;
      }

      // Convert the data to Campaign type with proper settings parsing
      return data.map(campaign => ({
        ...campaign,
        settings: parseSettings(campaign.settings)
      })) as Campaign[];
    },
    enabled: !!user?.id, // Keep this check for authentication
  });

  const createCampaign = useMutation({
    mutationFn: async (campaignData: {
      name: string;
      description?: string;
      agentId: string;
      scriptId: string;
      knowledgeBaseId: string;
      contactIds: string[];
      status?: string;
      settings?: CampaignSettingsData;
    }) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      console.log('Creating campaign with data:', campaignData);

      // Check if trying to create an active inbound campaign when one already exists
      if (campaignData.status === 'active' && 
          campaignData.settings?.campaignType === 'inbound') {
        
        const activeInboundCampaigns = campaigns.filter(c => 
          c.status === 'active' && 
          c.settings?.campaignType === 'inbound'
        );

        if (activeInboundCampaigns.length > 0) {
          throw new Error('Only one inbound campaign can be active at a time. Please pause the existing active inbound campaign first.');
        }
      }

      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          user_id: user.id,
          name: campaignData.name,
          description: campaignData.description || null,
          agent_id: campaignData.agentId,
          script_id: campaignData.scriptId,
          status: campaignData.status || 'draft',
          knowledge_base_id: campaignData.knowledgeBaseId,
          settings: stringifySettings(campaignData.settings || null)
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
      return {
        ...data,
        settings: parseSettings(data.settings)
      } as Campaign;
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
        description: error.message || "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateCampaign = useMutation({
    mutationFn: async (campaignData: Partial<Campaign> & { id: string }) => {
      console.log('Updating campaign with data:', campaignData);
      
      // Check if trying to activate an inbound campaign when one is already active
      if (campaignData.status === 'active') {
        const currentCampaign = campaigns.find(c => c.id === campaignData.id);
        const isInboundCampaign = campaignData.settings?.campaignType === 'inbound' || 
                                 currentCampaign?.settings?.campaignType === 'inbound';
        
        if (isInboundCampaign) {
          const activeInboundCampaigns = campaigns.filter(c => 
            c.id !== campaignData.id && // Exclude current campaign
            c.status === 'active' && 
            c.settings?.campaignType === 'inbound'
          );

          if (activeInboundCampaigns.length > 0) {
            throw new Error('Only one inbound campaign can be active at a time. Please pause the existing active inbound campaign first.');
          }
        }
      }
      
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      // Only include fields that are being updated
      if (campaignData.name !== undefined) updateData.name = campaignData.name;
      if (campaignData.description !== undefined) updateData.description = campaignData.description;
      if (campaignData.agent_id !== undefined) updateData.agent_id = campaignData.agent_id;
      if (campaignData.script_id !== undefined) updateData.script_id = campaignData.script_id;
      if (campaignData.status !== undefined) updateData.status = campaignData.status;
      if (campaignData.knowledge_base_id !== undefined) updateData.knowledge_base_id = campaignData.knowledge_base_id;
      if (campaignData.settings !== undefined) updateData.settings = stringifySettings(campaignData.settings);

      const { data, error } = await supabase
        .from('campaigns')
        .update(updateData)
        .eq('id', campaignData.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating campaign:', error);
        throw error;
      }

      console.log('Campaign updated successfully:', data);
      return {
        ...data,
        settings: parseSettings(data.settings)
      } as Campaign;
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
        description: error.message || "Failed to update campaign. Please try again.",
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
