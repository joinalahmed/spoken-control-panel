import React, { useState } from 'react';
import { ArrowLeft, Users, Phone, Mail, MapPin, Trash, Plus, Calendar, User, Database, Activity, BarChart3, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useContacts } from '@/hooks/useContacts';
import { useCampaigns, Campaign } from '@/hooks/useCampaigns';
import { useAgents } from '@/hooks/useAgents';
import { useKbs } from '@/hooks/useKbs';
import CallAnalyticsTable from '@/components/CallAnalyticsTable';
import AddContactToCampaign from '@/components/AddContactToCampaign';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  const [editingAgent, setEditingAgent] = useState(false);
  const [editingKb, setEditingKb] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(campaign.agent_id || '');
  const [selectedKbId, setSelectedKbId] = useState(campaign.knowledge_base_id || '');
  const [editedDescription, setEditedDescription] = useState(campaign.description || '');
  
  const { contacts } = useContacts();
  const { agents } = useAgents();
  const { kbs } = useKbs();
  const { updateCampaign } = useCampaigns();
  const { user } = useAuth();

  // Fetch campaign contacts from the junction table
  const { data: campaignContactIds = [] } = useQuery({
    queryKey: ['campaign-contacts', campaign.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('campaign_contacts')
        .select('contact_id')
        .eq('campaign_id', campaign.id);

      if (error) {
        console.error('Error fetching campaign contacts:', error);
        return [];
      }

      return data.map(item => item.contact_id);
    },
    enabled: !!user?.id,
  });

  // Get campaign contacts
  const campaignContacts = contacts.filter(contact => 
    campaignContactIds.includes(contact.id)
  );

  // Get campaign agent
  const campaignAgent = agents.find(agent => agent.id === campaign.agent_id);

  // Get campaign knowledge base
  const campaignKb = kbs.find(kb => kb.id === campaign.knowledge_base_id);

  const handleRemoveContact = async (contactId: string) => {
    try {
      console.log('Removing contact from campaign:', { campaignId: campaign.id, contactId });
      
      const { error } = await supabase
        .from('campaign_contacts')
        .delete()
        .eq('campaign_id', campaign.id)
        .eq('contact_id', contactId);

      if (error) {
        console.error('Error removing contact from campaign:', error);
        toast.error('Failed to remove contact from campaign');
        return;
      }

      toast.success('Contact removed from campaign');
    } catch (error) {
      console.error('Error removing contact from campaign:', error);
      toast.error('Failed to remove contact from campaign');
    }
  };

  const handleContactsAdded = () => {
    console.log('Contacts added, refreshing campaign data');
  };

  const handleUpdateAgent = async () => {
    try {
      await updateCampaign.mutateAsync({
        id: campaign.id,
        agent_id: selectedAgentId || null
      });
      setEditingAgent(false);
      toast.success('Campaign agent updated');
    } catch (error) {
      console.error('Error updating campaign agent:', error);
      toast.error('Failed to update campaign agent');
    }
  };

  const handleUpdateKb = async () => {
    try {
      await updateCampaign.mutateAsync({
        id: campaign.id,
        knowledge_base_id: selectedKbId || null
      });
      setEditingKb(false);
      toast.success('Campaign knowledge base updated');
    } catch (error) {
      console.error('Error updating campaign knowledge base:', error);
      toast.error('Failed to update campaign knowledge base');
    }
  };

  const handleUpdateDescription = async () => {
    try {
      await updateCampaign.mutateAsync({
        id: campaign.id,
        description: editedDescription || null
      });
      setEditingDescription(false);
      toast.success('Campaign description updated');
    } catch (error) {
      console.error('Error updating campaign description:', error);
      toast.error('Failed to update campaign description');
    }
  };

  const handleCancelAgentEdit = () => {
    setSelectedAgentId(campaign.agent_id || '');
    setEditingAgent(false);
  };

  const handleCancelKbEdit = () => {
    setSelectedKbId(campaign.knowledge_base_id || '');
    setEditingKb(false);
  };

  const handleCancelDescriptionEdit = () => {
    setEditedDescription(campaign.description || '');
    setEditingDescription(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'paused':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Campaigns
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
                <p className="text-gray-600 mt-1">Campaign Overview & Analytics</p>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`${getStatusColor(campaign.status)} px-3 py-1 text-sm font-medium capitalize`}
            >
              {campaign.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{campaignContacts.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Calls Made</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">0%</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                  <p className="text-2xl font-bold text-gray-900">0m</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Sidebar - Campaign Info & Contacts */}
          <div className="xl:col-span-1 space-y-6">
            {/* Campaign Information */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  Campaign Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Description Section */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                  {editingDescription ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        placeholder="Enter campaign description..."
                        className="min-h-[80px]"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleUpdateDescription} className="bg-green-600 hover:bg-green-700">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelDescriptionEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-lg flex items-start justify-between">
                      <span className="text-sm text-gray-900 flex-1">
                        {campaign.description || 'No description provided'}
                      </span>
                      <Button size="sm" variant="ghost" onClick={() => setEditingDescription(true)} className="ml-2 flex-shrink-0">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Agent Selection */}
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                    <User className="h-4 w-4" />
                    Assigned Script/Agent
                  </label>
                  {editingAgent ? (
                    <div className="space-y-2">
                      <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an agent/script" />
                        </SelectTrigger>
                        <SelectContent>
                          {agents.map((agent) => (
                            <SelectItem key={agent.id} value={agent.id}>
                              {agent.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleUpdateAgent} className="bg-green-600 hover:bg-green-700">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelAgentEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {campaignAgent ? campaignAgent.name : 'No agent assigned'}
                      </span>
                      <Button size="sm" variant="ghost" onClick={() => setEditingAgent(true)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Knowledge Base Selection */}
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4" />
                    Knowledge Base
                  </label>
                  {editingKb ? (
                    <div className="space-y-2">
                      <Select value={selectedKbId} onValueChange={setSelectedKbId}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a knowledge base" />
                        </SelectTrigger>
                        <SelectContent>
                          {kbs.map((kb) => (
                            <SelectItem key={kb.id} value={kb.id}>
                              {kb.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleUpdateKb} className="bg-green-600 hover:bg-green-700">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelKbEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {campaignKb ? campaignKb.title : 'No knowledge base assigned'}
                      </span>
                      <Button size="sm" variant="ghost" onClick={() => setEditingKb(true)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Created</label>
                  <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {new Date(campaign.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contacts Section */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    Contacts ({campaignContacts.length})
                  </CardTitle>
                  <Button 
                    size="sm" 
                    onClick={() => setShowAddContacts(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {campaignContacts.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts yet</h3>
                    <p className="text-gray-500 mb-4">Add contacts to start your campaign</p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowAddContacts(true)}
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      Add First Contact
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {campaignContacts.map((contact) => (
                      <div key={contact.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">{contact.name}</h4>
                            <div className="space-y-1">
                              {contact.phone && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                  {contact.phone}
                                </div>
                              )}
                              {contact.email && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                  {contact.email}
                                </div>
                              )}
                              {contact.address && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                  {contact.address}
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveContact(contact.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
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

          {/* Right Content - Call Analytics */}
          <div className="xl:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                  </div>
                  Call Analytics
                </CardTitle>
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
      </div>

      {/* Add Contacts Modal */}
      <AddContactToCampaign
        campaignId={campaign.id}
        currentContactIds={campaignContactIds}
        isOpen={showAddContacts}
        onClose={() => setShowAddContacts(false)}
        onContactsAdded={handleContactsAdded}
      />
    </div>
  );
};

export default CampaignDetails;
