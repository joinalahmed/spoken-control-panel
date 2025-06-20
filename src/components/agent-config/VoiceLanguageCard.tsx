
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali', disabled: true },
  { code: 'te', name: 'Telugu', disabled: true },
  { code: 'mr', name: 'Marathi', disabled: true },
  { code: 'ta', name: 'Tamil', disabled: true },
  { code: 'gu', name: 'Gujarati', disabled: true },
  { code: 'ur', name: 'Urdu', disabled: true },
  { code: 'kn', name: 'Kannada', disabled: true },
  { code: 'or', name: 'Odia', disabled: true },
  { code: 'pa', name: 'Punjabi', disabled: true },
  { code: 'as', name: 'Assamese', disabled: true },
  { code: 'ml', name: 'Malayalam', disabled: true },
  { code: 'sa', name: 'Sanskrit', disabled: true },
  { code: 'ne', name: 'Nepali', disabled: true },
  { code: 'sd', name: 'Sindhi', disabled: true },
  { code: 'kok', name: 'Konkani', disabled: true },
  { code: 'mni', name: 'Manipuri', disabled: true },
  { code: 'doi', name: 'Dogri', disabled: true },
  { code: 'sat', name: 'Santali', disabled: true },
  { code: 'mai', name: 'Maithili', disabled: true },
  { code: 'bo', name: 'Bodo', disabled: true }
];

interface VoiceLanguageCardProps {
  config: {
    firstMessage: string;
    voice: string;
    languages: string[];
  };
  onConfigChange: (updates: Partial<{ firstMessage: string; voice: string; languages: string[] }>) => void;
  voiceOptions: Array<{ id: string; name: string }>;
  voicesLoading: boolean;
}

const VoiceLanguageCard = ({ config, onConfigChange, voiceOptions, voicesLoading }: VoiceLanguageCardProps) => {
  const handleLanguageToggle = (languageCode: string) => {
    const language = AVAILABLE_LANGUAGES.find(l => l.code === languageCode);
    if (language?.disabled) return;
    
    const updatedLanguages = config.languages.includes(languageCode)
      ? config.languages.filter(lang => lang !== languageCode)
      : [...config.languages, languageCode];
    onConfigChange({ languages: updatedLanguages });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Voice & Language</CardTitle>
        <CardDescription>Configure voice and language settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* First Message */}
        <div className="space-y-2">
          <Label htmlFor="firstMessage" className="text-sm font-medium text-gray-700">
            First Message
          </Label>
          <Input
            id="firstMessage"
            value={config.firstMessage}
            onChange={(e) => onConfigChange({ firstMessage: e.target.value })}
            className="w-full"
            placeholder="Hello! How can I help you today?"
          />
          <p className="text-xs text-gray-500">
            The first message that the assistant will say when starting a conversation.
          </p>
        </div>

        {/* Voice Selection */}
        <div className="space-y-2">
          <Label htmlFor="voice" className="text-sm font-medium text-gray-700">
            Voice
          </Label>
          <Select 
            value={config.voice} 
            onValueChange={(value) => onConfigChange({ voice: value })}
            disabled={voicesLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={voicesLoading ? "Loading voices..." : voiceOptions.length === 0 ? "No custom voices available" : "Select voice"} />
            </SelectTrigger>
            <SelectContent>
              {voiceOptions.length === 0 && !voicesLoading ? (
                <SelectItem value="no-voices" disabled>
                  No custom voices available
                </SelectItem>
              ) : (
                voiceOptions.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    {voice.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {voicesLoading && (
            <p className="text-xs text-gray-500">Loading custom voices...</p>
          )}
          {voiceOptions.length === 0 && !voicesLoading && (
            <p className="text-xs text-gray-500">
              No custom voices found. Please add custom voices in Settings to see them here.
            </p>
          )}
        </div>

        {/* Languages */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Languages (Multi-select)
          </Label>
          <div className="border rounded-lg p-3 max-h-48 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_LANGUAGES.map((language) => (
                <label 
                  key={language.code} 
                  className={`flex items-center space-x-2 ${language.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <input
                    type="checkbox"
                    checked={config.languages.includes(language.code)}
                    onChange={() => handleLanguageToggle(language.code)}
                    disabled={language.disabled}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{language.name}</span>
                  {language.disabled && (
                    <span className="text-xs text-gray-400">(Coming Soon)</span>
                  )}
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {config.languages.map((langCode) => {
              const language = AVAILABLE_LANGUAGES.find(l => l.code === langCode);
              return (
                <Badge key={langCode} variant="outline" className="text-xs">
                  {language?.name || langCode.toUpperCase()}
                </Badge>
              );
            })}
          </div>
          <p className="text-xs text-gray-500">
            Select the languages this agent can communicate in. Currently only English and Hindi are available.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceLanguageCard;
