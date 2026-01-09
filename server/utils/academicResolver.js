export function resolveStudentAcademicStreams(student) {
  const stream = student.stream.toLowerCase()

  // This mapping is REQUIRED because of your JSON structure
  if (stream === "medical") return ["pcb"]
  if (stream === "engineering") return ["pcm"]
  if (stream === "commerce") return ["commerce"]

  return [stream]
}
