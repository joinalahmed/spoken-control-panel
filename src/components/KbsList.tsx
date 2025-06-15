
import { useState } from 'react';
import { Search, Filter, SortAsc, Plus, FileText, MoreHorizontal, Eye, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useKbs, KbsItem } from '@/hooks/useKbs';
import ViewKbsModal from '@/components/ViewKbsModal';

interface KbsListProps {
  onCreateItem: () => void;
  onEditItem: (item: KbsItem) => void;
}

const KbsList = ({ onCreateItem, onEditItem }: KbsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingItem, setViewingItem] = useState<KbsItem | null>(null);
  const { kbs, isLoading, deleteKbsItem } = useKbs();

  const filteredItems = kbs.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-700';
      case 'faq': return 'bg-green-100 text-green-700';
      case 'guide': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleDelete = (id: string) => {
    deleteKbsItem.mutate(id);
  };

  const handleEdit = (item: KbsItem) => {
    onEditItem(item);
  };

  const handleView = (item: KbsItem) => {
    setViewingItem(item);
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <div className="text-center">Loading knowledge base items...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Bases</h1>
          <p className="text-gray-600 mt-1">Manage your knowledge base content</p>
        </div>
        <Button onClick={onCreateItem} className="bg-purple-600 hover:bg-purple-700 text-white shadow-md">
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

      {/* Knowledge Base Card Grid */}
      {filteredItems.length === 0 ? (
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <FileText className="w-16 h-16 text-purple-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No knowledge base items yet</h3>
            <p className="text-gray-600 mb-6 max-w-sm">Create your first KBS item to build up your agent's knowledge. Click the button to get started.</p>
            <Button onClick={onCreateItem} className="bg-purple-600 hover:bg-purple-700 text-white shadow-md">
              Create Your First Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group flex flex-col cursor-pointer"
              onClick={() => handleView(item)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-gray-900 text-xl font-bold mb-2 line-clamp-2">{item.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                      <Badge 
                        variant={item.status === 'published' ? 'default' : 'secondary'}
                        className={item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                      >
                        {item.status}
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
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleView(item); }}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(item); }}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600 hover:bg-red-50"
                        onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <p className="text-gray-600 text-sm line-clamp-3 min-h-[60px] flex-1">
                  {item.description || 'No description provided.'}
                </p>
                {item.tags && item.tags.length > 0 && (
                  <div className="pt-2">
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="font-normal">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="text-xs text-gray-500 border-t border-black/10 pt-4">
                Last updated: {item.last_modified ? new Date(item.last_modified).toLocaleDateString() : 'Never'}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}


      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Showing {filteredItems.length} of {kbs.length} items
        </div>
      </div>

      {/* View Modal */}
      <ViewKbsModal 
        item={viewingItem}
        isOpen={!!viewingItem}
        onClose={() => setViewingItem(null)}
      />
    </div>
  );
};

export default KbsList;
