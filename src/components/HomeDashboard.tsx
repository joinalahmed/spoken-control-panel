import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Clock, DollarSign, Users, Calendar, Bell, Search, ChevronRight, TrendingUp } from 'lucide-react';
import { useAgents } from '@/hooks/useAgents';
import { useContacts } from '@/hooks/useContacts';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useCustomVoices } from '@/hooks/useCustomVoices';
import { useAuth } from '@/contexts/AuthContext';

const HomeDashboard = () => {
  const { user } = useAuth();
  const { agents } = useAgents();
  const { contacts } = useContacts();
  const { campaigns } = useCampaigns();
  const { voices: customVoices } = useCustomVoices();
  const [selectedPeriod, setSelectedPeriod] = useState('This month');

  // Calculate real stats from data
  const activeAgents = agents.filter(agent => agent.status === 'active').length;
  const totalAgents = agents.length;
  const totalContacts = contacts.length;
  const activeCampaigns = campaigns.filter(campaign => campaign.status === 'active').length;
  const totalCampaigns = campaigns.length;

  // Mock call data - in a real app, this would come from a calls API
  const totalCallMinutes = 0; // This would be calculated from actual call data
  const numberOfCalls = 0;

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User';

  const getVoiceName = (voiceId: string) => {
    const voice = customVoices?.find(v => v.voice_id === voiceId);
    return voice?.voice_name || voiceId;
  };

  const callsOverview = [
    {
      title: totalCallMinutes.toString(),
      subtitle: 'Total Call Minutes',
      change: 'Based on your calls',
      icon: Phone,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      title: numberOfCalls.toString(),
      subtitle: 'Number of calls',
      change: 'All time total',
      icon: Phone,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/20'
    }
  ];

  const systemOverview = [
    {
      title: totalAgents.toString(),
      subtitle: 'Total Agents',
      active: activeAgents,
      icon: Users,
      color: 'text-blue-400'
    },
    {
      title: totalContacts.toString(),
      subtitle: 'Total Contacts',
      active: totalContacts,
      icon: Users,
      color: 'text-green-400'
    },
    {
      title: totalCampaigns.toString(),
      subtitle: 'Total Campaigns',
      active: activeCampaigns,
      icon: Calendar,
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hello, {userName} 👋</h1>
          <p className="text-gray-600">Your AI-powered calling platform at a glance</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search...
          </Button>
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option>This month</option>
            <option>Last month</option>
            <option>This year</option>
          </select>
        </div>
      </div>

      {/* System Overview */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {systemOverview.map((stat, index) => (
            <Card key={index} className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-gray-100">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <Badge variant="secondary">{stat.active} active</Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">{stat.title}</div>
                  <div className="text-sm text-gray-600">{stat.subtitle}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Calls Overview */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Calls Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {callsOverview.map((stat, index) => (
            <Card key={index} className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">{stat.title}</div>
                  <div className="text-sm text-gray-600">{stat.subtitle}</div>
                  <div className="text-xs text-gray-500">{stat.change}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Agents */}
        <div className="lg:col-span-2">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Your Agents</CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {agents.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500 pb-2 border-b">
                    <span>Agent Name</span>
                    <span>Voice</span>
                    <span>Status</span>
                    <span>Conversations</span>
                  </div>
                  {agents.slice(0, 5).map((agent, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 text-sm py-3 border-b border-gray-100 last:border-0">
                      <span className="font-medium text-gray-900">{agent.name}</span>
                      <span className="text-gray-600">{getVoiceName(agent.voice)}</span>
                      <span className={`text-sm ${agent.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                        <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                          {agent.status}
                        </Badge>
                      </span>
                      <span className="text-gray-600">{agent.conversations}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No agents created yet</p>
                  <p className="text-sm">Create your first agent to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{activeAgents}</div>
                    <div className="text-sm text-gray-600">Active Agents</div>
                    <div className="text-xs text-gray-500">
                      {totalAgents - activeAgents} inactive
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{activeCampaigns}</div>
                    <div className="text-sm text-gray-600">Active Campaigns</div>
                    <div className="text-xs text-gray-500">
                      {totalCampaigns - activeCampaigns} inactive
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          {/* Getting Started */}
          {totalAgents === 0 && (
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Getting Started</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Create your first agent to start making calls and managing conversations.
                </p>
                <Button size="sm" className="w-full">
                  Create Agent
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
