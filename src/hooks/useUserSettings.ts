
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUserSettings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const getSetting = async (key: string): Promise<string | null> => {
    if (!user) {
      console.log('No user found, cannot get setting');
      return null;
    }

    try {
      console.log('Getting setting:', key, 'for user:', user.id);
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

      console.log('Retrieved setting data:', data);
      return data?.setting_value || null;
    } catch (error) {
      console.error('Error fetching setting:', error);
      return null;
    }
  };

  const setSetting = async (key: string, value: string): Promise<boolean> => {
    if (!user) {
      console.log('No user found, cannot set setting');
      return false;
    }

    setIsLoading(true);
    try {
      console.log('Setting:', key, 'to:', value, 'for user:', user.id);
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

      console.log('Setting saved successfully');
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
