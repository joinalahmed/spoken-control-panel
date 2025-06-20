
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

interface CallTranscriptProps {
  transcript: string | null;
}

const CallTranscript = ({ transcript }: CallTranscriptProps) => {
  const parseTranscript = (transcript: string | null) => {
    if (!transcript) return [];
    
    // Try to parse as JSON first (for structured transcript)
    try {
      const parsed = JSON.parse(transcript);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      // If not JSON, treat as plain text and create a simple structure
      return [
        { speaker: 'transcript', text: transcript, timestamp: '00:00' }
      ];
    }
    
    return [];
  };

  const transcriptEntries = parseTranscript(transcript);

  return (
    <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-gray-900">Call Transcript</CardTitle>
        <CardDescription className="text-gray-600">
          {transcriptEntries.length > 0 ? 'Full conversation transcript' : 'No transcript available'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transcriptEntries.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {transcriptEntries.map((entry, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    entry.speaker === 'agent' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    <User className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {entry.speaker}
                    </span>
                    {entry.timestamp && (
                      <span className="text-xs text-gray-500">{entry.timestamp}</span>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{entry.text}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No transcript available for this call.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CallTranscript;
