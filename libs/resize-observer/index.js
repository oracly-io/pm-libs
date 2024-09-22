import Resizer from 'resize-observer-polyfill'

export default function () {
  if (typeof window.ResizeObserver !== 'function') {
    window.ResizeObserver = Resizer
  }
}
