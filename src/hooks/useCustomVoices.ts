
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface CustomVoice {
  id: string;
  user_id: string;
  voice_name: string;
  voice_id: string;
  created_at: string;
  updated_at: string;
}

export const useCustomVoices = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: voices = [], isLoading, error } = useQuery({
    queryKey: ['custom-voices'],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching custom voices for user:', user.id);
      
      const { data, error } = await supabase
        .from('custom_voices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching custom voices:', error);
        throw error;
      }
      
      console.log('Fetched custom voices:', data);
      return (data || []) as CustomVoice[];
    },
    enabled: !!user,
  });

  const addVoice = useMutation({
    mutationFn: async ({ voice_name, voice_id }: { voice_name: string; voice_id: string }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Adding custom voice:', { voice_name, voice_id });

      const { data, error } = await supabase
        .from('custom_voices')
        .insert([{
          user_id: user.id,
          voice_name,
          voice_id
        }])
        .select('*')
        .single();

      if (error) {
        console.error('Error adding custom voice:', error);
        throw error;
      }

      return data as CustomVoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-voices'] });
      toast.success('Voice added successfully!');
    },
    onError: (error) => {
      console.error('Voice addition error:', error);
      toast.error('Failed to add voice: ' + error.message);
    },
  });

  const deleteVoice = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting custom voice:', id);
      
      const { error } = await supabase
        .from('custom_voices')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting custom voice:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-voices'] });
      toast.success('Voice deleted successfully!');
    },
    onError: (error) => {
      console.error('Voice deletion error:', error);
      toast.error('Failed to delete voice: ' + error.message);
    },
  });

  // Get all available voices (default + custom)
  const getAllVoices = () => {
    const defaultVoices = [
      { name: 'Sarah', id: 'sarah' },
      { name: 'John', id: 'john' },
      { name: 'Emma', id: 'emma' },
      { name: 'Alex', id: 'alex' }
    ];

    const customVoiceOptions = voices.map(voice => ({
      name: voice.voice_name,
      id: voice.voice_id
    }));

    return [...defaultVoices, ...customVoiceOptions];
  };

  return {
    voices,
    isLoading,
    error,
    addVoice,
    deleteVoice,
    getAllVoices,
  };
};
