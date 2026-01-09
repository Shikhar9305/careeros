import { DOMAIN_ONTOLOGY } from "../config/domainOntology.js"

export function resolveStudentDomain(student) {
  const goal = (student.careerGoals || "").toLowerCase()

  for (const [domain, config] of Object.entries(DOMAIN_ONTOLOGY)) {
    if (config.intents.some((i) => goal.includes(i))) {
      return domain
    }
  }

  return "general"
}

export function resolveProgram(courseName) {
  const name = courseName.toLowerCase()

  for (const domain of Object.values(DOMAIN_ONTOLOGY)) {
    for (const program of Object.values(domain.programs)) {
      if (program.keywords.some((k) => name.includes(k))) {
        return program
      }
    }
  }

  return null
}
