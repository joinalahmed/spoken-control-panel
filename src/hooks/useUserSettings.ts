
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUserSettings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const getSetting = async (key: string): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('setting_value')
        .eq('user_id', user.id)
        .eq('setting_key', key)
        .maybeSingle();

      if (error) {
        console.error('Error fetching setting:', error);
        return null;
      }

      return data?.setting_value || null;
    } catch (error) {
      console.error('Error fetching setting:', error);
      return null;
    }
  };

  const setSetting = async (key: string, value: string): Promise<boolean> => {
    if (!user) return false;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          setting_key: key,
          setting_value: value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,setting_key'
        });

      if (error) {
        console.error('Error saving setting:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving setting:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getSetting,
    setSetting,
    isLoading
  };
};
