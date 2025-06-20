
import { Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
} from '@dnd-kit/sortable';
import SortableSection from './SortableSection';

interface Section {
  id: string;
  title: string;
  content: string;
  steps?: Array<{ name: string; content: string }>;
}

interface ScriptSectionsProps {
  sections: Section[];
  onAddSection: () => void;
  onUpdateSection: (index: number, field: string, value: any) => void;
  onRemoveSection: (index: number) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

const ScriptSections = ({
  sections,
  onAddSection,
  onUpdateSection,
  onRemoveSection,
  onDragEnd
}: ScriptSectionsProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Script Sections</CardTitle>
          <Button
            type="button"
            onClick={onAddSection}
            variant="outline"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {sections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No sections added yet. Click "Add Section" to get started.</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={sections.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((section, index) => (
                <SortableSection
                  key={section.id}
                  section={section}
                  index={index}
                  onUpdate={onUpdateSection}
                  onRemove={onRemoveSection}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  );
};

export default ScriptSections;
