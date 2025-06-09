
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Clock, TrendingUp, TrendingDown, Play, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Call {
  id: string;
  contactName: string;
  contactPhone: string;
  timestamp: Date;
  duration: string;
  status: 'completed' | 'failed' | 'no-answer' | 'voicemail';
  outcome: 'positive' | 'negative' | 'neutral';
  sentiment: number;
  hasRecording: boolean;
  hasTranscript: boolean;
}

interface CallAnalyticsTableProps {
  campaignId: string;
  onCallClick: (callId: string) => void;
}

const CallAnalyticsTable = ({ campaignId, onCallClick }: CallAnalyticsTableProps) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        setIsLoading(true);
        
        // First get all contacts for this campaign
        const { data: campaign, error: campaignError } = await supabase
          .from('campaigns')
          .select('contact_ids')
          .eq('id', campaignId)
          .single();

        if (campaignError) {
          console.error('Error fetching campaign:', campaignError);
          setError('Failed to fetch campaign data');
          return;
        }

        if (!campaign?.contact_ids || campaign.contact_ids.length === 0) {
          setCalls([]);
          return;
        }

        // Get contact details for the campaign
        const { data: contacts, error: contactsError } = await supabase
          .from('contacts')
          .select('id, name, phone')
          .in('id', campaign.contact_ids);

        if (contactsError) {
          console.error('Error fetching contacts:', contactsError);
          setError('Failed to fetch contacts data');
          return;
        }

        // For now, create mock calls based on contacts since we don't have a calls table yet
        // This will be replaced when the calls table is created
        const mockCalls: Call[] = contacts?.map((contact, index) => ({
          id: `call_${contact.id}_${index}`,
          contactName: contact.name,
          contactPhone: contact.phone || 'N/A',
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
          duration: `${Math.floor(Math.random() * 10) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
          status: ['completed', 'failed', 'no-answer', 'voicemail'][Math.floor(Math.random() * 4)] as any,
          outcome: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)] as any,
          sentiment: (Math.random() - 0.5) * 2, // Random sentiment between -1 and 1
          hasRecording: Math.random() > 0.3,
          hasTranscript: Math.random() > 0.4
        })) || [];

        setCalls(mockCalls);
      } catch (err) {
        console.error('Error in fetchCalls:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalls();
  }, [campaignId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'no-answer':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'voicemail':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOutcomeIcon = (outcome: string, sentiment: number) => {
    if (outcome === 'positive' || sentiment > 0.3) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (outcome === 'negative' || sentiment < -0.3) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
    return <div className="w-4 h-4 rounded-full bg-gray-400" />;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Loading call data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="text-center text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Call History</h3>
        <p className="text-gray-600 text-sm">
          {calls.length === 0 
            ? 'No calls have been made for this campaign yet' 
            : 'Click on any call to view detailed analytics'
          }
        </p>
      </div>
      
      {calls.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No call data available for this campaign
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 hover:bg-gray-50">
              <TableHead className="text-gray-700">Contact</TableHead>
              <TableHead className="text-gray-700">Phone</TableHead>
              <TableHead className="text-gray-700">Date & Time</TableHead>
              <TableHead className="text-gray-700">Duration</TableHead>
              <TableHead className="text-gray-700">Status</TableHead>
              <TableHead className="text-gray-700">Outcome</TableHead>
              <TableHead className="text-gray-700">Recording</TableHead>
              <TableHead className="text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calls.map((call) => (
              <TableRow 
                key={call.id}
                className="border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onCallClick(call.id)}
              >
                <TableCell className="text-gray-900 font-medium">{call.contactName}</TableCell>
                <TableCell className="text-gray-700">{call.contactPhone}</TableCell>
                <TableCell className="text-gray-700">
                  <div className="flex flex-col">
                    <span>{formatDate(call.timestamp)}</span>
                    <span className="text-xs text-gray-500">{formatTime(call.timestamp)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    {call.duration}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(call.status)}>
                    {call.status.replace('-', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getOutcomeIcon(call.outcome, call.sentiment)}
                    <span className="text-gray-700 capitalize">{call.outcome}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {call.hasRecording && (
                      <Play className="w-4 h-4 text-blue-600" />
                    )}
                    <span className="text-gray-700 text-sm">
                      {call.hasRecording ? 'Available' : 'N/A'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCallClick(call.id);
                    }}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default CallAnalyticsTable;
