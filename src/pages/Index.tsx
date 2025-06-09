
import { useState } from 'react';
import { Mic, Settings, BarChart3, Users, Phone, PhoneOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AgentConfiguration from '@/components/AgentConfiguration';
import ConversationInterface from '@/components/ConversationInterface';
import DashboardStats from '@/components/DashboardStats';
import AgentList from '@/components/AgentList';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAgent, setSelectedAgent] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Voice Agents Dashboard</h1>
            <p className="text-slate-300">Manage and configure your ElevenLabs voice agents</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
              System Online
            </Badge>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="agents" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Agents
            </TabsTrigger>
            <TabsTrigger value="configure" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </TabsTrigger>
            <TabsTrigger value="conversation" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Mic className="w-4 h-4 mr-2" />
              Live Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardStats />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-slate-400">Latest conversations and agent interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-white">Agent Sarah</p>
                            <p className="text-xs text-slate-400">Customer support conversation</p>
                          </div>
                        </div>
                        <span className="text-xs text-slate-400">2 min ago</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                  <CardDescription className="text-slate-400">Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white">
                    <Mic className="w-4 h-4 mr-2" />
                    Start New Conversation
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-800">
                    <Users className="w-4 h-4 mr-2" />
                    Create New Agent
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-800">
                    <Settings className="w-4 h-4 mr-2" />
                    Agent Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agents">
            <AgentList onSelectAgent={setSelectedAgent} />
          </TabsContent>

          <TabsContent value="configure">
            <AgentConfiguration selectedAgent={selectedAgent} />
          </TabsContent>

          <TabsContent value="conversation">
            <ConversationInterface />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
