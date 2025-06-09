import { useState } from 'react';
import { Home, Users, FileText, Settings, BarChart3, Plus, LogOut, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AgentConfiguration from '@/components/AgentConfiguration';
import ConversationInterface from '@/components/ConversationInterface';
import DashboardStats from '@/components/DashboardStats';
import AgentList from '@/components/AgentList';
import CreateAgentFlow from '@/components/CreateAgentFlow';
import ContactsList from '@/components/ContactsList';
import CreateContactForm from '@/components/CreateContactForm';
import KnowledgeBaseList from '@/components/KnowledgeBaseList';
import CreateKnowledgeBaseForm from '@/components/CreateKnowledgeBaseForm';
import HomeDashboard from '@/components/HomeDashboard';

interface Agent {
  id: string;
  name: string;
  voice: string;
  status: 'active' | 'inactive';
  conversations: number;
  lastActive: string;
  description: string;
  systemPrompt?: string;
  firstMessage?: string;
  knowledgeBaseId?: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: 'active' | 'inactive';
  lastCalled: string;
}

interface KnowledgeBaseItem {
  id: string;
  title: string;
  type: 'document' | 'faq' | 'guide' | 'other';
  description: string;
  dateAdded: string;
  lastModified: string;
  status: 'published' | 'draft';
  tags: string[];
}

interface IndexProps {
  onLogout: () => void;
}

const Index = ({ onLogout }: IndexProps) => {
  const [activeTab, setActiveTab] = useState('agents');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [contactsView, setContactsView] = useState<'list' | 'create'>('list');
  const [knowledgeBaseView, setKnowledgeBaseView] = useState<'list' | 'create'>('list');
  const [agents, setAgents] = useState<Agent[]>([
    { 
      id: '1', 
      name: 'Agent Name 01', 
      voice: 'Sarah', 
      status: 'active', 
      conversations: 247, 
      lastActive: '2 hours ago',
      description: 'Voice assistant for Mary\'s Dental office',
      systemPrompt: 'You are a helpful dental office assistant.',
      firstMessage: 'Hello! How can I help you with your dental needs today?',
      knowledgeBaseId: '1'
    },
    { 
      id: '2', 
      name: 'Agent Name 02', 
      voice: 'Alex', 
      status: 'inactive', 
      conversations: 156, 
      lastActive: '1 day ago',
      description: 'Customer support agent',
      systemPrompt: 'You are a customer support specialist.',
      firstMessage: 'Hi! I\'m here to help with any questions you have.',
      knowledgeBaseId: '2'
    },
    { 
      id: '3', 
      name: 'Agent Name 03', 
      voice: 'Charlotte', 
      status: 'inactive', 
      conversations: 89, 
      lastActive: '3 days ago',
      description: 'Sales assistant',
      systemPrompt: 'You are a sales assistant focused on helping customers.',
      firstMessage: 'Welcome! I\'m here to help you find what you\'re looking for.'
    },
    { 
      id: '4', 
      name: 'Agent Name 04', 
      voice: 'Brian', 
      status: 'inactive', 
      conversations: 34, 
      lastActive: '1 week ago',
      description: 'Technical support agent',
      systemPrompt: 'You are a technical support specialist.',
      firstMessage: 'Hello! I can help you with any technical issues you\'re experiencing.'
    },
    { 
      id: '5', 
      name: 'Agent Name 05', 
      voice: 'Sarah', 
      status: 'inactive', 
      conversations: 12, 
      lastActive: '2 weeks ago',
      description: 'General purpose assistant',
      systemPrompt: 'You are a helpful general purpose assistant.',
      firstMessage: 'Hi there! I\'m your assistant. How can I help you today?'
    },
  ]);

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
    setAgents(prev => [...prev, newAgent]);
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

          {/* Logout Section */}
          <div className="p-4 border-t border-gray-200">
            <Button 
              onClick={onLogout}
              variant="outline" 
              className="w-full flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
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
