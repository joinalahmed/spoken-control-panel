
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
      const response = await fetch('https://7263-49-207-61-173.ngrok-free.app/outbound_call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to_number: contact.phone,
          campaign_id: campaignId,
          custom_webhook: 'https://7263-49-207-61-173.ngrok-free.app/twilio_webhook'
        })
      });

      if (response.ok) {
        toast.success(`Call initiated to ${contact.name}`);
        onCallTriggered?.();
      } else {
        const errorData = await response.text();
        console.error('Call failed:', errorData);
        toast.error('Failed to initiate call');
      }
    } catch (error) {
      console.error('Error triggering call:', error);
      toast.error('Failed to initiate call');
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
