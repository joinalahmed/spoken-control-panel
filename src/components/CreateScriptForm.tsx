
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { Agent } from '@/hooks/useAgents';

interface CreateScriptFormProps {
  onBack: () => void;
  onSave: (scriptData: any) => void;
  editingAgent?: Agent | null;
}

const CreateScriptForm: React.FC<CreateScriptFormProps> = ({
  onBack,
  onSave,
  editingAgent
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    voice: 'Sarah',
    agentType: 'outbound',
    systemPrompt: '',
    firstMessage: '',
    company: ''
  });

  useEffect(() => {
    if (editingAgent) {
      setFormData({
        name: editingAgent.name,
        description: editingAgent.description || '',
        voice: editingAgent.voice,
        agentType: editingAgent.agent_type,
        systemPrompt: editingAgent.system_prompt || '',
        firstMessage: editingAgent.first_message || '',
        company: editingAgent.company || ''
      });
    }
  }, [editingAgent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {editingAgent ? 'Edit Script' : 'Create New Script'}
            </h1>
            <p className="text-gray-600">
              {editingAgent ? 'Update your agent script' : 'Design a new call script for your agent'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Set up the basic details for your script
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Script Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., Sales Outreach Script"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Brief description of this script's purpose"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder="Your company name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="voice">Voice</Label>
                  <Select value={formData.voice} onValueChange={(value) => handleChange('voice', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sarah">Sarah</SelectItem>
                      <SelectItem value="Alice">Alice</SelectItem>
                      <SelectItem value="Charlie">Charlie</SelectItem>
                      <SelectItem value="George">George</SelectItem>
                      <SelectItem value="Laura">Laura</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="agentType">Call Type</Label>
                  <Select value={formData.agentType} onValueChange={(value) => handleChange('agentType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outbound">Outbound</SelectItem>
                      <SelectItem value="inbound">Inbound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Script Content</CardTitle>
              <CardDescription>
                Define how your agent should behave and what to say
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="systemPrompt">System Instructions</Label>
                <Textarea
                  id="systemPrompt"
                  value={formData.systemPrompt}
                  onChange={(e) => handleChange('systemPrompt', e.target.value)}
                  placeholder="Define the agent's role, personality, and behavior guidelines..."
                  rows={4}
                />
                <p className="text-sm text-gray-500 mt-1">
                  This defines how the agent should behave throughout the conversation
                </p>
              </div>

              <div>
                <Label htmlFor="firstMessage">Opening Message</Label>
                <Textarea
                  id="firstMessage"
                  value={formData.firstMessage}
                  onChange={(e) => handleChange('firstMessage', e.target.value)}
                  placeholder="Hi, this is [Agent Name] from [Company]. How are you today?"
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-1">
                  The first message the agent will say when starting a call
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button type="submit">
              {editingAgent ? 'Update Script' : 'Create Script'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateScriptForm;
