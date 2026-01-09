import React from 'react';

const ResumePreview = ({ data, template }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const ModernTemplate = () => (
    <div className="bg-white p-6 text-sm font-sans" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {data.personal.fullName || 'Your Name'}
        </h1>
        <div className="text-gray-600">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.email && data.personal.phone && <span> | </span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {(data.personal.email || data.personal.phone) && data.personal.location && <span> | </span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>
        {(data.personal.linkedin || data.personal.website) && (
          <div className="text-gray-600 mt-1">
            {data.personal.linkedin && <span>{data.personal.linkedin}</span>}
            {data.personal.linkedin && data.personal.website && <span> | </span>}
            {data.personal.website && <span>{data.personal.website}</span>}
          </div>
        )}
      </div>

      {/* Work Experience */}
      {data.workExperience && data.workExperience.length > 0 && data.workExperience[0].jobTitle && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-blue-700 mb-3 border-b-2 border-blue-200 pb-1">
            WORK EXPERIENCE
          </h2>
          {data.workExperience.map((exp, index) => (
            exp.jobTitle && (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                  <span className="text-gray-600">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <div className="text-gray-700 mb-2">
                  {exp.company}{exp.location && `, ${exp.location}`}
                </div>
                {exp.description && (
                  <div className="text-gray-700 whitespace-pre-line">
                    {exp.description}
                  </div>
                )}
              </div>
            )
          ))}
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && data.education[0].degree && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-blue-700 mb-3 border-b-2 border-blue-200 pb-1">
            EDUCATION
          </h2>
          {data.education.map((edu, index) => (
            edu.degree && (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <span className="text-gray-600">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
                <div className="text-gray-700">
                  {edu.school}{edu.location && `, ${edu.location}`}
                  {edu.gpa && <span> | GPA: {edu.gpa}</span>}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-blue-700 mb-3 border-b-2 border-blue-200 pb-1">
            SKILLS
          </h2>
          <div className="text-gray-700">
            {data.skills.join(' • ')}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && data.certifications[0].name && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-blue-700 mb-3 border-b-2 border-blue-200 pb-1">
            CERTIFICATIONS
          </h2>
          {data.certifications.map((cert, index) => (
            cert.name && (
              <div key={index} className="mb-2">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-gray-900">{cert.name}</span>
                  <span className="text-gray-600">{formatDate(cert.date)}</span>
                </div>
                <div className="text-gray-700">{cert.issuer}</div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && data.projects[0].name && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-blue-700 mb-3 border-b-2 border-blue-200 pb-1">
            PROJECTS
          </h2>
          {data.projects.map((project, index) => (
            project.name && (
              <div key={index} className="mb-3">
                <h3 className="font-bold text-gray-900">{project.name}</h3>
                {project.technologies && (
                  <div className="text-gray-600 mb-1">{project.technologies}</div>
                )}
                {project.description && (
                  <div className="text-gray-700">{project.description}</div>
                )}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );

  const ClassicTemplate = () => (
    <div className="bg-white p-6 text-sm font-serif" style={{ fontFamily: 'Times New Roman, serif' }}>
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-black mb-2">
          {data.personal.fullName || 'Your Name'}
        </h1>
        <div className="text-black">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.email && data.personal.phone && <span> | </span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {(data.personal.email || data.personal.phone) && data.personal.location && <span> | </span>}
          {data.personal.location && <span>{data.personal.location}</span>}
        </div>
      </div>

      {/* Work Experience */}
      {data.workExperience && data.workExperience.length > 0 && data.workExperience[0].jobTitle && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black mb-3 border-b border-black pb-1">
            WORK EXPERIENCE
          </h2>
          {data.workExperience.map((exp, index) => (
            exp.jobTitle && (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-black">{exp.jobTitle}</h3>
                  <span className="text-black">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <div className="text-black mb-2">
                  {exp.company}{exp.location && `, ${exp.location}`}
                </div>
                {exp.description && (
                  <div className="text-black whitespace-pre-line">
                    {exp.description}
                  </div>
                )}
              </div>
            )
          ))}
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && data.education[0].degree && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black mb-3 border-b border-black pb-1">
            EDUCATION
          </h2>
          {data.education.map((edu, index) => (
            edu.degree && (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-black">{edu.degree}</h3>
                  <span className="text-black">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
                <div className="text-black">
                  {edu.school}{edu.location && `, ${edu.location}`}
                  {edu.gpa && <span> | GPA: {edu.gpa}</span>}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black mb-3 border-b border-black pb-1">
            SKILLS
          </h2>
          <div className="text-black">
            {data.skills.join(', ')}
          </div>
        </div>
      )}
    </div>
  );

  const MinimalTemplate = () => (
    <div className="bg-white p-6 text-sm" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 mb-3">
          {data.personal.fullName || 'Your Name'}
        </h1>
        <div className="text-gray-600 space-y-1">
          {data.personal.email && <div>{data.personal.email}</div>}
          {data.personal.phone && <div>{data.personal.phone}</div>}
          {data.personal.location && <div>{data.personal.location}</div>}
        </div>
      </div>

      {/* Work Experience */}
      {data.workExperience && data.workExperience.length > 0 && data.workExperience[0].jobTitle && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Work Experience</h2>
          {data.workExperience.map((exp, index) => (
            exp.jobTitle && (
              <div key={index} className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{exp.jobTitle}</h3>
                  <span className="text-gray-500">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <div className="text-gray-600 mb-3">
                  {exp.company}{exp.location && `, ${exp.location}`}
                </div>
                {exp.description && (
                  <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {exp.description}
                  </div>
                )}
              </div>
            )
          ))}
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && data.education[0].degree && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Education</h2>
          {data.education.map((edu, index) => (
            edu.degree && (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                  <span className="text-gray-500">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
                <div className="text-gray-600">
                  {edu.school}{edu.location && `, ${edu.location}`}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Skills</h2>
          <div className="text-gray-700">
            {data.skills.join(' • ')}
          </div>
        </div>
      )}
    </div>
  );

  const renderTemplate = () => {
    switch (template) {
      case 'classic':
        return <ClassicTemplate />;
      case 'minimal':
        return <MinimalTemplate />;
      default:
        return <ModernTemplate />;
    }
  };

  return (
    <div className="bg-gray-100 p-4 h-full overflow-auto">
      <div className="bg-white shadow-sm" style={{ width: '210mm', margin: '0 auto', minHeight: '297mm' }}>
        {renderTemplate()}
      </div>
    </div>
  );
};

export default ResumePreview;