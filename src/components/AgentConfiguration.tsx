
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Save, TestTube, Volume2, Brain, Zap } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  voice: string;
  status: string;
  conversations: number;
  lastActive: string;
  description: string;
}

interface AgentConfigurationProps {
  selectedAgent: Agent | null;
}

const AgentConfiguration = ({ selectedAgent }: AgentConfigurationProps) => {
  const [config, setConfig] = useState({
    name: selectedAgent?.name || '',
    description: selectedAgent?.description || '',
    prompt: 'You are a helpful AI assistant...',
    firstMessage: 'Hello! How can I help you today?',
    voice: selectedAgent?.voice || 'Sarah',
    language: 'en',
    temperature: 0.7,
    maxTokens: 1000,
    responseTime: 'fast',
    interruptions: true,
    backgroundNoise: false,
    debugMode: false
  });

  const voices = [
    { id: 'Sarah', name: 'Sarah - Professional Female' },
    { id: 'Alex', name: 'Alex - Friendly Male' },
    { id: 'Charlotte', name: 'Charlotte - Warm Female' },
    { id: 'Brian', name: 'Brian - Confident Male' },
    { id: 'Emma', name: 'Emma - Energetic Female' }
  ];

  if (!selectedAgent) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Brain className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-300 mb-2">No Agent Selected</h3>
            <p className="text-slate-500">Select an agent from the Agents tab to configure its settings</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Configure Agent</h2>
          <p className="text-slate-400">Customize {selectedAgent.name} settings and behavior</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
            <TestTube className="w-4 h-4 mr-2" />
            Test Agent
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700">
          <TabsTrigger value="general" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            General
          </TabsTrigger>
          <TabsTrigger value="voice" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <Volume2 className="w-4 h-4 mr-2" />
            Voice
          </TabsTrigger>
          <TabsTrigger value="behavior" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <Brain className="w-4 h-4 mr-2" />
            Behavior
          </TabsTrigger>
          <TabsTrigger value="advanced" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <Zap className="w-4 h-4 mr-2" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Basic Information</CardTitle>
              <CardDescription className="text-slate-400">Configure the agent's basic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">Agent Name</Label>
                  <Input
                    id="name"
                    value={config.name}
                    onChange={(e) => setConfig({...config, name: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-slate-300">Language</Label>
                  <Select value={config.language} onValueChange={(value) => setConfig({...config, language: value})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300">Description</Label>
                <Textarea
                  id="description"
                  value={config.description}
                  onChange={(e) => setConfig({...config, description: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Agent Prompt</CardTitle>
              <CardDescription className="text-slate-400">Define how your agent should behave and respond</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-slate-300">System Prompt</Label>
                <Textarea
                  id="prompt"
                  value={config.prompt}
                  onChange={(e) => setConfig({...config, prompt: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={5}
                  placeholder="Define your agent's personality, knowledge, and behavior..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstMessage" className="text-slate-300">First Message</Label>
                <Input
                  id="firstMessage"
                  value={config.firstMessage}
                  onChange={(e) => setConfig({...config, firstMessage: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="How should your agent greet users?"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Voice Settings</CardTitle>
              <CardDescription className="text-slate-400">Customize the agent's voice and speech patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="voice" className="text-slate-300">Voice Model</Label>
                <Select value={config.voice} onValueChange={(value) => setConfig({...config, voice: value})}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {voices.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id}>{voice.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-slate-700" />

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="responseTime" className="text-slate-300">Response Speed</Label>
                  <Select value={config.responseTime} onValueChange={(value) => setConfig({...config, responseTime: value})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="fast">Fast (Low latency)</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="quality">High Quality</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="interruptions" className="text-slate-300">Allow Interruptions</Label>
                    <Switch
                      id="interruptions"
                      checked={config.interruptions}
                      onCheckedChange={(checked) => setConfig({...config, interruptions: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="backgroundNoise" className="text-slate-300">Noise Suppression</Label>
                    <Switch
                      id="backgroundNoise"
                      checked={config.backgroundNoise}
                      onCheckedChange={(checked) => setConfig({...config, backgroundNoise: checked})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">AI Behavior</CardTitle>
              <CardDescription className="text-slate-400">Fine-tune the agent's conversational behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature" className="text-slate-300">
                    Creativity Level: {config.temperature}
                  </Label>
                  <input
                    type="range"
                    id="temperature"
                    min="0"
                    max="1"
                    step="0.1"
                    value={config.temperature}
                    onChange={(e) => setConfig({...config, temperature: parseFloat(e.target.value)})}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Conservative</span>
                    <span>Creative</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxTokens" className="text-slate-300">Max Response Length</Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    value={config.maxTokens}
                    onChange={(e) => setConfig({...config, maxTokens: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600 text-white"
                    min="50"
                    max="2000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Advanced Settings</CardTitle>
              <CardDescription className="text-slate-400">Developer and debugging options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="debugMode" className="text-slate-300">Debug Mode</Label>
                  <p className="text-sm text-slate-500">Enable detailed logging and debugging information</p>
                </div>
                <Switch
                  id="debugMode"
                  checked={config.debugMode}
                  onCheckedChange={(checked) => setConfig({...config, debugMode: checked})}
                />
              </div>

              <Separator className="bg-slate-700" />

              <div className="space-y-4">
                <h4 className="text-lg font-medium text-white">API Configuration</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey" className="text-slate-300">ElevenLabs API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="sk-..."
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agentId" className="text-slate-300">Agent ID</Label>
                    <Input
                      id="agentId"
                      placeholder="agent_..."
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentConfiguration;
