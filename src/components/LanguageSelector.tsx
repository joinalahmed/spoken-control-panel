
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const INDIAN_LANGUAGES = [
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

interface LanguageSelectorProps {
  selectedLanguages: string[];
  onLanguageChange: (languages: string[]) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  selectedLanguages, 
  onLanguageChange 
}) => {
  const handleLanguageToggle = (languageCode: string) => {
    const language = INDIAN_LANGUAGES.find(l => l.code === languageCode);
    if (language?.disabled) return;
    
    const updatedLanguages = selectedLanguages.includes(languageCode)
      ? selectedLanguages.filter(lang => lang !== languageCode)
      : [...selectedLanguages, languageCode];
    
    onLanguageChange(updatedLanguages);
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">
        Languages (Multi-select)
      </Label>
      <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
        {INDIAN_LANGUAGES.map((language) => (
          <div key={language.code} className={`flex items-center space-x-2 ${language.disabled ? 'opacity-50' : ''}`}>
            <Checkbox
              id={language.code}
              checked={selectedLanguages.includes(language.code)}
              onCheckedChange={() => handleLanguageToggle(language.code)}
              disabled={language.disabled}
            />
            <Label
              htmlFor={language.code}
              className={`text-sm font-normal text-gray-700 ${language.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {language.name}
              {language.disabled && (
                <span className="text-xs text-gray-400 ml-1">(Coming Soon)</span>
              )}
            </Label>
          </div>
        ))}
      </div>
      {selectedLanguages.length > 0 && (
        <div className="text-xs text-gray-500">
          Selected: {selectedLanguages.length} language{selectedLanguages.length !== 1 ? 's' : ''}
        </div>
      )}
      <p className="text-xs text-gray-500">
        Currently only English and Hindi are available. Other languages coming soon.
      </p>
    </div>
  );
};

export default LanguageSelector;
