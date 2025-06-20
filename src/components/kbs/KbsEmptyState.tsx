
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface KbsEmptyStateProps {
  onCreateItem: () => void;
}

const KbsEmptyState = ({ onCreateItem }: KbsEmptyStateProps) => {
  return (
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
  );
};

export default KbsEmptyState;
