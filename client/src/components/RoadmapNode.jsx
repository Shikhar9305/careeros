import { Handle, Position } from 'reactflow';
import { useState } from 'react';

const RoadmapNode = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="roadmap-node">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />

      <div
        className={`bg-white rounded-xl shadow-lg border-2 border-blue-200 transition-all duration-300 ${
          isExpanded ? 'w-96' : 'w-80'
        }`}
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-t-xl">
          <h3 className="text-lg font-bold text-white mb-1">{data.title}</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-100">{data.timeline}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(data.difficulty)}`}>
              {data.difficulty}
            </span>
          </div>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-700 mb-3">{data.description}</p>

          <div className="flex items-center text-sm text-gray-600 mb-3">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{data.estimatedHours} hours</span>
          </div>

          {!isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full text-sm text-blue-600 hover:text-blue-800 font-semibold py-2 px-4 border border-blue-300 rounded-lg hover:bg-blue-50 transition"
            >
              View Details
            </button>
          )}

          {isExpanded && (
            <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
              {data.skillsToLearn && data.skillsToLearn.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase">Skills to Learn</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.skillsToLearn.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {data.courses && data.courses.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase">Recommended Courses</h4>
                  <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                    {data.courses.map((course, idx) => (
                      <li key={idx}>{course}</li>
                    ))}
                  </ul>
                </div>
              )}

              {data.tools && data.tools.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase">Tools & Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.tools.map((tool, idx) => (
                      <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {data.projects && data.projects.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase">Project Ideas</h4>
                  <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                    {data.projects.map((project, idx) => (
                      <li key={idx}>{project}</li>
                    ))}
                  </ul>
                </div>
              )}

              {data.certifications && data.certifications.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase">Certifications</h4>
                  <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                    {data.certifications.map((cert, idx) => (
                      <li key={idx}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => setIsExpanded(false)}
                className="w-full text-sm text-gray-600 hover:text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Show Less
              </button>
            </div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
    </div>
  );
};

export default RoadmapNode;
