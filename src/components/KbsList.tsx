
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useKbs, KbsItem } from '@/hooks/useKbs';
import ViewKbsModal from '@/components/ViewKbsModal';
import KbsListHeader from '@/components/kbs/KbsListHeader';
import KbsSearchAndFilters from '@/components/kbs/KbsSearchAndFilters';
import KbsCard from '@/components/kbs/KbsCard';
import KbsEmptyState from '@/components/kbs/KbsEmptyState';

interface KbsListProps {
  onCreateItem: () => void;
  onEditItem: (item: KbsItem) => void;
}

const KbsList = ({ onCreateItem, onEditItem }: KbsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingItem, setViewingItem] = useState<KbsItem | null>(null);
  const { toast } = useToast();
  const { kbs, isLoading, deleteKbsItem } = useKbs();

  const filteredItems = kbs.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const handleCopyId = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(id);
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
      <KbsListHeader onCreateItem={onCreateItem} />
      
      <KbsSearchAndFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {filteredItems.length === 0 ? (
        <KbsEmptyState onCreateItem={onCreateItem} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <KbsCard
              key={item.id}
              item={item}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCopyId={handleCopyId}
            />
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
