import React from 'react';
import { Plus, Trash2, Briefcase, Calendar, MapPin, Sparkles } from 'lucide-react';
import AIOptimizationModal from '../AIOptimizationModal.jsx';

const WorkExperienceForm = ({ data, onChange }) => {
  const [aiModalOpen, setAiModalOpen] = React.useState(false);
  const [currentOptimizingId, setCurrentOptimizingId] = React.useState(null);

  const addWorkExperience = () => {
    const newExperience = {
      id: Date.now(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    onChange([...data, newExperience]);
  };

  const removeWorkExperience = (id) => {
    onChange(data.filter(exp => exp.id !== id));
  };

  const updateWorkExperience = (id, field, value) => {
    onChange(data.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const optimizeDescription = (id, description) => {
    const experience = data.find(exp => exp.id === id);
    setCurrentOptimizingId(id);
    setAiModalOpen(true);
  };

  const handleAIOptimization = (optimizedText) => {
    if (currentOptimizingId) {
      updateWorkExperience(currentOptimizingId, 'description', optimizedText);
      setCurrentOptimizingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Work Experience</h2>
        <p className="text-gray-600 text-sm">
          Add your work experience starting with the most recent position.
        </p>
      </div>

      <div className="space-y-6">
        {data.map((experience, index) => (
          <div key={experience.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                Experience #{index + 1}
              </h3>
              {data.length > 1 && (
                <button
                  onClick={() => removeWorkExperience(experience.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={experience.jobTitle}
                  onChange={(e) => updateWorkExperience(experience.id, 'jobTitle', e.target.value)}
                  placeholder="Software Engineer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={experience.company}
                  onChange={(e) => updateWorkExperience(experience.id, 'company', e.target.value)}
                  placeholder="Tech Company Inc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={experience.location}
                    onChange={(e) => updateWorkExperience(experience.id, 'location', e.target.value)}
                    placeholder="New York, NY"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`current-${experience.id}`}
                  checked={experience.current}
                  onChange={(e) => updateWorkExperience(experience.id, 'current', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={`current-${experience.id}`} className="text-sm text-gray-700">
                  I currently work here
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="month"
                    value={experience.startDate}
                    onChange={(e) => updateWorkExperience(experience.id, 'startDate', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {experience.current ? 'Present' : 'End Date'}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="month"
                    value={experience.current ? '' : experience.endDate}
                    onChange={(e) => updateWorkExperience(experience.id, 'endDate', e.target.value)}
                    disabled={experience.current}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Job Description
                </label>
                <button
                  onClick={() => optimizeDescription(experience.id)}
                  className="flex items-center space-x-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>AI Optimize</span>
                </button>
              </div>
              <textarea
                value={experience.description}
                onChange={(e) => updateWorkExperience(experience.id, 'description', e.target.value)}
                placeholder="• Developed and maintained web applications using React and Node.js
• Collaborated with cross-functional teams to deliver high-quality software solutions
• Implemented automated testing procedures that reduced bugs by 30%"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addWorkExperience}
        className="w-full mt-4 flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Add Another Experience</span>
      </button>

      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <h3 className="font-medium text-green-900 mb-2">ATS Tip</h3>
        <p className="text-sm text-green-700">
          Use bullet points and start each one with action verbs. Include specific achievements with numbers when possible (e.g., "Increased sales by 25%").
        </p>
      </div>

      {/* AI Optimization Modal */}
      <AIOptimizationModal
        isOpen={aiModalOpen}
        onClose={() => {
          setAiModalOpen(false);
          setCurrentOptimizingId(null);
        }}
        onApply={handleAIOptimization}
        currentText={currentOptimizingId ? data.find(exp => exp.id === currentOptimizingId)?.description : ''}
        jobTitle={currentOptimizingId ? data.find(exp => exp.id === currentOptimizingId)?.jobTitle : ''}
        company={currentOptimizingId ? data.find(exp => exp.id === currentOptimizingId)?.company : ''}
        type="jobDescription"
        resumeData={{ skills: [], workExperience: data }}
      />
    </div>
  );
};

export default WorkExperienceForm;