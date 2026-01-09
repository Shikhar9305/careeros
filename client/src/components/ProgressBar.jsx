const ProgressBar = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step labels */}
      <div className="flex justify-between mt-6 text-sm font-semibold">
        <span className={`px-3 py-1 rounded-full ${currentStep >= 1 ? "text-blue-600 bg-blue-100" : "text-gray-400"}`}>
          Personality
        </span>
        <span className={`px-3 py-1 rounded-full ${currentStep >= 2 ? "text-blue-600 bg-blue-100" : "text-gray-400"}`}>
          Aptitude
        </span>
        <span className={`px-3 py-1 rounded-full ${currentStep >= 3 ? "text-blue-600 bg-blue-100" : "text-gray-400"}`}>
          RIASEC
        </span>
        <span className={`px-3 py-1 rounded-full ${currentStep >= 4 ? "text-blue-600 bg-blue-100" : "text-gray-400"}`}>
          Values
        </span>
      </div>
    </div>
  )
}

export default ProgressBar
