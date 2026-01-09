"use client"

import { useState } from "react"
import QuestionCard from "./QuestionCard"
import questionsData from "../data/psychometricQuestions.json"
const RIASECSection = ({ onResponseChange, responses }) => {
 const questions = questionsData.riasec;


  const [localResponses, setLocalResponses] = useState(responses)

  const handleResponseChange = (questionId, response) => {
    const q = questions.find((q) => q.id === questionId)
    const updated = localResponses.map((r) => (r.questionId === questionId ? { ...r, response } : r))
    if (!updated.find((r) => r.questionId === questionId)) {
      updated.push({
        questionId,
        question: q.question,
        category: q.category,
        response,
      })
    }
    setLocalResponses(updated)
    onResponseChange(updated)
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">RIASEC Interest Assessment</h2>
        <p className="text-gray-600 mb-1">Realistic, Investigative, Artistic, Social, Enterprising, Conventional</p>
        <p className="text-gray-600">Rate your agreement with each statement on a scale of 1-5</p>
      </div>
      <div className="space-y-2">
        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q.question}
            response={localResponses.find((r) => r.questionId === q.id)?.response}
            onResponseChange={(val) => handleResponseChange(q.id, val)}
            type="likert"
          />
        ))}
      </div>
    </div>
  )
}

export default RIASECSection
