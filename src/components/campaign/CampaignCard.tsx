
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Play, Pause, BarChart3, ArrowRight, PhoneIncoming, PhoneOutgoing, Copy } from 'lucide-react';
import { Campaign } from '@/hooks/useCampaigns';
import { useToast } from '@/hooks/use-toast';

interface CampaignCardProps {
  campaign: Campaign;
  contactCount: number;
  onSelectCampaign: (campaignId: string) => void;
}

const CampaignCard = ({ campaign, contactCount, onSelectCampaign }: CampaignCardProps) => {
  const { toast } = useToast();

  const handleCopyId = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(id);
      toast({
        title: "Copied!",
        description: "Campaign ID copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy ID to clipboard",
        variant: "destructive",
      });
    }
  };

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

  const getCampaignTypeInfo = (campaign: Campaign) => {
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

  const typeInfo = getCampaignTypeInfo(campaign);

  return (
    <Card 
      className="bg-white hover:bg-gray-50 transition-all duration-300 cursor-pointer group focus:outline-none border-2 border-gray-200 focus:border-purple-600"
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
        <CardDescription className="text-gray-600">
          {campaign.description || 'No description provided'}
        </CardDescription>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
          <span>ID: {campaign.id.slice(0, 8)}...</span>
          <Button 
            size="sm" 
            variant="ghost" 
            className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => handleCopyId(campaign.id, e)}
          >
            <Copy className="w-3 h-3" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span>{contactCount} contacts</span>
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
};

export default CampaignCard;
