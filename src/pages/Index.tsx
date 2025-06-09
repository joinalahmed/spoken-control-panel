import { useState } from 'react';
import { Home, Users, FileText, Settings, BarChart3, LogOut, Heart, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useAgents, Agent } from '@/hooks/useAgents';
import { Contact, useContacts } from '@/hooks/useContacts';
import { useKbs, KbsItem } from '@/hooks/useKbs';
import AgentConfiguration from '@/components/AgentConfiguration';
import ConversationInterface from '@/components/ConversationInterface';
import AgentList from '@/components/AgentList';
import CreateAgentFlow from '@/components/CreateAgentFlow';
import ContactsList from '@/components/ContactsList';
import CreateContactForm from '@/components/CreateContactForm';
import KbsList from '@/components/KbsList';
import CreateKbsForm from '@/components/CreateKbsForm';
import HomeDashboard from '@/components/HomeDashboard';
import CampaignsList from '@/components/CampaignsList';
import CreateCampaignForm from '@/components/CreateCampaignForm';

const Index = () => {
  const { user, signOut } = useAuth();
  const { createAgent, updateAgent } = useAgents();
  const { createContact } = useContacts();
  const [activeTab, setActiveTab] = useState('agents');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [contactsView, setContactsView] = useState<'list' | 'create'>('list');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [kbsView, setKbsView] = useState<'list' | 'create'>('list');
  const [campaignsView, setCampaignsView] = useState<'overview' | 'create' | 'call-logs'>('overview');

  const sidebarItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'agents', label: 'Agents', icon: Users },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'files', label: 'Knowledge Bases', icon: FileText },
    { id: 'campaigns', label: 'Campaigns', icon: BarChart3 },
  ];

  const handleAgentCreated = async (agentData: any) => {
    try {
      console.log('Creating agent with data:', agentData);
      
      // Map the agent data to match the database schema
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
        company: agentData.company || null
      };

      console.log('Mapped agent data:', mappedAgentData);
      
      const createdAgent = await createAgent.mutateAsync(mappedAgentData);
      setShowCreateAgent(false);
      setSelectedAgent(createdAgent);
    } catch (error) {
      console.error('Error creating agent:', error);
    }
  };

  const handleAgentUpdated = async (agentData: any) => {
    if (!selectedAgent) return;
    
    try {
      console.log('Updating agent with data:', agentData);
      
      // Map the agent data to match the database schema
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
      setSelectedAgent(updatedAgent);
    } catch (error) {
      console.error('Error updating agent:', error);
    }
  };

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

  const handleCreateContact = () => {
    setEditingContact(null);
    setContactsView('create');
  };

  const handleContactSaved = async (contactData: any) => {
    try {
      console.log('Saving contact:', contactData);
      
      // Map the form data to match the database schema
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
        // TODO: Implement update contact functionality
        console.log('Updating contact:', editingContact.id, mappedContactData);
      } else {
        await createContact.mutateAsync(mappedContactData);
      }
      
      setContactsView('list');
      setEditingContact(null);
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleEditContact = (contact: Contact) => {
    console.log('Edit contact:', contact);
    setEditingContact(contact);
    setContactsView('create');
  };

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

  const handleCreateCampaign = () => {
    setCampaignsView('create');
  };

  const handleCampaignSaved = (campaignData: any) => {
    console.log('Campaign saved:', campaignData);
    setCampaignsView('overview');
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Always visible, non-scrollable */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
        {/* Logo */}
        <div className="p-6 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">Dhwani</span>
              <span className="text-xs text-gray-500">Voice AI Agents Playground</span>
            </div>
          </div>
        </div>

        {/* Navigation - scrollable area */}
        <nav className="flex-1 px-4 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (item.id === 'contacts') {
                  setContactsView('list');
                }
                if (item.id === 'files') {
                  setKbsView('list');
                }
                if (item.id === 'agents') {
                  setShowCreateAgent(false);
                  setSelectedAgent(null);
                }
                if (item.id === 'campaigns') {
                  setCampaignsView('overview');
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg mb-1 transition-colors ${
                activeTab === item.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Menu */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium truncate">
                    {user?.user_metadata?.full_name || user?.email}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Footer in Sidebar */}
        <div className="bg-gray-50 border-t border-gray-200 py-4 px-6 flex-shrink-0">
          <div className="flex items-center justify-center text-sm text-gray-600">
            <span>Made with</span>
            <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" />
            <span>by Aivar Innovations</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {activeTab === 'home' && (
          <HomeDashboard />
        )}

        {activeTab === 'agents' && !showCreateAgent && !selectedAgent && (
          <div className="flex-1 bg-slate-900 p-6">
            <AgentList 
              onSelectAgent={handleSelectAgent}
              onCreateAgent={handleCreateNewAgent}
            />
          </div>
        )}

        {activeTab === 'agents' && showCreateAgent && (
          <CreateAgentFlow 
            onAgentCreated={handleAgentCreated}
            onBack={handleBackToAgentsList}
          />
        )}

        {activeTab === 'agents' && selectedAgent && !showCreateAgent && (
          <AgentConfiguration 
            selectedAgent={selectedAgent} 
            onBack={handleBackToAgentsList}
            onUpdate={handleAgentUpdated}
          />
        )}

        {activeTab === 'contacts' && contactsView === 'list' && (
          <ContactsList 
            onCreateContact={handleCreateContact}
            onEditContact={handleEditContact}
          />
        )}

        {activeTab === 'contacts' && contactsView === 'create' && (
          <CreateContactForm 
            onBack={() => {
              setContactsView('list');
              setEditingContact(null);
            }}
            onSave={handleContactSaved}
            editingContact={editingContact}
          />
        )}

        {activeTab === 'files' && kbsView === 'list' && (
          <KbsList 
            onCreateItem={handleCreateKbsItem}
            onEditItem={handleEditKbsItem}
          />
        )}

        {activeTab === 'files' && kbsView === 'create' && (
          <CreateKbsForm 
            onBack={() => setKbsView('list')}
            onSave={handleKbsItemSaved}
          />
        )}

        {activeTab === 'campaigns' && campaignsView === 'overview' && (
          <CampaignsList 
            onCreateCampaign={handleCreateCampaign}
            onViewCallLogs={() => setCampaignsView('call-logs')}
          />
        )}

        {activeTab === 'campaigns' && campaignsView === 'create' && (
          <CreateCampaignForm 
            onBack={() => setCampaignsView('overview')}
            onSave={handleCampaignSaved}
          />
        )}

        {activeTab === 'campaigns' && campaignsView === 'call-logs' && (
          <div className="flex-1">
            <div className="p-6">
              <Button 
                onClick={() => setCampaignsView('overview')}
                variant="outline" 
                className="mb-4"
              >
                ← Back to Campaigns
              </Button>
            </div>
            <ConversationInterface />
          </div>
        )}

        {/* Default content for other tabs */}
        {!['agents', 'home', 'campaigns', 'contacts', 'files'].includes(activeTab) && (
          <div className="flex-1 p-6">
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

export default Index;
