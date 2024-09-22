import { replace, isPlainObject, isEmpty } from 'lodash'

import logger from '../logger'

const SYMBOLS = {
  'WETH': 'Ξ',
  'WBTC': '₿',
}

export class CurrencyFormatter {
  static #formatters = {}
  static DEFAULT = ''

  static formatSymboled(amount, currency, options) {
    const formatter = CurrencyFormatter.#get(currency, options)
    return formatter.formatSymboled(amount)
  }

  static formatUnsymboled(amount, currency, options) {
    const formatter = CurrencyFormatter.#get(currency, options)
    return formatter.formatUnsymboled(amount)
  }

  static formatNamed(amount, currency, options) {
    const formatter = CurrencyFormatter.#get(currency, options)
    return formatter.formatNamed(amount)
  }

  static formatDefault(amount, options) {
    const formatter = CurrencyFormatter.#get(CurrencyFormatter.DEFAULT, options)
    return formatter.formatUnsymboled(amount)
  }

  static #get(currency, options) {
    options = isPlainObject(options) ? options : {}
    const key = CurrencyFormatter.#key(currency, options)
    if (isEmpty(CurrencyFormatter.#formatters[key])) {
      CurrencyFormatter.#formatters[key] = CurrencyFormatter.#create(currency, options)
    }
    return CurrencyFormatter.#formatters[key]
  }

  static #key(currency, options) {
    return JSON.stringify({ currency, ...options })
  }

  static #create(currency, options) {
    try {
      return CurrencyFormatter.#createStandard(currency, options)
    } catch {
      return CurrencyFormatter.#createCustom(currency, options)
    }
  }

  static #createStandard(currency, options) {
    const fSymboled = new Intl.NumberFormat(Intl.Locale, {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
      ...options,
    })

    const fCoded = new Intl.NumberFormat(Intl.Locale, {
      style: 'currency',
      currency,
      currencyDisplay: 'code',
      ...options,
    })

    const formatter = {
      formatUnsymboled: (amount) => replace(fCoded.format(amount), new RegExp(`\s+${currency}\s+`), ''),
      formatSymboled: (amount) => fSymboled.format(amount),
      formatNamed: (amount) => fCoded.format(amount),
    }

    logger.info('Standard Currency Formatter Create: "%s"', currency)

    return formatter

  }

  static #createCustom(currency, options) {
    const fDefault = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'code',
      ...options,
    })

    const formatter = {
      formatUnsymboled: (amount) => replace(fDefault.format(amount), /\s*[$USD]+\s*/, ''),
      formatSymboled: (amount) => replace(fDefault.format(amount), /[$USD]+/, (SYMBOLS[currency] || '')),
      formatNamed: (amount) => replace(fDefault.format(amount), /[$USD]+/, (currency || '')),
    }

    logger.info('Custom Currency Formatter Create: "%s"', currency || 'DEFAULT')

    return formatter

  }

}

