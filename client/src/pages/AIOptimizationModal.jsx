// import React, { useState } from 'react';
// import { X, Sparkles, Loader, Copy, Check } from 'lucide-react';
// import { optimizeJobDescription, optimizeSkillsForJob, generateResumeKeywords } from '../services/geminiService';

// const AIOptimizationModal = ({ isOpen, onClose, onApply, currentText, jobTitle, company, type, resumeData }) => {
//   const [jobDescription, setJobDescription] = useState('');
//   const [optimizedText, setOptimizedText] = useState('');
//   const [suggestedSkills, setSuggestedSkills] = useState('');
//   const [keywords, setKeywords] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState('optimize');
//   const [copied, setCopied] = useState(false);

//   if (!isOpen) return null;

//   const handleOptimize = async () => {
//     if (!jobDescription.trim()) {
//       alert('Please enter a job description first.');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       if (type === 'jobDescription') {
//         const result = await optimizeJobDescription(currentText, jobTitle, company);
//         setOptimizedText(result);
//       }
      
//       // Also get skills suggestions and keywords
//       const [skillsResult, keywordsResult] = await Promise.all([
//         optimizeSkillsForJob(resumeData?.skills || [], jobDescription),
//         generateResumeKeywords(jobDescription, resumeData)
//       ]);
      
//       setSuggestedSkills(skillsResult);
//       setKeywords(keywordsResult);
//     } catch (error) {
//       alert(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCopy = (text) => {
//     navigator.clipboard.writeText(text);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const handleApplyOptimization = () => {
//     if (optimizedText) {
//       onApply(optimizedText);
//       onClose();
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <div className="flex items-center space-x-3">
//             <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
//               <Sparkles className="w-5 h-5 text-purple-600" />
//             </div>
//             <h2 className="text-xl font-semibold text-gray-900">AI Resume Optimization</h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Tabs */}
//         <div className="flex border-b border-gray-200">
//           <button
//             onClick={() => setActiveTab('optimize')}
//             className={`px-6 py-3 font-medium text-sm transition-colors ${
//               activeTab === 'optimize'
//                 ? 'text-purple-600 border-b-2 border-purple-600'
//                 : 'text-gray-500 hover:text-gray-700'
//             }`}
//           >
//             Optimize Description
//           </button>
//           <button
//             onClick={() => setActiveTab('skills')}
//             className={`px-6 py-3 font-medium text-sm transition-colors ${
//               activeTab === 'skills'
//                 ? 'text-purple-600 border-b-2 border-purple-600'
//                 : 'text-gray-500 hover:text-gray-700'
//             }`}
//           >
//             Skill Suggestions
//           </button>
//           <button
//             onClick={() => setActiveTab('keywords')}
//             className={`px-6 py-3 font-medium text-sm transition-colors ${
//               activeTab === 'keywords'
//                 ? 'text-purple-600 border-b-2 border-purple-600'
//                 : 'text-gray-500 hover:text-gray-700'
//             }`}
//           >
//             ATS Keywords
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6 overflow-y-auto max-h-[60vh]">
//           {/* Job Description Input */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Job Description <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               value={jobDescription}
//               onChange={(e) => setJobDescription(e.target.value)}
//               placeholder="Paste the job description here to get AI-powered optimization suggestions..."
//               rows={4}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//             />
//           </div>

//           {/* Optimize Button */}
//           <div className="mb-6">
//             <button
//               onClick={handleOptimize}
//               disabled={isLoading || !jobDescription.trim()}
//               className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
//             >
//               {isLoading ? (
//                 <Loader className="w-4 h-4 animate-spin" />
//               ) : (
//                 <Sparkles className="w-4 h-4" />
//               )}
//               <span>{isLoading ? 'Optimizing...' : 'Optimize with AI'}</span>
//             </button>
//           </div>

//           {/* Tab Content */}
//           {activeTab === 'optimize' && optimizedText && (
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <h3 className="font-medium text-gray-900">Optimized Job Description</h3>
//                 <button
//                   onClick={() => handleCopy(optimizedText)}
//                   className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
//                 >
//                   {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
//                   <span>{copied ? 'Copied!' : 'Copy'}</span>
//                 </button>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-lg border">
//                 <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
//                   {optimizedText}
//                 </pre>
//               </div>
//               <div className="flex space-x-3">
//                 <button
//                   onClick={handleApplyOptimization}
//                   className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                 >
//                   Apply to Resume
//                 </button>
//               </div>
//             </div>
//           )}

//           {activeTab === 'skills' && suggestedSkills && (
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <h3 className="font-medium text-gray-900">Suggested Skills</h3>
//                 <button
//                   onClick={() => handleCopy(suggestedSkills)}
//                   className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
//                 >
//                   {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
//                   <span>{copied ? 'Copied!' : 'Copy'}</span>
//                 </button>
//               </div>
//               <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//                 <pre className="whitespace-pre-wrap text-sm text-blue-800 font-sans">
//                   {suggestedSkills}
//                 </pre>
//               </div>
//               <p className="text-xs text-gray-600">
//                 Review these suggestions and add relevant skills to your resume to improve ATS matching.
//               </p>
//             </div>
//           )}

