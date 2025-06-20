
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { KbsItem } from '@/hooks/useKbs';
import { formatDistanceToNow } from 'date-fns';

interface ViewKbsModalProps {
  item: KbsItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewKbsModal = ({ item, isOpen, onClose }: ViewKbsModalProps) => {
  const { toast } = useToast();

  if (!item) return null;

  const handleCopyId = async () => {
    if (item?.id) {
      try {
        await navigator.clipboard.writeText(item.id);
        toast({
          title: "Copied!",
          description: "Knowledge base ID copied to clipboard",
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

  const formatLastModified = (lastModified: string | null) => {
    if (!lastModified) return 'Never';
    return formatDistanceToNow(new Date(lastModified), { addSuffix: true });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-700';
      case 'faq': return 'bg-green-100 text-green-700';
      case 'guide': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-lg font-medium text-gray-600">
                {item.title.charAt(0)}
              </span>
            </div>
            <div>
              <div>{item.title}</div>
              <div className="flex items-center gap-2 text-sm text-gray-500 font-normal">
                <span>ID: {item.id.slice(0, 8)}...</span>
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
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Type</label>
              <div className="mt-1">
                <Badge className={getTypeColor(item.type)}>
                  {item.type}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <Badge 
                  variant={item.status === 'published' ? 'default' : 'secondary'}
                  className={item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                >
                  {item.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="text-gray-900 mt-1">{item.description}</p>
            </div>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-500">Tags</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {item.tags.map(tag => (
                  <span key={tag} className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div>
            <label className="text-sm font-medium text-gray-500">Content</label>
            <div className="mt-1 p-4 bg-gray-50 rounded-lg border max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-900 font-sans">
                {item.content || 'No content available'}
              </pre>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Date Added</label>
              <p className="text-gray-900">{item.date_added ? new Date(item.date_added).toLocaleDateString() : 'Unknown'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Modified</label>
              <p className="text-gray-900">{formatLastModified(item.last_modified)}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewKbsModal;
