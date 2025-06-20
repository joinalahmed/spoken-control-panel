
import { useState, useEffect, useRef } from 'react';

export const useAudioPlayer = (recordingUrl: string | null) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (recordingUrl) {
      console.log('Setting up audio with URL:', recordingUrl);
      setIsLoadingAudio(true);
      setAudioError(null);
      
      // Reset audio states
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
    }
  }, [recordingUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      console.log('Audio metadata loaded, duration:', audio.duration);
      setDuration(audio.duration);
      setIsLoadingAudio(false);
    };
    const handleEnded = () => setIsPlaying(false);
    const handleLoadStart = () => {
      console.log('Audio load started');
      setIsLoadingAudio(true);
    };
    const handleCanPlay = () => {
      console.log('Audio can play');
      setIsLoadingAudio(false);
      setAudioError(null);
    };
    const handleError = (e: Event) => {
      const target = e.target as HTMLAudioElement;
      console.error('Audio error details:', {
        error: target.error,
        networkState: target.networkState,
        readyState: target.readyState,
        src: target.src
      });
      setIsLoadingAudio(false);
      setAudioError('Failed to load audio - CORS or network issue');
    };
    const handleLoadedData = () => {
      console.log('Audio data loaded');
      setIsLoadingAudio(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [recordingUrl]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch((error) => {
        console.error('Play failed:', error);
        setAudioError('Failed to play audio');
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
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

  return {
    isPlaying,
    isLoadingAudio,
    currentTime,
    duration,
    audioError,
    audioRef,
    togglePlayback,
    handleSeek,
    formatTime
  };
};
