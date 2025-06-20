
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Campaign } from '@/hooks/useCampaigns';

interface ActiveInboundAlertProps {
  activeInboundCampaign: Campaign | undefined;
}

const ActiveInboundAlert = ({ activeInboundCampaign }: ActiveInboundAlertProps) => {
  if (!activeInboundCampaign) return null;

  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <AlertTriangle className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <strong>Active Inbound Campaign:</strong> "{activeInboundCampaign.name}" is currently active. 
        Only one inbound campaign can be active at a time. Pause this campaign to activate another inbound campaign.
      </AlertDescription>
    </Alert>
  );
};

export default ActiveInboundAlert;
