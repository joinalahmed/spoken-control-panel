
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCampaigns } from '@/hooks/useCampaigns';
import { Loader2 } from 'lucide-react';

interface CampaignsListProps {
  onCreateCampaign: () => void;
  onViewCallLogs: () => void;
}

const CampaignsList = ({ onCreateCampaign, onViewCallLogs }: CampaignsListProps) => {
  const { campaigns, isLoading } = useCampaigns();

  if (isLoading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Campaigns</h1>
          <p className="text-gray-600">Manage your voice campaigns where contacts are mapped with agents</p>
        </div>
        <Button onClick={onCreateCampaign} className="bg-purple-600 hover:bg-purple-700">
          Create New Campaign
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Overview</CardTitle>
              <CardDescription>Create and manage campaigns to connect your agents with contacts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                A campaign allows you to map specific contacts with agents for automated voice interactions.
              </p>
              <Button onClick={onCreateCampaign} className="bg-purple-600 hover:bg-purple-700">
                Create Your First Campaign
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Call Logs</CardTitle>
              <CardDescription>View and analyze your campaign call history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Track all conversations and interactions from your campaigns.
              </p>
              <Button 
                onClick={onViewCallLogs}
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                View Call Logs
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <CardDescription>{campaign.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span>Contacts: {campaign.contact_ids.length}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Created: {new Date(campaign.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Call Logs</CardTitle>
              <CardDescription>View and analyze your campaign call history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Track all conversations and interactions from your campaigns.
              </p>
              <Button 
                onClick={onViewCallLogs}
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                View Call Logs
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CampaignsList;
