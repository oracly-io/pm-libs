import { isEmpty, isElement, pick, keys, merge } from 'lodash'

export function readSearchParams() {
  const script = document.currentScript
  if (!isElement(script) || isEmpty(script.src)) return {}

  const qs = new URL(script.src).searchParams
  const res = {}
  for (const [key, value] of qs) {
    res[key] = value
  }
  return res
}

export function applySearchParams(initial) {
  let srcargs = readSearchParams()
  srcargs = pick(srcargs, keys(initial))

  return merge(initial, srcargs)
}
