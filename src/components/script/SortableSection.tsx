
import { GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import StepEditor from './StepEditor';

interface Section {
  id: string;
  title: string;
  content: string;
  steps?: Array<{ name: string; content: string }>;
}

interface SortableSectionProps {
  section: Section;
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

  const handleUpdateSteps = (sectionIndex: number, steps: Array<{ name: string; content: string }>) => {
    onUpdate(sectionIndex, 'steps', steps);
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
          type="button"
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

        <StepEditor
          steps={section.steps || []}
          sectionIndex={index}
          onUpdateSteps={handleUpdateSteps}
        />
      </div>
    </div>
  );
};

export default SortableSection;
