import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Contact } from '@/hooks/useContacts';

interface CreateContactFormProps {
  onBack: () => void;
  onSave: (contact: any) => void;
  editingContact?: Contact | null;
}

const countries = [
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪' },
  { code: 'BO', name: 'Bolivia', dialCode: '+591', flag: '🇧🇴' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'BG', name: 'Bulgaria', dialCode: '+359', flag: '🇧🇬' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴' },
  { code: 'HR', name: 'Croatia', dialCode: '+385', flag: '🇭🇷' },
  { code: 'CZ', name: 'Czech Republic', dialCode: '+420', flag: '🇨🇿' },
  { code: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰' },
  { code: 'EC', name: 'Ecuador', dialCode: '+593', flag: '🇪🇨' },
  { code: 'EE', name: 'Estonia', dialCode: '+372', flag: '🇪🇪' },
  { code: 'FI', name: 'Finland', dialCode: '+358', flag: '🇫🇮' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'GR', name: 'Greece', dialCode: '+30', flag: '🇬🇷' },
  { code: 'HK', name: 'Hong Kong', dialCode: '+852', flag: '🇭🇰' },
  { code: 'HU', name: 'Hungary', dialCode: '+36', flag: '🇭🇺' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { code: 'LV', name: 'Latvia', dialCode: '+371', flag: '🇱🇻' },
  { code: 'LT', name: 'Lithuania', dialCode: '+370', flag: '🇱🇹' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿' },
  { code: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴' },
  { code: 'PY', name: 'Paraguay', dialCode: '+595', flag: '🇵🇾' },
  { code: 'PE', name: 'Peru', dialCode: '+51', flag: '🇵🇪' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
  { code: 'PL', name: 'Poland', dialCode: '+48', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
  { code: 'RO', name: 'Romania', dialCode: '+40', flag: '🇷🇴' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'SK', name: 'Slovakia', dialCode: '+421', flag: '🇸🇰' },
  { code: 'SI', name: 'Slovenia', dialCode: '+386', flag: '🇸🇮' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭' },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'UY', name: 'Uruguay', dialCode: '+598', flag: '🇺🇾' },
  { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
].sort((a, b) => a.name.localeCompare(b.name));

const states = [
  // US States
  { value: 'AL', label: 'Alabama', country: 'US' },
  { value: 'AK', label: 'Alaska', country: 'US' },
  { value: 'AZ', label: 'Arizona', country: 'US' },
  { value: 'AR', label: 'Arkansas', country: 'US' },
  { value: 'CA', label: 'California', country: 'US' },
  { value: 'CO', label: 'Colorado', country: 'US' },
  { value: 'CT', label: 'Connecticut', country: 'US' },
  { value: 'DE', label: 'Delaware', country: 'US' },
  { value: 'FL', label: 'Florida', country: 'US' },
  { value: 'GA', label: 'Georgia', country: 'US' },
  { value: 'HI', label: 'Hawaii', country: 'US' },
  { value: 'ID', label: 'Idaho', country: 'US' },
  { value: 'IL', label: 'Illinois', country: 'US' },
  { value: 'IN', label: 'Indiana', country: 'US' },
  { value: 'IA', label: 'Iowa', country: 'US' },
  { value: 'KS', label: 'Kansas', country: 'US' },
  { value: 'KY', label: 'Kentucky', country: 'US' },
  { value: 'LA', label: 'Louisiana', country: 'US' },
  { value: 'ME', label: 'Maine', country: 'US' },
  { value: 'MD', label: 'Maryland', country: 'US' },
  { value: 'MA', label: 'Massachusetts', country: 'US' },
  { value: 'MI', label: 'Michigan', country: 'US' },
  { value: 'MN', label: 'Minnesota', country: 'US' },
  { value: 'MS', label: 'Mississippi', country: 'US' },
  { value: 'MO', label: 'Missouri', country: 'US' },
  { value: 'MT', label: 'Montana', country: 'US' },
  { value: 'NE', label: 'Nebraska', country: 'US' },
  { value: 'NV', label: 'Nevada', country: 'US' },
  { value: 'NH', label: 'New Hampshire', country: 'US' },
  { value: 'NJ', label: 'New Jersey', country: 'US' },
  { value: 'NM', label: 'New Mexico', country: 'US' },
  { value: 'NY', label: 'New York', country: 'US' },
  { value: 'NC', label: 'North Carolina', country: 'US' },
  { value: 'ND', label: 'North Dakota', country: 'US' },
  { value: 'OH', label: 'Ohio', country: 'US' },
  { value: 'OK', label: 'Oklahoma', country: 'US' },
  { value: 'OR', label: 'Oregon', country: 'US' },
  { value: 'PA', label: 'Pennsylvania', country: 'US' },
  { value: 'RI', label: 'Rhode Island', country: 'US' },
  { value: 'SC', label: 'South Carolina', country: 'US' },
  { value: 'SD', label: 'South Dakota', country: 'US' },
  { value: 'TN', label: 'Tennessee', country: 'US' },
  { value: 'TX', label: 'Texas', country: 'US' },
  { value: 'UT', label: 'Utah', country: 'US' },
  { value: 'VT', label: 'Vermont', country: 'US' },
  { value: 'VA', label: 'Virginia', country: 'US' },
  { value: 'WA', label: 'Washington', country: 'US' },
  { value: 'WV', label: 'West Virginia', country: 'US' },
  { value: 'WI', label: 'Wisconsin', country: 'US' },
  { value: 'WY', label: 'Wyoming', country: 'US' },
  
  // Canadian Provinces
  { value: 'AB', label: 'Alberta', country: 'CA' },
  { value: 'BC', label: 'British Columbia', country: 'CA' },
  { value: 'MB', label: 'Manitoba', country: 'CA' },
  { value: 'NB', label: 'New Brunswick', country: 'CA' },
  { value: 'NL', label: 'Newfoundland and Labrador', country: 'CA' },
  { value: 'NS', label: 'Nova Scotia', country: 'CA' },
  { value: 'ON', label: 'Ontario', country: 'CA' },
  { value: 'PE', label: 'Prince Edward Island', country: 'CA' },
  { value: 'QC', label: 'Quebec', country: 'CA' },
  { value: 'SK', label: 'Saskatchewan', country: 'CA' },
  
  // UK Counties/Regions
  { value: 'ENG', label: 'England', country: 'GB' },
  { value: 'SCT', label: 'Scotland', country: 'GB' },
  { value: 'WLS', label: 'Wales', country: 'GB' },
  { value: 'NIR', label: 'Northern Ireland', country: 'GB' },
  
  // Australian States
  { value: 'NSW', label: 'New South Wales', country: 'AU' },
  { value: 'VIC', label: 'Victoria', country: 'AU' },
  { value: 'QLD', label: 'Queensland', country: 'AU' },
  { value: 'WA', label: 'Western Australia', country: 'AU' },
  { value: 'SA', label: 'South Australia', country: 'AU' },
  { value: 'TAS', label: 'Tasmania', country: 'AU' },
  { value: 'ACT', label: 'Australian Capital Territory', country: 'AU' },
  { value: 'NT', label: 'Northern Territory', country: 'AU' },
];

const CreateContactForm = ({ onBack, onSave, editingContact }: CreateContactFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    note: '',
    country: 'US'
  });

  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Pre-fill form when editing a contact
  useEffect(() => {
    if (editingContact) {
      console.log('Editing contact:', editingContact);
      
      // Extract phone number without country code for editing
      let phoneWithoutCode = editingContact.phone || '';
      if (editingContact.phone) {
        // Try to extract the phone number part (remove country code)
        const phoneMatch = editingContact.phone.match(/^\+\d+\s(.+)$/);
        if (phoneMatch) {
          phoneWithoutCode = phoneMatch[1];
        }
      }

      setFormData({
        name: editingContact.name || '',
        email: editingContact.email || '',
        address: editingContact.address || '',
        city: editingContact.city || '',
        state: editingContact.state || '',
        zipCode: editingContact.zip_code || '',
        phoneNumber: phoneWithoutCode,
        note: '', // Note is not stored in the database schema
        country: 'US' // Default to US, could be enhanced to detect from phone
      });
    } else {
      // Reset form for new contact
      setFormData({
        name: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phoneNumber: '',
        note: '',
        country: 'US'
      });
    }
  }, [editingContact]);

  // Auto-scroll functionality for country dropdown
  useEffect(() => {
    if (isCountryDropdownOpen && countrySearchTerm && countryDropdownRef.current) {
      const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(countrySearchTerm.toLowerCase())
      );
      
      if (filteredCountries.length > 0) {
        const firstMatch = filteredCountries[0];
        const countryElement = countryDropdownRef.current.querySelector(`[data-country="${firstMatch.code}"]`);
        if (countryElement) {
          countryElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }
  }, [countrySearchTerm, isCountryDropdownOpen]);

  const selectedCountry = countries.find(c => c.code === formData.country) || countries[0];
  const availableStates = states.filter(state => state.country === formData.country);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: value,
      // Reset state when country changes
      ...(field === 'country' ? { state: '' } : {})
    }));
  };

  const handleSave = () => {
    console.log('Form data before save:', formData);
    
    // Format phone number with country code
    const fullPhoneNumber = formData.phoneNumber 
      ? `${selectedCountry.dialCode} ${formData.phoneNumber}`
      : '';
    
    const contactData = {
      ...formData,
      phoneNumber: fullPhoneNumber
    };
    
    console.log('Formatted contact data:', contactData);
    onSave(contactData);
  };

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">
          {editingContact ? 'Edit Contact' : 'Create New Contact'}
        </h1>
      </div>

      <div className="max-w-2xl">
        {/* Upload Image Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Upload Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New Picture
                </Button>
                <Button variant="outline" size="sm">
                  <X className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Image must be under 2MB</p>
          </CardContent>
        </Card>

        {/* Form Fields */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Wilson Smith"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="wilson@gmail.com"
                />
              </div>

              {/* Country with search and auto-scroll */}
              <div className="col-span-2">
                <Label htmlFor="country">Country</Label>
                <Select 
                  value={formData.country} 
                  onValueChange={(value) => handleInputChange('country', value)}
                  onOpenChange={setIsCountryDropdownOpen}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent ref={countryDropdownRef} className="max-h-60">
                    <div className="p-2">
                      <Input
                        placeholder="Search countries..."
                        value={countrySearchTerm}
                        onChange={(e) => setCountrySearchTerm(e.target.value)}
                        className="h-8"
                      />
                    </div>
                    {filteredCountries.map((country) => (
                      <SelectItem 
                        key={country.code} 
                        value={country.code}
                        data-country={country.code}
                      >
                        <div className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span>{country.name}</span>
                          <span className="text-gray-500 text-sm">({country.dialCode})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Address */}
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="123 Main Street"
                />
              </div>

              {/* Phone Number */}
              <div className="col-span-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <div className="flex gap-2">
                  <div className="flex items-center bg-gray-50 border border-gray-300 rounded-md px-3 py-2 min-w-20">
                    <span className="text-sm font-medium">{selectedCountry.flag} {selectedCountry.dialCode}</span>
                  </div>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="Enter phone number"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  If subscribing is any making an outbound call in this test, I have obtained a 
                  valid opt-in from this number.
                </p>
              </div>

              {/* City */}
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="New York"
                />
              </div>

              {/* State */}
              <div>
                <Label htmlFor="state">State/Province/Region</Label>
                {availableStates.length > 0 ? (
                  <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${formData.country === 'CA' ? 'Province' : formData.country === 'AU' ? 'State/Territory' : 'State'}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStates.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="Enter state/province/region"
                  />
                )}
              </div>

              {/* Zip Code */}
              <div className="col-span-2">
                <Label htmlFor="zipCode">{formData.country === 'GB' ? 'Postcode' : formData.country === 'CA' ? 'Postal Code' : 'Zip Code'}</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder={formData.country === 'GB' ? 'SW1A 1AA' : formData.country === 'CA' ? 'K1A 0A6' : '10001'}
                  className="w-40"
                />
              </div>

              {/* Note */}
              <div className="col-span-2">
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) => handleInputChange('note', e.target.value)}
                  placeholder="Add any additional notes about this contact..."
                  rows={4}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={onBack}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                className="bg-purple-600 hover:bg-purple-700"
                disabled={!formData.name.trim()}
              >
                {editingContact ? 'Update Contact' : 'Save Contact'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateContactForm;
