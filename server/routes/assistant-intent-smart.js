
import express from "express"

const router = express.Router()

const SYSTEM_PROMPT = `You are a voice assistant that helps users navigate and interact with a website.
Your job is to understand the user's intent and return a structured action.

Available actions:
- click: Click on a button, link, or interactive element
- fill: Fill in an input field with text
- select: Select an option from a dropdown
- scroll: Scroll the page (up, down, top, bottom)
- navigate: Navigate to a different page or section
- focus: Focus on a specific input field
- clear: Clear an input field
- submit: Submit a form
- read: Read content aloud to the user
- help: Show available commands
- tab: Move focus to next/previous element
- toggle: Toggle checkboxes or switches

Available intents to return:
- NAVIGATE: For navigation actions
- SIGNUP_START: Starting signup flow
- SIGNUP_FILL: Filling signup form fields
- SIGNUP_SUBMIT: Submitting signup
- LOGIN_START: Starting login flow
- LOGIN_SUBMIT: Submitting login
- INPUT_FILL: Filling any input field
- CLICK: Clicking elements
- SELECT: Selecting dropdown options
- SCROLL: Scrolling the page
- CONFIRM: User confirmation
- CANCEL: User cancellation
- HELP: Show help
- UNKNOWN: Could not understand

Return JSON in this exact format:
{
  "intent": "INTENT_NAME",
  "action": "action_type",
  "targetAction": "element data-voice-action value or label",
  "value": "value if applicable (for fill, select)",
  "confidence": 0.0-1.0,
  "reply": "What to say to the user"
}

Context about the current page elements will be provided. Use the "action" field from elements to identify targets.
If unsure, return intent "UNKNOWN" and ask for clarification in the reply.`

router.post("/", async (req, res) => {
  try {
    const { userText, uiMap, context, messages, pageContext } = req.body

    console.log("[assistant-intent] Request received:", {
      userText,
      hasUiMap: !!uiMap,
      uiMapLength: uiMap?.length,
      hasMessages: !!messages,
    })

    if (!process.env.GROQ_API_KEY) {
      console.error("[assistant-intent] GROQ_API_KEY not configured")
      return res.status(200).json({
        error: "GROQ_API_KEY not configured",
        intent: "UNKNOWN",
        action: "error",
        reply: "Voice assistant is not properly configured. Please add GROQ_API_KEY.",
        confidence: 0,
      })
    }

    // Build context about available elements
    const elements = uiMap || pageContext || []
    const contextMessage =
      elements.length > 0 ? `\n\nAvailable page elements:\n${JSON.stringify(elements, null, 2)}` : ""

    // Build messages array
    let chatMessages
    if (messages && Array.isArray(messages)) {
      chatMessages = [
        {
          role: "system",
          content: SYSTEM_PROMPT + contextMessage,
        },
        ...messages,
      ]
    } else {
      chatMessages = [
        {
          role: "system",
          content: SYSTEM_PROMPT + contextMessage,
        },
        {
          role: "user",
          content: userText || "help",
        },
      ]
    }

    console.log("[assistant-intent] Calling Groq API...")

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: chatMessages,
        temperature: 0.1,
        max_tokens: 500,
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("[assistant-intent] Groq API error:", response.status, error)
      // Return 200 with error info instead of passing through Groq's error status
      return res.status(200).json({
        error: "LLM processing failed",
        details: error,
        intent: "UNKNOWN",
        action: "none",
        reply: "I had trouble processing that. Please try a simpler command.",
        confidence: 0,
      })
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    console.log("[assistant-intent] Groq response:", content)

    if (!content) {
      return res.status(200).json({
        error: "No response from LLM",
        intent: "UNKNOWN",
        action: "none",
        reply: "I didn't get a response. Please try again.",
        confidence: 0,
      })
    }

    // Parse the JSON response
    let parsed
    try {
      parsed = JSON.parse(content)
    } catch (e) {
      console.error("[assistant-intent] JSON parse error:", e.message)
      parsed = {
        intent: "UNKNOWN",
        action: "none",
        reply: content,
        confidence: 0.3,
      }
    }

    // Validate and normalize response
    const result = {
      intent: parsed.intent || "UNKNOWN",
      action: parsed.action || "none",
      targetAction: parsed.targetAction || parsed.target || null,
      value: parsed.value || null,
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.7,
      reply: parsed.reply || parsed.speak || "I understood your request.",
      raw: content,
    }

    console.log("[assistant-intent] Returning result:", result)
    return res.json(result)
  } catch (error) {
    console.error("[assistant-intent] Intent processing error:", error)
    return res.status(200).json({
      error: "Failed to process intent",
      intent: "UNKNOWN",
      action: "none",
      reply: "Sorry, I had trouble understanding that. Please try again.",
      confidence: 0,
    })
  }
})

export default router





