// Main export file for the voice assistant system

// Core modules
export {
  default as ElementFinder,
  buildElementMap,
  findElement,
  getPageState,
  waitForElement,
} from "./core/element-finder"
export { default as ActionExecutor } from "./core/action-executor"
export { default as CommandRegistry, parseCommand, registerCommand, getHelpText } from "./core/command-registry"
export { default as WorkflowEngine, startWorkflow, executeWorkflow, getWorkflowStatus } from "./core/workflow-engine"
export { default as IntentProcessor, processIntent } from "./core/intent-processor"

// Hooks
export { useVoiceAssistant } from "./hooks/use-voice-assistant"

// UI Components
export { VisualIndicator, VoiceButton } from "./ui/visual-indicator"
export { AssistantOverlay } from "./ui/assistant-overlay"

// Default export - the main overlay component
export { AssistantOverlay as default } from "./ui/assistant-overlay"




