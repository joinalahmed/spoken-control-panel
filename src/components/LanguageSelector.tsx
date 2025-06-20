
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const INDIAN_LANGUAGES = [
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'te', name: 'Telugu' },
  { code: 'mr', name: 'Marathi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'ur', name: 'Urdu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'or', name: 'Odia' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'as', name: 'Assamese' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'sa', name: 'Sanskrit' },
  { code: 'ne', name: 'Nepali' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'kok', name: 'Konkani' },
  { code: 'mni', name: 'Manipuri' },
  { code: 'doi', name: 'Dogri' },
  { code: 'sat', name: 'Santali' },
  { code: 'mai', name: 'Maithili' },
  { code: 'bo', name: 'Bodo' },
  { code: 'en', name: 'English' }
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
          <div key={language.code} className="flex items-center space-x-2">
            <Checkbox
              id={language.code}
              checked={selectedLanguages.includes(language.code)}
              onCheckedChange={() => handleLanguageToggle(language.code)}
            />
            <Label
              htmlFor={language.code}
              className="text-sm font-normal text-gray-700 cursor-pointer"
            >
              {language.name}
            </Label>
          </div>
        ))}
      </div>
      {selectedLanguages.length > 0 && (
        <div className="text-xs text-gray-500">
          Selected: {selectedLanguages.length} language{selectedLanguages.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
