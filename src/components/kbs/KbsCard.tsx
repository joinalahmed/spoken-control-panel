
import { MoreHorizontal, Eye, Edit, Trash, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { KbsItem } from '@/hooks/useKbs';

interface KbsCardProps {
  item: KbsItem;
  onView: (item: KbsItem) => void;
  onEdit: (item: KbsItem) => void;
  onDelete: (id: string) => void;
  onCopyId: (id: string, e: React.MouseEvent) => void;
}

const KbsCard = ({ item, onView, onEdit, onDelete, onCopyId }: KbsCardProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-700';
      case 'faq': return 'bg-green-100 text-green-700';
      case 'guide': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card 
      className="shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group flex flex-col cursor-pointer focus:outline-none border-2 border-transparent focus:border-purple-600"
      onClick={() => onView(item)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onView(item);
        }
      }}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-gray-900 text-xl font-bold mb-2 line-clamp-2">{item.title}</CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
              <Badge 
                variant={item.status === 'published' ? 'default' : 'secondary'}
                className={item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
              >
                {item.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>ID: {item.id.slice(0, 8)}...</span>
              <Button 
                size="sm" 
                variant="ghost" 
                className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => onCopyId(item.id, e)}
              >
                <Copy className="w-3 h-3" />
              </Button>
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
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(item); }}>
                <Eye className="w-4 h-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(item); }}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600 hover:bg-red-50"
                onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
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
  );
};

export default KbsCard;
