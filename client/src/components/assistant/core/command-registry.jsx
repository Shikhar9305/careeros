




// Command registry with pattern matching for voice commands

const commands = new Map()

// Command patterns with intent mapping
const COMMAND_PATTERNS = [
  // Navigation / Scrolling
  { pattern: /^scroll\s*(up|down)$/i, intent: "SCROLL", extract: (m) => ({ direction: m[1] }) },
  {
    pattern: /^(go\s*)?(scroll\s*)?(to\s*)?(the\s*)?(top|bottom)$/i,
    intent: "SCROLL",
    extract: (m) => ({ direction: m[5] }),
  },
  { pattern: /^scroll\s*to\s*(top|bottom)$/i, intent: "SCROLL", extract: (m) => ({ direction: m[1] }) },
  { pattern: /^(go\s*)?back$/i, intent: "NAVIGATE_BACK" },
  { pattern: /^(go\s*)?forward$/i, intent: "NAVIGATE_FORWARD" },
  { pattern: /^(next|tab)$/i, intent: "TAB_NEXT" },
  { pattern: /^(previous|prev|shift tab)$/i, intent: "TAB_PREV" },

  // Form actions - Click
  {
    pattern: /^(click|press|tap|hit|push)\s*(on\s*)?(the\s*)?(.+)/i,
    intent: "CLICK",
    extract: (m) => ({ target: m[4].trim() }),
  },

  // Form actions - Fill
  {
    pattern: /^(type|enter|fill|input|write|set)\s+["']?(.+?)["']?\s+(in|into|to|for|on)\s+(the\s*)?(.+)/i,
    intent: "FILL",
    extract: (m) => ({ value: m[2].trim(), target: m[5].trim() }),
  },
  {
    pattern: /^(type|enter|fill|input|write)\s+["']?(.+?)["']?$/i,
    intent: "FILL_FOCUSED",
    extract: (m) => ({ value: m[2].trim() }),
  },

  // Form actions - Select
  {
    pattern: /^(select|choose|pick)\s+["']?(.+?)["']?\s+(from|in|on)\s+(the\s*)?(.+)/i,
    intent: "SELECT",
    extract: (m) => ({ value: m[2].trim(), target: m[5].trim() }),
  },
  { pattern: /^(select|choose|pick)\s+["']?(.+?)["']?$/i, intent: "SELECT", extract: (m) => ({ value: m[2].trim() }) },

  // Form actions - Other
  {
    pattern: /^(clear|erase|delete|remove)\s+(the\s*)?(.+)/i,
    intent: "CLEAR",
    extract: (m) => ({ target: m[3].trim() }),
  },
  { pattern: /^(focus|go to|move to)\s+(the\s*)?(.+)/i, intent: "FOCUS", extract: (m) => ({ target: m[3].trim() }) },
  {
    pattern: /^(toggle|switch|check|uncheck)\s+(the\s*)?(.+)/i,
    intent: "TOGGLE",
    extract: (m) => ({ target: m[3].trim() }),
  },
  { pattern: /^submit(\s+(the\s*)?(.+))?$/i, intent: "SUBMIT", extract: (m) => ({ target: m[3] || "form" }) },

  // Auth shortcuts
  {
    pattern: /^(sign\s*up|create\s*(an?\s*)?account|register)/i,
    intent: "AUTH_START",
    extract: () => ({ mode: "signup" }),
  },
  {
    pattern: /^(sign\s*in|log\s*in|login)/i,
    intent: "AUTH_START",
    extract: () => ({ mode: "signin" }),
  },

  // Slot filling
  {
    pattern: /^(my\s*)?(name|email|password)\s+(is|=)\s+["']?(.+?)["']?$/i,
    intent: "FILL_SLOT",
    extract: (m) => ({ slot: m[2].toLowerCase(), value: m[4].trim() }),
  },

  // Role selection - multiple patterns
  {
    pattern: /^i('m| am)\s+(a\s+)?(student|parent|counselor|counsellor)/i,
    intent: "SELECT_ROLE",
    extract: (m) => ({ role: m[3].toLowerCase().replace("counsellor", "counselor") }),
  },
  {
    pattern: /^(select|choose|pick|i want|i am)\s+(a\s+)?(student|parent|counselor|counsellor)(\s+role)?$/i,
    intent: "SELECT_ROLE",
    extract: (m) => ({ role: m[3].toLowerCase().replace("counsellor", "counselor") }),
  },
  {
    pattern: /^(student|parent|counselor|counsellor)(\s+role)?$/i,
    intent: "SELECT_ROLE",
    extract: (m) => ({ role: m[1].toLowerCase().replace("counsellor", "counselor") }),
  },

  // Reading/Info
  { pattern: /^(read|what('s| is)|tell me)\s+(.+)/i, intent: "READ", extract: (m) => ({ target: m[3] }) },
  { pattern: /^(help|what can (you|i) (do|say))/i, intent: "HELP" },
  { pattern: /^(where|what page|what screen)/i, intent: "WHERE_AM_I" },

  // Confirmation
  { pattern: /^(yes|yeah|yep|confirm|okay|ok|sure|do it)/i, intent: "CONFIRM" },
  { pattern: /^(no|nope|cancel|stop|never\s*mind)/i, intent: "CANCEL" },
]

// Register custom command
export function registerCommand(pattern, intent, handler) {
  commands.set(intent, { pattern, handler })
}

// Parse voice command to intent
export function parseCommand(text) {
  const normalized = text.trim()

  console.log("[v0] Parsing command:", normalized)

  // Check custom commands first
  for (const [intent, { pattern, handler }] of commands) {
    const match = normalized.match(pattern)
    if (match) {
      console.log("[v0] Matched custom command:", intent)
      return { intent, params: handler ? handler(match) : {}, confidence: 0.9 }
    }
  }

  // Check built-in patterns
  for (const { pattern, intent, extract } of COMMAND_PATTERNS) {
    const match = text.match(pattern)
    if (match) {
      const params = extract ? extract(match) : {}
      console.log("[v0] Matched pattern:", intent, params)
      return {
        intent,
        params,
        confidence: 0.85,
        rawMatch: match[0],
      }
    }
  }

  console.log("[v0] No pattern matched for:", normalized)
  return { intent: "UNKNOWN", params: { text }, confidence: 0 }
}

// Get help text for available commands
export function getHelpText() {
  return `
Available voice commands:

NAVIGATION:
• "Scroll up/down" - Scroll the page
• "Go to top/bottom" - Scroll to page edges
• "Go back/forward" - Browser history
• "Next/Previous" - Tab between elements

CLICKING:
• "Click [button name]" - Click any element
• "Click create account" - Submit signup
• "Click sign in" - Submit signin

FORM FILLING:
• "Type [text] in [field]" - Fill input
• "My name is [name]" - Fill name field
• "My email is [email]" - Fill email
• "My password is [pass]" - Fill password

ROLE SELECTION:
• "I am a student/parent/counselor"
• "Select student" - Pick role
• "Student" - Just say the role

OTHER:
• "Submit" - Submit current form
• "Help" - Show this help
• "Clear [field]" - Clear input
  `.trim()
}

// Slot mapping for form filling
export const SLOT_MAP = {
  name: ["name", "fullname", "full-name", "username"],
  email: ["email", "email-address", "user-email"],
  password: ["password", "pass", "pwd"],
  role: ["role", "user-role", "account-type"],
  otp: ["otp", "code", "verification-code", "verify-code"],
  phone: ["phone", "telephone", "mobile"],
}

// Find the right action for a slot
export function getActionForSlot(slot) {
  const possibleActions = SLOT_MAP[slot.toLowerCase()] || [slot]

  for (const action of possibleActions) {
    const el = document.querySelector(`[data-action="${action}"], #${action}, [name="${action}"]`)
    if (el) return action
  }

  return slot
}

export default {
  registerCommand,
  parseCommand,
  getHelpText,
  SLOT_MAP,
  getActionForSlot,
}


