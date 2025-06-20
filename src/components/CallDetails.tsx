
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useCallDetails } from '@/hooks/useCallDetails';
import CallHeader from './call-details/CallHeader';
import CallMetrics from './call-details/CallMetrics';
import AudioPlayer from './call-details/AudioPlayer';
import ExtractedData from './call-details/ExtractedData';
import CallTranscript from './call-details/CallTranscript';
import CallNotes from './call-details/CallNotes';

interface CallDetailsProps {
  callId: string;
  onBack: () => void;
}

const CallDetails = ({ callId, onBack }: CallDetailsProps) => {
  const { callData, contactData, isLoading, error } = useCallDetails(callId);

  if (isLoading) {
    return (
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto min-h-screen">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading call details...</span>
        </div>
      </div>
    );
  }

  if (error || !callData) {
    return (
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto min-h-screen">
        <Button 
          onClick={onBack}
          variant="outline" 
          size="icon"
          className="mb-4 border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">{error || 'Call not found'}</p>
            <p className="text-gray-500">Please try again or contact support if the issue persists.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button 
            onClick={onBack}
            variant="outline" 
            size="icon"
            className="mb-6 border-gray-300 text-gray-700 hover:bg-gray-100 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <CallHeader
            contactName={contactData?.name || null}
            phone={callData.phone}
            status={callData.status}
            callStatus={callData.call_status}
            duration={callData.duration}
            startedAt={callData.started_at}
          />
        </div>

        <CallMetrics
          duration={callData.duration}
          status={callData.status}
          callStatus={callData.call_status}
          outcome={callData.outcome}
          objectiveMet={callData.objective_met}
          rescheduleFor={callData.rescheduled_for}
          sentiment={callData.sentiment}
        />

        <AudioPlayer recordingUrl={callData.recording_url} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExtractedData extractedData={callData.extracted_data} />
          <CallTranscript transcript={callData.transcript} />
        </div>

        <CallNotes notes={callData.notes} />
      </div>
    </div>
  );
};

export default CallDetails;
