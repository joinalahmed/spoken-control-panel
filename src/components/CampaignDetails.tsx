import React, { useState } from 'react';
import { ArrowLeft, Users, Phone, Mail, MapPin, Trash, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useContacts } from '@/hooks/useContacts';
import { useCampaigns, Campaign } from '@/hooks/useCampaigns';
import { useAgents } from '@/hooks/useAgents';
import { useKbs } from '@/hooks/useKbs';
import CallAnalyticsTable from '@/components/CallAnalyticsTable';
import AddContactToCampaign from '@/components/AddContactToCampaign';
import { toast } from 'sonner';

interface CampaignDetailsProps {
  campaign: Campaign;
  onBack: () => void;
  onCallClick: (callId: string) => void;
}

const CampaignDetails: React.FC<CampaignDetailsProps> = ({ 
  campaign, 
  onBack, 
  onCallClick 
}) => {
  const [showAddContacts, setShowAddContacts] = useState(false);
  const { contacts } = useContacts();
  const { agents } = useAgents();
  const { kbs } = useKbs();
  const { updateCampaign } = useCampaigns();

  // Get campaign contacts
  const campaignContacts = contacts.filter(contact => 
    campaign.contact_ids?.includes(contact.id)
  );

  // Get campaign agent
  const campaignAgent = agents.find(agent => agent.id === campaign.agent_id);

  // Get campaign knowledge base
  const campaignKb = kbs.find(kb => kb.id === campaign.knowledge_base_id);

  const handleRemoveContact = async (contactId: string) => {
    try {
      console.log('Removing contact from campaign:', { campaignId: campaign.id, contactId });
      
      const updatedContactIds = campaign.contact_ids?.filter(id => id !== contactId) || [];
      
      await updateCampaign.mutateAsync({
        id: campaign.id,
        contact_ids: updatedContactIds
      });

      toast.success('Contact removed from campaign');
    } catch (error) {
      console.error('Error removing contact from campaign:', error);
      toast.error('Failed to remove contact from campaign');
    }
  };

  const handleContactsAdded = () => {
    // This will trigger a refetch of the campaign data
    console.log('Contacts added, refreshing campaign data');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Campaigns
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{campaign.name}</h1>
          <p className="text-gray-600">Campaign Details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm text-gray-500">Status</span>
                <div className="mt-1">
                  <Badge 
                    variant={campaign.status === 'active' ? 'default' : 'secondary'}
                    className={
                      campaign.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : campaign.status === 'paused'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }
                  >
                    {campaign.status}
                  </Badge>
                </div>
              </div>

              {campaign.description && (
                <div>
                  <span className="text-sm text-gray-500">Description</span>
                  <p className="mt-1 text-sm">{campaign.description}</p>
                </div>
              )}

              {campaignAgent && (
                <div>
                  <span className="text-sm text-gray-500">Agent</span>
                  <p className="mt-1 text-sm font-medium">{campaignAgent.name}</p>
                </div>
              )}

              {campaignKb && (
                <div>
                  <span className="text-sm text-gray-500">Knowledge Base</span>
                  <p className="mt-1 text-sm font-medium">{campaignKb.title}</p>
                </div>
              )}

              <div>
                <span className="text-sm text-gray-500">Created</span>
                <p className="mt-1 text-sm">{new Date(campaign.created_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Contacts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Contacts ({campaignContacts.length})
              </CardTitle>
              <Button 
                size="sm" 
                onClick={() => setShowAddContacts(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </CardHeader>
            <CardContent>
              {campaignContacts.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-3">No contacts in this campaign</p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowAddContacts(true)}
                  >
                    Add First Contact
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {campaignContacts.map((contact) => (
                    <div key={contact.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{contact.name}</div>
                          <div className="space-y-1 mt-1">
                            {contact.phone && (
                              <div className="flex items-center text-xs text-gray-500">
                                <Phone className="w-3 h-3 mr-1" />
                                {contact.phone}
                              </div>
                            )}
                            {contact.email && (
                              <div className="flex items-center text-xs text-gray-500">
                                <Mail className="w-3 h-3 mr-1" />
                                {contact.email}
                              </div>
                            )}
                            {contact.address && (
                              <div className="flex items-center text-xs text-gray-500">
                                <MapPin className="w-3 h-3 mr-1" />
                                {contact.address}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveContact(contact.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Call Analytics */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Call Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CallAnalyticsTable 
                campaignId={campaign.id} 
                onCallClick={onCallClick}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Contacts Modal */}
      <AddContactToCampaign
        campaignId={campaign.id}
        currentContactIds={campaign.contact_ids || []}
        isOpen={showAddContacts}
        onClose={() => setShowAddContacts(false)}
        onContactsAdded={handleContactsAdded}
      />
    </div>
  );
};

export default CampaignDetails;
