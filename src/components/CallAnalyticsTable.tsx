import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Clock, TrendingUp, TrendingDown, Play, Loader2, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Call {
  id: string;
  contactName: string;
  contactPhone: string;
  timestamp: Date;
  duration: string;
  status: 'completed' | 'failed' | 'no-answer' | 'voicemail' | 'busy' | 'unknown';
  outcome: 'positive' | 'negative' | 'neutral' | null;
  sentiment: number | null;
  hasRecording: boolean;
  hasTranscript: boolean;
  callStatus: 'completed' | 'rescheduled';
  rescheduledFor: Date | null;
  objectiveMet: boolean | null;
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
        setError(null);
        
        console.log('Fetching calls for campaign:', campaignId);
        
        // Get calls for this campaign with contact information
        const { data: callsData, error: callsError } = await supabase
          .from('calls')
          .select(`
            id,
            phone,
            duration,
            status,
            outcome,
            sentiment,
            recording_url,
            transcript,
            started_at,
            ended_at,
            contact_id,
            call_status,
            rescheduled_for,
            objective_met,
            contacts!inner(
              name,
              phone
            )
          `)
          .eq('campaign_id', campaignId)
          .order('started_at', { ascending: false });

        if (callsError) {
          console.error('Error fetching calls:', callsError);
          setError('Failed to fetch call data');
          return;
        }

        console.log('Raw calls data:', callsData);

        // Transform the data to match the expected format - only use real data
        const transformedCalls: Call[] = (callsData || []).map((call) => {
          console.log('Processing call:', call);
          
          return {
            id: call.id,
            contactName: call.contacts?.name || 'Unknown Contact',
            contactPhone: call.contacts?.phone || call.phone || 'Unknown',
            timestamp: new Date(call.started_at),
            duration: call.duration ? formatDuration(call.duration) : 'N/A',
            status: call.status as Call['status'],
            outcome: call.outcome as Call['outcome'],
            sentiment: call.sentiment,
            hasRecording: !!call.recording_url,
            hasTranscript: !!call.transcript,
            callStatus: (call.call_status || 'completed') as Call['callStatus'],
            rescheduledFor: call.rescheduled_for ? new Date(call.rescheduled_for) : null,
            objectiveMet: call.objective_met
          };
        });

        console.log('Transformed calls:', transformedCalls);
        setCalls(transformedCalls);
      } catch (err) {
        console.error('Error in fetchCalls:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (campaignId) {
      fetchCalls();
    }
  }, [campaignId]);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  };

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
      case 'busy':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCallStatusColor = (callStatus: string) => {
    switch (callStatus) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rescheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOutcomeIcon = (outcome: string | null, sentiment: number | null) => {
    if (outcome === 'positive' || (sentiment !== null && sentiment > 0.3)) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (outcome === 'negative' || (sentiment !== null && sentiment < -0.3)) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
    return <div className="w-4 h-4 rounded-full bg-gray-400" />;
  };

  const getObjectiveIcon = (objectiveMet: boolean | null) => {
    if (objectiveMet === true) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    } else if (objectiveMet === false) {
      return <XCircle className="w-4 h-4 text-red-600" />;
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
            : `${calls.length} call${calls.length !== 1 ? 's' : ''} found. Click on any call to view detailed analytics.`
          }
        </p>
      </div>
      
      {calls.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <Phone className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No calls yet</h4>
          <p>No call data available for this campaign. Calls will appear here once they are made.</p>
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
              <TableHead className="text-gray-700">Call Status</TableHead>
              <TableHead className="text-gray-700">Outcome</TableHead>
              <TableHead className="text-gray-700">Objective</TableHead>
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
                  <div className="flex flex-col gap-1">
                    <Badge variant="outline" className={getCallStatusColor(call.callStatus)}>
                      {call.callStatus}
                    </Badge>
                    {call.callStatus === 'rescheduled' && call.rescheduledFor && (
                      <div className="flex items-center gap-1 text-xs text-blue-600">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(call.rescheduledFor)}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getOutcomeIcon(call.outcome, call.sentiment)}
                    <span className="text-gray-700 capitalize">
                      {call.outcome || 'Unknown'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getObjectiveIcon(call.objectiveMet)}
                    <span className="text-gray-700 text-sm">
                      {call.objectiveMet === true ? 'Met' : call.objectiveMet === false ? 'Not Met' : 'N/A'}
                    </span>
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
