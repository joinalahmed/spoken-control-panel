
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAgents } from '@/hooks/useAgents';
import { useContacts } from '@/hooks/useContacts';
import { useScripts } from '@/hooks/useScripts';
import { useKbs } from '@/hooks/useKbs';
import CampaignSettings, { defaultSettings, CampaignSettingsData } from './CampaignSettings';

interface CreateCampaignFormProps {
  onBack: () => void;
  onSave: (campaign: any) => void;
}

const CreateCampaignForm = ({ onBack, onSave }: CreateCampaignFormProps) => {
  const { agents } = useAgents();
  const { contacts } = useContacts();
  const { scripts } = useScripts();
  const { kbs } = useKbs();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    agentId: '',
    scriptId: '',
    knowledgeBaseId: '',
    contactIds: [] as string[],
    status: 'draft'
  });

  const [campaignSettings, setCampaignSettings] = useState<CampaignSettingsData>(defaultSettings);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContactToggle = (contactId: string) => {
    setFormData(prev => ({
      ...prev,
      contactIds: prev.contactIds.includes(contactId)
        ? prev.contactIds.filter(id => id !== contactId)
        : [...prev.contactIds, contactId]
    }));
  };

  const handleSave = () => {
    onSave({
      name: formData.name,
      description: formData.description,
      agentId: formData.agentId,
      scriptId: formData.scriptId,
      knowledgeBaseId: formData.knowledgeBaseId,
      contactIds: formData.contactIds,
      status: formData.status,
      settings: campaignSettings
    });
  };

  const isFormValid = formData.name && 
                     formData.agentId && 
                     formData.scriptId && 
                     formData.knowledgeBaseId && 
                     formData.contactIds.length > 0;

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">Create New Campaign</h1>
      </div>

      <div className="max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Details</TabsTrigger>
                <TabsTrigger value="settings">Campaign Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6 mt-6">
                {/* Campaign Name */}
                <div>
                  <Label htmlFor="name">Campaign Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter campaign name"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the purpose of this campaign"
                    rows={3}
                  />
                </div>

                {/* Agent Selection */}
                <div>
                  <Label htmlFor="agent">Select Agent *</Label>
                  <Select onValueChange={(value) => handleInputChange('agentId', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an agent for this campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name} - {agent.voice}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {agents.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      No agents available. Create an agent first.
                    </p>
                  )}
                </div>

                {/* Script Selection */}
                <div>
                  <Label htmlFor="script">Select Script *</Label>
                  <Select onValueChange={(value) => handleInputChange('scriptId', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a script for this campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      {scripts.map((script) => (
                        <SelectItem key={script.id} value={script.id}>
                          {script.name} - {script.agent_type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {scripts.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      No scripts available. Create a script first.
                    </p>
                  )}
                </div>

                {/* Knowledge Base Selection */}
                <div>
                  <Label htmlFor="knowledgeBase">Select Knowledge Base *</Label>
                  <Select onValueChange={(value) => handleInputChange('knowledgeBaseId', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a knowledge base for this campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      {kbs.map((kb) => (
                        <SelectItem key={kb.id} value={kb.id}>
                          {kb.title} - {kb.type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {kbs.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      No knowledge base items available. Create a knowledge base first.
                    </p>
                  )}
                </div>

                {/* Contact Selection */}
                <div>
                  <Label>Select Contacts *</Label>
                  <div className="mt-2 max-h-64 overflow-y-auto border rounded-md p-4">
                    {contacts.length === 0 ? (
                      <p className="text-sm text-red-500">
                        No contacts available. Create contacts first.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {contacts.map((contact) => (
                          <label key={contact.id} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.contactIds.includes(contact.id)}
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
                    Selected: {formData.contactIds.length} contact(s)
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <CampaignSettings 
                  settings={campaignSettings}
                  onSettingsChange={setCampaignSettings}
                />
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t mt-6">
              <Button variant="outline" onClick={onBack}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                className="bg-purple-600 hover:bg-purple-700"
                disabled={!isFormValid}
              >
                Create Campaign
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateCampaignForm;
