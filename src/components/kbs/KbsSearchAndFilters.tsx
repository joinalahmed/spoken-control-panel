
import { Search, Filter, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface KbsSearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const KbsSearchAndFilters = ({ searchTerm, onSearchChange }: KbsSearchAndFiltersProps) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search knowledge base..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
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
  );
};

export default KbsSearchAndFilters;
