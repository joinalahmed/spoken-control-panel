
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CampaignsListProps {
  onCreateCampaign: () => void;
  onViewCallLogs: () => void;
}

const CampaignsList = ({ onCreateCampaign, onViewCallLogs }: CampaignsListProps) => {
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
    </div>
  );
};

export default CampaignsList;
