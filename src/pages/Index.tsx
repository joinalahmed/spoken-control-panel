import { useState } from 'react';
import { Home, Users, FileText, Settings, BarChart3, LogOut, Heart, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Agent } from '@/hooks/useAgents';
import { Contact } from '@/hooks/useContacts';
import { KnowledgeBaseItem } from '@/hooks/useKnowledgeBase';
import AgentConfiguration from '@/components/AgentConfiguration';
import ConversationInterface from '@/components/ConversationInterface';
import AgentList from '@/components/AgentList';
import CreateAgentFlow from '@/components/CreateAgentFlow';
import ContactsList from '@/components/ContactsList';
import CreateContactForm from '@/components/CreateContactForm';
import KnowledgeBaseList from '@/components/KnowledgeBaseList';
import CreateKnowledgeBaseForm from '@/components/CreateKnowledgeBaseForm';
import HomeDashboard from '@/components/HomeDashboard';

const Index = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('agents');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [contactsView, setContactsView] = useState<'list' | 'create'>('list');
  const [knowledgeBaseView, setKnowledgeBaseView] = useState<'list' | 'create'>('list');

  const sidebarItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'agents', label: 'Agents', icon: Users },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'files', label: 'Files', icon: FileText },
    { id: 'integrations', label: 'Integrations', icon: Settings },
    { id: 'call-logs', label: 'Call Logs', icon: BarChart3 },
    { id: 'campaigns', label: 'Campaigns', icon: BarChart3 },
  ];

  const handleAgentCreated = (newAgent: Agent) => {
    setShowCreateAgent(false);
    setSelectedAgent(newAgent);
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
    setContactsView('create');
  };

  const handleContactSaved = (contactData: any) => {
    console.log('Contact saved:', contactData);
    setContactsView('list');
  };

  const handleEditContact = (contact: Contact) => {
    console.log('Edit contact:', contact);
    setContactsView('create');
  };

  const handleCreateKnowledgeBaseItem = () => {
    setKnowledgeBaseView('create');
  };

  const handleKnowledgeBaseItemSaved = (itemData: any) => {
    console.log('Knowledge base item saved:', itemData);
    setKnowledgeBaseView('list');
  };

  const handleEditKnowledgeBaseItem = (item: KnowledgeBaseItem) => {
    console.log('Edit knowledge base item:', item);
    setKnowledgeBaseView('create');
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar - Always visible */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* Logo */}
          <div className="p-6">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">Dhwani</span>
                <span className="text-xs text-gray-500">Voice AI Agents Playground</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id === 'contacts') {
                    setContactsView('list');
                  }
                  if (item.id === 'files') {
                    setKnowledgeBaseView('list');
                  }
                  if (item.id === 'agents') {
                    setShowCreateAgent(false);
                    setSelectedAgent(null);
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
          <div className="p-4 border-t border-gray-200">
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
              onBack={() => setContactsView('list')}
              onSave={handleContactSaved}
            />
          )}

          {activeTab === 'files' && knowledgeBaseView === 'list' && (
            <KnowledgeBaseList 
              onCreateItem={handleCreateKnowledgeBaseItem}
              onEditItem={handleEditKnowledgeBaseItem}
            />
          )}

          {activeTab === 'files' && knowledgeBaseView === 'create' && (
            <CreateKnowledgeBaseForm 
              onBack={() => setKnowledgeBaseView('list')}
              onSave={handleKnowledgeBaseItemSaved}
            />
          )}

          {activeTab === 'call-logs' && (
            <div className="flex-1">
              <ConversationInterface />
            </div>
          )}

          {/* Default content for other tabs */}
          {!['agents', 'home', 'call-logs', 'contacts', 'files'].includes(activeTab) && (
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
      
      {/* Footer - Merged directly */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6">
        <div className="flex items-center justify-center text-sm text-gray-600">
          <span>Made with</span>
          <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" />
          <span>by Aivar Innovations</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
