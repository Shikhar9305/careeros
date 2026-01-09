// client/scripts/annotate-ui-check.js
(function check() {
  const actionable = Array.from(document.querySelectorAll("button, a, input, select, [role='button']"))
  const missing = actionable.filter(el => !el.dataset.action)
  if (missing.length === 0) {
    console.log("All actionable elements have data-action attributes. Good!")
    return
  }
  console.warn("Found actionable elements missing data-action (add data-action, data-intent, data-role):")
  missing.forEach((el, i) => {
    console.log(i+1, el.tagName, el.outerHTML.slice(0, 200))
  })
})()
