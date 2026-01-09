

// Smart element discovery system with fuzzy matching and multiple strategies

const ELEMENT_SELECTORS = [
  "[data-action]",
  "[data-voice-action]",
  "button",
  "a[href]",
  "input",
  "select",
  "textarea",
  '[role="button"]',
  '[role="link"]',
  '[role="menuitem"]',
  '[role="tab"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="switch"]',
  '[tabindex]:not([tabindex="-1"])',
  "details",
  "summary",
]

// Fuzzy string matching
function fuzzyMatch(str, pattern) {
  if (!str || !pattern) return 0
  str = str.toLowerCase().trim()
  pattern = pattern.toLowerCase().trim()

  if (str === pattern) return 1
  if (str.includes(pattern)) return 0.9
  if (pattern.includes(str)) return 0.7

  // Word-based matching
  const words = pattern.split(/\s+/)
  let matchCount = 0
  for (const word of words) {
    if (str.includes(word)) matchCount++
  }
  return words.length > 0 ? (matchCount / words.length) * 0.6 : 0
}

// Get all searchable text from an element
function getElementSearchText(el) {
  const texts = [
    el.dataset?.action,
    el.dataset?.voiceAction,
    el.dataset?.intent,
    el.dataset?.label,
    el.id,
    el.name,
    el.innerText?.trim()?.slice(0, 100),
    el.value,
    el.placeholder,
    el.getAttribute("aria-label"),
    el.getAttribute("title"),
  ]

  // Get associated label
  if (el.id) {
    const label = document.querySelector(`label[for="${el.id}"]`)
    if (label) texts.push(label.textContent?.trim())
  }

  return texts.filter(Boolean).join(" ").toLowerCase()
}

// Check if element is visible and interactable
function isInteractable(el) {
  if (!el) return false

  const rect = el.getBoundingClientRect()
  const style = window.getComputedStyle(el)

  return (
    rect.width > 0 &&
    rect.height > 0 &&
    style.visibility !== "hidden" &&
    style.display !== "none" &&
    style.opacity !== "0" &&
    !el.disabled &&
    el.getAttribute("aria-disabled") !== "true" &&
    el.getAttribute("aria-hidden") !== "true"
  )
}

// Check if element is in viewport
function isInViewport(el) {
  const rect = el.getBoundingClientRect()
  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth
}

// Build comprehensive element map
export function buildElementMap(options = {}) {
  const { includeHidden = false, contextSelector = null } = options
  const root = contextSelector ? document.querySelector(contextSelector) : document
  if (!root) return []

  const elements = Array.from(root.querySelectorAll(ELEMENT_SELECTORS.join(", ")))

  return elements
    .map((el, index) => {
      const rect = el.getBoundingClientRect()
      const visible = isInteractable(el)

      if (!visible && !includeHidden) return null

      return {
        index,
        element: el,
        action: el.dataset?.action || el.dataset?.voiceAction || el.id || `element-${index}`,
        type: getElementType(el),
        inputType: el.type || null,
        text: (el.innerText || el.value || "").trim().slice(0, 100),
        label: getElementLabel(el),
        placeholder: el.placeholder || "",
        ariaLabel: el.getAttribute("aria-label") || "",
        disabled: el.disabled || el.getAttribute("aria-disabled") === "true",
        visible,
        inViewport: isInViewport(el),
        position: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
        searchText: getElementSearchText(el),
      }
    })
    .filter(Boolean)
}

function getElementType(el) {
  const tag = el.tagName.toLowerCase()
  if (tag === "input") return `input-${el.type || "text"}`
  if (tag === "select") return "select"
  if (tag === "textarea") return "textarea"
  if (tag === "button" || el.getAttribute("role") === "button") return "button"
  if (tag === "a") return "link"
  return tag
}

