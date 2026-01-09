import React from 'react';
import { User, Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

const PersonalInfoForm = ({ data, onChange }) => {
  const handleInputChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const inputFields = [
    { key: 'fullName', label: 'Full Name', type: 'text', icon: User, placeholder: 'John Doe' },
    { key: 'email', label: 'Email Address', type: 'email', icon: Mail, placeholder: 'john.doe@email.com' },
    { key: 'phone', label: 'Phone Number', type: 'tel', icon: Phone, placeholder: '+1 (555) 123-4567' },
    { key: 'location', label: 'Location', type: 'text', icon: MapPin, placeholder: 'City, State' },
    { key: 'linkedin', label: 'LinkedIn Profile', type: 'url', icon: Linkedin, placeholder: 'https://linkedin.com/in/johndoe' },
    { key: 'website', label: 'Personal Website', type: 'url', icon: Globe, placeholder: 'https://johndoe.com' }
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600 text-sm">
          Enter your contact details. This information will appear at the top of your resume.
        </p>
      </div>

      <div className="space-y-4">
        {inputFields.map(({ key, label, type, icon: Icon, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label} {key === 'fullName' || key === 'email' || key === 'phone' ? (
                <span className="text-red-500">*</span>
              ) : null}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type={type}
                value={data[key]}
                onChange={(e) => handleInputChange(key, e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required={key === 'fullName' || key === 'email' || key === 'phone'}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">ATS Tip</h3>
        <p className="text-sm text-blue-700">
          Use a professional email address and include your full name. Avoid using nicknames or unprofessional email addresses.
        </p>
      </div>
    </div>
  );
};

export default PersonalInfoForm;