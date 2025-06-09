
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Calendar, Phone, Clock, TrendingUp, Activity } from 'lucide-react';
import { Campaign } from '@/hooks/useCampaigns';
import ConversationInterface from './ConversationInterface';

interface CampaignDetailsProps {
  campaign: Campaign;
  onBack: () => void;
}

const CampaignDetails = ({ campaign, onBack }: CampaignDetailsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
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
    <div className="flex-1 bg-slate-900 p-6 overflow-y-auto">
      <div className="mb-6">
        <Button 
          onClick={onBack}
          variant="outline" 
          className="mb-4 border-slate-600 text-slate-300 hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Campaigns
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{campaign.name}</h1>
            <p className="text-slate-400 mb-4">{campaign.description || 'No description provided'}</p>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className={getStatusColor(campaign.status)}>
                {campaign.status}
              </Badge>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Users className="w-4 h-4" />
                <span>{campaign.contact_ids.length} contacts</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Created {new Date(campaign.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Metrics Cards */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Phone className="w-5 h-5 text-purple-400" />
              Total Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">{metrics.totalCalls}</div>
            <p className="text-slate-400 text-sm">Calls initiated</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">{metrics.conversionRate}</div>
            <p className="text-slate-400 text-sm">{metrics.successfulCalls} successful calls</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Avg Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">{metrics.averageCallDuration}</div>
            <p className="text-slate-400 text-sm">Per call</p>
          </CardContent>
        </Card>
      </div>

      {/* Call Logs Section */}
      <div className="space-y-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Campaign Activity & Call Logs
            </CardTitle>
            <CardDescription className="text-slate-400">
              Real-time conversation interface and call history for this campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ConversationInterface />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignDetails;
