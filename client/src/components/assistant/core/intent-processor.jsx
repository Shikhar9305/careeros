

import { parseCommand, getActionForSlot } from "./command-registry"
import { findElement, buildElementMap, getPageState } from "./element-finder"
import { addWorkflowData, getWorkflowStatus, cancelWorkflow } from "./workflow-engine"

const API_BASE = `${import.meta.env.VITE_API_URL}/api`

// Process intent locally first, fallback to LLM for complex queries
export async function processIntent(userText, options = {}) {
  const { useLLM = true, sessionId = "default" } = options

  const pageState = getPageState()
  const elementMap = buildElementMap()
  const workflowStatus = getWorkflowStatus()

  // Try local parsing first
  const localResult = parseCommand(userText)

  // Handle workflow-specific intents
  if (workflowStatus.active) {
    const workflowResult = handleWorkflowIntent(userText, localResult, workflowStatus)
    if (workflowResult) return workflowResult
  }

  // Handle high-confidence local matches
  if (localResult.confidence >= 0.8) {
    return processLocalIntent(localResult, elementMap, pageState)
  }

  // Fallback to LLM for complex/ambiguous queries
  if (useLLM && localResult.confidence < 0.6) {
    try {
      const llmResult = await callLLMIntent(userText, elementMap, sessionId)
      if (llmResult && llmResult.confidence > localResult.confidence) {
        return llmResult
      }
    } catch (error) {
      console.warn("LLM fallback failed:", error)
    }
  }

  // Return local result as fallback
  return processLocalIntent(localResult, elementMap, pageState)
}

// Handle intents within active workflow
function handleWorkflowIntent(userText, localResult, workflowStatus) {
  const { intent, params } = localResult

  // Cancel workflow
  if (intent === "CANCEL") {
    cancelWorkflow()
    return {
      intent: "WORKFLOW_CANCELLED",
      action: "none",
      reply: "Cancelled. What would you like to do instead?",
      confidence: 1,
    }
  }

  // Check if providing data for workflow
  if (intent === "FILL_SLOT") {
    addWorkflowData(params.slot, params.value)
    return {
      intent: "WORKFLOW_DATA",
      action: "continue_workflow",
      slot: params.slot,
      value: params.value,
      reply: `Got it, your ${params.slot} is ${params.value}`,
      confidence: 0.95,
    }
  }

  // Check for role selection in signup workflow
  if (intent === "SELECT_ROLE") {
    addWorkflowData("role", params.role)
    return {
      intent: "WORKFLOW_DATA",
      action: "continue_workflow",
      slot: "role",
      value: params.role,
      reply: `Selected ${params.role} role`,
      confidence: 0.95,
    }
  }

  // Confirmation to proceed
  if (intent === "CONFIRM") {
    return {
      intent: "WORKFLOW_CONTINUE",
      action: "continue_workflow",
      reply: "Continuing...",
      confidence: 1,
    }
  }

  return null
}

