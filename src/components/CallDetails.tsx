
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, Download, Phone, Clock, TrendingUp, User, MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface CallDetailsProps {
  callId: string;
  onBack: () => void;
}

const CallDetails = ({ callId, onBack }: CallDetailsProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Mock data - in a real app, this would come from the database
  const callData = {
    id: callId,
    contactName: 'John Smith',
    contactPhone: '+1 (555) 123-4567',
    timestamp: new Date('2024-01-15T10:30:00'),
    duration: '4:23',
    status: 'completed',
    outcome: 'positive',
    sentiment: 0.7,
    recordingUrl: '/mock-recording.mp3',
    transcript: [
      { speaker: 'agent', text: "Hello, this is Sarah from ABC Company. Is this John Smith?", timestamp: '00:00' },
      { speaker: 'contact', text: "Yes, this is John speaking.", timestamp: '00:05' },
      { speaker: 'agent', text: "Hi John! I'm calling to follow up on your interest in our solar panel installation services. Do you have a few minutes to chat?", timestamp: '00:08' },
      { speaker: 'contact', text: "Sure, I do have some time. I've been thinking about solar panels for a while now.", timestamp: '00:18' },
      { speaker: 'agent', text: "That's great to hear! Based on your location and home size, we estimate you could save about 40% on your electricity bills. Would you like to schedule a free consultation?", timestamp: '00:25' },
      { speaker: 'contact', text: "That sounds interesting. What would the consultation involve?", timestamp: '00:40' },
      { speaker: 'agent', text: "One of our solar specialists would visit your home to assess your roof and energy needs. It takes about 30 minutes and there's no obligation.", timestamp: '00:45' },
      { speaker: 'contact', text: "Okay, I'd like to schedule that. When are you available?", timestamp: '01:00' }
    ],
    keyInsights: [
      'Customer expressed strong interest in solar panels',
      'Mentioned 40% savings which resonated well',
      'Successfully scheduled consultation',
      'Positive sentiment throughout conversation'
    ],
    callMetrics: {
      talkTime: '4:23',
      silenceTime: '0:15',
      agentTalkTime: '2:10',
      contactTalkTime: '2:13',
      interruptionCount: 2,
      sentimentScore: 0.7
    }
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

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.3) return 'text-green-400';
    if (sentiment < -0.3) return 'text-red-400';
    return 'text-yellow-400';
  };

  const getSentimentLabel = (sentiment: number) => {
    if (sentiment > 0.3) return 'Positive';
    if (sentiment < -0.3) return 'Negative';
    return 'Neutral';
  };

  return (
    <div className="flex-1 bg-slate-900 p-6 overflow-y-auto">
      <div className="mb-6">
        <Button 
          onClick={onBack}
          variant="outline" 
          className="mb-4 border-slate-600 text-slate-300 hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Call History
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Call with {callData.contactName}</h1>
            <p className="text-slate-400 mb-4">{callData.contactPhone}</p>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className={getStatusColor(callData.status)}>
                {callData.status}
              </Badge>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Clock className="w-4 h-4" />
                <span>{callData.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Phone className="w-4 h-4" />
                <span>{callData.timestamp.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Call Metrics */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Call Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Duration</span>
              <span className="text-white">{callData.callMetrics.talkTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Agent Talk Time</span>
              <span className="text-white">{callData.callMetrics.agentTalkTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Contact Talk Time</span>
              <span className="text-white">{callData.callMetrics.contactTalkTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Interruptions</span>
              <span className="text-white">{callData.callMetrics.interruptionCount}</span>
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Analysis */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-1 ${getSentimentColor(callData.sentiment)}`}>
                {Math.round(callData.sentiment * 100)}%
              </div>
              <p className={`text-sm ${getSentimentColor(callData.sentiment)}`}>
                {getSentimentLabel(callData.sentiment)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recording Player */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg">Call Recording</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>1:58</span>
              <span>{callData.duration}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transcript */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Call Transcript</CardTitle>
            <CardDescription className="text-slate-400">
              Full conversation transcript with timestamps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {callData.transcript.map((entry, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      entry.speaker === 'agent' ? 'bg-purple-600' : 'bg-blue-600'
                    }`}>
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white capitalize">
                        {entry.speaker}
                      </span>
                      <span className="text-xs text-slate-500">{entry.timestamp}</span>
                    </div>
                    <p className="text-slate-300 text-sm">{entry.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Key Insights</CardTitle>
            <CardDescription className="text-slate-400">
              AI-extracted insights from the conversation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {callData.keyInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                  <p className="text-slate-300 text-sm">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CallDetails;
