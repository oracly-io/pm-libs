import dotProp from 'dot-prop-immutable'
import { isObject } from 'lodash'

export function get(obj, path) {
  if (!isObject(obj)) obj = {}
  return dotProp.get(obj, path)
}

export function set(obj, path, value) {
  if (!isObject(obj)) obj = {}
  return dotProp.set(obj, path, value)
}

export function del(obj, path) {
  if (!isObject(obj)) obj = {}
  return dotProp.delete(obj, path)
}

export default { get, set, del }
