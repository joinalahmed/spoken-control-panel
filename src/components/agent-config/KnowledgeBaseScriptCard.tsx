
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen } from 'lucide-react';

interface KnowledgeBaseScriptCardProps {
  config: {
    knowledgeBaseId: string;
    scriptId: string;
  };
  onConfigChange: (updates: Partial<{ knowledgeBaseId: string; scriptId: string }>) => void;
  knowledgeBaseItems: Array<{ id: string; title: string }>;
  scripts: Array<{ id: string; name: string }>;
  kbsLoading: boolean;
  scriptsLoading: boolean;
}

const KnowledgeBaseScriptCard = ({ 
  config, 
  onConfigChange, 
  knowledgeBaseItems, 
  scripts, 
  kbsLoading, 
  scriptsLoading 
}: KnowledgeBaseScriptCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Knowledge Base & Script</CardTitle>
        <CardDescription>Link additional context and script information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="knowledgeBase" className="text-sm font-medium text-gray-700">
            Knowledge Base (Optional)
          </Label>
          <Select 
            value={config.knowledgeBaseId} 
            onValueChange={(value) => onConfigChange({ knowledgeBaseId: value })}
            disabled={kbsLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={kbsLoading ? "Loading..." : "Select knowledge base"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">
                <div className="flex items-center gap-2">
                  <span>None</span>
                </div>
              </SelectItem>
              {knowledgeBaseItems.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{item.title}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            Link a knowledge base to provide the agent with additional context and information.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="script" className="text-sm font-medium text-gray-700">
            Script (Optional)
          </Label>
          <Select 
            value={config.scriptId} 
            onValueChange={(value) => onConfigChange({ scriptId: value })}
            disabled={scriptsLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={scriptsLoading ? "Loading..." : "Select script"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">
                <div className="flex items-center gap-2">
                  <span>None</span>
                </div>
              </SelectItem>
              {scripts.map((script) => (
                <SelectItem key={script.id} value={script.id}>
                  <div className="flex items-center gap-2">
                    <span>{script.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            Link a script to define the conversation flow and structure for this agent.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeBaseScriptCard;
