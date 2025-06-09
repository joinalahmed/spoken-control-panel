
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Agent } from '@/hooks/useAgents';
import { Contact } from '@/hooks/useContacts';
import { KbsItem } from '@/hooks/useKbs';
import AgentConfiguration from '@/components/AgentConfiguration';
import AgentList from '@/components/AgentList';
import CreateAgentFlow from '@/components/CreateAgentFlow';
import ContactsList from '@/components/ContactsList';
import CreateContactForm from '@/components/CreateContactForm';
import KbsList from '@/components/KbsList';
import CreateKbsForm from '@/components/CreateKbsForm';
import HomeDashboard from '@/components/HomeDashboard';
import CampaignsList from '@/components/CampaignsList';
import CreateCampaignForm from '@/components/CreateCampaignForm';
import CampaignDetails from '@/components/CampaignDetails';
import ViewContactModal from '@/components/ViewContactModal';
import CallDetails from '@/components/CallDetails';

interface MainContentProps {
  activeTab: string;
  showCreateAgent: boolean;
  selectedAgent: Agent | null;
  contactsView: 'list' | 'create';
  editingContact: Contact | null;
  viewingContact: Contact | null;
  kbsView: 'list' | 'create';
  campaignsView: 'overview' | 'create' | 'details' | 'call-details';
  selectedCampaignId: string | null;
  selectedCallId: string | null;
  campaigns: any[];
  onSelectAgent: (agent: Agent) => void;
  onCreateAgent: () => void;
  onBackToAgentsList: () => void;
  onAgentCreated: (agentData: any) => void;
  onAgentUpdated: (agentData: any) => void;
  onCreateContact: () => void;
  onEditContact: (contact: Contact) => void;
  onViewContact: (contact: Contact) => void;
  onContactSaved: (contactData: any) => void;
  onContactsViewChange: (view: 'list' | 'create') => void;
  onCreateKbsItem: () => void;
  onEditKbsItem: (item: KbsItem) => void;
  onKbsItemSaved: (itemData: any) => void;
  onKbsViewChange: (view: 'list' | 'create') => void;
  onCreateCampaign: () => void;
  onCampaignSaved: (campaignData: any) => void;
  onSelectCampaign: (campaignId: string) => void;
  onCallClick: (callId: string) => void;
  onBackToCampaignDetails: () => void;
  onCampaignsViewChange: (view: 'overview' | 'create' | 'details' | 'call-details') => void;
  onCloseViewContact: () => void;
}

const MainContent = ({
  activeTab,
  showCreateAgent,
  selectedAgent,
  contactsView,
  editingContact,
  viewingContact,
  kbsView,
  campaignsView,
  selectedCampaignId,
  selectedCallId,
  campaigns,
  onSelectAgent,
  onCreateAgent,
  onBackToAgentsList,
  onAgentCreated,
  onAgentUpdated,
  onCreateContact,
  onEditContact,
  onViewContact,
  onContactSaved,
  onContactsViewChange,
  onCreateKbsItem,
  onEditKbsItem,
  onKbsItemSaved,
  onKbsViewChange,
  onCreateCampaign,
  onCampaignSaved,
  onSelectCampaign,
  onCallClick,
  onBackToCampaignDetails,
  onCampaignsViewChange,
  onCloseViewContact
}: MainContentProps) => {
  return (
    <div className="flex-1 ml-64 h-screen overflow-hidden">
      <div className="h-full overflow-y-auto">
        {activeTab === 'home' && (
          <HomeDashboard />
        )}

        {activeTab === 'agents' && !showCreateAgent && !selectedAgent && (
          <div className="h-full p-6 overflow-y-auto">
            <AgentList 
              onSelectAgent={onSelectAgent}
              onCreateAgent={onCreateAgent}
            />
          </div>
        )}

        {activeTab === 'agents' && showCreateAgent && (
          <div className="h-full overflow-y-auto">
            <CreateAgentFlow 
              onAgentCreated={onAgentCreated}
              onBack={onBackToAgentsList}
            />
          </div>
        )}

        {activeTab === 'agents' && selectedAgent && !showCreateAgent && (
          <div className="h-full overflow-y-auto">
            <AgentConfiguration 
              selectedAgent={selectedAgent} 
              onBack={onBackToAgentsList}
              onUpdate={onAgentUpdated}
            />
          </div>
        )}

        {activeTab === 'contacts' && contactsView === 'list' && (
          <div className="h-full overflow-y-auto">
            <ContactsList 
              onCreateContact={onCreateContact}
              onEditContact={onEditContact}
              onViewContact={onViewContact}
            />
            <ViewContactModal 
              contact={viewingContact}
              isOpen={!!viewingContact}
              onClose={onCloseViewContact}
            />
          </div>
        )}

        {activeTab === 'contacts' && contactsView === 'create' && (
          <div className="h-full overflow-y-auto">
            <CreateContactForm 
              onBack={() => {
                onContactsViewChange('list');
              }}
              onSave={onContactSaved}
              editingContact={editingContact}
            />
          </div>
        )}

        {activeTab === 'files' && kbsView === 'list' && (
          <div className="h-full overflow-y-auto">
            <KbsList 
              onCreateItem={onCreateKbsItem}
              onEditItem={onEditKbsItem}
            />
          </div>
        )}

        {activeTab === 'files' && kbsView === 'create' && (
          <div className="h-full overflow-y-auto">
            <CreateKbsForm 
              onBack={() => onKbsViewChange('list')}
              onSave={onKbsItemSaved}
            />
          </div>
        )}

        {activeTab === 'campaigns' && campaignsView === 'overview' && (
          <div className="h-full overflow-y-auto">
            <CampaignsList 
              onCreateCampaign={onCreateCampaign}
              onSelectCampaign={onSelectCampaign}
            />
          </div>
        )}

        {activeTab === 'campaigns' && campaignsView === 'create' && (
          <div className="h-full overflow-y-auto">
            <CreateCampaignForm 
              onBack={() => onCampaignsViewChange('overview')}
              onSave={onCampaignSaved}
            />
          </div>
        )}

        {activeTab === 'campaigns' && campaignsView === 'details' && selectedCampaignId && (
          <div className="h-full overflow-y-auto">
            <CampaignDetails 
              campaign={campaigns.find(c => c.id === selectedCampaignId)!}
              onBack={() => onCampaignsViewChange('overview')}
              onCallClick={onCallClick}
            />
          </div>
        )}

        {activeTab === 'campaigns' && campaignsView === 'call-details' && selectedCallId && (
          <div className="h-full overflow-y-auto">
            <CallDetails 
              callId={selectedCallId}
              onBack={onBackToCampaignDetails}
            />
          </div>
        )}

        {/* Default content for other tabs */}
        {!['agents', 'home', 'campaigns', 'contacts', 'files'].includes(activeTab) && (
          <div className="h-full overflow-y-auto p-6">
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{activeTab.replace('-', ' ')}</CardTitle>
                <CardDescription>This section is coming soon</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Feature under development</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;
