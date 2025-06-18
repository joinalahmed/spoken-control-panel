
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Save, Settings as SettingsIcon, Globe } from 'lucide-react';
import { useUserSettings } from '@/hooks/useUserSettings';

const Settings = () => {
  const [outboundCallUrl, setOutboundCallUrl] = useState('');
  const { getSetting, setSetting, isLoading } = useUserSettings();
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    console.log('Settings page mounted');
    const loadSettings = async () => {
      setIsLoadingData(true);
      try {
        console.log('Loading settings...');
        const savedUrl = await getSetting('outbound_call_api_url');
        console.log('Loaded saved URL:', savedUrl);
        if (savedUrl) {
          setOutboundCallUrl(savedUrl);
        } else {
          // Set default value
          const defaultUrl = 'https://7263-49-207-61-173.ngrok-free.app/outbound_call';
          setOutboundCallUrl(defaultUrl);
          console.log('Set default URL:', defaultUrl);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        const defaultUrl = 'https://7263-49-207-61-173.ngrok-free.app/outbound_call';
        setOutboundCallUrl(defaultUrl);
        toast.error('Failed to load settings, using default values');
      } finally {
        setIsLoadingData(false);
        console.log('Settings loading complete');
      }
    };

    loadSettings();
  }, [getSetting]);

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

    console.log('Saving setting:', outboundCallUrl);
    const success = await setSetting('outbound_call_api_url', outboundCallUrl);
    
    if (success) {
      toast.success('Settings saved successfully');
      console.log('Settings saved successfully');
    } else {
      toast.error('Failed to save settings');
      console.error('Failed to save settings');
    }
  };

  const resetToDefault = () => {
    const defaultUrl = 'https://7263-49-207-61-173.ngrok-free.app/outbound_call';
    setOutboundCallUrl(defaultUrl);
    toast.info('Reset to default URL');
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
          {/* API Configuration Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                API Configuration
              </CardTitle>
              <CardDescription>
                Configure the endpoints for external API services
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

          {/* Additional Settings Cards can be added here */}
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
