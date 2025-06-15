import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCampaigns } from '@/hooks/useCampaigns';
import { Loader2, Users, Calendar, Play, Pause, BarChart3, ArrowRight, PhoneIncoming, PhoneOutgoing } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CampaignsListProps {
  onCreateCampaign: () => void;
  onSelectCampaign: (campaignId: string) => void;
}

const CampaignsList = ({ onCreateCampaign, onSelectCampaign }: CampaignsListProps) => {
  const { campaigns, isLoading } = useCampaigns();
  const { user } = useAuth();

  // Fetch contact counts for each campaign
  const { data: contactCounts = {} } = useQuery({
    queryKey: ['campaign-contact-counts', campaigns.map(c => c.id)],
    queryFn: async () => {
      if (!user?.id || campaigns.length === 0) return {};
      
      const campaignIds = campaigns.map(c => c.id);
      const { data, error } = await supabase
        .from('campaign_contacts')
        .select('campaign_id')
        .in('campaign_id', campaignIds);

      if (error) {
        console.error('Error fetching contact counts:', error);
        return {};
      }

      // Count contacts per campaign
      const counts: Record<string, number> = {};
      data.forEach(item => {
        counts[item.campaign_id] = (counts[item.campaign_id] || 0) + 1;
      });

      return counts;
    },
    enabled: !!user?.id && campaigns.length > 0,
  });

  if (isLoading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'paused':
        return 'text-yellow-600 bg-yellow-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'draft':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4" />;
      case 'paused':
        return <Pause className="w-4 h-4" />;
      case 'draft':
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getCampaignTypeInfo = (campaign: any) => {
    // Get campaign type from settings instead of agent
    const campaignType = campaign.settings?.campaignType || 'outbound';
    
    if (campaignType === 'outbound') {
      return {
        icon: <PhoneOutgoing className="w-4 h-4" />,
        label: 'Outbound',
        color: 'bg-green-100 text-green-700 border-green-200'
      };
    } else if (campaignType === 'inbound') {
      return {
        icon: <PhoneIncoming className="w-4 h-4" />,
        label: 'Inbound',
        color: 'bg-blue-100 text-blue-700 border-blue-200'
      };
    } else {
      return {
        icon: <BarChart3 className="w-4 h-4" />,
        label: 'Campaign',
        color: 'bg-gray-100 text-gray-700 border-gray-200'
      };
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Campaigns</h1>
          <p className="text-gray-600">Manage your voice campaigns where contacts are mapped with agents</p>
        </div>
        <Button 
          onClick={onCreateCampaign}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Create New Campaign
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Campaign Overview</CardTitle>
              <CardDescription className="text-gray-600">Create and manage campaigns to connect your agents with contacts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                A campaign allows you to map specific contacts with agents for automated voice interactions.
              </p>
              <Button onClick={onCreateCampaign} className="bg-purple-600 hover:bg-purple-700">
                Create Your First Campaign
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Getting Started</CardTitle>
              <CardDescription className="text-gray-600">Set up your first voice campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Get started by creating agents, adding contacts, and launching your first campaign.
              </p>
              <Button 
                onClick={onCreateCampaign}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => {
            const typeInfo = getCampaignTypeInfo(campaign);
            
            return (
              <Card 
                key={campaign.id} 
                className="bg-white border-gray-200 hover:bg-gray-50 transition-all duration-300 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                onClick={() => onSelectCampaign(campaign.id)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectCampaign(campaign.id);
                  }
                }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {getStatusIcon(campaign.status)}
                        {campaign.status}
                      </div>
                      <Badge variant="outline" className={`${typeInfo.color} border`}>
                        <div className="flex items-center gap-1">
                          {typeInfo.icon}
                          {typeInfo.label}
                        </div>
                      </Badge>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <CardTitle className="text-gray-900 text-lg">{campaign.name}</CardTitle>
                  <CardDescription className="text-gray-600 line-clamp-2">
                    {campaign.description || 'No description provided'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{contactCounts[campaign.id] || 0} contacts</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(campaign.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Last updated</span>
                      <span>{new Date(campaign.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CampaignsList;
