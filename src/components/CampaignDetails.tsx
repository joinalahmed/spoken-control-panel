import React, { useState } from 'react';
import { ArrowLeft, Users, Phone, Mail, MapPin, Trash, Plus, Calendar, User, Database, Activity, BarChart3, Edit2, Check, X, Trash2, PhoneIncoming, PhoneOutgoing, Settings, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useContacts } from '@/hooks/useContacts';
import { useCampaigns, Campaign } from '@/hooks/useCampaigns';
import { useAgents } from '@/hooks/useAgents';
import { useKbs } from '@/hooks/useKbs';
import CallAnalyticsTable from '@/components/CallAnalyticsTable';
import AddContactToCampaign from '@/components/AddContactToCampaign';
import TriggerOutboundCall from '@/components/TriggerOutboundCall';
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
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingCampaignType, setEditingCampaignType] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(campaign.agent_id || '');
  const [selectedKbId, setSelectedKbId] = useState(campaign.knowledge_base_id || '');
  const [editedDescription, setEditedDescription] = useState(campaign.description || '');
  const [selectedStatus, setSelectedStatus] = useState(campaign.status);
  const [selectedCampaignType, setSelectedCampaignType] = useState<'inbound' | 'outbound'>(campaign.settings?.campaignType || 'outbound');
  
  const { contacts } = useContacts();
  const { agents } = useAgents();
  const { kbs } = useKbs();
  const { updateCampaign, deleteCampaign } = useCampaigns();
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

  const handleCallTriggered = () => {
    console.log('Call triggered, refreshing analytics');
    // The CallAnalyticsTable should automatically refresh due to react-query
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

  const handleUpdateStatus = async () => {
    try {
      await updateCampaign.mutateAsync({
        id: campaign.id,
        status: selectedStatus
      });
      setEditingStatus(false);
      toast.success('Campaign status updated');
    } catch (error) {
      console.error('Error updating campaign status:', error);
      toast.error('Failed to update campaign status');
    }
  };

  const handleUpdateCampaignType = async () => {
    try {
      const updatedSettings = {
        ...(campaign.settings || {
          callScheduling: {
            startTime: '09:00',
            endTime: '17:00',
            timezone: 'America/New_York',
            daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
          },
          retryLogic: {
            maxRetries: 3,
            retryInterval: 60,
            enableRetry: true
          },
          callBehavior: {
            maxCallDuration: 300,
            recordCalls: true,
            enableVoicemail: true
          }
        }),
        campaignType: selectedCampaignType
      };
      
      await updateCampaign.mutateAsync({
        id: campaign.id,
        settings: updatedSettings
      });
      setEditingCampaignType(false);
      toast.success('Campaign type updated');
    } catch (error) {
      console.error('Error updating campaign type:', error);
      toast.error('Failed to update campaign type');
    }
  };

  const handleDeleteCampaign = async () => {
    try {
      await deleteCampaign.mutateAsync(campaign.id);
      toast.success('Campaign deleted successfully');
      onBack();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error('Failed to delete campaign');
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

  const handleCancelStatusEdit = () => {
    setSelectedStatus(campaign.status);
    setEditingStatus(false);
  };

  const handleCancelCampaignTypeEdit = () => {
    setSelectedCampaignType(campaign.settings?.campaignType || 'outbound');
    setEditingCampaignType(false);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value as 'draft' | 'active' | 'paused' | 'completed');
  };

  const handleCampaignTypeChange = (value: string) => {
    setSelectedCampaignType(value as 'inbound' | 'outbound');
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

  const getCampaignTypeInfo = (campaignType: string) => {
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

  const currentCampaignType = campaign.settings?.campaignType || 'outbound';
  const typeInfo = getCampaignTypeInfo(currentCampaignType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Campaigns
              </Button>
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {campaign.name}
                  </h1>
                  <Badge variant="outline" className={`${typeInfo.color} border px-3 py-1`}>
                    <div className="flex items-center gap-1.5">
                      {typeInfo.icon}
                      <span className="font-medium">{typeInfo.label}</span>
                    </div>
                  </Badge>
                </div>
                <p className="text-gray-600 font-medium">Campaign Overview & Analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {editingStatus ? (
                <div className="flex items-center gap-2">
                  <Select value={selectedStatus} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-36 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={handleUpdateStatus} className="bg-emerald-600 hover:bg-emerald-700">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelStatusEdit}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(campaign.status)} px-4 py-2 text-sm font-semibold capitalize cursor-pointer transition-all duration-200 hover:shadow-sm`}
                    onClick={() => setEditingStatus(true)}
                  >
                    {campaign.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingStatus(true)}
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{campaign.name}"? This action cannot be undone and will remove all associated data including contacts and call records.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteCampaign}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete Campaign
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-700 mb-1">Total Contacts</p>
                  <p className="text-3xl font-bold text-blue-900">{campaignContacts.length}</p>
                  <p className="text-xs text-blue-600 mt-1">Active in campaign</p>
                </div>
                <div className="h-14 w-14 bg-blue-200 rounded-2xl flex items-center justify-center">
                  <Users className="h-7 w-7 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-700 mb-1">Calls Made</p>
                  <p className="text-3xl font-bold text-emerald-900">0</p>
                  <p className="text-xs text-emerald-600 mt-1">Total completed</p>
                </div>
                <div className="h-14 w-14 bg-emerald-200 rounded-2xl flex items-center justify-center">
                  <Phone className="h-7 w-7 text-emerald-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-purple-700 mb-1">Success Rate</p>
                  <p className="text-3xl font-bold text-purple-900">0%</p>
                  <p className="text-xs text-purple-600 mt-1">Conversion rate</p>
                </div>
                <div className="h-14 w-14 bg-purple-200 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="h-7 w-7 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100/50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-orange-700 mb-1">Avg Duration</p>
                  <p className="text-3xl font-bold text-orange-900">0m</p>
                  <p className="text-xs text-orange-600 mt-1">Call duration</p>
                </div>
                <div className="h-14 w-14 bg-orange-200 rounded-2xl flex items-center justify-center">
                  <Clock className="h-7 w-7 text-orange-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Enhanced Left Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Redesigned Campaign Configuration */}
            <div className="space-y-4">
              {/* Campaign Type Card */}
              <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Phone className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Campaign Type</h3>
                      <p className="text-sm text-gray-500">Configure how your campaign operates</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {editingCampaignType ? (
                    <div className="space-y-4">
                      <Select value={selectedCampaignType} onValueChange={handleCampaignTypeChange}>
                        <SelectTrigger className="w-full bg-white border-gray-200">
                          <SelectValue placeholder="Select campaign type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="outbound">
                            <div className="flex items-center gap-3 p-2">
                              <PhoneOutgoing className="w-5 h-5 text-gray-600" />
                              <div>
                                <div className="font-medium">Outbound</div>
                                <div className="text-xs text-gray-500">Make calls to contacts</div>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="inbound">
                            <div className="flex items-center gap-3 p-2">
                              <PhoneIncoming className="w-5 h-5 text-gray-600" />
                              <div>
                                <div className="font-medium">Inbound</div>
                                <div className="text-xs text-gray-500">Receive calls from contacts</div>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" onClick={handleUpdateCampaignType} className="bg-gray-900 hover:bg-gray-800 text-white">
                          <Check className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelCampaignTypeEdit} className="border-gray-300">
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-gray-100 rounded-xl flex items-center justify-center">
                          {typeInfo.icon}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{typeInfo.label} Campaign</div>
                          <div className="text-sm text-gray-600">
                            {currentCampaignType === 'outbound' ? 'Makes calls to contacts' : 'Receives calls from contacts'}
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setEditingCampaignType(true)} 
                        className="hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Description Card */}
              <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Activity className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Description</h3>
                      <p className="text-sm text-gray-500">Campaign purpose and details</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {editingDescription ? (
                    <div className="space-y-4">
                      <Textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        placeholder="Enter campaign description..."
                        className="min-h-[100px] bg-white border-gray-200 resize-none"
                      />
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" onClick={handleUpdateDescription} className="bg-gray-900 hover:bg-gray-800 text-white">
                          <Check className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelDescriptionEdit} className="border-gray-300">
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start justify-between min-h-[80px]">
                      <div className="flex-1 pr-3">
                        <p className="text-gray-900 leading-relaxed">
                          {campaign.description || (
                            <span className="text-gray-500 italic">No description provided. Click edit to add campaign details.</span>
                          )}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setEditingDescription(true)} 
                        className="flex-shrink-0 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Agent Assignment Card */}
              <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Agent Assignment</h3>
                      <p className="text-sm text-gray-500">AI agent handling the calls</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {editingAgent ? (
                    <div className="space-y-4">
                      <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                        <SelectTrigger className="w-full bg-white border-gray-200">
                          <SelectValue placeholder="Select an agent" />
                        </SelectTrigger>
                        <SelectContent>
                          {agents.map((agent) => (
                            <SelectItem key={agent.id} value={agent.id}>
                              <div className="flex items-center gap-3 p-2">
                                <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <User className="h-4 w-4 text-gray-600" />
                                </div>
                                <div>
                                  <div className="font-medium">{agent.name}</div>
                                  <div className="text-xs text-gray-500">{agent.voice}</div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" onClick={handleUpdateAgent} className="bg-gray-900 hover:bg-gray-800 text-white">
                          <Check className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelAgentEdit} className="border-gray-300">
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-gray-100 rounded-xl flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {campaignAgent ? campaignAgent.name : 'No agent assigned'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {campaignAgent ? campaignAgent.voice : 'Click edit to assign an agent'}
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setEditingAgent(true)} 
                        className="hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Knowledge Base Card */}
              <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Database className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Knowledge Base</h3>
                      <p className="text-sm text-gray-500">Information for agent responses</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {editingKb ? (
                    <div className="space-y-4">
                      <Select value={selectedKbId} onValueChange={setSelectedKbId}>
                        <SelectTrigger className="w-full bg-white border-gray-200">
                          <SelectValue placeholder="Select a knowledge base" />
                        </SelectTrigger>
                        <SelectContent>
                          {kbs.map((kb) => (
                            <SelectItem key={kb.id} value={kb.id}>
                              <div className="flex items-center gap-3 p-2">
                                <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <Database className="h-4 w-4 text-gray-600" />
                                </div>
                                <div>
                                  <div className="font-medium">{kb.title}</div>
                                  <div className="text-xs text-gray-500 capitalize">{kb.type}</div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" onClick={handleUpdateKb} className="bg-gray-900 hover:bg-gray-800 text-white">
                          <Check className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelKbEdit} className="border-gray-300">
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-gray-100 rounded-xl flex items-center justify-center">
                          <Database className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {campaignKb ? campaignKb.title : 'No knowledge base assigned'}
                          </div>
                          <div className="text-sm text-gray-600 capitalize">
                            {campaignKb ? campaignKb.type : 'Click edit to assign a knowledge base'}
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setEditingKb(true)} 
                        className="hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Campaign Created Date */}
              <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Campaign Created</h3>
                      <p className="text-sm text-gray-500">Initial creation date</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-900">
                      {new Date(campaign.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long'
                      })}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(campaign.created_at).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Contacts Section */}
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    Contacts ({campaignContacts.length})
                  </CardTitle>
                  <Button 
                    size="sm" 
                    onClick={() => setShowAddContacts(true)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {campaignContacts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="h-20 w-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Users className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">No contacts yet</h3>
                    <p className="text-gray-600 mb-6 max-w-sm mx-auto">Add contacts to start your campaign and begin making calls</p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowAddContacts(true)}
                      className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                    >
                      Add First Contact
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {campaignContacts.map((contact) => (
                      <div key={contact.id} className="bg-gradient-to-r from-white to-gray-50/50 border border-gray-200/50 rounded-xl p-5 hover:shadow-md transition-all duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-3 text-lg">{contact.name}</h4>
                            <div className="space-y-2">
                              {contact.phone && (
                                <div className="flex items-center text-sm text-gray-700">
                                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                    <Phone className="w-3 h-3 text-blue-600" />
                                  </div>
                                  {contact.phone}
                                </div>
                              )}
                              {contact.email && (
                                <div className="flex items-center text-sm text-gray-700">
                                  <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                    <Mail className="w-3 h-3 text-green-600" />
                                  </div>
                                  {contact.email}
                                </div>
                              )}
                              {contact.address && (
                                <div className="flex items-center text-sm text-gray-700">
                                  <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                    <MapPin className="w-3 h-3 text-purple-600" />
                                  </div>
                                  {contact.address}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {campaign.status === 'active' && currentCampaignType === 'outbound' && (
                              <TriggerOutboundCall
                                contact={contact}
                                campaignId={campaign.id}
                                onCallTriggered={handleCallTriggered}
                              />
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveContact(contact.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Right Content - Call Analytics */}
          <div className="xl:col-span-2">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  Call Analytics & Performance
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