function getElementLabel(el) {
  // Check for associated label
  if (el.id) {
    const label = document.querySelector(`label[for="${el.id}"]`)
    if (label) return label.textContent?.trim()
  }

  // Check aria-labelledby
  const labelledBy = el.getAttribute("aria-labelledby")
  if (labelledBy) {
    const labelEl = document.getElementById(labelledBy)
    if (labelEl) return labelEl.textContent?.trim()
  }

  // Check parent label
  const parentLabel = el.closest("label")
  if (parentLabel) return parentLabel.textContent?.trim()

  return el.getAttribute("aria-label") || ""
}

// Find element by query with fuzzy matching
export function findElement(query, elementMap = null) {
  const map = elementMap || buildElementMap()
  if (!query) return null

  const queryLower = query.toLowerCase().trim()

  console.log("[v0] Finding element for query:", queryLower)

  // Strategy 1: Exact data-action match
  let match = map.find((el) => el.action?.toLowerCase() === queryLower)
  if (match) {
    console.log("[v0] Found by exact data-action:", match.action)
    return match
  }

  // Strategy 2: Exact ID match
  match = map.find((el) => el.element.id?.toLowerCase() === queryLower)
  if (match) {
    console.log("[v0] Found by exact ID:", match.element.id)
    return match
  }

  // Strategy 3: Match by element type keywords
  const typeKeywords = {
    "sign in": ["submit-auth", "signin", "sign-in", "login"],
    signin: ["submit-auth", "signin", "sign-in", "login"],
    login: ["submit-auth", "signin", "sign-in", "login"],
    "sign up": ["submit-auth", "signup", "sign-up", "register", "create-account"],
    signup: ["submit-auth", "signup", "sign-up", "register", "create-account"],
    "create account": ["submit-auth", "signup", "sign-up", "register", "create-account"],
    submit: ["submit-auth", "submit", "submit-otp"],
    role: ["role"],
    student: ["role-student", "select-student-role", "select-student"],
    parent: ["role-parent", "select-parent-role", "select-parent"],
    counselor: ["role-counselor", "select-counselor-role", "select-counselor"],
  }

  for (const [keyword, actions] of Object.entries(typeKeywords)) {
    if (queryLower.includes(keyword)) {
      for (const actionName of actions) {
        match = map.find((el) => el.action?.toLowerCase().includes(actionName))
        if (match) {
          console.log("[v0] Found by keyword mapping:", keyword, "->", match.action)
          return match
        }
      }
    }
  }

  // Strategy 4: Fuzzy match on all searchable text
  let bestMatch = null
  let bestScore = 0

  for (const item of map) {
    const score = fuzzyMatch(item.searchText, queryLower)
    if (score > bestScore && score > 0.5) {
      bestScore = score
      bestMatch = item
    }
  }

  if (bestMatch) {
    console.log("[v0] Found by fuzzy match (score:", bestScore, "):", bestMatch.action)
    return bestMatch
  }

  // Strategy 5: Partial match on visible text
  match = map.find((el) => el.text.toLowerCase().includes(queryLower))
  if (match) {
    console.log("[v0] Found by text content:", match.text)
    return match
  }

  console.log("[v0] Element not found for query:", queryLower)
  return null
}

// Wait for element to appear (for dynamic content)
export async function waitForElement(query, options = {}) {
  const { timeout = 3000, interval = 100 } = options
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    const element = findElement(query)
    if (element) return element
    await new Promise((r) => setTimeout(r, interval))
  }

  return null
}

// Get current page state
export function getPageState() {
  return {
    url: window.location.pathname,
    title: document.title,
    hash: window.location.hash,
    scrollY: window.scrollY,
    scrollHeight: document.documentElement.scrollHeight,
    viewportHeight: window.innerHeight,
    hasModal: !!document.querySelector('[role="dialog"], [data-modal], .modal'),
    hasForm: !!document.querySelector("form"),
    activeElement: document.activeElement?.dataset?.action || document.activeElement?.id || null,
    focusedInput: document.activeElement?.tagName === "INPUT" ? document.activeElement : null,
  }
}

export default {
  buildElementMap,
  findElement,
  waitForElement,
  getPageState,
  isInteractable,
  isInViewport,
}



