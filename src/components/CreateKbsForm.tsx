
import { useState, useEffect } from 'react';
import { ArrowLeft, Save, FileText, HelpCircle, BookOpen, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useKbs, KbsItem } from '@/hooks/useKbs';

interface CreateKbsFormProps {
  onBack: () => void;
  onSave: (data: any) => void;
  editingItem?: KbsItem | null;
}

const CreateKbsForm = ({ onBack, onSave, editingItem }: CreateKbsFormProps) => {
  const { createKbsItem, updateKbsItem } = useKbs();
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    description: '',
    content: '',
    tags: [] as string[],
    status: 'draft' as 'draft' | 'published'
  });
  const [newTag, setNewTag] = useState('');

  // Populate form data when editing an existing item
  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title || '',
        type: editingItem.type || '',
        description: editingItem.description || '',
        content: editingItem.content || '',
        tags: editingItem.tags || [],
        status: editingItem.status || 'draft'
      });
    }
  }, [editingItem]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.content) {
      return;
    }

    try {
      if (editingItem) {
        // Update existing item
        await updateKbsItem.mutateAsync({
          id: editingItem.id,
          title: formData.title,
          type: formData.type as 'document' | 'faq' | 'guide' | 'other',
          description: formData.description || null,
          content: formData.content,
          tags: formData.tags.length > 0 ? formData.tags : null,
          status: formData.status,
          last_modified: new Date().toISOString()
        });
      } else {
        // Create new item
        await createKbsItem.mutateAsync({
          title: formData.title,
          type: formData.type as 'document' | 'faq' | 'guide' | 'other',
          description: formData.description || null,
          content: formData.content,
          tags: formData.tags.length > 0 ? formData.tags : null,
          status: formData.status,
          date_added: new Date().toISOString(),
          last_modified: new Date().toISOString()
        });
      }
      onSave(formData);
    } catch (error) {
      console.error('Error saving KBS item:', error);
    }
  };

  const isLoading = editingItem ? updateKbsItem.isPending : createKbsItem.isPending;

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack} size="sm" className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {editingItem ? 'Edit KBS Item' : 'Add KBS Item'}
          </h1>
          <p className="text-gray-600">
            {editingItem ? 'Update your knowledge base entry' : 'Create a new KBS entry'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter the title"
                required
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select item type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Document
                    </div>
                  </SelectItem>
                  <SelectItem value="faq">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" />
                      FAQ
                    </div>
                  </SelectItem>
                  <SelectItem value="guide">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Guide
                    </div>
                  </SelectItem>
                  <SelectItem value="other">
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4" />
                      Other
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of the content"
                rows={3}
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Enter the main content here..."
                rows={8}
                required
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button 
                type="submit" 
                className="bg-purple-600 hover:bg-purple-700"
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Saving...' : (editingItem ? 'Update Item' : 'Save Item')}
              </Button>
              <Button type="button" variant="outline" onClick={onBack}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default CreateKbsForm;
