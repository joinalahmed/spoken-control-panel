
import { Label } from '@/components/ui/label';

interface Contact {
  id: string;
  name: string;
  email?: string;
}

interface ContactSelectionProps {
  contacts: Contact[];
  selectedContactIds: string[];
  onContactToggle: (contactId: string) => void;
}

const ContactSelection = ({ 
  contacts, 
  selectedContactIds, 
  onContactToggle 
}: ContactSelectionProps) => {
  return (
    <div>
      <Label>Select Contacts *</Label>
      <div className="mt-2 max-h-64 overflow-y-auto border rounded-md p-4">
        {contacts.length === 0 ? (
          <p className="text-sm text-red-500">
            No contacts available. Create contacts first.
          </p>
        ) : (
          <div className="space-y-2">
            {contacts.map((contact) => (
              <label key={contact.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedContactIds.includes(contact.id)}
                  onChange={() => onContactToggle(contact.id)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">
                  {contact.name} {contact.email && `(${contact.email})`}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
      <p className="text-sm text-gray-500 mt-1">
        Selected: {selectedContactIds.length} contact(s)
      </p>
    </div>
  );
};

export default ContactSelection;
