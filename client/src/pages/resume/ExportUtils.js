// Export utilities for resume generation

export const exportResumeAsDocx = async (resumeData, template) => {
  try {
    // Create a simple HTML version for Word export
    const htmlContent = generateResumeHTML(resumeData, template);
    
    // Create a blob with HTML content that Word can open
    const blob = new Blob([htmlContent], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resumeData.personal.fullName || 'Resume'}_Resume.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error exporting DOCX:', error);
    throw error;
  }
};

export const exportResumeAsPdf = async (resumeData, template) => {
  try {
    // Create HTML content
    const htmlContent = generateResumeHTML(resumeData, template);
    
    // Open in new window for printing to PDF
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Trigger print dialog
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  }
};

const generateResumeHTML = (data, template) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const getTemplateStyles = () => {
    const baseStyles = `
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 8.5in; 
          margin: 0 auto; 
          padding: 0.5in; 
          font-size: 11pt;
        }
        .header { text-align: center; margin-bottom: 20px; }
        .name { font-size: 24pt; font-weight: bold; margin-bottom: 8px; }
        .contact { margin-bottom: 4px; }
        .section { margin-bottom: 20px; }
        .section-title { 
          font-size: 14pt; 
          font-weight: bold; 
          margin-bottom: 10px; 
          text-transform: uppercase;
        }
        .item { margin-bottom: 12px; }
        .item-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .item-title { font-weight: bold; }
        .item-subtitle { margin-bottom: 4px; }
        .item-description { white-space: pre-line; }
        .skills { line-height: 1.8; }
        @media print { 
          body { margin: 0; padding: 0.5in; }
          .section { page-break-inside: avoid; }
        }
      </style>
    `;

    if (template === 'modern') {
      return baseStyles + `
        <style>
          .section-title { 
            color: #2563eb; 
            border-bottom: 2px solid #dbeafe; 
            padding-bottom: 4px;
          }
          .name { color: #1e40af; }
        </style>
      `;
    } else if (template === 'classic') {
      return baseStyles + `
        <style>
          body { font-family: 'Times New Roman', serif; }
          .section-title { 
            border-bottom: 1px solid #000; 
            padding-bottom: 2px;
          }
        </style>
      `;
    } else if (template === 'minimal') {
      return baseStyles + `
        <style>
          body { font-family: Helvetica, Arial, sans-serif; }
          .name { font-weight: 300; font-size: 28pt; }
          .section-title { 
            font-size: 13pt; 
            font-weight: 500; 
            text-transform: none;
          }
        </style>
      `;
    }

    return baseStyles;
  };

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${data.personal.fullName || 'Resume'}</title>
      ${getTemplateStyles()}
    </head>
    <body>
      <div class="header">
        <div class="name">${data.personal.fullName || 'Your Name'}</div>
        <div class="contact">
          ${[data.personal.email, data.personal.phone, data.personal.location].filter(Boolean).join(' | ')}
        </div>
        ${(data.personal.linkedin || data.personal.website) ? `
          <div class="contact">
            ${[data.personal.linkedin, data.personal.website].filter(Boolean).join(' | ')}
          </div>
        ` : ''}
      </div>
  `;

  // Work Experience
  if (data.workExperience && data.workExperience.length > 0 && data.workExperience[0].jobTitle) {
    html += `
      <div class="section">
        <div class="section-title">Work Experience</div>
        ${data.workExperience.map(exp => {
          if (!exp.jobTitle) return '';
          return `
            <div class="item">
              <div class="item-header">
                <div class="item-title">${exp.jobTitle}</div>
                <div>${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}</div>
              </div>
              <div class="item-subtitle">${exp.company}${exp.location ? `, ${exp.location}` : ''}</div>
              ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // Education
  if (data.education && data.education.length > 0 && data.education[0].degree) {
    html += `
      <div class="section">
        <div class="section-title">Education</div>
        ${data.education.map(edu => {
          if (!edu.degree) return '';
          return `
            <div class="item">
              <div class="item-header">
                <div class="item-title">${edu.degree}</div>
                <div>${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</div>
              </div>
              <div class="item-subtitle">
                ${edu.school}${edu.location ? `, ${edu.location}` : ''}
                ${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // Skills
  if (data.skills && data.skills.length > 0) {
    html += `
      <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills">${data.skills.join(' • ')}</div>
      </div>
    `;
  }

  // Certifications
  if (data.certifications && data.certifications.length > 0 && data.certifications[0].name) {
    html += `
      <div class="section">
        <div class="section-title">Certifications</div>
        ${data.certifications.map(cert => {
          if (!cert.name) return '';
          return `
            <div class="item">
              <div class="item-header">
                <div class="item-title">${cert.name}</div>
                <div>${formatDate(cert.date)}</div>
              </div>
              <div class="item-subtitle">${cert.issuer}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // Projects
  if (data.projects && data.projects.length > 0 && data.projects[0].name) {
    html += `
      <div class="section">
        <div class="section-title">Projects</div>
        ${data.projects.map(project => {
          if (!project.name) return '';
          return `
            <div class="item">
              <div class="item-title">${project.name}</div>
              ${project.technologies ? `<div class="item-subtitle">${project.technologies}</div>` : ''}
              ${project.description ? `<div class="item-description">${project.description}</div>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  html += `
    </body>
    </html>
  `;

  return html;
};