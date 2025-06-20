import React, { useState } from 'react';
import { Home, Users, FileText, Settings, BarChart3, LogOut, Heart, User, FileType, Save, Globe, Mic, Trash2, Plus, Key, RefreshCw, Eye, EyeOff, Copy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useAgents, Agent } from '@/hooks/useAgents';
import { Contact, useContacts } from '@/hooks/useContacts';
import { useKbs, KbsItem } from '@/hooks/useKbs';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useScripts, Script } from '@/hooks/useScripts';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { useCustomVoices } from '@/hooks/useCustomVoices';
import { useApiKeys } from '@/hooks/useApiKeys';
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
  const { getSetting, setSetting, isLoading: settingsLoading } = useSystemSettings();
  
  // Voice management hooks
  const { voices, createVoice, deleteVoice, isLoading: voicesLoading } = useCustomVoices();
  const [newVoiceName, setNewVoiceName] = useState('');
  const [newVoiceId, setNewVoiceId] = useState('');
  
  // API Key management hooks
  const { generateApiKey, getApiKey, revokeApiKey, isLoading: apiKeyLoading } = useApiKeys();
  const [currentApiKey, setCurrentApiKey] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  
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
  
  // Settings state
  const [outboundCallUrl, setOutboundCallUrl] = useState('');
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // Load settings when settings tab is active
  React.useEffect(() => {
    if (activeTab === 'settings' && !settingsLoaded) {
      const loadSettings = async () => {
        try {
          const savedUrl = await getSetting('outbound_call_api_url');
          if (savedUrl) {
            setOutboundCallUrl(savedUrl);
          } else {
            const defaultUrl = 'https://7263-49-207-61-173.ngrok-free.app/outbound_call';
            setOutboundCallUrl(defaultUrl);
          }
          
          // Load API key
          const apiKey = await getApiKey();
          setCurrentApiKey(apiKey);
          
          setSettingsLoaded(true);
        } catch (error) {
          console.error('Error loading system settings:', error);
          const defaultUrl = 'https://7263-49-207-61-173.ngrok-free.app/outbound_call';
          setOutboundCallUrl(defaultUrl);
          setSettingsLoaded(true);
          toast.error('Failed to load settings, using default values');
        }
      };
      loadSettings();
    }
  }, [activeTab, getSetting, getApiKey, settingsLoaded]);

  const handleSaveSettings = async () => {
    if (!outboundCallUrl.trim()) {
      toast.error('API URL cannot be empty');
      return;
    }

    try {
      new URL(outboundCallUrl);
    } catch (error) {
      toast.error('Please enter a valid URL');
      return;
    }

    console.log('Saving system setting:', outboundCallUrl);
    const success = await setSetting('outbound_call_api_url', outboundCallUrl);
    
    if (success) {
      toast.success('Settings saved successfully');
      console.log('System settings saved successfully');
    } else {
      toast.error('Failed to save settings');
      console.error('Failed to save system settings');
    }
  };

  const resetToDefault = () => {
    const defaultUrl = 'https://7263-49-207-61-173.ngrok-free.app/outbound_call';
    setOutboundCallUrl(defaultUrl);
    toast.info('Reset to default URL');
  };

  const handleAddVoice = async () => {
    if (!newVoiceName.trim() || !newVoiceId.trim()) {
      toast.error('Please enter both voice name and voice ID');
      return;
    }

    try {
      await createVoice.mutateAsync({
        voice_name: newVoiceName.trim(),
        voice_id: newVoiceId.trim()
      });
      
      setNewVoiceName('');
      setNewVoiceId('');
      toast.success('Voice added successfully');
    } catch (error) {
      console.error('Error adding voice:', error);
      toast.error('Failed to add voice');
    }
  };

  const handleDeleteVoice = async (voiceId: string, voiceName: string) => {
    try {
      await deleteVoice.mutateAsync(voiceId);
      toast.success(`Voice "${voiceName}" deleted successfully`);
    } catch (error) {
      console.error('Error deleting voice:', error);
      toast.error('Failed to delete voice');
    }
  };
  
  const sidebarItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'agents', label: 'Agents', icon: Users },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'files', label: 'Knowledge Bases', icon: FileText },
    { id: 'script', label: 'Script', icon: FileType },
    { id: 'campaigns', label: 'Campaigns', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
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
        script_id: null,
        gender: agentData.gender || null,
        languages: agentData.languages || ['en']
      };

      console.log('Mapped agent data:', mappedAgentData);
      
      const createdAgent = await createAgent.mutateAsync(mappedAgentData);
      console.log('Agent created successfully, navigating back to list');
      setShowCreateAgent(false);
      setSelectedAgent(createdAgent);
    } catch (error) {
      console.error('Error creating agent:', error);
      toast.error('Failed to create agent. Please check the console for details.');
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
        script_id: agentData.scriptId || null,
        gender: agentData.gender || null,
        languages: agentData.languages || ['en']
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
          // For editing, we need to format steps as "name: content"
          steps = section.steps.map((step: any) => {
            if (typeof step === 'string') {
              return step;
            } else if (step && typeof step === 'object') {
              // Format as "name: content" for better editing experience
              const name = step.title || step.name || 'Step';
              const content = step.content || step.description || '';
              
              if (content) {
                return `${name}: ${content}`;
              } else {
                return name;
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

  const handleGenerateApiKey = async () => {
    try {
      const newApiKey = await generateApiKey();
      setCurrentApiKey(newApiKey);
    } catch (error) {
      console.error('Error generating API key:', error);
    }
  };

  const handleRevokeApiKey = async () => {
    try {
      const success = await revokeApiKey();
      if (success) {
        setCurrentApiKey(null);
        setShowApiKey(false);
      }
    } catch (error) {
      console.error('Error revoking API key:', error);
    }
  };

  const copyApiKey = async () => {
    if (currentApiKey) {
      try {
        await navigator.clipboard.writeText(currentApiKey);
        toast.success('API key copied to clipboard');
      } catch (error) {
        toast.error('Failed to copy API key');
      }
    }
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
                  if (item.id === 'settings') {
                    setSettingsLoaded(false); // Reset to reload settings
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

          {activeTab === 'settings' && (
            <div className="h-full overflow-y-auto">
              <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                  <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Settings className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                        <p className="text-gray-600">Configure your application settings</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-6 py-8">
                  <div className="space-y-6">
                    {/* Voice Management Card - Moved to top */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Mic className="w-5 h-5" />
                          Voice Management
                          <span className="text-sm text-gray-500">
                            (Debug: {voicesLoading ? 'Loading...' : `${voices?.length || 0} voices`})
                          </span>
                        </CardTitle>
                        <CardDescription>
                          Manage custom voices for your AI agents
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Add New Voice */}
                        <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                          <h4 className="font-medium text-gray-900">Add New Voice</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="voice-name">Voice Name</Label>
                              <Input
                                id="voice-name"
                                placeholder="e.g., Professional Sarah"
                                value={newVoiceName}
                                onChange={(e) => setNewVoiceName(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="voice-id">ElevenLabs Voice ID</Label>
                              <Input
                                id="voice-id"
                                placeholder="e.g., EXAVITQu4vr4xnSDxMaL"
                                value={newVoiceId}
                                onChange={(e) => setNewVoiceId(e.target.value)}
                              />
                            </div>
                          </div>
                          <Button 
                            onClick={handleAddVoice}
                            disabled={voicesLoading || !newVoiceName.trim() || !newVoiceId.trim()}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Voice
                          </Button>
                        </div>

                        {/* Custom Voices List */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">Custom Voices</h4>
                          {voicesLoading ? (
                            <div className="text-center py-4">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2"></div>
                              <p className="text-sm text-gray-500">Loading voices...</p>
                            </div>
                          ) : voices && voices.length > 0 ? (
                            <div className="space-y-2">
                              {voices.map((voice) => (
                                <div key={voice.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                  <div>
                                    <p className="font-medium text-gray-900">{voice.voice_name}</p>
                                    <p className="text-sm text-gray-500 font-mono">{voice.voice_id}</p>
                                  </div>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteVoice(voice.id, voice.voice_name)}
                                    disabled={voicesLoading}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <Mic className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p>No custom voices added yet</p>
                              <p className="text-sm">Add your first custom voice above</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* API Key Management Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Key className="w-5 h-5" />
                          API Key Management
                        </CardTitle>
                        <CardDescription>
                          Generate and manage your personal API key for programmatic access to create agents
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {currentApiKey ? (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Your API Key</Label>
                              <div className="flex gap-2">
                                <Input
                                  type={showApiKey ? 'text' : 'password'}
                                  value={currentApiKey}
                                  readOnly
                                  className="font-mono text-sm"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setShowApiKey(!showApiKey)}
                                >
                                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={copyApiKey}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <h4 className="font-medium text-blue-900 mb-2">Usage Example</h4>
                              <code className="text-sm text-blue-800 bg-blue-100 p-2 rounded block whitespace-pre-wrap">
{`curl --location 'https://vegryoncdzcxmornresu.supabase.co/functions/v1/create-agent' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer ${showApiKey ? currentApiKey : '••••••••••••••••'}' \\
--header 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \\
--data '{
    "name": "Your Agent Name",
    "agent_type": "inbound",
    "company": "Your Company"
}'`}
                              </code>
                            </div>

                            <div className="flex gap-3">
                              <Button
                                onClick={handleGenerateApiKey}
                                disabled={apiKeyLoading}
                                variant="outline"
                              >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Regenerate Key
                              </Button>
                              <Button
                                onClick={handleRevokeApiKey}
                                disabled={apiKeyLoading}
                                variant="destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Revoke Key
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Key className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No API Key Generated</h3>
                            <p className="text-gray-600 mb-4">
                              Generate an API key to create agents programmatically from external systems
                            </p>
                            <Button
                              onClick={handleGenerateApiKey}
                              disabled={apiKeyLoading}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              <Key className="w-4 h-4 mr-2" />
                              {apiKeyLoading ? 'Generating...' : 'Generate API Key'}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* API Configuration Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="w-5 h-5" />
                          API Configuration
                        </CardTitle>
                        <CardDescription>
                          Configure the endpoints for external API services (System-wide settings)
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="outbound-call-url">Outbound Call API URL</Label>
                          <Input
                            id="outbound-call-url"
                            type="url"
                            placeholder="https://your-api-endpoint.com/outbound_call"
                            value={outboundCallUrl}
                            onChange={(e) => setOutboundCallUrl(e.target.value)}
                            className="font-mono text-sm"
                          />
                          <p className="text-sm text-gray-500">
                            The URL endpoint used for triggering outbound calls. This should point to your call service API.
                          </p>
                        </div>

                        <div className="flex gap-3">
                          <Button 
                            onClick={handleSaveSettings} 
                            disabled={settingsLoading}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {settingsLoading ? 'Saving...' : 'Save Settings'}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={resetToDefault}
                            disabled={settingsLoading}
                          >
                            Reset to Default
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* About Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle>About</CardTitle>
                        <CardDescription>
                          Application information and version details
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            <strong>Application:</strong> Dhwani Voice AI Agents
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Version:</strong> 1.0.0
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Build:</strong> {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'agents' && !showCreateAgent && !selectedAgent && (
            <div className="relative h-full overflow-y-auto">
              {/* Background Gradient */}
              <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9D6FF,#E2E2E2)] opacity-50"></div>
              </div>
              <div className="p-6 lg:p-8">
                <AgentList 
                  onSelectAgent={handleSelectAgent}
                  onCreateAgent={handleCreateNewAgent}
                />
              </div>
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
            <div className="relative h-full overflow-y-auto">
              {/* Background Gradient */}
              <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9D6FF,#E2E2E2)] opacity-50"></div>
              </div>
              <div className="p-6 lg:p-8">
                <KbsList 
                  onCreateItem={handleCreateKbsItem}
                  onEditItem={handleEditKbsItem}
                />
              </div>
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
          {!['agents', 'home', 'campaigns', 'contacts', 'files', 'script', 'settings'].includes(activeTab) && (
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
