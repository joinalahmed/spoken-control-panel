import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Settings, PhoneCall, Clock, Users, Bot, UserPlus, Loader2, PhoneOutgoing, PhoneIncoming } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useAgents } from '@/hooks/useAgents';
import { useContacts } from '@/hooks/useContacts';
import { useScripts } from '@/hooks/useScripts';
import { useKbs } from '@/hooks/useKbs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface CampaignDetailsProps {
  campaignId: string;
  onBack: () => void;
}

const CampaignDetails = ({ campaignId, onBack }: CampaignDetailsProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { campaigns, updateCampaign } = useCampaigns();
  const { agents } = useAgents();
  const { contacts } = useContacts();
  const { scripts } = useScripts();
  const { kbs } = useKbs();
  
  const [campaign, setCampaign] = useState<any>(null);
  const [contactsData, setContactsData] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [selectedScript, setSelectedScript] = useState<any>(null);
  const [selectedKb, setSelectedKb] = useState<any>(null);
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [availableContacts, setAvailableContacts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock call data - in a real app, this would come from a calls API
  const mockCallsData = [
    { id: '1', contactId: '1', status: 'completed', duration: 120, timestamp: new Date().toISOString() },
    { id: '2', contactId: '2', status: 'failed', duration: 0, timestamp: new Date().toISOString() },
  ];

  const toggleStatus = {
    isPending: false,
    mutate: async () => {
      if (!campaign) return;
      
      const newStatus = campaign.status === 'active' ? 'paused' : 'active';
      
      try {
        await updateCampaign.mutateAsync({
          id: campaign.id,
          status: newStatus
        });
        
        setCampaign({
          ...campaign,
          status: newStatus
        });
        
        toast({
          title: `Campaign ${newStatus}`,
          description: `Campaign has been ${newStatus === 'active' ? 'activated' : 'paused'} successfully.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update campaign status.",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    const fetchCampaign = async () => {
      const foundCampaign = campaigns.find(c => c.id === campaignId);
      if (foundCampaign) {
        setCampaign(foundCampaign);
        
        // Find related resources
        if (foundCampaign.agent_id) {
          setSelectedAgent(agents.find(a => a.id === foundCampaign.agent_id));
        }
        
        if (foundCampaign.script_id) {
          setSelectedScript(scripts.find(s => s.id === foundCampaign.script_id));
        }
        
        if (foundCampaign.knowledge_base_id) {
          setSelectedKb(kbs.find(k => k.id === foundCampaign.knowledge_base_id));
        }
      }
    };

    const fetchCampaignContacts = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('campaign_contacts')
          .select(`
            id,
            contact_id,
            campaign_id,
            contacts (*)
          `)
          .eq('campaign_id', campaignId);
        
        if (error) throw error;
        
        if (data) {
          const contactsWithDetails = data.map(item => ({
            ...item.contacts,
            campaign_contact_id: item.id,
            campaign_contact_status: 'pending'
          }));
          
          setContactsData(contactsWithDetails);
          
          // Set available contacts (those not already in the campaign)
          const campaignContactIds = contactsWithDetails.map(c => c.id);
          setAvailableContacts(contacts.filter(c => !campaignContactIds.includes(c.id)));
        }
      } catch (error) {
        console.error('Error fetching campaign contacts:', error);
      }
    };

    fetchCampaign();
    fetchCampaignContacts();
  }, [campaignId, campaigns, agents, scripts, kbs, contacts, user?.id]);

  const handleToggleStatus = () => {
    toggleStatus.mutate();
  };

  const handleTriggerCall = async () => {
    if (!selectedContact) {
      toast({
        title: "No contact selected",
        description: "Please select a contact to call.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would trigger an actual call
    toast({
      title: "Call initiated",
      description: "The call has been queued and will start shortly.",
    });
    
    setShowTriggerModal(false);
    setSelectedContact(null);
  };

  const handleAddContacts = async () => {
    // In a real app, this would add contacts to the campaign
    toast({
      title: "Contacts added",
      description: "The selected contacts have been added to the campaign.",
    });
    
    setShowAddContactModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'paused':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4" />;
      case 'paused':
        return <Pause className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const filteredContacts = availableContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.phone && contact.phone.includes(searchTerm))
  );

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{campaign?.name}</h1>
              <p className="text-gray-600">{campaign?.description || 'Campaign details and management'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge 
              variant="outline" 
              className={getStatusColor(campaign?.status || 'draft')}
            >
              <div className="flex items-center gap-2">
                {getStatusIcon(campaign?.status || 'draft')}
                {campaign?.status || 'draft'}
              </div>
            </Badge>
            <Button 
              onClick={handleToggleStatus}
              disabled={toggleStatus.isPending}
              className={campaign?.status === 'active' 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
              }
            >
              {toggleStatus.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : campaign?.status === 'active' ? (
                <Pause className="w-4 h-4 mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {campaign?.status === 'active' ? 'Pause Campaign' : 'Start Campaign'}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {/* Campaign Stats Cards */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100/80 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-100/70 to-indigo-100/70 rounded-t-lg border-b border-blue-200/50">
              <CardTitle className="text-xl font-bold text-blue-900 flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-900 mb-2">
                {contactsData?.length || 0}
              </div>
              <p className="text-blue-700 text-sm">Total contacts in campaign</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100/80 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4 bg-gradient-to-r from-green-100/70 to-emerald-100/70 rounded-t-lg border-b border-green-200/50">
              <CardTitle className="text-xl font-bold text-green-900 flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <PhoneCall className="h-5 w-5 text-white" />
                </div>
                Calls Made
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-900 mb-2">
                {mockCallsData.length}
              </div>
              <p className="text-green-700 text-sm">Total calls completed</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-100/80 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4 bg-gradient-to-r from-purple-100/70 to-violet-100/70 rounded-t-lg border-b border-purple-200/50">
              <CardTitle className="text-xl font-bold text-purple-900 flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-900 mb-2">
                {mockCallsData.length > 0 
                  ? Math.round((mockCallsData.filter(call => call.status === 'completed').length / mockCallsData.length) * 100)
                  : 0}%
              </div>
              <p className="text-purple-700 text-sm">Successful connections</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Campaign Configuration Card */}
          <div className="xl:col-span-2">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-100/80 hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4 bg-gradient-to-r from-orange-100/70 to-amber-100/70 rounded-t-lg border-b border-orange-200/50">
                <CardTitle className="text-xl font-bold text-orange-900 flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                  Campaign Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Campaign Type */}
                <div className="bg-white/60 rounded-lg p-4 border border-orange-200/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm font-medium text-orange-800">Campaign Type</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {campaign?.settings?.campaignType === 'outbound' ? (
                      <>
                        <PhoneOutgoing className="w-4 h-4 text-orange-700" />
                        <Badge className="bg-orange-100 text-orange-700 border-orange-200">Outbound</Badge>
                      </>
                    ) : (
                      <>
                        <PhoneIncoming className="w-4 h-4 text-orange-700" />
                        <Badge className="bg-orange-100 text-orange-700 border-orange-200">Inbound</Badge>
                      </>
                    )}
                  </div>
                </div>

                {campaign?.settings?.campaignType === 'outbound' && (
                  <>
                    {/* Call Scheduling */}
                    <div className="bg-white/60 rounded-lg p-4 border border-orange-200/50">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm font-medium text-orange-800">Call Scheduling</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-orange-600">Hours:</span>
                          <p className="text-orange-900 font-medium">
                            {campaign?.settings?.callScheduling?.startTime || '09:00'} - {campaign?.settings?.callScheduling?.endTime || '17:00'}
                          </p>
                        </div>
                        <div>
                          <span className="text-orange-600">Timezone:</span>
                          <p className="text-orange-900 font-medium">{campaign?.settings?.callScheduling?.timezone || 'UTC'}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="text-orange-600 text-sm">Active Days:</span>
                        <div className="flex gap-2 mt-1">
                          {(campaign?.settings?.callScheduling?.daysOfWeek || []).map((day: string) => (
                            <Badge key={day} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                              {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Retry Logic */}
                    <div className="bg-white/60 rounded-lg p-4 border border-orange-200/50">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm font-medium text-orange-800">Retry Settings</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-orange-600">Max Retries:</span>
                          <p className="text-orange-900 font-medium">{campaign?.settings?.retryLogic?.maxRetries || 3}</p>
                        </div>
                        <div>
                          <span className="text-orange-600">Retry Interval:</span>
                          <p className="text-orange-900 font-medium">{campaign?.settings?.retryLogic?.retryInterval || 60} min</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Call Behavior */}
                <div className="bg-white/60 rounded-lg p-4 border border-orange-200/50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm font-medium text-orange-800">Call Behavior</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-orange-600">Max Duration:</span>
                      <p className="text-orange-900 font-medium">{campaign?.settings?.callBehavior?.maxCallDuration || 15} min</p>
                    </div>
                    <div>
                      <span className="text-orange-600">Recording:</span>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        {campaign?.settings?.callBehavior?.recordCalls ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Campaign Resources */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-cyan-100/80 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4 bg-gradient-to-r from-teal-100/70 to-cyan-100/70 rounded-t-lg border-b border-teal-200/50">
              <CardTitle className="text-xl font-bold text-teal-900 flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Agent */}
              <div className="bg-white/60 rounded-lg p-4 border border-teal-200/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-sm font-medium text-teal-800">Agent</span>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 bg-teal-600">
                    <AvatarFallback className="text-white text-xs font-medium">
                      {selectedAgent?.name?.split(' ').map(n => n[0]).join('') || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-teal-900 text-sm">{selectedAgent?.name || 'No agent'}</p>
                    <p className="text-xs text-teal-600">{selectedAgent?.voice || 'No voice'}</p>
                  </div>
                </div>
              </div>

              {/* Script */}
              <div className="bg-white/60 rounded-lg p-4 border border-teal-200/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-sm font-medium text-teal-800">Script</span>
                </div>
                <div>
                  <p className="font-medium text-teal-900 text-sm">{selectedScript?.name || 'No script'}</p>
                  <p className="text-xs text-teal-600">{selectedScript?.agent_type || 'No type'}</p>
                </div>
              </div>

              {/* Knowledge Base */}
              <div className="bg-white/60 rounded-lg p-4 border border-teal-200/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-sm font-medium text-teal-800">Knowledge Base</span>
                </div>
                <div>
                  <p className="font-medium text-teal-900 text-sm">{selectedKb?.title || 'No knowledge base'}</p>
                  <p className="text-xs text-teal-600">{selectedKb?.type || 'No type'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <Button 
                  onClick={() => setShowTriggerModal(true)}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  disabled={!campaign || campaign.status !== 'active'}
                >
                  <PhoneCall className="w-4 h-4 mr-2" />
                  Trigger Call
                </Button>
                <Button 
                  onClick={() => setShowAddContactModal(true)}
                  variant="outline" 
                  className="w-full border-teal-300 text-teal-700 hover:bg-teal-50"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Contacts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contacts Table */}
        <Card className="mt-6 border-0 shadow-lg bg-white">
          <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <CardTitle className="text-xl font-bold text-gray-900">Campaign Contacts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {contactsData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 mb-2">No contacts in this campaign</p>
                <Button 
                  onClick={() => setShowAddContactModal(true)}
                  variant="outline" 
                  className="mt-2"
                >
                  Add Contacts
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Called</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contactsData.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 bg-gray-200">
                            <AvatarFallback className="text-gray-600 text-xs">
                              {contact.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{contact.name}</p>
                            <p className="text-xs text-gray-500">{contact.company || 'No company'}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{contact.phone || 'No phone'}</TableCell>
                      <TableCell>{contact.email || 'No email'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            contact.campaign_contact_status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                            contact.campaign_contact_status === 'failed' ? 'bg-red-100 text-red-700 border-red-200' :
                            contact.campaign_contact_status === 'in_progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                            'bg-gray-100 text-gray-700 border-gray-200'
                          }
                        >
                          {contact.campaign_contact_status || 'pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {contact.last_called ? formatDistanceToNow(new Date(contact.last_called), { addSuffix: true }) : 'Never'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trigger Call Modal */}
      <Dialog open={showTriggerModal} onOpenChange={setShowTriggerModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trigger Call</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="contact">Select Contact to Call</Label>
              <select
                id="contact"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                value={selectedContact || ''}
                onChange={(e) => setSelectedContact(e.target.value)}
              >
                <option value="">Select a contact</option>
                {contactsData.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name} - {contact.phone || 'No phone'}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTriggerModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleTriggerCall} className="bg-purple-600 hover:bg-purple-700">
              Start Call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Contacts Modal */}
      <Dialog open={showAddContactModal} onOpenChange={setShowAddContactModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Contacts to Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="search">Search Contacts</Label>
              <Input
                id="search"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="max-h-64 overflow-y-auto border rounded-md p-4">
              {filteredContacts.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  {availableContacts.length === 0 ? 'No contacts available to add' : 'No contacts match your search'}
                </p>
              ) : (
                <div className="space-y-2">
                  {filteredContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md">
                      <Checkbox id={`contact-${contact.id}`} />
                      <Label htmlFor={`contact-${contact.id}`} className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 bg-gray-200">
                            <AvatarFallback className="text-gray-600 text-xs">
                              {contact.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{contact.name}</p>
                            <p className="text-xs text-gray-500">
                              {contact.phone || 'No phone'} • {contact.email || 'No email'}
                            </p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddContactModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddContacts} className="bg-purple-600 hover:bg-purple-700">
              Add Selected Contacts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampaignDetails;
