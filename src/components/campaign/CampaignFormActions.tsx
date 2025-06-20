
import { Button } from '@/components/ui/button';

interface CampaignFormActionsProps {
  onCancel: () => void;
  onSave: () => void;
  isFormValid: boolean;
}

const CampaignFormActions = ({ onCancel, onSave, isFormValid }: CampaignFormActionsProps) => {
  return (
    <div className="flex justify-end gap-3 pt-6 border-t mt-6">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button 
        onClick={onSave} 
        className="bg-purple-600 hover:bg-purple-700"
        disabled={!isFormValid}
      >
        Create Campaign
      </Button>
    </div>
  );
};

export default CampaignFormActions;
