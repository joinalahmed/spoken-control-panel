
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Contact } from '@/hooks/useContacts';
import { formatDistanceToNow } from 'date-fns';

interface ViewContactModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewContactModal = ({ contact, isOpen, onClose }: ViewContactModalProps) => {
  if (!contact) return null;

  const formatLastCalled = (lastCalled: string | null) => {
    if (!lastCalled) return 'Never';
    return formatDistanceToNow(new Date(lastCalled), { addSuffix: true });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-lg font-medium text-gray-600">
                {contact.name.charAt(0)}
              </span>
            </div>
            Contact Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-gray-900 font-medium">{contact.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <Badge 
                  variant={contact.status === 'active' ? 'default' : 'secondary'}
                  className={contact.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                >
                  {contact.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{contact.email || 'No email provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-gray-900">{contact.phone || 'No phone provided'}</p>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <label className="text-sm font-medium text-gray-500">Address</label>
            <p className="text-gray-900">
              {contact.address || contact.city || contact.state || contact.zip_code 
                ? `${contact.address || ''} ${contact.city || ''} ${contact.state || ''} ${contact.zip_code || ''}`.trim()
                : 'No address provided'
              }
            </p>
          </div>

          {/* Call Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Last Called</label>
              <p className="text-gray-900">{formatLastCalled(contact.last_called)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Created</label>
              <p className="text-gray-900">{new Date(contact.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewContactModal;
