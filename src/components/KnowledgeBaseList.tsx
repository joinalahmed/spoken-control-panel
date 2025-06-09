
import { useState } from 'react';
import { Search, Filter, SortAsc, Plus, FileText, MoreHorizontal, Eye, Edit, Trash } from 'lucide-react';
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

interface KnowledgeBaseItem {
  id: string;
  title: string;
  type: 'document' | 'faq' | 'guide' | 'other';
  description: string;
  dateAdded: string;
  lastModified: string;
  status: 'published' | 'draft';
  tags: string[];
}

interface KnowledgeBaseListProps {
  onCreateItem: () => void;
  onEditItem: (item: KnowledgeBaseItem) => void;
}

const KnowledgeBaseList = ({ onCreateItem, onEditItem }: KnowledgeBaseListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [items] = useState<KnowledgeBaseItem[]>([
    {
      id: '1',
      title: 'Getting Started Guide',
      type: 'guide',
      description: 'Complete guide for new users to get started with the platform',
      dateAdded: '2/1/2025',
      lastModified: '2/3/2025',
      status: 'published',
      tags: ['onboarding', 'guide']
    },
    {
      id: '2',
      title: 'Voice Agent Configuration',
      type: 'document',
      description: 'How to configure and customize voice agents',
      dateAdded: '1/28/2025',
      lastModified: '2/2/2025',
      status: 'published',
      tags: ['agents', 'configuration']
    },
    {
      id: '3',
      title: 'Troubleshooting FAQ',
      type: 'faq',
      description: 'Common issues and solutions',
      dateAdded: '1/25/2025',
      lastModified: '1/30/2025',
      status: 'draft',
      tags: ['support', 'faq']
    }
  ]);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-700';
      case 'faq': return 'bg-green-100 text-green-700';
      case 'guide': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-600">Manage your knowledge base content</p>
        </div>
        <Button onClick={onCreateItem} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search knowledge base..."
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

      {/* Knowledge Base Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-500">
                        {item.tags.map(tag => (
                          <span key={tag} className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs mr-1">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getTypeColor(item.type)}>
                    {item.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600 max-w-xs truncate">{item.description}</TableCell>
                <TableCell className="text-gray-600">{item.lastModified}</TableCell>
                <TableCell>
                  <Badge 
                    variant={item.status === 'published' ? 'default' : 'secondary'}
                    className={item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                  >
                    {item.status}
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
                      <DropdownMenuItem onClick={() => onEditItem(item)}>
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
          Showing {filteredItems.length} of {items.length} items
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBaseList;
