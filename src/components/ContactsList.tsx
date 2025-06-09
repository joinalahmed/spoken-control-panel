
import { useState } from 'react';
import { Search, Filter, SortAsc, Plus, Phone, Mail, MapPin, MoreHorizontal, Eye, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: 'active' | 'inactive';
  lastCalled: string;
  avatar?: string;
}

interface ContactsListProps {
  onCreateContact: () => void;
  onEditContact: (contact: Contact) => void;
}

const ContactsList = ({ onCreateContact, onEditContact }: ContactsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'James Brown',
      email: 'james@gmail.com',
      phone: '+85095677468',
      address: '3405 Parker Rd.',
      city: 'London',
      state: 'New York',
      zipCode: '2000',
      status: 'active',
      lastCalled: '2/3/2025 at 5:40pm'
    },
    {
      id: '2',
      name: 'James Brown',
      email: 'james@gmail.com',
      phone: '+85095677468',
      address: '6558 Green Rd.',
      city: 'London',
      state: 'New York',
      zipCode: '2000',
      status: 'active',
      lastCalled: '2/3/2025 at 5:40pm'
    },
    {
      id: '3',
      name: 'James Brown',
      email: 'james@gmail.com',
      phone: '775 Rolling',
      address: '3689 Poplar',
      city: 'London',
      state: 'New York',
      zipCode: '2000',
      status: 'inactive',
      lastCalled: '2/3/2025 at 5:40pm'
    }
  ]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Contacts</h1>
          <p className="text-gray-600">Display all the contacts</p>
        </div>
        <Button onClick={onCreateContact} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Contact
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline" size="sm">
          <SortAsc className="w-4 h-4 mr-2" />
          Sort by
        </Button>
      </div>

      {/* Contacts Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Last Called</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {contact.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{contact.name}</div>
                      <div className="text-sm text-gray-500">{contact.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{contact.address}</TableCell>
                <TableCell className="text-gray-600">{contact.phone}</TableCell>
                <TableCell className="text-gray-600">{contact.lastCalled}</TableCell>
                <TableCell>
                  <Badge 
                    variant={contact.status === 'active' ? 'default' : 'secondary'}
                    className={contact.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                  >
                    {contact.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditContact(contact)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Page 1 of 10
        </div>
      </div>
    </div>
  );
};

export default ContactsList;
