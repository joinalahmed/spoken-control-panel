
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BasicInformationProps {
  formData: {
    name: string;
    description: string;
    company: string;
    first_message: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const BasicInformation = ({ formData, onInputChange }: BasicInformationProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Script Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              placeholder="e.g., Sales Outreach Script"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => onInputChange('company', e.target.value)}
              placeholder="Your company name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            placeholder="Brief description of this script's purpose"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="first_message">First Message</Label>
          <Textarea
            id="first_message"
            value={formData.first_message}
            onChange={(e) => onInputChange('first_message', e.target.value)}
            placeholder="The opening message your agent will use"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInformation;
