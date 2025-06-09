
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Calendar, Phone, Clock, TrendingUp, Activity } from 'lucide-react';
import { Campaign } from '@/hooks/useCampaigns';
import CallAnalyticsTable from './CallAnalyticsTable';

interface CampaignDetailsProps {
  campaign: Campaign;
  onBack: () => void;
  onCallClick: (callId: string) => void;
}

const CampaignDetails = ({ campaign, onBack, onCallClick }: CampaignDetailsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Mock metrics data - in a real app, this would come from the database
  const metrics = {
    totalCalls: 156,
    successfulCalls: 134,
    averageCallDuration: '3:42',
    conversionRate: '86%',
    lastActivity: '2 hours ago'
  };

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <div className="mb-6">
        <Button 
          onClick={onBack}
          variant="outline" 
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Campaigns
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{campaign.name}</h1>
            <p className="text-gray-600 mb-4">{campaign.description || 'No description provided'}</p>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className={getStatusColor(campaign.status)}>
                {campaign.status}
              </Badge>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Users className="w-4 h-4" />
                <span>{campaign.contact_ids.length} contacts</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Created {new Date(campaign.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Metrics Cards */}
        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-900 text-lg flex items-center gap-2">
              <Phone className="w-5 h-5 text-purple-600" />
              Total Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">{metrics.totalCalls}</div>
            <p className="text-gray-600 text-sm">Calls initiated</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-900 text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">{metrics.conversionRate}</div>
            <p className="text-gray-600 text-sm">{metrics.successfulCalls} successful calls</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-900 text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Avg Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">{metrics.averageCallDuration}</div>
            <p className="text-gray-600 text-sm">Per call</p>
          </CardContent>
        </Card>
      </div>

      {/* Call Analytics Table */}
      <div className="space-y-6">
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Campaign Call Analytics
            </CardTitle>
            <CardDescription className="text-gray-600">
              Post-call analytics with recordings, transcripts, and extracted insights
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <CallAnalyticsTable 
              campaignId={campaign.id}
              onCallClick={onCallClick}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignDetails;
