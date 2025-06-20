
import { Badge } from '@/components/ui/badge';
import { Clock, Phone } from 'lucide-react';

interface CallHeaderProps {
  contactName: string | null;
  phone: string;
  status: string;
  callStatus: string;
  duration: number | null;
  startedAt: string;
}

const CallHeader = ({ contactName, phone, status, callStatus, duration, startedAt }: CallHeaderProps) => {
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

  const formatDuration = (duration: number | null) => {
    if (!duration) return 'N/A';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Call with {contactName || 'Unknown Contact'}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{phone}</p>
          <div className="flex items-center gap-4 flex-wrap">
            <Badge variant="outline" className={getStatusColor(status)}>
              {status}
            </Badge>
            <Badge variant="outline" className={getCallStatusColor(callStatus)}>
              {callStatus}
            </Badge>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(duration)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Phone className="w-4 h-4" />
              <span>{new Date(startedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallHeader;
