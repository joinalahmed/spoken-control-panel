
import { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScripts, Script } from '@/hooks/useScripts';
import { arrayMove } from '@dnd-kit/sortable';
import { DragEndEvent } from '@dnd-kit/core';
import BasicInformation from './script/BasicInformation';
import ScriptSections from './script/ScriptSections';

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
    first_message: '',
    sections: [] as Array<{
      id: string;
      title: string;
      content: string;
      steps?: Array<{ name: string; content: string }>;
    }>
  });

  useEffect(() => {
    console.log('editingScript changed:', editingScript);
    
    if (editingScript) {
      const transformedSections = (editingScript.sections || []).map((section: any, index: number) => {
        console.log('Processing section:', section);
        
        let transformedSteps: Array<{ name: string; content: string }> = [];
        
        if (section.steps && Array.isArray(section.steps)) {
          transformedSteps = section.steps.map((step: any) => {
            console.log('Processing step:', step);
            
            if (typeof step === 'string') {
              if (step.trim() === '') {
                return { name: '', content: '' };
              }
              
              const colonIndex = step.indexOf(':');
              if (colonIndex > 0 && colonIndex < step.length - 1) {
                return {
                  name: step.substring(0, colonIndex).trim(),
                  content: step.substring(colonIndex + 1).trim()
                };
              } else {
                return { name: '', content: step.trim() };
              }
            } else if (step && typeof step === 'object') {
              return {
                name: step.name || step.title || '',
                content: step.content || step.description || ''
              };
            }
            
            return { name: '', content: '' };
          }).filter(step => step.name || step.content);
        }
        
        return {
          id: section.id || `section-${Date.now()}-${index}`,
          title: section.title || section.description || '',
          content: section.content || section.description || '',
          steps: transformedSteps
        };
      });

      console.log('Transformed sections:', transformedSections);

      setFormData({
        name: editingScript.name || '',
        description: editingScript.description || '',
        company: editingScript.company || '',
        first_message: editingScript.first_message || '',
        sections: transformedSections
      });
    } else {
      setFormData({
        name: '',
        description: '',
        company: '',
        first_message: '',
        sections: []
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
      id: `section-${Date.now()}`,
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
    
    if (!formData.name) {
      return;
    }

    try {
      const transformedSections = formData.sections.map(section => ({
        id: section.id,
        title: section.title,
        content: section.content,
        description: section.content,
        steps: (section.steps || []).filter(step => step.name || step.content).map(step => ({
          name: step.name,
          content: step.content,
          title: step.name,
          description: step.content
        }))
      }));

      if (editingScript) {
        await updateScript.mutateAsync({
          id: editingScript.id,
          name: formData.name,
          description: formData.description || null,
          company: formData.company || null,
          first_message: formData.first_message || null,
          sections: transformedSections
        });
      } else {
        await createScript.mutateAsync({
          name: formData.name,
          description: formData.description || null,
          company: formData.company || null,
          first_message: formData.first_message || null,
          sections: transformedSections
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
        <BasicInformation 
          formData={formData}
          onInputChange={handleInputChange}
        />

        <ScriptSections
          sections={formData.sections}
          onAddSection={handleAddSection}
          onUpdateSection={handleUpdateSection}
          onRemoveSection={handleRemoveSection}
          onDragEnd={handleDragEnd}
        />

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
