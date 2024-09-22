import { keccak256 as lib_keccak256, toUtf8Bytes, AbiCoder } from 'ethers'

import { BETTOR_ICON_COLORS } from '@constants/bettorIcons'

import logger from '../logger'

export function keccak256(values, types) {

  try {
    return lib_keccak256(
      AbiCoder.defaultAbiCoder().encode(
        types,
        values
      )
    )
  } catch (ex) {
    logger.error(ex)
    return null
  }

}

export function replace(str, repls) {
  if (!Array.isArray(repls)) repls = []

  for (const repl of repls) {
    str = str.replace('%s', repl)
  }

  return str
}

export function toHex(str) {
  return `0x${Buffer.from(str, 'utf8').toString('hex')}`
}

export function subgraphKeccak256(value) {
  try {

    return lib_keccak256(toUtf8Bytes(JSON.stringify(value)))

  } catch (ex) {
    logger.error(ex)
    return null
  }
}

function reapeat(pattern, times) {
  const result = []
  let idx = 0
  while (idx++ < times) {
    result.push(pattern)
  }
  return result.join('')
}

export function hexHash(any, length = 8) {
  try {
    const str = JSON.stringify(any)
    const numhash = numericHash(str)
    const len = Number(reapeat('9', length))
    const shorthash = numhash % len
    const hexhash = shorthash.toString(16)
    return hexhash
  } catch (e) {
    logger.warn('Cannot hash', any)
    logger.warn('Because', e)
  }
}

export function numericHash(s) {
  let h = 0
  if (!s || !s.length) return h

  for (let i = 0; i < s.length; i++)
    h = Math.imul(31, h) + s.charCodeAt(i) | 0

  return Math.abs(h)
}

export function colorHash(name) {
  const hash = numericHash(name)
  const colorId = hash % BETTOR_ICON_COLORS.length
  return BETTOR_ICON_COLORS[colorId]
}
