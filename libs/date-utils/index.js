import { format, formatDistanceStrict, intervalToDuration, differenceInSeconds } from 'date-fns'
import { es, enUS } from 'date-fns/locale'
import {
  isEmpty,
  isEqual,
  isFunction,
  isString,
  isInteger,
  isDate,
  isNumber,
  isPlainObject,
  values,
  head,
  pick,
} from 'lodash'
import { TimeCorrection } from '../time-correction'

import config from '@config'

import { MILLISECONDS_IN_DAY, INVALID_DATE, SECONDS_IN } from '@constants'

const LOCALES = {
  'en': enUS,
  'en-US': enUS,
  'es': es
}

let locale = LOCALES[config.default_locale]

export function setLocaleDateFns(newlocale) {
  if (newlocale !== locale.code && newlocale in LOCALES) {
    locale = LOCALES[newlocale]
  }
}

export function nowTS() {
  return Date.now() + (window.time_correction || 0)
}

export function toUnixTS(timestamp) {
  return parseInt(timestamp / 1000)
}

export function nowUnixTS() {
  return toUnixTS(nowTS())
}

export function formatDuration(
  duration,
  keys = ['days', 'hours', 'minutes', 'seconds'],
  delimiter = ':'
) {
  if (isEmpty(duration) || !isPlainObject(duration)) return ''

  const time = values(pick(duration, keys))
  const pritty = []
  for (let part of time) {
    if (pritty.length) pritty.push(part.toFixed().padStart(2, '0'))
    else if (part) pritty.push(part)
  }

  return pritty.join(delimiter) || '0'
}

export function durationToSeconds(
  duration,
  keys = ['days', 'hours', 'minutes', 'seconds'],
) {
  if (isEmpty(duration) || !isPlainObject(duration)) return ''

  duration = pick(duration, keys)
  let seconds = 0
  for (let name in duration) {
    seconds += duration[name] * (SECONDS_IN[name] || 0)
  }

  return seconds
}

export function difInSecondsUnixTS(
  dateLeft,
  dateRight = toUnixTS(nowTS())
) {
  dateLeft = dateLeft * 1000
  dateRight = dateRight * 1000
  return differenceInSeconds(dateLeft, dateRight)
}

export function durationUnixTS(
  datefrom,
  dateto = toUnixTS(nowTS()),
) {
  datefrom = datefrom * 1000
  dateto = dateto * 1000
  return duration(datefrom, dateto)
}

export function duration(
  datefrom,
  dateto = nowTS(),
) {

  const start = toDate(datefrom)
  const end = toDate(dateto)

  if (
    isEqual(start, INVALID_DATE) ||
    isEqual(end, INVALID_DATE)
  ) {
    return {}
  }

  return intervalToDuration({
    start,
    end,
  })
}

export function toLocalStringUnixTS(unixTS) {
  if (!unixTS) return null

  return (new Date(unixTS * 1000)).toLocaleString()
}

export function formatUnixTS(unixTS, pattern) {
  if (!unixTS) return null

  return format(unixTS * 1000, pattern)
}

export function formattedUnixTS(unixTS) {
  if (!unixTS) return null

  return formatted(unixTS * 1000)
}

// Returns timestamp with year if year is older then current
export function formatted(date) {
  return formatDate(date, d =>
    d.getFullYear() === (new Date(nowTS())).getFullYear()
      ? 'MMM dd, p'
      : 'MMM dd yyyy, p'
  )
}

export function formatDate(date, formatPattern) {
  // parameters validaton
  const isStringPatternInvalid = isEmpty(formatPattern) || !isString(formatPattern)
  const isFunctionPatternInvalid = !isFunction(formatPattern)
  const isPatternInvalid = isStringPatternInvalid && isFunctionPatternInvalid

  if (isPatternInvalid) return null

  const datetime = toDate(date)

  if (datetime === INVALID_DATE) return null
  if (isFunction(formatPattern)) formatPattern = formatPattern(datetime)

  return format(datetime, formatPattern, { locale })
}

export function formatDistanceUnixTS(
  datefrom,
  dateto = toUnixTS(nowTS()),
  options = {}
) {

  datefrom = datefrom * 1000
  dateto = dateto * 1000
  let distance = formatDistance(datefrom, dateto, options)

  if (options?.short) {
    const [value, units] = distance?.split(' ')
    distance = [value, head(units)].join(' ')
  }

  return distance
}

export function timeSinceUnixTS(
  datefrom,
  dateto = nowUnixTS(),
  options = { addSuffix: true }
) {
    return formatDistanceUnixTS(datefrom, dateto, options)
}

export function formatDistance(
  datefrom,
  dateto = nowTS(),
  options = {}
) {

  datefrom = toDate(datefrom)
  dateto = toDate(dateto)

  if (
    isEqual(datefrom, INVALID_DATE) ||
    isEqual(dateto, INVALID_DATE)
  ) {
    return ''
  }

  return formatDistanceStrict(datefrom, dateto, { ...options, locale })

}

export function toDate(date) {
  // parameters validaton
  if (
    !isDate(date) &&
    !isString(date) &&
    !isNumber(date)
  ) return INVALID_DATE

  const datetime = new Date(date)
  // validate datetime
  if (isNaN(datetime.getTime())) return INVALID_DATE

  return datetime
}

export function addDays(date, days) {
  // parameters validaton
  if (days < 0 || !isInteger(days)) return date

  const datetime = toDate(date)
  return new Date(datetime.getTime() + MILLISECONDS_IN_DAY * days)
}

export function daysBetween(date1, date2) {
  const datetime1 = toDate(date1)
  const datetime2 = toDate(date2)

  const timeDiff = datetime2.getTime() - datetime1.getTime()

  return Math.max(Math.floor(timeDiff / MILLISECONDS_IN_DAY), 0) || 0
}

export function getDateOfExpire(date, expireDays = 30) {
  const datetime = addDays(date, expireDays)
  return formatDate(datetime, 'MMMM d, yyyy')
}

export function init() {
  TimeCorrection.init(correction => window.time_correction = correction)
}
