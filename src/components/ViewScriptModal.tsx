
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Agent } from '@/hooks/useAgents';

interface ViewScriptModalProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewScriptModal: React.FC<ViewScriptModalProps> = ({
  agent,
  isOpen,
  onClose
}) => {
  if (!agent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {agent.name}
            <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
              {agent.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Script details and configuration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Voice:</span>
                <span className="ml-2">{agent.voice}</span>
              </div>
              <div>
                <span className="text-gray-500">Type:</span>
                <span className="ml-2 capitalize">{agent.agent_type}</span>
              </div>
              <div>
                <span className="text-gray-500">Conversations:</span>
                <span className="ml-2">{agent.conversations}</span>
              </div>
              {agent.company && (
                <div>
                  <span className="text-gray-500">Company:</span>
                  <span className="ml-2">{agent.company}</span>
                </div>
              )}
            </div>
            {agent.description && (
              <div className="mt-3">
                <span className="text-gray-500">Description:</span>
                <p className="mt-1">{agent.description}</p>
              </div>
            )}
          </div>

          <Separator />

          {agent.system_prompt && (
            <div>
              <h3 className="font-medium mb-2">System Instructions</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{agent.system_prompt}</p>
              </div>
            </div>
          )}

          {agent.first_message && (
            <div>
              <h3 className="font-medium mb-2">Opening Message</h3>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-200">
                <p className="text-sm whitespace-pre-wrap">{agent.first_message}</p>
              </div>
            </div>
          )}

          <div>
            <h3 className="font-medium mb-2">Timestamps</h3>
            <div className="text-sm text-gray-500 space-y-1">
              <div>Created: {new Date(agent.created_at).toLocaleString()}</div>
              <div>Updated: {new Date(agent.updated_at).toLocaleString()}</div>
              {agent.last_active && (
                <div>Last Active: {new Date(agent.last_active).toLocaleString()}</div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewScriptModal;
