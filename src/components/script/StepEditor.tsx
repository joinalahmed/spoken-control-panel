
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Step {
  name: string;
  content: string;
}

interface StepEditorProps {
  steps: Step[];
  sectionIndex: number;
  onUpdateSteps: (sectionIndex: number, steps: Step[]) => void;
}

const StepEditor = ({ steps, sectionIndex, onUpdateSteps }: StepEditorProps) => {
  const handleAddStep = () => {
    const newSteps = [...steps, { name: '', content: '' }];
    onUpdateSteps(sectionIndex, newSteps);
  };

  const handleUpdateStep = (stepIndex: number, field: 'name' | 'content', value: string) => {
    const updatedSteps = [...steps];
    updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], [field]: value };
    onUpdateSteps(sectionIndex, updatedSteps);
  };

  const handleRemoveStep = (stepIndex: number) => {
    const updatedSteps = steps.filter((_, i) => i !== stepIndex);
    onUpdateSteps(sectionIndex, updatedSteps);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label>Steps (Optional)</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddStep}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Step
        </Button>
      </div>
      
      {steps.map((step, stepIndex) => (
        <div key={stepIndex} className="border border-gray-200 rounded-lg p-4 mb-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">Step {stepIndex + 1}</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleRemoveStep(stepIndex)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor={`step-name-${sectionIndex}-${stepIndex}`}>Step Name</Label>
              <Input
                id={`step-name-${sectionIndex}-${stepIndex}`}
                value={step.name}
                onChange={(e) => handleUpdateStep(stepIndex, 'name', e.target.value)}
                placeholder="Enter step name"
              />
            </div>
            
            <div>
              <Label htmlFor={`step-content-${sectionIndex}-${stepIndex}`}>Step Content</Label>
              <Textarea
                id={`step-content-${sectionIndex}-${stepIndex}`}
                value={step.content}
                onChange={(e) => handleUpdateStep(stepIndex, 'content', e.target.value)}
                placeholder="Enter step content or description"
                rows={2}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepEditor;
