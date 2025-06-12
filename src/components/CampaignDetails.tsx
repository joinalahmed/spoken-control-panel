import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Users, Plus, Phone, Mail, MoreHorizontal, UserMinus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCampaign } from '@/hooks/useCampaign';
import { useContacts } from '@/hooks/useContacts';
import { useToast } from "@/hooks/use-toast"
import CallAnalyticsTable from '@/components/CallAnalyticsTable';
import AddContactToCampaign from '@/components/AddContactToCampaign';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface CampaignDetailsProps {
  campaignId: string;
  onBack: () => void;
}

interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: string;
}

const CampaignDetails = ({ campaignId, onBack }: CampaignDetailsProps) => {
  const navigate = useNavigate();
  const { campaign, isLoading, error } = useCampaign(campaignId);
  const { contacts, isLoading: isLoadingContacts } = useContacts();
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const { toast } = useToast()

  // Fetch contact counts for each campaign
  const { data: contactCounts = {} } = useQuery({
    queryKey: ['campaign-contact-counts', campaignId],
    queryFn: async () => {
      if (!campaignId) return {};
      
      const { data, error } = await supabase
        .from('campaign_contacts')
        .select('campaign_id')
        .eq('campaign_id', campaignId);

      if (error) {
        console.error('Error fetching contact counts:', error);
        return {};
      }

      // Count contacts per campaign
      const counts: Record<string, number> = {};
      data.forEach(item => {
        counts[item.campaign_id] = (counts[item.campaign_id] || 0) + 1;
      });

      return counts;
    },
    enabled: !!campaignId,
  });

  // Get all contacts currently in the campaign
  const { data: campaignContacts = [], isLoading: isCampaignContactsLoading, refetch: refetchCampaignContacts } = useQuery({
    queryKey: ['campaign-contacts', campaignId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select(`*, campaign_contacts!inner(*)`)
        .eq('campaign_contacts.campaign_id', campaignId);

      if (error) {
        console.error('Error fetching campaign contacts:', error);
        return [];
      }

      return data;
    },
    enabled: !!campaignId,
  });

  const removeContactMutation = useMutation({
    mutationFn: async (contactId: string) => {
      const { data, error } = await supabase
        .from('campaign_contacts')
        .delete()
        .eq('campaign_id', campaignId)
        .eq('contact_id', contactId);

      if (error) {
        throw new Error(`Failed to remove contact: ${error.message}`);
      }
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Contact removed from campaign.",
      })
      refetchCampaignContacts();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    },
  });

  const handleRemoveContact = async (contactId: string) => {
    try {
      await removeContactMutation.mutateAsync(contactId);
    } catch (error: any) {
      console.error("Error removing contact:", error.message);
    }
  };

  const handleContactsAdded = () => {
    refetchCampaignContacts();
  };

  const handleCallClick = (callId: string) => {
    navigate(`/call-details/${callId}`);
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="flex-1 p-6">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <p>Error: {error || 'Campaign not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-3 flex items-center justify-between bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">{campaign.name}</h1>
        </div>
        <div>
          <Button variant="secondary">
            Start Campaign
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Performance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-900">Total Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">328</div>
              <p className="text-sm text-gray-500">+12% from last week</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-900">Answer Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">78%</div>
              <p className="text-sm text-gray-500">-3% from last week</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-900">Avg. Call Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">2m 34s</div>
              <p className="text-sm text-gray-500">+5s from last week</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-900">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">15%</div>
              <p className="text-sm text-gray-500">+2% from last week</p>
            </CardContent>
          </Card>
        </div>

        {/* Configuration and Contacts Side by Side */}
        <div className="grid grid-cols-1 xl:grid-cols-6 gap-8">
          {/* Campaign Configuration Card */}
          <div className="xl:col-span-2">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 h-[600px]">
              <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-100/50 rounded-t-lg">
                <CardTitle className="text-gray-900 flex items-center gap-3">
                  <Settings className="w-5 h-5 text-blue-600" />
                  Campaign Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 h-[calc(100%-80px)] overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700">Name</h4>
                    <p className="text-gray-600">{campaign.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700">Description</h4>
                    <p className="text-gray-600">{campaign.description || 'No description provided'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700">Agent</h4>
                    <p className="text-gray-600">{campaign.agent_id}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700">Script</h4>
                    <p className="text-gray-600">{campaign.script_id}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700">Knowledge Base</h4>
                    <p className="text-gray-600">{campaign.knowledge_base_id}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700">Status</h4>
                    <Badge variant="secondary">{campaign.status}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Contacts Section - Right Side */}
          <div className="xl:col-span-4">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 h-[600px]">
              <CardHeader className="pb-4 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-900 flex items-center gap-3">
                    <Users className="w-5 h-5 text-emerald-600" />
                    Campaign Contacts
                    {contactCounts[campaignId] && (
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                        {contactCounts[campaignId]} contacts
                      </Badge>
                    )}
                  </CardTitle>
                  <Button
                    onClick={() => setShowAddContactModal(true)}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Contacts
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-80px)]">
                <ScrollArea className="h-full">
                  <div className="p-6">
                    {isLoadingContacts ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                        <span className="ml-2 text-gray-600">Loading contacts...</span>
                      </div>
                    ) : campaignContacts.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts assigned</h3>
                        <p className="text-gray-600 mb-6">Add contacts to start your campaign</p>
                        <Button
                          onClick={() => setShowAddContactModal(true)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add First Contact
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {campaignContacts.map((contact) => (
                          <div
                            key={contact.id}
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-200 hover:border-emerald-200 hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-medium">
                                {contact.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{contact.name}</h4>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  {contact.phone && (
                                    <div className="flex items-center gap-1">
                                      <Phone className="w-3 h-3" />
                                      <span>{contact.phone}</span>
                                    </div>
                                  )}
                                  {contact.email && (
                                    <div className="flex items-center gap-1">
                                      <Mail className="w-3 h-3" />
                                      <span>{contact.email}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={
                                  contact.status === 'active' 
                                    ? 'bg-green-50 text-green-700 border-green-200' 
                                    : 'bg-gray-50 text-gray-700 border-gray-200'
                                }
                              >
                                {contact.status}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-white border-gray-200">
                                  <DropdownMenuItem 
                                    onClick={() => handleRemoveContact(contact.id)}
                                    className="text-red-600 hover:bg-red-50"
                                    disabled={removeContactMutation.isPending}
                                  >
                                    <UserMinus className="w-4 h-4 mr-2" />
                                    Remove from Campaign
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call Analytics & Performance - Bottom Section */}
        <div className="mt-8">
          <CallAnalyticsTable campaignId={campaignId} onCallClick={handleCallClick} />
        </div>
      </div>

      {/* Add Contact Modal */}
      <AddContactToCampaign
        campaignId={campaignId}
        currentContactIds={campaignContacts.map(contact => contact.id)}
        isOpen={showAddContactModal}
        onClose={() => setShowAddContactModal(false)}
        onContactsAdded={handleContactsAdded}
      />
    </div>
  );
};

export default CampaignDetails;
