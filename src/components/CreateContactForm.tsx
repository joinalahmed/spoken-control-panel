
import { useState } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreateContactFormProps {
  onBack: () => void;
  onSave: (contact: any) => void;
}

const CreateContactForm = ({ onBack, onSave }: CreateContactFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    note: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">Create New Contacts</h1>
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
            <p className="text-sm text-gray-500 mt-2">Image must be under 2G MB</p>
          </CardContent>
        </Card>

        {/* Form Fields */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Wilson Smith"
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

              {/* Address */}
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="2/3/2025 at 5:40pm"
                />
              </div>

              {/* Phone Number */}
              <div className="col-span-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <div className="flex gap-2">
                  <Select defaultValue="uk">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uk">🇬🇧</SelectItem>
                      <SelectItem value="us">🇺🇸</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="76554567"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  If subscribing 'not is any making an outbound call in this test, I have obtained a 
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
                <Label htmlFor="state">State</Label>
                <Select onValueChange={(value) => handleInputChange('state', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="UK" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uk">UK</SelectItem>
                    <SelectItem value="us">US</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Zip Code */}
              <div className="col-span-2">
                <Label htmlFor="zipCode">Zip code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="30000"
                  className="w-32"
                />
              </div>

              {/* Note */}
              <div className="col-span-2">
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) => handleInputChange('note', e.target.value)}
                  placeholder="Completing the space selection, the user navigates to the booking confirmation screen. This screen confirms the booking details and awaits the user's final confirmation..."
                  rows={4}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={onBack}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateContactForm;
