
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Phone, Copy, Volume2, Brain, Zap, Settings } from 'lucide-react';

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
    prompt: 'You are a voice assistant for Mary\'s Dental, a dental office located at 123 North Face Place, Anaheim, California. The hours are 8 AM to 5PM daily, but they are closed on Sundays.\n\nMary\'s dental provides dental services to the local Anaheim community. The practicing dentist is Dr. Mary Smith.\n\nYou are tasked with answering questions about the business, and booking appointments. If they wish to book an appointment, your goal is to gather necessary information from callers in a friendly and efficient manner like follows:\n\n1. Ask for their full name.\n2. Ask for the purpose of their appointment.\n3. Request their preferred date and time for the appointment.',
    firstMessage: 'Type Name',
    voice: selectedAgent?.voice || 'Sarah',
    language: 'en',
    temperature: 7,
    maxTokens: 23,
    detectEmotion: true,
    training: 'Select Files'
  });

  if (!selectedAgent) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Agent Selected</h3>
          <p className="text-gray-500">Select an agent from the list to configure its settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">{selectedAgent.name}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>lwigfweg0wee</span>
              <Button size="sm" variant="ghost" className="p-1">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Phone className="w-4 h-4" />
              Talk with your Agent
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
              Update
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <Tabs defaultValue="model" className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-0 h-auto p-0">
            <TabsTrigger 
              value="model" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none px-6 py-4"
            >
              <Brain className="w-4 h-4 mr-2" />
              Model
            </TabsTrigger>
            <TabsTrigger 
              value="voice" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none px-6 py-4"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Voice
            </TabsTrigger>
            <TabsTrigger 
              value="functions" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none px-6 py-4"
            >
              <Zap className="w-4 h-4 mr-2" />
              Functions
            </TabsTrigger>
            <TabsTrigger 
              value="advanced" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none px-6 py-4"
            >
              <Settings className="w-4 h-4 mr-2" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="model" className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="training" className="text-sm font-medium text-gray-700">Training</Label>
                  <Select value={config.training} onValueChange={(value) => setConfig({...config, training: value})}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Select Files">Select Files</SelectItem>
                      <SelectItem value="file1">Training File 1</SelectItem>
                      <SelectItem value="file2">Training File 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature" className="text-sm font-medium text-gray-700">Temperature</Label>
                  <div className="relative">
                    <input
                      type="range"
                      id="temperature"
                      min="0"
                      max="10"
                      value={config.temperature}
                      onChange={(e) => setConfig({...config, temperature: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${config.temperature * 10}%, #e5e7eb ${config.temperature * 10}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-2 py-1 rounded text-sm">
                      {config.temperature}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxTokens" className="text-sm font-medium text-gray-700">Max Tokens</Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    value={config.maxTokens}
                    onChange={(e) => setConfig({...config, maxTokens: parseInt(e.target.value)})}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="detectEmotion" className="text-sm font-medium text-gray-700">Detect Emotion</Label>
                  <Switch
                    id="detectEmotion"
                    checked={config.detectEmotion}
                    onCheckedChange={(checked) => setConfig({...config, detectEmotion: checked})}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="firstMessage" className="text-sm font-medium text-gray-700">First Message</Label>
                  <Input
                    id="firstMessage"
                    value={config.firstMessage}
                    onChange={(e) => setConfig({...config, firstMessage: e.target.value})}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    The first message that the assistant will say. This can also be a URL to a containerized audio file (mp3, wav, etc.).
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt" className="text-sm font-medium text-gray-700">System Prompt</Label>
                  <Textarea
                    id="prompt"
                    value={config.prompt}
                    onChange={(e) => setConfig({...config, prompt: e.target.value})}
                    className="w-full h-64 resize-none"
                  />
                  <p className="text-xs text-gray-500">
                    The system prompt can be used to configure the context, role, personality, instructions and so on for the assistant.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="voice" className="p-6">
            <div className="text-center py-12">
              <Volume2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Voice Configuration</h3>
              <p className="text-gray-500">Voice settings will be available here</p>
            </div>
          </TabsContent>

          <TabsContent value="functions" className="p-6">
            <div className="text-center py-12">
              <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Functions</h3>
              <p className="text-gray-500">Function configuration will be available here</p>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="p-6">
            <div className="text-center py-12">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Settings</h3>
              <p className="text-gray-500">Advanced configuration will be available here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgentConfiguration;
