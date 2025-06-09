
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, Copy, Volume2, Brain, Zap, Settings, ArrowLeft } from 'lucide-react';

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
  onBack?: () => void;
}

const AgentConfiguration = ({ selectedAgent, onBack }: AgentConfigurationProps) => {
  const [config, setConfig] = useState({
    name: selectedAgent?.name || '',
    description: selectedAgent?.description || '',
    prompt: 'You are a voice assistant for Mary\'s Dental, a dental office located at 123 North Face Place, Anaheim, California. The hours are 8 AM to 5PM daily, but they are closed on Sundays.\n\nMary\'s dental provides dental services to the local Anaheim community. The practicing dentist is Dr. Mary Smith.\n\nYou are tasked with answering questions about the business, and booking appointments. If they wish to book an appointment, your goal is to gather necessary information from callers in a friendly and efficient manner like follows:\n\n1. Ask for their full name.\n2. Ask for the purpose of their appointment.\n3. Request their preferred date and time for the appointment.',
    firstMessage: 'Type Name',
    voice: selectedAgent?.voice || 'Sarah',
    language: 'en'
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
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                All Agents
              </Button>
            )}
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
              {/* Left Column - First Message */}
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

              {/* Right Column - System Prompt */}
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
