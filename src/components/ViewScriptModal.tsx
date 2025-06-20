
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();

  const handleCopyId = async () => {
    if (script?.id) {
      try {
        await navigator.clipboard.writeText(script.id);
        toast({
          title: "Copied!",
          description: "Script ID copied to clipboard",
        });
      } catch (err) {
        toast({
          title: "Failed to copy",
          description: "Could not copy ID to clipboard",
          variant: "destructive",
        });
      }
    }
  };

  if (!script) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <div>
              <div>{script.name}</div>
              <div className="flex items-center gap-2 text-sm text-gray-500 font-normal">
                <span>ID: {script.id.slice(0, 8)}...</span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="p-1 h-auto"
                  onClick={handleCopyId}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
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
              <div className="grid grid-cols-1 gap-4 text-sm">
                {script.company && (
                  <div>
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
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg">{section.title || `Section ${sectionIndex + 1}`}</h3>
                    </div>
                    
                    {section.content && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                          {section.content}
                        </p>
                      </div>
                    )}
                    
                    {section.steps && section.steps.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-800">Steps:</h4>
                        {section.steps.map((step: any, stepIndex: number) => {
                          const stepName = step.title || step.name;
                          const stepContent = step.content || step.description;
                          
                          return (
                            <div key={step.id || stepIndex} className="border-l-4 border-blue-200 pl-4">
                              {stepName && (
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-medium text-blue-700">
                                    {stepName}
                                  </span>
                                </div>
                              )}
                              {stepContent && (
                                <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded">
                                  {stepContent}
                                </p>
                              )}
                              {!stepName && !stepContent && (
                                <p className="text-sm text-gray-500 italic">
                                  Step {stepIndex + 1} - No content available
                                </p>
                              )}
                            </div>
                          );
                        })}
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
