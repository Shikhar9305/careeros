"use client"

import { useState } from "react"
import questionsData from "../data/psychometricQuestions.json"
import QuestionCard from "./QuestionCard"

const questions = questionsData.aptitude;
const AptitudeSection = ({ onResponseChange, responses }) => {
  const questions = questionsData.aptitude;
 
  const [localResponses, setLocalResponses] = useState(responses)

  const handleResponseChange = (questionId, userAnswer) => {
    const question = questions.find((q) => q.id === questionId)
    const isCorrect = userAnswer === question.correctAnswer

    const updated = localResponses.map((r) => (r.questionId === questionId ? { ...r, userAnswer, isCorrect } : r))
    if (!updated.find((r) => r.questionId === questionId)) {
      updated.push({
        questionId,
        question: question.question,
        category: question.category,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
      })
    }
    setLocalResponses(updated)
    onResponseChange(updated)
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Aptitude Assessment</h2>
        <p className="text-gray-600">Answer 20 questions across Logical, Verbal, Numerical, and Pattern categories</p>
      </div>
      <div className="space-y-2">
        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            response={localResponses.find((r) => r.questionId === q.id)?.userAnswer}
            onResponseChange={(val) => handleResponseChange(q.id, val)}
            type="multiple-choice"
          />
        ))}
      </div>
    </div>
  )
}

export default AptitudeSection
