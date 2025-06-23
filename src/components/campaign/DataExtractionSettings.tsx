import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';

export interface DataField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date';
  description?: string;
  required?: boolean;
}

interface DataExtractionSettingsProps {
  extractedDataConfig: DataField[];
  onConfigChange: (config: DataField[]) => void;
}

const DataExtractionSettings = ({ extractedDataConfig, onConfigChange }: DataExtractionSettingsProps) => {
  const [newField, setNewField] = useState<Partial<DataField>>({
    name: '',
    type: 'text',
    description: '',
    required: false
  });

  const addField = () => {
    if (!newField.name) return;
    
    const field: DataField = {
      id: `field_${Date.now()}`,
      name: newField.name,
      type: newField.type as DataField['type'],
      description: newField.description,
      required: newField.required || false
    };

    onConfigChange([...extractedDataConfig, field]);
    setNewField({ name: '', type: 'text', description: '', required: false });
  };

  const removeField = (fieldId: string) => {
    onConfigChange(extractedDataConfig.filter(field => field.id !== fieldId));
  };

  const updateField = (fieldId: string, updates: Partial<DataField>) => {
    onConfigChange(
      extractedDataConfig.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Extraction Settings</CardTitle>
        <p className="text-sm text-gray-600">
          Configure what data fields should be extracted from calls in this campaign
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Fields */}
        {extractedDataConfig.map((field) => (
          <div key={field.id} className="flex items-center gap-2 p-3 border rounded-lg">
            <div className="flex-1 grid grid-cols-4 gap-2">
              <Input
                value={field.name}
                onChange={(e) => updateField(field.id, { name: e.target.value })}
                placeholder="Field name"
              />
              <Select 
                value={field.type} 
                onValueChange={(value) => updateField(field.id, { type: value as DataField['type'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={field.description || ''}
                onChange={(e) => updateField(field.id, { description: e.target.value })}
                placeholder="Description (optional)"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.required || false}
                  onChange={(e) => updateField(field.id, { required: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label className="text-xs">Required</Label>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeField(field.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {/* Add New Field */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 grid grid-cols-4 gap-2">
              <Input
                value={newField.name || ''}
                onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                placeholder="Field name"
              />
              <Select 
                value={newField.type || 'text'} 
                onValueChange={(value) => setNewField({ ...newField, type: value as DataField['type'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={newField.description || ''}
                onChange={(e) => setNewField({ ...newField, description: e.target.value })}
                placeholder="Description (optional)"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newField.required || false}
                  onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label className="text-xs">Required</Label>
              </div>
            </div>
            <Button onClick={addField} size="sm" disabled={!newField.name}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataExtractionSettings;
