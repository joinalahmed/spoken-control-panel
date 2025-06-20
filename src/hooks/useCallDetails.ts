
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CallData {
  id: string;
  phone: string;
  started_at: string;
  ended_at: string | null;
  duration: number | null;
  status: string;
  outcome: string | null;
  sentiment: number | null;
  recording_url: string | null;
  transcript: string | null;
  notes: string | null;
  contact_id: string;
  campaign_id: string | null;
  extracted_data: any | null;
  call_status: string;
  rescheduled_for: string | null;
  objective_met: boolean | null;
}

interface ContactData {
  name: string;
}

export const useCallDetails = (callId: string) => {
  const [callData, setCallData] = useState<CallData | null>(null);
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCallDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch call data
        const { data: call, error: callError } = await supabase
          .from('calls')
          .select('*')
          .eq('id', callId)
          .single();

        if (callError) {
          console.error('Error fetching call:', callError);
          setError('Failed to load call details');
          return;
        }

        setCallData(call);

        // Fetch contact data
        if (call.contact_id) {
          const { data: contact, error: contactError } = await supabase
            .from('contacts')
            .select('name')
            .eq('id', call.contact_id)
            .single();

          if (contactError) {
            console.error('Error fetching contact:', contactError);
          } else {
            setContactData(contact);
          }
        }
      } catch (error) {
        console.error('Error in fetchCallDetails:', error);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (callId) {
      fetchCallDetails();
    }
  }, [callId]);

  return { callData, contactData, isLoading, error };
};
