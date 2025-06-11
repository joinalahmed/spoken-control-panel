
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Script } from '@/hooks/useScripts';

interface ViewScriptModalProps {
  script: Script | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewScriptModal: React.FC<ViewScriptModalProps> = ({
  script,
  isOpen,
  onClose
}) => {
  if (!script) return null;

  const getStepTypeColor = (type: string) => {
    switch (type) {
      case 'dialogue':
        return 'bg-blue-100 text-blue-800';
      case 'instruction':
        return 'bg-green-100 text-green-800';
      case 'question':
        return 'bg-yellow-100 text-yellow-800';
      case 'objection-handling':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {script.name}
            <Badge variant="outline" className="capitalize">
              {script.agent_type}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {script.description || 'No description available'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Voice:</span>
                  <span className="ml-2">{script.voice}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Type:</span>
                  <span className="ml-2 capitalize">{script.agent_type}</span>
                </div>
                {script.company && (
                  <div className="col-span-2">
                    <span className="font-medium text-gray-700">Company:</span>
                    <span className="ml-2">{script.company}</span>
                  </div>
                )}
              </div>
              
              {script.first_message && (
                <div>
                  <span className="font-medium text-gray-700">Opening Message:</span>
                  <p className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
                    {script.first_message}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Script Sections */}
          {script.sections && script.sections.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Script Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {script.sections.map((section: any, sectionIndex: number) => (
                  <div key={section.id || sectionIndex} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{section.title}</h3>
                      {section.description && (
                        <span className="text-sm text-gray-600">{section.description}</span>
                      )}
                    </div>
                    
                    {section.steps && section.steps.length > 0 && (
                      <div className="space-y-3">
                        {section.steps.map((step: any, stepIndex: number) => (
                          <div key={step.id || stepIndex} className="border-l-2 border-gray-200 pl-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge 
                                variant="secondary" 
                                className={getStepTypeColor(step.type)}
                              >
                                {step.type}
                              </Badge>
                              <span className="font-medium">{step.title}</span>
                            </div>
                            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                              {step.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewScriptModal;
