
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserSettings } from '@/hooks/useUserSettings';
import { toast } from 'sonner';

export const useApiKeys = () => {
  const { user } = useAuth();
  const { getSetting, setSetting, isLoading } = useUserSettings();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateApiKey = async (): Promise<string> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setIsGenerating(true);
    try {
      // Generate a unique API key using user ID and timestamp
      const timestamp = Date.now();
      const randomPart = Math.random().toString(36).substring(2, 15);
      const apiKey = `dhwani_${user.id.replace(/-/g, '').substring(0, 8)}_${timestamp}_${randomPart}`;
      
      // Save the API key to user settings
      const success = await setSetting('api_key', apiKey);
      
      if (success) {
        toast.success('API key generated successfully');
        return apiKey;
      } else {
        throw new Error('Failed to save API key');
      }
    } catch (error) {
      console.error('Error generating API key:', error);
      toast.error('Failed to generate API key');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const getApiKey = async (): Promise<string | null> => {
    try {
      return await getSetting('api_key');
    } catch (error) {
      console.error('Error fetching API key:', error);
      return null;
    }
  };

  const revokeApiKey = async (): Promise<boolean> => {
    try {
      const success = await setSetting('api_key', '');
      if (success) {
        toast.success('API key revoked successfully');
      }
      return success;
    } catch (error) {
      console.error('Error revoking API key:', error);
      toast.error('Failed to revoke API key');
      return false;
    }
  };

  return {
    generateApiKey,
    getApiKey,
    revokeApiKey,
    isLoading: isLoading || isGenerating
  };
};
