
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface SystemPromptCardProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
}

const SystemPromptCard = ({ prompt, onPromptChange }: SystemPromptCardProps) => {
  return (
    <Card className="shadow-sm h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">System Prompt</CardTitle>
        <CardDescription>
          Define the agent's role, personality, and instructions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="w-full resize-none"
          rows={20}
          placeholder="You are a helpful assistant..."
        />
        <p className="text-xs text-gray-500">
          The system prompt defines the agent's behavior, personality, and capabilities. 
          Be specific about the agent's role and how it should interact with users.
        </p>
      </CardContent>
    </Card>
  );
};

export default SystemPromptCard;
