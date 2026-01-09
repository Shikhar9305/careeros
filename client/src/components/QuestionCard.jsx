"use client"

const QuestionCard = ({ question, onResponseChange, response, type = "likert" }) => {
  const handleChange = (value) => {
    onResponseChange(value)
  }

  if (type === "likert") {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4 hover:shadow-md transition-shadow">
        <p className="text-gray-800 font-semibold mb-4 text-base">{question}</p>
        <div className="flex justify-between gap-2 mb-3">
          {[1, 2, 3, 4, 5].map((option) => (
            <button
              key={option}
              onClick={() => handleChange(option)}
              className={`flex-1 py-2 px-2 rounded-lg font-semibold transition-all ${
                response === option ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              title={option === 1 ? "Strongly Disagree" : option === 5 ? "Strongly Agree" : ""}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Disagree</span>
          <span>Agree</span>
        </div>
      </div>
    )
  }

  if (type === "multiple-choice") {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4 hover:shadow-md transition-shadow">
        <p className="text-gray-800 font-semibold mb-4 text-base">{question.question}</p>
        <div className="grid grid-cols-2 gap-3">
          {question.options?.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleChange(option)}
              className={`py-3 px-4 rounded-lg font-semibold transition-all border ${
                response === option
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return null
}

export default QuestionCard
