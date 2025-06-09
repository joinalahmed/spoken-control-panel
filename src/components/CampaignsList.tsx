
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCampaigns } from '@/hooks/useCampaigns';
import { Loader2, Phone, Users, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import ConversationInterface from './ConversationInterface';

interface CampaignsListProps {
  onCreateCampaign: () => void;
  onViewCallLogs: (campaignId: string) => void;
}

const CampaignsList = ({ onCreateCampaign }: CampaignsListProps) => {
  const { campaigns, isLoading } = useCampaigns();
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const toggleCallLogs = (campaignId: string) => {
    setExpandedCampaign(expandedCampaign === campaignId ? null : campaignId);
  };

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

      {campaigns.length === 0 ? (
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
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Set up your first voice campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Get started by creating agents, adding contacts, and launching your first campaign.
              </p>
              <Button 
                onClick={onCreateCampaign}
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <CardDescription>{campaign.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{campaign.contact_ids.length} contacts</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(campaign.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <Button 
                      onClick={() => toggleCallLogs(campaign.id)}
                      variant="outline"
                      size="sm"
                      className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {expandedCampaign === campaign.id ? (
                        <>
                          Hide Call Logs
                          <ChevronUp className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        <>
                          View Call Logs
                          <ChevronDown className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>

                  {expandedCampaign === campaign.id && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Call Logs</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <ConversationInterface />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignsList;
