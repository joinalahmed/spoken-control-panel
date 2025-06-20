
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CreateCampaignHeaderProps {
  onBack: () => void;
}

const CreateCampaignHeader = ({ onBack }: CreateCampaignHeaderProps) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="w-4 h-4" />
      </Button>
      <h1 className="text-2xl font-semibold text-gray-900">Create New Campaign</h1>
    </div>
  );
};

export default CreateCampaignHeader;
