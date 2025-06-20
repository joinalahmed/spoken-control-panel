
import { Loader2 } from 'lucide-react';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useCampaignContactCounts } from '@/hooks/useCampaignContactCounts';
import CampaignsListHeader from '@/components/campaign/CampaignsListHeader';
import ActiveInboundAlert from '@/components/campaign/ActiveInboundAlert';
import EmptyCampaignsState from '@/components/campaign/EmptyCampaignsState';
import CampaignCard from '@/components/campaign/CampaignCard';

interface CampaignsListProps {
  onCreateCampaign: () => void;
  onSelectCampaign: (campaignId: string) => void;
}

const CampaignsList = ({ onCreateCampaign, onSelectCampaign }: CampaignsListProps) => {
  const { campaigns, isLoading } = useCampaigns();
  const { data: contactCounts = {} } = useCampaignContactCounts(campaigns);

  if (isLoading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const activeInboundCampaign = campaigns.find(c => 
    c.status === 'active' && 
    c.settings?.campaignType === 'inbound'
  );

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <CampaignsListHeader onCreateCampaign={onCreateCampaign} />
      
      <ActiveInboundAlert activeInboundCampaign={activeInboundCampaign} />

      {campaigns.length === 0 ? (
        <EmptyCampaignsState onCreateCampaign={onCreateCampaign} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => {
            const contactCount = contactCounts[campaign.id] || 0;
            
            return (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                contactCount={contactCount}
                onSelectCampaign={onSelectCampaign}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CampaignsList;
