import React, { useState } from 'react';
import { Plus, X, Zap } from 'lucide-react';

const SkillsForm = ({ data, onChange }) => {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !data.includes(newSkill.trim())) {
      onChange([...data, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    onChange(data.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const suggestedSkills = {
    'Technical': [
      'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'AWS', 'Docker',
      'HTML/CSS', 'Java', 'C++', 'MongoDB', 'PostgreSQL', 'REST APIs'
    ],
    'Soft Skills': [
      'Communication', 'Leadership', 'Problem Solving', 'Team Collaboration',
      'Project Management', 'Critical Thinking', 'Adaptability', 'Time Management'
    ],
    'Design': [
      'Photoshop', 'Illustrator', 'Figma', 'Sketch', 'UI/UX Design',
      'Adobe Creative Suite', 'Canva', 'InDesign'
    ],
    'Marketing': [
      'SEO', 'Google Analytics', 'Social Media Marketing', 'Content Marketing',
      'Email Marketing', 'PPC Advertising', 'Brand Management'
    ]
  };

  const addSuggestedSkill = (skill) => {
    if (!data.includes(skill)) {
      onChange([...data, skill]);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Skills</h2>
        <p className="text-gray-600 text-sm">
          Add your technical and soft skills. Include skills that are relevant to your target job.
        </p>
      </div>

      {/* Current Skills */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Your Skills</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {data.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Add New Skill */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a skill (e.g., JavaScript, Leadership)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={addSkill}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Suggested Skills */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900 flex items-center">
          <Zap className="w-4 h-4 mr-2 text-yellow-500" />
          Suggested Skills
        </h3>
        
        {Object.entries(suggestedSkills).map(([category, skills]) => (
          <div key={category} className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">{category}</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => addSuggestedSkill(skill)}
                  disabled={data.includes(skill)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    data.includes(skill)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-200'
                  }`}
                >
                  {skill}
                  {data.includes(skill) && <span className="ml-1">✓</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <h3 className="font-medium text-purple-900 mb-2">ATS Tip</h3>
        <p className="text-sm text-purple-700">
          Use keywords from the job description in your skills section. Include both hard skills (technical) and soft skills (interpersonal).
        </p>
      </div>
    </div>
  );
};

export default SkillsForm;