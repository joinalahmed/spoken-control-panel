
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Script {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  company: string | null;
  first_message: string | null;
  sections: any[];
  created_at: string;
  updated_at: string;
}

export const useScripts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: scripts = [], isLoading, error } = useQuery({
    queryKey: ['scripts'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('scripts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Script[];
    },
    enabled: !!user,
  });

  const createScript = useMutation({
    mutationFn: async (scriptData: Omit<Script, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('scripts')
        .insert([{ ...scriptData, user_id: user.id }])
        .select('*')
        .single();

      if (error) throw error;
      return data as Script;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scripts'] });
      toast.success('Script created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create script: ' + error.message);
    },
  });

  const updateScript = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Script> & { id: string }) => {
      const { data, error } = await supabase
        .from('scripts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return data as Script;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scripts'] });
      toast.success('Script updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update script: ' + error.message);
    },
  });

  const deleteScript = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('scripts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scripts'] });
      toast.success('Script deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete script: ' + error.message);
    },
  });

  return {
    scripts,
    isLoading,
    error,
    createScript,
    updateScript,
    deleteScript,
  };
};
