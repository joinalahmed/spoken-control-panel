
import { useCampaigns } from '@/hooks/useCampaigns';
import { useDashboardState } from '@/hooks/useDashboardState';
import { useDashboardHandlers } from '@/hooks/useDashboardHandlers';
import Sidebar from '@/components/layout/Sidebar';
import MainContent from '@/components/layout/MainContent';
import { Agent } from '@/hooks/useAgents';
import { Contact } from '@/hooks/useContacts';
import { KbsItem } from '@/hooks/useKbs';

const Index = () => {
  const { campaigns } = useCampaigns();
  const {
    activeTab,
    setActiveTab,
    selectedAgent,
    setSelectedAgent,
    showCreateAgent,
    setShowCreateAgent,
    contactsView,
    setContactsView,
    editingContact,
    setEditingContact,
    viewingContact,
    setViewingContact,
    kbsView,
    setKbsView,
    campaignsView,
    setCampaignsView,
    selectedCampaignId,
    setSelectedCampaignId,
    selectedCallId,
    setSelectedCallId,
  } = useDashboardState();

  const {
    handleAgentCreated,
    handleAgentUpdated,
    handleContactSaved,
    handleCampaignSaved,
  } = useDashboardHandlers({
    setSelectedAgent,
    setShowCreateAgent,
    setContactsView,
    setEditingContact,
    setViewingContact,
    setKbsView,
    setCampaignsView,
    setSelectedCampaignId,
    setSelectedCallId,
  });

  // Agent handlers
  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowCreateAgent(false);
  };

  const handleCreateNewAgent = () => {
    setShowCreateAgent(true);
    setSelectedAgent(null);
  };

  const handleBackToAgentsList = () => {
    setShowCreateAgent(false);
    setSelectedAgent(null);
  };

  // Contact handlers
  const handleCreateContact = () => {
    setEditingContact(null);
    setContactsView('create');
  };

  const handleEditContact = (contact: Contact) => {
    console.log('Edit contact:', contact);
    setEditingContact(contact);
    setContactsView('create');
  };

  const handleViewContact = (contact: Contact) => {
    setViewingContact(contact);
  };

  // Knowledge base handlers
  const handleCreateKbsItem = () => {
    setKbsView('create');
  };

  const handleKbsItemSaved = (itemData: any) => {
    console.log('KBS item saved:', itemData);
    setKbsView('list');
  };

  const handleEditKbsItem = (item: KbsItem) => {
    console.log('Edit KBS item:', item);
    setKbsView('create');
  };

  // Campaign handlers
  const handleCreateCampaign = () => {
    setCampaignsView('create');
  };

  const handleSelectCampaign = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setCampaignsView('details');
  };

  const handleCallClick = (callId: string) => {
    setSelectedCallId(callId);
    setCampaignsView('call-details');
  };

  const handleBackToCampaignDetails = () => {
    setSelectedCallId(null);
    setCampaignsView('details');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onContactsViewChange={setContactsView}
        onKbsViewChange={setKbsView}
        onAgentViewChange={(showCreate, selectedAgent) => {
          setShowCreateAgent(showCreate);
          setSelectedAgent(selectedAgent);
        }}
        onCampaignsViewChange={setCampaignsView}
      />

      <MainContent
        activeTab={activeTab}
        showCreateAgent={showCreateAgent}
        selectedAgent={selectedAgent}
        contactsView={contactsView}
        editingContact={editingContact}
        viewingContact={viewingContact}
        kbsView={kbsView}
        campaignsView={campaignsView}
        selectedCampaignId={selectedCampaignId}
        selectedCallId={selectedCallId}
        campaigns={campaigns}
        onSelectAgent={handleSelectAgent}
        onCreateAgent={handleCreateNewAgent}
        onBackToAgentsList={handleBackToAgentsList}
        onAgentCreated={handleAgentCreated}
        onAgentUpdated={(agentData) => handleAgentUpdated(agentData, selectedAgent!)}
        onCreateContact={handleCreateContact}
        onEditContact={handleEditContact}
        onViewContact={handleViewContact}
        onContactSaved={(contactData) => handleContactSaved(contactData, editingContact)}
        onContactsViewChange={setContactsView}
        onCreateKbsItem={handleCreateKbsItem}
        onEditKbsItem={handleEditKbsItem}
        onKbsItemSaved={handleKbsItemSaved}
        onKbsViewChange={setKbsView}
        onCreateCampaign={handleCreateCampaign}
        onCampaignSaved={handleCampaignSaved}
        onSelectCampaign={handleSelectCampaign}
        onCallClick={handleCallClick}
        onBackToCampaignDetails={handleBackToCampaignDetails}
        onCampaignsViewChange={setCampaignsView}
        onCloseViewContact={() => setViewingContact(null)}
      />
    </div>
  );
};

export default Index;
