
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface KnowledgeBaseItem {
  id: string;
  title: string;
  type: 'document' | 'faq' | 'guide' | 'other';
  description: string | null;
  content: string | null;
  tags: string[] | null;
  status: 'published' | 'draft';
  date_added: string | null;
  last_modified: string | null;
  created_at: string;
  updated_at: string;
}

export const useKnowledgeBase = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: knowledgeBase = [], isLoading, error } = useQuery({
    queryKey: ['knowledge_base'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as KnowledgeBaseItem[];
    },
    enabled: !!user,
  });

  const createKnowledgeBaseItem = useMutation({
    mutationFn: async (itemData: Omit<KnowledgeBaseItem, 'id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('knowledge_base')
        .insert([{ ...itemData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data as KnowledgeBaseItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge_base'] });
      toast.success('Knowledge base item created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create knowledge base item: ' + error.message);
    },
  });

  const updateKnowledgeBaseItem = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<KnowledgeBaseItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('knowledge_base')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as KnowledgeBaseItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge_base'] });
      toast.success('Knowledge base item updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update knowledge base item: ' + error.message);
    },
  });

  const deleteKnowledgeBaseItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('knowledge_base')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge_base'] });
      toast.success('Knowledge base item deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete knowledge base item: ' + error.message);
    },
  });

  return {
    knowledgeBase,
    isLoading,
    error,
    createKnowledgeBaseItem,
    updateKnowledgeBaseItem,
    deleteKnowledgeBaseItem,
  };
};
