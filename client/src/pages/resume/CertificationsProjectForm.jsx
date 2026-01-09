import React from 'react';
import { Plus, Trash2, Award, Code, ExternalLink } from 'lucide-react';

const CertificationsProjectsForm = ({ certifications, projects, onCertificationsChange, onProjectsChange }) => {
  const addCertification = () => {
    const newCertification = {
      id: Date.now(),
      name: '',
      issuer: '',
      date: '',
      credentialId: '',
      url: ''
    };
    onCertificationsChange([...certifications, newCertification]);
  };

  const removeCertification = (id) => {
    onCertificationsChange(certifications.filter(cert => cert.id !== id));
  };

  const updateCertification = (id, field, value) => {
    onCertificationsChange(certifications.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      name: '',
      description: '',
      technologies: '',
      url: '',
      github: ''
    };
    onProjectsChange([...projects, newProject]);
  };

  const removeProject = (id) => {
    onProjectsChange(projects.filter(project => project.id !== id));
  };

  const updateProject = (id, field, value) => {
    onProjectsChange(projects.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    ));
  };

  return (
    <div className="space-y-8">
      {/* Certifications Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Certifications</h2>
          <p className="text-gray-600 text-sm">
            Add your professional certifications and licenses.
          </p>
        </div>

        <div className="space-y-4">
          {certifications.map((certification, index) => (
            <div key={certification.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900 flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  Certification #{index + 1}
                </h3>
                <button
                  onClick={() => removeCertification(certification.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certification Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={certification.name}
                    onChange={(e) => updateCertification(certification.id, 'name', e.target.value)}
                    placeholder="AWS Certified Solutions Architect"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issuing Organization <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={certification.issuer}
                    onChange={(e) => updateCertification(certification.id, 'issuer', e.target.value)}
                    placeholder="Amazon Web Services"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                  <input
                    type="month"
                    value={certification.date}
                    onChange={(e) => updateCertification(certification.id, 'date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credential ID</label>
                  <input
                    type="text"
                    value={certification.credentialId}
                    onChange={(e) => updateCertification(certification.id, 'credentialId', e.target.value)}
                    placeholder="ABC123456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certificate URL</label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={certification.url}
                      onChange={(e) => updateCertification(certification.id, 'url', e.target.value)}
                      placeholder="https://certificate-url.com"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addCertification}
          className="w-full mt-4 flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certification</span>
        </button>
      </div>

      {/* Projects Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Projects</h2>
          <p className="text-gray-600 text-sm">
            Showcase your personal or professional projects that demonstrate your skills.
          </p>
        </div>

        <div className="space-y-4">
          {projects.map((project, index) => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900 flex items-center">
                  <Code className="w-4 h-4 mr-2" />
                  Project #{index + 1}
                </h3>
                <button
                  onClick={() => removeProject(project.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                    placeholder="E-commerce Website"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Technologies Used</label>
                  <input
                    type="text"
                    value={project.technologies}
                    onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                    placeholder="React, Node.js, MongoDB"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                  placeholder="Built a full-stack e-commerce platform with user authentication, payment processing, and admin dashboard. Implemented responsive design and optimized for mobile devices."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Live Demo URL</label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={project.url}
                      onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                      placeholder="https://your-project.com"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Repository</label>
                  <div className="relative">
                    <Code className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={project.github}
                      onChange={(e) => updateProject(project.id, 'github', e.target.value)}
                      placeholder="https://github.com/username/project"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addProject}
          className="w-full mt-4 flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <h3 className="font-medium text-indigo-900 mb-2">ATS Tip</h3>
        <p className="text-sm text-indigo-700">
          Include quantifiable results in your project descriptions. For example: "Increased user engagement by 40%" or "Reduced load time by 60%".
        </p>
      </div>
    </div>
  );
};

export default CertificationsProjectsForm;