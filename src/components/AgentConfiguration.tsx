
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Settings, Zap, ArrowLeft, BookOpen, Save } from 'lucide-react';
import { Agent } from '@/hooks/useAgents';
import { useKbs } from '@/hooks/useKbs';
import { useScripts } from '@/hooks/useScripts';
import { useCustomVoices } from '@/hooks/useCustomVoices';
import { Badge } from '@/components/ui/badge';
import { generateRandomAvatar, getInitials } from '@/utils/avatarUtils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AgentConfigurationProps {
  selectedAgent: Agent | null;
  onBack?: () => void;
  onUpdate?: (agentData: any) => void;
}

const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
];

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'other', label: 'Other' },
];

const AgentConfiguration = ({ selectedAgent, onBack, onUpdate }: AgentConfigurationProps) => {
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

  const handleLanguageToggle = (languageCode: string) => {
    setConfig(prev => ({
      ...prev,
      languages: prev.languages.includes(languageCode)
        ? prev.languages.filter(lang => lang !== languageCode)
        : [...prev.languages, languageCode]
    }));
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
                  <Button size="sm" variant="ghost" className="p-1 h-auto">
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
                  <Card className="shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Basic Configuration</CardTitle>
                      <CardDescription>Configure the basic settings for your agent</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Agent Name */}
                      <div className="space-y-2">
                        <Label htmlFor="agentName" className="text-sm font-medium text-gray-700">
                          Agent Name
                        </Label>
                        <Input
                          id="agentName"
                          value={config.name}
                          onChange={(e) => setConfig({...config, name: e.target.value})}
                          className="w-full"
                          placeholder="Enter agent name"
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          value={config.description || ''}
                          onChange={(e) => setConfig({...config, description: e.target.value})}
                          className="w-full resize-none"
                          rows={3}
                          placeholder="Describe what this agent does..."
                        />
                      </div>

                      {/* Gender */}
                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                          Gender (Optional)
                        </Label>
                        <Select value={config.gender} onValueChange={(value) => setConfig({...config, gender: value})}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None specified</SelectItem>
                            {GENDER_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Voice & Language</CardTitle>
                      <CardDescription>Configure voice and language settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* First Message */}
                      <div className="space-y-2">
                        <Label htmlFor="firstMessage" className="text-sm font-medium text-gray-700">
                          First Message
                        </Label>
                        <Input
                          id="firstMessage"
                          value={config.firstMessage}
                          onChange={(e) => setConfig({...config, firstMessage: e.target.value})}
                          className="w-full"
                          placeholder="Hello! How can I help you today?"
                        />
                        <p className="text-xs text-gray-500">
                          The first message that the assistant will say when starting a conversation.
                        </p>
                      </div>

                      {/* Voice Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="voice" className="text-sm font-medium text-gray-700">
                          Voice
                        </Label>
                        <Select 
                          value={config.voice} 
                          onValueChange={(value) => setConfig({...config, voice: value})}
                          disabled={voicesLoading}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={voicesLoading ? "Loading voices..." : voiceOptions.length === 0 ? "No custom voices available" : "Select voice"} />
                          </SelectTrigger>
                          <SelectContent>
                            {voiceOptions.length === 0 && !voicesLoading ? (
                              <SelectItem value="no-voices" disabled>
                                No custom voices available
                              </SelectItem>
                            ) : (
                              voiceOptions.map((voice) => (
                                <SelectItem key={voice.id} value={voice.id}>
                                  {voice.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        {voicesLoading && (
                          <p className="text-xs text-gray-500">Loading custom voices...</p>
                        )}
                        {voiceOptions.length === 0 && !voicesLoading && (
                          <p className="text-xs text-gray-500">
                            No custom voices found. Please add custom voices in Settings to see them here.
                          </p>
                        )}
                      </div>

                      {/* Languages */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Languages (Multi-select)
                        </Label>
                        <div className="border rounded-lg p-3 max-h-48 overflow-y-auto">
                          <div className="grid grid-cols-2 gap-2">
                            {AVAILABLE_LANGUAGES.map((language) => (
                              <label key={language.code} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={config.languages.includes(language.code)}
                                  onChange={() => handleLanguageToggle(language.code)}
                                  className="rounded border-gray-300"
                                />
                                <span className="text-sm">{language.name}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {config.languages.map((langCode) => {
                            const language = AVAILABLE_LANGUAGES.find(l => l.code === langCode);
                            return (
                              <Badge key={langCode} variant="outline" className="text-xs">
                                {language?.name || langCode.toUpperCase()}
                              </Badge>
                            );
                          })}
                        </div>
                        <p className="text-xs text-gray-500">
                          Select the languages this agent can communicate in.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Knowledge Base & Script</CardTitle>
                      <CardDescription>Link additional context and script information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="knowledgeBase" className="text-sm font-medium text-gray-700">
                          Knowledge Base (Optional)
                        </Label>
                        <Select 
                          value={config.knowledgeBaseId} 
                          onValueChange={(value) => setConfig({...config, knowledgeBaseId: value})}
                          disabled={kbsLoading}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={kbsLoading ? "Loading..." : "Select knowledge base"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">
                              <div className="flex items-center gap-2">
                                <span>None</span>
                              </div>
                            </SelectItem>
                            {knowledgeBaseItems.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                <div className="flex items-center gap-2">
                                  <BookOpen className="w-4 h-4" />
                                  <span>{item.title}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                          Link a knowledge base to provide the agent with additional context and information.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="script" className="text-sm font-medium text-gray-700">
                          Script (Optional)
                        </Label>
                        <Select 
                          value={config.scriptId} 
                          onValueChange={(value) => setConfig({...config, scriptId: value})}
                          disabled={scriptsLoading}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={scriptsLoading ? "Loading..." : "Select script"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">
                              <div className="flex items-center gap-2">
                                <span>None</span>
                              </div>
                            </SelectItem>
                            {scripts.map((script) => (
                              <SelectItem key={script.id} value={script.id}>
                                <div className="flex items-center gap-2">
                                  <span>{script.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                          Link a script to define the conversation flow and structure for this agent.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - System Prompt */}
                <div className="space-y-6">
                  <Card className="shadow-sm h-fit">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">System Prompt</CardTitle>
                      <CardDescription>
                        Define the agent's role, personality, and instructions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        id="prompt"
                        value={config.prompt}
                        onChange={(e) => setConfig({...config, prompt: e.target.value})}
                        className="w-full resize-none"
                        rows={20}
                        placeholder="You are a helpful assistant..."
                      />
                      <p className="text-xs text-gray-500">
                        The system prompt defines the agent's behavior, personality, and capabilities. 
                        Be specific about the agent's role and how it should interact with users.
                      </p>
                    </CardContent>
                  </Card>
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
