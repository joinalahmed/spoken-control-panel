
import { useState } from 'react';
import { Home, Users, FileText, Settings, BarChart3, LogOut, Heart, User, FileType } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useAgents, Agent } from '@/hooks/useAgents';
import { Contact, useContacts } from '@/hooks/useContacts';
import { useKbs, KbsItem } from '@/hooks/useKbs';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useScripts, Script } from '@/hooks/useScripts';
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
import CampaignDetails from '@/components/CampaignDetails';
import ViewContactModal from '@/components/ViewContactModal';
import CallDetails from '@/components/CallDetails';
import ScriptsList from '@/components/ScriptsList';
import CreateScriptForm from '@/components/CreateScriptForm';
import ViewScriptModal from '@/components/ViewScriptModal';

const Index = () => {
  const { user, signOut } = useAuth();
  const { agents, createAgent, updateAgent } = useAgents();
  const { createContact } = useContacts();
  const { createCampaign, campaigns } = useCampaigns();
  const { createScript, updateScript } = useScripts();
  
  const [activeTab, setActiveTab] = useState('home');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [contactsView, setContactsView] = useState<'list' | 'create'>('list');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);
  const [kbsView, setKbsView] = useState<'list' | 'create'>('list');
  const [editingKbsItem, setEditingKbsItem] = useState<KbsItem | null>(null);
  const [campaignsView, setCampaignsView] = useState<'overview' | 'create' | 'details' | 'call-details'>('overview');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const [scriptView, setScriptView] = useState<'list' | 'create'>('list');
  const [editingScript, setEditingScript] = useState<Script | null>(null);
  const [viewingScript, setViewingScript] = useState<Script | null>(null);

  const sidebarItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'agents', label: 'Agents', icon: Users },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'files', label: 'Knowledge Bases', icon: FileText },
    { id: 'script', label: 'Script', icon: FileType },
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
        company: agentData.company || null,
        agent_type: agentData.agentType || 'outbound' as 'inbound' | 'outbound',
        script_id: null
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
        knowledge_base_id: agentData.knowledgeBaseId || null,
        script_id: agentData.scriptId || null
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

  const handleViewContact = (contact: Contact) => {
    setViewingContact(contact);
  };

  const handleCreateKbsItem = () => {
    setEditingKbsItem(null);
    setKbsView('create');
  };

  const handleKbsItemSaved = (itemData: any) => {
    console.log('KBS item saved:', itemData);
    setKbsView('list');
    setEditingKbsItem(null);
  };

  const handleEditKbsItem = (item: KbsItem) => {
    console.log('Edit KBS item:', item);
    setEditingKbsItem(item);
    setKbsView('create');
  };

  const handleCreateCampaign = () => {
    setCampaignsView('create');
  };

  const handleCampaignSaved = async (campaignData: any) => {
    try {
      console.log('Saving campaign:', campaignData);
      
      // Map the campaign data to match the database schema
      const mappedCampaignData = {
        name: campaignData.name,
        description: campaignData.description || undefined,
        agentId: campaignData.agentId,
        scriptId: campaignData.scriptId,
        knowledgeBaseId: campaignData.knowledgeBaseId,
        contactIds: campaignData.contactIds || [],
        status: campaignData.status || 'draft',
        settings: campaignData.settings || undefined
      };

      console.log('Mapped campaign data:', mappedCampaignData);
      
      await createCampaign.mutateAsync(mappedCampaignData);
      setCampaignsView('overview');
    } catch (error) {
      console.error('Error saving campaign:', error);
    }
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

  const handleLogout = async () => {
    await signOut();
  };

  const handleCreateScript = () => {
    setEditingScript(null);
    setScriptView('create');
  };

  const handleScriptSaved = async (scriptData: any) => {
    try {
      console.log('Saving script:', scriptData);
      
      // Map the script data to match the database schema
      const mappedScriptData = {
        name: scriptData.name,
        description: scriptData.description || null,
        voice: scriptData.voice || 'Sarah',
        agent_type: scriptData.agentType || 'outbound' as 'inbound' | 'outbound',
        first_message: scriptData.firstMessage || null,
        company: scriptData.company || null,
        sections: scriptData.sections || []
      };

      console.log('Mapped script data:', mappedScriptData);
      
      if (editingScript) {
        // Transform the script sections to match the form format
        let transformedSections = [];
        
        if (scriptData.sections && Array.isArray(scriptData.sections)) {
          transformedSections = scriptData.sections.map((section: any, index: number) => {
            // If section has steps array, convert to steps format expected by form
            const steps = section.steps ? section.steps.map((step: any) => step.content || step.title || '') : [];
            
            return {
              id: section.id || Date.now().toString() + index,
              title: section.title || '',
              content: section.content || section.description || '',
              steps: steps
            };
          });
        }
        
        // Create a transformed script object for editing
        const transformedScript = {
          ...scriptData,
          sections: transformedSections
        };
        
        console.log('Transformed script for editing:', transformedScript);
        const updatedScriptData = {
          id: editingScript.id,
          ...transformedScript
        };
        await updateScript.mutateAsync(updatedScriptData);
      } else {
        await createScript.mutateAsync(mappedScriptData);
      }
      
      setScriptView('list');
      setEditingScript(null);
    } catch (error) {
      console.error('Error saving script:', error);
    }
  };

  const handleEditScript = (script: Script) => {
    console.log('Edit script:', script);
    
    // Transform the script sections to match the form format
    let transformedSections = [];
    
    if (script.sections && Array.isArray(script.sections)) {
      transformedSections = script.sections.map((section: any, index: number) => {
        // Handle the steps array properly for editing
        let steps = [];
        
        if (section.steps && Array.isArray(section.steps)) {
          // For editing, we need to extract the content/title from step objects
          steps = section.steps.map((step: any) => {
            if (typeof step === 'string') {
              return step;
            } else if (step && typeof step === 'object') {
              // For complex step objects, combine title and content meaningfully
              if (step.title && step.content) {
                return `${step.title}: ${step.content}`;
              } else if (step.content) {
                return step.content;
              } else if (step.title) {
                return step.title;
              } else {
                return step.description || '';
              }
            }
            return '';
          });
        }
        
        return {
          id: section.id || Date.now().toString() + index,
          title: section.title || section.description || '',
          content: section.description || section.content || '',
          steps: steps
        };
      });
    }
    
    // Create a transformed script object for editing
    const transformedScript = {
      ...script,
      sections: transformedSections
    };
    
    console.log('Transformed script for editing:', transformedScript);
    setEditingScript(transformedScript);
    setScriptView('create');
  };

  const handleViewScript = (script: Script) => {
    console.log('View script:', script);
    setViewingScript(script);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Sidebar - Fixed height and proper overflow handling */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-10">
        {/* Logo - Fixed at top */}
        <div className="p-6 flex-shrink-0 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">D</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">Dhwani</span>
              <span className="text-xs text-gray-500">Voice AI Agents Playground</span>
            </div>
          </div>
        </div>

        {/* Navigation - Scrollable middle section */}
        <div className="flex-1 overflow-y-auto">
          <nav className="px-4 py-4">
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
                    setEditingKbsItem(null);
                  }
                  if (item.id === 'agents') {
                    setShowCreateAgent(false);
                    setSelectedAgent(null);
                  }
                  if (item.id === 'campaigns') {
                    setCampaignsView('overview');
                  }
                  if (item.id === 'script') {
                    setScriptView('list');
                    setEditingScript(null);
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
        </div>

        {/* User Menu - Fixed at bottom */}
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

        {/* Footer in Sidebar - Fixed at very bottom */}
        <div className="bg-gray-50 border-t border-gray-200 py-3 px-6 flex-shrink-0">
          <div className="flex items-center justify-center text-xs text-gray-500">
            <span>Made with</span>
            <Heart className="w-3 h-3 mx-1 text-red-500 fill-current" />
            <span>by Aivar Innovations</span>
          </div>
        </div>
      </div>

      {/* Main Content - With proper margin for fixed sidebar */}
      <div className="flex-1 ml-64 h-screen overflow-hidden">
        <div className="h-full overflow-y-auto">
          {activeTab === 'home' && (
            <HomeDashboard />
          )}

          {activeTab === 'agents' && !showCreateAgent && !selectedAgent && (
            <div className="h-full p-6 overflow-y-auto">
              <AgentList 
                onSelectAgent={handleSelectAgent}
                onCreateAgent={handleCreateNewAgent}
              />
            </div>
          )}

          {activeTab === 'agents' && showCreateAgent && (
            <div className="h-full overflow-y-auto">
              <CreateAgentFlow 
                onAgentCreated={handleAgentCreated}
                onBack={handleBackToAgentsList}
              />
            </div>
          )}

          {activeTab === 'agents' && selectedAgent && !showCreateAgent && (
            <div className="h-full overflow-y-auto">
              <AgentConfiguration 
                selectedAgent={selectedAgent} 
                onBack={handleBackToAgentsList}
                onUpdate={handleAgentUpdated}
              />
            </div>
          )}

          {activeTab === 'contacts' && contactsView === 'list' && (
            <div className="h-full overflow-y-auto">
              <ContactsList 
                onCreateContact={handleCreateContact}
                onEditContact={handleEditContact}
                onViewContact={handleViewContact}
              />
              <ViewContactModal 
                contact={viewingContact}
                isOpen={!!viewingContact}
                onClose={() => setViewingContact(null)}
              />
            </div>
          )}

          {activeTab === 'contacts' && contactsView === 'create' && (
            <div className="h-full overflow-y-auto">
              <CreateContactForm 
                onBack={() => {
                  setContactsView('list');
                  setEditingContact(null);
                }}
                onSave={handleContactSaved}
                editingContact={editingContact}
              />
            </div>
          )}

          {activeTab === 'files' && kbsView === 'list' && (
            <div className="h-full overflow-y-auto">
              <KbsList 
                onCreateItem={handleCreateKbsItem}
                onEditItem={handleEditKbsItem}
              />
            </div>
          )}

          {activeTab === 'files' && kbsView === 'create' && (
            <div className="h-full overflow-y-auto">
              <CreateKbsForm 
                onBack={() => {
                  setKbsView('list');
                  setEditingKbsItem(null);
                }}
                onSave={handleKbsItemSaved}
                editingItem={editingKbsItem}
              />
            </div>
          )}

          {activeTab === 'script' && scriptView === 'list' && (
            <div className="h-full overflow-y-auto">
              <ScriptsList 
                onCreateScript={handleCreateScript}
                onEditScript={handleEditScript}
                onViewScript={handleViewScript}
              />
              <ViewScriptModal 
                script={viewingScript}
                isOpen={!!viewingScript}
                onClose={() => setViewingScript(null)}
              />
            </div>
          )}

          {activeTab === 'script' && scriptView === 'create' && (
            <div className="h-full overflow-y-auto">
              <CreateScriptForm 
                onBack={() => {
                  setScriptView('list');
                  setEditingScript(null);
                }}
                onSave={handleScriptSaved}
                editingScript={editingScript}
              />
            </div>
          )}

          {activeTab === 'campaigns' && campaignsView === 'overview' && (
            <div className="h-full overflow-y-auto">
              <CampaignsList 
                onCreateCampaign={handleCreateCampaign}
                onSelectCampaign={handleSelectCampaign}
              />
            </div>
          )}

          {activeTab === 'campaigns' && campaignsView === 'create' && (
            <div className="h-full overflow-y-auto">
              <CreateCampaignForm 
                onBack={() => setCampaignsView('overview')}
                onSave={handleCampaignSaved}
              />
            </div>
          )}

          {activeTab === 'campaigns' && campaignsView === 'details' && selectedCampaignId && (
            <div className="h-full overflow-y-auto">
              <CampaignDetails 
                campaign={campaigns.find(c => c.id === selectedCampaignId)!}
                onBack={() => setCampaignsView('overview')}
                onCallClick={handleCallClick}
              />
            </div>
          )}

          {activeTab === 'campaigns' && campaignsView === 'call-details' && selectedCallId && (
            <div className="h-full overflow-y-auto">
              <CallDetails 
                callId={selectedCallId}
                onBack={handleBackToCampaignDetails}
              />
            </div>
          )}

          {/* Default content for other tabs */}
          {!['agents', 'home', 'campaigns', 'contacts', 'files', 'script'].includes(activeTab) && (
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
    </div>
  );
};

export default Index;
