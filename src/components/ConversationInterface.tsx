
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX, Settings, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
}

const ConversationInterface = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [apiKey, setApiKey] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: 'Conversation ready. Click "Start Conversation" to begin.',
      timestamp: new Date()
    }
  ]);

  const addMessage = (type: 'user' | 'agent' | 'system', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const startConversation = async () => {
    if (!apiKey) {
      addMessage('system', 'Please enter your ElevenLabs API key to start a conversation.');
      return;
    }

    try {
      setIsConnected(true);
      addMessage('system', 'Connecting to ElevenLabs voice agent...');
      
      // Simulate connection process
      setTimeout(() => {
        addMessage('agent', 'Hello! I\'m your voice assistant. How can I help you today?');
        setIsSpeaking(true);
        setTimeout(() => setIsSpeaking(false), 2000);
      }, 1500);
    } catch (error) {
      addMessage('system', 'Failed to connect to voice agent. Please check your API key.');
      setIsConnected(false);
    }
  };

  const endConversation = () => {
    setIsConnected(false);
    setIsSpeaking(false);
    addMessage('system', 'Conversation ended.');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Live Conversation</h2>
          <p className="text-slate-400">Test and interact with your voice agents in real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={isConnected ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
          {isSpeaking && (
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse">
              Agent Speaking
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversation Area */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800/50 border-slate-700 h-[600px] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="text-white flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Voice Conversation
              </CardTitle>
              <CardDescription className="text-slate-400">
                Speak with your AI agent or type messages below
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-4 pr-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex items-start gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={message.type === 'user' ? 'bg-purple-600' : message.type === 'agent' ? 'bg-emerald-600' : 'bg-slate-600'}>
                            {message.type === 'user' ? <User className="w-4 h-4" /> : 
                             message.type === 'agent' ? <Mic className="w-4 h-4" /> : 
                             <Settings className="w-4 h-4" />}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`rounded-lg p-3 ${
                          message.type === 'user' ? 'bg-purple-600 text-white' :
                          message.type === 'agent' ? 'bg-slate-700 text-white' :
                          'bg-slate-600/50 text-slate-300'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message or use voice..."
                  className="bg-slate-700 border-slate-600 text-white"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      addMessage('user', e.currentTarget.value);
                      e.currentTarget.value = '';
                      // Simulate agent response
                      setTimeout(() => {
                        addMessage('agent', 'I understand. Let me help you with that.');
                        setIsSpeaking(true);
                        setTimeout(() => setIsSpeaking(false), 2000);
                      }, 1000);
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className={`border-slate-600 ${isMuted ? 'text-red-400' : 'text-slate-300'} hover:bg-slate-800`}
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls Panel */}
        <div className="space-y-6">
          {/* Connection Control */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Connection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">ElevenLabs API Key</label>
                <Input
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              {!isConnected ? (
                <Button
                  onClick={startConversation}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Start Conversation
                </Button>
              ) : (
                <Button
                  onClick={endConversation}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <PhoneOff className="w-4 h-4 mr-2" />
                  End Conversation
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Audio Controls */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Audio Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-slate-300">Volume</label>
                  <span className="text-sm text-slate-400">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex-1 border-slate-600 ${isMuted ? 'text-red-400' : 'text-slate-300'} hover:bg-slate-800`}
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                  {isMuted ? 'Unmute' : 'Mute'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex-1 border-slate-600 ${volume === 0 ? 'text-red-400' : 'text-slate-300'} hover:bg-slate-800`}
                  onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
                >
                  {volume === 0 ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
                  Speaker
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Agent Status */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Agent Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Status</span>
                <Badge variant="outline" className={isConnected ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'}>
                  {isConnected ? 'Online' : 'Offline'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Voice</span>
                <span className="text-sm text-slate-400">Sarah</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Language</span>
                <span className="text-sm text-slate-400">English</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Response Time</span>
                <span className="text-sm text-slate-400">1.2s avg</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConversationInterface;
