const detectTouch = () => (
  window &&
  (
    'ontouchstart' in window ||
    (window.DocumentTouch && document instanceof window.DocumentTouch)
  )
)

const addTouchClass = () => {
    const cssclass = detectTouch() ? 'touch' : 'notouch'
    document.documentElement.classList.add(cssclass)
}

export { addTouchClass }
