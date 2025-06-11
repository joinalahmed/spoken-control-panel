
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Users, Calendar, Phone, Clock, TrendingUp, Activity, Edit, Save, X, Loader2, FileType } from 'lucide-react';
import { Campaign, useCampaigns } from '@/hooks/useCampaigns';
import { useAgents } from '@/hooks/useAgents';
import { useContacts } from '@/hooks/useContacts';
import { supabase } from '@/integrations/supabase/client';
import CallAnalyticsTable from './CallAnalyticsTable';

interface CampaignDetailsProps {
  campaign: Campaign;
  onBack: () => void;
  onCallClick: (callId: string) => void;
}

interface CampaignMetrics {
  totalCalls: number;
  successfulCalls: number;
  averageCallDuration: string;
  conversionRate: string;
  lastActivity: string;
}

const CampaignDetails = ({ campaign, onBack, onCallClick }: CampaignDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [metrics, setMetrics] = useState<CampaignMetrics | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [editForm, setEditForm] = useState({
    name: campaign.name,
    description: campaign.description || '',
    status: campaign.status,
    agentId: campaign.agent_id || '',
    contactIds: campaign.contact_ids || [],
    scriptId: campaign.agent_id || '' // Using agent_id as script_id for now
  });

  const { updateCampaign } = useCampaigns();
  const { agents } = useAgents();
  const { contacts } = useContacts();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoadingMetrics(true);
        
        // Get all calls for this campaign
        const { data: callsData, error: callsError } = await supabase
          .from('calls')
          .select('*')
          .eq('campaign_id', campaign.id);

        if (callsError) {
          console.error('Error fetching call metrics:', callsError);
          return;
        }

        const calls = callsData || [];
        const totalCalls = calls.length;
        const successfulCalls = calls.filter(call => call.status === 'completed').length;
        
        // Calculate average duration
        const callsWithDuration = calls.filter(call => call.duration && call.duration > 0);
        const averageDurationSeconds = callsWithDuration.length > 0 
          ? Math.round(callsWithDuration.reduce((sum, call) => sum + call.duration, 0) / callsWithDuration.length)
          : 0;
        
        const averageCallDuration = averageDurationSeconds > 0 
          ? `${Math.floor(averageDurationSeconds / 60)}:${String(averageDurationSeconds % 60).padStart(2, '0')}`
          : 'N/A';

        const conversionRate = totalCalls > 0 
          ? `${Math.round((successfulCalls / totalCalls) * 100)}%`
          : '0%';

        // Calculate last activity based on most recent call
        let lastActivity = 'No activity';
        if (calls.length > 0) {
          const mostRecentCall = calls.reduce((latest, call) => {
            const callTime = new Date(call.started_at);
            const latestTime = new Date(latest.started_at);
            return callTime > latestTime ? call : latest;
          });
          
          const now = new Date();
          const callTime = new Date(mostRecentCall.started_at);
          const timeDiff = now.getTime() - callTime.getTime();
          
          const minutes = Math.floor(timeDiff / (1000 * 60));
          const hours = Math.floor(minutes / 60);
          const days = Math.floor(hours / 24);
          const weeks = Math.floor(days / 7);
          const months = Math.floor(days / 30);
          const years = Math.floor(days / 365);
          
          if (years > 0) {
            lastActivity = `${years} year${years > 1 ? 's' : ''} ago`;
          } else if (months > 0) {
            lastActivity = `${months} month${months > 1 ? 's' : ''} ago`;
          } else if (weeks > 0) {
            lastActivity = `${weeks} week${weeks > 1 ? 's' : ''} ago`;
          } else if (days > 0) {
            lastActivity = `${days} day${days > 1 ? 's' : ''} ago`;
          } else if (hours > 0) {
            lastActivity = `${hours} hour${hours > 1 ? 's' : ''} ago`;
          } else if (minutes > 0) {
            lastActivity = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
          } else {
            lastActivity = 'Just now';
          }
        }

        setMetrics({
          totalCalls,
          successfulCalls,
          averageCallDuration,
          conversionRate,
          lastActivity
        });
      } catch (error) {
        console.error('Error calculating metrics:', error);
      } finally {
        setIsLoadingMetrics(false);
      }
    };

    fetchMetrics();
  }, [campaign.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleContactToggle = (contactId: string) => {
    setEditForm(prev => ({
      ...prev,
      contactIds: prev.contactIds.includes(contactId)
        ? prev.contactIds.filter(id => id !== contactId)
        : [...prev.contactIds, contactId]
    }));
  };

  const handleSave = async () => {
    try {
      await updateCampaign.mutateAsync({
        id: campaign.id,
        name: editForm.name,
        description: editForm.description,
        status: editForm.status as any,
        agent_id: editForm.scriptId || null, // Using scriptId as agent_id
        contact_ids: editForm.contactIds
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating campaign:', error);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: campaign.name,
      description: campaign.description || '',
      status: campaign.status,
      agentId: campaign.agent_id || '',
      contactIds: campaign.contact_ids || [],
      scriptId: campaign.agent_id || ''
    });
    setIsEditing(false);
  };

  // Get the linked script/agent
  const linkedScript = agents.find(agent => agent.id === campaign.agent_id);

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
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4 max-w-2xl">
                <div>
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input
                    id="campaign-name"
                    value={editForm.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="text-2xl font-bold"
                  />
                </div>
                <div>
                  <Label htmlFor="campaign-description">Description</Label>
                  <Textarea
                    id="campaign-description"
                    value={editForm.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter campaign description"
                    rows={3}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="campaign-status">Status</Label>
                    <Select value={editForm.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="campaign-script">Linked Script</Label>
                    <Select value={editForm.scriptId} onValueChange={(value) => handleInputChange('scriptId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a script" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No script</SelectItem>
                        {agents.map((agent) => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.name} - {agent.voice}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Select Contacts</Label>
                  <div className="mt-2 max-h-64 overflow-y-auto border rounded-md p-4 bg-white">
                    {contacts.length === 0 ? (
                      <p className="text-sm text-gray-500">No contacts available.</p>
                    ) : (
                      <div className="space-y-2">
                        {contacts.map((contact) => (
                          <label key={contact.id} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editForm.contactIds.includes(contact.id)}
                              onChange={() => handleContactToggle(contact.id)}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">
                              {contact.name} {contact.email && `(${contact.email})`}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Selected: {editForm.contactIds.length} contact(s)
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
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
                  {linkedScript && (
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <FileType className="w-4 h-4" />
                      <span>Script: {linkedScript.name}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Campaign
            </Button>
          )}
        </div>
      </div>

      {!isEditing && (
        <>
          {/* Script Information Card */}
          {linkedScript && (
            <div className="mb-6">
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <FileType className="w-5 h-5 text-purple-600" />
                    Linked Script
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    The script that will be used for calls in this campaign
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{linkedScript.name}</h3>
                        <p className="text-sm text-gray-600">{linkedScript.description || 'No description available'}</p>
                      </div>
                      <Badge variant="outline" className={`${
                        linkedScript.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : linkedScript.status === 'training'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {linkedScript.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Voice:</span>
                        <span className="ml-2 text-gray-600">{linkedScript.voice}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Type:</span>
                        <span className="ml-2 text-gray-600">{linkedScript.agent_type}</span>
                      </div>
                    </div>
                    {linkedScript.first_message && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Opening Message:</span>
                        <p className="mt-1 text-gray-600 bg-gray-50 p-2 rounded text-sm">
                          {linkedScript.first_message}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Metrics Cards */}
            {isLoadingMetrics ? (
              <div className="lg:col-span-3 flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                <span className="ml-2 text-gray-600">Loading metrics...</span>
              </div>
            ) : metrics ? (
              <>
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
              </>
            ) : (
              <div className="lg:col-span-3 text-center py-8 text-gray-500">
                No metrics available
              </div>
            )}
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
                  {metrics && (
                    <span className="block mt-1">
                      Last activity: {metrics.lastActivity}
                    </span>
                  )}
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
        </>
      )}
    </div>
  );
};

export default CampaignDetails;
