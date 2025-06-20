
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Settings, Zap, ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Agent } from '@/hooks/useAgents';
import { useKbs } from '@/hooks/useKbs';
import { useScripts } from '@/hooks/useScripts';
import { useCustomVoices } from '@/hooks/useCustomVoices';
import { generateRandomAvatar, getInitials } from '@/utils/avatarUtils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BasicConfigurationCard from './agent-config/BasicConfigurationCard';
import VoiceLanguageCard from './agent-config/VoiceLanguageCard';
import KnowledgeBaseScriptCard from './agent-config/KnowledgeBaseScriptCard';
import SystemPromptCard from './agent-config/SystemPromptCard';

interface AgentConfigurationProps {
  selectedAgent: Agent | null;
  onBack?: () => void;
  onUpdate?: (agentData: any) => void;
}

const AgentConfiguration = ({ selectedAgent, onBack, onUpdate }: AgentConfigurationProps) => {
  const { toast } = useToast();
  const { kbs: knowledgeBaseItems, isLoading: kbsLoading } = useKbs();
  const { scripts, isLoading: scriptsLoading } = useScripts();
  const { voices: customVoices, isLoading: voicesLoading } = useCustomVoices();
  
  const [config, setConfig] = useState({
    name: selectedAgent?.name || '',
    description: selectedAgent?.description || '',
    prompt: selectedAgent?.system_prompt || 'You are a voice assistant for Mary\'s Dental, a dental office located at 123 North Face Place, Anaheim, California. The hours are 8 AM to 5PM daily, but they are closed on Sundays.\n\nMary\'s dental provides dental services to the local Anaheim community. The practicing dentist is Dr. Mary Smith.\n\nYou are tasked with answering questions about the business, and booking appointments. If they wish to book an appointment, your goal is to gather necessary information from callers in a friendly and efficient manner like follows:\n\n1. Ask for their full name.\n2. Ask for the purpose of their appointment.\n3. Request their preferred date and time for the appointment.',
    firstMessage: selectedAgent?.first_message || 'Type Name',
    voice: selectedAgent?.voice || 'Sarah',
    gender: selectedAgent?.gender || 'none',
    languages: selectedAgent?.languages || ['en'],
    knowledgeBaseId: selectedAgent?.knowledge_base_id || 'none',
    scriptId: selectedAgent?.script_id || 'none'
  });

  // Only use custom voices from the database
  const voiceOptions = customVoices?.map(voice => ({
    id: voice.voice_id,
    name: voice.voice_name
  })) || [];

  const handleConfigChange = (updates: Partial<typeof config>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleCopyId = async () => {
    if (selectedAgent?.id) {
      try {
        await navigator.clipboard.writeText(selectedAgent.id);
        toast({
          title: "Copied!",
          description: "Agent ID copied to clipboard",
        });
      } catch (err) {
        toast({
          title: "Failed to copy",
          description: "Could not copy agent ID to clipboard",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdate = () => {
    if (onUpdate) {
      const updateData = {
        name: config.name,
        voice: config.voice,
        description: config.description,
        systemPrompt: config.prompt,
        firstMessage: config.firstMessage,
        gender: config.gender === 'none' ? null : config.gender,
        languages: config.languages,
        knowledgeBaseId: config.knowledgeBaseId === 'none' ? null : config.knowledgeBaseId,
        scriptId: config.scriptId === 'none' ? null : config.scriptId
      };
      onUpdate(updateData);
    }
  };

  if (!selectedAgent) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Agent Selected</h3>
          <p className="text-gray-500">Select an agent from the list to configure its settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-6 border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={generateRandomAvatar(selectedAgent.name, 'agent')} alt={selectedAgent.name} />
                <AvatarFallback className="bg-purple-600 text-white font-semibold text-sm">
                  {getInitials(selectedAgent.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedAgent?.name}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>ID: {selectedAgent?.id.slice(0, 8)}...</span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="p-1 h-auto"
                    onClick={handleCopyId}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <Button 
            className="bg-purple-600 hover:bg-purple-700 gap-2 shadow-sm"
            onClick={handleUpdate}
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 flex-1 flex flex-col overflow-hidden">
        <Tabs defaultValue="settings" className="w-full h-full flex flex-col">
          <TabsList className="w-full justify-start bg-transparent border-0 h-auto p-0 flex-shrink-0">
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none px-6 py-4 font-medium"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger 
              value="functions" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none px-6 py-4 font-medium"
            >
              <Zap className="w-4 h-4 mr-2" />
              Functions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="bg-gray-50 flex-1 p-8 space-y-8 m-0 overflow-auto">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-fit">
                {/* Left Column - Configuration */}
                <div className="space-y-6">
                  <BasicConfigurationCard 
                    config={{ name: config.name, description: config.description, gender: config.gender }}
                    onConfigChange={handleConfigChange}
                  />

                  <VoiceLanguageCard 
                    config={{ firstMessage: config.firstMessage, voice: config.voice, languages: config.languages }}
                    onConfigChange={handleConfigChange}
                    voiceOptions={voiceOptions}
                    voicesLoading={voicesLoading}
                  />

                  <KnowledgeBaseScriptCard 
                    config={{ knowledgeBaseId: config.knowledgeBaseId, scriptId: config.scriptId }}
                    onConfigChange={handleConfigChange}
                    knowledgeBaseItems={knowledgeBaseItems}
                    scripts={scripts}
                    kbsLoading={kbsLoading}
                    scriptsLoading={scriptsLoading}
                  />
                </div>

                {/* Right Column - System Prompt */}
                <div className="space-y-6">
                  <SystemPromptCard 
                    prompt={config.prompt}
                    onPromptChange={(prompt) => handleConfigChange({ prompt })}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="functions" className="bg-gray-50 flex-1 p-8 m-0">
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-16">
                <Zap className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-medium text-gray-900 mb-3">Functions Coming Soon</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Function configuration will allow you to extend your agent's capabilities with custom actions and integrations.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgentConfiguration;
