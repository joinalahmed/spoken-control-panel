
import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2, GripVertical, FileText, HelpCircle, BookOpen, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useScripts, Script } from '@/hooks/useScripts';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableSectionProps {
  section: {
    id: string;
    title: string;
    content: string;
    steps?: string[];
  };
  index: number;
  onUpdate: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
}

const SortableSection = ({ section, index, onUpdate, onRemove }: SortableSectionProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleAddStep = () => {
    const currentSteps = section.steps || [];
    onUpdate(index, 'steps', [...currentSteps, '']);
  };

  const handleUpdateStep = (stepIndex: number, value: string) => {
    const currentSteps = section.steps || [];
    const updatedSteps = [...currentSteps];
    updatedSteps[stepIndex] = value;
    onUpdate(index, 'steps', updatedSteps);
  };

  const handleRemoveStep = (stepIndex: number) => {
    const currentSteps = section.steps || [];
    const updatedSteps = currentSteps.filter((_, i) => i !== stepIndex);
    onUpdate(index, 'steps', updatedSteps);
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:cursor-grabbing p-1 rounded hover:bg-gray-100"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        <Input
          value={section.title}
          onChange={(e) => onUpdate(index, 'title', e.target.value)}
          placeholder="Section title"
          className="flex-1"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor={`section-content-${index}`}>Content</Label>
          <Textarea
            id={`section-content-${index}`}
            value={section.content}
            onChange={(e) => onUpdate(index, 'content', e.target.value)}
            placeholder="Section content or instructions"
            rows={3}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Steps (Optional)</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddStep}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Step
            </Button>
          </div>
          
          {(section.steps || []).map((step, stepIndex) => (
            <div key={stepIndex} className="flex gap-2 mb-2">
              <Input
                value={step}
                onChange={(e) => handleUpdateStep(stepIndex, e.target.value)}
                placeholder={`Step ${stepIndex + 1}`}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRemoveStep(stepIndex)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface CreateScriptFormProps {
  onBack: () => void;
  onSave: (data: any) => void;
  editingScript?: Script | null;
}

const CreateScriptForm = ({ onBack, onSave, editingScript }: CreateScriptFormProps) => {
  const { createScript, updateScript } = useScripts();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    company: '',
    agent_type: 'outbound' as 'inbound' | 'outbound',
    voice: '',
    first_message: '',
    sections: [] as Array<{
      id: string;
      title: string;
      content: string;
      steps?: string[];
    }>
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Populate form data when editing an existing script
  useEffect(() => {
    if (editingScript) {
      setFormData({
        name: editingScript.name || '',
        description: editingScript.description || '',
        company: editingScript.company || '',
        agent_type: editingScript.agent_type || 'outbound',
        voice: editingScript.voice || '',
        first_message: editingScript.first_message || '',
        sections: editingScript.sections || []
      });
    }
  }, [editingScript]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSection = () => {
    const newSection = {
      id: Date.now().toString(),
      title: '',
      content: '',
      steps: []
    };
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const handleUpdateSection = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      )
    }));
  };

  const handleRemoveSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFormData(prev => {
        const oldIndex = prev.sections.findIndex(section => section.id === active.id);
        const newIndex = prev.sections.findIndex(section => section.id === over.id);

        return {
          ...prev,
          sections: arrayMove(prev.sections, oldIndex, newIndex)
        };
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.agent_type || !formData.voice) {
      return;
    }

    try {
      if (editingScript) {
        // Update existing script
        await updateScript.mutateAsync({
          id: editingScript.id,
          name: formData.name,
          description: formData.description || null,
          company: formData.company || null,
          agent_type: formData.agent_type,
          voice: formData.voice,
          first_message: formData.first_message || null,
          sections: formData.sections
        });
      } else {
        // Create new script
        await createScript.mutateAsync({
          name: formData.name,
          description: formData.description || null,
          company: formData.company || null,
          agent_type: formData.agent_type,
          voice: formData.voice,
          first_message: formData.first_message || null,
          sections: formData.sections
        });
      }
      onSave(formData);
    } catch (error) {
      console.error('Error saving script:', error);
    }
  };

  const isLoading = editingScript ? updateScript.isPending : createScript.isPending;

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack} size="sm" className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {editingScript ? 'Edit Script' : 'Create New Script'}
          </h1>
          <p className="text-gray-600">
            {editingScript ? 'Update your conversation script' : 'Design a conversation flow for your agent'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        {/* Basic Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Script Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Script Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Sales Outreach Script"
                  required
                />
              </div>

              {/* Company */}
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Your company name"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of this script's purpose"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Agent Type */}
              <div className="space-y-2">
                <Label htmlFor="agent_type">Agent Type *</Label>
                <Select 
                  value={formData.agent_type} 
                  onValueChange={(value) => handleInputChange('agent_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select agent type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inbound">Inbound</SelectItem>
                    <SelectItem value="outbound">Outbound</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Voice */}
              <div className="space-y-2">
                <Label htmlFor="voice">Voice *</Label>
                <Select 
                  value={formData.voice} 
                  onValueChange={(value) => handleInputChange('voice', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alloy">Alloy</SelectItem>
                    <SelectItem value="echo">Echo</SelectItem>
                    <SelectItem value="fable">Fable</SelectItem>
                    <SelectItem value="onyx">Onyx</SelectItem>
                    <SelectItem value="nova">Nova</SelectItem>
                    <SelectItem value="shimmer">Shimmer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* First Message */}
            <div className="space-y-2">
              <Label htmlFor="first_message">First Message</Label>
              <Textarea
                id="first_message"
                value={formData.first_message}
                onChange={(e) => handleInputChange('first_message', e.target.value)}
                placeholder="The opening message your agent will use"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Script Sections */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Script Sections</CardTitle>
              <Button
                type="button"
                onClick={handleAddSection}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {formData.sections.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No sections added yet. Click "Add Section" to get started.</p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={formData.sections.map(s => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {formData.sections.map((section, index) => (
                    <SortableSection
                      key={section.id}
                      section={section}
                      index={index}
                      onUpdate={handleUpdateSection}
                      onRemove={handleRemoveSection}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            type="submit" 
            className="bg-purple-600 hover:bg-purple-700"
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : (editingScript ? 'Update Script' : 'Save Script')}
          </Button>
          <Button type="button" variant="outline" onClick={onBack}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateScriptForm;
