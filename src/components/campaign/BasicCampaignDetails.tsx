
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Agent {
  id: string;
  name: string;
  voice: string;
}

interface Script {
  id: string;
  name: string;
}

interface KnowledgeBase {
  id: string;
  title: string;
  type: string;
}

interface BasicCampaignDetailsProps {
  formData: {
    name: string;
    description: string;
    agentId: string;
    scriptId: string;
    knowledgeBaseId: string;
  };
  agents: Agent[];
  scripts: Script[];
  kbs: KnowledgeBase[];
  onInputChange: (field: string, value: string) => void;
}

const BasicCampaignDetails = ({ 
  formData, 
  agents, 
  scripts, 
  kbs, 
  onInputChange 
}: BasicCampaignDetailsProps) => {
  return (
    <div className="space-y-6">
      {/* Campaign Name */}
      <div>
        <Label htmlFor="name">Campaign Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          placeholder="Enter campaign name"
          required
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="Describe the purpose of this campaign"
          rows={3}
        />
      </div>

      {/* Agent Selection */}
      <div>
        <Label htmlFor="agent">Select Agent *</Label>
        <Select onValueChange={(value) => onInputChange('agentId', value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Choose an agent for this campaign" />
          </SelectTrigger>
          <SelectContent>
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.name} - {agent.voice}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {agents.length === 0 && (
          <p className="text-sm text-red-500 mt-1">
            No agents available. Create an agent first.
          </p>
        )}
      </div>

      {/* Script Selection */}
      <div>
        <Label htmlFor="script">Select Script *</Label>
        <Select onValueChange={(value) => onInputChange('scriptId', value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Choose a script for this campaign" />
          </SelectTrigger>
          <SelectContent>
            {scripts.map((script) => (
              <SelectItem key={script.id} value={script.id}>
                {script.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {scripts.length === 0 && (
          <p className="text-sm text-red-500 mt-1">
            No scripts available. Create a script first.
          </p>
        )}
      </div>

      {/* Knowledge Base Selection */}
      <div>
        <Label htmlFor="knowledgeBase">Select Knowledge Base *</Label>
        <Select onValueChange={(value) => onInputChange('knowledgeBaseId', value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Choose a knowledge base for this campaign" />
          </SelectTrigger>
          <SelectContent>
            {kbs.map((kb) => (
              <SelectItem key={kb.id} value={kb.id}>
                {kb.title} - {kb.type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {kbs.length === 0 && (
          <p className="text-sm text-red-500 mt-1">
            No knowledge base items available. Create a knowledge base first.
          </p>
        )}
      </div>
    </div>
  );
};

export default BasicCampaignDetails;
