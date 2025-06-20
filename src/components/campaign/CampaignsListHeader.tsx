
import { Button } from '@/components/ui/button';

interface CampaignsListHeaderProps {
  onCreateCampaign: () => void;
}

const CampaignsListHeader = ({ onCreateCampaign }: CampaignsListHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">All Campaigns</h1>
        <p className="text-gray-600">View all voice campaigns across all users</p>
      </div>
      <Button 
        onClick={onCreateCampaign}
        className="bg-purple-600 hover:bg-purple-700"
      >
        Create New Campaign
      </Button>
    </div>
  );
};

export default CampaignsListHeader;
