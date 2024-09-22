import { isArray, isNumber, mapValues, toLower } from 'lodash'
import Big from 'big.js'
Big.PE = 1e+6

import { PRIZEFUNDS, PRICEFEED, ERC20, NATIVE } from '@constants'

const TEN = Big(10)
const ONE = Big(1)
const ZERO = Big(0)
const VIGORISH = Big(0.01)

export const MAX_INT_256 = '115792089237316195423570985008687907853269984665640564039457584007913129639935'

export function minmax(data) {
  if (!isArray(data)) return [0, 0]

  let [minimum] = data
  let [maximum] = data
  for (const item of data) {
    if (item < minimum) minimum = item
    if (item > maximum) maximum = item
  }
  return [minimum, maximum]
}

function __inNotZeroNumbers(...args) {
  for (let num of args) {
    if (!Number(num)) return false
  }
  return true
}

function __inNumbers(...args) {
  for (let num of args) {
    if (
      num === '' ||
      isNaN(Number(String(num))) ||
      !isNumber(Number(String(num)))
    ) return false
  }
  return true
}

function __futureReturn(prizefunds, wager) {
  if (!__inNotZeroNumbers(prizefunds?.[PRIZEFUNDS.TOTAL], wager)) return mapValues(prizefunds, () => ZERO)

  wager = Big(wager)
  prizefunds = mapValues(prizefunds, prizefund => Big(prizefund))

  const result = { }
  for (const position in prizefunds) {

    result[position] = wager.plus(prizefunds[PRIZEFUNDS.TOTAL])
      .times(
        wager.div(
          wager.plus(prizefunds[position])
        )
      )
      .times(
        ONE.minus(VIGORISH)
      )

  }

  return result
}

export function futureReturn(prizefunds, wager) {
  return mapValues(__futureReturn(prizefunds, wager), ret => ret.toString())
}

export function futureProfit(prizefunds, wager) {
  return mapValues(__futureReturn(prizefunds, wager), ret => ret.minus(wager).toString())
}

export function futureProfitPercent(prizefunds, wager) {
  if (!__inNotZeroNumbers(prizefunds?.[PRIZEFUNDS.TOTAL], wager)) return mapValues(prizefunds, () => ZERO.toString())

  wager = Big(wager)
  return mapValues(__futureReturn(prizefunds, wager), ret => ret.div(wager).minus(1).toString())
}


function __actualReturn(prizefunds, wager, position) {
  if (!__inNotZeroNumbers(prizefunds?.[PRIZEFUNDS.TOTAL], prizefunds?.[position], wager)) return ZERO

  wager = Big(wager)
  prizefunds = mapValues(prizefunds, prizefund => Big(prizefund))

  const result = prizefunds[PRIZEFUNDS.TOTAL]
    .times(
      wager.div(prizefunds[position])
    )
    .times(
      ONE.minus(VIGORISH)
    )

  return result
}

export function actualReturn(prizefunds, wager, position) {
  const result = __actualReturn(prizefunds, wager, position)
  return result.toString()
}

export function actualProfit(prizefunds, wager, position) {
  const result = __actualReturn(prizefunds, wager, position)

  return result.minus(wager).toString()
}

export function actualProfitPercent(prizefunds, wager, position) {
  if (!__inNotZeroNumbers(prizefunds?.[PRIZEFUNDS.TOTAL], wager, position)) return ZERO.toString()

  const result = __actualReturn(prizefunds, wager, position)

  wager = Big(wager)
  return result.div(wager).minus(1).toString()
}

export function futureDividends(round1, round2, wager, vigorish = 0.01) {
  if (!__inNumbers(round1, round2, wager, vigorish)) return 0

  round1 = Big(round1)
  round2 = Big(round2)
  wager = Big(wager)
  vigorish = Big(vigorish)

  if (round1.plus(wager).eq(0)) return 0
  if (round2.eq(0)) return wager
  const totalfund = round1.plus(round2)
  const result = totalfund.plus(wager).times(wager.div(round1.plus(wager)))
  const commision = result.times(vigorish)
  return result
    .minus(commision)
    .toString() || 0
}

export function dividends(round1, round2, wager, vigorish = 0.01) {
  if (!__inNumbers(round1, round2, wager, vigorish)) return 0

  round1 = Big(round1)
  round2 = Big(round2)
  wager = Big(wager)
  vigorish = Big(vigorish)

  if (round1.eq(0)) return 0
  if (round2.eq(0)) return wager
  const totalfund = round1.plus(round2)
  const result = totalfund.times(wager.div(round1))
  const commision = result.times(vigorish)
  return result
    .minus(commision)
    .toString() || 0
}

export function percent(wager, base, multiplicator = 1) {
  if (!__inNotZeroNumbers(wager, base, multiplicator)) return 0

  wager = Big(wager)
  base = Big(base)
  return wager
    .div(base)
    .times(multiplicator)
    .toString() || 0

}

