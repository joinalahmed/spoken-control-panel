
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCampaigns } from '@/hooks/useCampaigns';
import { Loader2, Users, Calendar, Play, Pause, BarChart3, ArrowRight } from 'lucide-react';

interface CampaignsListProps {
  onCreateCampaign: () => void;
  onSelectCampaign: (campaignId: string) => void;
}

const CampaignsList = ({ onCreateCampaign, onSelectCampaign }: CampaignsListProps) => {
  const { campaigns, isLoading } = useCampaigns();

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
      default:
        return <BarChart3 className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex-1 bg-slate-900 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Campaigns</h1>
          <p className="text-slate-400">Manage your voice campaigns where contacts are mapped with agents</p>
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
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Campaign Overview</CardTitle>
              <CardDescription className="text-slate-400">Create and manage campaigns to connect your agents with contacts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">
                A campaign allows you to map specific contacts with agents for automated voice interactions.
              </p>
              <Button onClick={onCreateCampaign} className="bg-purple-600 hover:bg-purple-700">
                Create Your First Campaign
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Getting Started</CardTitle>
              <CardDescription className="text-slate-400">Set up your first voice campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">
                Get started by creating agents, adding contacts, and launching your first campaign.
              </p>
              <Button 
                onClick={onCreateCampaign}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card 
              key={campaign.id} 
              className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 cursor-pointer group"
              onClick={() => onSelectCampaign(campaign.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                    {getStatusIcon(campaign.status)}
                    {campaign.status}
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
                </div>
                <CardTitle className="text-white text-lg">{campaign.name}</CardTitle>
                <CardDescription className="text-slate-400 line-clamp-2">
                  {campaign.description || 'No description provided'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Users className="w-4 h-4" />
                    <span>{campaign.contact_ids.length} contacts</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(campaign.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Last updated</span>
                    <span>{new Date(campaign.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignsList;
