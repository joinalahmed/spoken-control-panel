
import React, { useState } from 'react';
import { useContacts } from '@/hooks/useContacts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface AddContactToCampaignProps {
  campaignId: string;
  currentContactIds: string[];
  isOpen: boolean;
  onClose: () => void;
  onContactsAdded: () => void;
}

const AddContactToCampaign: React.FC<AddContactToCampaignProps> = ({
  campaignId,
  currentContactIds,
  isOpen,
  onClose,
  onContactsAdded
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const { contacts, isLoading: contactsLoading } = useContacts();
  const queryClient = useQueryClient();

  // Filter contacts that aren't already in the campaign
  const availableContacts = contacts.filter(contact => 
    !currentContactIds.includes(contact.id) &&
    (contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (contact.phone && contact.phone.includes(searchTerm)) ||
     (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const handleContactToggle = (contactId: string) => {
    setSelectedContactIds(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleAddContacts = async () => {
    if (selectedContactIds.length === 0) {
      toast.error('Please select at least one contact');
      return;
    }

    setIsAdding(true);
    try {
      console.log('Adding contacts to campaign:', { campaignId, selectedContactIds });
      
      // Create campaign_contacts entries
      const campaignContacts = selectedContactIds.map(contactId => ({
        campaign_id: campaignId,
        contact_id: contactId
      }));

      const { error } = await supabase
        .from('campaign_contacts')
        .insert(campaignContacts);

      if (error) {
        console.error('Error adding contacts to campaign:', error);
        toast.error('Failed to add contacts to campaign');
        return;
      }

      // Invalidate and refetch both campaign contact counts and the campaign contacts list
      queryClient.invalidateQueries({ queryKey: ['campaign-contact-counts'] });
      queryClient.invalidateQueries({ queryKey: ['campaign-contacts', campaignId] });

      toast.success(`Added ${selectedContactIds.length} contact(s) to campaign`);
      setSelectedContactIds([]);
      setSearchTerm('');
      onContactsAdded();
      onClose();
    } catch (error) {
      console.error('Error adding contacts to campaign:', error);
      toast.error('Failed to add contacts to campaign');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Add Contacts to Campaign</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search contacts by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Contact List */}
          <div className="border rounded-lg max-h-96 overflow-y-auto">
            {contactsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : availableContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <p>No available contacts found</p>
                {searchTerm && (
                  <p className="text-sm">Try adjusting your search terms</p>
                )}
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {availableContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 border"
                  >
                    <Checkbox
                      checked={selectedContactIds.includes(contact.id)}
                      onCheckedChange={() => handleContactToggle(contact.id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-sm text-gray-500 space-y-1">
                        {contact.phone && (
                          <div className="flex items-center">
                            <span className="font-medium">Phone:</span>
                            <span className="ml-1">{contact.phone}</span>
                          </div>
                        )}
                        {contact.email && (
                          <div className="flex items-center">
                            <span className="font-medium">Email:</span>
                            <span className="ml-1">{contact.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected count */}
          {selectedContactIds.length > 0 && (
            <div className="text-sm text-gray-600">
              {selectedContactIds.length} contact(s) selected
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddContacts}
              disabled={selectedContactIds.length === 0 || isAdding}
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add {selectedContactIds.length > 0 ? `${selectedContactIds.length} ` : ''}Contact(s)
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactToCampaign;