// Process locally parsed intent
function processLocalIntent(parsed, elementMap, pageState) {
  const { intent, params } = parsed

  switch (intent) {
    case "SCROLL":
      return {
        intent: "SCROLL",
        action: "scroll",
        direction: params.direction,
        reply: `Scrolling ${params.direction}`,
        confidence: 0.95,
      }

    case "NAVIGATE_BACK":
      return {
        intent: "NAVIGATE",
        action: "navigate_back",
        reply: "Going back",
        confidence: 0.95,
      }

    case "NAVIGATE_FORWARD":
      return {
        intent: "NAVIGATE",
        action: "navigate_forward",
        reply: "Going forward",
        confidence: 0.95,
      }

    case "TAB_NEXT":
      return {
        intent: "TAB",
        action: "tab_next",
        reply: "Moving to next element",
        confidence: 0.95,
      }

    case "TAB_PREV":
      return {
        intent: "TAB",
        action: "tab_prev",
        reply: "Moving to previous element",
        confidence: 0.95,
      }

    case "CLICK": {
      const cleanTarget = cleanTargetText(params.target)
      const element = findElement(cleanTarget, elementMap)
      return {
        intent: "CLICK",
        action: "click",
        targetAction: element?.action || cleanTarget,
        element,
        reply: element ? `Clicking ${element.text || element.action}` : `Looking for ${cleanTarget}`,
        confidence: element ? 0.9 : 0.5,
      }
    }

    case "FILL": {
      const element = findElement(params.target, elementMap)
      return {
        intent: "FILL",
        action: "fill",
        targetAction: element?.action || params.target,
        element,
        value: params.value,
        reply: element
          ? `Typing "${params.value}" in ${element.label || element.action}`
          : `Looking for ${params.target}`,
        confidence: element ? 0.9 : 0.5,
      }
    }

    case "FILL_FOCUSED": {
      const focusedElement = pageState.focusedInput
      if (focusedElement) {
        return {
          intent: "FILL",
          action: "fill_focused",
          value: params.value,
          reply: `Typing "${params.value}"`,
          confidence: 0.9,
        }
      }
      return {
        intent: "UNKNOWN",
        action: "none",
        reply: "Please focus on an input field first",
        confidence: 0.3,
      }
    }

    case "FILL_SLOT": {
      const action = getActionForSlot(params.slot)
      const element = findElement(action, elementMap)
      return {
        intent: "FILL",
        action: "fill",
        targetAction: element?.action || action,
        element,
        value: params.value,
        slot: params.slot,
        reply: `Setting ${params.slot} to "${params.value}"`,
        confidence: element ? 0.95 : 0.6,
      }
    }

    case "SELECT": {
      const element = findElement(params.target, elementMap)
      return {
        intent: "SELECT",
        action: "select",
        targetAction: element?.action || params.target,
        element,
        value: params.value,
        reply: element ? `Selecting "${params.value}"` : `Looking for dropdown`,
        confidence: element ? 0.9 : 0.5,
      }
    }

    case "SELECT_ROLE": {
      const roleElement = findElement("role", elementMap)
      return {
        intent: "SELECT",
        action: "select",
        targetAction: roleElement?.action || "role",
        element: roleElement,
        value: params.role,
        reply: `Selecting ${params.role} role`,
        confidence: 0.9,
      }
    }

    case "FOCUS": {
      const element = findElement(params.target, elementMap)
      return {
        intent: "FOCUS",
        action: "focus",
        targetAction: element?.action || params.target,
        element,
        reply: element ? `Moving to ${element.label || element.action}` : `Looking for ${params.target}`,
        confidence: element ? 0.9 : 0.5,
      }
    }

    case "CLEAR": {
      const element = findElement(params.target, elementMap)
      return {
        intent: "CLEAR",
        action: "clear",
        targetAction: element?.action || params.target,
        element,
        reply: element ? `Clearing ${element.label || element.action}` : `Looking for ${params.target}`,
        confidence: element ? 0.9 : 0.5,
      }
    }

    case "TOGGLE": {
      const element = findElement(params.target, elementMap)
      return {
        intent: "TOGGLE",
        action: "toggle",
        targetAction: element?.action || params.target,
        element,
        reply: element ? `Toggling ${element.label || element.action}` : `Looking for ${params.target}`,
        confidence: element ? 0.9 : 0.5,
      }
    }

    case "SUBMIT": {
      const submitBtn =
        findElement("submit", elementMap) ||
        elementMap.find((el) => el.type === "button" && el.element?.type === "submit")
      return {
        intent: "CLICK",
        action: "click",
        targetAction: submitBtn?.action || "submit",
        element: submitBtn,
        reply: "Submitting form",
        confidence: submitBtn ? 0.9 : 0.6,
      }
    }

    case "AUTH_START": {
      const mode = params.mode
      return {
        intent: mode === "signup" ? "SIGNUP_START" : "LOGIN_START",
        action: "start_workflow",
        workflow: mode === "signup" ? "SIGNUP" : "SIGNIN",
        reply:
          mode === "signup" ? "Let's create your account. What's your name?" : "Let's sign you in. What's your email?",
        confidence: 0.9,
      }
    }

    case "READ": {
      const element = findElement(params.target, elementMap)
      return {
        intent: "READ",
        action: "read",
        targetAction: element?.action || params.target,
        element,
        reply: element ? element.text || "No readable content" : `Could not find ${params.target}`,
        confidence: element ? 0.9 : 0.5,
      }
    }

    case "HELP":
      return {
        intent: "HELP",
        action: "show_help",
        reply:
          'I can help you navigate this page with voice commands. Try saying "click sign up", "fill email with test@example.com", or "scroll down".',
        confidence: 1,
      }

    case "WHERE_AM_I":
      return {
        intent: "INFO",
        action: "page_info",
        reply: `You're on ${pageState.title || "this page"}. ${pageState.hasForm ? "There's a form here you can fill out." : ""}`,
        confidence: 1,
      }

    case "CONFIRM":
      return {
        intent: "CONFIRM",
        action: "confirm",
        reply: "Confirmed",
        confidence: 1,
      }

    case "CANCEL":
      return {
        intent: "CANCEL",
        action: "cancel",
        reply: "Cancelled",
        confidence: 1,
      }

    default:
      return {
        intent: "UNKNOWN",
        action: "none",
        reply: 'I didn\'t understand that. Try saying "help" for available commands.',
        confidence: 0.2,
        originalText: parsed.params?.text,
      }
  }
}

