
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Clock, DollarSign, Users, Calendar, Bell, Search, ChevronRight, TrendingUp, Activity, Target } from 'lucide-react';
import { useAgents } from '@/hooks/useAgents';
import { useContacts } from '@/hooks/useContacts';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useCustomVoices } from '@/hooks/useCustomVoices';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface HomeDashboardProps {
  onNavigateToTab?: (tab: string) => void;
}

const HomeDashboard = ({ onNavigateToTab }: HomeDashboardProps) => {
  const { user } = useAuth();
  const { agents } = useAgents();
  const { contacts } = useContacts();
  const { campaigns } = useCampaigns();
  const { voices: customVoices } = useCustomVoices();
  const [selectedPeriod, setSelectedPeriod] = useState('This month');

  // Fetch call statistics from database
  const { data: callStats } = useQuery({
    queryKey: ['call-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('calls')
        .select('duration, status, created_at')
        .eq('user_id', user.id);

      if (error) throw error;

      const totalCalls = data.length;
      const totalMinutes = data.reduce((sum, call) => sum + (call.duration || 0), 0);
      const completedCalls = data.filter(call => call.status === 'completed').length;
      const successRate = totalCalls > 0 ? (completedCalls / totalCalls) * 100 : 0;

      return {
        totalCalls,
        totalMinutes,
        successRate: Math.round(successRate)
      };
    },
    enabled: !!user?.id,
  });

  // Calculate real stats from data
  const activeAgents = agents.filter(agent => agent.status === 'active').length;
  const totalAgents = agents.length;
  const totalContacts = contacts.length;
  const activeCampaigns = campaigns.filter(campaign => campaign.status === 'active').length;
  const totalCampaigns = campaigns.length;

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User';

  const getVoiceName = (voiceId: string) => {
    const voice = customVoices?.find(v => v.voice_id === voiceId);
    return voice?.voice_name || voiceId;
  };

  // Format time duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  // Main metrics cards
  const mainMetrics = [
    {
      title: 'Total Calls',
      value: callStats?.totalCalls?.toString() || '0',
      description: 'All time calls',
      change: `${callStats?.successRate || 0}% success rate`,
      icon: Phone,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Call Minutes',
      value: formatDuration(callStats?.totalMinutes || 0),
      description: 'Total conversation time',
      change: `${callStats?.totalMinutes || 0} minutes logged`,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      isCustomCard: true
    },
    {
      title: 'Active Agents',
      value: activeAgents.toString(),
      description: `${activeAgents} of ${totalAgents} total agents`,
      change: totalAgents === 0 ? 'No agents created' : `${totalAgents - activeAgents} inactive`,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Active Campaigns',
      value: activeCampaigns.toString(),
      description: `${activeCampaigns} of ${totalCampaigns} total campaigns`,
      change: totalCampaigns === 0 ? 'No campaigns created' : `${totalCampaigns - activeCampaigns} inactive`,
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hello, {userName} 👋</h1>
            <p className="text-gray-600 mt-1">Welcome to your AI-powered calling platform</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="bg-white">
              <Search className="w-4 h-4 mr-2" />
              Search...
            </Button>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>This month</option>
              <option>Last month</option>
              <option>This year</option>
            </select>
          </div>
        </div>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainMetrics.map((metric, index) => (
            <Card key={index} className={`bg-white hover:shadow-lg transition-all duration-200 ${metric.borderColor} border-l-4`}>
              <CardContent className="p-6">
                {metric.isCustomCard ? (
                  // Custom design for Call Minutes card
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                        <metric.icon className={`h-6 w-6 ${metric.color}`} />
                      </div>
                      <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                        Active
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                      <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
                      <p className="text-sm text-gray-500">{metric.description}</p>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Total logged:</span>
                        <span className="font-medium text-purple-600">{callStats?.totalMinutes || 0} min</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Default design for other cards
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                        <metric.icon className={`h-6 w-6 ${metric.color}`} />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                        <div className="text-sm text-gray-600">{metric.description}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {metric.change}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agents List */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">Your Agents</CardTitle>
                  <CardDescription className="text-gray-600">Manage and monitor your AI agents</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onNavigateToTab?.('agents')}
                >
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {agents.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-500 pb-3 border-b border-gray-200">
                    <span>Agent Name</span>
                    <span>Status</span>
                    <span>Last Active</span>
                  </div>
                  {agents.slice(0, 4).map((agent, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 text-sm py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors">
                      <span className="font-medium text-gray-900 truncate">{agent.name}</span>
                      <div>
                        <Badge variant={agent.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                          {agent.status}
                        </Badge>
                      </div>
                      <span className="text-gray-500 text-xs">
                        {agent.last_active ? new Date(agent.last_active).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No agents created yet</h3>
                  <p className="text-sm mb-4">Create your first agent to start making calls</p>
                  <Button size="sm" onClick={() => onNavigateToTab?.('agents')}>
                    Create Agent
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Campaigns List */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">Your Campaigns</CardTitle>
                  <CardDescription className="text-gray-600">Monitor your calling campaigns</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onNavigateToTab?.('campaigns')}
                >
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {campaigns.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-500 pb-3 border-b border-gray-200">
                    <span>Campaign Name</span>
                    <span>Status</span>
                    <span>Created</span>
                  </div>
                  {campaigns.slice(0, 4).map((campaign, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 text-sm py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors">
                      <span className="font-medium text-gray-900 truncate">{campaign.name}</span>
                      <div>
                        <Badge 
                          variant={campaign.status === 'active' ? 'default' : 
                                  campaign.status === 'completed' ? 'secondary' : 
                                  campaign.status === 'paused' ? 'outline' : 'secondary'} 
                          className="text-xs"
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                      <span className="text-gray-500 text-xs">
                        {new Date(campaign.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns created yet</h3>
                  <p className="text-sm mb-4">Create your first campaign to start reaching contacts</p>
                  <Button size="sm" onClick={() => onNavigateToTab?.('campaigns')}>
                    Create Campaign
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Card */}
        {totalAgents === 0 && (
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Getting Started</h3>
              <p className="text-sm text-gray-600 mb-4">
                Create your first agent to start making calls and managing conversations.
              </p>
              <Button size="sm" className="w-full" onClick={() => onNavigateToTab?.('agents')}>
                Create Agent
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HomeDashboard;
