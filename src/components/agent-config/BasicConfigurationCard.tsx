
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'other', label: 'Other' },
];

interface BasicConfigurationCardProps {
  config: {
    name: string;
    description: string;
    gender: string;
  };
  onConfigChange: (updates: Partial<{ name: string; description: string; gender: string }>) => void;
}

const BasicConfigurationCard = ({ config, onConfigChange }: BasicConfigurationCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Basic Configuration</CardTitle>
        <CardDescription>Configure the basic settings for your agent</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Agent Name */}
        <div className="space-y-2">
          <Label htmlFor="agentName" className="text-sm font-medium text-gray-700">
            Agent Name
          </Label>
          <Input
            id="agentName"
            value={config.name}
            onChange={(e) => onConfigChange({ name: e.target.value })}
            className="w-full"
            placeholder="Enter agent name"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium text-gray-700">
            Description
          </Label>
          <Textarea
            id="description"
            value={config.description || ''}
            onChange={(e) => onConfigChange({ description: e.target.value })}
            className="w-full resize-none"
            rows={3}
            placeholder="Describe what this agent does..."
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
            Gender (Optional)
          </Label>
          <Select value={config.gender} onValueChange={(value) => onConfigChange({ gender: value })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None specified</SelectItem>
              {GENDER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicConfigurationCard;
