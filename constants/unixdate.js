export const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000
export const INVALID_DATE = new Date(NaN)

export const UNIX_SECOND = 1
export const UNIX_MINUTE = 60
export const UNIX_HOUR = 60 * UNIX_MINUTE
export const UNIX_DAY = 24 * UNIX_HOUR
export const UNIX_WEEK = 7 * UNIX_DAY

export const SECONDS_IN = {
  weeks: UNIX_WEEK,
  days: UNIX_DAY,
  hours: UNIX_HOUR,
  minutes: UNIX_MINUTE,
  seconds: UNIX_SECOND,
}
