
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Agent {
  id: string;
  name: string;
  voice: string;
  status: 'active' | 'inactive' | 'training';
  conversations: number;
  last_active: string | null;
  description: string | null;
  system_prompt: string | null;
  first_message: string | null;
  knowledge_base_id: string | null;
  company: string | null;
  script_id: string | null;
  created_at: string;
  updated_at: string;
  script?: {
    id: string;
    name: string;
    description: string | null;
    sections: any[];
  };
}

export const useAgents = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: agents = [], isLoading, error } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []) as Agent[];
    },
    enabled: !!user,
  });

  const createAgent = useMutation({
    mutationFn: async (agentData: Omit<Agent, 'id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('agents')
        .insert([{ ...agentData, user_id: user.id }])
        .select('*')
        .single();

      if (error) throw error;
      return data as Agent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast.success('Agent created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create agent: ' + error.message);
    },
  });

  const updateAgent = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Agent> & { id: string }) => {
      const { data, error } = await supabase
        .from('agents')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return data as Agent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast.success('Agent updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update agent: ' + error.message);
    },
  });

  const deleteAgent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast.success('Agent deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete agent: ' + error.message);
    },
  });

  return {
    agents,
    isLoading,
    error,
    createAgent,
    updateAgent,
    deleteAgent,
  };
};
