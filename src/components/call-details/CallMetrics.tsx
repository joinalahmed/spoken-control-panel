
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, CheckCircle, XCircle, MessageSquare, Calendar } from 'lucide-react';

interface CallMetricsProps {
  duration: number | null;
  status: string;
  callStatus: string;
  outcome: string | null;
  objectiveMet: boolean | null;
  rescheduleFor: string | null;
  sentiment: number | null;
}

const CallMetrics = ({ 
  duration, 
  status, 
  callStatus, 
  outcome, 
  objectiveMet, 
  rescheduleFor, 
  sentiment 
}: CallMetricsProps) => {
  const formatDuration = (duration: number | null) => {
    if (!duration) return 'N/A';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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

  return (
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
            <span className="text-gray-900 font-medium">{formatDuration(duration)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status</span>
            <span className="text-gray-900 font-medium capitalize">{status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Call Status</span>
            <span className="text-gray-900 font-medium capitalize">{callStatus}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Outcome</span>
            <span className="text-gray-900 font-medium">{outcome || 'N/A'}</span>
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
              {objectiveMet === true ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : objectiveMet === false ? (
                <XCircle className="w-4 h-4 text-red-500" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-gray-400" />
              )}
              <span className="text-gray-900 font-medium">
                {objectiveMet === true ? 'Yes' : objectiveMet === false ? 'No' : 'N/A'}
              </span>
            </div>
          </div>
          {callStatus === 'rescheduled' && rescheduleFor && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Rescheduled For</span>
              </div>
              <p className="text-blue-600 text-sm mt-1">
                {new Date(rescheduleFor).toLocaleString()}
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
            <div className={`text-3xl font-bold mb-1 ${getSentimentColor(sentiment)}`}>
              {sentiment ? Math.round(sentiment * 100) : 'N/A'}%
            </div>
            <p className={`text-sm font-medium ${getSentimentColor(sentiment)}`}>
              {getSentimentLabel(sentiment)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CallMetrics;
