import React from 'react';
import { Check } from 'lucide-react';

const TemplateSelector = ({ selectedTemplate, onTemplateSelect, resumeData }) => {
  const templates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean design with subtle blue accents and clear section divisions',
      preview: 'A clean, professional layout with blue headers and organized sections',
      features: ['ATS-friendly', 'Clean typography', 'Professional colors', 'Clear sections']
    },
    {
      id: 'classic',
      name: 'Classic Traditional',
      description: 'Traditional black and white design that works everywhere',
      preview: 'Traditional format with standard fonts and clear hierarchy',
      features: ['Universal compatibility', 'Traditional format', 'Conservative design', 'Maximum ATS compatibility']
    },
    {
      id: 'minimal',
      name: 'Minimal Clean',
      description: 'Ultra-clean design with maximum white space and readability',
      preview: 'Minimalist approach with plenty of white space and simple formatting',
      features: ['Ultra-clean', 'Maximum readability', 'Lots of white space', 'Simple formatting']
    }
  ];

  const PreviewCard = ({ template }) => (
    <div
      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
        selectedTemplate === template.id
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onTemplateSelect(template.id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{template.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{template.description}</p>
        </div>
        {selectedTemplate === template.id && (
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      <div className="bg-white rounded border border-gray-200 p-3 mb-3" style={{ minHeight: '120px' }}>
        <div className={`text-xs ${template.id === 'modern' ? 'text-blue-700' : 'text-gray-700'}`}>
          <div className={`font-bold mb-1 ${template.id === 'modern' ? 'border-b border-blue-200 pb-1' : ''}`}>
            {resumeData.personal.fullName || 'Your Name'}
          </div>
          <div className="mb-2 text-gray-500">
            {resumeData.personal.email || 'your.email@example.com'} | {resumeData.personal.phone || '+1 (555) 123-4567'}
          </div>
          
          {template.id === 'modern' && (
            <div className="bg-blue-50 p-2 rounded mb-2">
              <div className="font-semibold text-blue-800 mb-1">WORK EXPERIENCE</div>
              <div className="text-blue-700">Software Engineer • Tech Company</div>
            </div>
          )}
          
          {template.id === 'classic' && (
            <div className="mb-2">
              <div className="font-semibold text-black mb-1 border-b border-black">WORK EXPERIENCE</div>
              <div className="text-black">Software Engineer • Tech Company</div>
            </div>
          )}
          
          {template.id === 'minimal' && (
            <div className="mb-2">
              <div className="font-medium text-gray-800 mb-1">Work Experience</div>
              <div className="text-gray-600">Software Engineer • Tech Company</div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1">
        {template.features.map((feature, index) => (
          <div key={index} className="flex items-center text-xs text-gray-600">
            <div className="w-1 h-1 bg-green-500 rounded-full mr-2"></div>
            {feature}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Choose Template</h2>
        <p className="text-gray-600 text-sm">
          Select a resume template that best fits your industry and preferences. All templates are ATS-optimized.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <PreviewCard key={template.id} template={template} />
        ))}
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Template Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">ATS-Compatible</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">No Tables or Columns</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Standard Fonts</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Consistent Formatting</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Professional Layout</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Easy to Read</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;