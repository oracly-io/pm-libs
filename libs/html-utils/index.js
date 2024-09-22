import { floor, join, isEmpty, toLower } from 'lodash'
import Big from 'big.js'

import config from '@config'

import { eq, gt, lt, mul } from '../calc-utils'
import { CurrencyFormatter } from './currency'

export function htmlPercentSigned(percent, precision = config.maximum_fraction_digits_precent) {
  let percentStr = htmlPercent(percent, precision)
  if (percent > 0) percentStr = '+' + percentStr
  return percentStr
}

export function htmlPercent(percent, precision = config.maximum_fraction_digits_precent) {
  return (floor(mul(percent, 100), precision) || 0) + '%'
}

export function htmlCurrentySymboled(amount, quote) {
  if (isNaN(+amount)) return ''

  return CurrencyFormatter.formatSymboled(amount, quote, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  })
}

export function htmlCurrencyNamed(amount, quote) {
  if (isNaN(+amount)) return ''

  return CurrencyFormatter.formatNamed(amount, quote, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  })
}

export function htmlCurrency(amount, maximumFractionDigits = config.maximum_fraction_digits) {
  if (isNaN(+amount)) return ''

  const HTML_LOWEST_AMOUNT = Math.pow(10, -(maximumFractionDigits))

  if (!eq(amount, 0) && lt(Big(amount).abs().toString(), HTML_LOWEST_AMOUNT)) {
    if (gt(amount, 0)) return `<${HTML_LOWEST_AMOUNT}`
    else return `<-${HTML_LOWEST_AMOUNT}`
  }

  return CurrencyFormatter.formatDefault(amount, {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  })
}

export function htmlAddress(address) {
  return toLower(address?.replace(/(0x.{3}).*(.{5})$/, '$1...$2'))
}

export function htmlCounter(counter, options) {
  let output = counter

  if (Number(counter) > Number(options?.max)) output = options.max + '+'

  return output
}

export function htmlAddressHref(address) {
  if (isEmpty(address)) return '#'

  return join([config.blockchain_explorer, 'address', address], '/')
}

export function htmlTransactionHref(hash) {
  if (isEmpty(hash)) return '#'

  return join([config.blockchain_explorer, 'tx', hash], '/')
}

export function htmlAmount(number) {
  const usformatter = Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' })
  return usformatter.format(number)
}

export function htmlTransaction(hash) {
  return toLower(hash?.replace(/(0x.{3}).*(.{5})$/, '$1...$2'))
}

export function htmlPricefeedRoundid(roundid) {
  return toLower(roundid?.replace(/^(.{5}).*(.{5})$/, '$1...$2'))
}
