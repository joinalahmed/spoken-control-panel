
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSystemSettings = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getSetting = async (key: string): Promise<string | null> => {
    try {
      console.log('Getting system setting:', key);
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', key)
        .maybeSingle();

      if (error) {
        console.error('Error fetching system setting:', error);
        return null;
      }

      console.log('Retrieved system setting data:', data);
      return data?.setting_value || null;
    } catch (error) {
      console.error('Error fetching system setting:', error);
      return null;
    }
  };

  const setSetting = async (key: string, value: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Setting system setting:', key, 'to:', value);
      const { error } = await supabase
        .from('system_settings')
        .update({
          setting_value: value,
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', key);

      if (error) {
        console.error('Error saving system setting:', error);
        return false;
      }

      console.log('System setting saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving system setting:', error);
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
