
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import DataExtractionSettings, { DataField } from './campaign/DataExtractionSettings';

export interface CampaignSettingsData {
  campaignType: 'inbound' | 'outbound';
  callScheduling: {
    startTime: string;
    endTime: string;
    timezone: string;
    daysOfWeek: string[];
  };
  retryLogic: {
    maxRetries: number;
    retryInterval: number;
    enableRetry: boolean;
  };
  callBehavior: {
    maxCallDuration: number;
    recordCalls: boolean;
    enableVoicemail: boolean;
  };
  extractedDataConfig?: DataField[];
}

export const defaultSettings: CampaignSettingsData = {
  campaignType: 'outbound',
  callScheduling: {
    startTime: '09:00',
    endTime: '17:00',
    timezone: 'UTC',
    daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  },
  retryLogic: {
    maxRetries: 3,
    retryInterval: 30,
    enableRetry: true
  },
  callBehavior: {
    maxCallDuration: 300,
    recordCalls: true,
    enableVoicemail: false
  },
  extractedDataConfig: []
};

interface CampaignSettingsProps {
  settings: CampaignSettingsData;
  onSettingsChange: (settings: CampaignSettingsData) => void;
}

const CampaignSettings = ({ settings, onSettingsChange }: CampaignSettingsProps) => {
  const updateSetting = (category: keyof CampaignSettingsData, field: string, value: any) => {
    if (category === 'extractedDataConfig') {
      onSettingsChange({
        ...settings,
        extractedDataConfig: value
      });
    } else {
      onSettingsChange({
        ...settings,
        [category]: {
          ...settings[category],
          [field]: value
        }
      });
    }
  };

  const toggleDayOfWeek = (day: string) => {
    const currentDays = settings.callScheduling.daysOfWeek;
    const updatedDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    
    updateSetting('callScheduling', 'daysOfWeek', updatedDays);
  };

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  return (
    <div className="space-y-6">
      {/* Campaign Type */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="campaignType">Type</Label>
            <Select 
              value={settings.campaignType} 
              onValueChange={(value) => onSettingsChange({ ...settings, campaignType: value as 'inbound' | 'outbound' })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="outbound">Outbound</SelectItem>
                <SelectItem value="inbound">Inbound</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

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
            <Label htmlFor="timezone">Timezone</Label>
            <Select 
              value={settings.callScheduling.timezone} 
              onValueChange={(value) => updateSetting('callScheduling', 'timezone', value)}
            >
              <SelectTrigger>
                <SelectValue />
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
            <div className="flex flex-wrap gap-2 mt-2">
              {daysOfWeek.map((day) => (
                <label key={day.key} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.callScheduling.daysOfWeek.includes(day.key)}
                    onChange={() => toggleDayOfWeek(day.key)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">{day.label}</span>
                </label>
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
          <div className="flex items-center space-x-2">
            <Switch
              id="enableRetry"
              checked={settings.retryLogic.enableRetry}
              onCheckedChange={(checked) => updateSetting('retryLogic', 'enableRetry', checked)}
            />
            <Label htmlFor="enableRetry">Enable automatic retries</Label>
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
            <Label htmlFor="maxCallDuration">Max Call Duration (seconds)</Label>
            <Input
              id="maxCallDuration"
              type="number"
              min="30"
              max="3600"
              value={settings.callBehavior.maxCallDuration}
              onChange={(e) => updateSetting('callBehavior', 'maxCallDuration', parseInt(e.target.value))}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="recordCalls"
              checked={settings.callBehavior.recordCalls}
              onCheckedChange={(checked) => updateSetting('callBehavior', 'recordCalls', checked)}
            />
            <Label htmlFor="recordCalls">Record calls</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="enableVoicemail"
              checked={settings.callBehavior.enableVoicemail}
              onCheckedChange={(checked) => updateSetting('callBehavior', 'enableVoicemail', checked)}
            />
            <Label htmlFor="enableVoicemail">Enable voicemail detection</Label>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Data Extraction Settings */}
      <DataExtractionSettings
        extractedDataConfig={settings.extractedDataConfig || []}
        onConfigChange={(config) => updateSetting('extractedDataConfig', '', config)}
      />
    </div>
  );
};

export default CampaignSettings;
