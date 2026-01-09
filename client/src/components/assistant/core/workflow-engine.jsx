// Multi-step workflow engine for complex voice-driven tasks

import { waitForElement } from "./element-finder"
import { fillInput, clickElement, selectFromDropdown  } from "./action-executor"
import { getActionForSlot } from "./command-registry"

// Workflow state
let currentWorkflow = null
const workflowHistory = []

// Workflow definitions for common tasks
const WORKFLOWS = {
  SIGNUP: {
    name: "Sign Up",
    steps: [
      { action: "switch_mode", condition: (state) => !state.isSignUp, target: "toggle-auth-mode" },
      { action: "fill", slot: "name", required: true },
      { action: "fill", slot: "email", required: true },
      { action: "fill", slot: "password", required: true },
      { action: "select", slot: "role", required: true },
      { action: "click", target: "submit-auth", waitFor: "otp-card" },
    ],
  },
  SIGNIN: {
    name: "Sign In",
    steps: [
      { action: "switch_mode", condition: (state) => state.isSignUp, target: "toggle-auth-mode" },
      { action: "fill", slot: "email", required: true },
      { action: "fill", slot: "password", required: true },
      { action: "click", target: "submit-auth" },
    ],
  },
  VERIFY_OTP: {
    name: "Verify OTP",
    steps: [
      { action: "fill", slot: "otp", required: true },
      { action: "click", target: "submit-otp" },
    ],
  },
  SELECT_ROLE_CARD: {
    name: "Select Role",
    steps: [{ action: "click", target: "select-{role}-role" }],
  },
}

// Start a workflow
export function startWorkflow(workflowName, initialData = {}) {
  const workflow = WORKFLOWS[workflowName]
  if (!workflow) {
    return { success: false, error: `Unknown workflow: ${workflowName}` }
  }

  currentWorkflow = {
    name: workflowName,
    definition: workflow,
    currentStep: 0,
    data: { ...initialData },
    startedAt: Date.now(),
    status: "in_progress",
  }

  return { success: true, workflow: workflowName, message: workflow.name + " started" }
}

// Add data to current workflow
export function addWorkflowData(slot, value) {
  if (!currentWorkflow) {
    return { success: false, error: "No active workflow" }
  }

  currentWorkflow.data[slot] = value
  return { success: true, slot, value }
}

// Execute next step in workflow
export async function executeNextStep(pageState = {}) {
  if (!currentWorkflow) {
    return { success: false, error: "No active workflow" }
  }

  const { definition, currentStep, data } = currentWorkflow

  if (currentStep >= definition.steps.length) {
    const completed = completeWorkflow()
    return { success: true, completed: true, ...completed }
  }

  const step = definition.steps[currentStep]

  // Check condition
  if (step.condition && !step.condition(pageState)) {
    currentWorkflow.currentStep++
    return executeNextStep(pageState)
  }

  // Check required data
  if (step.required && step.slot && !data[step.slot]) {
    return {
      success: false,
      needsInput: true,
      slot: step.slot,
      message: `Please provide your ${step.slot}`,
    }
  }

  // Execute step
  let result
  const targetAction = step.target?.replace("{role}", data.role || "")

  switch (step.action) {
    case "fill": {
      const action = getActionForSlot(step.slot)
      const element = await waitForElement(action, { timeout: 2000 })
      if (element) {
        result = await fillInput(element, data[step.slot], { simulateTyping: true })
      } else {
        result = { success: false, error: `Could not find ${step.slot} field` }
      }
      break
    }

    case "click":
    case "switch_mode": {
      const element = await waitForElement(targetAction, { timeout: 2000 })
      if (element) {
        result = await clickElement(element)
        if (step.waitFor) {
          await waitForElement(step.waitFor, { timeout: 3000 })
        }
      } else {
        result = { success: false, error: `Could not find ${targetAction}` }
      }
      break
    }

    case "select": {
      const action = getActionForSlot(step.slot)
      const element = await waitForElement(action, { timeout: 2000 })
      if (element) {
        result = await selectFromDropdown(element, data[step.slot])
      } else {
        result = { success: false, error: `Could not find ${step.slot} selector` }
      }
      break
    }

    default:
      result = { success: false, error: `Unknown action: ${step.action}` }
  }

  if (result.success) {
    currentWorkflow.currentStep++
  }

  return {
    ...result,
    step: currentStep + 1,
    totalSteps: definition.steps.length,
    completed: currentWorkflow.currentStep >= definition.steps.length,
  }
}

// Execute entire workflow
export async function executeWorkflow(workflowName, data = {}, pageState = {}) {
  const startResult = startWorkflow(workflowName, data)
  if (!startResult.success) return startResult

  const results = []
  let lastResult

  while (currentWorkflow && currentWorkflow.currentStep < currentWorkflow.definition.steps.length) {
    lastResult = await executeNextStep(pageState)
    results.push(lastResult)

    if (!lastResult.success && !lastResult.needsInput) {
      break
    }

    if (lastResult.needsInput) {
      return { ...lastResult, partialResults: results }
    }

    // Small delay between steps
    await new Promise((r) => setTimeout(r, 200))
  }

  return {
    success: lastResult?.success || false,
    completed: lastResult?.completed || false,
    results,
  }
}

// Complete workflow
function completeWorkflow() {
  if (!currentWorkflow) return null

  currentWorkflow.status = "completed"
  currentWorkflow.completedAt = Date.now()

  workflowHistory.push({ ...currentWorkflow })

  const result = { ...currentWorkflow }
  currentWorkflow = null

  return result
}

// Cancel workflow
export function cancelWorkflow() {
  if (!currentWorkflow) {
    return { success: false, error: "No active workflow" }
  }

  currentWorkflow.status = "cancelled"
  workflowHistory.push({ ...currentWorkflow })
  currentWorkflow = null

  return { success: true, message: "Workflow cancelled" }
}

// Get workflow status
export function getWorkflowStatus() {
  if (!currentWorkflow) {
    return { active: false }
  }

  return {
    active: true,
    name: currentWorkflow.name,
    step: currentWorkflow.currentStep + 1,
    totalSteps: currentWorkflow.definition.steps.length,
    data: currentWorkflow.data,
  }
}

// Check if workflow is waiting for specific data
export function isWaitingFor(slot) {
  if (!currentWorkflow) return false

  const step = currentWorkflow.definition.steps[currentWorkflow.currentStep]
  return step?.slot === slot && step?.required && !currentWorkflow.data[slot]
}

export default {
  WORKFLOWS,
  startWorkflow,
  addWorkflowData,
  executeNextStep,
  executeWorkflow,
  cancelWorkflow,
  getWorkflowStatus,
  isWaitingFor,
}



