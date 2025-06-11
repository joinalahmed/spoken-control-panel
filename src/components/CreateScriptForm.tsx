import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react';
import { Script } from '@/hooks/useScripts';

interface ScriptSection {
  id: string;
  title: string;
  description?: string;
  steps: ScriptStep[];
}

interface ScriptStep {
  id: string;
  title: string;
  content: string;
  type: 'dialogue' | 'instruction' | 'question' | 'objection-handling';
}

interface CreateScriptFormProps {
  onBack: () => void;
  onSave: (scriptData: any) => void;
  editingScript?: Script | null;
}

const CreateScriptForm: React.FC<CreateScriptFormProps> = ({
  onBack,
  onSave,
  editingScript
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    voice: 'Sarah',
    agentType: 'outbound',
    firstMessage: '',
    company: ''
  });

  const [sections, setSections] = useState<ScriptSection[]>([
    {
      id: '1',
      title: 'Opening',
      description: 'Initial greeting and introduction',
      steps: [
        {
          id: '1-1',
          title: 'Greeting',
          content: 'Hi, this is [Agent Name] from [Company]. How are you today?',
          type: 'dialogue'
        }
      ]
    }
  ]);

  useEffect(() => {
    if (editingScript) {
      setFormData({
        name: editingScript.name,
        description: editingScript.description || '',
        voice: editingScript.voice,
        agentType: editingScript.agent_type,
        firstMessage: editingScript.first_message || '',
        company: editingScript.company || ''
      });

      // Parse sections from script data
      if (editingScript.sections) {
        setSections(editingScript.sections);
      }
    }
  }, [editingScript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine structured script data
    const scriptData = {
      ...formData,
      sections
    };
    
    onSave(scriptData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSection = () => {
    const newSection: ScriptSection = {
      id: Date.now().toString(),
      title: 'New Section',
      description: '',
      steps: []
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (sectionId: string, field: keyof ScriptSection, value: any) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, [field]: value } : section
    ));
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  const addStep = (sectionId: string) => {
    const newStep: ScriptStep = {
      id: `${sectionId}-${Date.now()}`,
      title: 'New Step',
      content: '',
      type: 'dialogue'
    };
    
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, steps: [...section.steps, newStep] }
        : section
    ));
  };

  const updateStep = (sectionId: string, stepId: string, field: keyof ScriptStep, value: any) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            steps: section.steps.map(step => 
              step.id === stepId ? { ...step, [field]: value } : step
            )
          }
        : section
    ));
  };

  const deleteStep = (sectionId: string, stepId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, steps: section.steps.filter(step => step.id !== stepId) }
        : section
    ));
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {editingScript ? 'Edit Script' : 'Create New Script'}
            </h1>
            <p className="text-gray-600">
              {editingScript ? 'Update your script' : 'Design a new call script'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
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

          {/* Script Sections */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Script Sections</CardTitle>
                  <CardDescription>
                    Build your script with sections and steps
                  </CardDescription>
                </div>
                <Button type="button" variant="outline" onClick={addSection}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {sections.map((section, sectionIndex) => (
                <div key={section.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <Input
                        value={section.title}
                        onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                        placeholder="Section title"
                        className="font-medium"
                      />
                      <div className="flex gap-2">
                        <Input
                          value={section.description || ''}
                          onChange={(e) => updateSection(section.id, 'description', e.target.value)}
                          placeholder="Section description (optional)"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => deleteSection(section.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6 space-y-3">
                    {section.steps.map((step, stepIndex) => (
                      <div key={step.id} className="border-l-2 border-gray-200 pl-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <Select
                            value={step.type}
                            onValueChange={(value) => updateStep(section.id, step.id, 'type', value)}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dialogue">Dialogue</SelectItem>
                              <SelectItem value="instruction">Instruction</SelectItem>
                              <SelectItem value="question">Question</SelectItem>
                              <SelectItem value="objection-handling">Objection Handling</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            value={step.title}
                            onChange={(e) => updateStep(section.id, step.id, 'title', e.target.value)}
                            placeholder="Step title"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => deleteStep(section.id, step.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={step.content}
                          onChange={(e) => updateStep(section.id, step.id, 'content', e.target.value)}
                          placeholder="What should the agent say or do in this step?"
                          rows={2}
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addStep(section.id)}
                      className="ml-4"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Step
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button type="submit">
              {editingScript ? 'Update Script' : 'Create Script'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateScriptForm;
