
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useAgents } from '@/hooks/useAgents';

interface ScriptsListProps {
  onCreateScript: () => void;
  onEditScript: (agentId: string) => void;
  onViewScript: (agentId: string) => void;
}

const ScriptsList: React.FC<ScriptsListProps> = ({
  onCreateScript,
  onEditScript,
  onViewScript
}) => {
  const { agents, isLoading, deleteAgent } = useAgents();

  const handleDeleteScript = async (agentId: string, agentName: string) => {
    if (window.confirm(`Are you sure you want to delete the script for "${agentName}"?`)) {
      try {
        await deleteAgent.mutateAsync(agentId);
      } catch (error) {
        console.error('Error deleting script:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Scripts</h1>
          </div>
          <div className="text-center py-8">Loading scripts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Scripts</h1>
            <p className="text-gray-600">Develop and manage call scripts for your agents</p>
          </div>
          <Button onClick={onCreateScript}>
            <Plus className="w-4 h-4 mr-2" />
            Create Script
          </Button>
        </div>

        {agents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">No scripts yet</h3>
                <p className="text-gray-600 mb-4">
                  Create your first script to define how your agents should interact during calls
                </p>
                <Button onClick={onCreateScript}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Script
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {agent.name}
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          agent.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : agent.status === 'training'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {agent.status}
                        </span>
                      </CardTitle>
                      <CardDescription>
                        {agent.description || 'No description available'}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewScript(agent.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditScript(agent.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteScript(agent.id, agent.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Voice: {agent.voice}</span>
                      <span>Type: {agent.agent_type}</span>
                      <span>Conversations: {agent.conversations}</span>
                    </div>
                    {agent.system_prompt && (
                      <div className="text-sm">
                        <strong>System Prompt:</strong>
                        <p className="mt-1 text-gray-600 line-clamp-2">
                          {agent.system_prompt}
                        </p>
                      </div>
                    )}
                    {agent.first_message && (
                      <div className="text-sm">
                        <strong>Opening Message:</strong>
                        <p className="mt-1 text-gray-600 line-clamp-2">
                          {agent.first_message}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScriptsList;
