
import { useAgents, Agent } from '@/hooks/useAgents';
import { Contact, useContacts } from '@/hooks/useContacts';
import { KbsItem } from '@/hooks/useKbs';
import { useCampaigns } from '@/hooks/useCampaigns';

interface DashboardState {
  setSelectedAgent: (agent: Agent | null) => void;
  setShowCreateAgent: (show: boolean) => void;
  setContactsView: (view: 'list' | 'create') => void;
  setEditingContact: (contact: Contact | null) => void;
  setViewingContact: (contact: Contact | null) => void;
  setKbsView: (view: 'list' | 'create') => void;
  setCampaignsView: (view: 'overview' | 'create' | 'details' | 'call-details') => void;
  setSelectedCampaignId: (id: string | null) => void;
  setSelectedCallId: (id: string | null) => void;
}

export const useDashboardHandlers = (state: DashboardState) => {
  const { createAgent, updateAgent } = useAgents();
  const { createContact } = useContacts();
  const { createCampaign } = useCampaigns();

  const handleAgentCreated = async (agentData: any) => {
    try {
      console.log('Creating agent with data:', agentData);
      
      const mappedAgentData = {
        name: agentData.name,
        voice: agentData.voice || 'Sarah',
        status: 'inactive' as const,
        conversations: 0,
        last_active: null,
        description: agentData.description || null,
        system_prompt: agentData.systemPrompt || null,
        first_message: agentData.firstMessage || null,
        knowledge_base_id: null,
        company: agentData.company || null,
        agent_type: agentData.agentType || 'outbound' as 'inbound' | 'outbound'
      };

      console.log('Mapped agent data:', mappedAgentData);
      
      const createdAgent = await createAgent.mutateAsync(mappedAgentData);
      state.setShowCreateAgent(false);
      state.setSelectedAgent(createdAgent);
    } catch (error) {
      console.error('Error creating agent:', error);
    }
  };

  const handleAgentUpdated = async (agentData: any, selectedAgent: Agent) => {
    if (!selectedAgent) return;
    
    try {
      console.log('Updating agent with data:', agentData);
      
      const mappedAgentData = {
        id: selectedAgent.id,
        name: agentData.name,
        voice: agentData.voice,
        description: agentData.description || null,
        system_prompt: agentData.systemPrompt || null,
        first_message: agentData.firstMessage || null,
        knowledge_base_id: agentData.knowledgeBaseId || null
      };

      console.log('Mapped agent update data:', mappedAgentData);
      
      const updatedAgent = await updateAgent.mutateAsync(mappedAgentData);
      state.setSelectedAgent(updatedAgent);
    } catch (error) {
      console.error('Error updating agent:', error);
    }
  };

  const handleContactSaved = async (contactData: any, editingContact: Contact | null) => {
    try {
      console.log('Saving contact:', contactData);
      
      const mappedContactData = {
        name: contactData.name,
        email: contactData.email || null,
        phone: contactData.phoneNumber || null,
        address: contactData.address || null,
        city: contactData.city || null,
        state: contactData.state || null,
        zip_code: contactData.zipCode || null,
        status: 'active' as const,
        last_called: null
      };

      console.log('Mapped contact data:', mappedContactData);
      
      if (editingContact) {
        console.log('Updating contact:', editingContact.id, mappedContactData);
      } else {
        await createContact.mutateAsync(mappedContactData);
      }
      
      state.setContactsView('list');
      state.setEditingContact(null);
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleCampaignSaved = async (campaignData: any) => {
    try {
      console.log('Saving campaign:', campaignData);
      
      const mappedCampaignData = {
        name: campaignData.name,
        description: campaignData.description || undefined,
        agentId: campaignData.agentId || undefined,
        contactIds: campaignData.contactIds || [],
        status: campaignData.status || 'draft'
      };

      console.log('Mapped campaign data:', mappedCampaignData);
      
      await createCampaign.mutateAsync(mappedCampaignData);
      state.setCampaignsView('overview');
    } catch (error) {
      console.error('Error saving campaign:', error);
    }
  };

  return {
    handleAgentCreated,
    handleAgentUpdated,
    handleContactSaved,
    handleCampaignSaved,
  };
};