//           {activeTab === 'keywords' && keywords && (
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <h3 className="font-medium text-gray-900">Important ATS Keywords</h3>
//                 <button
//                   onClick={() => handleCopy(keywords)}
//                   className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
//                 >
//                   {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
//                   <span>{copied ? 'Copied!' : 'Copy'}</span>
//                 </button>
//               </div>
//               <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
//                 <pre className="whitespace-pre-wrap text-sm text-yellow-800 font-sans">
//                   {keywords}
//                 </pre>
//               </div>
//               <p className="text-xs text-gray-600">
//                 Incorporate these keywords naturally throughout your resume to improve ATS compatibility.
//               </p>
//             </div>
//           )}

//           {/* Current Text Display */}
//           {currentText && (
//             <div className="mt-6 pt-6 border-t border-gray-200">
//               <h3 className="font-medium text-gray-900 mb-2">Current Description</h3>
//               <div className="bg-gray-100 p-3 rounded-lg">
//                 <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
//                   {currentText}
//                 </pre>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AIOptimizationModal;


import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader, Copy, Check } from 'lucide-react';
import {
  optimizeJobDescription,
  optimizeSkillsForJob,
  generateResumeKeywords
} from '../services/geminiService';

const AIOptimizationModal = ({
  isOpen,
  onClose,
  onApply,
  currentText,
  jobTitle,
  company,
  resumeData
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [optimizedText, setOptimizedText] = useState('');
  const [suggestedSkills, setSuggestedSkills] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('optimize');
  const [copied, setCopied] = useState(false);

  // Prefill textarea when modal opens
  useEffect(() => {
    if (isOpen) {
      setJobDescription('');
      setOptimizedText('');
      setSuggestedSkills('');
      setKeywords('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOptimize = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description first.');
      return;
    }

    setIsLoading(true);

    try {
      // 1️⃣ Optimize job description
      const optimized = await optimizeJobDescription({
        jobDescription,
        jobTitle,
        company
      });
      setOptimizedText(optimized);

      // 2️⃣ Skills + Keywords in parallel
      const [skillsResult, keywordsResult] = await Promise.all([
        optimizeSkillsForJob({
          currentSkills: resumeData?.skills || [],
          jobDescription
        }),
        generateResumeKeywords({
          jobDescription,
          resumeData
        })
      ]);

      setSuggestedSkills(skillsResult);
      setKeywords(keywordsResult);
    } catch (err) {
      console.error(err);
      alert('AI optimization failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyOptimization = () => {
    if (optimizedText) {
      onApply(optimizedText);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold">AI Resume Optimization</h2>
          </div>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {['optimize', 'skills', 'keywords'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === tab
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'optimize'
                ? 'Optimize Description'
                : tab === 'skills'
                ? 'Skill Suggestions'
                : 'ATS Keywords'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          
          {/* Job Description Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={4}
              placeholder="Paste the job description here..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Optimize Button */}
          <button
            onClick={handleOptimize}
            disabled={isLoading}
            className="mb-6 flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
          >
            {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isLoading ? 'Optimizing...' : 'Optimize with AI'}
          </button>

          {/* Optimized Description */}
          {activeTab === 'optimize' && optimizedText && (
            <Section
              title="Optimized Job Description"
              text={optimizedText}
              onCopy={handleCopy}
              copied={copied}
              action={
                <button
                  onClick={handleApplyOptimization}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Apply to Resume
                </button>
              }
            />
          )}

          {/* Skills */}
          {activeTab === 'skills' && suggestedSkills && (
            <Section
              title="Suggested Skills"
              text={suggestedSkills}
              onCopy={handleCopy}
              copied={copied}
              bg="bg-blue-50 border-blue-200 text-blue-800"
            />
          )}

          {/* Keywords */}
          {activeTab === 'keywords' && keywords && (
            <Section
              title="Important ATS Keywords"
              text={keywords}
              onCopy={handleCopy}
              copied={copied}
              bg="bg-yellow-50 border-yellow-200 text-yellow-800"
            />
          )}

          {/* Current Text */}
          {currentText && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium mb-2">Current Description</h3>
              <pre className="bg-gray-100 p-3 rounded-lg text-sm whitespace-pre-wrap">
                {currentText}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* Reusable Section */
const Section = ({ title, text, onCopy, copied, action, bg }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="font-medium">{title}</h3>
      <button onClick={() => onCopy(text)} className="flex items-center gap-1 text-sm">
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
    <pre className={`p-4 rounded-lg border text-sm whitespace-pre-wrap ${bg || 'bg-gray-50'}`}>
      {text}
    </pre>
    {action}
  </div>
);

export default AIOptimizationModal;
