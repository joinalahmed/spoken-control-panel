import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Save, Settings as SettingsIcon, Globe, Mic, Trash2, Plus, Key, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { useCustomVoices } from '@/hooks/useCustomVoices';
import { useApiKeys } from '@/hooks/useApiKeys';

const Settings = () => {
  console.log('Settings component rendering...');
  
  const [outboundCallUrl, setOutboundCallUrl] = useState('');
  const { getSetting, setSetting, isLoading } = useSystemSettings();
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Voice management state
  const { voices, createVoice, deleteVoice, isLoading: voicesLoading } = useCustomVoices();
  const [newVoiceName, setNewVoiceName] = useState('');
  const [newVoiceId, setNewVoiceId] = useState('');

  // API Key management state
  const { generateApiKey, getApiKey, revokeApiKey, isLoading: apiKeyLoading } = useApiKeys();
  const [currentApiKey, setCurrentApiKey] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  console.log('Voice management state:', { voices, voicesLoading });

  useEffect(() => {
    console.log('Settings page mounted');
    let isMounted = true;
    
    const loadSettings = async () => {
      if (!isMounted) return;
      
      setIsLoadingData(true);
      try {
        console.log('Loading system settings...');
        const savedUrl = await getSetting('outbound_call_api_url');
        console.log('Loaded saved URL:', savedUrl);
        
        // Load API key
        const apiKey = await getApiKey();
        setCurrentApiKey(apiKey);
        
        if (!isMounted) return;
        
        if (savedUrl) {
          setOutboundCallUrl(savedUrl);
        } else {
          // Set default value
          const defaultUrl = 'https://7263-49-207-61-173.ngrok-free.app/outbound_call';
          setOutboundCallUrl(defaultUrl);
          console.log('Set default URL:', defaultUrl);
        }
      } catch (error) {
        console.error('Error loading system settings:', error);
        if (isMounted) {
          const defaultUrl = 'https://7263-49-207-61-173.ngrok-free.app/outbound_call';
          setOutboundCallUrl(defaultUrl);
          toast.error('Failed to load settings, using default values');
        }
      } finally {
        if (isMounted) {
          setIsLoadingData(false);
          console.log('Settings loading complete');
        }
      }
    };

    loadSettings();
    
    return () => {
      isMounted = false;
    };
  }, [getSetting, getApiKey]);

  const handleSave = async () => {
    if (!outboundCallUrl.trim()) {
      toast.error('API URL cannot be empty');
      return;
    }

    // Basic URL validation
    try {
      new URL(outboundCallUrl);
    } catch (error) {
      toast.error('Please enter a valid URL');
      return;
    }

    console.log('Saving system setting:', outboundCallUrl);
    const success = await setSetting('outbound_call_api_url', outboundCallUrl);
    
    if (success) {
      toast.success('Settings saved successfully');
      console.log('System settings saved successfully');
    } else {
      toast.error('Failed to save settings');
      console.error('Failed to save system settings');
    }
  };

  const resetToDefault = () => {
    const defaultUrl = 'https://7263-49-207-61-173.ngrok-free.app/outbound_call';
    setOutboundCallUrl(defaultUrl);
    toast.info('Reset to default URL');
  };

  const handleAddVoice = async () => {
    if (!newVoiceName.trim() || !newVoiceId.trim()) {
      toast.error('Please enter both voice name and voice ID');
      return;
    }

    try {
      await createVoice.mutateAsync({
        voice_name: newVoiceName.trim(),
        voice_id: newVoiceId.trim()
      });
      
      setNewVoiceName('');
      setNewVoiceId('');
      toast.success('Voice added successfully');
    } catch (error) {
      console.error('Error adding voice:', error);
      toast.error('Failed to add voice');
    }
  };

  const handleDeleteVoice = async (voiceId: string, voiceName: string) => {
    try {
      await deleteVoice.mutateAsync(voiceId);
      toast.success(`Voice "${voiceName}" deleted successfully`);
    } catch (error) {
      console.error('Error deleting voice:', error);
      toast.error('Failed to delete voice');
    }
  };

  const handleGenerateApiKey = async () => {
    try {
      const newApiKey = await generateApiKey();
      setCurrentApiKey(newApiKey);
    } catch (error) {
      console.error('Error generating API key:', error);
    }
  };

  const handleRevokeApiKey = async () => {
    try {
      const success = await revokeApiKey();
      if (success) {
        setCurrentApiKey(null);
        setShowApiKey(false);
      }
    } catch (error) {
      console.error('Error revoking API key:', error);
    }
  };

  const copyApiKey = async () => {
    if (currentApiKey) {
      try {
        await navigator.clipboard.writeText(currentApiKey);
        toast.success('API key copied to clipboard');
      } catch (error) {
        toast.error('Failed to copy API key');
      }
    }
  };

  console.log('Settings page render - isLoadingData:', isLoadingData, 'outboundCallUrl:', outboundCallUrl);

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Configure your application settings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* API Key Management Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                API Key Management
              </CardTitle>
              <CardDescription>
                Generate and manage your personal API key for programmatic access to create agents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentApiKey ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Your API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        type={showApiKey ? 'text' : 'password'}
                        value={currentApiKey}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyApiKey}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Usage Example</h4>
                    <code className="text-sm text-blue-800 bg-blue-100 p-2 rounded block whitespace-pre-wrap">
{`curl --location 'https://vegryoncdzcxmornresu.supabase.co/functions/v1/create-agent' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer ${showApiKey ? currentApiKey : '••••••••••••••••'}' \\
--header 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \\
--data '{
    "name": "Your Agent Name",
    "agent_type": "inbound",
    "company": "Your Company"
}'`}
                    </code>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleGenerateApiKey}
                      disabled={apiKeyLoading}
                      variant="outline"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerate Key
                    </Button>
                    <Button
                      onClick={handleRevokeApiKey}
                      disabled={apiKeyLoading}
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Revoke Key
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Key className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No API Key Generated</h3>
                  <p className="text-gray-600 mb-4">
                    Generate an API key to create agents programmatically from external systems
                  </p>
                  <Button
                    onClick={handleGenerateApiKey}
                    disabled={apiKeyLoading}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    {apiKeyLoading ? 'Generating...' : 'Generate API Key'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* API Configuration Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                API Configuration
              </CardTitle>
              <CardDescription>
                Configure the endpoints for external API services (System-wide settings)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="outbound-call-url">Outbound Call API URL</Label>
                <Input
                  id="outbound-call-url"
                  type="url"
                  placeholder="https://your-api-endpoint.com/outbound_call"
                  value={outboundCallUrl}
                  onChange={(e) => setOutboundCallUrl(e.target.value)}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-gray-500">
                  The URL endpoint used for triggering outbound calls. This should point to your call service API.
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Settings'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={resetToDefault}
                  disabled={isLoading}
                >
                  Reset to Default
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Voice Management Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Voice Management
                <span className="text-sm text-gray-500">
                  (Debug: {voicesLoading ? 'Loading...' : `${voices?.length || 0} voices`})
                </span>
              </CardTitle>
              <CardDescription>
                Manage custom voices for your AI agents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Voice */}
              <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h4 className="font-medium text-gray-900">Add New Voice</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="voice-name">Voice Name</Label>
                    <Input
                      id="voice-name"
                      placeholder="e.g., Professional Sarah"
                      value={newVoiceName}
                      onChange={(e) => setNewVoiceName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="voice-id">ElevenLabs Voice ID</Label>
                    <Input
                      id="voice-id"
                      placeholder="e.g., EXAVITQu4vr4xnSDxMaL"
                      value={newVoiceId}
                      onChange={(e) => setNewVoiceId(e.target.value)}
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleAddVoice}
                  disabled={voicesLoading || !newVoiceName.trim() || !newVoiceId.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Voice
                </Button>
              </div>

              {/* Custom Voices List */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Custom Voices</h4>
                {voicesLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Loading voices...</p>
                  </div>
                ) : voices && voices.length > 0 ? (
                  <div className="space-y-2">
                    {voices.map((voice) => (
                      <div key={voice.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{voice.voice_name}</p>
                          <p className="text-sm text-gray-500 font-mono">{voice.voice_id}</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteVoice(voice.id, voice.voice_name)}
                          disabled={voicesLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Mic className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No custom voices added yet</p>
                    <p className="text-sm">Add your first custom voice above</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* About Card */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
              <CardDescription>
                Application information and version details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Application:</strong> Dhwani Voice AI Agents
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Version:</strong> 1.0.0
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Build:</strong> {new Date().toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
