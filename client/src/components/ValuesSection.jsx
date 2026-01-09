"use client"

import { useState } from "react"
import QuestionCard from "./QuestionCard"
import questionsData from "../data/psychometricQuestions.json"

const ValuesSection = ({ onResponseChange, responses }) => {
  const questions = questionsData.values;
  const [localResponses, setLocalResponses] = useState(responses)

  const handleResponseChange = (questionId, response) => {
    const q = questions.find((q) => q.id === questionId)
    const updated = localResponses.map((r) => (r.questionId === questionId ? { ...r, response } : r))
    if (!updated.find((r) => r.questionId === questionId)) {
      updated.push({
        questionId,
        question: q.question,
        value: q.value,
        response,
      })
    }
    setLocalResponses(updated)
    onResponseChange(updated)
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Values & Preferences</h2>
        <p className="text-gray-600">Identify what matters most to you in your career</p>
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

export default ValuesSection
