const StepLayout = ({ currentStep, totalSteps, children }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6 pb-4 border-b border-gray-200">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}

export default StepLayout
