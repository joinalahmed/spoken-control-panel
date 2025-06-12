
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PhoneOutgoing, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Contact } from '@/hooks/useContacts';

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
        contact_name: contact.name
      });

      const response = await fetch('https://7263-49-207-61-173.ngrok-free.app/outbound_call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          to_number: contact.phone,
          campaign_id: campaignId,
          custom_webhook: 'https://7263-49-207-61-173.ngrok-free.app/twilio_webhook'
        })
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const responseData = await response.text();
        console.log('Call response:', responseData);
        toast.success(`Call initiated to ${contact.name}`);
        onCallTriggered?.();
      } else {
        const errorData = await response.text();
        console.error('Call failed with status:', response.status, 'Error:', errorData);
        toast.error(`Failed to initiate call: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error triggering call:', error);
      if (error instanceof TypeError && error.message.includes('NetworkError')) {
        toast.error('Network error: Unable to reach the call service. Please check if the ngrok tunnel is active.');
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
