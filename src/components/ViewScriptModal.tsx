
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Agent } from '@/hooks/useAgents';

interface ScriptSection {
  id: string;
  title: string;
  description?: string;
  steps: ScriptStep[];
}

interface ScriptStep {
  id: string;
  title: string;
  content: string;
  type: 'dialogue' | 'instruction' | 'question' | 'objection-handling';
}

interface ViewScriptModalProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
}

const getStepTypeColor = (type: string) => {
  switch (type) {
    case 'dialogue':
      return 'bg-blue-100 text-blue-800';
    case 'instruction':
      return 'bg-green-100 text-green-800';
    case 'question':
      return 'bg-purple-100 text-purple-800';
    case 'objection-handling':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ViewScriptModal: React.FC<ViewScriptModalProps> = ({
  agent,
  isOpen,
  onClose
}) => {
  if (!agent) return null;

  let sections: ScriptSection[] = [];
  let basePrompt = '';
  let isStructuredPrompt = false;

  // Parse sections from system_prompt
  if (agent.system_prompt) {
    try {
      const parsed = JSON.parse(agent.system_prompt);
      if (parsed.sections && Array.isArray(parsed.sections)) {
        sections = parsed.sections;
        basePrompt = parsed.basePrompt || '';
        isStructuredPrompt = true;
      } else {
        basePrompt = agent.system_prompt;
      }
    } catch {
      basePrompt = agent.system_prompt;
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
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

          {basePrompt && (
            <div>
              <h3 className="font-medium mb-2">
                {isStructuredPrompt ? 'Base Instructions' : 'System Instructions'}
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{basePrompt}</p>
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

          {sections.length > 0 && (
            <div>
              <h3 className="font-medium mb-4">Script Sections</h3>
              <div className="space-y-6">
                {sections.map((section, index) => (
                  <div key={section.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-gray-500">
                        Section {index + 1}
                      </span>
                      <h4 className="text-lg font-semibold">{section.title}</h4>
                    </div>
                    {section.description && (
                      <p className="text-gray-600 text-sm mb-4">{section.description}</p>
                    )}
                    
                    <div className="space-y-3">
                      {section.steps.map((step, stepIndex) => (
                        <div key={step.id} className="border-l-4 border-gray-200 pl-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getStepTypeColor(step.type)}`}
                            >
                              {step.type.replace('-', ' ')}
                            </Badge>
                            <span className="font-medium text-sm">{step.title}</span>
                          </div>
                          <div className="bg-gray-50 p-3 rounded text-sm">
                            <p className="whitespace-pre-wrap">{step.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
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
