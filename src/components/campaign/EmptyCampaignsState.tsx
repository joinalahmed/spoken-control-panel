
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface EmptyCampaignsStateProps {
  onCreateCampaign: () => void;
}

const EmptyCampaignsState = ({ onCreateCampaign }: EmptyCampaignsStateProps) => {
  return (
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
  );
};

export default EmptyCampaignsState;
