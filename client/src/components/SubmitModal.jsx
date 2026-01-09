"use client"

const SubmitModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Submit Psychometric Test?</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          You have completed all sections of the test. Once submitted, your responses cannot be modified. Your results
          will be analyzed to generate career recommendations.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all"
          >
            Review Answers
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 shadow-md transition-all"
          >
            Submit Test
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubmitModal
