


// Comprehensive action execution system
import { findElement } from "./element-finder"

const ANIMATION_DURATION = 300
const TYPING_DELAY = 30

// Highlight element with visual feedback
function highlightElement(el, type = "action") {
  if (!el) return () => {}

  const colors = {
    action: { outline: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)" },
    fill: { outline: "#8b5cf6", bg: "rgba(139, 92, 246, 0.15)" },
    success: { outline: "#22c55e", bg: "rgba(34, 197, 94, 0.15)" },
    error: { outline: "#ef4444", bg: "rgba(239, 68, 68, 0.15)" },
    focus: { outline: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)" },
  }

  const color = colors[type] || colors.action
  const originalOutline = el.style.outline
  const originalBg = el.style.backgroundColor
  const originalTransition = el.style.transition

  el.style.transition = "all 0.2s ease"
  el.style.outline = `3px solid ${color.outline}`
  el.style.outlineOffset = "2px"
  el.style.backgroundColor = color.bg

  return () => {
    el.style.outline = originalOutline
    el.style.backgroundColor = originalBg
    el.style.transition = originalTransition
  }
}

// Smooth scroll to element
async function scrollToElement(el, options = {}) {
  const { block = "center", behavior = "smooth" } = options

  return new Promise((resolve) => {
    el.scrollIntoView({ behavior, block })
    setTimeout(resolve, ANIMATION_DURATION)
  })
}

// Scroll page
export async function scrollPage(direction, amount = null) {
  const scrollAmount = amount || window.innerHeight * 0.7

  return new Promise((resolve) => {
    let targetY

    if (direction === "up") {
      targetY = Math.max(0, window.scrollY - scrollAmount)
    } else if (direction === "down") {
      targetY = Math.min(document.documentElement.scrollHeight - window.innerHeight, window.scrollY + scrollAmount)
    } else {
      targetY = window.scrollY
    }

    console.log("[v0] Scrolling", direction, "from", window.scrollY, "to", targetY)

    window.scrollTo({ top: targetY, behavior: "smooth" })

    setTimeout(() => {
      console.log("[v0] Scroll complete, now at:", window.scrollY)
      resolve({ success: true, scrollY: window.scrollY })
    }, ANIMATION_DURATION + 100)
  })
}

// Scroll to top/bottom
export async function scrollToPosition(position) {
  return new Promise((resolve) => {
    const targetY = position === "top" ? 0 : document.documentElement.scrollHeight

    console.log("[v0] Scrolling to", position, "targetY:", targetY)

    window.scrollTo({ top: targetY, behavior: "smooth" })

    setTimeout(() => {
      console.log("[v0] Scroll to position complete, now at:", window.scrollY)
      resolve({ success: true, scrollY: window.scrollY })
    }, ANIMATION_DURATION + 100)
  })
}

// Resolve element from various inputs
function resolveElement(target) {
  if (!target) return null

  // If it's already a DOM element
  if (target instanceof Element) return target

  // If it has an element property (from findElement)
  if (target.element instanceof Element) return target.element

  // If it's a string, try to find it
  if (typeof target === "string") {
    const found = findElement(target)
    return found?.element || document.querySelector(`[data-action="${target}"], #${target}, [name="${target}"]`)
  }

  return null
}

// Fill input with optional typing simulation
export async function fillInput(target, value, options = {}) {
  const { simulateTyping = false, highlight = true, clearFirst = true, useElement = false } = options

  const el = useElement ? target : resolveElement(target)

  if (!el) {
    console.log("[v0] Fill input - element not found for target:", target)
    return { success: false, error: `Element not found: ${target}` }
  }

  if (el.disabled) {
    return { success: false, error: "Element is disabled" }
  }

  console.log("[v0] Filling input:", el.id || el.name || el.dataset?.action, "with value:", value)

  // Scroll to element if needed
  const rect = el.getBoundingClientRect()
  if (rect.top < 0 || rect.bottom > window.innerHeight) {
    await scrollToElement(el)
  }

  const cleanup = highlight ? highlightElement(el, "fill") : () => {}

  try {
    el.focus()

    if (clearFirst && "value" in el) {
      el.value = ""
      el.dispatchEvent(new Event("input", { bubbles: true }))
    }

    if (simulateTyping && value.length < 100) {
      for (const char of value) {
        el.value += char
        el.dispatchEvent(new Event("input", { bubbles: true }))
        await new Promise((r) => setTimeout(r, TYPING_DELAY + Math.random() * 20))
      }
    } else {
      el.value = value
      el.dispatchEvent(new Event("input", { bubbles: true }))
    }

    el.dispatchEvent(new Event("change", { bubbles: true }))

    setTimeout(cleanup, 1500)
    console.log("[v0] Fill input successful")
    return { success: true, element: target, value }
  } catch (error) {
    cleanup()
    console.error("[v0] Fill input error:", error)
    return { success: false, error: error.message }
  }
}

// Click element
export async function clickElement(target, options = {}) {
  const { highlight = true, waitAfter = 100 } = options

  const el = resolveElement(target)

  if (!el) {
    console.log("[v0] Click element - element not found for target:", target)
    return { success: false, error: `Element not found: ${target}` }
  }

  if (el.disabled) {
    return { success: false, error: "Element is disabled" }
  }

  console.log("[v0] Clicking element:", el.id || el.name || el.dataset?.action || el.textContent?.slice(0, 30))

  // Scroll to element if needed
  const rect = el.getBoundingClientRect()
  if (rect.top < 0 || rect.bottom > window.innerHeight) {
    await scrollToElement(el)
  }

  const cleanup = highlight ? highlightElement(el, "action") : () => {}

  try {
    el.focus()

    // Use only native click to prevent double-firing in React
    el.click()

    await new Promise((r) => setTimeout(r, waitAfter))
    setTimeout(cleanup, 1000)

    console.log("[v0] Click successful")
    return { success: true, element: target }
  } catch (error) {
    cleanup()
    console.error("[v0] Click error:", error)
    return { success: false, error: error.message }
  }
}

// Handle select/dropdown - specifically for Radix/shadcn Select components
export async function selectFromDropdown(target, value, options = {}) {
  const { highlight = true } = options

  console.log("[v0] Select from dropdown - target:", target, "value:", value)

  // First, find the trigger button
  const triggerEl = resolveElement(target)

  if (!triggerEl) {
    console.log("[v0] Select trigger not found for:", target)
    return { success: false, error: `Dropdown trigger not found: ${target}` }
  }

  // Scroll to element if needed
  const rect = triggerEl.getBoundingClientRect()
  if (rect.top < 0 || rect.bottom > window.innerHeight) {
    await scrollToElement(triggerEl)
  }

  const cleanup = highlight ? highlightElement(triggerEl, "action") : () => {}

  try {
    // Click to open the dropdown
    triggerEl.focus()
    triggerEl.click()

    console.log("[v0] Clicked dropdown trigger, waiting for content...")

    // Wait for dropdown content to appear (Radix renders in portal)
    await new Promise((r) => setTimeout(r, 200))

    // Find the option in the dropdown content
    const valueLower = value.toLowerCase().trim()

    // Look for options in Radix Select portal
    const optionSelectors = [
      `[role="option"]`,
      `[data-value="${value}"]`,
      `[data-value="${valueLower}"]`,
      `[data-action="role-${valueLower}"]`,
      `.select-item`,
    ]

    let foundOption = null

    for (const selector of optionSelectors) {
      const options = document.querySelectorAll(selector)
      for (const opt of options) {
        const optText = (opt.textContent || "").toLowerCase().trim()
        const optValue = (opt.getAttribute("data-value") || "").toLowerCase().trim()

        console.log("[v0] Checking option:", optText, optValue, "against:", valueLower)

        if (optText === valueLower || optValue === valueLower || optText.includes(valueLower)) {
          foundOption = opt
          break
        }
      }
      if (foundOption) break
    }

    if (foundOption) {
      console.log("[v0] Found option:", foundOption.textContent)
      highlightElement(foundOption, "action")

      // Click the option
      foundOption.click()

      await new Promise((r) => setTimeout(r, 100))
      setTimeout(cleanup, 1000)

      console.log("[v0] Select successful")
      return { success: true, element: target, value }
    }

    // If option not found, close dropdown and report error
    document.body.click()
    cleanup()

    console.log("[v0] Option not found:", value)
    return { success: false, error: `Option "${value}" not found in dropdown` }
  } catch (error) {
    cleanup()
    console.error("[v0] Select error:", error)
    return { success: false, error: error.message }
  }
}

// Focus element
export async function focusElement(target, options = {}) {
  const { highlight = true } = options

  const el = resolveElement(target)

  if (!el) {
    return { success: false, error: `Element not found: ${target}` }
  }

  await scrollToElement(el)
  const cleanup = highlight ? highlightElement(el, "focus") : () => {}

  el.focus()
  setTimeout(cleanup, 2000)

  return { success: true, element: target }
}

// Tab navigation
export async function tabNavigate(direction = "next") {
  const focusable = Array.from(
    document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
  ).filter((el) => !el.disabled && el.offsetParent !== null)

  const currentIndex = focusable.indexOf(document.activeElement)
  let nextIndex

  if (direction === "next") {
    nextIndex = currentIndex < focusable.length - 1 ? currentIndex + 1 : 0
  } else {
    nextIndex = currentIndex > 0 ? currentIndex - 1 : focusable.length - 1
  }

  const nextElement = focusable[nextIndex]
  if (nextElement) {
    await scrollToElement(nextElement)
    nextElement.focus()
    highlightElement(nextElement, "focus")
    return { success: true, element: nextElement.dataset?.action || nextElement.id }
  }

  return { success: false, error: "No focusable element found" }
}

// Toggle checkbox/switch
export async function toggleElement(target) {
  const el = resolveElement(target)

  if (!el) {
    return { success: false, error: `Element not found: ${target}` }
  }

  if (el.type === "checkbox" || el.type === "radio") {
    el.checked = !el.checked
    el.dispatchEvent(new Event("change", { bubbles: true }))
    return { success: true, checked: el.checked }
  }

  // For switch components
  el.click()
  return { success: true }
}

// Clear input
export async function clearInput(target) {
  const el = resolveElement(target)

  if (!el || !("value" in el)) {
    return { success: false, error: `Element not found or not clearable: ${target}` }
  }

  el.value = ""
  el.dispatchEvent(new Event("input", { bubbles: true }))
  el.dispatchEvent(new Event("change", { bubbles: true }))

  return { success: true, element: target }
}

// Read element content (for accessibility)
export function readElement(target) {
  const el = resolveElement(target)

  if (!el) {
    return { success: false, error: `Element not found: ${target}` }
  }

  const text =
    el.getAttribute("aria-label") || el.textContent?.trim() || el.value || el.placeholder || "No readable content"

  return { success: true, text, element: target }
}

// Go back/forward in history
export function navigateHistory(direction) {
  if (direction === "back") {
    window.history.back()
  } else {
    window.history.forward()
  }
  return { success: true, direction }
}

export default {
  scrollPage,
  scrollToPosition,
  scrollToElement,
  fillInput,
  clickElement,
  selectFromDropdown,
  focusElement,
  tabNavigate,
  toggleElement,
  clearInput,
  readElement,
  navigateHistory,
  highlightElement,
}