export function profitPercent(wager, base, multiplicator = 1) {
  if (!__inNotZeroNumbers(wager, base, multiplicator)) return 0

  wager = Big(wager)
  base = Big(base)
  return wager
    .div(base)
    .times(multiplicator)
    .minus(multiplicator)
    .toString() || 0
}

export function add(number1, number2) {
  if (!__inNumbers(number1, number2)) return 0

  number1 = Big(number1)
  number2 = Big(number2)
  return number1
    .plus(number2)
    .toString() || 0
}

export function mul(number1, number2) {
  if (!__inNumbers(number1, number2)) return 0

  number1 = Big(number1)
  number2 = Big(number2)
  return number1
    .times(number2)
    .toString() || 0
}

export function sub(number1, number2) {
  if (!__inNumbers(number1, number2)) return 0

  number1 = Big(number1)
  number2 = Big(number2)
  return number1
    .minus(number2)
    .toString() || 0
}

export function div(number1, number2) {
  if (!__inNumbers(number1, number2)) return 0

  number1 = Big(number1)
  number2 = Big(number2)
  return number1
    .div(number2)
    .toString() || 0
}

export function gt(number1, number2) {
  if (!__inNumbers(number1, number2)) return undefined

  number1 = Big(number1)
  number2 = Big(number2)

  return number1.gt(number2)
}

export function gte(number1, number2) {
  if (!__inNumbers(number1, number2)) return undefined

  number1 = Big(number1)
  number2 = Big(number2)

  return number1.gte(number2)
}

export function eq(number1, number2) {
  if (!__inNumbers(number1, number2)) return undefined

  number1 = Big(number1)
  number2 = Big(number2)

  return number1.eq(number2)
}

export function lt(number1, number2) {
  if (!__inNumbers(number1, number2)) return undefined

  number1 = Big(number1)
  number2 = Big(number2)

  return number1.lt(number2)
}

export function lte(number1, number2) {
  if (!__inNumbers(number1, number2)) return undefined

  number1 = Big(number1)
  number2 = Big(number2)

  return number1.lte(number2)
}

export function min(number1, number2) {
  if (!__inNumbers(number1, number2)) return undefined

  number1 = Big(number1)
  number2 = Big(number2)

  const m = number1.gt(number2) ? number2 : number1

  return m.toString()

}

export function max(number1, number2) {
  if (!__inNumbers(number1, number2)) return undefined

  number1 = Big(number1)
  number2 = Big(number2)

  const m = number1.gt(number2) ? number1 : number2

  return m.toString()

}

export function toDecimalPricefeed(amount, pricefeed) {
  pricefeed = toLower(pricefeed)
  if (!amount) return amount
  if (!PRICEFEED.DECIMALS[pricefeed]) return amount

  return toDecimal(amount, PRICEFEED.DECIMALS[pricefeed])
}

export function toDecimalGas(amount) {
  if (!amount) return amount

  return toDecimal(amount, NATIVE.DECIMALS)
}

export function toDecimalERC20(amount, erc20) {
  erc20 = toLower(erc20)
  if (!amount) return amount
  if (!ERC20[erc20]) return amount

  return toDecimal(amount, ERC20.DECIMALS[ERC20[erc20]])
}

export function toDecimal(number, decimals) {
  if (!__inNumbers(number, decimals)) return undefined

  return Big(number)
    .div(TEN.pow(decimals))
    .toString()
}

export function fromDecimalPricefeed(amount, pricefeed) {
  pricefeed = toLower(pricefeed)
  if (!amount) return amount
  if (!PRICEFEED.DECIMALS[pricefeed]) return amount

  return fromDecimal(amount, PRICEFEED.DECIMALS[pricefeed])
}

export function fromDecimalERC20(amount, erc20) {
  erc20 = toLower(erc20)
  if (!amount) return amount
  if (!ERC20[erc20]) return amount

  return fromDecimal(amount, ERC20.DECIMALS[ERC20[erc20]])
}

export function fromDecimal(number, decimals) {
  if (!__inNumbers(number, decimals)) return undefined

  return Big(number)
    .times(TEN.pow(decimals))
    .toString()
}

export function isPositive(number) {
  if (!__inNumbers(number)) return undefined

  return Big(number).s === 1
}

export function isNegative(number) {
  if (!__inNumbers(number)) return undefined

  return Big(number).s === -1
}

export function round(number, dp, rm) {
  if (!__inNumbers(number)) return '0'

  number = Big(number)
  return number
    .round(dp, rm)
    .toString() || '0'
}

export function toEnumeration(startNumber, endNumber) {
  if (!__inNumbers(startNumber, endNumber)) return []

  const enumeration = []

  for (let num = Number(startNumber); num <= Number(endNumber); ++num) {
    enumeration.push(String(num))
  }

  return enumeration
}

export function roundERC20(amount, erc20) {
  if (!amount) return amount
  if (!ERC20[erc20]) return amount

  return Big(amount)
    .round(ERC20.DECIMALS[ERC20[erc20]], 0)
    .toString()
}
