
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CustomVoice {
  id: string;
  voice_name: string;
  voice_id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useCustomVoices = () => {
  const queryClient = useQueryClient();

  const { data: voices, isLoading, error } = useQuery({
    queryKey: ['custom-voices'],
    queryFn: async () => {
      console.log('Fetching custom voices...');
      const { data, error } = await supabase
        .from('custom_voices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching custom voices:', error);
        throw error;
      }

      console.log('Custom voices fetched:', data);
      return data as CustomVoice[];
    }
  });

  const createVoice = useMutation({
    mutationFn: async (voiceData: { voice_name: string; voice_id: string }) => {
      console.log('Creating custom voice:', voiceData);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('custom_voices')
        .insert([{
          voice_name: voiceData.voice_name,
          voice_id: voiceData.voice_id,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating custom voice:', error);
        throw error;
      }

      console.log('Custom voice created successfully:', data);
      return data as CustomVoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-voices'] });
    },
    onError: (error) => {
      console.error('Failed to create custom voice:', error);
      toast.error('Failed to create custom voice');
    }
  });

  const deleteVoice = useMutation({
    mutationFn: async (voiceId: string) => {
      console.log('Deleting custom voice:', voiceId);
      
      const { error } = await supabase
        .from('custom_voices')
        .delete()
        .eq('id', voiceId);

      if (error) {
        console.error('Error deleting custom voice:', error);
        throw error;
      }

      console.log('Custom voice deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-voices'] });
    },
    onError: (error) => {
      console.error('Failed to delete custom voice:', error);
      toast.error('Failed to delete custom voice');
    }
  });

  return {
    voices,
    isLoading,
    error,
    createVoice,
    deleteVoice
  };
};
