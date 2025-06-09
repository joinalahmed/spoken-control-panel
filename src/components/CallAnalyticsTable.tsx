
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Clock, TrendingUp, TrendingDown, Play } from 'lucide-react';

interface Call {
  id: string;
  contactName: string;
  contactPhone: string;
  timestamp: Date;
  duration: string;
  status: 'completed' | 'failed' | 'no-answer' | 'voicemail';
  outcome: 'positive' | 'negative' | 'neutral';
  sentiment: number; // -1 to 1
  hasRecording: boolean;
  hasTranscript: boolean;
}

interface CallAnalyticsTableProps {
  campaignId: string;
  onCallClick: (callId: string) => void;
}

const CallAnalyticsTable = ({ campaignId, onCallClick }: CallAnalyticsTableProps) => {
  // Mock data - in a real app, this would come from the database
  const [calls] = useState<Call[]>([
    {
      id: '1',
      contactName: 'John Smith',
      contactPhone: '+1 (555) 123-4567',
      timestamp: new Date('2024-01-15T10:30:00'),
      duration: '4:23',
      status: 'completed',
      outcome: 'positive',
      sentiment: 0.7,
      hasRecording: true,
      hasTranscript: true
    },
    {
      id: '2',
      contactName: 'Sarah Johnson',
      contactPhone: '+1 (555) 987-6543',
      timestamp: new Date('2024-01-15T11:45:00'),
      duration: '2:15',
      status: 'completed',
      outcome: 'neutral',
      sentiment: 0.1,
      hasRecording: true,
      hasTranscript: true
    },
    {
      id: '3',
      contactName: 'Mike Davis',
      contactPhone: '+1 (555) 456-7890',
      timestamp: new Date('2024-01-15T14:20:00'),
      duration: '0:45',
      status: 'no-answer',
      outcome: 'negative',
      sentiment: -0.3,
      hasRecording: false,
      hasTranscript: false
    },
    {
      id: '4',
      contactName: 'Emily Wilson',
      contactPhone: '+1 (555) 321-0987',
      timestamp: new Date('2024-01-15T15:10:00'),
      duration: '6:12',
      status: 'completed',
      outcome: 'positive',
      sentiment: 0.8,
      hasRecording: true,
      hasTranscript: true
    },
    {
      id: '5',
      contactName: 'Robert Brown',
      contactPhone: '+1 (555) 654-3210',
      timestamp: new Date('2024-01-15T16:30:00'),
      duration: '1:30',
      status: 'voicemail',
      outcome: 'neutral',
      sentiment: 0.0,
      hasRecording: true,
      hasTranscript: false
    }
  ]);

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

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Call History</h3>
        <p className="text-gray-600 text-sm">Click on any call to view detailed analytics</p>
      </div>
      
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
    </div>
  );
};

export default CallAnalyticsTable;
