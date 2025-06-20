
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Download, Loader2 } from 'lucide-react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface AudioPlayerProps {
  recordingUrl: string | null;
}

const AudioPlayer = ({ recordingUrl }: AudioPlayerProps) => {
  const {
    isPlaying,
    audioUrl,
    isLoadingAudio,
    currentTime,
    duration,
    audioRef,
    togglePlayback,
    handleSeek,
    formatTime
  } = useAudioPlayer(recordingUrl);

  return (
    <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-gray-900 text-lg">Call Recording</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recordingUrl ? (
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
                    onClick={() => window.open(recordingUrl!, '_blank')}
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
  );
};

export default AudioPlayer;
