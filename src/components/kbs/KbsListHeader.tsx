
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KbsListHeaderProps {
  onCreateItem: () => void;
}

const KbsListHeader = ({ onCreateItem }: KbsListHeaderProps) => {
  return (
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
  );
};

export default KbsListHeader;
