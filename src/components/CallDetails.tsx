import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, Download, Phone, Clock, TrendingUp, User, MessageSquare, Loader2, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CallDetailsProps {
  callId: string;
  onBack: () => void;
}

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

const CallDetails = ({ callId, onBack }: CallDetailsProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [callData, setCallData] = useState<CallData | null>(null);
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  useEffect(() => {
    const fetchAudio = async () => {
      if (callData?.recording_url) {
        try {
          setIsLoadingAudio(true);
          console.log('Fetching audio from URL:', callData.recording_url);
          
          const response = await fetch(callData.recording_url);
          if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
            console.log('Audio blob created successfully');
          } else {
            console.error('Failed to fetch audio:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('Error fetching audio:', error);
        } finally {
          setIsLoadingAudio(false);
        }
      }
    };

    fetchAudio();

    // Cleanup function to revoke the object URL
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [callData?.recording_url]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const seekTime = (clickX / rect.width) * duration;
    
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (time: number) => {
    if (!time || !isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'no-answer':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getCallStatusColor = (callStatus: string) => {
    switch (callStatus) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rescheduled':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getSentimentColor = (sentiment: number | null) => {
    if (!sentiment) return 'text-slate-400';
    if (sentiment > 0.3) return 'text-green-400';
    if (sentiment < -0.3) return 'text-red-400';
    return 'text-yellow-400';
  };

  const getSentimentLabel = (sentiment: number | null) => {
    if (!sentiment) return 'Unknown';
    if (sentiment > 0.3) return 'Positive';
    if (sentiment < -0.3) return 'Negative';
    return 'Neutral';
  };

  const formatDuration = (duration: number | null) => {
    if (!duration) return 'N/A';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

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

  const renderExtractedDataTable = (extractedData: any) => {
    if (!extractedData || typeof extractedData !== 'object') {
      return <p className="text-gray-500 text-sm">No extracted data available.</p>;
    }

    const entries = Object.entries(extractedData);
    if (entries.length === 0) {
      return <p className="text-gray-500 text-sm">No extracted data available.</p>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-4 py-2 text-left font-medium text-gray-700">Field</th>
              <th className="border border-gray-200 px-4 py-2 text-left font-medium text-gray-700">Value</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([key, value], index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-200 px-4 py-2 font-medium text-gray-700 capitalize">
                  {key.replace(/_/g, ' ')}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-gray-900">
                  {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

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

  const transcriptEntries = parseTranscript(callData.transcript);

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
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Call with {contactData?.name || 'Unknown Contact'}
                </h1>
                <p className="text-lg text-gray-600 mb-4">{callData.phone}</p>
                <div className="flex items-center gap-4 flex-wrap">
                  <Badge variant="outline" className={getStatusColor(callData.status)}>
                    {callData.status}
                  </Badge>
                  <Badge variant="outline" className={getCallStatusColor(callData.call_status)}>
                    {callData.call_status}
                  </Badge>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(callData.duration)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>{new Date(callData.started_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Call Metrics */}
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-gray-900 text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Call Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Duration</span>
                <span className="text-gray-900 font-medium">{formatDuration(callData.duration)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="text-gray-900 font-medium capitalize">{callData.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Call Status</span>
                <span className="text-gray-900 font-medium capitalize">{callData.call_status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Outcome</span>
                <span className="text-gray-900 font-medium">{callData.outcome || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Direction</span>
                <span className="text-gray-900 font-medium">Outbound</span>
              </div>
            </CardContent>
          </Card>

          {/* Objective & Reschedule Status */}
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-gray-900 text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-purple-500" />
                Call Outcome
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Objective Met</span>
                <div className="flex items-center gap-2">
                  {callData.objective_met === true ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : callData.objective_met === false ? (
                    <XCircle className="w-4 h-4 text-red-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-gray-400" />
                  )}
                  <span className="text-gray-900 font-medium">
                    {callData.objective_met === true ? 'Yes' : callData.objective_met === false ? 'No' : 'N/A'}
                  </span>
                </div>
              </div>
              {callData.call_status === 'rescheduled' && callData.rescheduled_for && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Rescheduled For</span>
                  </div>
                  <p className="text-blue-600 text-sm mt-1">
                    {new Date(callData.rescheduled_for).toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sentiment Analysis */}
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-gray-900 text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-500" />
                Sentiment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-1 ${getSentimentColor(callData.sentiment)}`}>
                  {callData.sentiment ? Math.round(callData.sentiment * 100) : 'N/A'}%
                </div>
                <p className={`text-sm font-medium ${getSentimentColor(callData.sentiment)}`}>
                  {getSentimentLabel(callData.sentiment)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recording Player */}
        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-900 text-lg">Call Recording</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {callData.recording_url ? (
              <>
                {isLoadingAudio ? (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading audio...</span>
                  </div>
                ) : audioUrl ? (
                  <>
                    <audio ref={audioRef} src={audioUrl} preload="metadata" />
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        onClick={togglePlayback}
                        disabled={!audioUrl}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isPlaying ? 'Pause' : 'Play'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        onClick={() => window.open(callData.recording_url!, '_blank')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <div 
                      className="w-full bg-gray-200 rounded-full h-2 cursor-pointer"
                      onClick={handleSeek}
                    >
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-150" 
                        style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-red-500 text-sm">Failed to load audio</p>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-sm">No recording available</p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Extracted Data Table */}
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-gray-900">Extracted Call Data</CardTitle>
              <CardDescription className="text-gray-600">
                Key information extracted from the call
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderExtractedDataTable(callData.extracted_data)}
            </CardContent>
          </Card>

          {/* Transcript */}
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
        </div>

        {/* Notes */}
        <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow mt-6">
          <CardHeader>
            <CardTitle className="text-gray-900">Call Notes</CardTitle>
            <CardDescription className="text-gray-600">
              Additional notes and observations from the call
            </CardDescription>
          </CardHeader>
          <CardContent>
            {callData.notes ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 text-sm leading-relaxed">{callData.notes}</p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No notes available for this call.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CallDetails;
