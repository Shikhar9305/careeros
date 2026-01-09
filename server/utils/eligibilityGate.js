import { resolveStudentDomain, resolveProgram } from "./domainResolver.js"
import { resolveStudentAcademicStreams } from "./academicResolver.js"

export function isEligible(student, course) {
  const domain = resolveStudentDomain(student)
  const program = resolveProgram(course.courseName)

  if (!program) return false

  // Stream eligibility
  const studentStreams = resolveStudentAcademicStreams(student)

const streamMatch = program.requiredStreams.some(req =>
  studentStreams.includes(req)
)

  if (!streamMatch) return false

  // Exam eligibility (if required)
  if (program.requiredExams.length > 0) {
    const exams = (student.competitiveExams || []).map((e) => e.toLowerCase())
    const examMatch = program.requiredExams.some((e) =>
      exams.some((ex) => ex.includes(e))
    )
    if (!examMatch) return false
  }

  // Academic %
  const tenth = student.tenthPercent || 0
  const twelfth = student.twelfthPercent || 0

  return (
    tenth >= (course.eligibility?.minTenthPercent || 0) &&
    twelfth >= (course.eligibility?.minTwelfthPercent || 0)
  )
}