// Call LLM backend for complex intent parsing
async function callLLMIntent(userText, elementMap, sessionId) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8000)

  try {
    console.log("[v0] Calling LLM with:", userText)

    const response = await fetch(`${API_BASE}/assistant-intent-smart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-session-id": sessionId, // lowercase header name for consistency
      },
      body: JSON.stringify({
        userText,
        uiMap: elementMap.slice(0, 30).map((el) => ({
          action: el.action,
          type: el.type,
          text: el.text,
          label: el.label,
          placeholder: el.placeholder,
          context: el.context,
          disabled: el.disabled,
        })),
        context: {
          url: window.location.pathname,
          timestamp: Date.now(),
        },
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    console.log("[v0] LLM response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] LLM error response:", errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log("[v0] LLM response data:", data)

    if (data.error) {
      console.warn("[v0] LLM returned error:", data.error)
      // Still return the data as it contains fallback reply
    }

    // Find matching element for LLM result
    if (data.targetAction) {
      const element = findElement(data.targetAction, elementMap)
      data.element = element
    }

    return {
      ...data,
      action: mapLLMIntentToAction(data.intent),
      confidence: data.confidence || 0.7,
    }
  } catch (error) {
    clearTimeout(timeoutId)
    console.error("[v0] LLM call failed:", error.message)
    throw error
  }
}

// Map LLM intent names to local action names
function mapLLMIntentToAction(intent) {
  const mapping = {
    NAVIGATE: "navigate",
    SIGNUP_START: "start_workflow",
    SIGNUP_FILL: "fill",
    SIGNUP_SUBMIT: "click",
    LOGIN_START: "start_workflow",
    LOGIN_SUBMIT: "click",
    INPUT_FILL: "fill",
    CLICK: "click",
    SELECT: "select",
    CONFIRM: "confirm",
    CANCEL: "cancel",
    HELP: "show_help",
    UNKNOWN: "none",
  }
  return mapping[intent] || "none"
}

function cleanTargetText(target) {
  if (!target) return target
  // Remove common filler words at start
  return target
    .replace(/^(on|the|a|an)\s+/i, "")
    .replace(/\s+(button|link|field|input)$/i, "")
    .trim()
}

export default {
  processIntent,
}
 






