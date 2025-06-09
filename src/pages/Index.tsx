import { useState } from 'react';
import { Home, Users, FileText, Phone, Settings, BarChart3, Plus, Database } from 'lucide-react';
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

const Index = () => {
  const [activeTab, setActiveTab] = useState('agents');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [contactsView, setContactsView] = useState<'list' | 'create'>('list');
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
      firstMessage: 'Hello! How can I help you with your dental needs today?'
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
      firstMessage: 'Hi! I\'m here to help with any questions you have.'
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
    { id: 'knowledge-base', label: 'Knowledge Base', icon: Database },
    { id: 'phone', label: 'Phone Number', icon: Phone },
    { id: 'integrations', label: 'Integrations', icon: Settings },
    { id: 'call-logs', label: 'Call Logs', icon: BarChart3 },
    { id: 'campaigns', label: 'Campaigns', icon: BarChart3 },
  ];

  const handleAgentCreated = (newAgent: Agent) => {
    setAgents(prev => [...prev, newAgent]);
    setSelectedAgent(newAgent);
  };

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900">awer</span>
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

        {/* Upgrade Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">Upgrade to <Badge variant="secondary" className="bg-purple-100 text-purple-700">Propel</Badge></div>
            <div className="text-lg font-bold text-gray-900 mb-1">Ignite</div>
            <div className="text-sm text-gray-600 mb-3">1,980 Credit Left</div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Upgrade Plan
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {activeTab === 'agents' && !selectedAgent && (
          <CreateAgentFlow onAgentCreated={handleAgentCreated} />
        )}

        {activeTab === 'agents' && selectedAgent && (
          <>
            {/* Agent List */}
            <div className="w-80 bg-white border-r border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">All Agents</h2>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedAgent(null)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                {agents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => handleSelectAgent(agent)}
                    className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                      selectedAgent?.id === agent.id
                        ? 'bg-purple-50 border border-purple-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{agent.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Agent Configuration */}
            <div className="flex-1">
              <AgentConfiguration selectedAgent={selectedAgent} />
            </div>
          </>
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

        {activeTab === 'home' && (
          <div className="flex-1 p-6">
            <DashboardStats />
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome to your Voice Agents Dashboard</CardTitle>
                  <CardDescription>Manage your ElevenLabs voice agents from here</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Select "Agents" from the sidebar to get started with configuring your voice agents.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'call-logs' && (
          <div className="flex-1">
            <ConversationInterface />
          </div>
        )}

        {/* Default content for other tabs */}
        {!['agents', 'home', 'call-logs', 'contacts'].includes(activeTab) && (
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
