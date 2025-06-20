
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAgents } from '@/hooks/useAgents';
import { useContacts } from '@/hooks/useContacts';
import { useScripts } from '@/hooks/useScripts';
import { useKbs } from '@/hooks/useKbs';
import CampaignSettings, { defaultSettings, CampaignSettingsData } from './CampaignSettings';
import CreateCampaignHeader from './campaign/CreateCampaignHeader';
import BasicCampaignDetails from './campaign/BasicCampaignDetails';
import ContactSelection from './campaign/ContactSelection';
import CampaignFormActions from './campaign/CampaignFormActions';

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
      <CreateCampaignHeader onBack={onBack} />

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
                <BasicCampaignDetails
                  formData={formData}
                  agents={agents}
                  scripts={scripts}
                  kbs={kbs}
                  onInputChange={handleInputChange}
                />

                <ContactSelection
                  contacts={contacts}
                  selectedContactIds={formData.contactIds}
                  onContactToggle={handleContactToggle}
                />
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <CampaignSettings 
                  settings={campaignSettings}
                  onSettingsChange={setCampaignSettings}
                />
              </TabsContent>
            </Tabs>

            <CampaignFormActions
              onCancel={onBack}
              onSave={handleSave}
              isFormValid={isFormValid}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateCampaignForm;
