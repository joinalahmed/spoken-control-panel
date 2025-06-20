
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useContacts, Contact } from '@/hooks/useContacts';
import { formatDistanceToNow } from 'date-fns';
import { generateRandomAvatar, getInitials } from '@/utils/avatarUtils';

interface ContactsListProps {
  onCreateContact: () => void;
  onEditContact: (contact: Contact) => void;
  onViewContact: (contact: Contact) => void;
}

const ContactsList = ({ onCreateContact, onEditContact, onViewContact }: ContactsListProps) => {
  const { contacts, isLoading, deleteContact } = useContacts();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-700 border-emerald-500/30';
      case 'inactive':
        return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const formatLastCalled = (lastCalled: string | null) => {
    if (!lastCalled) return 'Never';
    return formatDistanceToNow(new Date(lastCalled), { addSuffix: true });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
                <p className="text-gray-600">Manage your contact database</p>
              </div>
            </div>
            <Button 
              onClick={onCreateContact}
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-shadow gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Contact
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {contacts.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-24 text-center">
              <Users className="w-16 h-16 text-purple-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No contacts yet</h3>
              <p className="text-gray-600 mb-6 max-w-sm">Start building your contact database by adding your first contact.</p>
              <Button 
                onClick={onCreateContact}
                className="bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-shadow"
              >
                Add Your First Contact
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="text-sm text-gray-600">
              Showing {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contacts.map((contact) => (
                <Card
                  key={contact.id}
                  className="shadow-md bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => onViewContact(contact)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                          <AvatarImage src={generateRandomAvatar(contact.name, 'contact')} alt={contact.name} />
                          <AvatarFallback className="text-blue-600 font-bold text-lg bg-blue-100">
                            {getInitials(contact.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-gray-900 text-lg font-bold truncate">
                            {contact.name}
                          </CardTitle>
                          <Badge variant="outline" className={`${getStatusColor(contact.status)} font-medium mt-1`}>
                            {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4 text-gray-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white border-gray-200">
                          <DropdownMenuItem 
                            onClick={(e) => { e.stopPropagation(); onViewContact(contact); }}
                            className="text-gray-700 hover:bg-gray-100"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => { e.stopPropagation(); onEditContact(contact); }}
                            className="text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => { e.stopPropagation(); deleteContact.mutate(contact.id); }}
                            className="text-red-600 hover:bg-red-50"
                            disabled={deleteContact.isPending}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Contact Information */}
                    <div className="space-y-3">
                      {contact.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <span className="text-gray-800 truncate">{contact.email}</span>
                        </div>
                      )}
                      
                      {contact.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <span className="text-gray-800">{contact.phone}</span>
                        </div>
                      )}
                      
                      {(contact.address || contact.city || contact.state) && (
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                          <div className="text-gray-800">
                            {contact.address && <div>{contact.address}</div>}
                            {(contact.city || contact.state) && (
                              <div>
                                {contact.city}{contact.city && contact.state && ', '}{contact.state} {contact.zip_code}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Last Called */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Last called: {formatLastCalled(contact.last_called)}</span>
                        </div>
                        <span>Added {formatDistanceToNow(new Date(contact.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsList;
