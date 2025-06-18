
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface KbsItem {
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

export const useKbs = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: kbs = [], isLoading, error } = useQuery({
    queryKey: ['knowledge_base'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as KbsItem[];
    },
    enabled: !!user,
  });

  const createKbsItem = useMutation({
    mutationFn: async (itemData: Omit<KbsItem, 'id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('knowledge_base')
        .insert([{ ...itemData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data as KbsItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge_base'] });
      toast.success('KBS item created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create KBS item: ' + error.message);
    },
  });

  const updateKbsItem = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<KbsItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('knowledge_base')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as KbsItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge_base'] });
      toast.success('KBS item updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update KBS item: ' + error.message);
    },
  });

  const deleteKbsItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('knowledge_base')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge_base'] });
      toast.success('KBS item deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete KBS item: ' + error.message);
    },
  });

  return {
    kbs,
    isLoading,
    error,
    createKbsItem,
    updateKbsItem,
    deleteKbsItem,
  };
};
