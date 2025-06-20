
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
  gender: string | null;
  languages: string[];
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
      
      console.log('Fetching agents for user:', user.id);
      
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching agents:', error);
        throw error;
      }
      
      console.log('Fetched agents:', data);
      return (data || []) as Agent[];
    },
    enabled: !!user,
  });

  const createAgent = useMutation({
    mutationFn: async (agentData: Omit<Agent, 'id' | 'created_at' | 'updated_at'>) => {
      if (!user) {
        console.error('No user found when creating agent');
        throw new Error('User not authenticated');
      }

      console.log('Creating agent with data:', agentData);
      console.log('User ID:', user.id);

      // Map the data to match database schema
      const dbData = {
        user_id: user.id,
        name: agentData.name,
        voice: agentData.voice,
        status: agentData.status,
        description: agentData.description,
        system_prompt: agentData.system_prompt,
        first_message: agentData.first_message,
        knowledge_base_id: agentData.knowledge_base_id,
        company: agentData.company,
        script_id: agentData.script_id,
        conversations: agentData.conversations,
        last_active: agentData.last_active,
        gender: agentData.gender,
        languages: agentData.languages || ['en']
      };

      console.log('Mapped data for database:', dbData);

      const { data, error } = await supabase
        .from('agents')
        .insert([dbData])
        .select('*')
        .single();

      if (error) {
        console.error('Database error creating agent:', error);
        throw error;
      }

      console.log('Agent created successfully:', data);
      return data as Agent;
    },
    onSuccess: (data) => {
      console.log('Agent creation success callback:', data);
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast.success('Agent created successfully!');
    },
    onError: (error) => {
      console.error('Agent creation error callback:', error);
      toast.error('Failed to create agent: ' + error.message);
    },
  });

  const updateAgent = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Agent> & { id: string }) => {
      console.log('Updating agent:', id, 'with updates:', updates);
      
      const { data, error } = await supabase
        .from('agents')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating agent:', error);
        throw error;
      }
      
      console.log('Agent updated successfully:', data);
      return data as Agent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast.success('Agent updated successfully!');
    },
    onError: (error) => {
      console.error('Agent update error:', error);
      toast.error('Failed to update agent: ' + error.message);
    },
  });

  const deleteAgent = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting agent:', id);
      
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting agent:', error);
        throw error;
      }
      
      console.log('Agent deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast.success('Agent deleted successfully!');
    },
    onError: (error) => {
      console.error('Agent deletion error:', error);
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
