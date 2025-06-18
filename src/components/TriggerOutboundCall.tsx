
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PhoneOutgoing, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Contact } from '@/hooks/useContacts';
import { useSystemSettings } from '@/hooks/useSystemSettings';

interface TriggerOutboundCallProps {
  contact: Contact;
  campaignId: string;
  onCallTriggered?: () => void;
}

const TriggerOutboundCall: React.FC<TriggerOutboundCallProps> = ({
  contact,
  campaignId,
  onCallTriggered
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState('http://34.205.140.255:7860/outbound_call');
  const { getSetting } = useSystemSettings();

  useEffect(() => {
    // Load system-level setting from Supabase
    const loadSystemSetting = async () => {
      try {
        const savedUrl = await getSetting('outbound_call_api_url');
        if (savedUrl) {
          setApiUrl(savedUrl);
        }
      } catch (error) {
        console.error('Error loading system setting:', error);
      }
    };

    loadSystemSetting();
  }, [getSetting]);

  const triggerCall = async () => {
    if (!contact.phone) {
      toast.error('Contact has no phone number');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Triggering outbound call:', {
        to_number: contact.phone,
        campaign_id: campaignId,
        contact_name: contact.name,
        api_url: apiUrl
      });

      // Check if we're on HTTPS trying to call HTTP
      const isHttpsToHttp = window.location.protocol === 'https:' && apiUrl.startsWith('http:');
      if (isHttpsToHttp) {
        console.warn('Mixed content warning: HTTPS page trying to call HTTP endpoint');
        toast.error('Mixed content error: Cannot call HTTP endpoint from HTTPS page. Please use HTTPS for your API endpoint.');
        return;
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to_number: contact.phone,
          campaign_id: campaignId,
          custom_webhook: apiUrl.replace('/outbound_call', '/twilio_webhook')
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const responseData = await response.text();
        console.log('Call response:', responseData);
        toast.success(`Call initiated to ${contact.name}`);
        onCallTriggered?.();
      } else {
        const errorData = await response.text();
        console.error('Call failed with status:', response.status, 'Error:', errorData);
        toast.error(`Failed to initiate call: ${response.status} ${response.statusText}${errorData ? ` - ${errorData}` : ''}`);
      }
    } catch (error) {
      console.error('Error triggering call:', error);
      
      if (error instanceof TypeError) {
        if (error.message.includes('Failed to fetch')) {
          // Check if it's a mixed content issue
          const isHttpsToHttp = window.location.protocol === 'https:' && apiUrl.startsWith('http:');
          if (isHttpsToHttp) {
            toast.error('Mixed Content Error: Cannot call HTTP API from HTTPS page. Please use HTTPS for your API endpoint or access this app via HTTP.');
          } else {
            toast.error(`Network error: Cannot reach ${apiUrl}. This could be due to CORS restrictions. Please ensure your API server includes proper CORS headers.`);
          }
        } else if (error.message.includes('NetworkError')) {
          toast.error('Network error: CORS or connectivity issue. Check if the API server allows cross-origin requests.');
        } else {
          toast.error(`Network error: ${error.message}`);
        }
      } else {
        toast.error('Failed to initiate call: ' + (error as Error).message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!contact.phone) {
    return null;
  }

  return (
    <Button
      size="sm"
      onClick={triggerCall}
      disabled={isLoading}
      className="bg-green-600 hover:bg-green-700 text-white"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <PhoneOutgoing className="w-4 h-4 mr-2" />
      )}
      {isLoading ? 'Calling...' : 'Call'}
    </Button>
  );
};

export default TriggerOutboundCall;
