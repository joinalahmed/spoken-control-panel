
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface CampaignSettingsData {
  callScheduling: {
    startTime: string;
    endTime: string;
    timezone: string;
    daysOfWeek: string[];
  };
  retryLogic: {
    maxRetries: number;
    retryInterval: number; // in minutes
    enableRetry: boolean;
  };
  callBehavior: {
    maxCallDuration: number; // in minutes
    recordCalls: boolean;
    enableVoicemail: boolean;
  };
}

interface CampaignSettingsProps {
  settings: CampaignSettingsData;
  onSettingsChange: (settings: CampaignSettingsData) => void;
}

export const defaultSettings: CampaignSettingsData = {
  callScheduling: {
    startTime: '09:00',
    endTime: '17:00',
    timezone: 'UTC',
    daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  },
  retryLogic: {
    maxRetries: 3,
    retryInterval: 60,
    enableRetry: true
  },
  callBehavior: {
    maxCallDuration: 15,
    recordCalls: true,
    enableVoicemail: false
  }
};

const CampaignSettings: React.FC<CampaignSettingsProps> = ({ settings, onSettingsChange }) => {
  const updateSetting = (section: keyof CampaignSettingsData, key: string, value: any) => {
    onSettingsChange({
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value
      }
    });
  };

  const toggleDayOfWeek = (day: string) => {
    const currentDays = settings.callScheduling.daysOfWeek;
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    
    updateSetting('callScheduling', 'daysOfWeek', newDays);
  };

  const daysOfWeek = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' }
  ];

  return (
    <div className="space-y-6">
      {/* Call Scheduling */}
      <Card>
        <CardHeader>
          <CardTitle>Call Scheduling</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={settings.callScheduling.startTime}
                onChange={(e) => updateSetting('callScheduling', 'startTime', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={settings.callScheduling.endTime}
                onChange={(e) => updateSetting('callScheduling', 'endTime', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Timezone</Label>
            <Select 
              value={settings.callScheduling.timezone} 
              onValueChange={(value) => updateSetting('callScheduling', 'timezone', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">Eastern Time</SelectItem>
                <SelectItem value="America/Chicago">Central Time</SelectItem>
                <SelectItem value="America/Denver">Mountain Time</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Days of Week</Label>
            <div className="flex gap-2 mt-2">
              {daysOfWeek.map((day) => (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => toggleDayOfWeek(day.key)}
                  className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                    settings.callScheduling.daysOfWeek.includes(day.key)
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Retry Logic */}
      <Card>
        <CardHeader>
          <CardTitle>Retry Logic</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="enableRetry">Enable Automatic Retries</Label>
            <Switch
              id="enableRetry"
              checked={settings.retryLogic.enableRetry}
              onCheckedChange={(checked) => updateSetting('retryLogic', 'enableRetry', checked)}
            />
          </div>

          {settings.retryLogic.enableRetry && (
            <>
              <div>
                <Label htmlFor="maxRetries">Maximum Retries</Label>
                <Input
                  id="maxRetries"
                  type="number"
                  min="1"
                  max="10"
                  value={settings.retryLogic.maxRetries}
                  onChange={(e) => updateSetting('retryLogic', 'maxRetries', parseInt(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="retryInterval">Retry Interval (minutes)</Label>
                <Input
                  id="retryInterval"
                  type="number"
                  min="1"
                  max="1440"
                  value={settings.retryLogic.retryInterval}
                  onChange={(e) => updateSetting('retryLogic', 'retryInterval', parseInt(e.target.value))}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Call Behavior */}
      <Card>
        <CardHeader>
          <CardTitle>Call Behavior</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="maxCallDuration">Maximum Call Duration (minutes)</Label>
            <Input
              id="maxCallDuration"
              type="number"
              min="1"
              max="60"
              value={settings.callBehavior.maxCallDuration}
              onChange={(e) => updateSetting('callBehavior', 'maxCallDuration', parseInt(e.target.value))}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="recordCalls">Record Calls</Label>
            <Switch
              id="recordCalls"
              checked={settings.callBehavior.recordCalls}
              onCheckedChange={(checked) => updateSetting('callBehavior', 'recordCalls', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enableVoicemail">Enable Voicemail Detection</Label>
            <Switch
              id="enableVoicemail"
              checked={settings.callBehavior.enableVoicemail}
              onCheckedChange={(checked) => updateSetting('callBehavior', 'enableVoicemail', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignSettings;
